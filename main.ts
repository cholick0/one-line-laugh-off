import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY =
  "I asked my horoscope for good news, so it told me Mercury is in retrograde and my ex is too.";

// One-Line Laugh-Off — judge brief:
// A single funny line, at most 200 characters, no setup notes and no
// explanation. The judge weighs, in order: genuinely funny; how hard and
// how suddenly the line lands on a cold read; surprise (a turn the reader
// did not see coming); economy (every word earning its place); freshness.
// Length for its own sake does not count.
//
// Self-check gate: the entry must be 1-200 chars, a single non-blank line.
const MIN_CHARS = 1;
const MAX_CHARS = 200;
function validateEntry(entry: string): number {
  const chars = [...entry];
  if (chars.length < MIN_CHARS || chars.length > MAX_CHARS) {
    throw new Error(
      `entry is ${chars.length} characters, must be ${MIN_CHARS}-${MAX_CHARS}`,
    );
  }
  if (entry.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (entry.includes("\n") || entry.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  return chars.length;
}

const charCount = validateEntry(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = `${outDir}/entry.txt`;
writeFileSync(outPath, ENTRY, "utf8");

// Read-back verification: the file must be byte-for-byte identical,
// compared as raw bytes so no encoding normalisation can hide a change.
function verifyReadBack(path: string, expected: string): void {
  const readBack = readFileSync(path);
  const expectedBytes = Buffer.from(expected, "utf8");
  if (!readBack.equals(expectedBytes)) {
    throw new Error("read-back mismatch: entry.txt does not match ENTRY");
  }
}

verifyReadBack(outPath, ENTRY);
console.log(
  `wrote ${charCount} characters to ${outPath} (verified byte-for-byte)`,
);
