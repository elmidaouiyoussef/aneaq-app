<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampagneEtablissement extends Model
{
    use HasFactory;

    protected $fillable = [
        'campagne_evaluation_id',
        'etablissement_id',
        'statut',
        'observation',
        'lettre_envoyee_at',
        'email_envoye_at',
        'compte_genere_at',
        'dossier_id',
        'selected_by',
    ];

    protected $casts = [
        'lettre_envoyee_at' => 'datetime',
        'email_envoye_at' => 'datetime',
        'compte_genere_at' => 'datetime',
    ];

    public function campagne()
    {
        return $this->belongsTo(CampagneEvaluation::class, 'campagne_evaluation_id');
    }

    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class);
    }

    public function dossier()
    {
        return $this->belongsTo(Dossier::class);
    }

    public function selector()
    {
        return $this->belongsTo(User::class, 'selected_by');
    }
}
