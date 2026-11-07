<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alergia;
use App\Models\Examen;
use App\Models\Medicamento;
use App\Models\Vacuna;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Catálogos del sistema (solo lectura sobre la BD intacta).
 *
 * Patrón de referencia para los demás módulos: búsqueda (?search=),
 * paginación (?page=&per_page=) y una forma de respuesta uniforme
 * { data: [...], meta: { current_page, last_page, per_page, total } }.
 */
class CatalogoController extends Controller
{
    public function medicamentos(Request $request): JsonResponse
    {
        $query = Medicamento::query();

        if ($search = $request->query('search')) {
            $query->where('producto', 'like', "%{$search}%");
        }

        $page = $query->orderBy('producto')->paginate($this->perPage($request));

        return $this->paginated($page, fn ($m) => [
            'id' => $m->id,
            'nombre' => $m->producto,
        ]);
    }

    public function vacunas(Request $request): JsonResponse
    {
        return $this->simpleCatalog(Vacuna::query(), $request);
    }

    public function alergias(Request $request): JsonResponse
    {
        return $this->simpleCatalog(Alergia::query(), $request);
    }

    public function examenes(Request $request): JsonResponse
    {
        $query = Examen::query();

        if ($search = $request->query('search')) {
            $query->where(function (Builder $q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%");
            });
        }

        $page = $query->orderBy('nombre')->paginate($this->perPage($request));

        return $this->paginated($page, fn ($e) => [
            'id' => $e->id,
            'nombre' => $e->nombre,
            'codigo' => $e->codigo,
            'tarifa_soat' => $e->tarifa_soat,
        ]);
    }

    /** Catálogo simple con una sola columna `nombre`. */
    private function simpleCatalog(Builder $query, Request $request): JsonResponse
    {
        if ($search = $request->query('search')) {
            $query->where('nombre', 'like', "%{$search}%");
        }

        $page = $query->orderBy('nombre')->paginate($this->perPage($request));

        return $this->paginated($page, fn ($row) => [
            'id' => $row->id,
            'nombre' => $row->nombre,
        ]);
    }

    private function perPage(Request $request): int
    {
        return min(max((int) $request->query('per_page', 15), 1), 100);
    }

    /** Normaliza la respuesta paginada mapeando cada item. */
    private function paginated(LengthAwarePaginator $page, callable $map): JsonResponse
    {
        return response()->json([
            'data' => collect($page->items())->map($map)->values(),
            'meta' => [
                'current_page' => $page->currentPage(),
                'last_page' => $page->lastPage(),
                'per_page' => $page->perPage(),
                'total' => $page->total(),
            ],
        ]);
    }
}
