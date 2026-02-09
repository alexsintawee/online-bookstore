<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;

class ImageController extends Controller
{
    /** Serve a single image from data/source/images by filename. */
    public function show(string $filename): Response|array
    {
        if (str_contains($filename, '/') || str_contains($filename, '\\')) {
            abort(404);
        }
        $imagesPath = config('bookstore.data_path') . '/' . (config('bookstore.paths.images_subpath') ?? 'source/images');
        $baseReal = realpath($imagesPath);
        if ($baseReal === false) {
            abort(404);
        }
        $resolved = realpath($imagesPath . '/' . $filename);
        if ($resolved === false || !str_starts_with($resolved, $baseReal)) {
            abort(404);
        }
        if (!File::isFile($resolved)) {
            abort(404);
        }
        $mime = File::mimeType($resolved) ?: 'application/octet-stream';
        return response(File::get($resolved), 200, [
            'Content-Type' => $mime,
        ]);
    }
}
