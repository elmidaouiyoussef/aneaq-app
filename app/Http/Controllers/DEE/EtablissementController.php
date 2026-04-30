<?php

namespace App\Http\Controllers\DEE;

use App\Http\Controllers\Controller;
use App\Models\Etablissement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class EtablissementController extends Controller
{
    public function index()
    {
        $query = Etablissement::query()->select('etablissements.*');

        if ($this->hasTable('campagne_etablissements') && $this->hasColumn('campagne_etablissements', 'etablissement_id')) {
            $query->selectSub(
                DB::table('campagne_etablissements')
                    ->selectRaw('COUNT(*)')
                    ->whereColumn('campagne_etablissements.etablissement_id', 'etablissements.id'),
                'campagnes_count'
            );
        }

        if ($this->hasTable('dossiers') && $this->hasColumn('dossiers', 'etablissement_id')) {
            $query->selectSub(
                DB::table('dossiers')
                    ->selectRaw('COUNT(*)')
                    ->whereColumn('dossiers.etablissement_id', 'etablissements.id'),
                'dossiers_count'
            );
        }

        if ($this->hasColumn('etablissements', 'etablissement_2') && $this->hasColumn('etablissements', 'etablissement')) {
            $query->orderByRaw("COALESCE(NULLIF(etablissement_2, ''), etablissement) ASC");
        } elseif ($this->hasColumn('etablissements', 'nom')) {
            $query->orderBy('nom');
        } elseif ($this->hasColumn('etablissements', 'name')) {
            $query->orderBy('name');
        } else {
            $query->orderBy('id');
        }

        $etablissements = $query
            ->get()
            ->map(function ($etablissement) {
                $displayName = $this->modelValue($etablissement, [
                    'etablissement_2',
                    'etablissement',
                    'nom',
                    'name',
                    'intitule',
                    'acronyme',
                ], '—');

                return [
                    'id' => $etablissement->id,
                    'etablissement' => $this->modelValue($etablissement, ['etablissement'], '—'),
                    'etablissement_2' => $this->modelValue($etablissement, ['etablissement_2'], $displayName),
                    'display_name' => $displayName,
                    'ville' => $this->modelValue($etablissement, ['ville'], '—'),
                    'universite' => $this->modelValue($etablissement, ['universite', 'universite_nom'], '—'),
                    'email' => $this->modelValue($etablissement, ['email', 'mail'], '—'),
                    'campagnes_count' => (int) ($etablissement->campagnes_count ?? 0),
                    'dossiers_count' => (int) ($etablissement->dossiers_count ?? 0),
                ];
            })
            ->values();

        return Inertia::render('DEE/Etablissements/Index', [
            'etablissements' => $etablissements,
        ]);
    }

    public function show(Etablissement $etablissement)
    {
        $etablissementId = $etablissement->id;

        /*
        |--------------------------------------------------------------------------
        | 1. Rattachements de l’établissement aux vagues
        |--------------------------------------------------------------------------
        */

        $campagneEtablissements = collect();

        if ($this->hasTable('campagne_etablissements') && $this->hasColumn('campagne_etablissements', 'etablissement_id')) {
            $campagneEtablissements = DB::table('campagne_etablissements')
                ->where('etablissement_id', $etablissementId)
                ->orderByDesc($this->hasColumn('campagne_etablissements', 'created_at') ? 'created_at' : 'id')
                ->get();
        }

        $campagneColumn = null;

        if ($this->hasColumn('campagne_etablissements', 'campagne_evaluation_id')) {
            $campagneColumn = 'campagne_evaluation_id';
        } elseif ($this->hasColumn('campagne_etablissements', 'campagne_id')) {
            $campagneColumn = 'campagne_id';
        }

        $campagneIds = $campagneColumn
            ? $campagneEtablissements->pluck($campagneColumn)->filter()->unique()->values()
            : collect();

        $campagnes = collect();

        if ($this->hasTable('campagne_evaluations') && $campagneIds->isNotEmpty()) {
            $campagnes = DB::table('campagne_evaluations')
                ->whereIn('id', $campagneIds)
                ->get()
                ->keyBy('id');
        }

        $rattachementIds = $campagneEtablissements
            ->pluck('id')
            ->filter()
            ->unique()
            ->values();

        /*
        |--------------------------------------------------------------------------
        | 2. Dossiers liés à cet établissement
        |--------------------------------------------------------------------------
        */

        $dossiers = collect();

        if ($this->hasTable('dossiers')) {
            $hasEtablissementId = $this->hasColumn('dossiers', 'etablissement_id');
            $hasRattachementId = $this->hasColumn('dossiers', 'campagne_etablissement_id');

            if ($hasEtablissementId || ($hasRattachementId && $rattachementIds->isNotEmpty())) {
                $dossiersQuery = DB::table('dossiers');

                $dossiersQuery->where(function ($query) use ($etablissementId, $rattachementIds, $hasEtablissementId, $hasRattachementId) {
                    if ($hasEtablissementId) {
                        $query->where('etablissement_id', $etablissementId);
                    }

                    if ($hasRattachementId && $rattachementIds->isNotEmpty()) {
                        $query->orWhereIn('campagne_etablissement_id', $rattachementIds);
                    }
                });

                $dossiers = $dossiersQuery
                    ->orderByDesc($this->hasColumn('dossiers', 'created_at') ? 'created_at' : 'id')
                    ->get();
            }
        }

        $dossierIds = $dossiers
            ->pluck('id')
            ->filter()
            ->unique()
            ->values();

        /*
        |--------------------------------------------------------------------------
        | 3. Documents liés aux dossiers
        |--------------------------------------------------------------------------
        */

        $documents = collect();
        $documentTable = null;

        foreach (['dossier_documents', 'documents'] as $table) {
            if ($this->hasTable($table) && $this->hasColumn($table, 'dossier_id')) {
                $documentTable = $table;
                break;
            }
        }

        if ($documentTable && $dossierIds->isNotEmpty()) {
            $documents = DB::table($documentTable)
                ->whereIn('dossier_id', $dossierIds)
                ->orderByDesc($this->hasColumn($documentTable, 'created_at') ? 'created_at' : 'id')
                ->get();
        }

        /*
        |--------------------------------------------------------------------------
        | 4. Experts liés aux dossiers
        |--------------------------------------------------------------------------
        */

        $dossierExperts = collect();

        if ($this->hasTable('dossier_experts') && $dossierIds->isNotEmpty()) {
            $dossierExperts = DB::table('dossier_experts')
                ->whereIn('dossier_id', $dossierIds)
                ->orderByDesc($this->hasColumn('dossier_experts', 'created_at') ? 'created_at' : 'id')
                ->get();
        }

        $expertIds = $dossierExperts
            ->pluck('expert_id')
            ->filter()
            ->unique()
            ->values();

        $expertsById = collect();

        if ($this->hasTable('experts') && $expertIds->isNotEmpty()) {
            $expertsById = DB::table('experts')
                ->whereIn('id', $expertIds)
                ->get()
                ->keyBy('id');
        }

        /*
        |--------------------------------------------------------------------------
        | 5. Payload vagues
        |--------------------------------------------------------------------------
        */

        $campagnesPayload = $campagneEtablissements
            ->map(function ($item) use ($campagnes, $campagneColumn) {
                $campagneId = $campagneColumn ? ($item->{$campagneColumn} ?? null) : null;
                $campagne = $campagneId ? $campagnes->get($campagneId) : null;

                return [
                    'id' => $item->id,
                    'campagne_id' => $campagneId,
                    'reference' => $this->rowValue($campagne, ['reference'], '—'),
                    'annee' => $this->rowValue($campagne, ['annee'], '—'),
                    'vocation' => $this->rowValue($campagne, ['vocation'], '—'),
                    'statut' => $this->rowValue($item, ['statut', 'status'], '—'),
                    'created_at' => $this->formatDate($this->rowValue($item, ['created_at'], null)),
                    'sort_date' => $this->rowValue($item, ['created_at'], null),
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | 6. Payload dossiers
        |--------------------------------------------------------------------------
        */

        $dossiersPayload = $dossiers
            ->map(function ($dossier) {
                return [
                    'id' => $dossier->id,
                    'reference' => $this->rowValue($dossier, ['reference'], '—'),
                    'nom' => $this->rowValue($dossier, ['nom', 'name'], '—'),
                    'statut' => $this->rowValue($dossier, ['statut', 'status'], '—'),
                    'date_visite' => $this->rowValue($dossier, ['date_visite'], null),
                    'created_at' => $this->formatDate($this->rowValue($dossier, ['created_at'], null)),
                    'sort_date' => $this->rowValue($dossier, ['created_at'], null),
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | 7. Payload documents
        |--------------------------------------------------------------------------
        */

        $documentsPayload = $documents
            ->map(function ($document) use ($dossiers) {
                $dossier = $dossiers->firstWhere('id', $document->dossier_id);

                return [
                    'id' => $document->id,
                    'dossier_id' => $document->dossier_id,
                    'dossier_reference' => $this->rowValue($dossier, ['reference'], '—'),
                    'nom' => $this->rowValue($document, ['nom', 'name', 'titre', 'filename', 'file_name', 'original_name'], 'Document'),
                    'type' => $this->rowValue($document, ['type', 'document_type', 'categorie'], '—'),
                    'created_at' => $this->formatDate($this->rowValue($document, ['created_at'], null)),
                    'sort_date' => $this->rowValue($document, ['created_at'], null),
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | 8. Payload experts
        |--------------------------------------------------------------------------
        */

        $expertsPayload = $dossierExperts
            ->map(function ($item) use ($expertsById, $dossiers) {
                $expert = $expertsById->get($item->expert_id);
                $dossier = $dossiers->firstWhere('id', $item->dossier_id);

                $expertName = trim(
                    $this->rowValue($expert, ['prenom'], '') . ' ' . $this->rowValue($expert, ['nom'], '')
                );

                if ($expertName === '') {
                    $expertName = $this->rowValue($expert, ['name', 'nom'], 'Expert');
                }

                return [
                    'id' => $item->id,
                    'dossier_id' => $item->dossier_id,
                    'dossier_reference' => $this->rowValue($dossier, ['reference'], '—'),
                    'expert_id' => $item->expert_id,
                    'expert_name' => $expertName,
                    'email' => $this->rowValue($expert, ['email'], '—'),
                    'role' => $this->rowValue($item, ['role_expert', 'role'], 'expert'),
                    'status' => $this->rowValue($item, ['status', 'statut'], '—'),
                    'created_at' => $this->formatDate($this->rowValue($item, ['created_at'], null)),
                    'sort_date' => $this->rowValue($item, ['created_at'], null),
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | 9. Timeline globale
        |--------------------------------------------------------------------------
        */

        $timeline = collect();

        foreach ($campagnesPayload as $item) {
            $timeline->push([
                'type' => 'campagne',
                'title' => 'Rattachement à une vague',
                'description' => 'Vague '.$item['reference'].' - Statut : '.$item['statut'],
                'date' => $item['created_at'],
                'sort_date' => $item['sort_date'],
                'url' => $item['campagne_id'] ? '/dee/campagnes/'.$item['campagne_id'] : null,
            ]);
        }

        foreach ($dossiersPayload as $item) {
            $timeline->push([
                'type' => 'dossier',
                'title' => 'Dossier créé',
                'description' => 'Dossier '.$item['reference'].' - Statut : '.$item['statut'],
                'date' => $item['created_at'],
                'sort_date' => $item['sort_date'],
                'url' => '/dee/dossiers/'.$item['id'],
            ]);
        }

        foreach ($documentsPayload as $item) {
            $timeline->push([
                'type' => 'document',
                'title' => 'Document déposé',
                'description' => $item['nom'].' - Dossier '.$item['dossier_reference'],
                'date' => $item['created_at'],
                'sort_date' => $item['sort_date'],
                'url' => $item['dossier_id'] ? '/dee/dossiers/'.$item['dossier_id'] : null,
            ]);
        }

        foreach ($expertsPayload as $item) {
            $timeline->push([
                'type' => 'expert',
                'title' => 'Expert affecté',
                'description' => $item['expert_name'].' - Dossier '.$item['dossier_reference'].' - Statut : '.$item['status'],
                'date' => $item['created_at'],
                'sort_date' => $item['sort_date'],
                'url' => $item['dossier_id'] ? '/dee/dossiers/'.$item['dossier_id'] : null,
            ]);
        }

        $timeline = $timeline
            ->sortByDesc(function ($item) {
                return strtotime((string) ($item['sort_date'] ?? '')) ?: 0;
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | 10. Réponse Inertia
        |--------------------------------------------------------------------------
        */

        return Inertia::render('DEE/Etablissements/Show', [
            'etablissement' => [
                'id' => $etablissement->id,
                'nom' => $this->modelValue($etablissement, [
                    'etablissement_2',
                    'etablissement',
                    'nom',
                    'name',
                    'intitule',
                    'acronyme',
                ], '—'),
                'ville' => $this->modelValue($etablissement, ['ville'], '—'),
                'universite' => $this->modelValue($etablissement, ['universite', 'universite_nom'], '—'),
                'email' => $this->modelValue($etablissement, ['email', 'mail'], '—'),
                'type' => $this->modelValue($etablissement, [
                    'type',
                    'vocation',
                    'domaine_connaissances',
                    'evaluation',
                    'etablissement',
                ], '—'),
                'created_at' => $this->formatDate($this->modelValue($etablissement, ['created_at'], null)),
            ],
            'stats' => [
                'campagnes' => $campagnesPayload->count(),
                'dossiers' => $dossiersPayload->count(),
                'documents' => $documentsPayload->count(),
                'experts' => $expertsPayload->count(),
                'activites' => $timeline->count(),
            ],
            'campagnes' => $campagnesPayload,
            'dossiers' => $dossiersPayload,
            'documents' => $documentsPayload,
            'experts' => $expertsPayload,
            'timeline' => $timeline,
        ]);
    }

    public function update(Request $request, Etablissement $etablissement)
    {
        $validated = $request->validate([
            'etablissement' => ['nullable', 'string', 'max:255'],
            'etablissement_2' => ['required', 'string', 'max:255'],
            'ville' => ['nullable', 'string', 'max:255'],
            'universite' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);

        if (empty($validated['etablissement'])) {
            $validated['etablissement'] = $validated['etablissement_2'];
        }

        $payload = [];

        foreach ($validated as $column => $value) {
            if ($this->hasColumn('etablissements', $column)) {
                $payload[$column] = $value;
            }
        }

        $etablissement->update($payload);

        return back()->with('success', 'Établissement modifié avec succès.');
    }

    public function destroy(Etablissement $etablissement)
    {
        $campagnesCount = 0;

        if ($this->hasTable('campagne_etablissements') && $this->hasColumn('campagne_etablissements', 'etablissement_id')) {
            $campagnesCount = DB::table('campagne_etablissements')
                ->where('etablissement_id', $etablissement->id)
                ->count();
        }

        $dossiersCount = 0;

        if ($this->hasTable('dossiers') && $this->hasColumn('dossiers', 'etablissement_id')) {
            $dossiersCount = DB::table('dossiers')
                ->where('etablissement_id', $etablissement->id)
                ->count();
        }

        if ($campagnesCount > 0 || $dossiersCount > 0) {
            return back()->with(
                'error',
                "Suppression impossible : cet établissement est encore lié à {$campagnesCount} campagne(s) ou {$dossiersCount} dossier(s)."
            );
        }

        $etablissement->delete();

        return back()->with('success', 'Établissement supprimé avec succès.');
    }

    private function rowValue($row, array $columns, mixed $default = '—'): mixed
    {
        if (!$row) {
            return $default;
        }

        $data = (array) $row;

        foreach ($columns as $column) {
            if (array_key_exists($column, $data) && $data[$column] !== null && $data[$column] !== '') {
                return $data[$column];
            }
        }

        return $default;
    }

    private function modelValue($model, array $columns, mixed $default = '—'): mixed
    {
        if (!$model) {
            return $default;
        }

        foreach ($columns as $column) {
            try {
                $value = $model->getAttribute($column);

                if ($value !== null && $value !== '') {
                    return $value;
                }
            } catch (\Throwable $e) {
                continue;
            }
        }

        return $default;
    }

    private function formatDate($value): ?string
    {
        if (!$value) {
            return null;
        }

        try {
            return \Carbon\Carbon::parse($value)->format('d/m/Y H:i');
        } catch (\Throwable $e) {
            return (string) $value;
        }
    }

    private function hasTable(string $table): bool
    {
        static $cache = [];

        if (!array_key_exists($table, $cache)) {
            $cache[$table] = Schema::hasTable($table);
        }

        return $cache[$table];
    }

    private function hasColumn(string $table, string $column): bool
    {
        static $cache = [];

        $key = $table.'.'.$column;

        if (!array_key_exists($key, $cache)) {
            $cache[$key] = Schema::hasTable($table) && Schema::hasColumn($table, $column);
        }

        return $cache[$key];
    }
}