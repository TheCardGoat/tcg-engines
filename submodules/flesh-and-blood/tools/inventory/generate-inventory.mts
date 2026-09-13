/**
 * Flesh and Blood implementation inventory generator.
 *
 * Emits docs/implementation-inventory.json: one machine-readable,
 * token-efficient inventory of every catalog card keyed by canonicalId,
 * grouped by card-text similarity (trigger event + effect verbs) so agents
 * can be batched per group to author abilities and behavior tests.
 *
 * Status flags (see JSON `_meta.defs`):
 *   done — abilities hand-authored AND covered by a behavior test
 *   auth — abilities authored, no behavior test yet
 *   todo — printed rules text exists, abilities not authored
 *   van  — no printed text (vanilla), untested
 *
 * Usage: node --experimental-strip-types tools/inventory/generate-inventory.mts
 * (run from the flesh-and-blood submodule root)
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

import { fleshAndBloodCatalog } from "../../packages/cards/src/generated/flesh-and-blood-catalog.ts";

const ROOT = new URL("../..", import.meta.url).pathname;
const CARDS_DIR = join(ROOT, "packages/cards/src/cards");
const ENGINE_SRC = join(ROOT, "packages/engine/src");
const OUT_PATH = join(ROOT, "docs/implementation-inventory.json");

// ---------------------------------------------------------------------------
// 1. Filesystem scan: card modules and co-located tests
// ---------------------------------------------------------------------------

/** base name e.g. "UPR170-dampen-red" -> module/test location. */
type ModuleScan = Map<string, { dir: string; hasTest: boolean; testPath?: string }>;

async function scanCardModules(): Promise<{
  scan: ModuleScan;
  /** test files with no same-name module sibling (multi-card suites) */
  orphanTests: string[];
}> {
  const scan = new Map<string, { dir: string; hasTest: boolean; testPath?: string }>();
  const orphanTests: string[] = [];
  const moduleBases = new Set<string>();
  const testFiles: Array<{ base: string; path: string }> = [];
  const sets = await readdir(CARDS_DIR, { withFileTypes: true });
  for (const set of sets) {
    if (!set.isDirectory()) continue;
    const setDir = join(CARDS_DIR, set.name);
    const groups = await readdir(setDir, { withFileTypes: true });
    for (const group of groups) {
      if (!group.isDirectory()) continue;
      const groupDir = join(setDir, group.name);
      const files = await readdir(groupDir);
      for (const file of files) {
        if (!file.endsWith(".ts") || file.endsWith(".i18n.ts")) continue;
        const base = file.replace(/\.test\.ts$|\.ts$/, "");
        const kind = file.endsWith(".test.ts") ? "test" : "module";
        if (kind === "test") {
          testFiles.push({ base, path: join(groupDir, file) });
          continue;
        }
        moduleBases.add(base);
        const entry = scan.get(base) ?? { dir: group.name, hasTest: false };
        scan.set(base, entry);
      }
    }
  }
  for (const { base, path } of testFiles) {
    if (moduleBases.has(base)) {
      const entry = scan.get(base);
      if (entry) {
        entry.hasTest = true;
        entry.testPath = path;
      } else scan.set(base, { dir: "", hasTest: true, testPath: path });
    } else {
      orphanTests.push(path);
    }
  }
  return { scan, orphanTests };
}

/**
 * Multi-card suites with no same-name module sibling: credit the card modules
 * they directly import (their printed subjects), not bare helper mentions.
 * Returns base -> { path (from submodule root), engine }.
 */
async function scanOrphanTests(
  orphanTests: string[],
  scan: ModuleScan,
): Promise<Map<string, { path: string; engine: boolean }>> {
  const covered = new Map<string, { path: string; engine: boolean }>();
  for (const testPath of orphanTests) {
    const content = await readFile(testPath, "utf8");
    const engine = content.includes("FabTestEngine");
    const rel = relative(ROOT, testPath).split(sep).join("/");
    for (const imp of content.matchAll(/from\s+"([^"]+\.ts)"/g)) {
      const file = imp[1]!.split(/[/\\]/).pop()!.replace(/\.ts$/, "");
      if (!scan.has(file)) continue;
      const existing = covered.get(file);
      if (!existing || (engine && !existing.engine)) covered.set(file, { path: rel, engine });
    }
  }
  return covered;
}

