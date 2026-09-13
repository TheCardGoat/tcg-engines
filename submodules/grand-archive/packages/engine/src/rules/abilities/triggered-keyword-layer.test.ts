import {
  blueSlime,
  devotedBloomweaver,
  markOfFervor,
  plasmaVanguard,
  protectorsPlate,
  slimeTotem,
} from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

const champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "triggered-keyword-layer-champion",
  slug: "triggered-keyword-layer-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "triggered-keyword-layer-champion:face:default",
      catalogId: "triggered-keyword-layer-champion",
      name: "Triggered Keyword Layer Champion",
      cost: { kind: "memory", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["TAMER"],
        subtypes: ["HUMAN"],
      },
      elements: ["NORM"],
      stats: { level: 0, life: 20 },
      rulesText: "",
      abilities: [],
    },
  },
};

const filler: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "triggered-keyword-layer-filler",
  slug: "triggered-keyword-layer-filler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "triggered-keyword-layer-filler:face:default",
      catalogId: "triggered-keyword-layer-filler",
      name: "Triggered Keyword Layer Filler",
      cost: { kind: "reserve", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: [],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

const printedVigorAlly: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "triggered-keyword-layer-vigor-ally",
  slug: "triggered-keyword-layer-vigor-ally",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "triggered-keyword-layer-vigor-ally:face:default",
      catalogId: "triggered-keyword-layer-vigor-ally",
      name: "Triggered Keyword Layer Vigor Ally",
      cost: { kind: "reserve", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["SLIME"],
      },
      elements: ["TERA"],
      stats: { power: 1, life: 2 },
      rulesText: "Vigor",
      abilities: [
        {
          id: "triggeredKeywordLayerVigorAlly-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Vigor",
          keyword: { name: "vigor" },
        },
      ],
    },
  },
};

const vigorSuppressor: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "triggered-keyword-layer-vigor-suppressor",
  slug: "triggered-keyword-layer-vigor-suppressor",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "triggered-keyword-layer-vigor-suppressor:face:default",
      catalogId: "triggered-keyword-layer-vigor-suppressor",
      name: "Triggered Keyword Layer Vigor Suppressor",
      cost: { kind: "memory", amount: 0 },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "Linked ally loses vigor.",
      abilities: [
        {
          id: "triggered-keyword-layer-vigor-suppressor-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link",
          keyword: { name: "link", target: "ally" },
        },
        {
          id: "triggered-keyword-layer-vigor-suppressor-a2",
          kind: "static",
          staticKind: "effects",
          executionSource: "linked-object",
          text: "Linked ally loses vigor.",
          effects: [
            {
              kind: "continuous",
              subjects: { kind: "source" },
              affectedSet: "dynamic",
              duration: { kind: "while-source-in-functional-zone" },
              layer: { layer: "D", modifies: "ability" },
              change: {
                kind: "remove-keyword",
                keyword: { name: "vigor", anyValue: true },
              },
            },
          ],
        },
      ],
    },
  },
};

function player(
  id: "p1" | "p2",
  mainDefinitionId: string,
  materialDefinitionIds: readonly string[] = [],
): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: mainDefinitionId, count: 1 },
      { definitionId: filler.canonicalId, count: 12 },
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...materialDefinitionIds.map((definitionId) => ({ definitionId, count: 1 })),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

