// @covers ts9VdtFtk1-a1
// Native mastery activation, all pages, costs, restrictions, copies, and restoration.
import { describe, expect, it } from "vitest";
import { divineComedy } from "./divine-comedy.ts";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { decodeGrandArchiveCommand } from "@tcg/grand-archive-engine/runtime";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "@tcg/grand-archive-engine/testing";

function card(
  id: string,
  type: "CHAMPION" | "ALLY" | "ACTION",
  effect?: GrandArchiveEffect,
): GrandArchiveCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        ...(type === "CHAMPION" ? { lineageName: "Dante" } : {}),
        cost: { kind: "reserve", amount: 0 },
        typeLine: { types: [type], classes: ["MAGE"], subtypes: [], supertypes: [] },
        elements: ["NORM"],
        stats: { life: 300, ...(type === "CHAMPION" ? { level: 0 } : { power: 1 }) },
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        rulesText: "",
        abilities: effect ? [{ id: `${id}-a1`, kind: "card-resolution", text: id, effect }] : [],
      },
    },
  };
}
const champion = card("divine-native-champion", "CHAMPION");
const ally = card("divine-native-unit", "ALLY");
const filler = card("divine-native-filler", "ACTION");
const gain = card("divine-native-gain", "ACTION", {
  kind: "gain-mastery",
  player: "controller",
  mastery: "Divine Comedy",
});
const wound = card("divine-native-wound", "ACTION", {
  kind: "add-counter",
  subject: { kind: "champion", player: "controller" },
  counter: "damage",
  amount: 6,
});
function withAbilities(
  base: GrandArchiveCard<GrandArchiveAbilityDefinition>,
  abilities: readonly GrandArchiveAbilityDefinition[],
): GrandArchiveCard<GrandArchiveAbilityDefinition> {
  if (base.layout.kind !== "single-faced") throw new Error("Expected fixture face");
  return { ...base, layout: { kind: "single-faced", face: { ...base.layout.face, abilities } } };
}
const protectedAlly = withAbilities(card("divine-native-protected", "ALLY"), [
  {
    id: "divine-native-protected-a1",
    kind: "static",
    staticKind: "intrinsic",
    text: "Spellshroud",
    keyword: { name: "spellshroud" },
  },
]);
function stackAction(
  id: string,
  effect: GrandArchiveEffect,
): GrandArchiveCard<GrandArchiveAbilityDefinition> {
  const base = card(id, "ACTION");
  if (base.layout.kind !== "single-faced") throw new Error("Expected fixture face");
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...base.layout.face,
        abilities: [
          {
            id: `${id}-a1` as const,
            kind: "card-resolution" as const,
            text: id,
            effect,
            targets: [
              {
                id: "target",
                kind: "target" as const,
                declared: "announcement" as const,
                chooser: "controller" as const,
                count: { kind: "exactly" as const, amount: 1 },
                unique: true,
                candidates: { kind: "stack-item" as const, itemTypes: ["ability" as const] },
              },
            ],
          },
        ],
      },
    },
  };
}
const negate = stackAction("divine-native-negate", {
  kind: "negate",
  subject: { kind: "bound", binding: "target" },
});
const copy = stackAction("divine-native-copy", {
  kind: "copy",
  copy: "ability",
  subject: { kind: "bound", binding: "target" },
});
function payment(game: GrandArchiveTestEngine) {
  return game
    .player("player-one")
    .zone("hand")
    .slice(0, 4)
    .map((card) => ({ kind: "card", cardId: card.objectId }));
}
function pass(game: GrandArchiveTestEngine) {
  const wait = game.waitState();
  if (wait.kind !== "opportunity") throw new Error(`Expected Opportunity, got ${wait.kind}`);
  game.player(wait.playerId).pass();
}
function drain(game: GrandArchiveTestEngine) {
  for (let i = 0; game.state.stack.length && i < 30; i++) pass(game);
  expect(game.state.stack).toHaveLength(0);
}
function nextMain(game: GrandArchiveTestEngine) {
  const turn = game.state.turn.number;
  for (let i = 0; i < 256; i++) {
    if (
      game.state.turn.playerId === "player-one" &&
      game.state.turn.phase === "main" &&
      game.state.turn.number > turn
    )
      return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else pass(game);
  }
  throw new Error("Did not reach the next main phase");
}
function setup(
  extraHand: readonly GrandArchiveCard<GrandArchiveAbilityDefinition>[] = [],
  field: readonly GrandArchiveCard<GrandArchiveAbilityDefinition>[] = [],
  playerChampion = champion,
) {
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: playerChampion,
      zones: {
        hand: [gain, wound, ...extraHand, ...Array.from({ length: 8 }, () => filler)],
        "main-deck": Array.from({ length: 20 }, () => filler),
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: [ally, protectedAlly, ...field],
        "main-deck": Array.from({ length: 20 }, () => filler),
      },
    },
    definitions: [divineComedy],
  });
  game.player("player-one").activate(gain);
  drain(game);
  return game;
}
function activate(game: GrandArchiveTestEngine, declarations: Record<string, unknown> = {}) {
  const command = decodeGrandArchiveCommand("activate-ability", {
    masteryName: "Divine Comedy",
    abilityId: "ts9VdtFtk1-a1",
    ...declarations,
  });
  if (!command) throw new Error("Native mastery activation was rejected by the command decoder");
  return game.player("player-one").tryExecute(command);
}
function restore(game: GrandArchiveTestEngine) {
  return GrandArchiveTestEngine.fromState(
    game.program,
    restoreGrandArchiveMatchSnapshot(
      game.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(game.state))),
    ),
  );
}

