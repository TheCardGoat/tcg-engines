#!/usr/bin/env node
/**
 * Flesh and Blood card-coverage inventory + similarity batcher.
 *
 * Composes with {@link "./behavior-audit.ts"} for per-card behavior
 * signatures and walks the card source tree for test coverage. Emits the
 * machine-readable JSON that the `/fab-tests` slash command consumes to drive
 * AAA test-generation batches of similar cards.
 *
 * Coverage method: a card counts as "tested" when a sibling `<file>.test.ts`
 * exists next to its source (heuristic — see `method` in the inventory output).
 * Grouping method: cards cluster by type-directory + a sorted "effect signature"
 * derived from their behavior-audit occurrences (`ability:kind:effectType`,
 * `effect:<t>`, `trigger:<e>`, `keyword:<n>`). Cards sharing a signature share a
 * test scaffold, so the agent reasons once per batch.
 *
 * Run from `submodules/flesh-and-blood`:
 *   node packages/cards/scripts/card-coverage.ts                             # full inventory
 *   node packages/cards/scripts/card-coverage.ts --set WTR --type actions
 *     [--card <slug|collector>] [--batch-size 5]
 *   node packages/cards/scripts/card-coverage.ts --random
 *   node packages/cards/scripts/card-coverage.ts --record-gap <ref> --family <id> --reason "..."
 *     [--kind engine-primitive|definition|out-of-scope|harness]
 *     [--primitive path] [--repro "..."]
 *   node packages/cards/scripts/card-coverage.ts --gaps
 *   node packages/cards/scripts/card-coverage.ts --normalize-gaps
 *   node packages/cards/scripts/card-coverage.ts --resolve-family <id> --resolved-by "note"
 *   node packages/cards/scripts/card-coverage.ts --next-cluster [--cluster <family>] [--exclude id,id]
 */
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { fleshAndBloodCatalog } from "../src/generated/flesh-and-blood-catalog.ts";
import cardIdentitySourceJson from "../src/generated/flesh-and-blood-card-data.json" with { type: "json" };

import {
  auditCardBehaviors,
  defaultCardsDirectory,
  defaultCardSourceDirectories,
} from "./behavior-audit.ts";
import { selectNextCluster } from "./card-coverage/select-next-cluster.ts";
import { buildExpectedCanonicalManifest } from "./generate-canonical-card-manifest.mjs";

// ─── Layout ────────────────────────────────────────────────────────────────

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "card-coverage");
const COVERAGE_PATH = join(OUT_DIR, "coverage.json");
const GAPS_PATH = join(OUT_DIR, "gaps.json");

/** Singular/plural aliases → canonical type-directory name. */
const TYPE_ALIASES: Readonly<Record<string, string>> = {
  action: "actions",
  actions: "actions",
  equipment: "equipments",
  equipments: "equipments",
  hero: "heroes",
  heroes: "heroes",
  weapon: "weapons",
  weapons: "weapons",
  instant: "instants",
  instants: "instants",
  "attack-reaction": "attack-reactions",
  "attack-reactions": "attack-reactions",
  "defense-reaction": "defense-reactions",
  "defense-reactions": "defense-reactions",
  block: "blocks",
  blocks: "blocks",
  resource: "resources",
  resources: "resources",
  token: "tokens",
  tokens: "tokens",
  mentor: "mentors",
  mentors: "mentors",
  "demi-hero": "demi-heroes",
  "demi-heroes": "demi-heroes",
  ally: "allies",
  allies: "allies",
  companion: "companions",
  companions: "companions",
  macro: "macros",
  macros: "macros",
  event: "events",
  events: "events",
  misc: "misc",
};

// ─── Types ─────────────────────────────────────────────────────────────────

interface CardRow {
  readonly set: string;
  readonly typeDir: string;
  readonly collectorNumber: string;
  readonly slug: string;
  readonly canonicalId?: string;
  /** Canonical path relative to the cards directory, e.g. `actions/snatch.ts`. */
  readonly path: string;
  tested: boolean;
  readonly signature: readonly string[];
  readonly cluster: string;
}

interface BatchMember {
  readonly collectorNumber: string;
  readonly slug: string;
  readonly set: string;
  readonly typeDir: string;
  readonly path: string;
  tested: boolean;
  readonly signature: readonly string[];
}

