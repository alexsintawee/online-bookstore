/**
 * Parse CSV string into rows of fields. Handles quoted fields (commas and newlines inside quotes).
 * First row is treated as header; returns { headers: string[], rows: string[][] }.
 */
export function parseCsv(csv: string): { headers: string[]; rows: string[][] } {
  const lines = splitCsvLines(csv);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map(parseCsvLine).filter((row) => row.some((c) => c !== ''));
  return { headers, rows };
}

function splitCsvLines(csv: string): string[] {
  const lines: string[] = [];
  let i = 0;
  let start = 0;
  let inQuotes = false;
  while (i < csv.length) {
    const c = csv[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      i++;
      continue;
    }
    if (!inQuotes && (c === '\n' || c === '\r')) {
      const line = csv.slice(start, i).trim();
      if (line) lines.push(line);
      if (c === '\r' && csv[i + 1] === '\n') i++;
      start = i + 1;
    }
    i++;
  }
  const last = csv.slice(start).trim();
  if (last) lines.push(last);
  return lines;
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let end = i + 1;
      let s = '';
      while (end < line.length) {
        if (line[end] === '"') {
          if (line[end + 1] === '"') {
            s += '"';
            end += 2;
            continue;
          }
          end++;
          break;
        }
        s += line[end];
        end++;
      }
      fields.push(s);
      i = end;
      if (line[i] === ',') i++;
      continue;
    }
    const comma = line.indexOf(',', i);
    if (comma === -1) {
      fields.push(line.slice(i).trim());
      break;
    }
    fields.push(line.slice(i, comma).trim());
    i = comma + 1;
  }
  return fields;
}

/** Build object from headers and row values; empty string becomes undefined for optional use */
export function rowToObject(headers: string[], values: string[]): Record<string, string> {
  const obj: Record<string, string> = {};
  headers.forEach((h, i) => {
    const v = values[i];
    if (v !== undefined && v !== '') obj[h.trim()] = v.trim();
  });
  return obj;
}
