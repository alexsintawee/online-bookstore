<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\LoadPromotions;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\App;

class PromotionController extends Controller
{
    /** GET /api/promotions */
    public function index(): JsonResponse
    {
        try {
            $dataDir = config('bookstore.data_path');
            $data = LoadPromotions::getPromotionData($dataDir);
            return response()->json($data);
        } catch (\Throwable $e) {
            return response()->json(['error' => config('core.api.error_failed_load_promotions', 'Failed to load promotions')], 500);
        }
    }
}