interface ClusterOut {
  readonly cluster: string;
  readonly typeDir: string;
  readonly signature: readonly string[];
  readonly size: number;
  readonly untested: number;
  readonly members: readonly string[];
}

interface CoverageFile {
  readonly version: 1;
  readonly generatedAt: string;
  readonly method: {
    readonly coverage: "authored-test-file";
    readonly grouping: "behavior-signature";
    readonly source: "behavior-audit + canonical-manifest + filesystem-tests";
  };
  readonly cardsDir: string;
  readonly totals: {
    readonly defined: number;
    readonly tested: number;
    readonly gap: number;
    readonly coverage: string;
  };
  readonly sets: Readonly<
    Record<
      string,
      {
        readonly types: Readonly<
          Record<
            string,
            {
              readonly defined: number;
              readonly tested: number;
              readonly gap: number;
              readonly untested: readonly string[];
            }
          >
        >;
      }
    >
  >;
  readonly clusters: readonly ClusterOut[];
}

const GAP_KINDS = ["engine-primitive", "definition", "out-of-scope", "harness"] as const;
type GapKind = (typeof GAP_KINDS)[number];
const GAP_STATUSES = ["open", "pinned", "resolved"] as const;
type GapStatus = (typeof GAP_STATUSES)[number];

interface GapMember {
  canonicalId?: string;
  set: string;
  typeDir: string;
  collectorNumber: string;
  slug: string;
  cluster: string;
  reason: string;
  triedAt: string;
}

interface GapFamily {
  family: string;
  kind: GapKind;
  primitive: string | null;
  status: GapStatus;
  repro: string;
  resolvedBy: string | null;
  members: GapMember[];
}

interface GapFile {
  version: 2;
  generatedAt?: string;
  note?: string;
  families: GapFamily[];
}

function isGapKind(value: string): value is GapKind {
  return (GAP_KINDS as readonly string[]).includes(value);
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function parseArgs(argv: readonly string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i]!;
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) out[key] = true;
      else {
        out[key] = next;
        i += 1;
      }
    }
  }
  return out;
}

/**
 * Reduce one behavior-audit occurrence to a signature token.
 * `ability:{json}` → `a:<kind>:<effectType>`; `effect:<t>`/`trigger:<e>`/`keyword:<n>` → first-letter forms.
 */
function signatureToken(behaviorKey: string): string | undefined {
  const colon = behaviorKey.indexOf(":");
  if (colon < 0) return undefined;
  const prefix = behaviorKey.slice(0, colon);
  const rest = behaviorKey.slice(colon + 1);
  if (prefix === "ability") {
    try {
      const obj = JSON.parse(rest) as { kind?: string; effect?: { type?: string } };
      if (obj.kind === "family-helper") return "a:family-helper";
      return `a:${obj.kind ?? "?"}:${obj.effect?.type ?? "-"}`;
    } catch {
      return "a:?:?";
    }
  }
  if (prefix === "family-helper") return "f:family-helper";
  const compact = rest.replace(/\s+/g, " ").trim().slice(0, 48);
  if (prefix === "effect")
    return rest.trimStart().startsWith("{") ? "e:family-helper" : `e:${compact}`;
  if (prefix === "trigger") return `t:${compact}`;
  if (prefix === "keyword") return `k:${compact}`;
  return `${prefix.slice(0, 1)}:${compact}`;
}

