<?php

$path = __DIR__ . '/core/json/config.json';
$json = is_file($path) ? file_get_contents($path) : '{}';
$core = json_decode($json, true) ?: [];

$app = $core['app'] ?? [];
$bookstore = $core['bookstore'] ?? [];
$paths = $bookstore['paths'] ?? [];

$dataPath = env('DATA_PATH', $bookstore['data_path'] ?? '../data');
if ($dataPath === '' || str_starts_with($dataPath, '.') || !str_contains($dataPath, DIRECTORY_SEPARATOR)) {
    $dataPath = base_path($dataPath ?: '../data');
}
$resolved = realpath($dataPath);
if ($resolved !== false) {
    $dataPath = $resolved;
}

return [
    'bookstore' => [
        'data_path' => $dataPath,
        'paths' => [
            'products_csv' => $paths['products_csv'] ?? 'source/csv/products.csv',
            'products_json' => $paths['products_json'] ?? 'source/json/products.json',
            'promotion_csv' => $paths['promotion_csv'] ?? 'source/csv/promotion.csv',
            'promotion_json' => $paths['promotion_json'] ?? 'source/json/promotion.json',
            'images_subpath' => $paths['images_subpath'] ?? 'source/images',
        ],
    ],
    'default_products' => $core['default_products'] ?? [],
    'default_promotions' => $core['default_promotions'] ?? ['promotions' => []],
    'default_discount_rules' => $core['default_discount_rules'] ?? [],
    'api' => $core['api'] ?? [],
    'serve' => $core['serve'] ?? ['port' => 5555],
    'cors' => $core['cors'] ?? [],
];
