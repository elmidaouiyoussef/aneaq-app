<?php

namespace App\Http\Controllers;

use App\Models\Etablissement;
use Inertia\Inertia;

class EtablissementController extends Controller
{
    public function index()
    {
        $etablissements = Etablissement::withCount(['dossiers', 'campagnes'])
            ->orderBy('etablissement_2')
            ->get()
            ->map(function (Etablissement $etablissement) {
                return [
                    'id' => $etablissement->id,
                    'nom' => $etablissement->etablissement_2 ?: $etablissement->etablissement,
                    'nom_officiel' => $etablissement->etablissement,
                    'ville' => $etablissement->ville,
                    'universite' => $etablissement->universite,
                    'email' => $etablissement->email,
                    'dossiers_count' => $etablissement->dossiers_count,
                    'campagnes_count' => $etablissement->campagnes_count,
                ];
            });

        return Inertia::render('Etablissements/Index', [
            'etablissements' => $etablissements,
        ]);
    }
}