function groupBy<T, K extends string>(items: readonly T[], key: (t: T) => K): Record<K, T[]> {
  return items.reduce(
    (acc, item) => {
      const k = key(item);
      (acc[k] ??= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}

function chunk<T>(items: readonly T[], size: number): T[][] {
  if (size <= 0) return [items.slice()];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

function emptyGapFile(): GapFile {
  return { version: 2, families: [] };
}

async function readGaps(): Promise<GapFile> {
  try {
    const raw = JSON.parse(await readFile(GAPS_PATH, "utf8")) as GapFile;
    if (raw.version !== 2 || !Array.isArray(raw.families)) {
      throw new Error(`Unsupported card-coverage gap schema at ${GAPS_PATH}; expected version 2`);
    }
    return {
      version: 2,
      generatedAt: raw.generatedAt,
      note: raw.note,
      families: raw.families,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyGapFile();
    throw error;
  }
}

async function writeGaps(file: GapFile): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
  const out: GapFile = {
    version: 2,
    generatedAt: new Date().toISOString(),
    note: file.note,
    families: file.families,
  };
  await writeFile(GAPS_PATH, `${JSON.stringify(out, null, 2)}\n`, "utf8");
}

export function normalizeGapMembers(file: GapFile, rows: readonly CardRow[]): GapFile {
  const rowsByCanonicalId = new Map(
    rows.flatMap((row) => (row.canonicalId ? [[row.canonicalId, row] as const] : [])),
  );
  const rowsBySlugAndCollector = new Map<string, CardRow[]>();
  for (const row of rows) {
    if (!row.canonicalId) continue;
    const key = `${row.slug}\0${row.collectorNumber.toLowerCase()}`;
    const candidates = rowsBySlugAndCollector.get(key) ?? [];
    candidates.push(row);
    rowsBySlugAndCollector.set(key, candidates);
  }
  return {
    ...file,
    families: file.families.map((family) => {
      const membersByCanonicalId = new Map<string, GapMember>();
      for (const member of family.members) {
        let canonicalId = member.canonicalId;
        if (!canonicalId) {
          const key = `${member.slug}\0${member.collectorNumber.toLowerCase()}`;
          const candidates = rowsBySlugAndCollector.get(key) ?? [];
          if (candidates.length !== 1) {
            throw new Error(
              `${family.family}: cannot resolve ${member.slug} (${member.collectorNumber}) to exactly one canonicalId; found ${candidates.length}`,
            );
          }
          canonicalId = candidates[0]!.canonicalId!;
        }
        const row = rowsByCanonicalId.get(canonicalId);
        membersByCanonicalId.set(canonicalId, {
          ...member,
          canonicalId,
          ...(row
            ? {
                set: row.set,
                typeDir: row.typeDir,
                collectorNumber: row.collectorNumber,
                slug: row.slug,
                cluster: row.cluster,
              }
            : {}),
        });
      }
      return {
        ...family,
        members: [...membersByCanonicalId.values()],
      };
    }),
  };
}

function openFamilies(file: GapFile): GapFamily[] {
  return file.families.filter((f) => f.status !== "resolved");
}

function printGaps(file: GapFile, asJson: boolean): void {
  if (asJson) {
    process.stdout.write(`${JSON.stringify(file, null, 2)}\n`);
    return;
  }
  const open = openFamilies(file);
  const resolved = file.families.filter((f) => f.status === "resolved");
  const lines = [
    `Gap families: ${file.families.length} (${open.length} open, ${resolved.length} resolved)`,
    `Wrote/read ${GAPS_PATH}`,
    "",
    "Open families:",
    ...open
      .slice()
      .sort((a, b) => b.members.length - a.members.length || a.family.localeCompare(b.family))
      .map(
        (f) =>
          `  ${String(f.members.length).padStart(3)}  ${f.kind.padEnd(18)}  ${f.family}  — ${f.repro}`,
      ),
  ];
  process.stdout.write(`${lines.join("\n")}\n`);
}

// ─── Core: build the card-row table ────────────────────────────────────────

export async function buildRows(): Promise<{ rows: CardRow[]; cardsDir: string }> {
  const cardsDir = defaultCardsDirectory();
  const catalog = fleshAndBloodCatalog;
  const { manifest } = buildExpectedCanonicalManifest({
    catalog: cardIdentitySourceJson,
    sourceRoot: join(HERE, "../src"),
  });
  const catalogById = new Map(catalog.cards.map((card) => [card.canonicalId, card]));

  // (1) Behavior signatures from the audit.
  const inventory = await auditCardBehaviors(defaultCardSourceDirectories());
  const sigByPath = new Map<string, Set<string>>();
  const sigByCanonicalId = new Map<string, Set<string>>();
  for (const occ of inventory.behaviorOccurrences) {
    const tok = signatureToken(occ.behaviorKey);
    if (tok) {
      let set = sigByPath.get(occ.cardPath);
      if (!set) {
        set = new Set<string>();
        sigByPath.set(occ.cardPath, set);
      }
      set.add(tok);
      if (occ.canonicalId) {
        let canonicalSet = sigByCanonicalId.get(occ.canonicalId);
        if (!canonicalSet) {
          canonicalSet = new Set<string>();
          sigByCanonicalId.set(occ.canonicalId, canonicalSet);
        }
        canonicalSet.add(tok);
      }
    }
  }

  // (2) Canonical manifest universe + sibling-test coverage. This retains one
  // row per definition even when several variants share one source module.
  const canonicalPaths = [
    ...new Set(manifest.map((entry) => entry.module.replace(/^cards\//, ""))),
  ];
  const testedByPath = new Map<string, boolean>();
  await Promise.all(
    canonicalPaths.map(async (rel) => {
      testedByPath.set(rel, await pathExists(join(cardsDir, rel.replace(/\.ts$/, ".test.ts"))));
    }),
  );

  // (3) Join into rows.
  const rows: CardRow[] = manifest.map((entry) => {
    const rel = entry.module.replace(/^cards\//, "");
    const auditPath = rel;
    const canonicalId = entry.canonicalId;
    const catalogCard = catalogById.get(canonicalId);
    if (!catalogCard) throw new Error(`Canonical manifest id missing from catalog: ${canonicalId}`);
    const printing = catalogCard.printings[0];
    const typeDir = rel.split("/")[0]!;
    const signature = [
      ...new Set([
        ...(sigByPath.get(auditPath) ?? []),
        ...(sigByCanonicalId.get(canonicalId) ?? []),
      ]),
    ].sort();
    const cluster = `${typeDir}|${signature.join(",") || "<no-behavior>"}`;
    return {
      set: printing?.setCode ?? "canonical",
      typeDir,
      collectorNumber: printing?.collectorNumber ?? canonicalId,
      slug: catalogCard.slug,
      canonicalId,
      path: rel,
      tested: testedByPath.get(rel) ?? false,
      signature,
      cluster,
    } satisfies CardRow;
  });

  return { rows, cardsDir };
}

// ─── Outputs ───────────────────────────────────────────────────────────────

async function writeCoverage(rows: readonly CardRow[], cardsDir: string): Promise<CoverageFile> {
  type TypeCov = { defined: number; tested: number; gap: number; untested: string[] };
  const sets: Record<string, { types: Record<string, TypeCov> }> = {};
  for (const r of rows) {
    const bySet = (sets[r.set] ??= { types: {} });
    const byType = (bySet.types[r.typeDir] ??= { defined: 0, tested: 0, gap: 0, untested: [] });
    byType.defined += 1;
    if (r.tested) byType.tested += 1;
    else {
      byType.gap += 1;
      byType.untested.push(r.path);
    }
  }
  const clusters: ClusterOut[] = Object.entries(groupBy(rows, (r) => r.cluster))
    .map(([cluster, members]) => {
      const untestedMembers = members.filter((m) => !m.tested);
      return {
        cluster,
        typeDir: members[0]!.typeDir,
        signature: members[0]!.signature,
        size: members.length,
        untested: untestedMembers.length,
        members: untestedMembers.map((m) => m.path),
      } satisfies ClusterOut;
    })
    .sort((a, b) => b.untested - a.untested || a.cluster.localeCompare(b.cluster));

  const defined = rows.length;
  const tested = rows.filter((r) => r.tested).length;
  const file: CoverageFile = {
    version: 1,
    generatedAt: new Date().toISOString(),
    method: {
      coverage: "authored-test-file",
      grouping: "behavior-signature",
      source: "behavior-audit + canonical-manifest + filesystem-tests",
    },
    cardsDir,
    totals: {
      defined,
      tested,
      gap: defined - tested,
      coverage: `${((tested / defined) * 100).toFixed(1)}%`,
    },
    sets,
    clusters: clusters.filter((c) => c.untested > 0),
  };
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(COVERAGE_PATH, `${JSON.stringify(file, null, 2)}\n`, "utf8");
  return file;
}

function selectForBatch(
  rows: readonly CardRow[],
  args: Record<string, string | boolean>,
): { rows: CardRow[]; selection: Record<string, unknown> } {
  const wantSet = typeof args.set === "string" ? args.set.toUpperCase() : undefined;
  const wantType =
    typeof args.type === "string"
      ? (TYPE_ALIASES[args.type.toLowerCase()] ?? args.type.toLowerCase())
      : undefined;
  const wantCard = typeof args.card === "string" ? args.card.toLowerCase() : undefined;
  const random = args.random === true;

  let set = wantSet;
  let type = wantType;

  if (random) {
    const untested = rows.filter((r) => !r.tested);
    const bySet = groupBy(untested, (r) => r.set);
    const setKeys = Object.keys(bySet);
    if (setKeys.length > 0) {
      if (!set) {
        // Prefer sets weighted by untested count so the loop gravitates to real gaps.
        const weighted = setKeys.flatMap((s) => bySet[s]!.map(() => s));
        set = weighted[Math.floor(Math.random() * weighted.length)]!;
      }
      const typesInSet = [...new Set(bySet[set!]!.map((r) => r.typeDir))];
      if (!type) type = typesInSet[Math.floor(Math.random() * typesInSet.length)]!;
    }
  }

  let selected = rows.filter((r) => (!set || r.set === set) && (!type || r.typeDir === type));
  if (wantCard)
    selected = selected.filter(
      (r) => r.slug === wantCard || r.collectorNumber.toLowerCase() === wantCard,
    );

  return {
    rows: selected,
    selection: { set: set ?? null, type: type ?? null, card: wantCard ?? null, random },
  };
}

async function emitBatch(
  selected: readonly CardRow[],
  selection: Record<string, unknown>,
  batchSize: number,
): Promise<void> {
  const untested = selected.filter((r) => !r.tested);
  const clusters = Object.entries(groupBy(untested, (r) => r.cluster))
    .map(([cluster, members]) => ({
      cluster,
      typeDir: members[0]!.typeDir,
      signature: members[0]!.signature,
      size: selected.filter((r) => r.cluster === cluster).length,
      members: members.map(
        (m): BatchMember => ({
          collectorNumber: m.collectorNumber,
          slug: m.slug,
          set: m.set,
          typeDir: m.typeDir,
          path: m.path,
          tested: m.tested,
          signature: m.signature,
        }),
      ),
    }))
    .sort((a, b) => b.members.length - a.members.length);

  const batches = clusters.flatMap((c) =>
    chunk(
      c.members.map((m, i) => ({ ...m, batchIndex: i })),
      batchSize,
    ).map((b, i) => ({ cluster: c.cluster, signature: c.signature, batch: i, members: b })),
  );

  const gapFile = await readGaps();
  const open = openFamilies(gapFile).map((f) => ({
    family: f.family,
    kind: f.kind,
    status: f.status,
    members: f.members.length,
    repro: f.repro,
  }));
  const out = {
    generatedAt: new Date().toISOString(),
    selection,
    totals: {
      selected: selected.length,
      untested: untested.length,
      clusters: clusters.length,
      batches: batches.length,
      openFamilies: open.length,
    },
    openFamilies: open,
    clusters,
    batches,
  };
  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

async function recordGap(
  rows: readonly CardRow[],
  ref: string,
  familyId: string,
  reason: string,
  kind: GapKind,
  primitive: string | null,
  repro: string,
): Promise<void> {
  const lower = ref.toLowerCase();
  const row = rows.find(
    (r) => r.slug === lower || r.collectorNumber.toLowerCase() === lower || r.path === ref,
  );
  if (!row) throw new Error(`No card matches --record-gap "${ref}".`);
  const gapFile = await readGaps();
  const member: GapMember = {
    canonicalId: row.canonicalId,
    set: row.set,
    typeDir: row.typeDir,
    collectorNumber: row.collectorNumber,
    slug: row.slug,
    cluster: row.cluster,
    reason,
    triedAt: new Date().toISOString(),
  };
  let family = gapFile.families.find((f) => f.family === familyId);
  if (!family) {
    family = {
      family: familyId,
      kind,
      primitive,
      status: "open",
      repro: repro || reason,
      resolvedBy: null,
      members: [],
    };
    gapFile.families.push(family);
  } else if (family.status === "resolved") {
    family.status = "open";
    family.resolvedBy = null;
  }
  const existingIndex = family.members.findIndex(
    (existing) => member.canonicalId !== undefined && existing.canonicalId === member.canonicalId,
  );
  const existed = existingIndex !== -1;
  if (existed) family.members[existingIndex] = member;
  else family.members.push(member);
  await writeGaps(gapFile);
  process.stdout.write(
    `${existed ? "Already recorded" : "Recorded"} ${row.collectorNumber} (${row.slug}) in family ${familyId} (${GAPS_PATH})\n`,
  );
}

async function resolveFamily(familyId: string, resolvedBy: string): Promise<void> {
  const gapFile = await readGaps();
  const family = gapFile.families.find((f) => f.family === familyId);
  if (!family) throw new Error(`No gap family "${familyId}".`);
  family.status = "resolved";
  family.resolvedBy = resolvedBy;
  await writeGaps(gapFile);
  process.stdout.write(`Resolved family ${familyId} (${family.members.length} members)\n`);
}

function printSummary(file: CoverageFile): void {
  process.stdout.write(
    [
      `Coverage: ${file.totals.tested}/${file.totals.defined} (${file.totals.coverage}) — gap ${file.totals.gap}`,
      `Clusters with untested cards: ${file.clusters.length}`,
      `Wrote ${COVERAGE_PATH}`,
      "",
      "Top set gaps:",
      ...Object.entries(file.sets)
        .map(
          ([set, setTypeMap]) =>
            [set, Object.values(setTypeMap.types).reduce((n, t) => n + t.gap, 0)] as const,
        )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([set, gap]) => `  ${set}: ${gap} untested`),
      "",
      "Top untested clusters:",
      ...file.clusters
        .slice(0, 12)
        .map(
          (c) =>
            `  ${String(c.untested).padStart(4)}  ${c.typeDir}  [${c.signature.join(", ") || "<no-behavior>"}]`,
        ),
    ].join("\n"),
  );
  process.stdout.write("\n");
}

// ─── CLI ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args["record-gap"] !== undefined) {
    const ref = typeof args["record-gap"] === "string" ? args["record-gap"] : "";
    const reason = typeof args.reason === "string" ? args.reason : "";
    const familyId = typeof args.family === "string" ? args.family : "";
    const kindRaw = typeof args.kind === "string" ? args.kind : "engine-primitive";
    const primitive = typeof args.primitive === "string" ? args.primitive : null;
    const repro = typeof args.repro === "string" ? args.repro : reason;
    if (!ref || !reason || !familyId) {
      process.stderr.write(
        'Usage: --record-gap <slug|collector|path> --family <id> --reason "..." [--kind engine-primitive|definition|out-of-scope|harness] [--primitive path] [--repro "..."]\n',
      );
      process.exit(2);
    }
    if (!isGapKind(kindRaw)) {
      process.stderr.write(`Unknown --kind "${kindRaw}". Expected ${GAP_KINDS.join("|")}.\n`);
      process.exit(2);
    }
    const { rows } = await buildRows();
    await recordGap(rows, ref, familyId, reason, kindRaw, primitive, repro);
  } else if (args["resolve-family"] !== undefined) {
    const familyId = typeof args["resolve-family"] === "string" ? args["resolve-family"] : "";
    const resolvedBy = typeof args["resolved-by"] === "string" ? args["resolved-by"] : "";
    if (!familyId || !resolvedBy) {
      process.stderr.write('Usage: --resolve-family <id> --resolved-by "commit or note"\n');
      process.exit(2);
    }
    await resolveFamily(familyId, resolvedBy);
  } else if (args["normalize-gaps"] === true) {
    const { rows } = await buildRows();
    const normalized = normalizeGapMembers(await readGaps(), rows);
    await writeGaps(normalized);
    process.stdout.write(`Normalized gap members (${GAPS_PATH})\n`);
  } else if (args.gaps === true || args.format === "gaps") {
    printGaps(await readGaps(), args.json === true);
  } else if (args["next-cluster"] !== undefined || args.cluster !== undefined) {
    const seed =
      typeof args.cluster === "string"
        ? args.cluster
        : typeof args["next-cluster"] === "string"
          ? args["next-cluster"]
          : undefined;
    const excludeRaw = typeof args.exclude === "string" ? args.exclude : "";
    const exclude = excludeRaw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const cluster = selectNextCluster((await readGaps()).families, seed, exclude);
    process.stdout.write(`${JSON.stringify(cluster, null, 2)}\n`);
  } else if (
    args.set !== undefined ||
    args.type !== undefined ||
    args.card !== undefined ||
    args.random === true
  ) {
    const { rows, cardsDir } = await buildRows();
    await writeCoverage(rows, cardsDir);
    const { rows: selected, selection } = selectForBatch(rows, args);
    const batchSize = typeof args["batch-size"] === "string" ? Number(args["batch-size"]) || 5 : 5;
    await emitBatch(selected, selection, batchSize);
  } else {
    const { rows, cardsDir } = await buildRows();
    const file = await writeCoverage(rows, cardsDir);
    printSummary(file);
  }
}

if (process.argv[1]?.endsWith("card-coverage.ts")) await main();
