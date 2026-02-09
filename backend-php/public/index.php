<?php

define('LARAVEL_START', microtime(true));

// Suppress PHP 8.5+ deprecation notices (e.g. PDO::MYSQL_ATTR_SSL_CA in Laravel vendor) so they don't break JSON responses
error_reporting(E_ALL & ~E_DEPRECATED);

if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);
