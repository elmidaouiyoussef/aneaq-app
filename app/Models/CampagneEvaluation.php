<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CampagneEvaluation extends Model
{
    protected $fillable = [
        'reference',
        'annee',
        'vocation',
        'observation',
        'statut',
        'created_by',
        'created_by_name',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function campagneEtablissements(): HasMany
    {
        return $this->hasMany(CampagneEtablissement::class, 'campagne_evaluation_id');
    }

    public function dossiers(): HasMany
    {
        return $this->hasMany(Dossier::class, 'campagne_evaluation_id');
    }
}