describe("native Divine Comedy activation", () => {
  it("activates its first page free with no object source and enforces the turn limit", () => {
    const game = setup();
    const before = game.player("player-one").zone("hand").length;
    expect(activate(game).ok).toBe(true);
    expect(game.state.stack[0]).toMatchObject({
      kind: "activated-ability",
      masterySource: { playerId: "player-one", name: "Divine Comedy" },
      selectedModeIds: ["cascade-1"],
    });
    expect(game.state.stack[0]?.sourceId).toBeUndefined();
    expect(game.player("player-one").zone("hand")).toHaveLength(before);
    drain(game);
    const state = game.state;
    expect(activate(game).ok).toBe(false);
    expect(game.state).toBe(state);
  });

  it("charges four on page two across restoration, then destroys and separately recovers", () => {
    let game = setup();
    game.player("player-one").activate(wound);
    drain(game);
    expect(activate(game).ok).toBe(true);
    drain(game);
    nextMain(game);
    game = restore(game);
    const targetId = game.player("player-two").card(ally).objectId;
    const declarations = { targets: { "target-1": [targetId] } };
    const state = game.state;
    expect(activate(game, declarations).ok).toBe(false);
    expect(game.state).toBe(state);
    const reservePayment = game
      .player("player-one")
      .zone("hand")
      .slice(0, 4)
      .map((card) => ({ kind: "card", cardId: card.objectId }));
    expect(activate(game, { ...declarations, reservePayment }).ok).toBe(true);
    expect(game.state.stack[0]?.selectedModeIds).toEqual(["cascade-2"]);
    expect(game.player("player-one").zone("memory")).toHaveLength(4);
    pass(game);
    pass(game);
    expect(game.state.objects[targetId]?.zone).toBe("graveyard");
    expect(game.state.objects[game.player("player-one").card(champion).objectId]?.damage).toBe(6);
    expect(game.state.stack[0]?.kind).toBe("triggered-ability");
    game = restore(game);
    drain(game);
    expect(game.state.objects[game.player("player-one").card(champion).objectId]?.damage).toBe(2);
  });

  it("enforces Dante Bonus, slow timing, the named mastery and automatic Cascade mode", () => {
    if (champion.layout.kind !== "single-faced") throw new Error("Expected fixture face");
    const otherChampion = {
      ...champion,
      canonicalId: "divine-native-other",
      slug: "divine-native-other",
      layout: {
        kind: "single-faced" as const,
        face: {
          ...champion.layout.face,
          id: "divine-native-other:face:default" as const,
          catalogId: "divine-native-other",
          name: "Other Champion",
          lineageName: "Lorraine",
        },
      },
    };
    const wrongChampionGame = setup([], [], otherChampion);
    expect(activate(wrongChampionGame).ok).toBe(false);
    const game = setup();
    const state = game.state;
    expect(activate(game, { masteryName: "Shifting Currents" }).ok).toBe(false);
    expect(activate(game, { modeIds: ["cascade-4"] }).ok).toBe(false);
    expect(game.state).toBe(state);
    game
      .player("player-one")
      .activate(game.player("player-one").cards(filler, { zone: "hand" })[0]!);
    const responseState = game.state;
    expect(activate(game).ok).toBe(false);
    expect(game.state).toBe(responseState);
    drain(game);
    pass(game);
    const command = decodeGrandArchiveCommand("activate-ability", {
      masteryName: "Divine Comedy",
      abilityId: "ts9VdtFtk1-a1",
    });
    if (!command) throw new Error("Expected native command");
    expect(game.player("player-two").tryExecute(command).ok).toBe(false);
  });

  it("applies player-wide mastery ability restrictions without using a champion as source", () => {
    const lock = withAbilities(card("divine-native-lock", "ALLY"), [
      {
        id: "divine-native-lock-a1",
        kind: "static",
        staticKind: "effects",
        text: "Opponents cannot activate mastery abilities.",
        effects: [
          {
            kind: "rule-modification",
            mode: "forbid",
            action: "activate",
            activationKind: "ability",
            subject: { kind: "player", player: "opponent" },
            filter: { kind: "type", oneOf: ["MASTERY"] },
            duration: { kind: "while-source-in-functional-zone" },
          },
        ],
      },
    ]);
    const game = setup([], [lock]);
    const state = game.state;
    expect(activate(game).ok).toBe(false);
    expect(game.state).toBe(state);
    expect(
      game
        .player("player-one")
        .legalCommands()
        .some(({ command }) => command.move === "activate-ability" && command.masteryName),
    ).toBe(false);
  });

  it("applies mastery-specific reserve cost modifiers", () => {
    const tax = withAbilities(card("divine-native-tax", "ALLY"), [
      {
        id: "divine-native-tax-a1",
        kind: "static",
        staticKind: "effects",
        text: "Mastery abilities cost one more.",
        effects: [
          {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            activationKind: "ability",
            costOperation: "add",
            amount: 1,
            costKind: "reserve",
            subject: { kind: "player", player: "opponent" },
            filter: { kind: "type", oneOf: ["MASTERY"] },
            duration: { kind: "while-source-in-functional-zone" },
          },
        ],
      },
    ]);
    const game = setup([], [tax]);
    expect(activate(game).ok).toBe(false);
    expect(activate(game, { reservePayment: payment(game).slice(0, 1) }).ok).toBe(true);
    expect(game.player("player-one").zone("memory")).toHaveLength(1);
  });

  it("rejects a Spellshroud target on the actual page-two activation without paying or advancing", () => {
    const game = setup();
    expect(activate(game).ok).toBe(true);
    drain(game);
    nextMain(game);
    const state = game.state;
    expect(
      activate(game, {
        reservePayment: payment(game),
        targets: { "target-1": [game.player("player-two").card(protectedAlly).objectId] },
      }).ok,
    ).toBe(false);
    expect(game.state).toBe(state);
    expect(
      activate(game, {
        reservePayment: payment(game),
        targets: { "target-1": [game.player("player-two").card(ally).objectId] },
      }).ok,
    ).toBe(true);
    expect(game.state.stack[0]?.selectedModeIds).toEqual(["cascade-2"]);
  });

  it("exposes the native mastery command to legal action discovery", () => {
    const game = setup();
    expect(
      game
        .player("player-one")
        .legalCommands()
        .some(
          ({ command }) =>
            command.move === "activate-ability" && command.masteryName === "Divine Comedy",
        ),
    ).toBe(true);
  });

  it("progresses through all four pages and does not loop Cascade", () => {
    let game = setup();
    game.player("player-one").activate(wound);
    drain(game);
    expect(activate(game).ok).toBe(true);
    drain(game);
    nextMain(game);
    expect(
      activate(game, {
        reservePayment: payment(game),
        targets: { "target-1": [game.player("player-two").card(ally).objectId] },
      }).ok,
    ).toBe(true);
    drain(game);
    nextMain(game);
    expect(activate(game, { reservePayment: payment(game) }).ok).toBe(true);
    expect(game.state.stack[0]?.selectedModeIds).toEqual(["cascade-3"]);
    drain(game);
    nextMain(game);
    game = restore(game);
    expect(activate(game, { reservePayment: payment(game) }).ok).toBe(true);
    expect(game.state.stack[0]?.selectedModeIds).toEqual(["cascade-4"]);
    drain(game);
    expect(game.state.objects[game.player("player-one").card(champion).objectId]?.damage).toBe(0);
    expect(game.state.objects[game.player("player-two").card(champion).objectId]?.damage).toBe(40);
    nextMain(game);
    expect(activate(game, { reservePayment: payment(game) }).ok).toBe(true);
    expect(game.state.stack[0]?.selectedModeIds).toEqual([]);
    drain(game);
    expect(game.state.objects[game.player("player-two").card(champion).objectId]?.damage).toBe(40);
  });

  it("does not negate the original activation, but allows negating its copy without advancing Cascade", () => {
    const game = setup([negate, negate, copy]);
    const p = game.player("player-one");
    expect(activate(game).ok).toBe(true);
    const originalId = game.state.stack[0]!.id;
    p.activate(p.cards(negate, { zone: "hand" })[0]!, { targets: { target: [originalId] } });
    pass(game);
    pass(game);
    expect(game.state.stack.some((item) => item.id === originalId && !item.negated)).toBe(true);
    p.activate(copy, { targets: { target: [originalId] } });
    pass(game);
    pass(game);
    const copied = game.state.stack.find((item) => item.isCopy);
    expect(copied?.masterySource).toEqual({ playerId: "player-one", name: "Divine Comedy" });
    if (!copied) throw new Error("Missing copied mastery activation");
    p.activate(p.cards(negate, { zone: "hand" })[0]!, { targets: { target: [copied.id] } });
    pass(game);
    pass(game);
    expect(game.state.stack.some((item) => item.id === copied.id)).toBe(false);
    expect(game.state.stack.some((item) => item.id === originalId)).toBe(true);
    drain(game);
    nextMain(game);
    expect(
      activate(game, {
        reservePayment: payment(game),
        targets: { "target-1": [game.player("player-two").card(ally).objectId] },
      }).ok,
    ).toBe(true);
    expect(game.state.stack[0]?.selectedModeIds).toEqual(["cascade-2"]);
  });

  it("revalidates page two when its target gains Spellshroud in response", () => {
    const protect = card("divine-native-protect", "ACTION", {
      kind: "continuous",
      subjects: {
        kind: "each",
        collection: {
          zones: ["field"],
          player: "opponent",
          filter: { kind: "type", oneOf: ["ALLY"] },
        },
      },
      affectedSet: "locked",
      layer: { layer: "D", modifies: "ability" },
      change: { kind: "grant-keyword", keyword: { name: "spellshroud" } },
      duration: { kind: "until-end-of-turn", whose: "controller" },
    });
    let game = setup([protect]);
    game.player("player-one").activate(wound);
    drain(game);
    expect(activate(game).ok).toBe(true);
    drain(game);
    nextMain(game);
    const reservePayment = game
      .player("player-one")
      .cards(filler, { zone: "hand" })
      .slice(0, 4)
      .map((card) => ({ kind: "card", cardId: card.objectId }));
    const targetId = game.player("player-two").card(ally).objectId;
    expect(activate(game, { reservePayment, targets: { "target-1": [targetId] } }).ok).toBe(true);
    game.player("player-one").activate(protect);
    pass(game);
    pass(game);
    game = restore(game);
    drain(game);
    expect(game.state.objects[targetId]?.zone).toBe("field");
    expect(game.state.objects[game.player("player-one").card(champion).objectId]?.damage).toBe(6);
    expect(
      game.state.eventHistory.filter((event) => event.type === "reflexive-trigger-generated"),
    ).toHaveLength(0);
  });

  it("page four deals twenty with zero removed counters and ignores damage prevention", () => {
    const prevent = withAbilities(card("divine-native-prevent", "ALLY"), [
      {
        id: "divine-native-prevent-a1",
        kind: "static",
        staticKind: "effects",
        text: "Prevent damage.",
        effects: [
          {
            kind: "replacement",
            event: { name: "damage-dealt" },
            operation: { kind: "prevent" },
            duration: { kind: "while-source-in-functional-zone" },
          },
        ],
      },
    ]);
    const game = setup([], [prevent]);
    expect(activate(game).ok).toBe(true);
    drain(game);
    nextMain(game);
    expect(
      activate(game, {
        reservePayment: payment(game),
        targets: { "target-1": [game.player("player-two").card(ally).objectId] },
      }).ok,
    ).toBe(true);
    drain(game);
    nextMain(game);
    expect(activate(game, { reservePayment: payment(game) }).ok).toBe(true);
    drain(game);
    nextMain(game);
    expect(activate(game, { reservePayment: payment(game) }).ok).toBe(true);
    drain(game);
    expect(game.state.objects[game.player("player-two").card(champion).objectId]?.damage).toBe(20);
  });

  it("rejects ambiguous object-plus-mastery identity at the protocol boundary", () => {
    expect(
      decodeGrandArchiveCommand("activate-ability", {
        sourceId: "fake",
        masteryName: "Divine Comedy",
        abilityId: "ts9VdtFtk1-a1",
      }),
    ).toBeNull();
  });
});
