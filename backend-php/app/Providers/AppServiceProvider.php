<?php

namespace App\Providers;

use App\Domain\PricingEngine;
use App\LoadPromotions;
use App\Repositories\CartRepository;
use App\Repositories\ProductRepository;
use App\Services\CartService;
use App\Services\ProductService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $dataDir = config('bookstore.data_path');

        $this->app->singleton(ProductRepository::class, function () use ($dataDir) {
            return new ProductRepository($dataDir);
        });

        $this->app->singleton(CartRepository::class, function () {
            return new CartRepository();
        });

        $this->app->singleton(PricingEngine::class, function () use ($dataDir) {
            $rules = LoadPromotions::load($dataDir);
            return new PricingEngine($rules);
        });

        $this->app->singleton(ProductService::class, function ($app) {
            return new ProductService($app->make(ProductRepository::class));
        });

        $this->app->singleton(CartService::class, function ($app) {
            return new CartService(
                $app->make(CartRepository::class),
                $app->make(ProductRepository::class),
                $app->make(PricingEngine::class)
            );
        });
    }

    public function boot(): void
    {
        //
    }
}
