<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * Usuario del sistema IPS. Mapea la tabla legacy `users` (intacta).
 *
 * Columnas: id, usuario, avatar, id_persona, rol, estado, email, password,
 * remember_token, created_at, updated_at.
 * El login usa el campo `usuario` (no email) y exige estado = 'Activo'.
 */
class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'usuario', 'email', 'password', 'rol', 'id_persona', 'estado', 'avatar',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /**
     * Datos personales asociados (nombre, identificación, etc.).
     */
    public function persona(): BelongsTo
    {
        return $this->belongsTo(Persona::class, 'id_persona');
    }

    /**
     * Nombre para mostrar (nombres + apellidos de la persona).
     */
    public function getNombreAttribute(): string
    {
        $persona = $this->persona;

        return $persona
            ? trim($persona->nombres.' '.$persona->apellidos)
            : $this->usuario;
    }

    /**
     * Representación segura del usuario para la API (sin password).
     */
    public function toApi(): array
    {
        return [
            'id' => $this->id,
            'usuario' => $this->usuario,
            'nombre' => $this->nombre,
            'rol' => $this->rol,
            'estado' => $this->estado,
            'email' => $this->email,
            'avatar' => $this->avatar,
        ];
    }
}
