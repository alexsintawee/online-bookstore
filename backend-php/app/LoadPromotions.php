<?php

namespace App;

use App\Domain\Discounts\BulkPriceRule;
use App\Domain\Discounts\DiscountRule;
use App\Domain\Discounts\ThreeForTwoRule;

final class LoadPromotions
{
    /** @var DiscountRule[] */
    private static array $defaultRules = [];

    /** @return DiscountRule[] */
    private static function getDefaultRules(): array
    {
        if (self::$defaultRules !== []) {
            return self::$defaultRules;
        }
        $rulesConfig = config('core.default_discount_rules', []);
        foreach ($rulesConfig as $r) {
            if (empty($r['type']) || empty($r['sku'])) {
                continue;
            }
            if (($r['type'] ?? '') === 'bulk_price') {
                $minQty = (int) ($r['minQuantity'] ?? 0);
                $priceCents = (int) ($r['discountedUnitPriceCents'] ?? 0);
                if ($minQty >= 1 && $priceCents >= 0) {
                    self::$defaultRules[] = new BulkPriceRule($r['sku'], $minQty, $priceCents);
                }
            } elseif (($r['type'] ?? '') === 'multi_buy_free') {
                $groupSize = max(1, (int) ($r['groupSize'] ?? 3));
                $freeCount = max(0, min((int) ($r['freeCount'] ?? 1), $groupSize));
                self::$defaultRules[] = new ThreeForTwoRule($r['sku'], $groupSize, $freeCount);
            }
        }
        if (self::$defaultRules === []) {
            self::$defaultRules = [
                new BulkPriceRule('9780201835953', 10, 2199),
                new ThreeForTwoRule('9781430219484'),
            ];
        }
        return self::$defaultRules;
    }

    /**
     * Load discount rules from data/source/csv/promotion.csv (or .json fallback).
     * @return DiscountRule[]
     */
    public static function load(string $dataDir): array
    {
        $csvCandidates = [
            $dataDir . '/source/csv/promotion.csv',
            getcwd() . '/data/source/csv/promotion.csv',
            getcwd() . '/../data/source/csv/promotion.csv',
        ];
        foreach ($csvCandidates as $p) {
            if (is_file($p)) {
                $raw = @file_get_contents($p);
                if ($raw !== false) {
                    return self::parsePromotionsFromCsv($raw);
                }
                return self::getDefaultRules();
            }
        }
        $jsonCandidates = [
            $dataDir . '/' . $jsonRel,
            getcwd() . '/data/' . $jsonRel,
            getcwd() . '/../data/' . $jsonRel,
        ];
        foreach ($jsonCandidates as $p) {
            if (is_file($p)) {
                $raw = @file_get_contents($p);
                if ($raw !== false) {
                    $config = json_decode($raw, true);
                    return self::parsePromotions($config ?? []);
                }
                return self::getDefaultRules();
            }
        }
        return self::getDefaultRules();
    }

    /**
     * @param array{promotions?: array} $config
     * @return DiscountRule[]
     */
    private static function parsePromotions(array $config): array
    {
        $promotions = $config['promotions'] ?? null;
        if (!is_array($promotions)) {
            return self::getDefaultRules();
        }
        $rules = [];
        foreach ($promotions as $p) {
            if (empty($p['type']) || empty($p['sku'])) {
                continue;
            }
            if ($p['type'] === 'bulk_price') {
                $minQty = (int) ($p['minQuantity'] ?? 0);
                $priceCents = (int) round((float) ($p['discountedUnitPrice'] ?? 0) * 100);
                if ($minQty >= 1 && $priceCents >= 0) {
                    $rules[] = new BulkPriceRule($p['sku'], $minQty, $priceCents);
                }
            } elseif ($p['type'] === 'multi_buy_free') {
                $groupSize = max(1, (int) ($p['groupSize'] ?? 3));
                $freeCount = max(0, min((int) ($p['freeCount'] ?? 1), $groupSize));
                $rules[] = new ThreeForTwoRule($p['sku'], $groupSize, $freeCount);
            }
        }
        return $rules !== [] ? $rules : self::getDefaultRules();
    }

