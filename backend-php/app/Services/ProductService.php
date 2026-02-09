<?php

namespace App\Services;

use App\Repositories\ProductRepository;

class ProductService
{
    public function __construct(
        private readonly ProductRepository $productRepo,
    ) {
    }

    /** @return array<int, array{sku: string, name: string, price: float, imageUrl: string}> */
    public function getAllProducts(): array
    {
        $out = [];
        foreach ($this->productRepo->getAll() as $p) {
            $prefix = config('core.api.image_url_prefix', '/api/images');
            $imageUrl = $p->image
                ? (str_starts_with($p->image, '/') || str_starts_with($p->image, 'http'))
                    ? $p->image
                    : $prefix . '/' . $p->image
                : $prefix . '/' . $p->sku . '.svg';
            $out[] = [
                'sku' => $p->sku,
                'name' => $p->name,
                'price' => round($p->getPrice()->toDollars(), 2),
                'imageUrl' => $imageUrl,
            ];
        }
        return $out;
    }

    /** @return array<string, \App\Domain\Product> */
    public function getProductMap(): array
    {
        return $this->productRepo->getMap();
    }
}
