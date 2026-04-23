<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Expert extends Model
{
    use HasFactory;

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

    public function dossiers()
    {
        return $this->belongsToMany(Dossier::class, 'dossier_experts')
            ->withPivot(['role', 'statut_participation', 'confirmed_at', 'validated_by_dee_at'])
            ->withTimestamps();
    }
}
