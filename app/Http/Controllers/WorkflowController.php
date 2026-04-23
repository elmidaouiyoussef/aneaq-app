<?php

namespace App\Http\Controllers;

use App\Models\CampagneEvaluation;
use App\Models\Dossier;
use App\Models\EtablissementOnboarding;
use Inertia\Inertia;

class WorkflowController extends Controller
{
    public function selectionEtablissements()
    {
        $campagnes = CampagneEvaluation::withCount(['etablissements', 'dossiers'])
            ->latest()
            ->get()
            ->map(fn (CampagneEvaluation $campagne) => [
                'id' => $campagne->id,
                'reference' => $campagne->reference,
                'annee' => $campagne->annee,
                'vocation' => $campagne->vocation,
                'statut' => $campagne->statut,
                'etablissements_count' => $campagne->etablissements_count,
                'dossiers_count' => $campagne->dossiers_count,
                'created_at' => optional($campagne->created_at)->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Workflow/SelectionEtablissements', [
            'campagnes' => $campagnes,
        ]);
    }

    public function selectionExperts()
    {
        $dossiers = Dossier::with(['campagneEvaluation', 'etablissement'])
            ->withCount('experts')
            ->latest()
            ->get()
            ->map(fn (Dossier $dossier) => [
                'id' => $dossier->id,
                'reference' => $dossier->reference,
                'nom' => $dossier->nom,
                'statut' => $dossier->statut,
                'campagne' => $dossier->campagneEvaluation?->reference ?: $dossier->campagne,
                'experts_count' => $dossier->experts_count,
                'etablissement' => $dossier->etablissement?->etablissement_2 ?: $dossier->etablissement?->etablissement,
            ]);

        return Inertia::render('Workflow/SelectionExperts', [
            'dossiers' => $dossiers,
        ]);
    }

    public function comites()
    {
        $onboardings = EtablissementOnboarding::with(['etablissement', 'dossier.campagneEvaluation'])
            ->latest('updated_at')
            ->get()
            ->map(fn (EtablissementOnboarding $onboarding) => [
                'id' => $onboarding->id,
                'statut' => $onboarding->statut,
                'completed_at' => optional($onboarding->completed_at)->format('d/m/Y H:i'),
                'responsable_nom' => $onboarding->responsable_nom,
                'responsable_fonction' => $onboarding->responsable_fonction,
                'responsable_email' => $onboarding->responsable_email,
                'responsable_telephone' => $onboarding->responsable_telephone,
                'etablissement' => $onboarding->etablissement?->etablissement_2 ?: $onboarding->etablissement?->etablissement,
                'dossier' => $onboarding->dossier ? [
                    'id' => $onboarding->dossier->id,
                    'reference' => $onboarding->dossier->reference,
                    'campagne' => $onboarding->dossier->campagneEvaluation?->reference ?: $onboarding->dossier->campagne,
                ] : null,
            ]);

        return Inertia::render('Workflow/Comites', [
            'onboardings' => $onboardings,
        ]);
    }

    public function affectations()
    {
        $dossiers = Dossier::with(['campagneEvaluation', 'etablissement'])
            ->withCount('experts')
            ->latest()
            ->get()
            ->map(fn (Dossier $dossier) => [
                'id' => $dossier->id,
                'reference' => $dossier->reference,
                'nom' => $dossier->nom,
                'statut' => $dossier->statut,
                'campagne' => $dossier->campagneEvaluation?->reference ?: $dossier->campagne,
                'experts_count' => $dossier->experts_count,
                'etablissement' => $dossier->etablissement?->etablissement_2 ?: $dossier->etablissement?->etablissement,
            ]);

        return Inertia::render('Workflow/Affectations', [
            'dossiers' => $dossiers,
        ]);
    }

    public function visites()
    {
        $dossiers = Dossier::with(['campagneEvaluation', 'etablissement'])
            ->withCount(['experts', 'documents'])
            ->whereIn('statut', ['Experts affectés', 'En cours d’autoévaluation', 'Rapport reçu'])
            ->latest()
            ->get()
            ->map(fn (Dossier $dossier) => [
                'id' => $dossier->id,
                'reference' => $dossier->reference,
                'statut' => $dossier->statut,
                'campagne' => $dossier->campagneEvaluation?->reference ?: $dossier->campagne,
                'etablissement' => $dossier->etablissement?->etablissement_2 ?: $dossier->etablissement?->etablissement,
                'experts_count' => $dossier->experts_count,
                'documents_count' => $dossier->documents_count,
            ]);

        return Inertia::render('Workflow/Visites', [
            'dossiers' => $dossiers,
        ]);
    }

    public function recommandations()
    {
        $dossiers = Dossier::with(['campagneEvaluation', 'etablissement'])
            ->withCount(['experts', 'documents'])
            ->whereIn('statut', ['Rapport reçu', 'Annexes reçues', 'Clôturé'])
            ->latest()
            ->get()
            ->map(fn (Dossier $dossier) => [
                'id' => $dossier->id,
                'reference' => $dossier->reference,
                'statut' => $dossier->statut,
                'campagne' => $dossier->campagneEvaluation?->reference ?: $dossier->campagne,
                'etablissement' => $dossier->etablissement?->etablissement_2 ?: $dossier->etablissement?->etablissement,
                'experts_count' => $dossier->experts_count,
                'documents_count' => $dossier->documents_count,
            ]);

        return Inertia::render('Workflow/Recommandations', [
            'dossiers' => $dossiers,
        ]);
    }
}
