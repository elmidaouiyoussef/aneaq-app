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
        $vaguesCount = CampagneEvaluation::count();

        return Inertia::render('DEE/AdminDashboard', [
            'stats' => [
                'etablissements' => Etablissement::count(),
                'experts' => Expert::count(),

                // J'ai mis les deux noms pour éviter les bugs côté React
                'vagues' => $vaguesCount,
                'campagnes' => $vaguesCount,

                'dossiers' => Dossier::count(),
                'visites' => Dossier::whereNotNull('date_visite')->count(),
            ],
        ]);
    }
}