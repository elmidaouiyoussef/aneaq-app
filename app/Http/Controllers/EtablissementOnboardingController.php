<?php

namespace App\Http\Controllers;

use App\Models\Dossier;
use App\Models\EtablissementOnboarding;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EtablissementOnboardingController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $etablissement = $user?->etablissement;

        abort_if(! $etablissement, 403, 'Aucun établissement associé à ce compte.');

        $onboarding = $etablissement->onboarding;
        $dossier = Dossier::where('etablissement_id', $etablissement->id)->latest()->first();

        return Inertia::render('Etablissement/FirstForm', [
            'etablissement' => [
                'id' => $etablissement->id,
                'nom' => $etablissement->etablissement_2 ?: $etablissement->etablissement,
                'email' => $etablissement->email,
                'ville' => $etablissement->ville,
                'universite' => $etablissement->universite,
            ],
            'dossier' => $dossier ? [
                'id' => $dossier->id,
                'reference' => $dossier->reference,
                'statut' => $dossier->statut,
            ] : null,
            'form' => $onboarding ? [
                'adresse' => $onboarding->adresse,
                'site_web' => $onboarding->site_web,
                'telephone' => $onboarding->telephone,
                'responsable_nom' => $onboarding->responsable_nom,
                'responsable_fonction' => $onboarding->responsable_fonction,
                'responsable_email' => $onboarding->responsable_email,
                'responsable_telephone' => $onboarding->responsable_telephone,
                'statut' => $onboarding->statut,
            ] : null,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $etablissement = $user?->etablissement;

        abort_if(! $etablissement, 403, 'Aucun établissement associé à ce compte.');

        $validated = $request->validate([
            'adresse' => ['required', 'string'],
            'site_web' => ['nullable', 'string', 'max:255'],
            'telephone' => ['required', 'string', 'max:255'],
            'responsable_nom' => ['required', 'string', 'max:255'],
            'responsable_fonction' => ['required', 'string', 'max:255'],
            'responsable_email' => ['required', 'email', 'max:255'],
            'responsable_telephone' => ['required', 'string', 'max:255'],
        ]);

        $dossier = Dossier::where('etablissement_id', $etablissement->id)->latest()->first();

        EtablissementOnboarding::updateOrCreate(
            ['etablissement_id' => $etablissement->id],
            [
                ...$validated,
                'dossier_id' => $dossier?->id,
                'statut' => 'complété',
                'completed_at' => now(),
            ]
        );

        if ($dossier) {
            $dossier->update([
                'statut' => 'Formulaire complété',
            ]);

            $dossier->campagneEtablissement?->update([
                'statut' => 'formulaire initial complété',
            ]);
        }

        return back()->with('success', 'Le premier formulaire a été enregistré.');
    }
}
