<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampagneEvaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'annee',
        'vocation',
        'observation',
        'statut',
        'created_by',
    ];

    public function etablissements()
    {
        return $this->hasMany(CampagneEtablissement::class);
    }

    public function dossiers()
    {
        return $this->hasMany(Dossier::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
