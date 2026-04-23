<?php

namespace App\Http\Controllers;

use App\Models\CampagneEvaluation;
use App\Models\Dossier;
use App\Models\Etablissement;
use App\Models\Expert;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $experts = Expert::orderBy('nom')->get();
        $etablissements = Etablissement::orderBy('etablissement_2')->get();
        $campagnes = CampagneEvaluation::latest()->take(5)->get();
        $dossiers = Dossier::latest()->take(5)->get();

        return Inertia::render('AdminDashboard', [
            'stats' => [
                'etablissements' => $etablissements->count(),
                'experts' => $experts->count(),
                'dossiers' => Dossier::count(),
                'rapports' => Dossier::where('statut', 'Rapport reçu')->count(),
                'visites' => CampagneEvaluation::where('statut', 'active')->count(),
                'recommandations' => Dossier::where('statut', 'Clôturé')->count(),
            ],
            'workflowStats' => [
                'selected' => Dossier::where('statut', 'Établissement sélectionné')->count(),
                'confirmed' => Dossier::where('statut', 'Accès envoyé')->count(),
                'assigned' => Dossier::where('statut', 'Experts affectés')->count(),
                'visited' => Dossier::where('statut', 'En cours d’autoévaluation')->count(),
                'validated' => Dossier::where('statut', 'Clôturé')->count(),
                'followed' => Dossier::where('statut', 'Annexes reçues')->count(),
            ],
            'alerts' => [
                'Suivez les vagues d’évaluation avant l’envoi des accès.',
                'Contrôlez les établissements sans formulaire initial complété.',
                'Vérifiez les dossiers sans rapport d’autoévaluation reçu.',
            ],
            'activities' => $campagnes->map(fn ($campagne) => [
                'id' => $campagne->id,
                'description' => sprintf('Vague %s créée pour %s.', $campagne->reference, $campagne->vocation),
            ])->concat(
                $dossiers->map(fn ($dossier) => [
                    'id' => 1000 + $dossier->id,
                    'description' => sprintf('Dossier %s au statut %s.', $dossier->reference, $dossier->statut),
                ])
            )->values(),
            'experts' => $experts,
            'etablissements' => $etablissements,
        ]);
    }
}
