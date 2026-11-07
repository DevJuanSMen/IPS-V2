<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Catálogo de alergias. Tabla legacy `alergias`. */
class Alergia extends Model
{
    protected $table = 'alergias';

    protected $fillable = ['nombre'];
}