    /** @return DiscountRule[] */
    private static function parsePromotionsFromCsv(string $raw): array
    {
        $parsed = ParseCsv::parse($raw);
        $headers = $parsed['headers'];
        $rules = [];
        foreach ($parsed['rows'] as $values) {
            $p = ParseCsv::rowToObject($headers, $values);
            if (empty($p['type']) || empty($p['sku'])) {
                continue;
            }
            if ($p['type'] === 'bulk_price') {
                $minQty = (int) ($p['minQuantity'] ?? 0);
                $priceCents = (int) round((float) ($p['discountedUnitPrice'] ?? 0) * 100);
                if ($minQty >= 1 && $priceCents >= 0) {
                    $rules[] = new BulkPriceRule($p['sku'], $minQty, $priceCents);
                }
            } elseif ($p['type'] === 'multi_buy_free') {
                $groupSize = max(1, (int) ($p['groupSize'] ?? 3));
                $freeCount = max(0, min((int) ($p['freeCount'] ?? 1), $groupSize));
                $rules[] = new ThreeForTwoRule($p['sku'], $groupSize, $freeCount);
            }
        }
        return $rules !== [] ? $rules : self::getDefaultRules();
    }

    /**
     * Load promotion data for API (same source as load). Returns [ 'promotions' => PromotionRow[] ].
     * @return array{promotions: array}
     */
    public static function getPromotionData(string $dataDir): array
    {
        $defaultData = config('core.default_promotions', ['promotions' => []]);
        $paths = config('bookstore.paths', []);
        $csvRel = $paths['promotion_csv'] ?? 'source/csv/promotion.csv';
        $jsonRel = $paths['promotion_json'] ?? 'source/json/promotion.json';
        $csvCandidates = [
            $dataDir . '/' . $csvRel,
            getcwd() . '/data/' . $csvRel,
            getcwd() . '/../data/' . $csvRel,
        ];
        foreach ($csvCandidates as $p) {
            if (is_file($p)) {
                $raw = @file_get_contents($p);
                if ($raw !== false) {
                    $parsed = ParseCsv::parse($raw);
                    $promotions = self::csvRowsToPromotionData($parsed['headers'], $parsed['rows']);
                    $defaultPromos = $defaultData['promotions'] ?? [];
                    return ['promotions' => $promotions !== [] ? $promotions : $defaultPromos];
                }
            }
        }
        $jsonCandidates = [
            $dataDir . '/' . $jsonRel,
            getcwd() . '/data/' . $jsonRel,
            getcwd() . '/../data/' . $jsonRel,
        ];
        foreach ($jsonCandidates as $p) {
            if (is_file($p)) {
                $raw = @file_get_contents($p);
                if ($raw !== false) {
                    $config = json_decode($raw, true);
                    if (!empty($config['promotions']) && is_array($config['promotions'])) {
                        return $config;
                    }
                    return $defaultData;
                }
            }
        }
        return $defaultData;
    }

    /**
     * @param string[] $headers
     * @param string[][] $rows
     * @return array[]
     */
    private static function csvRowsToPromotionData(array $headers, array $rows): array
    {
        $result = [];
        foreach ($rows as $values) {
            $p = ParseCsv::rowToObject($headers, $values);
            if (empty($p['type']) || empty($p['sku'])) {
                continue;
            }
            if ($p['type'] === 'bulk_price') {
                $result[] = [
                    'type' => 'bulk_price',
                    'id' => $p['id'] ?? $p['sku'],
                    'sku' => $p['sku'],
                    'minQuantity' => (int) ($p['minQuantity'] ?? 0),
                    'discountedUnitPrice' => (float) ($p['discountedUnitPrice'] ?? 0),
                    'description' => $p['description'] ?? null,
                ];
            } elseif ($p['type'] === 'multi_buy_free') {
                $result[] = [
                    'type' => 'multi_buy_free',
                    'id' => $p['id'] ?? $p['sku'],
                    'sku' => $p['sku'],
                    'groupSize' => (int) ($p['groupSize'] ?? 3),
                    'freeCount' => (int) ($p['freeCount'] ?? 1),
                    'description' => $p['description'] ?? null,
                ];
            }
        }
        return $result;
    }
}
