<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Catálogo de medicamentos. Tabla legacy `medicamentos` (col: producto). */
class Medicamento extends Model
{
    protected $table = 'medicamentos';

    protected $fillable = ['producto'];
}
