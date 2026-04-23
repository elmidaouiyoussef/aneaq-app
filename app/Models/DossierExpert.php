<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DossierExpert extends Model
{
    use HasFactory;

    protected $fillable = [
        'dossier_id',
        'expert_id',
        'role',
        'statut_participation',
        'confirmed_at',
        'validated_by_dee_at',
    ];

    protected $casts = [
        'confirmed_at' => 'datetime',
        'validated_by_dee_at' => 'datetime',
    ];
}
