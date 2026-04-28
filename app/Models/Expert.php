<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expert extends Model
{
    protected $table = 'experts';

    protected $fillable = [
        'nom',
        'prenom',
        'date_naissance',
        'ville',
        'pays',
        'telephone',
        'email',
        'diplomes_obtenus',
        'specialite',
        'annee',
        'fonction_actuelle',
        'universite_ou_departement_ministeriel',
        'type_etablissement',
        'etablissement',
        'date_recrutement',
        'grade',
        'responsabilite',
        'etablissement_et_annee_responsabilite',
    ];
}