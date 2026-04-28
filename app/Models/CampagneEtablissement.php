<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CampagneEtablissement extends Model
{
    protected $fillable = [
        'campagne_evaluation_id',
        'etablissement_id',
        'statut',
        'email',
        'access_sent_at',
    ];

    protected $casts = [
        'access_sent_at' => 'datetime',
    ];

    public function campagne(): BelongsTo
    {
        return $this->belongsTo(CampagneEvaluation::class, 'campagne_evaluation_id');
    }

    public function etablissement(): BelongsTo
    {
        return $this->belongsTo(Etablissement::class, 'etablissement_id');
    }

    public function dossier(): HasOne
    {
        return $this->hasOne(Dossier::class, 'campagne_etablissement_id');
    }
}