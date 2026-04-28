<?php

namespace App\Http\Controllers;

use App\Models\CampagneEvaluation;
use App\Models\Dossier;
use App\Models\DossierExpert;
use App\Models\Etablissement;
use App\Models\Expert;
use App\Models\User;
use App\Services\DossierStatusService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DossierController extends Controller
{
    public function index(Request $request)
    {
        $search = trim($request->string('search')->toString());

        $query = Dossier::query();

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $columns = $this->dossierColumns();

                foreach (['reference', 'nom', 'statut', 'campagne', 'campagne_reference'] as $column) {
                    if (in_array($column, $columns, true)) {
                        $q->orWhere($column, 'like', "%{$search}%");
                    }
                }
            });
        }

        $this->orderLatest($query, (new Dossier())->getTable());

        $dossiers = $query
            ->get()
            ->map(fn (Dossier $dossier) => $this->dossierPayload($dossier))
            ->values();

        $stats = [
            'dossiers' => Dossier::count(),
            'visites_planifiees' => $this->hasDossierColumn('date_visite')
                ? Dossier::whereNotNull('date_visite')->count()
                : 0,
            'documents' => $this->documentsTotalCount(),
            'experts_affectes' => Schema::hasTable('dossier_experts')
                ? DossierExpert::count()
                : 0,
        ];

        return Inertia::render('Dossiers/Index', [
            'dossiers' => $dossiers,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function show(Dossier $dossier)
    {
        return Inertia::render('Dossiers/Show', [
            'dossier' => $this->dossierPayload($dossier),
            'experts' => $this->availableExpertsPayload(),
            'dossierExperts' => $this->dossierExpertsPayload($dossier),
            'documents' => $this->documentsPayload($dossier),
        ]);
    }

    public function update(Request $request, Dossier $dossier)
    {
        $validated = $request->validate([
            'description' => ['sometimes', 'nullable', 'string'],
            'observation' => ['sometimes', 'nullable', 'string'],
            'date_visite' => ['sometimes', 'nullable', 'date'],
        ]);

        $hasChanges = false;

        if ($request->has('description') && $this->hasDossierColumn('description')) {
            $dossier->description = $validated['description'] ?? null;
            $hasChanges = true;
        }

        if ($request->has('observation') && $this->hasDossierColumn('observation')) {
            $dossier->observation = $validated['observation'] ?? null;
            $hasChanges = true;
        }

        if ($request->has('date_visite') && $this->hasDossierColumn('date_visite')) {
            $dossier->date_visite = $validated['date_visite'] ?? null;
            $hasChanges = true;
        }

        if ($hasChanges) {
            $dossier->save();
        }

        if ($request->has('date_visite')) {
            DossierStatusService::refresh($dossier->fresh());
        }

        return back()->with('success', 'Dossier mis à jour avec succès.');
    }

    public function destroy(Dossier $dossier)
    {
        DB::transaction(function () use ($dossier) {
            if (Schema::hasTable('dossier_experts')) {
                DossierExpert::where('dossier_id', $dossier->id)->delete();
            }

            $this->deleteDossierDocuments($dossier);

            $dossier->delete();
        });

        return redirect()
            ->route('dossiers.index')
            ->with('success', 'Dossier supprimé avec succès.');
    }

    private function dossierPayload(Dossier $dossier): array
    {
        $campagneId = $this->value($dossier, [
            'campagne_evaluation_id',
            'campagne_id',
        ]);

        $campagneReference = $this->value($dossier, [
            'campagne',
            'campagne_reference',
        ]);

        if (!$campagneReference && $campagneId) {
            $campagneReference = CampagneEvaluation::query()
                ->where('id', $campagneId)
                ->value('reference');
        }

        $etablissement = $this->etablissementPayload($dossier);

        return [
            'id' => $dossier->id,

            'reference' => $this->value($dossier, ['reference'], '—'),
            'nom' => $this->value($dossier, ['nom', 'name', 'titre'], $this->value($dossier, ['reference'], 'Dossier')),

            'campagne_id' => $campagneId,
            'campagne' => $campagneReference ?: '—',
            'campagne_reference' => $campagneReference ?: '—',

            'statut' => $this->value($dossier, ['statut', 'status'], 'Établissement sélectionné'),

            'description' => $this->value($dossier, ['description'], ''),
            'observation' => $this->value($dossier, ['observation', 'observations'], ''),

            'date_visite' => $this->formatDateDisplay($this->value($dossier, ['date_visite'])),
            'date_visite_value' => $this->formatDateInput($this->value($dossier, ['date_visite'])),

            'created_by' => $this->creatorName($dossier),
            'created_by_name' => $this->creatorName($dossier),

            'created_at' => $this->formatDateDisplay($dossier->created_at),
            'updated_at' => $this->formatDateDisplay($dossier->updated_at),

            'etablissement' => $etablissement,

            'etablissement_id' => $etablissement['id'] ?? null,
            'etablissement_nom' => $etablissement['nom'] ?? '—',
            'ville' => $etablissement['ville'] ?? '—',
            'universite' => $etablissement['universite'] ?? '—',
            'email' => $etablissement['email'] ?? '—',
        ];
    }

    private function availableExpertsPayload()
    {
        if (!Schema::hasTable((new Expert())->getTable())) {
            return collect();
        }

        $query = Expert::query();
        $this->orderExperts($query);

        return $query
            ->get()
            ->map(function (Expert $expert) {
                $prenom = $this->value($expert, ['prenom', 'first_name'], '');
                $nom = $this->value($expert, ['nom', 'last_name', 'name'], '');

                $fullName = trim($prenom . ' ' . $nom);

                if ($fullName === '') {
                    $fullName = $this->value($expert, ['name', 'nom'], 'Expert');
                }

                return [
                    'id' => $expert->id,
                    'prenom' => $prenom,
                    'nom' => $nom,
                    'name' => $fullName,
                    'email' => $this->value($expert, ['email'], ''),
                    'ville' => $this->value($expert, ['ville', 'city'], ''),
                    'specialite' => $this->value($expert, ['specialite', 'specialité', 'domaine', 'discipline'], ''),
                    'etablissement' => $this->value($expert, ['etablissement', 'etablissement_nom', 'institution'], ''),
                ];
            })
            ->values();
    }

    private function dossierExpertsPayload(Dossier $dossier)
    {
        if (!Schema::hasTable('dossier_experts')) {
            return collect();
        }

        $query = DossierExpert::query()
            ->where('dossier_id', $dossier->id);

        $this->orderLatest($query, 'dossier_experts');

        $items = $query->get();

        $expertIds = $items
            ->pluck('expert_id')
            ->filter()
            ->unique()
            ->values();

        $expertsById = Expert::query()
            ->whereIn('id', $expertIds)
            ->get()
            ->keyBy('id');

        return $items
            ->map(function ($item) use ($expertsById) {
                $expert = $expertsById->get($item->expert_id);

                return [
                    'id' => $item->id,
                    'dossier_id' => $item->dossier_id,
                    'expert_id' => $item->expert_id,
                    'role_expert' => $this->value($item, ['role_expert'], 'expert'),
                    'status' => $this->value($item, ['status'], 'en_attente_confirmation_dee'),
                    'access_sent_at' => $this->formatDateDisplay($this->value($item, ['access_sent_at'])),
                    'dee_confirmed_at' => $this->formatDateDisplay($this->value($item, ['dee_confirmed_at'])),
                    'expert_confirmed_at' => $this->formatDateDisplay($this->value($item, ['expert_confirmed_at'])),

                    'expert' => $expert ? [
                        'id' => $expert->id,
                        'prenom' => $this->value($expert, ['prenom', 'first_name'], ''),
                        'nom' => $this->value($expert, ['nom', 'last_name', 'name'], ''),
                        'name' => trim(
                            $this->value($expert, ['prenom', 'first_name'], '') . ' ' .
                            $this->value($expert, ['nom', 'last_name', 'name'], '')
                        ) ?: $this->value($expert, ['name', 'nom'], 'Expert'),
                        'email' => $this->value($expert, ['email'], ''),
                        'ville' => $this->value($expert, ['ville', 'city'], ''),
                        'specialite' => $this->value($expert, ['specialite', 'specialité', 'domaine', 'discipline'], ''),
                        'etablissement' => $this->value($expert, ['etablissement', 'etablissement_nom', 'institution'], ''),
                    ] : null,
                ];
            })
            ->values();
    }

    private function documentsPayload(Dossier $dossier)
    {
        $documentClass = '\\App\\Models\\DossierDocument';

        if (!class_exists($documentClass)) {
            return collect();
        }

        $documentModel = new $documentClass();
        $table = $documentModel->getTable();

        if (!Schema::hasTable($table) || !Schema::hasColumn($table, 'dossier_id')) {
            return collect();
        }

        $query = $documentClass::query()
            ->where('dossier_id', $dossier->id);

        $this->orderLatest($query, $table);

        return $query
            ->get()
            ->map(function ($document) {
                $path = $this->value($document, [
                    'path',
                    'file_path',
                    'fichier',
                    'document_path',
                    'url',
                ]);

                $url = $this->value($document, ['url'], null);

                if (!$url && $path) {
                    $url = Storage::url($path);
                }

                return [
                    'id' => $document->id,
                    'nom' => $this->value($document, ['nom', 'name', 'filename', 'original_name'], 'Document'),
                    'name' => $this->value($document, ['nom', 'name', 'filename', 'original_name'], 'Document'),
                    'filename' => $this->value($document, ['filename', 'original_name', 'nom', 'name'], 'Document'),
                    'type' => $this->value($document, ['type', 'document_type', 'categorie', 'category'], 'Document'),
                    'document_type' => $this->value($document, ['document_type', 'type', 'categorie', 'category'], 'Document'),
                    'url' => $url,
                    'created_at' => $this->formatDateDisplay($this->value($document, ['created_at'])),
                ];
            })
            ->values();
    }

    private function deleteDossierDocuments(Dossier $dossier): void
    {
        $documentClass = '\\App\\Models\\DossierDocument';

        if (!class_exists($documentClass)) {
            return;
        }

        $documentModel = new $documentClass();
        $table = $documentModel->getTable();

        if (!Schema::hasTable($table) || !Schema::hasColumn($table, 'dossier_id')) {
            return;
        }

        $documentClass::query()
            ->where('dossier_id', $dossier->id)
            ->delete();
    }

    private function etablissementPayload(Dossier $dossier): array
    {
        $etablissementId = $this->value($dossier, [
            'etablissement_id',
            'institution_id',
        ]);

        $etablissement = null;

        if ($etablissementId && Schema::hasTable((new Etablissement())->getTable())) {
            $etablissement = Etablissement::query()->find($etablissementId);
        }

        if ($etablissement) {
            return [
                'id' => $etablissement->id,
                'nom' => $this->value($etablissement, [
                    'nom',
                    'name',
                    'etablissement',
                    'etablissement_2',
                    'intitule',
                ], '—'),
                'type' => $this->value($etablissement, [
                    'type',
                    'type_etablissement',
                    'categorie',
                ], '—'),
                'ville' => $this->value($etablissement, [
                    'ville',
                    'city',
                ], '—'),
                'universite' => $this->value($etablissement, [
                    'universite',
                    'universite_nom',
                    'université',
                    'university',
                ], '—'),
                'email' => $this->value($etablissement, [
                    'email',
                    'mail',
                ], '—'),
            ];
        }

        return [
            'id' => $etablissementId,
            'nom' => $this->value($dossier, [
                'etablissement_nom',
                'etablissement',
                'nom_etablissement',
            ], '—'),
            'type' => $this->value($dossier, [
                'type_etablissement',
                'type',
            ], '—'),
            'ville' => $this->value($dossier, [
                'ville',
                'city',
            ], '—'),
            'universite' => $this->value($dossier, [
                'universite',
                'universite_nom',
                'université',
            ], '—'),
            'email' => $this->value($dossier, [
                'email',
                'email_etablissement',
            ], '—'),
        ];
    }

    private function creatorName(Dossier $dossier): string
    {
        $directName = $this->value($dossier, [
            'created_by_name',
            'creator_name',
        ]);

        if ($directName) {
            return $directName;
        }

        $createdBy = $this->value($dossier, ['created_by']);

        if ($createdBy) {
            return User::query()
                ->where('id', $createdBy)
                ->value('name') ?? '—';
        }

        return '—';
    }

    private function documentsTotalCount(): int
    {
        $documentClass = '\\App\\Models\\DossierDocument';

        if (!class_exists($documentClass)) {
            return 0;
        }

        $documentModel = new $documentClass();
        $table = $documentModel->getTable();

        if (!Schema::hasTable($table)) {
            return 0;
        }

        return $documentClass::query()->count();
    }

    private function value($model, array $keys, $default = null)
    {
        foreach ($keys as $key) {
            $value = $model?->getAttribute($key);

            if ($value !== null && $value !== '') {
                return $value;
            }
        }

        return $default;
    }

    private function dossierColumns(): array
    {
        return Schema::hasTable((new Dossier())->getTable())
            ? Schema::getColumnListing((new Dossier())->getTable())
            : [];
    }

    private function hasDossierColumn(string $column): bool
    {
        return Schema::hasColumn((new Dossier())->getTable(), $column);
    }

    private function orderLatest($query, string $table): void
    {
        if (Schema::hasColumn($table, 'created_at')) {
            $query->orderByDesc('created_at');
            return;
        }

        if (Schema::hasColumn($table, 'id')) {
            $query->orderByDesc('id');
        }
    }

    private function orderExperts($query): void
    {
        $table = (new Expert())->getTable();

        foreach (['nom', 'name', 'email', 'id'] as $column) {
            if (Schema::hasColumn($table, $column)) {
                $column === 'id'
                    ? $query->orderByDesc($column)
                    : $query->orderBy($column);

                return;
            }
        }
    }

    private function formatDateDisplay($date): ?string
    {
        if (!$date) {
            return null;
        }

        try {
            return Carbon::parse($date)->format('d/m/Y H:i');
        } catch (\Throwable $e) {
            return (string) $date;
        }
    }

    private function formatDateInput($date): ?string
    {
        if (!$date) {
            return null;
        }

        try {
            return Carbon::parse($date)->format('Y-m-d\TH:i');
        } catch (\Throwable $e) {
            return null;
        }
    }
}