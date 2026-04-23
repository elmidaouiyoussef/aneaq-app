<?php

namespace App\Http\Controllers;

use App\Models\Expert;
use Inertia\Inertia;

class ExpertController extends Controller
{
    public function index()
    {
        $experts = Expert::orderBy('nom')
            ->get()
            ->map(function (Expert $expert) {
                return [
                    'id' => $expert->id,
                    'nom' => trim($expert->prenom.' '.$expert->nom),
                    'email' => $expert->email,
                    'ville' => $expert->ville,
                    'specialite' => $expert->specialite,
                    'fonction' => $expert->fonction_actuelle,
                ];
            });

        return Inertia::render('Experts/Index', [
            'experts' => $experts,
        ]);
    }
}
