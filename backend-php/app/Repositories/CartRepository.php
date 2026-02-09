<?php

namespace App\Repositories;

use App\Domain\Cart;
use App\Domain\CartItem;

class CartRepository
{
    private const CART_STORAGE_DIR = 'framework/carts';

    private function storagePath(): string
    {
        return storage_path(self::CART_STORAGE_DIR);
    }

    private function filePath(string $id): string
    {
        // Cart IDs from generateId() are safe (alphanumeric + hyphen); otherwise sanitize for filesystem
        $safe = preg_replace('/[^a-zA-Z0-9\-]/', '_', $id);
        return $this->storagePath() . '/' . $safe . '.json';
    }

    private function ensureStorageDir(): void
    {
        $dir = $this->storagePath();
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
    }

    /** Persist cart to file so it survives between requests */
    private function persist(Cart $cart): void
    {
        $this->ensureStorageDir();
        $items = array_map(
            fn (CartItem $item) => ['sku' => $item->sku, 'quantity' => $item->quantity],
            $cart->getItems()
        );
        $data = ['id' => $cart->id, 'items' => $items];
        $path = $this->filePath($cart->id);
        file_put_contents($path, json_encode($data, JSON_THROW_ON_ERROR));
    }

    /** Load cart from file or return null if not found */
    private function load(string $id): ?Cart
    {
        $path = $this->filePath($id);
        if (!is_readable($path)) {
            return null;
        }
        $raw = file_get_contents($path);
        if ($raw === false) {
            return null;
        }
        try {
            $data = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return null;
        }
        if (!is_array($data) || !isset($data['id']) || !isset($data['items']) || !is_array($data['items'])) {
            return null;
        }
        $cart = new Cart($data['id']);
        foreach ($data['items'] as $item) {
            if (isset($item['sku'], $item['quantity'])) {
                $cart->setQuantity($item['sku'], (int) $item['quantity']);
            }
        }
        return $cart;
    }

    public function create(): Cart
    {
        $id = $this->generateId();
        $cart = new Cart($id);
        $this->persist($cart);
        return $cart;
    }

    public function getById(string $id): ?Cart
    {
        return $this->load($id);
    }

    public function save(Cart $cart): void
    {
        $this->persist($cart);
    }

    private function generateId(): string
    {
        return 'cart-' . (string) (int) (microtime(true) * 1000) . '-' . substr(bin2hex(random_bytes(5)), 0, 9);
    }
}
