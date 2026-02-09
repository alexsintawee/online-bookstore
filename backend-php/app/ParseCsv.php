<?php

namespace App;

/**
 * Parse CSV string into rows of fields. Handles quoted fields (commas and newlines inside quotes).
 * First row is treated as header; returns [ 'headers' => string[], 'rows' => string[][] ].
 */
final class ParseCsv
{
    /**
     * @return array{headers: string[], rows: string[][]}
     */
    public static function parse(string $csv): array
    {
        $lines = self::splitCsvLines($csv);
        if ($lines === []) {
            return ['headers' => [], 'rows' => []];
        }
        $headers = self::parseCsvLine($lines[0]);
        $rows = array_values(array_filter(
            array_map([self::class, 'parseCsvLine'], array_slice($lines, 1)),
            fn (array $row) => array_sum(array_map(fn ($c) => $c !== '' ? 1 : 0, $row)) > 0
        ));
        return ['headers' => $headers, 'rows' => $rows];
    }

    /** @return string[] */
    private static function splitCsvLines(string $csv): array
    {
        $lines = [];
        $i = 0;
        $start = 0;
        $inQuotes = false;
        $len = strlen($csv);
        while ($i < $len) {
            $c = $csv[$i];
            if ($c === '"') {
                $inQuotes = !$inQuotes;
                $i++;
                continue;
            }
            if (!$inQuotes && ($c === "\n" || $c === "\r")) {
                $line = trim(substr($csv, $start, $i - $start));
                if ($line !== '') {
                    $lines[] = $line;
                }
                if ($c === "\r" && ($csv[$i + 1] ?? '') === "\n") {
                    $i++;
                }
                $start = $i + 1;
            }
            $i++;
        }
        $last = trim(substr($csv, $start));
        if ($last !== '') {
            $lines[] = $last;
        }
        return $lines;
    }

    /** @return string[] */
    private static function parseCsvLine(string $line): array
    {
        $fields = [];
        $i = 0;
        $len = strlen($line);
        while ($i < $len) {
            if ($line[$i] === '"') {
                $end = $i + 1;
                $s = '';
                while ($end < $len) {
                    if ($line[$end] === '"') {
                        if (($line[$end + 1] ?? '') === '"') {
                            $s .= '"';
                            $end += 2;
                            continue;
                        }
                        $end++;
                        break;
                    }
                    $s .= $line[$end];
                    $end++;
                }
                $fields[] = $s;
                $i = $end;
                if (($line[$i] ?? '') === ',') {
                    $i++;
                }
                continue;
            }
            $comma = strpos($line, ',', $i);
            if ($comma === false) {
                $fields[] = trim(substr($line, $i));
                break;
            }
            $fields[] = trim(substr($line, $i, $comma - $i));
            $i = $comma + 1;
        }
        return $fields;
    }

    /**
     * @param string[] $headers
     * @param string[] $values
     * @return array<string, string>
     */
    public static function rowToObject(array $headers, array $values): array
    {
        $obj = [];
        foreach ($headers as $idx => $h) {
            $v = $values[$idx] ?? null;
            if ($v !== null && $v !== '') {
                $obj[trim($h)] = trim($v);
            }
        }
        return $obj;
    }
}
