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
        return Inertia::render('Dashboard', [
            'stats' => [
                'etablissements' => Etablissement::count(),
                'experts' => Expert::count(),
                'vagues' => CampagneEvaluation::count(),
                'dossiers' => Dossier::count(),
                'visites' => Dossier::whereNotNull('date_visite')->count(),
            ],
        ]);
    }
}