/** canonicalId -> base name, from module file contents (first module wins). */
async function mapCanonicalIds(scan: ModuleScan): Promise<Map<string, string[]>> {
  const byCanonical = new Map<string, string[]>();
  for (const [base, meta] of scan) {
    const filePath = join(CARDS_DIR, baseToSet(base), meta.dir, `${base}.ts`);
    let content: string;
    try {
      content = await readFile(filePath, "utf8");
    } catch {
      continue;
    }
    const match = content.match(/canonicalId:\s*"([^"]+)"/);
    if (!match) continue;
    const id = match[1]!;
    const list = byCanonical.get(id) ?? [];
    list.push(base);
    byCanonical.set(id, list);
  }
  return byCanonical;
}

function baseToSet(base: string): string {
  const collector = base.split("-")[0] ?? "";
  return collector.replace(/[0-9]+[a-z]*$/i, "").toUpperCase();
}

// ---------------------------------------------------------------------------
// 2. Engine test scan: direct card-module imports
// ---------------------------------------------------------------------------

async function* walkTests(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkTests(path);
    else if (entry.name.endsWith(".test.ts")) yield path;
  }
}

/** base name -> engine test paths that directly import the card module */
async function scanEngineImports(): Promise<Map<string, string[]>> {
  const covered = new Map<string, string[]>();
  for await (const testPath of walkTests(ENGINE_SRC)) {
    const content = await readFile(testPath, "utf8");
    const imports = content.matchAll(/from\s+"([^"]*cards\/src\/cards\/[^"]+\.ts)"/g);
    for (const imp of imports) {
      const segments = imp[1]!.split(/[/\\]/);
      const file = segments.pop()!.replace(/\.ts$/, "");
      const list = covered.get(file) ?? [];
      const rel = relative(ROOT, testPath).split(sep).join("/");
      list.push(rel);
      covered.set(file, list);
    }
  }
  return covered;
}

// ---------------------------------------------------------------------------
// 3. Ability signature walk (runtime data)
// ---------------------------------------------------------------------------

