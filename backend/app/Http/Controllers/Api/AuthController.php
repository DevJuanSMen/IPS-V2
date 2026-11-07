<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

/**
 * Autenticación de la SPA (Sanctum, basada en sesión/cookie).
 *
 * Flujo del frontend:
 *   1. GET  /sanctum/csrf-cookie   (obtiene la cookie XSRF-TOKEN)
 *   2. POST /api/login             { usuario, password }
 *   3. GET  /api/me                (usuario autenticado)
 *   4. POST /api/logout
 *
 * El login es de SOLO LECTURA sobre la base de datos: no persiste tokens ni
 * remember_token; la sesión se guarda en archivos (SESSION_DRIVER=file).
 */
class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'usuario' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('usuario', $data['usuario'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Usuario o contraseña incorrectos.',
            ], 422);
        }

        if ($user->estado !== 'Activo') {
            return response()->json([
                'message' => 'El usuario está inactivo. Contacte al administrador.',
            ], 403);
        }

        // Establece la sesión (sin "remember" para no escribir en la BD).
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(['user' => $user->toApi()]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()->toApi()]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Sesión cerrada.']);
    }
}
