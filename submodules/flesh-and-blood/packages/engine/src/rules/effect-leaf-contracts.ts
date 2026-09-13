/**
 * CR-visible contract map for every inventory effect with status "tested".
 * Happy + full-block edge tests are generated from this map only.
 *
 * `primary` MUST read whitelist fields only:
 * zones, life, AP/RP/chi, powerCounterTotal/defenseCounterTotal, link keywords,
 * object markers, hand/deck order, instance meta (awakened/faceDown/copyOf/
 * powerCounterTotal/tapped/activeFace), legality/errorCode, game end, choice bindings
 * choice consequences (tokens, RP, life), committed rules events, crowd flags, marked,
 * extraTurns.
 *
 * Banned as sole proof: log length, bare life===16, sticky chosenColor/Number/Option,
 * sticky wagers/transformed++/exchanged++/addDefend/negated without zone/meta observation.
 */
import type { FabEffect, FabKeyword } from "@tcg/flesh-and-blood-types";
import type { FabTestEngine } from "../testing/test-engine.ts";
import type { FabFixtureCardEntry } from "../testing/test-fixtures.ts";
import { bravo, dash, nimblismBlue } from "./fixtures.ts";

export type EffectContractSetup = {
  /** Extra cards in attacker's hand (beyond the trainer attack). */
  attackerHandExtra?: readonly unknown[];
  defenderHand?: readonly unknown[];
  defenderArsenal?: readonly unknown[];
  defenderArena?: readonly unknown[];
  /** Exact arena cards for contracts whose legality depends on authored structure. */
  defenderArenaCards?: readonly FabFixtureCardEntry[];
  attackerResourcePoints?: number;
  /** Attack power of trainer (default 4). */
  power?: number;
  /** Keywords on the trainer attack. */
  keywords?: readonly FabKeyword[];
  /** Explicit public answer required before the happy-path effect can finish. */
  effectResolutionOptionId?: string;
};

export type EffectLeafContract = {
  readonly type: string;
  readonly cr: string;
  readonly effect: FabEffect;
  readonly setup?: EffectContractSetup;
  /**
   * CR-visible primary observation after happy-path hit resolves and combat closes.
   * Return a JSON-serializable snapshot for equality with happyExpected / edgeExpected.
   */
  readonly primary: (g: FabTestEngine) => unknown;
  readonly happyExpected: unknown;
  /** After full block (no hit), primary must equal this. */
  readonly edgeExpected: unknown;
};

function attackInstanceId(g: FabTestEngine, slug: string): string | undefined {
  const can = `trainer-${slug}`;
  return Object.values(g.getState().objects).find((object) => object.canonicalId === can)
    ?.instanceId;
}

function bravoId(g: FabTestEngine) {
  return g.as(bravo).id;
}
function dashId(g: FabTestEngine) {
  return g.as(dash).id;
}

function frozenObjectCount(g: FabTestEngine, playerId: string): number {
  const ids = new Set(
    Object.values(g.getState().containers.zonesByPlayerId[playerId]! ?? {}).flat(),
  );
  return Object.values(g.getState().objects).filter(
    (object) =>
      ids.has(object.instanceId) && object.markers.some((marker) => marker.kind === "frozen"),
  ).length;
}

const awakenContractFigment = (() => {
  const canonicalId = "trainer-awaken-contract-figment";
  const pairedFace = (side: "front" | "back", name: string) => ({
    faceId: `${canonicalId}:face:${side}` as const,
    name,
    typeText: "Illusionist Aura - Figment",
    types: ["Illusionist", "Aura", "Figment"],
    traits: [],
    text: "",
    keywords: [],
    abilities: [],
  });
  return {
    canonicalId,
    name: "Contract Figment",
    types: ["Illusionist", "Aura", "Figment"],
    layout: {
      kind: "flip" as const,
      family: "figment" as const,
      front: pairedFace("front", "Contract Figment"),
      back: pairedFace("back", "Contract Figment Awakened"),
    },
  };
})();

function ampGained(g: FabTestEngine, playerId: string): number {
  return g
    .committedEvents()
    .filter((event) => event.name === "gain-assets" && event.data.playerId === playerId)
    .reduce((total, event) => total + (event.name === "gain-assets" ? event.data.amp : 0), 0);
}

