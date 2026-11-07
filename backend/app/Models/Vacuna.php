<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Catálogo de vacunas. Tabla legacy `vacunas`. */
class Vacuna extends Model
{
    protected $table = 'vacunas';

    protected $fillable = ['nombre'];
}