type Sig = {
  kinds: Set<string>;
  triggers: string[]; // ordered unique trigger event names
  effects: string[]; // ordered unique effect types
  gaps: number; // unparsed/unsupported fragment count
  keywords: Set<string>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function countGaps(node: unknown, acc: { gaps: number }): void {
  if (Array.isArray(node)) {
    for (const item of node) countGaps(item, acc);
    return;
  }
  if (!isRecord(node)) return;
  for (const key of Object.keys(node)) {
    if (key === "unsupported") acc.gaps += 1;
    if (key === "kind" && typeof node[key] === "string" && node[key]!.startsWith("unparsed")) {
      acc.gaps += 1;
    }
    countGaps(node[key], acc);
  }
}

function walkEffects(node: unknown, out: Set<string>): void {
  if (Array.isArray(node)) {
    for (const item of node) walkEffects(item, out);
    return;
  }
  if (!isRecord(node)) return;
  if (typeof node.type === "string" && node.type.length > 0) out.add(node.type);
  for (const key of Object.keys(node)) walkEffects(node[key], out);
}

function triggerName(trigger: Record<string, unknown> | undefined): string | null {
  if (!trigger) return null;
  const event = trigger.event;
  if (isRecord(event) && typeof event.name === "string") return event.name;
  if (typeof trigger.name === "string") return trigger.name;
  return null;
}

function keywordName(kw: unknown): string {
  if (typeof kw === "string") return kw;
  if (isRecord(kw) && typeof kw.name === "string") return kw.name;
  return "keyword";
}

function collectUnder(node: unknown, key: string, out: unknown[]): void {
  if (Array.isArray(node)) {
    for (const item of node) collectUnder(item, key, out);
    return;
  }
  if (!isRecord(node)) return;
  for (const [k, value] of Object.entries(node)) {
    if (k === key && Array.isArray(value)) out.push(...value);
    else collectUnder(value, key, out);
  }
}

function abilityListNotEmpty(card: CardLike): boolean {
  if (Array.isArray(card.abilities) && card.abilities.length > 0) return true;
  const faceAbilities: unknown[] = [];
  collectUnder(card.layout, "abilities", faceAbilities);
  return faceAbilities.length > 0;
}

type CardLike = {
  abilities?: unknown;
  keywords?: unknown;
  layout?: unknown;
};

function abilitySignature(card: CardLike): Sig {
  const sig: Sig = {
    kinds: new Set(),
    triggers: [],
    effects: [],
    gaps: 0,
    keywords: new Set(),
  };
  const triggerSet = new Set<string>();
  const effectSet = new Set<string>();
  // Top-level abilities plus flip/split/meld face abilities under `layout`.
  const abilityList: unknown[] = [];
  if (Array.isArray(card.abilities)) abilityList.push(...card.abilities);
  collectUnder(card.layout, "abilities", abilityList);
  for (const ability of abilityList) {
    if (!isRecord(ability)) continue;
    const kind = typeof ability.kind === "string" ? ability.kind : "?";
    const staticKind = typeof ability.staticKind === "string" ? ability.staticKind : null;
    sig.kinds.add(staticKind ? `${kind}/${staticKind}` : kind);
    const trig = triggerName(ability.trigger as Record<string, unknown> | undefined);
    if (trig) triggerSet.add(trig);
    for (const effectKey of ["effect", "resolution", "modes", "then"]) {
      const value = ability[effectKey];
      if (value !== undefined) walkEffects(value, effectSet);
    }
    if (Array.isArray(ability.layerKeywords)) {
      for (const kw of ability.layerKeywords) sig.keywords.add(keywordName(kw));
    }
  }
  const keywordList: unknown[] = [];
  if (Array.isArray(card.keywords)) keywordList.push(...card.keywords);
  collectUnder(card.layout, "keywords", keywordList);
  for (const kw of keywordList) sig.keywords.add(keywordName(kw));
  sig.triggers = [...triggerSet];
  sig.effects = [...effectSet].filter((type) => !type.startsWith("has-"));
  const acc = { gaps: 0 };
  countGaps(abilityList, acc);
  countGaps(card.layout, acc);
  sig.gaps = acc.gaps;
  const unparsed: unknown[] = [];
  collectUnder(card, "unparsedSegments", unparsed);
  sig.gaps += unparsed.reduce<number>(
    (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
    0,
  );
  return sig;
}

// ---------------------------------------------------------------------------
// 4. Clustering
// ---------------------------------------------------------------------------

function clusterId(sig: Sig, authored: boolean, hasPrintedText: boolean): string {
  if (!authored) return hasPrintedText ? "UNAUTHORED" : "VANILLA";
  const primaryEffect = sig.effects[0] ?? "none";
  if (sig.triggers.length > 0) return `T:${sig.triggers[0]}|F:${primaryEffect}`;
  if (sig.kinds.has("activated")) return `A:activated|F:${primaryEffect}`;
  if (sig.kinds.has("resolution") || sig.kinds.has("modal")) {
    return `R:resolution|F:${primaryEffect}`;
  }
  if (sig.kinds.size > 0) {
    const staticKind = [...sig.kinds].find((k) => k.startsWith("static/")) ?? "static";
    return `S:${staticKind}|F:${primaryEffect}`;
  }
  if (sig.keywords.size > 0) return `K:${[...sig.keywords].sort().join("+")}`;
  return "VANILLA";
}

// ---------------------------------------------------------------------------
// 5. Main
// ---------------------------------------------------------------------------

/**
 * Verified OUT_OF_SCOPE verdicts, operator-only. These cards are
 * excluded from groups and remaining-work counts, recorded in `_meta.wont`.
 * Rescinding a verdict = delete the row here and regenerate.
 */
const WONT: Record<string, string> = {
  "CIN029-marked": "CR 9.3 card-face representation, no game behavior to implement",
  "LGS360-cracker-bauble-yellow": "physical novelty action outside digital 1v1 scope",
  "LSS002-go-bananas-yellow": "physical novelty action outside digital 1v1 scope",
  "SMP008-benefactor-of-bloodworth-goldmane":
    "Smash Palace Event Deck card; multiplayer/Ultimate Pit Fight format is outside digital 1v1 scope",
  "SMP009-big-hits-big-applause":
    "Smash Palace Event Deck card; multiplayer/Ultimate Pit Fight format is outside digital 1v1 scope",
  "SMP011-hit-the-jackpot":
    "Smash Palace Event Deck card; multiplayer/Ultimate Pit Fight format is outside digital 1v1 scope",
  "SMP013-visit-the-winner-takes-all":
    "Smash Palace Event Deck card; multiplayer/Ultimate Pit Fight format is outside digital 1v1 scope",
  "SMP022-didn-t-see-that-coming":
    "Smash Palace Event Deck card; multiplayer/Ultimate Pit Fight format is outside digital 1v1 scope",
  "SMP023-dominate-the-competition":
    "Smash Palace Event Deck card; multiplayer/Ultimate Pit Fight format is outside digital 1v1 scope",
  "SMP024-ez-sqeez-bookie-syndicate":
    "Smash Palace Event Deck card; multiplayer/Ultimate Pit Fight format is outside digital 1v1 scope",
  "WTR224-cracked-bauble-yellow":
    "sealed card-pool / deckbuilding-only text; no outside-the-game engine primitive",
};

async function main(): Promise<void> {
  const catalog = fleshAndBloodCatalog;
  const { fleshAndBloodStructuredCardsByCanonicalId: cardMap } =
    await import("../../packages/cards/src/cards/index.ts");
  const catalogByCanonicalId = new Map(
    catalog.cards.map((card) => [card.canonicalId, card] as const),
  );
  const { scan, orphanTests } = await scanCardModules();
  const engineImports = await scanEngineImports();
  const orphanCoverage = await scanOrphanTests(orphanTests, scan);
  const canonicalBases = await mapCanonicalIds(scan);

  type Row = {
    base: string;
    status: "done" | "auth" | "todo" | "van" | "wont";
    t: 0 | 1 | 2 | 3 | 4; // 0 none, 1 co-located engine, 2 engine subject test, 3 model-only, 4 engine helper-mention only
    g: number;
    sig: Sig;
    cluster: string;
    refs: string[];
  };

  const rows: Row[] = [];

  for (const [canonicalId, card] of cardMap) {
    const bases = canonicalBases.get(canonicalId) ?? [];
    const catalogCard = catalogByCanonicalId.get(canonicalId);
    if (!catalogCard) throw new Error(`authored canonicalId missing from catalog: ${canonicalId}`);
    const collectorNumber = catalogCard.printings[0]?.collectorNumber ?? "";
    // Prefer the module base matching collectorNumber-slug; else first.
    const preferred = bases.find((b) => b === `${collectorNumber}-${card.slug}`) ?? bases[0] ?? "";
    // Duplicate modules (pre-migration twins) may carry the co-located test on
    // either twin — point at a tested twin when one exists.
    const testedBase = bases.find((b) => scan.get(b)?.hasTest);
    const base = testedBase ?? preferred;
    const meta = scan.get(base);
    const card2: CardLike = card;
    const sig = abilitySignature(card2);
    const authored = abilityListNotEmpty(card2) || sig.keywords.size > 0;
    const hasPrintedText = (catalogCard.functionalTextPlain?.trim().length ?? 0) > 0;

    const engineTestRefs = [...new Set(bases.flatMap((b) => engineImports.get(b) ?? []))];
    // Engine-pkg coverage only counts when the card is the test's subject
    // (test filename matches the slug); bare helper mentions are recorded as
    // t=4 and do not fulfill the "meaningful behavior test" bar.
    const slugNoColor = String(card.slug).replace(/-(red|yellow|blue)$/, "");
    const subjectRefs = engineTestRefs.filter((p) => {
      const stem = p
        .split("/")
        .pop()!
        .replace(/\.test\.ts$/, "");
      return stem.includes(slugNoColor) || slugNoColor.includes(stem);
    });
    const coLocated = meta?.hasTest ?? false;
    let t: Row["t"] = 0;
    const refs: string[] = [];
    if (coLocated) {
      t = 1;
      // Prefer the recorded test path: the co-located test may live in a
      // sibling group dir (e.g. token module tested from the allies dir).
      const testPath = meta!.testPath
        ? relative(ROOT, meta!.testPath)
        : join("packages/cards/src/cards", baseToSet(base), meta!.dir, `${base}.test.ts`);
      const content = await readFile(join(ROOT, testPath), "utf8");
      if (!content.includes("FabTestEngine")) t = 3;
      refs.push(testPath);
    } else {
      const orphan = [...bases, base].map((b) => orphanCoverage.get(b)).find(Boolean);
      if (orphan) {
        t = orphan.engine ? 1 : 3;
        refs.push(orphan.path);
      }
    }
    if (subjectRefs.length > 0 && t === 0) t = 2;
    else if (engineTestRefs.length > 0 && t === 0) t = 4;
    if (t === 2 || t === 4) refs.push(...(t === 2 ? subjectRefs : engineTestRefs));

    const status: Row["status"] = WONT[base]
      ? "wont"
      : authored
        ? t === 1 || t === 2 || t === 3
          ? "done"
          : "auth"
        : hasPrintedText
          ? "todo"
          : t === 1 || t === 2 || t === 3
            ? "done"
            : "van";
    rows.push({
      base,
      status,
      t,
      g: sig.gaps,
      sig,
      cluster: clusterId(sig, authored, hasPrintedText),
      refs,
    });
  }

  for (const card of catalog.cards) {
    if (cardMap.has(card.canonicalId)) continue;
    const collectorNumber = card.printings[0]?.collectorNumber ?? card.canonicalId;
    const base = `${collectorNumber}-${card.slug}`;
    const hasPrintedText = (card.functionalTextPlain?.trim().length ?? 0) > 0;
    const sig = abilitySignature({});
    rows.push({
      base,
      status: WONT[base] ? "wont" : hasPrintedText ? "todo" : "van",
      t: 0,
      g: 0,
      sig,
      cluster: clusterId(sig, false, hasPrintedText),
      refs: [],
    });
  }

  // Group and emit (wont rows are excluded from groups by design)
  const groups = new Map<string, Row[]>();
  for (const row of rows) {
    if (row.status === "wont") continue;
    const list = groups.get(row.cluster) ?? [];
    list.push(row);
    groups.set(row.cluster, list);
  }

  const sortRank = { done: 0, auth: 1, todo: 2, van: 3, wont: 4 } as const;
  const groupsJson = [...groups.entries()]
    .map(([id, list]) => {
      list.sort((a, b) => sortRank[a.status] - sortRank[b.status] || a.base.localeCompare(b.base));
      return { id, list };
    })
    .sort((a, b) => b.list.length - a.list.length);

  // Compact encoding: default done entry (t=1 engine co-located, no gaps) is a
  // bare string; deviations stay [base, t, g]. auth entries are bare strings
  // unless they carry unparsed gaps ([base, g]).
  const doneEntry = (r: Row): string | Array<string | number> =>
    r.t === 1 && r.g === 0 ? r.base : [r.base, r.t, r.g];
  const authEntry = (r: Row): string | Array<string | number> =>
    r.t === 0 && r.g === 0 ? r.base : [r.base, r.t, r.g];

  const out = {
    _meta: {
      generated: new Date().toISOString().slice(0, 10),
      source: "submodules/flesh-and-blood",
      catalogSource: catalog.provenance.source,
      catalogSourceVersion: catalog.provenance.sourceVersion,
      defs: {
        entry:
          'done/auth entries: "base" by default; deviation [base,t,g] (t: 2=engine-pkg subject test, 3=co-located model-only test, 4=engine helper-mention only — not coverage, 0=none; g>0=unparsed fragments remain). base=file stem under packages/cards/src/cards/{SET}/{type}/ — siblings: base.i18n.ts = printed text, base.test.ts = behavior test',
        status: {
          done: "coverage heuristic satisfied: abilities authored + recognized subject test; not proof that every printed clause works or that the engine is release-ready",
          auth: "abilities authored, recognized subject test missing",
          todo: "printed rules text, abilities not authored",
          van: "no printed text (vanilla), untested",
          wont: "out of scope by verified operator verdict; module + baseline test retained; excluded from groups and remaining-work counts — recorded in _meta.wont",
        },
        cluster:
          "T:<trigger-event>|F:<first-effect> | A:activated | R:resolution | S:static | K:<keywords> | VANILLA | UNAUTHORED — similarity batches: same trigger together, same effect family together",
        refs: "per-group map {base: test path from submodule root} for done cards whose covering test is not the derivable base.test.ts sibling (engine-pkg subject tests and orphan multi-card suites)",
        releaseReadiness:
          "not inferred by this inventory; use the Alpha epic, open gap families, public deck-play acceptance, and the full CI gate",
      },
      counts: {
        cards: rows.length,
        done: rows.filter((r) => r.status === "done").length,
        doneWithGaps: rows.filter((r) => r.status === "done" && r.g > 0).length,
        auth: rows.filter((r) => r.status === "auth").length,
        todo: rows.filter((r) => r.status === "todo").length,
        van: rows.filter((r) => r.status === "van").length,
        wont: rows.filter((r) => r.status === "wont").length,
        helperMentionOnly: rows.filter((r) => r.t === 4).length,
        groups: groupsJson.length,
      },
      wont: WONT,
    },
    groups: groupsJson.map(({ id, list }) => {
      const doneRows = list.filter((r) => r.status === "done");
      const authRows = list.filter((r) => r.status === "auth");
      const exemplars = doneRows
        .filter((r) => r.t === 1 && r.g === 0)
        .slice(0, 2)
        .map((r) => ({ base: r.base, test: r.refs[0] }));
      const refs: Record<string, string> = {};
      for (const r of doneRows) {
        // Non-derivable covering tests: engine-pkg subject tests and orphan
        // multi-card suites (paths from submodule root).
        if (r.t === 2) {
          const engineRef = r.refs.find((p) => p.startsWith("packages/engine/src/"));
          if (engineRef) refs[r.base] = engineRef;
        } else if (r.t === 1 || r.t === 3) {
          const orphanRef = r.refs[0];
          if (orphanRef && !orphanRef.endsWith(`${r.base}.test.ts`)) refs[r.base] = orphanRef;
        }
      }
      return {
        id,
        n: list.length,
        done: doneRows.map(doneEntry),
        auth: authRows.map(authEntry),
        todo: list.filter((r) => r.status === "todo").map((r) => r.base),
        van: list.filter((r) => r.status === "van").map((r) => r.base),
        exemplars,
        ...(Object.keys(refs).length > 0 ? { refs } : {}),
      };
    }),
  };

  await writeFile(OUT_PATH, `${JSON.stringify(out)}\n`, "utf8");
  console.log(`wrote ${OUT_PATH}`);
  console.log(JSON.stringify(out._meta.counts, null, 2));
  console.log("top clusters:");
  for (const g of out.groups.slice(0, 15)) {
    console.log(
      `  ${g.id}: n=${g.n} done=${g.done.length} auth=${g.auth.length} todo=${g.todo.length}`,
    );
  }
}

await main();
