<?php

namespace App\Repositories;

use App\Domain\Product;
use App\ParseCsv;

class ProductRepository
{
    /** @var array<string, Product> */
    private array $products = [];
    private bool $loaded = false;

    public function __construct(
        private readonly string $dataDir,
    ) {
    }

    private function resolvePath(): ?array
    {
        $paths = config('bookstore.paths', []);
        $csvRel = $paths['products_csv'] ?? 'source/csv/products.csv';
        $jsonRel = $paths['products_json'] ?? 'source/json/products.json';
        $csvCandidates = [
            $this->dataDir . '/' . $csvRel,
            getcwd() . '/data/' . $csvRel,
            getcwd() . '/../data/' . $csvRel,
        ];
        foreach ($csvCandidates as $p) {
            if (is_file($p)) {
                return ['path' => $p, 'format' => 'csv'];
            }
        }
        $jsonCandidates = [
            $this->dataDir . '/' . $jsonRel,
            getcwd() . '/data/' . $jsonRel,
            getcwd() . '/../data/' . $jsonRel,
        ];
        foreach ($jsonCandidates as $p) {
            if (is_file($p)) {
                return ['path' => $p, 'format' => 'json'];
            }
        }
        return null;
    }

    private static function defaultProductRows(): array
    {
        return config('core.default_products', []);
    }

    private function load(): void
    {
        if ($this->loaded) {
            return;
        }
        $resolved = $this->resolvePath();
        $rows = [];
        if ($resolved !== null) {
            $raw = @file_get_contents($resolved['path']);
            if ($raw === false) {
                $rows = self::defaultProductRows();
            } elseif ($resolved['format'] === 'csv') {
                $parsed = ParseCsv::parse($raw);
                foreach ($parsed['rows'] as $values) {
                    $o = ParseCsv::rowToObject($parsed['headers'], $values);
                    $rows[] = [
                        'sku' => $o['sku'] ?? '',
                        'name' => $o['name'] ?? '',
                        'price' => (float) ($o['price'] ?? 0),
                        'imageUrl' => $o['imageUrl'] ?? null,
                        'image' => $o['image'] ?? null,
                    ];
                }
            } else {
                $decoded = json_decode($raw, true);
                $rows = is_array($decoded) ? $decoded : (isset($decoded['products']) ? $decoded['products'] : self::defaultProductRows());
            }
        } else {
            $rows = self::defaultProductRows();
        }
        if ($rows === []) {
            $rows = self::defaultProductRows();
        }
        $this->products = [];
        foreach ($rows as $r) {
            $sku = $r['sku'] ?? '';
            $name = $r['name'] ?? '';
            if ($sku === '' || $name === '') {
                continue;
            }
            $price = isset($r['price']) ? (float) $r['price'] : 0;
            $image = $r['imageUrl'] ?? $r['image'] ?? null;
            $this->products[$sku] = new Product($sku, $name, (int) round($price * 100), $image);
        }
        $this->loaded = true;
    }

    /** @return Product[] */
    public function getAll(): array
    {
        $this->load();
        return array_values($this->products);
    }

    public function getBySku(string $sku): ?Product
    {
        $this->load();
        return $this->products[$sku] ?? null;
    }

    /** @return array<string, Product> */
    public function getMap(): array
    {
        $this->load();
        return $this->products;
    }
}
