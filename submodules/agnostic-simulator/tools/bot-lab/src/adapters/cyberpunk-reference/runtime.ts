import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createContext, Script } from "node:vm";
import { z } from "zod";

export const REFERENCE_URL = "https://choombattler.com/assets/bot.worker-DCis42UZ.js";
export const REFERENCE_SHA256 = "c834449c4463db4aa01e4ceaaa3de59afd460db90f0379a723b78a995369fa40";
export const REFERENCE_ID = "choombattler-expert";

const cardSchema = z
  .object({
    id: z.string(),
    externalId: z.string(),
    name: z.string(),
    displayName: z.string(),
    cardType: z.enum(["Unit", "Legend", "Gear", "Program"]),
    color: z.string().nullable(),
    ram: z.number(),
    cost: z.number().nullable(),
    power: z.number().nullable(),
    keywords: z.array(z.string()),
    classifications: z.array(z.string()),
    isEddiable: z.boolean(),
  })
  .passthrough();
export const catalogSchema = z.record(z.string(), cardSchema);
export type NativeCard = z.infer<typeof cardSchema>;
export type NativeCatalog = z.infer<typeof catalogSchema>;
export type Seat = 1 | 2;
export interface NativeAction {
  type: string;
  [key: string]: unknown;
}
export interface NativeDie {
  id: string;
  sides: number;
  value: number | null;
  owner: Seat;
}
export interface NativeInstance {
  instanceId: string;
  definitionId: string;
  owner: Seat;
  spent: boolean;
  damage: number;
  hasLag: boolean;
  faceDown: boolean;
  attachedGearIds: string[];
  modifiers: NativeModifier[];
  triggerCounts: Record<string, number>;
  turnFlags?: Record<string, number>;
  revealedTo?: Seat[];
  enteredPlayTurn?: number;
}
interface ModifierBase {
  id: string;
  source: string;
  duration: "thisTurn" | "untilTurn";
  untilTurn?: number;
}
export type NativeModifier = ModifierBase &
  (
    | { kind: "power"; value: number; whileFighting?: boolean }
    | { kind: "keyword"; value: string }
    | { kind: "lagExempt"; value: "unit" | "gig" }
    | { kind: "stealPenalty"; value: number }
    | { kind: "cantAttack" | "mustAttack" | "cantReady" | "attackReady" }
  );
