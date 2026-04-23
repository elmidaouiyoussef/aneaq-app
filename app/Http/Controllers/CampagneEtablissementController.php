<?php

namespace App\Http\Controllers;

use App\Mail\EtablissementAccountCreatedMail;
use App\Models\CampagneEtablissement;
use App\Models\CampagneEvaluation;
use App\Models\Dossier;
use App\Models\Etablissement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CampagneEtablissementController extends Controller
{
    private const DOSSIER_STATUS_MAP = [
        'sélectionné' => 'Établissement sélectionné',
        'lettre préparée' => 'Établissement sélectionné',
        'accès envoyé' => 'Accès envoyé',
        'formulaire initial complété' => 'Formulaire complété',
        'experts affectés' => 'Experts affectés',
        'rapport d’autoévaluation déposé' => 'Rapport reçu',
        'annexes déposées' => 'Annexes reçues',
    ];

    public function index(CampagneEvaluation $campagneEvaluation)
    {
        $selectionnes = CampagneEtablissement::with(['etablissement', 'dossier'])
            ->where('campagne_evaluation_id', $campagneEvaluation->id)
            ->latest()
            ->get();

        $selectedIds = $selectionnes->pluck('etablissement_id');

        $etablissementsDisponibles = Etablissement::query()
            ->when($selectedIds->isNotEmpty(), fn ($query) => $query->whereNotIn('id', $selectedIds))
            ->orderBy('etablissement_2')
            ->get(['id', 'etablissement', 'etablissement_2', 'ville', 'universite', 'email']);

        return Inertia::render('Campagnes/Etablissements', [
            'campagne' => [
                'id' => $campagneEvaluation->id,
                'reference' => $campagneEvaluation->reference,
                'annee' => $campagneEvaluation->annee,
                'vocation' => $campagneEvaluation->vocation,
                'statut' => $campagneEvaluation->statut,
            ],
            'statuts' => array_keys(self::DOSSIER_STATUS_MAP),
            'etablissementsDisponibles' => $etablissementsDisponibles,
            'selectionnes' => $selectionnes->map(function (CampagneEtablissement $item) {
                return [
                    'id' => $item->id,
                    'statut' => $item->statut,
                    'observation' => $item->observation,
                    'lettre_envoyee_at' => optional($item->lettre_envoyee_at)->format('d/m/Y H:i'),
                    'email_envoye_at' => optional($item->email_envoye_at)->format('d/m/Y H:i'),
                    'compte_genere_at' => optional($item->compte_genere_at)->format('d/m/Y H:i'),
                    'dossier' => $item->dossier ? [
                        'id' => $item->dossier->id,
                        'reference' => $item->dossier->reference,
                        'statut' => $item->dossier->statut,
                    ] : null,
                    'etablissement' => [
                        'id' => $item->etablissement?->id,
                        'nom' => $item->etablissement?->etablissement_2 ?: $item->etablissement?->etablissement,
                        'ville' => $item->etablissement?->ville,
                        'universite' => $item->etablissement?->universite,
                        'email' => $item->etablissement?->email,
                    ],
                ];
            })->values(),
        ]);
    }

    public function store(Request $request, CampagneEvaluation $campagneEvaluation)
    {
        $validated = $request->validate([
            'etablissement_ids' => ['required', 'array', 'min:1'],
            'etablissement_ids.*' => ['integer', 'exists:etablissements,id'],
        ]);

        foreach ($validated['etablissement_ids'] as $etablissementId) {
            $existing = CampagneEtablissement::where('campagne_evaluation_id', $campagneEvaluation->id)
                ->where('etablissement_id', $etablissementId)
                ->first();

            if ($existing) {
                continue;
            }

            $etablissement = Etablissement::findOrFail($etablissementId);

            $dossier = Dossier::create([
                'campagne_evaluation_id' => $campagneEvaluation->id,
                'etablissement_id' => $etablissement->id,
                'reference' => sprintf('DOS-%s-%s-%s', $campagneEvaluation->annee, $campagneEvaluation->id, $etablissement->id),
                'campagne' => $campagneEvaluation->reference,
                'nom' => sprintf('Dossier %s - %s', $campagneEvaluation->annee, $etablissement->etablissement_2 ?: $etablissement->etablissement ?: 'Établissement'),
                'description' => null,
                'observation' => $campagneEvaluation->observation,
                'statut' => 'Établissement sélectionné',
                'created_by' => $request->user()?->id,
            ]);

            CampagneEtablissement::create([
                'campagne_evaluation_id' => $campagneEvaluation->id,
                'etablissement_id' => $etablissement->id,
                'statut' => 'sélectionné',
                'dossier_id' => $dossier->id,
                'selected_by' => $request->user()?->id,
            ]);
        }

        return back()->with('success', 'Les établissements ont été ajoutés à la vague.');
    }

    public function update(Request $request, CampagneEvaluation $campagneEvaluation, CampagneEtablissement $campagneEtablissement)
    {
        abort_unless($campagneEtablissement->campagne_evaluation_id === $campagneEvaluation->id, 404);

        $validated = $request->validate([
            'statut' => ['required', 'in:sélectionné,lettre préparée,accès envoyé,formulaire initial complété,experts affectés,rapport d’autoévaluation déposé,annexes déposées'],
            'observation' => ['nullable', 'string'],
        ]);

        $updates = [
            'statut' => $validated['statut'],
            'observation' => $validated['observation'] ?? null,
        ];

        if ($validated['statut'] === 'lettre préparée' && ! $campagneEtablissement->lettre_envoyee_at) {
            $updates['lettre_envoyee_at'] = now();
        }

        $campagneEtablissement->update($updates);

        if ($campagneEtablissement->dossier) {
            $campagneEtablissement->dossier->update([
                'statut' => self::DOSSIER_STATUS_MAP[$validated['statut']] ?? $campagneEtablissement->dossier->statut,
                'observation' => $validated['observation'] ?? $campagneEtablissement->dossier->observation,
            ]);
        }

        return back()->with('success', 'Le suivi de l’établissement a été mis à jour.');
    }

    public function sendAccess(Request $request, CampagneEvaluation $campagneEvaluation, CampagneEtablissement $campagneEtablissement)
    {
        abort_unless($campagneEtablissement->campagne_evaluation_id === $campagneEvaluation->id, 404);

        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $etablissement = $campagneEtablissement->etablissement()->firstOrFail();
        $etablissement->update([
            'email' => $validated['email'],
        ]);

        $plainPassword = Str::password(12);

        $user = User::firstOrNew(['email' => $validated['email']]);
        $user->name = $etablissement->etablissement_2 ?: $etablissement->etablissement ?: 'Établissement';
        $user->role = 'etablissement';
        $user->etablissement_id = $etablissement->id;
        $user->password = Hash::make($plainPassword);
        $user->save();

        $campagneEtablissement->update([
            'lettre_envoyee_at' => $campagneEtablissement->lettre_envoyee_at ?: now(),
            'compte_genere_at' => now(),
        ]);

        $flashType = 'success';
        $flashMessage = 'Le compte établissement a été généré et l’accès a été envoyé.';

        try {
            Mail::to($validated['email'])->send(
                new EtablissementAccountCreatedMail(
                    etablissementName: $user->name,
                    loginEmail: $validated['email'],
                    plainPassword: $plainPassword,
                    campagneReference: $campagneEvaluation->reference,
                    dossierReference: $campagneEtablissement->dossier?->reference
                )
            );

            $campagneEtablissement->update([
                'email_envoye_at' => now(),
                'statut' => 'accès envoyé',
            ]);

            if ($campagneEtablissement->dossier) {
                $campagneEtablissement->dossier->update([
                    'statut' => 'Accès envoyé',
                ]);
            }
        } catch (\Throwable $throwable) {
            report($throwable);

            $flashType = 'warning';
            $flashMessage = 'Le compte a été généré, mais l’email n’a pas pu être envoyé en local.';
        }

        return back()->with($flashType, $flashMessage);
    }
}
