<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatalogoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes (IPS v2)
|--------------------------------------------------------------------------
| Todas las rutas aquí quedan bajo el prefijo /api y usan auth de sesión
| (Sanctum SPA). El login es público; el resto exige sesión (auth:sanctum).
*/

// --- Autenticación ---
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // --- Catálogos (solo lectura, datos reales) ---
    Route::prefix('catalogos')->group(function () {
        Route::get('medicamentos', [CatalogoController::class, 'medicamentos']);
        Route::get('vacunas', [CatalogoController::class, 'vacunas']);
        Route::get('alergias', [CatalogoController::class, 'alergias']);
        Route::get('examenes', [CatalogoController::class, 'examenes']);
    });

    // --- Demás módulos del sistema (pendientes) ---
    // Sigue el patrón de CatalogoController. Ejemplo:
    // Route::apiResource('citas', CitaController::class);
});
