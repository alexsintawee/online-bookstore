<?php

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\ServiceProvider;

$corePath = __DIR__ . '/core/json/config.json';
$core = is_file($corePath) ? json_decode(file_get_contents($corePath), true) : [];
$appCore = $core['app'] ?? [];

return [
    'name' => env('APP_NAME', $appCore['name'] ?? 'Online Bookstore API'),
    'env' => env('APP_ENV', $appCore['env'] ?? 'production'),
    'debug' => (bool) env('APP_DEBUG', $appCore['debug'] ?? false),
    'url' => env('APP_URL', $appCore['url'] ?? 'http://localhost:5555'),
    'timezone' => $appCore['timezone'] ?? 'UTC',
    'locale' => $appCore['locale'] ?? 'en',
    'fallback_locale' => $appCore['fallback_locale'] ?? 'en',
    'faker_locale' => $appCore['faker_locale'] ?? 'en_US',
    'key' => env('APP_KEY'),
    'cipher' => $appCore['cipher'] ?? 'AES-256-CBC',
    'maintenance' => [
        'driver' => $appCore['maintenance_driver'] ?? 'file',
    ],
    'providers' => ServiceProvider::defaultProviders()->merge([
        App\Providers\AppServiceProvider::class,
    ])->toArray(),
    'aliases' => Facade::defaultAliases()->merge([])->toArray(),
];
