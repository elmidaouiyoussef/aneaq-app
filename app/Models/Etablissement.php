<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Etablissement extends Model
{
    protected $table = 'etablissements';

    protected $fillable = [
        'etablissement',
        'etablissement_2',
        'ville',
        'universite',
        'email',
    ];
}