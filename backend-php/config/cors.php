<?php

$corePath = __DIR__ . '/core/json/config.json';
$core = is_file($corePath) ? json_decode(file_get_contents($corePath), true) : [];
$cors = $core['cors'] ?? [];

return [
    'paths' => $cors['paths'] ?? ['api/*', 'api/images/*', 'images/*'],
    'allowed_methods' => $cors['allowed_methods'] ?? ['*'],
    'allowed_origins' => $cors['allowed_origins'] ?? ['*'],
    'allowed_origins_patterns' => $cors['allowed_origins_patterns'] ?? [],
    'allowed_headers' => $cors['allowed_headers'] ?? ['*'],
    'exposed_headers' => $cors['exposed_headers'] ?? [],
    'max_age' => $cors['max_age'] ?? 0,
    'supports_credentials' => $cors['supports_credentials'] ?? false,
];
