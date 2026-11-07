<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Datos personales. Mapea la tabla legacy `personas` (intacta).
 *
 * Contiene datos sensibles de pacientes: tratar con cuidado y no exponer
 * campos de más en respuestas públicas.
 */
class Persona extends Model
{
    protected $table = 'personas';

    protected $fillable = [
        'identificacion', 'nombres', 'apellidos', 'tipodocumento', 'sexo',
        'telefono', 'tiposangre', 'direccion', 'estadocivil', 'eps',
        'ciudadnacimiento', 'ciudadresidencia', 'fechanacimiento', 'riesgo',
    ];

    protected function casts(): array
    {
        return [
            'fechanacimiento' => 'date',
            'riesgo' => 'boolean',
        ];
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id_persona');
    }

    public function getNombreCompletoAttribute(): string
    {
        return trim($this->nombres.' '.$this->apellidos);
    }
}