export interface NativeCombat {
  attackerId: string;
  attackerController: Seat;
  target: { kind: "unit"; instanceId: string } | { kind: "gig" };
  phase: "declare" | "reacted";
  blocked: boolean;
}
export interface NativeShield {
  controller: Seat;
  turnNumber: number;
  source: string;
  expires: "thisTurn" | "nextFight";
  unit?: string;
}
export interface NativeDelayedEffect {
  id: string;
  definitionId: string;
  key: string;
  controller: Seat;
  source: string;
  targetId?: string;
  turnNumber: number;
  expires: "thisTurn" | "untilNextTurn";
}
export interface NativeStealBan {
  controller: Seat;
  source: string;
  turnNumber: number;
  thief: "Unit" | "Legend";
  protects: "aboveThiefPower" | "belowThiefPower";
}
export interface NativeGoSoloDiscount {
  controller: Seat;
  amount: number;
  minCost: number;
  turnNumber: number;
  source: string;
}
export interface NativePlayer {
  deck: string[];
  hand: string[];
  field: string[];
  legends: string[];
  eddies: string[];
  trash: string[];
  removed: string[];
  gigDice: NativeDie[];
  fixerDice: NativeDie[];
  hasSoldThisTurn: boolean;
  hasCalledLegendThisTurn: boolean;
  hasGainedGigThisTurn: boolean;
  turnsCompleted: number;
  nextProgramDiscount?: { amount: number; minCost: number; turnNumber: number };
  cardsPlayedThisTurn?: { turnNumber: number; instanceIds: string[] };
}
export interface NativeState {
  id: string;
  seed: number;
  rngState: number;
  stateVersion: number;
  eventSeq: number;
  turnNumber: number;
  currentPlayer: Seat;
  firstPlayer: Seat | null;
  status: string;
  turnPhase: string;
  winner: Seat | null;
  players: Record<Seat, NativePlayer>;
  instances: Record<string, NativeInstance>;
  pendingPrompt: { source: string; player: Seat; [key: string]: unknown } | null;
  pendingCombat: NativeCombat | null;
  combatShields: NativeShield[];
  delayedEffects: NativeDelayedEffect[];
  stealBans: NativeStealBan[];
  goSoloDiscounts: NativeGoSoloDiscount[];
}
export interface NativeSetup {
  gameId: string;
  seed: number;
  players: Record<Seat, { userId: string; legends: string[]; deck: string[] }>;
}
export interface NativeContext {
  state: NativeState;
  cards: CardLookup;
  self: string;
  opponent?: string;
  attacker?: string;
}
export interface NativeFilter {
  side?: "friendly" | "rival" | "any";
  cardType?: "Unit" | "Legend" | "Gear" | "Program";
  classification?: string;
  [key: string]: unknown;
}
export type NativeAura =
  | {
      kind: "powerAura";
      amount: number;
      target: NativeFilter;
      when: (ctx: NativeContext) => boolean;
      excludeSource?: boolean;
    }
  | { kind: "attackBanAura"; target: NativeFilter; when: (ctx: NativeContext) => boolean }
  | {
      kind: "playCost";
      amount: number;
      target: NativeFilter;
      minCost?: number;
      firstEachTurn?: boolean;
    }
  | { kind: "goSoloTax"; amount: number; side: "friendly" | "rival" | "any" }
  | {
      kind: "callCost";
      amount: number;
      side: "friendly" | "rival" | "any";
      when?: (ctx: NativeContext) => boolean;
    };
