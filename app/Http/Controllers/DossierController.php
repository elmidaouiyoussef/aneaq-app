<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Dossier;
use App\Models\Expert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DossierController extends Controller
{
    public function index(Request $request)
    {
        $statut = $request->string('statut')->toString();

        $dossiers = Dossier::with(['campagneEvaluation', 'etablissement', 'creator'])
            ->when(
                in_array($statut, [
                    'Établissement sélectionné',
                    'Accès envoyé',
                    'Formulaire complété',
                    'Experts affectés',
                    'En cours d’autoévaluation',
                    'Rapport reçu',
                    'Annexes reçues',
                    'Clôturé',
                ], true),
                fn ($query) => $query->where('statut', $statut)
            )
            ->latest()
            ->get()
            ->map(function (Dossier $dossier) {
                return [
                    'id' => $dossier->id,
                    'reference' => $dossier->reference,
                    'campagne' => $dossier->campagneEvaluation?->reference ?: $dossier->campagne,
                    'campagne_id' => $dossier->campagne_evaluation_id,
                    'nom' => $dossier->nom,
                    'description' => $dossier->description,
                    'observation' => $dossier->observation,
                    'statut' => $dossier->statut,
                    'created_at' => optional($dossier->created_at)->format('d/m/Y H:i'),
                    'etablissement' => [
                        'id' => $dossier->etablissement?->id,
                        'nom' => $dossier->etablissement?->etablissement_2 ?: $dossier->etablissement?->etablissement,
                        'ville' => $dossier->etablissement?->ville,
                        'universite' => $dossier->etablissement?->universite,
                        'email' => $dossier->etablissement?->email,
                    ],
                    'creator' => $dossier->creator?->name,
                ];
            });

        return Inertia::render('Dossiers/Index', [
            'dossiers' => $dossiers,
            'statuts' => [
                'Établissement sélectionné',
                'Accès envoyé',
                'Formulaire complété',
                'Experts affectés',
                'En cours d’autoévaluation',
                'Rapport reçu',
                'Annexes reçues',
                'Clôturé',
            ],
            'filters' => [
                'statut' => $statut,
            ],
        ]);
    }

    public function show(Dossier $dossier)
    {
        $dossier->load([
            'campagneEvaluation',
            'etablissement.onboarding',
            'creator',
            'experts',
            'documents.uploader',
            'campagneEtablissement',
        ]);

        $availableExperts = Expert::orderBy('nom')->get(['id', 'nom', 'prenom', 'specialite', 'email']);

        return Inertia::render('Dossiers/Show', [
            'dossier' => [
                'id' => $dossier->id,
                'reference' => $dossier->reference,
                'campagne' => $dossier->campagneEvaluation?->reference ?: $dossier->campagne,
                'campagne_id' => $dossier->campagne_evaluation_id,
                'nom' => $dossier->nom,
                'description' => $dossier->description,
                'observation' => $dossier->observation,
                'statut' => $dossier->statut,
                'created_at' => optional($dossier->created_at)->format('d/m/Y H:i'),
                'updated_at' => optional($dossier->updated_at)->format('d/m/Y H:i'),
                'etablissement' => [
                    'id' => $dossier->etablissement?->id,
                    'nom' => $dossier->etablissement?->etablissement_2 ?: $dossier->etablissement?->etablissement,
                    'etablissement' => $dossier->etablissement?->etablissement,
                    'etablissement_2' => $dossier->etablissement?->etablissement_2,
                    'ville' => $dossier->etablissement?->ville,
                    'universite' => $dossier->etablissement?->universite,
                    'acronyme' => $dossier->etablissement?->acronyme,
                    'email' => $dossier->etablissement?->email,
                    'onboarding' => $dossier->etablissement?->onboarding ? [
                        'adresse' => $dossier->etablissement->onboarding->adresse,
                        'site_web' => $dossier->etablissement->onboarding->site_web,
                        'telephone' => $dossier->etablissement->onboarding->telephone,
                        'responsable_nom' => $dossier->etablissement->onboarding->responsable_nom,
                        'responsable_fonction' => $dossier->etablissement->onboarding->responsable_fonction,
                        'responsable_email' => $dossier->etablissement->onboarding->responsable_email,
                        'responsable_telephone' => $dossier->etablissement->onboarding->responsable_telephone,
                        'statut' => $dossier->etablissement->onboarding->statut,
                        'completed_at' => optional($dossier->etablissement->onboarding->completed_at)->format('d/m/Y H:i'),
                    ] : null,
                ],
                'creator' => $dossier->creator?->name,
                'campagneEtablissement' => $dossier->campagneEtablissement ? [
                    'id' => $dossier->campagneEtablissement->id,
                    'statut' => $dossier->campagneEtablissement->statut,
                ] : null,
                'experts' => $dossier->experts->map(function (Expert $expert) {
                    return [
                        'id' => $expert->id,
                        'nom' => trim($expert->prenom.' '.$expert->nom),
                        'email' => $expert->email,
                        'specialite' => $expert->specialite,
                        'pivot' => [
                            'role' => $expert->pivot?->role,
                            'statut_participation' => $expert->pivot?->statut_participation,
                            'confirmed_at' => optional($expert->pivot?->confirmed_at)->format('d/m/Y H:i'),
                            'validated_by_dee_at' => optional($expert->pivot?->validated_by_dee_at)->format('d/m/Y H:i'),
                        ],
                    ];
                })->values(),
                'documents' => $dossier->documents->map(function ($document) {
                    return [
                        'id' => $document->id,
                        'type_document' => $document->type_document,
                        'original_name' => $document->original_name,
                        'observation' => $document->observation,
                        'uploaded_by' => $document->uploader?->name,
                        'created_at' => optional($document->created_at)->format('d/m/Y H:i'),
                        'download_url' => asset('storage/'.$document->file_path),
                    ];
                })->values(),
            ],
            'availableExperts' => $availableExperts,
            'statusOptions' => [
                'Établissement sélectionné',
                'Accès envoyé',
                'Formulaire complété',
                'Experts affectés',
                'En cours d’autoévaluation',
                'Rapport reçu',
                'Annexes reçues',
                'Clôturé',
            ],
            'documentTypes' => [
                'rapport_autoevaluation',
                'annexe',
                'piece_justificative',
            ],
        ]);
    }

    public function update(Request $request, Dossier $dossier)
    {
        $validated = $request->validate([
            'statut' => ['required', 'in:Établissement sélectionné,Accès envoyé,Formulaire complété,Experts affectés,En cours d’autoévaluation,Rapport reçu,Annexes reçues,Clôturé'],
            'description' => ['nullable', 'string'],
            'observation' => ['nullable', 'string'],
        ]);

        $dossier->update($validated);

        return back()->with('success', 'Le dossier a été mis à jour.');
    }

    public function destroy(Dossier $dossier)
    {
        DB::transaction(function () use ($dossier) {
            $documents = Document::where('dossier_id', $dossier->id)->get();

            foreach ($documents as $document) {
                Storage::disk('public')->delete($document->file_path);
            }

            $dossier->campagneEtablissement?->update([
                'dossier_id' => null,
                'statut' => 'sélectionné',
            ]);

            $dossier->delete();
        });

        Storage::disk('public')->deleteDirectory('dossiers/'.$dossier->id);

        return redirect()->route('dossiers.index')->with('success', 'Le dossier a été supprimé.');
    }
}
