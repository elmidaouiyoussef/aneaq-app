<?php

namespace App\Http\Controllers;

use App\Models\CampagneEtablissement;
use App\Models\CampagneEvaluation;
use App\Models\Document;
use App\Models\Dossier;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CampagneEvaluationController extends Controller
{
    public function index(Request $request)
    {
        $statut = $request->string('statut')->toString();

        $campagnes = CampagneEvaluation::withCount(['etablissements', 'dossiers'])
            ->when(in_array($statut, ['brouillon', 'active', 'cloturee'], true), fn ($query) => $query->where('statut', $statut))
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
                    'etablissements_count' => $campagne->etablissements_count,
                    'dossiers_count' => $campagne->dossiers_count,
                    'created_at' => optional($campagne->created_at)->format('d/m/Y H:i'),
                ];
            });

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

        $nextSequence = str_pad((string) ((CampagneEvaluation::max('id') ?? 0) + 1), 3, '0', STR_PAD_LEFT);

        $campagne = CampagneEvaluation::create([
            'reference' => sprintf('VAG-%s-%s', $validated['annee'], $nextSequence),
            'annee' => $validated['annee'],
            'vocation' => $validated['vocation'],
            'observation' => $validated['observation'] ?? null,
            'statut' => 'brouillon',
            'created_by' => $request->user()?->id,
        ]);

        return redirect()->route('campagnes.show', $campagne)->with('success', 'La vague d’évaluation a été créée.');
    }

    public function show(CampagneEvaluation $campagneEvaluation)
    {
        $campagneEvaluation->load(['creator']);

        $etablissements = CampagneEtablissement::with(['etablissement', 'dossier'])
            ->where('campagne_evaluation_id', $campagneEvaluation->id)
            ->latest()
            ->get();

        return Inertia::render('Campagnes/Show', [
            'campagne' => [
                'id' => $campagneEvaluation->id,
                'reference' => $campagneEvaluation->reference,
                'annee' => $campagneEvaluation->annee,
                'vocation' => $campagneEvaluation->vocation,
                'observation' => $campagneEvaluation->observation,
                'statut' => $campagneEvaluation->statut,
                'creator' => $campagneEvaluation->creator?->name,
                'created_at' => optional($campagneEvaluation->created_at)->format('d/m/Y H:i'),
                'updated_at' => optional($campagneEvaluation->updated_at)->format('d/m/Y H:i'),
                'stats' => [
                    'etablissements' => $etablissements->count(),
                    'lettres_preparees' => $etablissements->where('statut', 'lettre préparée')->count(),
                    'acces_envoyes' => $etablissements->where('statut', 'accès envoyé')->count(),
                    'formulaires_completes' => $etablissements->where('statut', 'formulaire initial complété')->count(),
                ],
                'etablissements' => $etablissements->map(function (CampagneEtablissement $item) {
                    return [
                        'id' => $item->id,
                        'statut' => $item->statut,
                        'observation' => $item->observation,
                        'lettre_envoyee_at' => optional($item->lettre_envoyee_at)->format('d/m/Y H:i'),
                        'email_envoye_at' => optional($item->email_envoye_at)->format('d/m/Y H:i'),
                        'compte_genere_at' => optional($item->compte_genere_at)->format('d/m/Y H:i'),
                        'dossier_id' => $item->dossier_id,
                        'etablissement' => [
                            'id' => $item->etablissement?->id,
                            'nom' => $item->etablissement?->etablissement_2 ?: $item->etablissement?->etablissement,
                            'ville' => $item->etablissement?->ville,
                            'universite' => $item->etablissement?->universite,
                            'email' => $item->etablissement?->email,
                        ],
                    ];
                })->values(),
            ],
        ]);
    }

    public function update(Request $request, CampagneEvaluation $campagneEvaluation)
    {
        $validated = $request->validate([
            'statut' => ['required', 'in:brouillon,active,cloturee'],
            'observation' => ['nullable', 'string'],
        ]);

        $campagneEvaluation->update($validated);

        return back()->with('success', 'La vague a été mise à jour.');
    }

    public function destroy(CampagneEvaluation $campagneEvaluation)
    {
        DB::transaction(function () use ($campagneEvaluation) {
            $dossierIds = Dossier::where('campagne_evaluation_id', $campagneEvaluation->id)->pluck('id');

            if ($dossierIds->isNotEmpty()) {
                $documents = Document::whereIn('dossier_id', $dossierIds)->get();

                foreach ($documents as $document) {
                    Storage::disk('public')->delete($document->file_path);
                }

                Dossier::whereIn('id', $dossierIds)->delete();
            }

            $campagneEvaluation->delete();
        });

        return redirect()->route('campagnes.index')->with('success', 'La vague et ses éléments liés ont été supprimés.');
    }
}