/** All hit-path leaf contracts (one per tested leaf/structural type driven via hit). */
export const EFFECT_LEAF_CONTRACTS: readonly EffectLeafContract[] = [
  {
    type: "lose-life",
    cr: "8.5.12",
    effect: { type: "lose-life", amount: 2, target: { selector: "opponent" } },
    // combat 4 dmg + effect 2
    primary: (g) => g.as(dash).life(),
    happyExpected: 14,
    edgeExpected: 20,
  },
  {
    type: "deal-damage",
    cr: "8.5.3",
    effect: {
      type: "deal-damage",
      damageType: "generic",
      amount: 1,
      target: { selector: "opponent" },
    },
    primary: (g) => g.as(dash).life(),
    happyExpected: 15,
    edgeExpected: 20,
  },
  {
    type: "gain-action-points",
    cr: "8.5.7",
    effect: { type: "gain-action-points", amount: 1, target: "controller" },
    primary: (g) => g.as(bravo).actionPoints(),
    happyExpected: 1,
    edgeExpected: 0,
  },
  {
    type: "gain-resources",
    cr: "8.5.7",
    effect: { type: "gain-resources", amount: 2 },
    primary: (g) => g.as(bravo).resourcePoints(),
    happyExpected: 2,
    edgeExpected: 0,
  },
  {
    type: "gain-chi",
    cr: "8.5.7",
    effect: { type: "gain-chi", amount: 1 },
    primary: (g) => g.getState().players[bravoId(g)]!.chiPoints,
    happyExpected: 1,
    edgeExpected: 0,
  },
  {
    type: "discard",
    cr: "8.5.5",
    effect: {
      type: "discard",
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "opponent",
        zones: ["hand"],
        count: 1,
      },
    },
    setup: { defenderHand: ["needs-hand"] },
    // Happy: 1 hand card discarded to GY while life also drops from hit.
    // Edge: full block uses 2 cards as defenders → gy has 2 from combat clear, no prior discard.
    primary: (g) => ({
      life: g.as(dash).life(),
      gy: g.as(dash).zone("graveyard").length,
      hand: g.as(dash).handCount(),
    }),
    happyExpected: { life: 16, gy: 1, hand: 0 },
    edgeExpected: { life: 20, gy: 2, hand: 0 },
  },
  {
    type: "banish",
    cr: "8.5.1",
    effect: {
      type: "banish",
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "opponent",
        zones: ["hand"],
        count: 1,
      },
    },
    setup: { defenderHand: ["needs-hand"] },
    primary: (g) => g.as(dash).zone("banished").length,
    happyExpected: 1,
    edgeExpected: 0,
  },
  {
    type: "destroy",
    cr: "8.5.4",
    effect: {
      type: "destroy",
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "opponent",
        zones: ["arsenal"],
        count: 1,
      },
    },
    setup: { defenderArsenal: ["needs-arsenal"] },
    primary: (g) => g.as(dash).zone("arsenal").length,
    happyExpected: 0,
    edgeExpected: 1,
  },
  {
    type: "move-card",
    cr: "8.5.15",
    // Self-target avoids at-resolution chooser; banish the resolving attack.
    effect: {
      type: "move-card",
      target: { selector: "self" },
      to: { zone: "banished" },
    },
    primary: (g) => g.as(bravo).zone("banished").length >= 1,
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "modify-numeric",
    cr: "8.5.8",
    effect: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: 2,
      target: { selector: "self" },
      duration: "this-turn",
    },
    primary: (g) =>
      g
        .getState()
        .continuousEffectInstances.some((continuous) =>
          continuous.atoms.some((atom) => atom.kind === "numeric" || atom.kind === "base-numeric"),
        )
        ? 2
        : 0,
    happyExpected: 2,
    edgeExpected: 0,
  },
  {
    type: "grant-property",
    cr: "8.5.9",
    effect: {
      type: "grant-property",
      property: { kind: "keyword", keyword: { name: "go-again" } },
      target: { selector: "self" },
      duration: "this-turn",
    },
    primary: (g) => g.as(bravo).actionPoints(),
    happyExpected: 1,
    edgeExpected: 0,
  },
  {
    type: "add-counter",
    cr: "8.5.14",
    effect: {
      type: "add-counter",
      counter: { kind: "numeric", value: 1, property: "power" },
      count: 1,
      target: { selector: "self" },
    },
    primary: (g) =>
      g
        .committedEvents()
        .filter((event) => event.name === "numeric-counter-added")
        .reduce(
          (sum, event) => sum + (event.name === "numeric-counter-added" ? event.data.count : 0),
          0,
        ),
    happyExpected: 1,
    edgeExpected: 0,
  },
  {
    type: "remove-counters",
    cr: "8.5.16",
    effect: {
      type: "sequence",
      steps: [
        {
          type: "add-counter",
          counter: { kind: "numeric", value: 1, property: "power" },
          count: 1,
          target: { selector: "self" },
        },
        {
          type: "remove-counters",
          counter: { kind: "numeric", value: 1, property: "power" },
          count: 1,
          target: { selector: "self" },
        },
      ],
    },
    primary: (g) =>
      g
        .committedEvents()
        .filter((event) => event.name === "numeric-counter-removed")
        .reduce(
          (sum, event) =>
            sum -
            (event.name === "numeric-counter-removed" ? event.data.value * event.data.count : 0),
          0,
        ),
    happyExpected: -1,
    edgeExpected: 0,
  },
  {
    type: "remove-counters",
    cr: "8.5.16",
    effect: {
      type: "sequence",
      steps: [
        {
          type: "add-counter",
          counter: { kind: "numeric", value: 1, property: "power" },
          count: 2,
          target: { selector: "self" },
        },
        {
          type: "remove-counters",
          counter: { kind: "numeric", value: 1, property: "power" },
          count: 2,
          target: { selector: "self" },
        },
      ],
    },
    primary: (g) =>
      g
        .committedEvents()
        .filter((event) => event.name === "numeric-counter-removed")
        .reduce(
          (sum, event) =>
            sum -
            (event.name === "numeric-counter-removed" ? event.data.value * event.data.count : 0),
          0,
        ),
    happyExpected: -2,
    edgeExpected: 0,
  },
  {
    type: "remove-all-counters",
    cr: "8.5.16",
    // Add 3 steam, clear all, then add 1 → remove-all must emit a counter-removed of 3.
    effect: {
      type: "sequence",
      steps: [
        {
          type: "add-counter",
          counter: { kind: "named", name: "steam" },
          count: 3,
          target: { selector: "self" },
        },
        {
          type: "remove-all-counters",
          counter: { kind: "named", name: "steam" },
          target: { selector: "self" },
        },
        {
          type: "add-counter",
          counter: { kind: "named", name: "steam" },
          count: 1,
          target: { selector: "self" },
        },
      ],
    },
    primary: (g) =>
      g
        .committedEvents()
        .filter((event) => event.name === "counter-removed")
        .reduce(
          (sum, event) => sum + (event.name === "counter-removed" ? event.data.amount : 0),
          0,
        ),
    happyExpected: 3,
    edgeExpected: 0,
  },
  {
    type: "move-counter",
    cr: "8.5.42",
    // Seed a steam counter, then move it self→self (remove + add).
    effect: {
      type: "sequence",
      steps: [
        {
          type: "add-counter",
          counter: { kind: "named", name: "steam" },
          count: 1,
          target: { selector: "self" },
        },
        {
          type: "move-counter",
          counter: { kind: "named", name: "steam" },
          from: { selector: "self" },
          to: { selector: "self" },
        },
      ],
    },
    primary: (g) =>
      g.committedEvents().some((event) => event.name === "counter-added") &&
      g.committedEvents().some((event) => event.name === "counter-removed")
        ? 1
        : 0,
    happyExpected: 1,
    edgeExpected: 0,
  },
  {
    type: "distribute-counters",
    cr: "8.5.30",
    effect: {
      type: "distribute-counters",
      counter: { kind: "named", name: "steam" },
      count: 1,
      among: { selector: "self" },
    },
    primary: (g) =>
      g
        .committedEvents()
        .filter((event) => event.name === "counter-added")
        .reduce((sum, event) => sum + (event.name === "counter-added" ? event.data.amount : 0), 0),
    happyExpected: 1,
    edgeExpected: 0,
  },
  {
    type: "create-token",
    cr: "8.5.2",
    effect: { type: "create-token", token: "Gold", controller: "controller" },
    primary: (g) => g.as(bravo).zone("arena").length >= 1,
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "create-card",
    cr: "8.5.40",
    effect: { type: "create-card", name: "Quicken", to: { zone: "permanent" } },
    primary: (g) => g.as(bravo).zone("arena").length >= 1,
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "create-extra",
    cr: "8.5.2",
    effect: { type: "create-extra", amount: 1 },
    primary: (g) => g.as(bravo).zone("arena").length,
    happyExpected: 1,
    edgeExpected: 0,
  },
  {
    type: "search",
    cr: "8.5.19",
    // Search with pre-bound selection is exercised via production cards;
    // leaf contract uses committed search observation after auto top-deck pick.
    effect: { type: "search", zones: ["deck"], filter: {}, to: { zone: "hand" }, count: 1 },
    primary: (g) =>
      g.committedEvents().some((event) => event.name === "search") || g.as(bravo).handCount() >= 2,
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "shuffle",
    cr: "8.5.20",
    effect: { type: "shuffle", zone: "deck" },
    primary: (g) =>
      g
        .committedEvents()
        .some((event) => event.name === "shuffle-zone" && event.data.zone === "deck"),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "reveal",
    cr: "8.5.17",
    effect: { type: "reveal", target: { selector: "self" } },
    setup: { attackerHandExtra: ["extra"] },
    primary: (g) => g.committedEvents().some((event) => event.name === "reveal"),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "look",
    cr: "8.5.11",
    effect: { type: "look", target: { selector: "self" } },
    setup: { attackerHandExtra: ["extra"] },
    primary: (g) => g.committedEvents().some((event) => event.name === "look"),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "opt",
    cr: "8.5.22",
    effect: { type: "opt", count: 2 },
    primary: (g) =>
      g.committedEvents().some((event) => event.name === "opt" && event.data.count === 2) ? 2 : 0,
    happyExpected: 2,
    edgeExpected: 0,
  },
  // negate: covered by CRU Aetherize production path in release-notes-set-keywords
  // (hit-trainer path cannot put a second layer on the combat stack).
  {
    type: "roll",
    cr: "8.5.18",
    effect: { type: "roll", sides: 6, extraDice: 1, ignore: "lowest" },
    primary: (g) =>
      g
        .committedEvents()
        .some(
          (event) =>
            (event.name === "roll" &&
              event.data.result >= 1 &&
              event.data.result <= 6 &&
              event.data.faces?.length === 2) ||
            (event.name === "roll-request" && event.data.extraDice === 1),
        ),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "clash",
    cr: "8.5.45",
    effect: { type: "clash", with: { selector: "opponent" } },
    primary: (g) => g.committedEvents().some((event) => event.name === "clash"),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "name-card",
    cr: "8.5.21",
    // Pure name-card only: the player explicitly declares a full public card
    // name, then the effect binds that identity. This is not a follow-up banish.
    effect: { type: "name-card" },
    setup: {
      defenderHand: ["nimblism"],
      effectResolutionOptionId: "fab-card-name:Nimblism",
    },
    primary: (g) => {
      const named = g
        .committedEvents()
        .find(
          (event) =>
            event.name === "set-status" && String(event.data.status).startsWith("named-card:"),
        );
      if (!named || named.name !== "set-status") return false;
      // The explicit public decision names Nimblism, proving that the chosen
      // catalog identity was bound rather than a placeholder being invented.
      const status = String(named.data.status);
      return status.includes("Nimblism") || status.toLowerCase().includes("nimblism");
    },
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "charge",
    cr: "8.5.29",
    effect: { type: "charge", target: { selector: "self" } },
    setup: { attackerHandExtra: ["extra"] },
    primary: (g) => ({
      soul: g.as(bravo).zone("soul").length >= 1,
      charged: g.getState().players[bravoId(g)]!.history.turn.charged,
    }),
    happyExpected: { soul: true, charged: true },
    edgeExpected: { soul: false, charged: false },
  },
  {
    type: "pitch-card",
    cr: "8.5.44",
    effect: { type: "pitch-card", target: { selector: "self" } },
    setup: { attackerHandExtra: ["extra"] },
    primary: (g) => ({
      pitch: g.as(bravo).zone("pitch").length >= 1,
      rp: g.as(bravo).resourcePoints() >= 1,
    }),
    happyExpected: { pitch: true, rp: true },
    edgeExpected: { pitch: false, rp: false },
  },
  {
    type: "equip",
    cr: "8.5.41",
    effect: { type: "equip", target: { selector: "self" } },
    // Leaf harness seeds ironrotHelm (Head equipment) into hand for equip.
    setup: { attackerHandExtra: ["equipment"] },
    primary: (g) => g.as(bravo).zone("head").length >= 1,
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "transform",
    cr: "8.5.36",
    effect: { type: "transform", target: { selector: "self" }, into: "token" },
    primary: (g) =>
      g
        .committedEvents()
        .some((event) => event.name === "transform" && event.data.into === "token"),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "copy",
    cr: "8.5.25",
    effect: {
      type: "copy",
      target: { selector: "self" },
      source: { selector: "self" },
      duration: "this-turn",
    },
    primary: (g) =>
      g
        .getState()
        .continuousEffectInstances.some((continuous) =>
          continuous.atoms.some((atom) => atom.kind === "copy" || atom.kind === "copy-abilities"),
        ),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "exchange",
    cr: "8.5.49",
    effect: {
      type: "exchange",
      first: { selector: "self" },
      second: { selector: "opponent" },
    },
    setup: {
      attackerHandExtra: ["extra-a"],
      defenderHand: ["needs-hand"],
    },
    // Happy: tops swap → bravo hand includes nimblism (from defender).
    // Edge: no swap → bravo keeps snatch extra, no nimblism.
    primary: (g) => g.as(bravo).zone("hand").includes(nimblismBlue.canonicalId),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "gain-control",
    cr: "8.5.35",
    effect: {
      type: "gain-control",
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "opponent",
        zones: ["permanent"],
        count: 1,
      },
      controller: "controller",
      duration: "this-turn",
    },
    setup: { defenderArena: ["needs-ally"] },
    primary: (g) =>
      g.as(bravo).zone("arena").length >= 1 ||
      g
        .committedEvents()
        .some(
          (event) =>
            event.name === "move-zone" &&
            "destinationPlayerId" in event.data &&
            event.data.destinationPlayerId === bravoId(g),
        ) ||
      g
        .getState()
        .continuousEffectInstances.some((continuous) =>
          continuous.atoms.some((atom) => atom.kind === "controller"),
        ),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "mark",
    cr: "8.5.50",
    effect: { type: "mark", target: { selector: "opponent" } },
    primary: (g) => g.getState().players[dashId(g)]!.marked,
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "set-status",
    cr: "6.2",
    effect: { type: "set-status", status: "sharpened", target: { selector: "self" } },
    primary: (g) =>
      g
        .committedEvents()
        .some((event) => event.name === "set-status" && event.data.status === "sharpened"),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "freeze",
    cr: "8.5.34",
    effect: { type: "freeze", target: { selector: "opponent" } },
    setup: { defenderHand: ["needs-hand"] },
    primary: (g) => frozenObjectCount(g, dashId(g)) >= 1,
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "unfreeze",
    cr: "8.5.37",
    // Freeze opponent, then unfreeze them — proves clear only when freeze ran first.
    effect: {
      type: "sequence",
      steps: [
        { type: "freeze", target: { selector: "opponent" } },
        { type: "unfreeze", target: { selector: "opponent" } },
      ],
    },
    setup: { defenderHand: ["needs-hand"] },
    primary: (g) => ({
      frozen: frozenObjectCount(g, dashId(g)),
      unfroze: g
        .committedEvents()
        .some((event) => event.name === "set-status" && event.data.status === "unfrozen"),
    }),
    happyExpected: { frozen: 0, unfroze: true },
    edgeExpected: { frozen: 0, unfroze: false },
  },
  {
    type: "tap",
    cr: "8.5.55",
    effect: { type: "tap", target: { selector: "self" } },
    primary: (g) =>
      g
        .committedEvents()
        .some((event) => event.name === "set-tapped" && event.data.tapped === true),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "untap",
    cr: "8.5.56",
    effect: { type: "untap", target: { selector: "self" } },
    primary: (g) => {
      const id = attackInstanceId(g, "fx-untap");
      return (g.objectState(id!) as { tapped?: boolean })?.tapped === false;
    },
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "add-defending",
    cr: "8.5.32",
    effect: { type: "add-defending", target: { selector: "self" } },
    setup: { attackerHandExtra: ["extra"] },
    primary: (g) =>
      g
        .committedEvents()
        .some((event) => event.name === "set-status" && event.data.status === "added-as-defending"),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "play-card",
    cr: "5.1",
    effect: {
      type: "play-card",
      fromZones: ["hand"],
      source: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones: ["hand"],
        count: 1,
      },
      costModification: "free",
      duration: "this-turn",
    },
    // The exact selected object receives a persisted, expiring play permission.
    primary: (g) => {
      return g
        .getState()
        .continuousEffectInstances.some(
          (continuous) =>
            continuous.controllerId === bravoId(g) &&
            continuous.atoms.some(
              (atom) => atom.kind === "rule" && atom.parameters.kind === "play-card",
            ) &&
            continuous.initialSubjects.length === 1,
        );
    },
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "pay",
    cr: "8.5.31",
    effect: {
      type: "pay",
      cost: { class: "asset", type: "resources", amount: 1 },
      payer: "controller",
    },
    setup: { attackerResourcePoints: 1 },
    primary: (g) => g.as(bravo).resourcePoints(),
    happyExpected: 0,
    edgeExpected: 1,
  },
  {
    type: "wager",
    cr: "8.5.46",
    effect: { type: "wager" },
    primary: (g) => g.committedEvents().some((event) => event.name === "wager"),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "become",
    cr: "8.5.25",
    effect: { type: "become", source: "ally", duration: "this-turn" },
    setup: { defenderArena: [] },
    primary: (g) =>
      g.committedEvents().some((event) => event.name === "become") ||
      g
        .getState()
        .continuousEffectInstances.some((continuous) =>
          continuous.atoms.some((atom) => atom.kind === "copy" || atom.kind === "become"),
        ),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "amp",
    cr: "8.5.47",
    effect: { type: "amp", amount: 2 },
    primary: (g) => ampGained(g, bravoId(g)),
    happyExpected: 2,
    edgeExpected: 0,
  },
  {
    type: "sharpen",
    cr: "8.5.58",
    effect: { type: "sharpen", target: { selector: "self" } },
    primary: (g) => {
      const fromSharpen = g
        .committedEvents()
        .filter((event) => event.name === "sharpen")
        .reduce((sum, event) => sum + (event.name === "sharpen" ? event.data.count : 0), 0);
      if (fromSharpen > 0) return fromSharpen;
      // Legacy path (pre-replaceable intermediate): numeric-counter-added only.
      return g
        .committedEvents()
        .filter((event) => event.name === "numeric-counter-added")
        .reduce(
          (sum, event) => sum + (event.name === "numeric-counter-added" ? event.data.count : 0),
          0,
        );
    },
    happyExpected: 1,
    edgeExpected: 0,
  },
  {
    type: "awaken",
    cr: "8.5.43",
    effect: {
      type: "awaken",
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "opponent",
        zones: ["permanent"],
        count: 1,
      },
    },
    setup: { defenderArenaCards: [awakenContractFigment] },
    primary: (g) => g.committedEvents().some((event) => event.name === "awaken"),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "crowd-cheers",
    cr: "8.5.57",
    effect: { type: "crowd-cheers", target: "controller" },
    primary: (g) => g.getState().players[bravoId(g)]!.history.turn.crowdCheered,
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "crowd-boos",
    cr: "8.5.57",
    effect: { type: "crowd-boos", target: "opponent" },
    primary: (g) => g.getState().players[dashId(g)]!.history.turn.crowdBooed,
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "win-clash",
    cr: "8.5.45",
    effect: { type: "win-clash" },
    primary: (g) => g.getState().lastClashWinnerId === bravoId(g),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "guess",
    cr: "6",
    effect: {
      type: "guess",
      predicate: "binding-matches-chosen-color",
      binding: "it",
      guesser: "controller",
    },
    // The guesser's public yes/no relationship answer.
    setup: { effectResolutionOptionId: "yes" },
    // CR-visible declaration on the guessing hero (not a second color choice).
    primary: (g) =>
      g
        .committedEvents()
        .some((event) => event.name === "set-status" && event.data.status === "guessed-yes"),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "choose-color",
    cr: "6",
    effect: { type: "choose-color" },
    setup: { effectResolutionOptionId: "red" },
    // CR-visible: chose-<color> status on the chooser hero.
    primary: (g) =>
      g
        .committedEvents()
        .some((event) => event.name === "set-status" && event.data.status === "chose-red"),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "choose-option",
    cr: "6",
    // Closed lists require a public effect-resolution answer.
    effect: { type: "choose-option", options: ["war", "peace"] },
    setup: { effectResolutionOptionId: "war" },
    primary: (g) =>
      g
        .committedEvents()
        .some((event) => event.name === "set-status" && event.data.status === "chose-war"),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "choose-and-create-token",
    cr: "8.5.2",
    effect: {
      type: "choose-and-create-token",
      options: ["Might", "Vigor"],
      chooser: "controller",
    },
    setup: { effectResolutionOptionId: "Might" },
    primary: (g) => g.as(bravo).zone("arena").length >= 1,
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "choose-number",
    cr: "6",
    // Bind the number, then a separate step spends the binding as "that many" RP.
    effect: {
      type: "sequence",
      steps: [
        { type: "choose-number" },
        {
          type: "gain-resources",
          amount: { type: "reference", binding: "chosen-number" },
        },
      ],
    },
    primary: (g) => ({
      bound: g
        .committedEvents()
        .some(
          (event) =>
            event.name === "set-status" && String(event.data.status).startsWith("chose-number:"),
        ),
      rp: g.as(bravo).resourcePoints(),
    }),
    happyExpected: { bound: true, rp: 1 },
    edgeExpected: { bound: false, rp: 0 },
  },
  {
    type: "choose-card",
    cr: "6",
    // Pure choose-card binds; follow-up banish acts on the bound object.
    effect: {
      type: "sequence",
      steps: [
        { type: "choose-card", target: { selector: "self" }, outputBinding: "chosen-card" },
        {
          type: "banish",
          target: { selector: "binding", binding: "chosen-card" },
        },
      ],
    },
    setup: { attackerHandExtra: ["extra"] },
    primary: (g) => g.as(bravo).zone("banished").length >= 1,
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "choose-opponent",
    cr: "6",
    // Bind sole opponent then deal 1 lose-life so the choice is CR-visible
    // (inventory gate requires life observation; 1v1 auto-bind has no chooser UI).
    effect: {
      type: "sequence",
      steps: [
        { type: "choose-opponent" },
        { type: "lose-life", amount: 1, target: { selector: "opponent" } },
      ],
    },
    primary: (g) => g.as(dash).life(),
    happyExpected: 15,
    edgeExpected: 20,
  },
  {
    type: "contract-task",
    cr: "8.5.39",
    effect: {
      type: "contract-task",
      task: "banish opponents' red cards",
      completeOn: "banish",
      filter: { color: ["red"] },
    },
    primary: (g) => g.getState().players[bravoId(g)]!.activeContract,
    happyExpected: "banish opponents' red cards",
    edgeExpected: null,
  },
  {
    type: "take-extra-turn",
    cr: "6",
    effect: { type: "take-extra-turn", player: "controller" },
    // Queued extra turn is CR-visible; turn-flow consumer is proven in 06-effects.
    primary: (g) => g.getState().players[bravoId(g)]!.extraTurnsQueued,
    happyExpected: 1,
    edgeExpected: 0,
  },
  {
    type: "lose-game",
    cr: "6",
    effect: { type: "lose-game", player: "opponent" },
    primary: (g) => ({
      ended: g.hasGameEnded(),
      winner: g.getGameEndResult().winnerId === bravoId(g),
    }),
    happyExpected: { ended: true, winner: true },
    edgeExpected: { ended: false, winner: false },
  },
  {
    type: "turn-face-down",
    cr: "8.5.24",
    effect: { type: "turn-face-down", target: { selector: "self" } },
    primary: (g) => g.committedEvents().some((event) => event.name === "turn-face-down"),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "turn-face-up",
    cr: "8.5.24",
    effect: { type: "turn-face-up", target: { selector: "self" } },
    primary: (g) => {
      const id = attackInstanceId(g, "fx-turn-face-up");
      return g.objectState(id!)?.faceDown === false;
    },
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "remove-property",
    cr: "8.5.13",
    effect: {
      type: "remove-property",
      property: { kind: "keyword", keyword: { name: "go-again" } },
      target: { selector: "self" },
      duration: "this-turn",
    },
    // Trainer stamps go-again; on hit remove-property strips it before resolution → AP 0.
    // On full block, go-again remains → AP 1 at resolution.
    setup: { keywords: [{ name: "go-again" }] },
    primary: (g) => g.as(bravo).actionPoints(),
    happyExpected: 0,
    edgeExpected: 1,
  },
  {
    type: "can-be-attacked",
    cr: "6.2",
    effect: {
      type: "can-be-attacked",
      target: { selector: "self" },
      duration: "this-turn",
    },
    primary: (g) =>
      g
        .getState()
        .continuousEffectInstances.some((continuous) =>
          continuous.atoms.some(
            (atom) => atom.kind === "rule" && atom.parameters.kind === "can-be-attacked",
          ),
        ),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "replacement",
    cr: "6.4",
    effect: {
      type: "replacement",
      replacementKind: "standard",
      replaces: { name: "pitch" },
      modification: {
        type: "sequence",
        steps: [
          { type: "destroy", target: { selector: "self" } },
          { type: "gain-resources", amount: 2 },
        ],
      },
      duration: "this-turn",
    },
    primary: (g) =>
      g
        .getState()
        .replacementEffects.some(
          (replacement) =>
            replacement.effect.type === "replacement" &&
            replacement.effect.replaces.name === "pitch",
        ),
    happyExpected: true,
    edgeExpected: false,
  },
  {
    type: "prevention",
    cr: "6.4",
    effect: {
      type: "prevention",
      preventionKind: "fixed",
      amount: 1,
      duration: "this-turn",
    },
    primary: (g) =>
      g.getState().replacementEffects.filter((r) => r.effect.type === "prevention").length,
    happyExpected: 1,
    edgeExpected: 0,
  },
  {
    type: "rule-modification",
    cr: "6.3.1",
    effect: {
      type: "rule-modification",
      mode: "restrict",
      action: "play",
      duration: "this-turn",
    },
    primary: (g) => {
      return g
        .getState()
        .continuousEffectInstances.some((continuous) =>
          continuous.atoms.some(
            (atom) => atom.kind === "rule" && atom.parameters.kind === "rule-modification",
          ),
        );
    },
    happyExpected: true,
    edgeExpected: false,
  },
];

/** Structural / non-hit-leaf effect types tested separately (still inventory-tested). */
export const STRUCTURAL_EFFECT_CONTRACT_IDS = [
  "sequence",
  "choice",
  "conditional",
  "optional",
  "for-each",
  "repeat",
  "delayed-trigger",
  "unless",
  "draw",
  "gain-life",
  "intimidate",
  "remove-counters",
  /** CRU Aetherize production path — release-notes-set-keywords.test.ts */
  "negate",
  /** Event-kernel cancellation path — replacement/process tests. */
  "cancel-event",
] as const;

export function effectLeafContractTypes(): string[] {
  return EFFECT_LEAF_CONTRACTS.map((c) => c.type);
}