describe("Grand Archive Layer D triggered keywords", () => {
  it("executes Vigor granted by catalog Slime Totem", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, blueSlime, slimeTotem]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", blueSlime.canonicalId, [slimeTotem.canonicalId]),
          player("p2", filler.canonicalId),
        ],
        firstPlayerId: "p1",
        randomSeed: 1801,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const slime = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === blueSlime.canonicalId,
    );
    const totem = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === slimeTotem.canonicalId,
    );
    if (!slime || !totem) throw new Error("Missing Slime Totem fixture objects");

    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: slime.id, from: slime.zone, to: "field" },
      { type: "object-moved", objectId: totem.id, from: totem.zone, to: "field" },
      { type: "object-state-changed", objectId: slime.id, state: "rested", value: true },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, {
      ...positioned,
      players: {
        ...positioned.players,
        [p1]: { ...positioned.players[p1]!, hasTakenFirstTurn: true },
      },
    });

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const trigger = runtime.state.stack.at(-1);
    expect(trigger?.sourceId).toBe(slime.id);
    expect(
      trigger?.kind === "triggered-ability" &&
        "intrinsic" in trigger.ability &&
        trigger.ability.intrinsic
        ? trigger.ability.keyword.name
        : undefined,
    ).toBe("vigor");
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[slime.id]?.states.has("rested")).toBe(false);
  });

  it("does not execute a printed Vigor instance removed in Layer D", () => {
    const program = createGrandArchiveMatchProgram([
      champion,
      filler,
      printedVigorAlly,
      vigorSuppressor,
    ]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", printedVigorAlly.canonicalId, [vigorSuppressor.canonicalId]),
          player("p2", filler.canonicalId),
        ],
        firstPlayerId: "p1",
        randomSeed: 1802,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const ally = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === printedVigorAlly.canonicalId,
    );
    const suppressor = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === vigorSuppressor.canonicalId,
    );
    if (!ally || !suppressor) throw new Error("Missing Vigor suppression fixture objects");

    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: ally.id, from: ally.zone, to: "field" },
      {
        type: "object-moved",
        objectId: suppressor.id,
        from: suppressor.zone,
        to: "field",
        hostId: ally.id,
      },
      { type: "object-state-changed", objectId: ally.id, state: "rested", value: true },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, {
      ...positioned,
      players: {
        ...positioned.players,
        [p1]: { ...positioned.players[p1]!, hasTakenFirstTurn: true },
      },
    });

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.turn.phase).toBe("end");
    expect(runtime.state.stack).toHaveLength(0);
    expect(runtime.state.objects[ally.id]?.states.has("rested")).toBe(true);
  });

  it("uses a granted Vigor when the catalog ally's printed Vigor restriction is inactive", () => {
    const program = createGrandArchiveMatchProgram([
      champion,
      filler,
      plasmaVanguard,
      markOfFervor,
    ]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", plasmaVanguard.canonicalId, [markOfFervor.canonicalId]),
          player("p2", filler.canonicalId),
        ],
        firstPlayerId: "p1",
        randomSeed: 1803,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const vanguard = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === plasmaVanguard.canonicalId,
    );
    const mark = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === markOfFervor.canonicalId,
    );
    if (!vanguard || !mark) throw new Error("Missing Mark of Fervor fixture objects");

    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: vanguard.id, from: vanguard.zone, to: "field" },
      {
        type: "object-moved",
        objectId: mark.id,
        from: mark.zone,
        to: "field",
        hostId: vanguard.id,
      },
      { type: "object-state-changed", objectId: vanguard.id, state: "rested", value: true },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, {
      ...positioned,
      players: {
        ...positioned.players,
        [p1]: { ...positioned.players[p1]!, hasTakenFirstTurn: true },
      },
    });

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const trigger = runtime.state.stack.at(-1);
    expect(trigger?.sourceId).toBe(vanguard.id);
    expect(trigger?.kind === "triggered-ability" ? trigger.ability.id : undefined).toMatch(
      /^layerDKeyword/,
    );
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[vanguard.id]?.states.has("rested")).toBe(false);
  });

  it("executes Intercept granted by catalog Protector's Plate from the linked ally", () => {
    const program = createGrandArchiveMatchProgram([
      champion,
      filler,
      printedVigorAlly,
      devotedBloomweaver,
      protectorsPlate,
    ]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", printedVigorAlly.canonicalId),
          player("p2", devotedBloomweaver.canonicalId, [protectorsPlate.canonicalId]),
        ],
        firstPlayerId: "p1",
        randomSeed: 1804,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attacker = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === printedVigorAlly.canonicalId,
    );
    const interceptor = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === devotedBloomweaver.canonicalId,
    );
    const plate = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === protectorsPlate.canonicalId,
    );
    const defendingChampionId = initial.zones[p2].field[0];
    if (!attacker || !interceptor || !plate || !defendingChampionId) {
      throw new Error("Missing Protector's Plate fixture objects");
    }

    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: attacker.id, from: attacker.zone, to: "field" },
      { type: "object-moved", objectId: interceptor.id, from: interceptor.zone, to: "field" },
      {
        type: "object-moved",
        objectId: plate.id,
        from: plate.zone,
        to: "field",
        hostId: interceptor.id,
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, {
      ...positioned,
      players: {
        ...positioned.players,
        [p1]: { ...positioned.players[p1]!, hasTakenFirstTurn: true },
      },
    });

    expect(
      runtime.execute(
        {
          move: "declare-attack",
          attackerId: attacker.id,
          targetIds: [defendingChampionId],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const trigger = runtime.state.stack.at(-1);
    expect(trigger?.sourceId).toBe(interceptor.id);
    expect(
      trigger?.kind === "triggered-ability" &&
        "intrinsic" in trigger.ability &&
        trigger.ability.intrinsic
        ? trigger.ability.keyword.name
        : undefined,
    ).toBe("intercept");
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-optional-effect") {
      throw new Error("Expected the granted Intercept decision");
    }
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: true,
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.combat?.targetIds).toEqual([interceptor.id]);
  });
});
