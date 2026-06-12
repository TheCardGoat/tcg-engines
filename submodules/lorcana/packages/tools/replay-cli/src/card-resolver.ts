import * as path from "node:path";
import * as fs from "node:fs/promises";
import { getAllCardsById } from "@tcg/lorcana-cards";

const CARD_DIRECTORY_BY_TYPE = {
  action: "actions",
  character: "characters",
  item: "items",
  location: "locations",
} as const;

const REPO_REL_CARDS_ROOT = "packages/lorcana/lorcana-cards/src/cards";

const ABS_CARDS_ROOT = path.resolve(
  import.meta.dir,
  "../../../../packages/lorcana/lorcana-cards/src/cards",
);

const dirCache = new Map<string, string[]>();

async function listSetTypeDir(set: string, dir: string): Promise<string[]> {
  const key = `${set}|${dir}`;
  const cached = dirCache.get(key);
  if (cached) return cached;
  const absDir = path.join(ABS_CARDS_ROOT, set, dir);
  try {
    const entries = await fs.readdir(absDir);
    dirCache.set(key, entries);
    return entries;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    // ENOENT just means the set/type combo isn't on disk — common and not noteworthy.
    // Surface anything else (permissions, IO errors) to stderr so the user notices.
    if (code !== "ENOENT") {
      process.stderr.write(`warn: failed to read ${absDir}: ${(err as Error).message}\n`);
    }
    dirCache.set(key, []);
    return [];
  }
}

function padCardNumber(n: number): string {
  return n.toString().padStart(3, "0");
}

async function pickFileById(
  set: string,
  dir: string,
  candidates: string[],
  defId: string,
): Promise<string | undefined> {
  // Match `id: "<defId>"` (single, double, or no surrounding quotes — the
  // canonical form is `id: "WeA"`, but be permissive). The character class
  // anchors against the start of the `id:` property so we don't accidentally
  // pick up strings like `canonicalId: "ci_WeA"`.
  const idPattern = new RegExp(`(?:^|[\\s,{])id:\\s*["']${escapeRegex(defId)}["']`, "m");
  for (const file of candidates) {
    try {
      const abs = path.join(ABS_CARDS_ROOT, set, dir, file);
      const content = await fs.readFile(abs, "utf8");
      if (idPattern.test(content)) return file;
    } catch {
      // Ignore read errors for individual candidates; surface only via the
      // outer-listing warning (already handled in listSetTypeDir).
    }
  }
  return undefined;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface ResolvedCard {
  defId: string;
  name: string;
  fullName: string;
  set: string;
  cardNumber: number;
  cardType: string;
  filePath: string | null;
}

export async function resolveDefIds(defIds: Iterable<string>): Promise<Map<string, ResolvedCard>> {
  const byId = await getAllCardsById();
  const out = new Map<string, ResolvedCard>();

  for (const defId of defIds) {
    const card = byId[defId];
    if (!card) {
      out.set(defId, {
        defId,
        name: "<unknown>",
        fullName: "<unknown>",
        set: "?",
        cardNumber: 0,
        cardType: "?",
        filePath: null,
      });
      continue;
    }
    const cardType = card.cardType;
    const dir = CARD_DIRECTORY_BY_TYPE[cardType as keyof typeof CARD_DIRECTORY_BY_TYPE];
    const padded = padCardNumber(card.cardNumber);
    let filePath: string | null = null;
    if (dir) {
      const files = await listSetTypeDir(card.set, dir);
      // Multiple cards in the same set/type can share a cardNumber — promos
      // (e.g. `p3-055-violet-parr-...-promo.ts`) sit alongside the regular
      // `055-maleficent-...-traveler.ts`. Filter to all `.ts` source files
      // whose name *contains* `-NNN-` or starts with `NNN-` (covers the
      // `pN-NNN-...` promo prefix), then disambiguate by reading the file
      // contents and matching on `id: "<defId>"`.
      const candidates = files.filter(
        (f) =>
          f.endsWith(".ts") &&
          !f.endsWith(".test.ts") &&
          !f.endsWith(".i18n.ts") &&
          (f.startsWith(`${padded}-`) || f.includes(`-${padded}-`)),
      );

      let match: string | undefined;
      if (candidates.length === 1) {
        match = candidates[0];
      } else if (candidates.length > 1) {
        match = await pickFileById(card.set, dir, candidates, defId);
        // Fall back to the un-prefixed (regular, non-promo) candidate if no
        // file content matched — better than nothing.
        if (!match) {
          match = candidates.find((f) => f.startsWith(`${padded}-`)) ?? candidates[0];
        }
      }

      if (match) {
        filePath = `${REPO_REL_CARDS_ROOT}/${card.set}/${dir}/${match}`;
      }
    }
    const version = "version" in card && card.version ? ` - ${card.version}` : "";
    out.set(defId, {
      defId,
      name: card.name,
      fullName: `${card.name}${version}`,
      set: card.set,
      cardNumber: card.cardNumber,
      cardType,
      filePath,
    });
  }
  return out;
}
