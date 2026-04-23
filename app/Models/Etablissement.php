<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Etablissement extends Model
{
    use HasFactory;

    protected $table = 'etablissements';

    protected $fillable = [
        'acronyme',
        'domaine_connaissances',
        'evaluation',
        'etablissement',
        'etablissement_2',
        'ville',
        'universite',
        'email',
    ];

    public function dossiers()
    {
        return $this->hasMany(Dossier::class);
    }

    public function campagnes()
    {
        return $this->hasMany(CampagneEtablissement::class);
    }

    public function onboarding()
    {
        return $this->hasOne(EtablissementOnboarding::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