export interface NativeDefinition {
  cardType: NativeCard["cardType"];
  keywords: string[];
  statics?: (
    | {
        kind: "power";
        amount: number | ((ctx: NativeContext) => number);
        when: (ctx: NativeContext) => boolean;
      }
    | { kind: "keyword"; value: string; when: (ctx: NativeContext) => boolean }
  )[];
  auras?: NativeAura[];
}
export type CardLookup = (id: string) => NativeDefinition | undefined;
export interface NativeEvent {
  type: string;
  turnNumber: number;
  player: Seat | null;
  data?: { [key: string]: unknown };
}
export interface NativeStepResult {
  state: NativeState;
  events: NativeEvent[];
  error?: { message: string; code?: string };
}
export interface NativeApi {
  catalog(catalog: NativeCatalog): CardLookup;
  setup(
    setup: NativeSetup,
    options?: { startPhase?: "playing"; shuffleDeck?: boolean; shuffleLegends?: boolean },
  ): NativeState;
  actor(state: NativeState): Seat | null;
  actions(state: NativeState, cards: CardLookup, seat: Seat): NativeAction[];
  step(state: NativeState, action: NativeAction, cards: CardLookup): NativeStepResult;
  power(
    state: NativeState,
    cards: CardLookup,
    id: string,
    context?: { opponent?: string; attacker?: string },
  ): number;
  keywords(state: NativeState, cards: CardLookup, id: string): string[];
  cost(state: NativeState, cards: CardLookup, id: string, seat: Seat): number;
  goSoloCost(state: NativeState, cards: CardLookup, id: string, seat: Seat): number;
  availableEddies(state: NativeState, seat: Seat, cards: CardLookup): string[];
  visible(state: NativeState, id: string, viewer: Seat | null): boolean;
  attackForbidden(state: NativeState, cards: CardLookup, id: string): boolean;
  attackTargetForbidden(
    state: NativeState,
    cards: CardLookup,
    id: string,
    target: "unit" | "gig",
  ): boolean;
  unblockable(state: NativeState, cards: CardLookup, id: string): boolean;
  canAttackWithLag(
    state: NativeState,
    cards: CardLookup,
    id: string,
    target: "unit" | "gig",
  ): boolean;
  canAttackReady(state: NativeState, cards: CardLookup, id: string, targetId: string): boolean;
  activeSources(state: NativeState): { pid: Seat; sourceId: string }[];
  matches(state: NativeState, cards: CardLookup, id: string, filter: NativeFilter): boolean;
  stealCount(state: NativeState, cards: CardLookup, id: string): number;
}
const API_BINDINGS = {
  catalog: "qu",
  setup: "Sa",
  actor: "je",
  actions: "An",
  step: "pn",
  power: "te",
  keywords: "Wt",
  cost: "Ie",
  goSoloCost: "xr",
  availableEddies: "Ee",
  visible: "Ht",
  attackForbidden: "Pn",
  attackTargetForbidden: "io",
  unblockable: "fa",
  canAttackWithLag: "ya",
  canAttackReady: "fo",
  activeSources: "mt",
  matches: "ne",
  stealCount: "lo",
};
function isApi(value: unknown): value is NativeApi {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.keys(API_BINDINGS).every(
      (name) => name in value && typeof Reflect.get(value, name) === "function",
    )
  );
}
export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Loads a user-supplied external fixture. No third-party implementation is vendored. */
export function loadReferenceRuntime(workerPath: string, catalogPath: string) {
  const source = readFileSync(workerPath, "utf8");
  const workerHash = sha256(source);
  if (workerHash !== REFERENCE_SHA256)
    throw new Error("Choombattler worker hash mismatch; audit the new build before use");
  const catalogText = readFileSync(catalogPath, "utf8");
  const catalog = catalogSchema.parse(JSON.parse(catalogText));
  // Expose existing function bindings; do not replace their bodies or constants.
  // These minifier symbols are specific to the pinned, verified build above.
  const end = source.lastIndexOf("})();");
  if (end < 0) throw new Error("Reference worker wrapper changed");
  const hook = `;globalThis.referenceApi={${Object.entries(API_BINDINGS)
    .map(([name, symbol]) => `${name}:${symbol}`)
    .join(",")}};`;
  let listener: ((event: { data: unknown }) => void) | undefined;
  let reply: unknown;
  const context = createContext(
    {
      performance: { now: () => 0 },
      setTimeout: () => {
        throw new Error("Reference batch API is disabled; use bot-lab scheduling");
      },
      postMessage: (value: unknown) => {
        reply = value;
      },
      addEventListener: (name: string, callback: (event: { data: unknown }) => void) => {
        if (name === "message") listener = callback;
      },
    },
    { codeGeneration: { strings: false, wasm: false } },
  );
  new Script(source.slice(0, end) + hook + source.slice(end), {
    filename: REFERENCE_URL,
  }).runInContext(context, { timeout: 5_000 });
  const apiValue: unknown = Reflect.get(context, "referenceApi");
  if (!isApi(apiValue) || !listener) throw new Error("Reference API hook is unavailable");
  const api = apiValue;
  const send = (message: unknown) => {
    Reflect.set(context, "referenceMessage", message);
    new Script("globalThis.referenceListener({data:globalThis.referenceMessage})").runInContext(
      context,
      { timeout: 30_000 },
    );
  };
  Reflect.set(context, "referenceListener", listener);
  send({ kind: "catalog", catalog });
  const cards = api.catalog(catalog);
  return {
    api,
    cards,
    catalog,
    workerHash,
    catalogHash: sha256(catalogText),
    decide(state: NativeState, seat: Seat): NativeAction {
      reply = undefined;
      // Use the ORIGINAL shipped message handler, including Expert's default
      // search, deck reading, fitted weights, reply model and tie breaking.
      send({ kind: "move", id: 1, state, seat, difficulty: "expert" });
      const parsed = z
        .object({ kind: z.literal("move"), action: z.object({ type: z.string() }).passthrough() })
        .safeParse(reply);
      if (!parsed.success)
        throw new Error(`Reference returned no action: ${JSON.stringify(reply)}`);
      return parsed.data.action;
    },
  };
}
export type ReferenceRuntime = ReturnType<typeof loadReferenceRuntime>;
