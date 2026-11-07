<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Catálogo de exámenes. Tabla legacy `examenes` (cols: nombre, codigo, tarifa_soat). */
class Examen extends Model
{
    protected $table = 'examenes';

    protected $fillable = ['nombre', 'codigo', 'tarifa_soat'];

    protected function casts(): array
    {
        return ['tarifa_soat' => 'integer'];
    }
}
