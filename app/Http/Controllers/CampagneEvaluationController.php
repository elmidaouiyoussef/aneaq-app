<?php

namespace App\Http\Controllers;

use App\Models\CampagneEvaluation;
use App\Models\CampagneEtablissement;
use App\Models\Dossier;
use App\Models\Etablissement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class CampagneEvaluationController extends Controller
{
    public function index(Request $request)
    {
        $statut = $request->string('statut')->toString();

        $campagnes = CampagneEvaluation::query()
            ->with(['creator:id,name'])
            ->withCount(['campagneEtablissements', 'dossiers'])
            ->when(
                in_array($statut, ['brouillon', 'active', 'cloturee'], true),
                fn ($query) => $query->where('statut', $statut)
            )
            ->latest()
            ->get()
            ->map(function (CampagneEvaluation $campagne) {
                return [
                    'id' => $campagne->id,
                    'reference' => $campagne->reference,
                    'annee' => $campagne->annee,
                    'vocation' => $campagne->vocation,
                    'observation' => $campagne->observation,
                    'statut' => $campagne->statut,
                    'created_by' => $campagne->created_by,
                    'created_by_name' => $campagne->created_by_name ?: $campagne->creator?->name,
                    'created_at' => optional($campagne->created_at)?->format('d/m/Y H:i'),
                    'updated_at' => optional($campagne->updated_at)?->format('d/m/Y H:i'),
                    'etablissements_count' => $campagne->campagne_etablissements_count,
                    'dossiers_count' => $campagne->dossiers_count,
                ];
            })
            ->values();

        return Inertia::render('Campagnes/Index', [
            'campagnes' => $campagnes,
            'filters' => [
                'statut' => $statut,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Campagnes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'annee' => ['required', 'digits:4'],
            'vocation' => ['required', 'string', 'max:255'],
            'observation' => ['nullable', 'string'],
        ]);

        $nextId = ((int) CampagneEvaluation::max('id')) + 1;

        $reference = 'VAG-' . $validated['annee'] . '-' . str_pad(
            (string) $nextId,
            3,
            '0',
            STR_PAD_LEFT
        );

        $campagne = CampagneEvaluation::create([
            'reference' => $reference,
            'annee' => $validated['annee'],
            'vocation' => $validated['vocation'],
            'observation' => $validated['observation'] ?? null,
            'statut' => 'brouillon',
            'created_by' => Auth::id(),
            'created_by_name' => Auth::user()?->name,
        ]);

        return redirect()
            ->route('campagnes.show', $campagne)
            ->with('success', 'Vague créée avec succès.');
    }

    public function show(CampagneEvaluation $campagneEvaluation)
    {
        $creatorName = '—';

        if ($campagneEvaluation->created_by) {
            $creatorName = User::query()
                ->where('id', $campagneEvaluation->created_by)
                ->value('name') ?? '—';
        }

        $campagneEtablissements = CampagneEtablissement::query()
            ->with(['etablissement', 'dossier'])
            ->where('campagne_evaluation_id', $campagneEvaluation->id)
            ->latest()
            ->get();

        $etablissements = $campagneEtablissements
            ->map(function ($item) {
                $etablissement = $item->etablissement;
                $dossier = $item->dossier;

                return [
                    'id' => $item->id,
                    'etablissement_id' => $item->etablissement_id,
                    'statut' => $this->modelValue($item, ['statut', 'status'], 'en_attente_confirmation_dee'),
                    'email' => $this->modelValue($item, ['email'], $this->modelValue($etablissement, ['email', 'mail'], '')),
                    'access_sent_at' => $this->formatDate($this->modelValue($item, ['access_sent_at'])),

                    'etablissement' => [
                        'id' => $etablissement?->id,
                        'nom' => $this->etablissementName($etablissement),
                        'type' => $this->modelValue($etablissement, ['type', 'type_etablissement', 'categorie'], '—'),
                        'ville' => $this->modelValue($etablissement, ['ville', 'city'], '—'),
                        'universite' => $this->modelValue($etablissement, ['universite', 'universite_nom', 'université', 'university'], '—'),
                        'email' => $this->modelValue($etablissement, ['email', 'mail'], ''),
                    ],

                    'dossier' => $dossier ? [
                        'id' => $dossier->id,
                        'reference' => $this->modelValue($dossier, ['reference'], '—'),
                        'nom' => $this->modelValue($dossier, ['nom'], '—'),
                        'statut' => $this->modelValue($dossier, ['statut', 'status'], '—'),
                        'date_visite' => $this->modelValue($dossier, ['date_visite'], null),
                    ] : null,
                ];
            })
            ->values();

        $selectedIds = $campagneEtablissements
            ->pluck('etablissement_id')
            ->filter()
            ->values()
            ->toArray();

        $availableQuery = Etablissement::query();

        if (count($selectedIds) > 0) {
            $availableQuery->whereNotIn('id', $selectedIds);
        }

        $this->orderEtablissements($availableQuery);

        $availableEtablissements = $availableQuery
            ->get()
            ->map(function ($etablissement) {
                return [
                    'id' => $etablissement->id,
                    'nom' => $this->etablissementName($etablissement),
                    'type' => $this->modelValue($etablissement, ['type', 'type_etablissement', 'categorie'], '—'),
                    'ville' => $this->modelValue($etablissement, ['ville', 'city'], '—'),
                    'universite' => $this->modelValue($etablissement, ['universite', 'universite_nom', 'université', 'university'], '—'),
                    'email' => $this->modelValue($etablissement, ['email', 'mail'], ''),
                ];
            })
            ->values();

        $stats = [
            'etablissements' => $etablissements->count(),

            'acces_envoyes' => $etablissements->filter(function ($item) {
                $statut = strtolower($item['statut'] ?? '');

                return str_contains($statut, 'acces_envoye')
                    || str_contains($statut, 'accès envoyé')
                    || !empty($item['access_sent_at']);
            })->count(),

            'dossiers' => $etablissements->filter(fn ($item) => $item['dossier'] !== null)->count(),

            'formulaires' => $etablissements->filter(function ($item) {
                $dossierStatus = strtolower($item['dossier']['statut'] ?? '');

                return str_contains($dossierStatus, 'formulaire');
            })->count(),
        ];

        return Inertia::render('Campagnes/Show', [
            'campagne' => [
                'id' => $campagneEvaluation->id,
                'reference' => $campagneEvaluation->reference,
                'annee' => $campagneEvaluation->annee,
                'vocation' => $campagneEvaluation->vocation,
                'observation' => $campagneEvaluation->observation,
                'statut' => $campagneEvaluation->statut,
                'created_by' => $creatorName,
                'created_at' => optional($campagneEvaluation->created_at)?->format('d/m/Y H:i'),
                'updated_at' => optional($campagneEvaluation->updated_at)?->format('d/m/Y H:i'),
            ],
            'stats' => $stats,
            'etablissements' => $etablissements,
            'availableEtablissements' => $availableEtablissements,
        ]);
    }

    public function update(Request $request, CampagneEvaluation $campagneEvaluation)
    {
        $validated = $request->validate([
            'annee' => ['sometimes', 'required', 'digits:4'],
            'vocation' => ['sometimes', 'required', 'string', 'max:255'],
            'observation' => ['sometimes', 'nullable', 'string'],
            'statut' => ['sometimes', 'required', 'string', 'in:brouillon,active,cloturee'],
        ]);

        if (array_key_exists('annee', $validated)) {
            $campagneEvaluation->annee = $validated['annee'];
        }

        if (array_key_exists('vocation', $validated)) {
            $campagneEvaluation->vocation = $validated['vocation'];
        }

        if (array_key_exists('observation', $validated)) {
            $campagneEvaluation->observation = $validated['observation'];
        }

        if (array_key_exists('statut', $validated)) {
            $campagneEvaluation->statut = $validated['statut'];
        }

        $campagneEvaluation->save();

        return back()->with('success', 'Vague mise à jour avec succès.');
    }

    public function destroy(CampagneEvaluation $campagneEvaluation)
    {
        DB::transaction(function () use ($campagneEvaluation) {
            $campagneEtablissements = CampagneEtablissement::query()
                ->where('campagne_evaluation_id', $campagneEvaluation->id)
                ->get();

            foreach ($campagneEtablissements as $campagneEtablissement) {
                $dossier = $this->findDossierForCampagneEtablissement(
                    $campagneEvaluation,
                    $campagneEtablissement
                );

                if ($dossier) {
                    $dossier->delete();
                }

                $campagneEtablissement->delete();
            }

            $campagneEvaluation->delete();
        });

        return redirect()
            ->route('campagnes.index')
            ->with('success', 'Vague supprimée avec succès.');
    }

    public function etablissements(CampagneEvaluation $campagneEvaluation)
    {
        return redirect()->route('campagnes.show', $campagneEvaluation);
    }

    private function findDossierForCampagneEtablissement(
        CampagneEvaluation $campagne,
        CampagneEtablissement $campagneEtablissement
    ): ?Dossier {
        $pivotTable = (new CampagneEtablissement())->getTable();
        $dossierTable = (new Dossier())->getTable();

        if (Schema::hasColumn($pivotTable, 'dossier_id')) {
            $dossierId = $campagneEtablissement->getAttribute('dossier_id');

            if ($dossierId) {
                $dossier = Dossier::query()->find($dossierId);

                if ($dossier) {
                    return $dossier;
                }
            }
        }

        if (Schema::hasColumn($dossierTable, 'campagne_etablissement_id')) {
            $dossier = Dossier::query()
                ->where('campagne_etablissement_id', $campagneEtablissement->id)
                ->first();

            if ($dossier) {
                return $dossier;
            }
        }

        $query = Dossier::query();
        $hasCampagneCondition = false;
        $hasEtablissementCondition = false;

        if (Schema::hasColumn($dossierTable, 'campagne_evaluation_id')) {
            $query->where('campagne_evaluation_id', $campagne->id);
            $hasCampagneCondition = true;
        } elseif (Schema::hasColumn($dossierTable, 'campagne_id')) {
            $query->where('campagne_id', $campagne->id);
            $hasCampagneCondition = true;
        } elseif (Schema::hasColumn($dossierTable, 'campagne')) {
            $query->where('campagne', $campagne->reference);
            $hasCampagneCondition = true;
        }

        if (Schema::hasColumn($dossierTable, 'etablissement_id')) {
            $query->where('etablissement_id', $campagneEtablissement->etablissement_id);
            $hasEtablissementCondition = true;
        }

        if (!$hasCampagneCondition || !$hasEtablissementCondition) {
            return null;
        }

        return $query->first();
    }

    private function etablissementName($etablissement): string
    {
        return $this->modelValue($etablissement, [
            'nom',
            'name',
            'etablissement',
            'etablissement_2',
            'intitule',
        ], 'Établissement');
    }

    private function modelValue($model, array $columns, $default = null)
    {
        if (!$model) {
            return $default;
        }

        foreach ($columns as $column) {
            $value = $model->getAttribute($column);

            if ($value !== null && $value !== '') {
                return $value;
            }
        }

        return $default;
    }

    private function orderEtablissements($query): void
    {
        $table = (new Etablissement())->getTable();

        foreach (['nom', 'name', 'etablissement', 'etablissement_2', 'id'] as $column) {
            if (Schema::hasColumn($table, $column)) {
                if ($column === 'id') {
                    $query->orderByDesc($column);
                } else {
                    $query->orderBy($column);
                }

                return;
            }
        }
    }

    private function formatDate($date): ?string
    {
        if (!$date) {
            return null;
        }

        if ($date instanceof \Carbon\CarbonInterface) {
            return $date->format('d/m/Y H:i');
        }

        try {
            return \Carbon\Carbon::parse($date)->format('d/m/Y H:i');
        } catch (\Throwable $e) {
            return null;
        }
    }
}