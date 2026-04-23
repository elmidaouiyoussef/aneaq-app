<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dossier extends Model
{
    use HasFactory;

    protected $fillable = [
        'campagne_evaluation_id',
        'reference',
        'campagne',
        'nom',
        'description',
        'observation',
        'statut',
        'etablissement_id',
        'created_by',
    ];

    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class);
    }

    public function campagneEvaluation()
    {
        return $this->belongsTo(CampagneEvaluation::class, 'campagne_evaluation_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function campagneEtablissement()
    {
        return $this->hasOne(CampagneEtablissement::class);
    }

    public function experts()
    {
        return $this->belongsToMany(Expert::class, 'dossier_experts')
            ->withPivot(['role', 'statut_participation', 'confirmed_at', 'validated_by_dee_at'])
            ->withTimestamps();
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
