import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveClass,
  GrandArchiveExecutableAbility,
  GrandArchiveElement,
  GrandArchivePlayableCardType,
  GrandArchivePrintedCost,
  GrandArchiveSupertype,
} from "@tcg/grand-archive-types";
import {
  blightroot,
  fraysia,
  manaroot,
  pantheonBarrier,
  planarAbyss,
  razorvine,
  silvershine,
  springleaf,
  steelSlug,
} from "@tcg/grand-archive-cards";
import { describe, expect, it } from "vitest";
import { proposeGrandArchiveCombatCleanup } from "../procedures/combat/combat.ts";
import { executeGrandArchiveEffect } from "../procedures/effects/effect-executor.ts";
import { grandArchiveObjectId, grandArchivePlayerId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState as createGrandArchiveMatchInitialStateWithDeckValidation,
  type GrandArchivePantheonPlayerSetup,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "./kernel.ts";
import { listGrandArchiveLegalCommands } from "../commands/legal-commands.ts";
import { createGrandArchiveMatchProgram } from "./match-program.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";
import {
  chooseGrandArchiveReplacement,
  collectGrandArchiveReplacementCandidates,
} from "../rules/replacements/replacements.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../snapshot/snapshot.ts";
import { collectGrandArchiveStateBasedEvents } from "../rules/state/state-based.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "../rules/abilities/triggers.ts";
import { projectGrandArchiveViewerState } from "../projection/view.ts";

function createGrandArchiveMatchInitialState(
  program: Parameters<typeof createGrandArchiveMatchInitialStateWithDeckValidation>[0],
  input: Parameters<typeof createGrandArchiveMatchInitialStateWithDeckValidation>[1],
) {
  return createGrandArchiveMatchInitialStateWithDeckValidation(program, input, {
    validateDeckConstruction: false,
    skipPregameForTests: true,
  });
}

function card<Type extends GrandArchivePlayableCardType>(
  canonicalId: string,
  type: Type,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  level?: number,
  life?: number,
  options?: {
    readonly name?: string;
    readonly lineageName?: string;
    readonly cost?: GrandArchivePrintedCost;
    readonly supertypes?: readonly GrandArchiveSupertype[];
    readonly power?: number;
    readonly durability?: number;
    readonly subtypes?: readonly string[];
    readonly classes?: readonly [GrandArchiveClass, ...GrandArchiveClass[]];
    readonly elements?: readonly [GrandArchiveElement, ...GrandArchiveElement[]];
    readonly speed?: "fast" | "slow";
  },
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId,
    slug: canonicalId,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${canonicalId}:face:default`,
        catalogId: canonicalId,
        name: options?.name ?? canonicalId,
        ...(options?.lineageName ? { lineageName: options.lineageName } : {}),
        cost: options?.cost ?? { kind: "none" },
        typeLine: {
          supertypes: options?.supertypes ?? [],
          types: [type],
          classes: options?.classes ?? ["MAGE"],
          subtypes: options?.subtypes ?? [],
        },
        elements: options?.elements ?? ["NORM"],
        ...(options?.speed ? { speed: options.speed } : {}),
        stats: {
          ...(level === undefined ? {} : { level }),
          ...(life === undefined
            ? type === "CHAMPION"
              ? { life: 20 }
              : type === "ALLY"
                ? { life: 3 }
                : {}
            : { life }),
          ...(options?.power === undefined
            ? type === "ALLY" || type === "ATTACK"
              ? { power: 1 }
              : {}
            : { power: options.power }),
          ...(options?.durability === undefined ? {} : { durability: options.durability }),
        },
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("test-champion", "CHAMPION", [], 0, 30);
const actionA = card("test-action-a", "ACTION");
const actionB = card("test-action-b", "ACTION");
const regalia = card("test-regalia", "ITEM");
const lesserBoon = card("test-lesser-boon", "LESSER BOON");
const greaterBoon = card("test-greater-boon", "GREATER BOON");
const barrier = {
  ...pantheonBarrier,
  layout: {
    kind: "single-faced" as const,
    face: {
      ...(pantheonBarrier.layout.kind === "single-faced"
        ? pantheonBarrier.layout.face
        : pantheonBarrier.layout.defaultFace),
      abilities: (pantheonBarrier.layout.kind === "single-faced"
        ? pantheonBarrier.layout.face.abilities
        : pantheonBarrier.layout.defaultFace.abilities
      ).filter((ability) => ability.id !== "WyNvyDHFdB-a3"),
    },
  },
};
const executableCards = [
  champion,
  actionA,
  actionB,
  regalia,
  lesserBoon,
  greaterBoon,
  barrier,
] as const;

function standardPlayer(id: string): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: actionA.canonicalId, count: 2 },
      { definitionId: actionB.canonicalId, count: 2 },
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      { definitionId: regalia.canonicalId, count: 1 },
    ],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function pantheonPlayer(id: string): GrandArchivePantheonPlayerSetup {
  return {
    ...standardPlayer(id),
    sideboard: undefined,
    pantheon: {
      lesserBoonDefinitionId: lesserBoon.canonicalId,
      greaterBoonDefinitionId: greaterBoon.canonicalId,
      barrierDefinitionId: barrier.canonicalId,
    },
  };
}

describe("Grand Archive engine foundation", () => {
  it("rejects parser debt at executable match-program admission", () => {
    const unparsed = card("unparsed", "ACTION", [
      {
        id: "unparsed-a1",
        kind: "unparsed",
        text: "Do something unknown.",
        unparsedSegments: ["Do something unknown."],
      },
    ]);
    expect(() => createGrandArchiveMatchProgram([unparsed])).toThrow(
      "contains non-executable ability unparsed-a1",
    );
  });

  it("constructs a deterministic Standard game with the starting champions on the field", () => {
    const program = createGrandArchiveMatchProgram(executableCards);
    const input = {
      mode: "standard" as const,
      players: [standardPlayer("p1"), standardPlayer("p2")] as const,
      firstPlayerId: "p1",
      randomSeed: 42,
    };
    const first = createGrandArchiveMatchInitialState(program, input);
    const second = createGrandArchiveMatchInitialState(program, input);
    const p1 = grandArchivePlayerId("p1");
    expect(first.zones[p1]["main-deck"]).toEqual(second.zones[p1]["main-deck"]);
    expect(first.zones[p1].field).toHaveLength(1);
    expect(first.objects[first.zones[p1].field[0]!]?.definitionId).toBe(champion.canonicalId);
    expect(first.turn.phase).toBe("main");
    expect(first.opportunity?.holderId).toBe(p1);
  });

  it("rejects a Pantheon setup that substitutes another definition for Pantheon Barrier", () => {
    const program = createGrandArchiveMatchProgram(executableCards);
    const invalidPlayer = (id: string): GrandArchivePantheonPlayerSetup => ({
      ...pantheonPlayer(id),
      pantheon: {
        ...pantheonPlayer(id).pantheon,
        barrierDefinitionId: actionA.canonicalId,
      },
    });
    expect(() =>
      createGrandArchiveMatchInitialStateWithDeckValidation(
        program,
        {
          mode: "pantheon",
          players: [invalidPlayer("p1"), invalidPlayer("p2"), invalidPlayer("p3")] as const,
          firstPlayerId: "p1",
          randomSeed: 43,
        },
        { validateDeckConstruction: false },
      ),
    ).toThrow("must be the Pantheon Barrier token definition");
  });

  it("validates constructed decks and permits only one Divine Relic in a material deck", () => {
    const mainCards = Array.from({ length: 60 }, (_, index) =>
      card(`deck-validation-action-${index + 1}`, "ACTION"),
    );
    const divineRelic = (id: string) =>
      card(
        id,
        "ITEM",
        [
          {
            id: `${id}-a1`,
            kind: "static",
            staticKind: "intrinsic",
            text: "Divine Relic",
            keyword: { name: "divine-relic" },
          },
        ],
        undefined,
        undefined,
        { supertypes: ["REGALIA"] },
      );
    const firstRelic = divineRelic("first-divine-relic");
    const secondRelic = divineRelic("second-divine-relic");
    const sameNameCards = Array.from({ length: 5 }, (_, index) =>
      card(`same-name-printing-${index + 1}`, "ACTION", [], undefined, undefined, {
        name: "Shared Card Name",
      }),
    );
    const program = createGrandArchiveMatchProgram([
      champion,
      firstRelic,
      secondRelic,
      ...sameNameCards,
      ...mainCards,
    ]);
    const player = (id: string, relicIds: readonly string[]): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: mainCards.map((mainCard) => ({
        definitionId: mainCard.canonicalId,
        count: 1,
      })),
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        ...relicIds.map((definitionId) => ({ definitionId, count: 1 })),
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const validInput = {
      mode: "standard" as const,
      players: [
        player("p1", [firstRelic.canonicalId]),
        player("p2", [firstRelic.canonicalId]),
      ] as const,
      firstPlayerId: "p1",
      randomSeed: 180,
    };
    expect(() =>
      createGrandArchiveMatchInitialStateWithDeckValidation(program, validInput),
    ).not.toThrow();
    expect(() =>
      createGrandArchiveMatchInitialStateWithDeckValidation(program, {
        ...validInput,
        players: [
          player("p1", [firstRelic.canonicalId, secondRelic.canonicalId]),
          player("p2", [firstRelic.canonicalId]),
        ],
      }),
    ).toThrow("more than one Divine Relic");
    expect(() =>
      createGrandArchiveMatchInitialStateWithDeckValidation(program, {
        ...validInput,
        players: [
          {
            ...player("p1", [firstRelic.canonicalId]),
            mainDeck: validInput.players[0].mainDeck.slice(1),
          },
          player("p2", [firstRelic.canonicalId]),
        ],
      }),
    ).toThrow("at least 60 cards");
    expect(() =>
      createGrandArchiveMatchInitialStateWithDeckValidation(program, {
        ...validInput,
        players: [
          {
            ...player("p1", [firstRelic.canonicalId]),
            mainDeck: [
              ...sameNameCards.map((sameNameCard) => ({
                definitionId: sameNameCard.canonicalId,
                count: 1,
              })),
              ...validInput.players[0].mainDeck.slice(5),
            ],
          },
          player("p2", [firstRelic.canonicalId]),
        ],
      }),
    ).toThrow("more than 4 card(s) named Shared Card Name");
  });

  it("draws for the first Pantheon player and passes Opportunity through every player", () => {
    const program = createGrandArchiveMatchProgram(executableCards);
    const state = createGrandArchiveMatchInitialState(program, {
      mode: "pantheon",
      players: [pantheonPlayer("p1"), pantheonPlayer("p2"), pantheonPlayer("p3")],
      firstPlayerId: "p1",
      randomSeed: 7,
    });
    const runtime = new GrandArchiveMatchRuntime(program, state);
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const p3 = grandArchivePlayerId("p3");
    expect(state.zones[p1].hand).toHaveLength(1);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.state.opportunity?.holderId).toBe(p2);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.opportunity?.holderId).toBe(p3);
    expect(runtime.execute({ move: "pass" }, { playerId: p3 }).ok).toBe(true);
    expect(runtime.state.turn.phase).toBe("end");
    expect(runtime.state.opportunity?.holderId).toBe(p1);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p3 }).ok).toBe(true);
    expect(runtime.state.turn).toMatchObject({ playerId: p2, phase: "main" });
    expect(runtime.state.zones[p2].hand).toHaveLength(1);
  });

  it("commits concessions atomically and ends a two-player match", () => {
    const program = createGrandArchiveMatchProgram(executableCards);
    const state = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [standardPlayer("p1"), standardPlayer("p2")],
      firstPlayerId: "p1",
      randomSeed: 1,
    });
    const runtime = new GrandArchiveMatchRuntime(program, state);
    const result = runtime.execute(
      { move: "concede" },
      { playerId: grandArchivePlayerId("p1"), expectedStateVersion: 0 },
    );
    expect(result.ok).toBe(true);
    expect(runtime.state.status).toBe("finished");
    expect(runtime.state.winnerIds).toEqual([grandArchivePlayerId("p2")]);
  });

  it("does not expose a partially reduced state when a transaction is refused", () => {
    const program = createGrandArchiveMatchProgram(executableCards);
    const state = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [standardPlayer("p1"), standardPlayer("p2")],
      firstPlayerId: "p1",
      randomSeed: 1,
    });
    const objectId = state.zones[grandArchivePlayerId("p1")].field[0]!;
    const kernel = new GrandArchiveTransactionKernel();
    expect(() =>
      kernel.transact(state, [
        { type: "object-state-changed", objectId, state: "rested", value: true },
        {
          type: "object-state-changed",
          objectId: grandArchiveObjectId("missing"),
          state: "rested",
          value: true,
        },
      ]),
    ).toThrow("Unknown object missing");
    expect(state.objects[objectId]?.states.has("rested")).toBe(false);
  });

  it("detects lethal champion damage before the next Opportunity window", () => {
    const mortalChampion = card("mortal-champion", "CHAMPION", [], 0, 3);
    const program = createGrandArchiveMatchProgram([mortalChampion, actionA, regalia]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: actionA.canonicalId, count: 1 }],
      materialDeck: [
        { definitionId: mortalChampion.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: mortalChampion.canonicalId,
    });
    const state = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1,
    });
    const p1 = grandArchivePlayerId("p1");
    const championId = state.zones[p1].field[0]!;
    const damaged = new GrandArchiveTransactionKernel().transact(state, [
      { type: "damage-marked", objectId: championId, amount: 3 },
    ]).state;
    const checks = collectGrandArchiveStateBasedEvents(program, damaged);
    expect(checks.map((event) => event.type)).toEqual([
      "object-moved",
      "player-lost",
      "match-finished",
    ]);
  });

  it("never projects opposing private-zone identities", () => {
    const program = createGrandArchiveMatchProgram(executableCards);
    const state = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [standardPlayer("p1"), standardPlayer("p2")],
      firstPlayerId: "p1",
      randomSeed: 9,
    });
    const view = projectGrandArchiveViewerState(program, state, grandArchivePlayerId("p1"));
    const opponent = view.players.find((player) => player.id === grandArchivePlayerId("p2"));
    expect(opponent?.zones["main-deck"]).toEqual({
      visibility: "hidden",
      count: 4,
      revealedObjects: [],
    });
    expect(opponent?.zones["material-deck"]).toEqual({
      visibility: "hidden",
      count: 1,
      revealedObjects: [],
    });
    expect(opponent?.zones.field.visibility).toBe("visible");
  });

  it("round-trips Sets through a versioned program-bound snapshot", () => {
    const program = createGrandArchiveMatchProgram(executableCards);
    const state = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [standardPlayer("p1"), standardPlayer("p2")],
      firstPlayerId: "p1",
      randomSeed: 9,
    });
    const objectId = state.zones[grandArchivePlayerId("p1")].field[0]!;
    const rested = new GrandArchiveTransactionKernel().transact(state, [
      { type: "object-state-changed", objectId, state: "rested", value: true },
    ]).state;
    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(rested))),
    );
    expect(restored.objects[objectId]?.states).toBeInstanceOf(Set);
    expect(restored.objects[objectId]?.states.has("rested")).toBe(true);
    expect(restored.eventHistory).toHaveLength(rested.eventHistory.length);
  });

  it("resolves structured effect sequences without state checks between instructions", () => {
    const mortalChampion = card("sequence-champion", "CHAMPION", [], 0, 3);
    const program = createGrandArchiveMatchProgram([mortalChampion, actionA, regalia]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: actionA.canonicalId, count: 3 }],
      materialDeck: [
        { definitionId: mortalChampion.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: mortalChampion.canonicalId,
    });
    const state = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 3,
    });
    const p1 = grandArchivePlayerId("p1");
    const championId = state.zones[p1].field[0]!;
    const kernel = new GrandArchiveTransactionKernel();
    const result = executeGrandArchiveEffect(
      {
        kind: "sequence",
        effects: [
          { kind: "deal-damage", recipient: { kind: "bound", binding: "target" }, amount: 3 },
          { kind: "recover", player: "controller", amount: 3 },
          { kind: "draw", player: "controller", amount: 2 },
        ],
      },
      {
        program,
        state,
        controllerId: p1,
        sourceId: championId,
        bindings: { target: [championId] },
      },
      (current, events) => {
        const transaction = kernel.transact(current, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(result.state.objects[championId]?.damage).toBe(0);
    expect(result.state.zones[p1].hand).toHaveLength(2);
    expect(collectGrandArchiveStateBasedEvents(program, result.state)).toEqual([]);
  });

  it("activates, pays for, responds to, and resolves an ability through the production runtime", () => {
    const abilityChampion = card(
      "ability-champion",
      "CHAMPION",
      [
        {
          id: "ability-champion-a1",
          kind: "activated",
          activation: "ability",
          cost: { kind: "pay-reserve", amount: 1 },
          effect: { kind: "draw", player: "controller", amount: 1 },
          text: "Reserve 1: Draw a card.",
        },
      ],
      0,
      10,
    );
    const program = createGrandArchiveMatchProgram([abilityChampion, actionA, actionB, regalia]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: actionA.canonicalId, count: 2 },
        { definitionId: actionB.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: abilityChampion.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: abilityChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 11,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = initial.zones[p1].field[0]!;
    const paymentId = initial.zones[p1]["main-deck"][0]!;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: paymentId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    const activation = runtime.execute(
      {
        move: "activate-ability",
        sourceId,
        abilityId: "ability-champion-a1",
        reservePayment: [{ kind: "card", cardId: paymentId }],
      },
      { playerId: p1 },
    );
    expect(activation.ok).toBe(true);
    expect(runtime.state.stack).toHaveLength(1);
    expect(runtime.state.zones[p1].memory).toEqual([paymentId]);
    expect(runtime.state.opportunity?.holderId).toBe(p1);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    const resolution = runtime.execute({ move: "pass" }, { playerId: p2 });
    expect(resolution.ok).toBe(true);
    expect(runtime.state.stack).toHaveLength(0);
    expect(runtime.state.zones[p1].hand).toHaveLength(1);
    expect(runtime.state.opportunity?.holderId).toBe(p1);
  });

  it("lets Intent cards activate abilities but rejects object-only source costs", () => {
    const intentAttack = card("intent-ability-attack", "ATTACK", [
      {
        id: "intentAbilityAttack-a1",
        kind: "activated",
        activation: "ability",
        text: "Rest this card: Do nothing.",
        cost: { kind: "rest", subject: { kind: "source" } },
        effect: { kind: "no-op" },
      },
      {
        id: "intentAbilityAttack-a2",
        kind: "activated",
        activation: "ability",
        text: "(0): Do nothing.",
        cost: { kind: "pay-reserve", amount: 0 },
        effect: { kind: "no-op" },
      },
    ]);
    const program = createGrandArchiveMatchProgram([champion, intentAttack, actionA]);
    const combatPlayer = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: intentAttack.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [combatPlayer("p1"), combatPlayer("p2")],
      firstPlayerId: "p1",
      randomSeed: 4,
    });
    const p1 = grandArchivePlayerId("p1");
    const attackId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === intentAttack.canonicalId,
    )!.id;
    const championId = initial.zones[p1].field[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: attackId,
        from: "main-deck",
        to: "intent",
        hostId: championId,
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, positioned);

    expect(
      listGrandArchiveLegalCommands(program, runtime.state, p1).some(
        (candidate) =>
          candidate.command.move === "activate-ability" &&
          candidate.command.sourceId === attackId &&
          candidate.command.abilityId === "intentAbilityAttack-a1",
      ),
    ).toBe(false);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId: attackId,
          abilityId: "intentAbilityAttack-a1",
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(runtime.state.objects[attackId]?.states.has("rested")).toBe(false);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId: attackId,
          abilityId: "intentAbilityAttack-a2",
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.stack.at(-1)).toMatchObject({
      kind: "activated-ability",
      sourceId: attackId,
    });
  });

  it("declares selection-backed ability costs atomically and rolls back illegal payment", () => {
    const costItem = card("selection-cost-item", "ITEM", [
      {
        id: "selection-cost-item-a1",
        kind: "activated",
        activation: "ability",
        cost: {
          kind: "all",
          costs: [
            { kind: "pay-reserve", amount: 1 },
            {
              kind: "select-and-sacrifice",
              player: "controller",
              count: { kind: "exactly", amount: 1 },
              filter: { kind: "type", oneOf: ["ALLY"] },
              bindResultAs: "sacrificed-ally",
            },
          ],
        },
        effect: {
          kind: "add-counter",
          subject: { kind: "source" },
          counter: { named: "paid" },
          amount: 1,
        },
        text: "Reserve 1 and sacrifice an ally: Put a paid counter on this.",
      },
    ]);
    const costAlly = card("selection-cost-ally", "ALLY", [], undefined, 2);
    const program = createGrandArchiveMatchProgram([champion, costItem, costAlly, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: costAlly.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: costItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 71,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === costItem.canonicalId,
    )!.id;
    const allyId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === costAlly.canonicalId,
    )!.id;
    const paymentId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === actionA.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: paymentId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    const illegal = runtime.execute(
      {
        move: "activate-ability",
        sourceId,
        abilityId: "selection-cost-item-a1",
        reservePayment: [{ kind: "card", cardId: paymentId }],
      },
      { playerId: p1 },
    );
    expect(illegal.ok).toBe(false);
    expect(runtime.state.objects[paymentId]?.zone).toBe("hand");
    expect(runtime.state.objects[allyId]?.zone).toBe("field");
    expect(runtime.state.stack).toHaveLength(0);

    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "selection-cost-item-a1",
          reservePayment: [{ kind: "card", cardId: paymentId }],
          costSelections: [[allyId]],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[paymentId]?.zone).toBe("memory");
    expect(runtime.state.objects[allyId]?.zone).toBe("graveyard");
    expect(runtime.state.stack[0]?.bindings["sacrificed-ally"]).toEqual([allyId]);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[sourceId]?.counters["named:paid"]).toBe(1);
  });

  it("pays ability memory costs by deterministic random banishment", () => {
    const memoryItem = card("memory-cost-item", "ITEM", [
      {
        id: "memory-cost-item-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-memory", amount: 2, bindResultAs: "memory-payment" },
        effect: { kind: "no-op" },
        text: "Memory 2: Do nothing.",
      },
    ]);
    const program = createGrandArchiveMatchProgram([champion, memoryItem, actionA, actionB]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: actionA.canonicalId, count: 2 },
        { definitionId: actionB.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: memoryItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 73,
    });
    const p1 = grandArchivePlayerId("p1");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === memoryItem.canonicalId,
    )!.id;
    const memoryIds = initial.zones[p1]["main-deck"].slice(0, 3);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
      ...memoryIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "memory" as const,
      })),
    ]).state;
    const activate = (state: typeof prepared) => {
      const runtime = new GrandArchiveMatchRuntime(program, state);
      const result = runtime.execute(
        { move: "activate-ability", sourceId, abilityId: "memory-cost-item-a1" },
        { playerId: p1 },
      );
      expect(result.ok).toBe(true);
      return runtime.state;
    };
    const first = activate(prepared);
    const second = activate(prepared);
    expect(first.zones[p1].banishment).toEqual(second.zones[p1].banishment);
    expect(first.zones[p1].banishment).toHaveLength(2);
    expect(first.random).toEqual(second.random);
    expect(first.stack[0]?.bindings["memory-payment"]).toEqual(first.zones[p1].banishment);
  });

  it("pays and records optional additional card costs after the printed reserve cost", () => {
    const costlyAction = card(
      "optional-additional-cost-action",
      "ACTION",
      [
        {
          id: "optionalAdditionalCostAction-a1",
          kind: "card-resolution",
          additionalCost: {
            kind: "optional",
            cost: { kind: "pay-reserve", amount: 2 },
            bindPaidAs: "paid-extra",
          },
          effect: { kind: "no-op" },
          text: "As an additional cost, you may reserve two cards.",
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 1 } },
    );
    const program = createGrandArchiveMatchProgram([champion, costlyAction, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: costlyAction.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 4 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 79,
    });
    const p1 = grandArchivePlayerId("p1");
    const cardId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === costlyAction.canonicalId,
    )!.id;
    const paymentIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === actionA.canonicalId)
      .slice(0, 3)
      .map((object) => object.id);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: cardId, from: "main-deck", to: "hand" },
      ...paymentIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId,
          reservePayment: paymentIds.map((cardId) => ({ kind: "card", cardId })),
          payOptionalCost: true,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.zones[p1].memory).toEqual(paymentIds);
    expect(runtime.state.stack[0]?.bindings["paid-extra"]).toBe(true);
  });

  it("uses one ordered mix of hand cards and Reservable objects for printed and additional reserve costs", () => {
    const reservableItem = card("reservable-payment-item", "ITEM", [
      {
        id: "reservablePaymentItem-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Reservable",
        keyword: { name: "reservable" },
      },
    ]);
    const costlyAction = card(
      "reservable-additional-cost-action",
      "ACTION",
      [
        {
          id: "reservableAdditionalCostAction-a1",
          kind: "card-resolution",
          additionalCost: { kind: "pay-reserve", amount: 1 },
          effect: { kind: "no-op" },
          text: "As an additional cost, pay 1 reserve.",
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 2 } },
    );
    const program = createGrandArchiveMatchProgram([
      champion,
      reservableItem,
      costlyAction,
      actionA,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: costlyAction.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: reservableItem.canonicalId, count: 2 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 80,
    });
    const p1 = grandArchivePlayerId("p1");
    const cardId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === costlyAction.canonicalId,
    )!.id;
    const handPaymentId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === actionA.canonicalId,
    )!.id;
    const reservableIds = Object.values(initial.objects)
      .filter(
        (object) => object.ownerId === p1 && object.definitionId === reservableItem.canonicalId,
      )
      .map((object) => object.id);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: cardId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: handPaymentId, from: "main-deck", to: "hand" },
      ...reservableIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "material-deck" as const,
        to: "field" as const,
      })),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId,
          reservePayment: [
            { kind: "reservable", objectId: reservableIds[0]! },
            { kind: "card", cardId: handPaymentId },
            { kind: "reservable", objectId: reservableIds[1]! },
          ],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[handPaymentId]?.zone).toBe("memory");
    expect(reservableIds.map((id) => runtime.state.objects[id]?.states.has("rested"))).toEqual([
      true,
      true,
    ]);
  });

  it("uses only ready controlled objects with active Reservable for ability reserve costs", () => {
    const reservableGrant = card("ability-reservable-grant", "ITEM", [
      {
        id: "abilityReservableGrant-a1",
        kind: "static",
        staticKind: "effects",
        text: "Items you control have Reservable.",
        effects: [
          {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: { kind: "type", oneOf: ["ITEM"] },
              },
            },
            affectedSet: "dynamic",
            duration: { kind: "while-source-in-functional-zone" },
            layer: { layer: "D", modifies: "ability" },
            change: { kind: "grant-keyword", keyword: { name: "reservable" } },
          },
        ],
      },
    ]);
    const reserveChampion = card(
      "reservable-ability-champion",
      "CHAMPION",
      [
        {
          id: "reservableAbilityChampion-a1",
          kind: "activated",
          activation: "ability",
          cost: { kind: "pay-reserve", amount: 1 },
          effect: { kind: "no-op" },
          text: "Reserve 1: Do nothing.",
        },
      ],
      0,
      10,
    );
    const ordinaryItem = card("ordinary-payment-item", "ITEM");
    const ordinaryAlly = card("ordinary-payment-ally", "ALLY", [], undefined, 2);
    const program = createGrandArchiveMatchProgram([
      reserveChampion,
      reservableGrant,
      ordinaryItem,
      ordinaryAlly,
      actionA,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: ordinaryAlly.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: reserveChampion.canonicalId, count: 1 },
        { definitionId: reservableGrant.canonicalId, count: 1 },
        { definitionId: ordinaryItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: reserveChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 81,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = initial.zones[p1].field[0]!;
    const grantId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === reservableGrant.canonicalId,
    )!.id;
    const grantedReservableId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === ordinaryItem.canonicalId,
    )!.id;
    const ordinaryId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === ordinaryAlly.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: grantId, from: "material-deck", to: "field" },
      {
        type: "object-moved",
        objectId: grantedReservableId,
        from: "material-deck",
        to: "field",
      },
      { type: "object-moved", objectId: ordinaryId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "reservableAbilityChampion-a1",
          reservePayment: [{ kind: "reservable", objectId: ordinaryId }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(runtime.state.objects[ordinaryId]?.states.has("rested")).toBe(false);

    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "reservableAbilityChampion-a1",
          reservePayment: [{ kind: "reservable", objectId: grantedReservableId }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[grantedReservableId]?.states.has("rested")).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);

    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "reservableAbilityChampion-a1",
          reservePayment: [{ kind: "reservable", objectId: grantedReservableId }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
  });

  it("locks selected modes and their targets as an ability enters the Effects Stack", () => {
    const modalChampion = card(
      "modal-champion",
      "CHAMPION",
      [
        {
          id: "modalChampion-a1",
          kind: "activated",
          activation: "ability",
          cost: { kind: "pay-reserve", amount: 1 },
          modes: {
            choose: { kind: "exactly", amount: 1 },
            declared: "announcement",
            modes: [
              {
                id: "draw-mode",
                text: "Draw a card.",
                effect: { kind: "draw", player: "controller", amount: 1 },
              },
              {
                id: "damage-mode",
                text: "Deal 2 damage to target opposing unit.",
                targets: [
                  {
                    id: "mode-target",
                    kind: "target",
                    declared: "announcement",
                    chooser: "controller",
                    count: { kind: "exactly", amount: 1 },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      player: "each-opponent",
                      filter: { kind: "type", oneOf: ["ALLY", "CHAMPION"] },
                    },
                  },
                ],
                effect: {
                  kind: "deal-damage",
                  source: { kind: "source" },
                  recipient: { kind: "bound", binding: "mode-target" },
                  amount: 2,
                },
              },
            ],
          },
          effect: { kind: "no-op" },
          text: "Reserve 1: Choose one — draw a card; or deal 2 damage to target opposing unit.",
        },
        {
          id: "modalChampion-a2",
          kind: "activated",
          activation: "ability",
          cost: { kind: "pay-reserve", amount: 0 },
          effect: {
            kind: "select-modes",
            choose: { kind: "exactly", amount: 1 },
            modes: [
              {
                id: "mark-a",
                text: "Mark A.",
                effect: {
                  kind: "add-counter",
                  subject: { kind: "source" },
                  counter: { named: "mark-a" },
                  amount: 1,
                },
              },
              {
                id: "mark-b",
                text: "Mark B.",
                effect: {
                  kind: "add-counter",
                  subject: { kind: "source" },
                  counter: { named: "mark-b" },
                  amount: 1,
                },
              },
            ],
          },
          text: "Choose one — Mark A; or Mark B.",
        },
      ],
      0,
      10,
    );
    const program = createGrandArchiveMatchProgram([modalChampion, actionA, actionB, regalia]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: actionA.canonicalId, count: 2 },
        { definitionId: actionB.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: modalChampion.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: modalChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 13,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = initial.zones[p1].field[0]!;
    const targetId = initial.zones[p2].field[0]!;
    const paymentId = initial.zones[p1]["main-deck"][0]!;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: paymentId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    const missingMode = runtime.execute(
      {
        move: "activate-ability",
        sourceId,
        abilityId: "modalChampion-a1",
        reservePayment: [{ kind: "card", cardId: paymentId }],
      },
      { playerId: p1 },
    );
    expect(missingMode.ok).toBe(false);
    expect(runtime.state.objects[paymentId]?.zone).toBe("hand");

    const missingTarget = runtime.execute(
      {
        move: "activate-ability",
        sourceId,
        abilityId: "modalChampion-a1",
        modeIds: ["damage-mode"],
        reservePayment: [{ kind: "card", cardId: paymentId }],
      },
      { playerId: p1 },
    );
    expect(missingTarget.ok).toBe(false);
    expect(runtime.state.objects[paymentId]?.zone).toBe("hand");

    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "modalChampion-a1",
          modeIds: ["damage-mode"],
          targets: { "mode-target": [targetId] },
          reservePayment: [{ kind: "card", cardId: paymentId }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.stack[0]?.selectedModeIds).toEqual(["damage-mode"]);
    expect(runtime.state.stack[0]?.targets[0]?.targetIds).toEqual([targetId]);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[targetId]?.damage).toBe(2);

    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "modalChampion-a2",
          modeIds: ["mark-b"],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[sourceId]?.counters["named:mark-b"]).toBe(1);
    expect(runtime.state.objects[sourceId]?.counters["named:mark-a"]).toBeUndefined();
  });

  it("activates and resolves a card into its rules-defined destination", () => {
    const drawAction = card("draw-action", "ACTION", [
      {
        id: "drawAction-a1",
        kind: "card-resolution",
        text: "Draw a card.",
        effect: { kind: "draw", player: "controller", amount: 1 },
      },
    ]);
    const program = createGrandArchiveMatchProgram([champion, drawAction, actionA, regalia]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: drawAction.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 5,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const drawActionId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === drawAction.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: drawActionId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute({ move: "activate-card", cardId: drawActionId }, { playerId: p1 }).ok,
    ).toBe(true);
    expect(runtime.state.objects[drawActionId]?.zone).toBe("effects-stack");
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[drawActionId]?.zone).toBe("graveyard");
    expect(runtime.state.zones[p1].hand).toHaveLength(1);
  });

  it("fingerprints executable behavior rather than card identity alone", () => {
    const drawOne = card("fingerprint-action", "ACTION", [
      {
        id: "fingerprintAction-a1",
        kind: "card-resolution",
        text: "Draw a card.",
        effect: { kind: "draw", player: "controller", amount: 1 },
      },
    ]);
    const drawTwo = card("fingerprint-action", "ACTION", [
      {
        id: "fingerprintAction-a1",
        kind: "card-resolution",
        text: "Draw two cards.",
        effect: { kind: "draw", player: "controller", amount: 2 },
      },
    ]);
    expect(createGrandArchiveMatchProgram([drawOne]).fingerprint).not.toBe(
      createGrandArchiveMatchProgram([drawTwo]).fingerprint,
    );
  });

  it("materializes a champion with random memory payment while preserving lineage object identity", () => {
    const levelZero = card("lineage-zero", "CHAMPION", [], 0, 10, { lineageName: "Test Lineage" });
    const levelOne = card("lineage-one", "CHAMPION", [], 1, 12, {
      lineageName: "Test Lineage",
      cost: { kind: "memory", amount: 1 },
    });
    const levelTwo = card("lineage-two", "CHAMPION", [], 2, 14, {
      lineageName: "Test Lineage",
      cost: { kind: "memory", amount: 2 },
    });
    const program = createGrandArchiveMatchProgram([
      levelZero,
      levelOne,
      levelTwo,
      actionA,
      regalia,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: actionA.canonicalId, count: 2 }],
      materialDeck: [
        { definitionId: levelZero.canonicalId, count: 1 },
        { definitionId: levelOne.canonicalId, count: 1 },
        { definitionId: levelTwo.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: levelZero.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 17,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const championId = initial.zones[p1].field[0]!;
    const levelOneId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === levelOne.canonicalId,
    )!.id;
    const levelTwoId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === levelTwo.canonicalId,
    )!.id;
    const memoryId = initial.zones[p1]["main-deck"][0]!;
    const withMemory = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: memoryId, from: "main-deck", to: "memory" },
    ]).state;
    const prepared = {
      ...withMemory,
      players: {
        ...withMemory.players,
        [p1]: { ...withMemory.players[p1]!, hasTakenFirstTurn: true },
      },
      turn: {
        ...withMemory.turn,
        phase: "materialize" as const,
        materializeChoicePending: true,
      },
      opportunity: null,
    };
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    const cursorBefore = runtime.state.random.cursor;
    expect(runtime.execute({ move: "materialize", cardId: levelOneId }, { playerId: p1 }).ok).toBe(
      true,
    );
    expect(runtime.state.zones[p1].banishment).toContain(memoryId);
    expect(runtime.state.random.cursor).toBeGreaterThanOrEqual(cursorBefore);

    const kernel = new GrandArchiveTransactionKernel();
    const lineageChanged = kernel.transact(runtime.state, [
      { type: "champion-leveled-up", championId, cardId: levelTwoId, actorId: p1 },
    ]).state;
    const fizzleEvents = collectGrandArchiveStateBasedEvents(program, lineageChanged);
    expect(fizzleEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "stack-item-fizzled",
          item: expect.objectContaining({ kind: "materialization", cardId: levelOneId }),
          reason: "champion-materialization-illegal",
        }),
      ]),
    );
    const fizzled = kernel.transact(lineageChanged, fizzleEvents).state;
    expect(fizzled.stack).toEqual([]);
    const orphanEvents = collectGrandArchiveStateBasedEvents(program, fizzled);
    expect(orphanEvents).toEqual([
      expect.objectContaining({
        type: "object-moved",
        objectId: levelOneId,
        from: "effects-stack",
        to: "banishment",
      }),
    ]);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[championId]?.activeDefinitionId).toBe(levelOne.canonicalId);
    expect(runtime.state.objects[levelOneId]?.zone).toBe("inner-lineage");
    expect(runtime.state.objects[levelOneId]?.hostId).toBe(championId);
    expect(runtime.state.zones[p1].field).toContain(championId);
  });

  it("collects printed triggered abilities from committed events and resolves them above the cause", () => {
    const triggerChampion = card(
      "trigger-champion",
      "CHAMPION",
      [
        {
          id: "triggerChampion-a1",
          kind: "activated",
          activation: "ability",
          cost: { kind: "pay-reserve", amount: 1 },
          effect: { kind: "draw", player: "controller", amount: 1 },
          text: "Reserve 1: Draw a card.",
        },
        {
          id: "triggerChampion-a2",
          kind: "triggered",
          trigger: {
            kind: "event",
            event: { name: "card-reserved", actor: "controller" },
          },
          effect: {
            kind: "add-counter",
            subject: { kind: "source" },
            counter: { named: "charge" },
            amount: 1,
          },
          text: "Whenever you reserve a card, put a charge counter on this.",
        },
        {
          id: "triggerChampion-a3",
          kind: "triggered",
          trigger: {
            kind: "event",
            event: { name: "card-reserved", actor: "controller" },
          },
          effect: {
            kind: "add-counter",
            subject: { kind: "source" },
            counter: { named: "echo" },
            amount: 1,
          },
          text: "Whenever you reserve a card, put an echo counter on this.",
        },
      ],
      0,
      10,
    );
    const program = createGrandArchiveMatchProgram([triggerChampion, actionA, actionB, regalia]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: actionA.canonicalId, count: 2 },
        { definitionId: actionB.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: triggerChampion.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: triggerChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 23,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = initial.zones[p1].field[0]!;
    const paymentId = initial.zones[p1]["main-deck"][0]!;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: paymentId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "triggerChampion-a1",
          reservePayment: [{ kind: "card", cardId: paymentId }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const ordering = runtime.state.decision;
    if (!ordering || ordering.kind !== "order-triggered-abilities") {
      throw new Error("Expected simultaneous trigger ordering decision");
    }
    const a2 = runtime.state.pendingTriggers.find(
      (trigger) => trigger.ability.id === "triggerChampion-a2",
    )!;
    const a3 = runtime.state.pendingTriggers.find(
      (trigger) => trigger.ability.id === "triggerChampion-a3",
    )!;
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: ordering.id,
          stateVersion: ordering.stateVersion,
          answer: [a3.id, a2.id],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.stack.map((item) => item.kind)).toEqual([
      "activated-ability",
      "triggered-ability",
      "triggered-ability",
    ]);
    expect(
      runtime.state.stack
        .slice(1)
        .map((item) => (item.kind === "triggered-ability" ? item.ability.id : "unexpected")),
    ).toEqual(["triggerChampion-a3", "triggerChampion-a2"]);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[sourceId]?.counters["named:charge"]).toBe(1);
    expect(runtime.state.stack).toHaveLength(2);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[sourceId]?.counters["named:echo"]).toBe(1);
    expect(runtime.state.stack).toHaveLength(1);
  });

  it("creates a one-shot delayed trigger that survives its source leaving the field", () => {
    const delayedItem = card("delayed-trigger-item", "ITEM", [
      {
        id: "delayed-trigger-item-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "create-delayed-trigger",
              trigger: {
                kind: "event",
                event: { name: "card-reserved", actor: "controller" },
              },
              limit: 1,
              effect: {
                kind: "add-counter",
                subject: { kind: "event-subject" },
                counter: { named: "remembered" },
                amount: 1,
              },
            },
            { kind: "destroy", subject: { kind: "source" } },
          ],
        },
        text: "Create a delayed trigger, then destroy this item.",
      },
    ]);
    const payableAction = card("delayed-trigger-action", "ACTION", [], undefined, undefined, {
      cost: { kind: "reserve", amount: 1 },
    });
    const program = createGrandArchiveMatchProgram([champion, delayedItem, payableAction, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: payableAction.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: delayedItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 37,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === delayedItem.canonicalId,
    )!.id;
    const actionId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === payableAction.canonicalId,
    )!.id;
    const paymentId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === actionA.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: paymentId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "delayed-trigger-item-a1",
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[sourceId]?.zone).toBe("graveyard");
    expect(runtime.state.delayedTriggers).toHaveLength(1);

    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: actionId,
          reservePayment: [{ kind: "card", cardId: paymentId }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.delayedTriggers).toHaveLength(0);
    expect(runtime.state.stack.map((item) => item.kind)).toEqual([
      "card-activation",
      "triggered-ability",
    ]);
    const delayedStackItem = runtime.state.stack[1];
    expect(delayedStackItem?.sourceId).toBe(sourceId);
    expect(delayedStackItem?.bindings.eventSubject).toEqual([paymentId]);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[paymentId]?.counters["named:remembered"]).toBe(1);
    expect(runtime.state.stack.map((item) => item.kind)).toEqual(["card-activation"]);
  });

  it("does not arm a next-turn delayed trigger early and expires it after that turn", () => {
    const program = createGrandArchiveMatchProgram(executableCards);
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [standardPlayer("p1"), standardPlayer("p2")],
      firstPlayerId: "p1",
      randomSeed: 41,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = initial.zones[p1].field[0]!;
    const firstCardId = initial.zones[p1]["main-deck"][0]!;
    const secondCardId = initial.zones[p1]["main-deck"][1]!;
    const kernel = new GrandArchiveTransactionKernel();
    const withHand = kernel.transact(initial, [
      { type: "object-moved", objectId: firstCardId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: secondCardId, from: "main-deck", to: "hand" },
    ]).state;
    const created = executeGrandArchiveEffect(
      {
        kind: "create-delayed-trigger",
        trigger: {
          kind: "event",
          event: { name: "card-reserved", actor: "controller" },
        },
        starts: { kind: "next-turn", whose: "controller" },
        expires: { kind: "until-end-of-turn", whose: "controller" },
        limit: 1,
        effect: { kind: "no-op" },
      },
      { program, state: withHand, controllerId: p1, sourceId, bindings: {} },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(created.state.delayedTriggers[0]?.notBeforeTurnNumber).toBe(3);

    const earlyReserve = kernel.transact(created.state, [
      {
        type: "object-moved",
        objectId: firstCardId,
        from: "hand",
        to: "memory",
        actorId: p1,
      },
    ]);
    expect(
      collectGrandArchiveTriggeredAbilityEvents(
        program,
        earlyReserve.state,
        earlyReserve.result.events,
      ),
    ).toEqual([]);

    const nextControllerTurn = kernel.transact(earlyReserve.state, [
      { type: "turn-started", playerId: p2, turnNumber: 2 },
      { type: "turn-started", playerId: p1, turnNumber: 3 },
    ]).state;
    const armedReserve = kernel.transact(nextControllerTurn, [
      {
        type: "object-moved",
        objectId: secondCardId,
        from: "hand",
        to: "memory",
        actorId: p1,
      },
    ]);
    expect(
      collectGrandArchiveTriggeredAbilityEvents(
        program,
        armedReserve.state,
        armedReserve.result.events,
      ).map((event) => event.type),
    ).toEqual(["delayed-trigger-removed", "pending-trigger-added"]);

    const afterWindow = kernel.transact(armedReserve.state, [
      { type: "turn-started", playerId: p2, turnNumber: 4 },
    ]).state;
    expect(collectGrandArchiveStateBasedEvents(program, afterWindow)).toEqual([
      expect.objectContaining({
        type: "delayed-trigger-removed",
        triggerId: created.state.delayedTriggers[0]!.id,
      }),
    ]);
  });

  it("keeps an unlimited permanent delayed trigger armed across occurrences", () => {
    const program = createGrandArchiveMatchProgram(executableCards);
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [standardPlayer("p1"), standardPlayer("p2")],
      firstPlayerId: "p1",
      randomSeed: 43,
    });
    const p1 = grandArchivePlayerId("p1");
    const sourceId = initial.zones[p1].field[0]!;
    const firstCardId = initial.zones[p1]["main-deck"][0]!;
    const secondCardId = initial.zones[p1]["main-deck"][1]!;
    const kernel = new GrandArchiveTransactionKernel();
    const withHand = kernel.transact(initial, [
      { type: "object-moved", objectId: firstCardId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: secondCardId, from: "main-deck", to: "hand" },
    ]).state;
    const created = executeGrandArchiveEffect(
      {
        kind: "create-delayed-trigger",
        trigger: {
          kind: "event",
          event: { name: "card-reserved", actor: "controller" },
        },
        expires: { kind: "permanent" },
        effect: { kind: "no-op" },
      },
      { program, state: withHand, controllerId: p1, sourceId, bindings: {} },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    let state = created.state;
    for (const cardId of [firstCardId, secondCardId]) {
      const reserved = kernel.transact(state, [
        {
          type: "object-moved",
          objectId: cardId,
          from: "hand",
          to: "memory",
          actorId: p1,
        },
      ]);
      const triggerEvents = collectGrandArchiveTriggeredAbilityEvents(
        program,
        reserved.state,
        reserved.result.events,
      );
      expect(triggerEvents.map((event) => event.type)).toEqual(["pending-trigger-added"]);
      state = reserved.state;
    }
    expect(state.delayedTriggers).toHaveLength(1);
    expect(state.delayedTriggers[0]?.remainingUses).toBeUndefined();
  });

  it("queues a successful reflexive trigger through suspension and announces it after resolution", () => {
    const reflexiveItem = card("reflexive-trigger-item", "ITEM", [
      {
        id: "reflexive-trigger-item-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        targets: [
          {
            id: "rest-target",
            kind: "target",
            declared: "announcement",
            chooser: "controller",
            count: { kind: "exactly", amount: 1 },
            unique: true,
            candidates: {
              kind: "object",
              zones: ["field"],
              player: "controller",
              filter: { kind: "type", oneOf: ["ALLY"] },
            },
          },
        ],
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "reflexive",
              action: { kind: "rest", subject: { kind: "bound", binding: "rest-target" } },
              targets: [
                {
                  id: "damage-target",
                  kind: "target",
                  declared: "announcement",
                  chooser: "controller",
                  count: { kind: "exactly", amount: 1 },
                  unique: true,
                  candidates: {
                    kind: "object",
                    zones: ["field"],
                    player: "each-opponent",
                    filter: { kind: "type", oneOf: ["CHAMPION"] },
                  },
                },
              ],
              consequence: {
                kind: "deal-damage",
                source: { kind: "source" },
                recipient: { kind: "bound", binding: "damage-target" },
                amount: 2,
              },
            },
            {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: { kind: "draw", player: "controller", amount: 1 },
            },
          ],
        },
        text: "Rest target ally. When you do, deal 2 damage to target opposing champion.",
      },
    ]);
    const reflexiveAlly = card("reflexive-trigger-ally", "ALLY", [], undefined, 3);
    const program = createGrandArchiveMatchProgram([
      champion,
      reflexiveItem,
      reflexiveAlly,
      actionA,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: reflexiveAlly.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: reflexiveItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 47,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === reflexiveItem.canonicalId,
    )!.id;
    const allyId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === reflexiveAlly.canonicalId,
    )!.id;
    const opposingChampionId = initial.zones[p2].field[0]!;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "reflexive-trigger-item-a1",
          targets: { "rest-target": [allyId] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[allyId]?.states.has("rested")).toBe(true);
    expect(runtime.state.generatedTriggers).toHaveLength(1);
    expect(runtime.state.pendingTriggers).toHaveLength(0);
    expect(runtime.state.stack).toHaveLength(1);
    const optionalDecision = runtime.state.decision;
    if (!optionalDecision || optionalDecision.kind !== "resolve-optional-effect") {
      throw new Error("Expected parent resolution to suspend after generating reflexive trigger");
    }
    const resumedRuntime = new GrandArchiveMatchRuntime(
      program,
      restoreGrandArchiveMatchSnapshot(
        program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
      ),
    );
    expect(resumedRuntime.state.generatedTriggers).toHaveLength(1);

    expect(
      resumedRuntime.execute(
        {
          move: "answer-decision",
          decisionId: optionalDecision.id,
          stateVersion: optionalDecision.stateVersion,
          answer: false,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(resumedRuntime.state.generatedTriggers).toHaveLength(0);
    const targetDecision = resumedRuntime.state.decision;
    if (!targetDecision || targetDecision.kind !== "announce-triggered-ability") {
      throw new Error("Expected reflexive-trigger target announcement after parent resolution");
    }
    expect(resumedRuntime.state.stack).toHaveLength(0);
    expect(resumedRuntime.state.pendingTriggers[0]?.sourceId).toBe(sourceId);

    expect(
      resumedRuntime.execute(
        {
          move: "answer-decision",
          decisionId: targetDecision.id,
          stateVersion: targetDecision.stateVersion,
          answer: { targets: { "damage-target": [opposingChampionId] } },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(resumedRuntime.state.stack[0]?.sourceId).toBe(sourceId);
    expect(resumedRuntime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(resumedRuntime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(resumedRuntime.state.objects[opposingChampionId]?.damage).toBe(2);
  });

  it("does not generate a reflexive trigger when its action cannot be performed", () => {
    const reflexiveItem = card("failed-reflexive-item", "ITEM", [
      {
        id: "failed-reflexive-item-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        effect: {
          kind: "reflexive",
          action: { kind: "rest", subject: { kind: "source" } },
          consequence: {
            kind: "add-counter",
            subject: { kind: "source" },
            counter: { named: "incorrect" },
            amount: 1,
          },
        },
        text: "Rest this item. When you do, put a counter on it.",
      },
    ]);
    const program = createGrandArchiveMatchProgram([champion, reflexiveItem, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: actionA.canonicalId, count: 4 }],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: reflexiveItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 53,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === reflexiveItem.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
      { type: "object-state-changed", objectId: sourceId, state: "rested", value: true },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "activate-ability", sourceId, abilityId: "failed-reflexive-item-a1" },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.generatedTriggers).toHaveLength(0);
    expect(runtime.state.pendingTriggers).toHaveLength(0);
    expect(runtime.state.stack).toHaveLength(0);
    expect(runtime.state.objects[sourceId]?.counters["named:incorrect"]).toBeUndefined();
  });

  it("generates one reflexive trigger for each object successfully affected", () => {
    const reflexiveItem = card("cardinal-reflexive-item", "ITEM", [
      {
        id: "cardinal-reflexive-item-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        effect: {
          kind: "reflexive",
          action: {
            kind: "banish-object",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: { kind: "type", oneOf: ["ALLY"] },
              },
            },
          },
          cardinality: "each-result-object",
          consequence: {
            kind: "add-counter",
            subject: { kind: "source" },
            counter: { named: "echo" },
            amount: 1,
          },
        },
        text: "Banish your allies. When you do, create one trigger for each.",
      },
    ]);
    const reflexiveAlly = card("cardinal-reflexive-ally", "ALLY", [], undefined, 2);
    const program = createGrandArchiveMatchProgram([
      champion,
      reflexiveItem,
      reflexiveAlly,
      actionA,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: reflexiveAlly.canonicalId, count: 2 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: reflexiveItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 59,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === reflexiveItem.canonicalId,
    )!.id;
    const allyIds = Object.values(initial.objects)
      .filter(
        (object) => object.ownerId === p1 && object.definitionId === reflexiveAlly.canonicalId,
      )
      .map((object) => object.id);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
      ...allyIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "field" as const,
      })),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "activate-ability", sourceId, abilityId: "cardinal-reflexive-item-a1" },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(allyIds.map((id) => runtime.state.objects[id]?.zone)).toEqual([
      "banishment",
      "banishment",
    ]);
    expect(runtime.state.generatedTriggers).toHaveLength(0);
    expect(runtime.state.pendingTriggers).toHaveLength(2);
    expect(runtime.state.decision?.kind).toBe("order-triggered-abilities");
    expect(
      runtime.state.pendingTriggers.map((trigger) => trigger.bindings.reflexiveResult),
    ).toEqual(allyIds.map((id) => [id]));
  });

  it("automatically reveals an ordered slice before preserving its real banish choice", () => {
    const selectionItem = card("selection-continuation-item", "ITEM", [
      {
        id: "selection-continuation-item-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "reveal",
              player: "controller",
              selection: {
                id: "revealed-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: { kind: "exactly", amount: 2 },
                candidates: {
                  kind: "card",
                  zones: ["main-deck"],
                  relationship: "zone-of",
                  player: "controller",
                  fromTop: true,
                },
              },
            },
            {
              kind: "banish",
              player: "controller",
              selection: {
                id: "banished-card",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: { kind: "exactly", amount: 1 },
                candidates: { kind: "card", binding: "revealed-cards" },
              },
              bindResultAs: "remembered-banishment",
            },
          ],
        },
        text: "Reveal the top two cards, then banish one of them.",
      },
    ]);
    const program = createGrandArchiveMatchProgram([champion, selectionItem, actionA, actionB]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: actionA.canonicalId, count: 2 },
        { definitionId: actionB.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: selectionItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 61,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === selectionItem.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    const topCards = runtime.state.zones[p1]["main-deck"].slice(0, 2);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "selection-continuation-item-a1",
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(
      runtime.state.eventHistory
        .filter((event) => event.type === "card-revealed")
        .map((event) => (event.type === "card-revealed" ? event.objectId : "unexpected")),
    ).toEqual(topCards);
    const banishDecision = runtime.state.decision;
    if (!banishDecision || banishDecision.kind !== "resolve-effect-choice") {
      throw new Error("Expected banish selection");
    }
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: banishDecision.id,
          stateVersion: banishDecision.stateVersion,
          answer: [topCards[0]],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[topCards[0]!]?.zone).toBe("banishment");
    expect(runtime.state.stack).toHaveLength(0);
    const suspendedResolutionEvents = runtime.state.eventHistory.filter(
      (event) => event.type === "effect-resolution-suspended",
    );
    expect(suspendedResolutionEvents).toHaveLength(1);
  });

  it("supports a selection-backed action inside a reflexive trigger", () => {
    const reflexiveItem = card("selection-reflexive-item", "ITEM", [
      {
        id: "selection-reflexive-item-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        effect: {
          kind: "reflexive",
          action: {
            kind: "banish",
            player: "controller",
            selection: {
              id: "banished-from-hand",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: { kind: "exactly", amount: 1 },
              candidates: {
                kind: "card",
                zones: ["hand"],
                relationship: "zone-of",
                player: "controller",
              },
            },
          },
          consequence: {
            kind: "add-counter",
            subject: { kind: "source" },
            counter: { named: "fulfilled" },
            amount: 1,
          },
        },
        text: "Banish a card from your hand. When you do, put a counter on this.",
      },
    ]);
    const program = createGrandArchiveMatchProgram([champion, reflexiveItem, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: actionA.canonicalId, count: 4 }],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: reflexiveItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 67,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === reflexiveItem.canonicalId,
    )!.id;
    const handCardId = initial.zones[p1]["main-deck"][0]!;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
      { type: "object-moved", objectId: handCardId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "activate-ability", sourceId, abilityId: "selection-reflexive-item-a1" },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.objects[handCardId]?.zone).toBe("banishment");
    expect(runtime.state.stack.map((item) => item.kind)).toEqual(["triggered-ability"]);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[sourceId]?.counters["named:fulfilled"]).toBe(1);
  });

  it("persists target selection while a triggered ability enters the Effects Stack", () => {
    const targetChampion = card(
      "target-trigger-champion",
      "CHAMPION",
      [
        {
          id: "targetTriggerChampion-a1",
          kind: "activated",
          activation: "ability",
          cost: { kind: "pay-reserve", amount: 1 },
          effect: { kind: "draw", player: "controller", amount: 1 },
          text: "Reserve 1: Draw a card.",
        },
        {
          id: "targetTriggerChampion-a2",
          kind: "triggered",
          trigger: {
            kind: "event",
            event: { name: "card-reserved", actor: "controller" },
          },
          modes: {
            choose: { kind: "exactly", amount: 1 },
            declared: "stack-entry",
            modes: [
              {
                id: "damage-mode",
                text: "Deal 2 damage to target opposing unit.",
                targets: [
                  {
                    id: "target",
                    kind: "target",
                    declared: "announcement",
                    chooser: "controller",
                    count: { kind: "exactly", amount: 1 },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      player: "each-opponent",
                      filter: { kind: "type", oneOf: ["ALLY", "CHAMPION"] },
                    },
                  },
                ],
                effect: {
                  kind: "deal-damage",
                  source: { kind: "source" },
                  recipient: { kind: "bound", binding: "target" },
                  amount: 2,
                },
              },
              {
                id: "charge-mode",
                text: "Put a charge counter on this.",
                effect: {
                  kind: "add-counter",
                  subject: { kind: "source" },
                  counter: { named: "charge" },
                  amount: 1,
                },
              },
            ],
          },
          effect: { kind: "no-op" },
          text: "Whenever you reserve a card, choose one — deal 2 damage to target opposing unit; or put a charge counter on this.",
        },
      ],
      0,
      10,
    );
    const opposingAlly = card("target-trigger-ally", "ALLY", [], undefined, 5);
    const program = createGrandArchiveMatchProgram([
      targetChampion,
      opposingAlly,
      actionA,
      actionB,
      regalia,
    ]);
    const player = (
      id: string,
      mainDeck: GrandArchiveStandardPlayerSetup["mainDeck"],
    ): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck,
      materialDeck: [
        { definitionId: targetChampion.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: targetChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [
        player("p1", [
          { definitionId: actionA.canonicalId, count: 2 },
          { definitionId: actionB.canonicalId, count: 2 },
        ]),
        player("p2", [
          { definitionId: opposingAlly.canonicalId, count: 1 },
          { definitionId: actionA.canonicalId, count: 3 },
        ]),
      ],
      firstPlayerId: "p1",
      randomSeed: 29,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = initial.zones[p1].field[0]!;
    const paymentId = initial.zones[p1]["main-deck"][0]!;
    const targetId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === opposingAlly.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: paymentId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: targetId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "targetTriggerChampion-a1",
          reservePayment: [{ kind: "card", cardId: paymentId }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "announce-triggered-ability") {
      throw new Error("Expected triggered-ability target declaration");
    }
    expect(runtime.state.pendingTriggers).toHaveLength(1);
    expect(runtime.state.stack.map((item) => item.kind)).toEqual(["activated-ability"]);

    const illegal = runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: { modeIds: ["damage-mode"], targets: { target: [sourceId] } },
      },
      { playerId: p1 },
    );
    expect(illegal.ok).toBe(false);
    expect(runtime.state.decision?.id).toBe(decision.id);

    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: { modeIds: ["damage-mode"], targets: { target: [targetId] } },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.pendingTriggers).toHaveLength(0);
    expect(runtime.state.stack.map((item) => item.kind)).toEqual([
      "activated-ability",
      "triggered-ability",
    ]);
    expect(runtime.state.stack[1]?.selectedModeIds).toEqual(["damage-mode"]);

    const targetRemoved = new GrandArchiveTransactionKernel().transact(runtime.state, [
      { type: "object-moved", objectId: targetId, from: "field", to: "graveyard" },
    ]).state;
    const fizzledRuntime = new GrandArchiveMatchRuntime(program, targetRemoved);
    expect(fizzledRuntime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(fizzledRuntime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(fizzledRuntime.state.stack.map((item) => item.kind)).toEqual(["activated-ability"]);
    expect(fizzledRuntime.state.objects[targetId]?.damage).toBe(0);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[targetId]?.damage).toBe(2);
    expect(runtime.state.stack.map((item) => item.kind)).toEqual(["activated-ability"]);
  });

  it("suspends and resumes optional effects without state-based checks between instructions", () => {
    const optionalChampion = card(
      "optional-resolution-champion",
      "CHAMPION",
      [
        {
          id: "optionalResolutionChampion-a1",
          kind: "activated",
          activation: "ability",
          cost: { kind: "pay-reserve", amount: 1 },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: { kind: "source" },
                recipient: { kind: "source" },
                amount: 10,
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "add-counter",
                  subject: { kind: "source" },
                  counter: { named: "accepted" },
                  amount: 1,
                },
                otherwise: {
                  kind: "add-counter",
                  subject: { kind: "source" },
                  counter: { named: "declined" },
                  amount: 1,
                },
              },
              { kind: "draw", player: "controller", amount: 1 },
            ],
          },
          text: "Reserve 1: Deal 10 damage to this. You may mark accepted; otherwise mark declined. Draw a card.",
        },
      ],
      0,
      10,
    );
    const program = createGrandArchiveMatchProgram([optionalChampion, actionA, actionB, regalia]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: actionA.canonicalId, count: 2 },
        { definitionId: actionB.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: optionalChampion.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: optionalChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 43,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = initial.zones[p1].field[0]!;
    const paymentId = initial.zones[p1]["main-deck"][0]!;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: paymentId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "optionalResolutionChampion-a1",
          reservePayment: [{ kind: "card", cardId: paymentId }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);

    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-optional-effect") {
      throw new Error("Expected optional-effect decision");
    }
    expect(runtime.state.resolution?.stackItemId).toBe(decision.stackItemId);
    expect(runtime.state.objects[sourceId]?.damage).toBe(10);
    expect(runtime.state.objects[sourceId]?.zone).toBe("field");
    expect(runtime.state.status).toBe("playing");

    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      serializeGrandArchiveMatchSnapshot(runtime.state),
    );
    const resumedRuntime = new GrandArchiveMatchRuntime(program, restored);
    const answered = resumedRuntime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: false,
      },
      { playerId: p1 },
    );
    expect(answered.ok).toBe(true);
    if (!answered.ok) throw new Error(answered.message);
    expect(resumedRuntime.state.decision).toBeNull();
    expect(resumedRuntime.state.resolution).toBeNull();
    expect(resumedRuntime.state.stack).toHaveLength(0);
    expect(
      answered.events.some(
        (event) =>
          event.type === "counter-changed" &&
          event.objectId === sourceId &&
          event.counter === "named:declined" &&
          event.delta === 1,
      ),
    ).toBe(true);
    expect(resumedRuntime.state.objects[sourceId]?.zone).toBe("banishment");
    expect(resumedRuntime.state.status).toBe("finished");
    expect(resumedRuntime.state.winnerIds).toEqual([p2]);
  });

  it("persists object choices made during effect resolution", () => {
    const choiceChampion = card(
      "choice-resolution-champion",
      "CHAMPION",
      [
        {
          id: "choiceResolutionChampion-a1",
          kind: "activated",
          activation: "ability",
          cost: { kind: "pay-reserve", amount: 1 },
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-unit",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: { kind: "exactly", amount: 1 },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                player: "each-opponent",
                filter: { kind: "type", oneOf: ["ALLY", "CHAMPION"] },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "add-counter",
                  subject: { kind: "bound", binding: "chosen-unit" },
                  counter: { named: "chosen" },
                  amount: 1,
                },
                {
                  kind: "choose",
                  selection: {
                    id: "chosen-amount",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: { kind: "exactly", amount: 1 },
                    candidates: { kind: "number", minimum: 1, maximum: 3 },
                  },
                  effect: {
                    kind: "add-counter",
                    subject: { kind: "bound", binding: "chosen-unit" },
                    counter: { named: "quantity" },
                    amount: { kind: "binding", binding: "chosen-amount" },
                  },
                },
                {
                  kind: "choose",
                  selection: {
                    id: "chosen-unbounded-amount",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: { kind: "exactly", amount: 1 },
                    candidates: { kind: "number", minimum: 0 },
                  },
                  effect: { kind: "no-op" },
                },
              ],
            },
          },
          text: "Reserve 1: Choose an opposing unit and put a chosen counter on it.",
        },
      ],
      0,
      10,
    );
    const choiceAlly = card("choice-resolution-ally", "ALLY", [], undefined, 5);
    const program = createGrandArchiveMatchProgram([
      choiceChampion,
      choiceAlly,
      actionA,
      actionB,
      regalia,
    ]);
    const player = (
      id: string,
      mainDeck: GrandArchiveStandardPlayerSetup["mainDeck"],
    ): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck,
      materialDeck: [
        { definitionId: choiceChampion.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: choiceChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [
        player("p1", [
          { definitionId: actionA.canonicalId, count: 2 },
          { definitionId: actionB.canonicalId, count: 2 },
        ]),
        player("p2", [
          { definitionId: choiceAlly.canonicalId, count: 1 },
          { definitionId: actionA.canonicalId, count: 3 },
        ]),
      ],
      firstPlayerId: "p1",
      randomSeed: 47,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = initial.zones[p1].field[0]!;
    const paymentId = initial.zones[p1]["main-deck"][0]!;
    const targetId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === choiceAlly.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: paymentId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: targetId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "choiceResolutionChampion-a1",
          reservePayment: [{ kind: "card", cardId: paymentId }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);

    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected resolution choice");
    }
    const illegal = runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: [sourceId],
      },
      { playerId: p1 },
    );
    expect(illegal.ok).toBe(false);
    expect(runtime.state.decision?.id).toBe(decision.id);

    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: [targetId],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const numberDecision = runtime.state.decision;
    if (!numberDecision || numberDecision.kind !== "resolve-effect-choice") {
      throw new Error("Expected numeric resolution choice");
    }
    expect(
      listGrandArchiveLegalCommands(program, runtime.state, p1).map((candidate) =>
        candidate.command.move === "answer-decision" ? candidate.command.answer : undefined,
      ),
    ).toEqual([1, 2, 3]);
    const invalidNumber = runtime.execute(
      {
        move: "answer-decision",
        decisionId: numberDecision.id,
        stateVersion: numberDecision.stateVersion,
        answer: 4,
      },
      { playerId: p1 },
    );
    expect(invalidNumber.ok).toBe(false);
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: numberDecision.id,
          stateVersion: numberDecision.stateVersion,
          answer: 2,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const unboundedDecision = runtime.state.decision;
    if (!unboundedDecision || unboundedDecision.kind !== "resolve-effect-choice") {
      throw new Error("Expected unbounded numeric resolution choice");
    }
    expect(
      listGrandArchiveLegalCommands(program, runtime.state, p1, {
        maximumChosenVariableValue: 4,
      }).map((candidate) =>
        candidate.command.move === "answer-decision" ? candidate.command.answer : undefined,
      ),
    ).toEqual([0, 1, 2, 3, 4]);
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: unboundedDecision.id,
          stateVersion: unboundedDecision.stateVersion,
          answer: 4,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.resolution).toBeNull();
    expect(runtime.state.stack).toHaveLength(0);
    expect(runtime.state.objects[targetId]?.counters["named:chosen"]).toBe(1);
    expect(runtime.state.objects[targetId]?.counters["named:quantity"]).toBe(2);
  });

  it("pauses for and resolves the uniqueness state-based choice", () => {
    const uniqueItem = card("unique-item", "ITEM", [], undefined, undefined, {
      supertypes: ["UNIQUE"],
    });
    const program = createGrandArchiveMatchProgram([champion, uniqueItem, actionA, regalia]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: uniqueItem.canonicalId, count: 2 },
        { definitionId: actionA.canonicalId, count: 1 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 31,
    });
    const p1 = grandArchivePlayerId("p1");
    const uniqueIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === uniqueItem.canonicalId)
      .map((object) => object.id);
    const prepared = new GrandArchiveTransactionKernel().transact(
      initial,
      uniqueIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "field" as const,
      })),
    ).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    const decision = runtime.state.decision;
    expect(decision?.kind).toBe("choose-unique-object");
    if (!decision || decision.kind !== "choose-unique-object")
      throw new Error("Expected uniqueness choice");
    const keep = decision.candidates[0]!;
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: keep,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.decision).toBeNull();
    expect(uniqueIds.filter((id) => runtime.state.objects[id]?.zone === "field")).toEqual([keep]);
    expect(uniqueIds.filter((id) => runtime.state.objects[id]?.zone === "graveyard")).toHaveLength(
      1,
    );
  });

  it("enforces Spellshroud and Omnishroud from targeting provenance at announcement", () => {
    const protectedAlly = (id: string, keyword: "spellshroud" | "omnishroud") =>
      card(
        id,
        "ALLY",
        [
          {
            id: `${id}-a1`,
            kind: "static",
            staticKind: "intrinsic",
            text: keyword,
            keyword: { name: keyword },
          },
        ],
        undefined,
        5,
      );
    const spellshroudAlly = protectedAlly("spellshroud-target", "spellshroud");
    const omnishroudAlly = protectedAlly("omnishroud-target", "omnishroud");
    const targetDeclaration = {
      id: "target-unit",
      kind: "target" as const,
      declared: "announcement" as const,
      chooser: "controller" as const,
      count: { kind: "exactly" as const, amount: 1 },
      unique: true as const,
      candidates: {
        kind: "object" as const,
        zones: ["field" as const],
        player: "each-opponent" as const,
        filter: { kind: "type" as const, oneOf: ["ALLY" as const] },
      },
    };
    const targetingChampion = card(
      "shroud-targeting-champion",
      "CHAMPION",
      [
        {
          id: "plainTargetingAbility-a1",
          kind: "activated",
          activation: "ability",
          cost: { kind: "pay-reserve", amount: 0 },
          targets: [targetDeclaration],
          effect: { kind: "no-op" },
          text: "Target ally.",
        },
        {
          id: "spellTargetingAbility-a2",
          kind: "activated",
          activation: "ability",
          cost: { kind: "pay-reserve", amount: 0 },
          targets: [targetDeclaration],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: { kind: "no-op" },
          },
          text: "As a Spell, target ally.",
        },
      ],
      0,
      10,
    );
    const spellAction = card(
      "shroud-targeting-spell",
      "ACTION",
      [
        {
          id: "shroudTargetingSpell-a1",
          kind: "card-resolution",
          targets: [targetDeclaration],
          effect: { kind: "no-op" },
          text: "Target ally.",
        },
      ],
      undefined,
      undefined,
      { subtypes: ["SPELL"] },
    );
    const program = createGrandArchiveMatchProgram([
      targetingChampion,
      spellshroudAlly,
      omnishroudAlly,
      spellAction,
      actionA,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: spellAction.canonicalId, count: 1 },
        { definitionId: spellshroudAlly.canonicalId, count: 1 },
        { definitionId: omnishroudAlly.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 1 },
      ],
      materialDeck: [{ definitionId: targetingChampion.canonicalId, count: 1 }],
      startingChampionDefinitionId: targetingChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 31,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = initial.zones[p1].field[0]!;
    const spellId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === spellAction.canonicalId,
    )!.id;
    const spellshroudId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === spellshroudAlly.canonicalId,
    )!.id;
    const omnishroudId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === omnishroudAlly.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: spellId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: spellshroudId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: omnishroudId, from: "main-deck", to: "field" },
    ]).state;

    const execute = (command: Parameters<GrandArchiveMatchRuntime["execute"]>[0]) =>
      new GrandArchiveMatchRuntime(program, prepared).execute(command, { playerId: p1 });
    expect(
      execute({
        move: "activate-card",
        cardId: spellId,
        targets: { "target-unit": [spellshroudId] },
      }).ok,
    ).toBe(false);
    expect(
      execute({
        move: "activate-ability",
        sourceId,
        abilityId: "plainTargetingAbility-a1",
        targets: { "target-unit": [spellshroudId] },
      }).ok,
    ).toBe(true);
    expect(
      execute({
        move: "activate-ability",
        sourceId,
        abilityId: "plainTargetingAbility-a1",
        targets: { "target-unit": [omnishroudId] },
      }).ok,
    ).toBe(false);
    expect(
      execute({
        move: "activate-ability",
        sourceId,
        abilityId: "spellTargetingAbility-a2",
        targets: { "target-unit": [spellshroudId] },
      }).ok,
    ).toBe(false);
  });

  it("fizzles a triggered Spell ability when Spellshroud leaves it no legal target", () => {
    const protectedAlly = card(
      "trigger-spellshroud-target",
      "ALLY",
      [
        {
          id: "triggerSpellshroudTarget-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Spellshroud",
          keyword: { name: "spellshroud" },
        },
      ],
      undefined,
      5,
    );
    const triggerChampion = card(
      "spell-trigger-champion",
      "CHAMPION",
      [
        {
          id: "spellTriggerChampion-a1",
          kind: "activated",
          activation: "ability",
          cost: { kind: "pay-reserve", amount: 1 },
          effect: { kind: "no-op" },
          text: "Reserve 1: Do nothing.",
        },
        {
          id: "spellTriggerChampion-a2",
          kind: "triggered",
          resolutionAs: "spell",
          trigger: {
            kind: "event",
            event: { name: "card-reserved", actor: "controller" },
          },
          targets: [
            {
              id: "target-unit",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: { kind: "exactly", amount: 1 },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                player: "each-opponent",
                filter: { kind: "type", oneOf: ["ALLY"] },
              },
            },
          ],
          effect: { kind: "no-op" },
          text: "As a Spell, target ally.",
        },
      ],
      0,
      10,
    );
    const program = createGrandArchiveMatchProgram([triggerChampion, protectedAlly, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: protectedAlly.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [{ definitionId: triggerChampion.canonicalId, count: 1 }],
      startingChampionDefinitionId: triggerChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 35,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = initial.zones[p1].field[0]!;
    const paymentId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === actionA.canonicalId,
    )!.id;
    const targetId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === protectedAlly.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: paymentId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: targetId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "spellTriggerChampion-a1",
          reservePayment: [{ kind: "card", cardId: paymentId }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.pendingTriggers).toHaveLength(0);
    expect(runtime.state.stack.map((item) => item.kind)).toEqual(["activated-ability"]);
  });

  it("rechecks newly gained Spellshroud and distinguishes required from optional targets", () => {
    const targetAlly = card("late-spellshroud-target", "ALLY", [], undefined, 5);
    const spell = (id: string, optional: boolean) =>
      card(
        id,
        "ACTION",
        [
          {
            id: `${id}-a1`,
            kind: "card-resolution",
            targets: [
              {
                id: "target-unit",
                kind: "target",
                declared: "announcement",
                chooser: "controller",
                count: optional ? { kind: "up-to", amount: 1 } : { kind: "exactly", amount: 1 },
                unique: true,
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  player: "each-opponent",
                  filter: { kind: "type", oneOf: ["ALLY"] },
                },
              },
            ],
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "deal-damage",
                  recipient: { kind: "bound", binding: "target-unit" },
                  amount: 2,
                },
                { kind: "draw", player: "controller", amount: 1 },
              ],
            },
            text: "Deal 2 damage to target ally. Draw a card.",
          },
        ],
        undefined,
        undefined,
        { subtypes: ["SPELL"] },
      );
    const requiredSpell = spell("required-shroud-spell", false);
    const optionalSpell = spell("optional-shroud-spell", true);

    const resolveAfterGrantingShroud = (
      selectedSpell: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
    ) => {
      const program = createGrandArchiveMatchProgram([
        champion,
        selectedSpell,
        targetAlly,
        actionA,
      ]);
      const player = (id: string): GrandArchiveStandardPlayerSetup => ({
        id,
        name: id,
        mainDeck: [
          { definitionId: selectedSpell.canonicalId, count: 1 },
          { definitionId: targetAlly.canonicalId, count: 1 },
          { definitionId: actionA.canonicalId, count: 2 },
        ],
        materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
        startingChampionDefinitionId: champion.canonicalId,
      });
      const initial = createGrandArchiveMatchInitialState(program, {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: optionalSpell.canonicalId === selectedSpell.canonicalId ? 33 : 32,
      });
      const p1 = grandArchivePlayerId("p1");
      const p2 = grandArchivePlayerId("p2");
      const cardId = Object.values(initial.objects).find(
        (object) => object.ownerId === p1 && object.definitionId === selectedSpell.canonicalId,
      )!.id;
      const targetId = Object.values(initial.objects).find(
        (object) => object.ownerId === p2 && object.definitionId === targetAlly.canonicalId,
      )!.id;
      const prepared = new GrandArchiveTransactionKernel().transact(initial, [
        { type: "object-moved", objectId: cardId, from: "main-deck", to: "hand" },
        { type: "object-moved", objectId: targetId, from: "main-deck", to: "field" },
      ]).state;
      const runtime = new GrandArchiveMatchRuntime(program, prepared);
      expect(
        runtime.execute(
          {
            move: "activate-card",
            cardId,
            targets: { "target-unit": [targetId] },
          },
          { playerId: p1 },
        ).ok,
      ).toBe(true);
      const protectedState = new GrandArchiveTransactionKernel().transact(runtime.state, [
        {
          type: "continuous-effect-created",
          effect: {
            id: `continuous-${runtime.state.nextContinuousOrdinal}`,
            controllerId: p2,
            effect: {
              kind: "continuous",
              subjects: { kind: "source" },
              affectedSet: "locked",
              duration: { kind: "permanent" },
              layer: { layer: "D", modifies: "ability" },
              change: { kind: "grant-keyword", keyword: { name: "spellshroud" } },
            },
            affectedObjectIds: [targetId],
            affectedObjectIncarnations: {
              [targetId]: runtime.state.objects[targetId]!.incarnation,
            },
            bindings: {},
            variables: {},
            durationAnchors: {},
            createdAtVersion: runtime.state.stateVersion,
            createdTurnNumber: runtime.state.turn.number,
            createdPhase: runtime.state.turn.phase,
          },
        },
      ]).state;
      const resolving = new GrandArchiveMatchRuntime(program, protectedState);
      const handBefore = resolving.state.zones[p1].hand.length;
      expect(resolving.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
      expect(resolving.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
      return {
        damage: resolving.state.objects[targetId]?.damage,
        cardsDrawn: resolving.state.zones[p1].hand.length - handBefore,
      };
    };

    expect(resolveAfterGrantingShroud(requiredSpell)).toEqual({ damage: 0, cardsDrawn: 0 });
    expect(resolveAfterGrantingShroud(optionalSpell)).toEqual({ damage: 0, cardsDrawn: 1 });
  });

  it("allows a Spell resolution to choose, rather than target, a Spellshroud object", () => {
    const protectedAlly = card(
      "spell-choice-protected-ally",
      "ALLY",
      [
        {
          id: "spellChoiceProtectedAlly-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Spellshroud",
          keyword: { name: "spellshroud" },
        },
      ],
      undefined,
      5,
    );
    const choiceSpell = card(
      "spellshroud-choice-spell",
      "ACTION",
      [
        {
          id: "spellshroudChoiceSpell-a1",
          kind: "card-resolution",
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-unit",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: { kind: "exactly", amount: 1 },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                player: "each-opponent",
                filter: { kind: "type", oneOf: ["ALLY"] },
              },
            },
            effect: {
              kind: "add-counter",
              subject: { kind: "bound", binding: "chosen-unit" },
              counter: { named: "chosen" },
              amount: 1,
            },
          },
          text: "Choose an ally and put a chosen counter on it.",
        },
      ],
      undefined,
      undefined,
      { subtypes: ["SPELL"] },
    );
    const program = createGrandArchiveMatchProgram([champion, protectedAlly, choiceSpell, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: choiceSpell.canonicalId, count: 1 },
        { definitionId: protectedAlly.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 34,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const cardId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === choiceSpell.canonicalId,
    )!.id;
    const targetId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === protectedAlly.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: cardId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: targetId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(runtime.execute({ move: "activate-card", cardId }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected resolution-time object choice");
    }
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: [targetId],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[targetId]?.counters["named:chosen"]).toBe(1);
  });

  it("enforces Immortality for lethal damage and sacrifice except the Unique state-based rule", () => {
    const immortalAlly = card(
      "unique-immortal-ally",
      "ALLY",
      [
        {
          id: "uniqueImmortalAlly-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Immortality",
          keyword: { name: "immortality" },
        },
      ],
      undefined,
      1,
      { supertypes: ["UNIQUE"] },
    );
    const sacrificeChampion = card(
      "immortality-cost-champion",
      "CHAMPION",
      [
        {
          id: "immortalityCostChampion-a1",
          kind: "activated",
          activation: "ability",
          cost: {
            kind: "select-and-sacrifice",
            player: "controller",
            count: { kind: "exactly", amount: 1 },
            filter: { kind: "type", oneOf: ["ALLY"] },
          },
          effect: { kind: "no-op" },
          text: "Sacrifice an ally: Do nothing.",
        },
      ],
      0,
      10,
    );
    const program = createGrandArchiveMatchProgram([sacrificeChampion, immortalAlly, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: immortalAlly.canonicalId, count: 2 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [{ definitionId: sacrificeChampion.canonicalId, count: 1 }],
      startingChampionDefinitionId: sacrificeChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 39,
    });
    const p1 = grandArchivePlayerId("p1");
    const sourceId = initial.zones[p1].field[0]!;
    const immortalIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === immortalAlly.canonicalId)
      .map((object) => object.id);
    const singleImmortal = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: immortalIds[0]!, from: "main-deck", to: "field" },
      { type: "damage-marked", objectId: immortalIds[0]!, amount: 1 },
    ]).state;
    expect(collectGrandArchiveStateBasedEvents(program, singleImmortal)).toEqual([]);
    const replacementKernel = new GrandArchiveTransactionKernel({
      collectReplacements: (state, event) =>
        collectGrandArchiveReplacementCandidates(program, state, event),
      chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
    });
    const prohibitedMove = replacementKernel.transact(singleImmortal, [
      {
        type: "object-moved",
        objectId: immortalIds[0]!,
        from: "field",
        to: "graveyard",
      },
    ]).state;
    expect(prohibitedMove.objects[immortalIds[0]!]?.zone).toBe("field");
    const runtime = new GrandArchiveMatchRuntime(program, singleImmortal);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "immortalityCostChampion-a1",
          costSelections: [[immortalIds[0]!]],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);

    const duplicated = new GrandArchiveTransactionKernel().transact(singleImmortal, [
      { type: "object-moved", objectId: immortalIds[1]!, from: "main-deck", to: "field" },
    ]).state;
    const uniqueRuntime = new GrandArchiveMatchRuntime(program, duplicated);
    const uniqueProgress = uniqueRuntime.execute({ move: "pass" }, { playerId: p1 });
    expect(uniqueProgress.ok).toBe(true);
    const decision = uniqueRuntime.state.decision;
    if (!decision || decision.kind !== "choose-unique-object") {
      throw new Error("Expected Unique state-based decision");
    }
    expect(
      uniqueRuntime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: immortalIds[0]!,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(uniqueRuntime.state.objects[immortalIds[1]!]?.zone).toBe("graveyard");
  });

  it("replaces Renewable banishment from field or intent but not from loaded cards", () => {
    const program = createGrandArchiveMatchProgram([champion, steelSlug, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: actionA.canonicalId, count: 2 }],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: steelSlug.canonicalId, count: 3 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 40,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const hostId = initial.zones[p1].field[0]!;
    const cardIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === steelSlug.canonicalId)
      .map((object) => object.id);
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: cardIds[0]!,
        from: "material-deck",
        to: "field",
        newControllerId: p2,
      },
      {
        type: "object-moved",
        objectId: cardIds[1]!,
        from: "material-deck",
        to: "intent",
        hostId,
      },
      {
        type: "object-moved",
        objectId: cardIds[2]!,
        from: "material-deck",
        to: "loaded",
        hostId,
      },
    ]).state;
    const kernel = new GrandArchiveTransactionKernel({
      collectReplacements: (state, event) =>
        collectGrandArchiveReplacementCandidates(program, state, event),
      chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
    });
    const result = kernel.transact(positioned, [
      { type: "object-moved", objectId: cardIds[0]!, from: "field", to: "banishment" },
      { type: "object-moved", objectId: cardIds[1]!, from: "intent", to: "banishment" },
      { type: "object-moved", objectId: cardIds[2]!, from: "loaded", to: "banishment" },
    ]).state;
    expect(result.objects[cardIds[0]!]?.zone).toBe("material-deck");
    expect(result.zones[p1]["material-deck"]).toContain(cardIds[0]!);
    expect(result.zones[p2]["material-deck"]).not.toContain(cardIds[0]!);
    expect(result.objects[cardIds[1]!]?.zone).toBe("material-deck");
    expect(result.objects[cardIds[2]!]?.zone).toBe("banishment");
  });

  it("runs attack declaration, retaliation, simultaneous damage, and combat cleanup", () => {
    const attackerCard = card("combat-attacker", "ALLY", [], undefined, 5, { power: 3 });
    const defenderCard = card("combat-defender", "ALLY", [], undefined, 5, { power: 2 });
    const program = createGrandArchiveMatchProgram([
      champion,
      attackerCard,
      defenderCard,
      actionA,
      regalia,
    ]);
    const player = (
      id: string,
      ally: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
    ): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: ally.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1", attackerCard), player("p2", defenderCard)],
      firstPlayerId: "p1",
      randomSeed: 37,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attackerId = Object.values(initial.objects).find(
      (object) => object.definitionId === attackerCard.canonicalId,
    )!.id;
    const defenderId = Object.values(initial.objects).find(
      (object) => object.definitionId === defenderCard.canonicalId,
    )!.id;
    const onField = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: attackerId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: defenderId, from: "main-deck", to: "field" },
    ]).state;
    const prepared = {
      ...onField,
      players: {
        ...onField.players,
        [p1]: { ...onField.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        {
          move: "declare-attack",
          attackerId,
          targetIds: [defenderId],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.turn.phase).toBe("combat");
    expect(runtime.state.objects[attackerId]?.states.has("attacking")).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const retaliation = runtime.state.decision;
    if (!retaliation || retaliation.kind !== "choose-retaliators") {
      throw new Error("Expected retaliation decision");
    }
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: retaliation.id,
          stateVersion: retaliation.stateVersion,
          answer: [defenderId],
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.combat?.step).toBe("damage");
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.combat).toBeNull();
    expect(runtime.state.turn.phase).toBe("main");
    expect(runtime.state.objects[attackerId]?.damage).toBe(2);
    expect(runtime.state.objects[defenderId]?.damage).toBe(3);
    expect(runtime.state.objects[attackerId]?.states.has("attacking")).toBe(false);
    expect(runtime.state.objects[defenderId]?.states.has("retaliating")).toBe(false);
    expect(runtime.state.objects[attackerId]?.states.has("rested")).toBe(true);
    expect(runtime.state.opportunity?.holderId).toBe(p1);
  });

  it("lets a rested Steadfast ally retaliate without resting and stacks its Retort bonuses", () => {
    const attackerCard = card("steadfast-test-attacker", "ALLY", [], undefined, 10, { power: 4 });
    const steadfastRetaliator = card(
      "steadfast-retort-defender",
      "ALLY",
      [
        {
          id: "steadfastRetortDefender-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Steadfast",
          keyword: { name: "steadfast" },
        },
        {
          id: "steadfastRetortDefender-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Retort 1",
          keyword: { name: "retort", value: 1 },
        },
        {
          id: "steadfastRetortDefender-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "Retort 2",
          keyword: { name: "retort", value: 2 },
        },
      ],
      undefined,
      10,
      { power: 2 },
    );
    const program = createGrandArchiveMatchProgram([
      champion,
      attackerCard,
      steadfastRetaliator,
      actionA,
    ]);
    const player = (
      id: string,
      ally: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
    ): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: ally.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1", attackerCard), player("p2", steadfastRetaliator)],
      firstPlayerId: "p1",
      randomSeed: 38,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attackerId = Object.values(initial.objects).find(
      (object) => object.definitionId === attackerCard.canonicalId,
    )!.id;
    const defenderId = Object.values(initial.objects).find(
      (object) => object.definitionId === steadfastRetaliator.canonicalId,
    )!.id;
    const onField = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: attackerId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: defenderId, from: "main-deck", to: "field" },
      { type: "object-state-changed", objectId: defenderId, state: "rested", value: true },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, {
      ...onField,
      players: {
        ...onField.players,
        [p1]: { ...onField.players[p1]!, hasTakenFirstTurn: true },
      },
    });

    expect(
      runtime.execute(
        { move: "declare-attack", attackerId, targetIds: [defenderId] },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const retaliation = runtime.state.decision;
    if (!retaliation || retaliation.kind !== "choose-retaliators") {
      throw new Error("Expected Steadfast retaliation decision");
    }
    expect(retaliation.candidates).toContain(defenderId);
    const declaration = runtime.execute(
      {
        move: "answer-decision",
        decisionId: retaliation.id,
        stateVersion: retaliation.stateVersion,
        answer: [defenderId],
      },
      { playerId: p2 },
    );
    expect(declaration.ok).toBe(true);
    expect(
      declaration.ok &&
        declaration.events.some(
          (event) => event.cause?.kind === "rule" && event.cause.rule === "retaliation-cost",
        ),
    ).toBe(false);
    expect(runtime.state.objects[defenderId]?.states.has("rested")).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[attackerId]?.damage).toBe(5);
    expect(runtime.state.objects[defenderId]?.damage).toBe(4);
  });

  it("applies a mandatory static replacement before combat damage commits", () => {
    const wardedChampion = card(
      "warded-champion",
      "CHAMPION",
      [
        {
          id: "wardedChampion-a1",
          kind: "static",
          staticKind: "effects",
          text: "If damage would be dealt to your champion, prevent 1 of that damage.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: { kind: "event-object", controller: "controller" },
              },
              operation: { kind: "modify-amount", operation: "subtract", amount: 1 },
              duration: { kind: "while-source-on-field" },
            },
          ],
        },
      ],
      0,
      10,
    );
    const attackerCard = card("replacement-attacker", "ALLY", [], undefined, 5, { power: 3 });
    const program = createGrandArchiveMatchProgram([
      champion,
      wardedChampion,
      attackerCard,
      actionA,
      regalia,
    ]);
    const player = (
      id: string,
      startingChampion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
      includeAttacker: boolean,
    ): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: includeAttacker
        ? [
            { definitionId: attackerCard.canonicalId, count: 1 },
            { definitionId: actionA.canonicalId, count: 1 },
          ]
        : [{ definitionId: actionA.canonicalId, count: 2 }],
      materialDeck: [
        { definitionId: startingChampion.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: startingChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1", champion, true), player("p2", wardedChampion, false)],
      firstPlayerId: "p1",
      randomSeed: 41,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attackerId = Object.values(initial.objects).find(
      (object) => object.definitionId === attackerCard.canonicalId,
    )!.id;
    const defenderId = initial.zones[p2].field[0]!;
    const onField = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: attackerId, from: "main-deck", to: "field" },
    ]).state;
    const prepared = {
      ...onField,
      players: {
        ...onField.players,
        [p1]: { ...onField.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "declare-attack", attackerId, targetIds: [defenderId] },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.combat?.step).toBe("damage");
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[defenderId]?.damage).toBe(2);
    const committedDamage = [...runtime.state.eventHistory]
      .reverse()
      .find((event) => event.type === "damage-marked" && event.objectId === defenderId);
    expect(committedDamage?.type === "damage-marked" ? committedDamage.amount : undefined).toBe(2);
  });

  it("lets the affected player order and decline replacement effects, including after restore", () => {
    const orderedChampion = card(
      "ordered-replacement-champion",
      "CHAMPION",
      [
        {
          id: "orderedReplacementChampion-a1",
          kind: "static",
          staticKind: "effects",
          text: "If damage would be dealt to your champion, prevent 1, then double it.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: { kind: "event-object", controller: "controller" },
              },
              operation: { kind: "modify-amount", operation: "subtract", amount: 1 },
              duration: { kind: "while-source-on-field" },
            },
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: { kind: "event-object", controller: "controller" },
              },
              operation: { kind: "modify-amount", operation: "multiply", amount: 2 },
              duration: { kind: "while-source-on-field" },
            },
          ],
        },
      ],
      0,
      10,
    );
    const optionalChampion = card(
      "optional-replacement-champion",
      "CHAMPION",
      [
        {
          id: "optionalReplacementChampion-a1",
          kind: "static",
          staticKind: "effects",
          text: "If damage would be dealt to your champion, you may prevent 2 of it.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: { kind: "event-object", controller: "controller" },
              },
              optionalFor: "controller",
              operation: { kind: "modify-amount", operation: "subtract", amount: 2 },
              duration: { kind: "while-source-on-field" },
            },
          ],
        },
      ],
      0,
      10,
    );
    const attackerCard = card("replacement-order-attacker", "ALLY", [], undefined, 5, {
      power: 3,
    });
    const setup = (defendingChampion: typeof orderedChampion) => {
      const program = createGrandArchiveMatchProgram([
        champion,
        defendingChampion,
        attackerCard,
        actionA,
      ]);
      const player = (
        id: string,
        startingChampion: typeof champion,
        includeAttacker: boolean,
      ): GrandArchiveStandardPlayerSetup => ({
        id,
        name: id,
        mainDeck: includeAttacker
          ? [
              { definitionId: attackerCard.canonicalId, count: 1 },
              { definitionId: actionA.canonicalId, count: 1 },
            ]
          : [{ definitionId: actionA.canonicalId, count: 2 }],
        materialDeck: [{ definitionId: startingChampion.canonicalId, count: 1 }],
        startingChampionDefinitionId: startingChampion.canonicalId,
      });
      const initial = createGrandArchiveMatchInitialState(program, {
        mode: "standard",
        players: [player("p1", champion, true), player("p2", defendingChampion, false)],
        firstPlayerId: "p1",
        randomSeed: 42,
      });
      const p1 = grandArchivePlayerId("p1");
      const p2 = grandArchivePlayerId("p2");
      const attackerId = Object.values(initial.objects).find(
        (object) => object.definitionId === attackerCard.canonicalId,
      )!.id;
      const defenderId = initial.zones[p2].field[0]!;
      const onField = new GrandArchiveTransactionKernel().transact(initial, [
        { type: "object-moved", objectId: attackerId, from: "main-deck", to: "field" },
      ]).state;
      const prepared = {
        ...onField,
        players: {
          ...onField.players,
          [p1]: { ...onField.players[p1]!, hasTakenFirstTurn: true },
        },
      };
      const reachReplacement = (runtime: GrandArchiveMatchRuntime) => {
        expect(
          runtime.execute(
            { move: "declare-attack", attackerId, targetIds: [defenderId] },
            { playerId: p1 },
          ).ok,
        ).toBe(true);
        for (const playerId of [p1, p2, p1, p2]) {
          expect(runtime.execute({ move: "pass" }, { playerId }).ok).toBe(true);
        }
        const decision = runtime.state.decision;
        if (!decision || decision.kind !== "choose-replacement") {
          throw new Error("Expected a replacement decision");
        }
        return decision;
      };
      return { program, prepared, p1, p2, defenderId, reachReplacement };
    };

    const ordered = setup(orderedChampion);
    const subtractFirstRuntime = new GrandArchiveMatchRuntime(ordered.program, ordered.prepared);
    const subtractFirst = ordered.reachReplacement(subtractFirstRuntime);
    expect(subtractFirst.mode).toBe("order");
    expect(subtractFirst.playerId).toBe(ordered.p2);
    expect(subtractFirst.candidateIds).toHaveLength(2);
    expect(
      projectGrandArchiveViewerState(ordered.program, subtractFirstRuntime.state, ordered.p2)
        .decision,
    ).not.toHaveProperty("continuation");
    const restored = restoreGrandArchiveMatchSnapshot(
      ordered.program,
      serializeGrandArchiveMatchSnapshot(subtractFirstRuntime.state),
    );
    const restoredRuntime = new GrandArchiveMatchRuntime(ordered.program, restored);
    expect(
      restoredRuntime.execute(
        {
          move: "answer-decision",
          decisionId: subtractFirst.id,
          stateVersion: subtractFirst.stateVersion,
          answer: subtractFirst.candidateIds[0],
        },
        { playerId: ordered.p2 },
      ).ok,
    ).toBe(true);
    expect(restoredRuntime.state.objects[ordered.defenderId]?.damage).toBe(4);
    expect(restoredRuntime.state.combat).toBeNull();

    const multiplyFirstRuntime = new GrandArchiveMatchRuntime(ordered.program, ordered.prepared);
    const multiplyFirst = ordered.reachReplacement(multiplyFirstRuntime);
    expect(
      multiplyFirstRuntime.execute(
        {
          move: "answer-decision",
          decisionId: multiplyFirst.id,
          stateVersion: multiplyFirst.stateVersion,
          answer: multiplyFirst.candidateIds[1],
        },
        { playerId: ordered.p2 },
      ).ok,
    ).toBe(true);
    expect(multiplyFirstRuntime.state.objects[ordered.defenderId]?.damage).toBe(5);

    const optional = setup(optionalChampion);
    const declinedRuntime = new GrandArchiveMatchRuntime(optional.program, optional.prepared);
    const declined = optional.reachReplacement(declinedRuntime);
    expect(declined.mode).toBe("optional");
    expect(
      declinedRuntime.execute(
        {
          move: "answer-decision",
          decisionId: declined.id,
          stateVersion: declined.stateVersion,
          answer: false,
        },
        { playerId: optional.p2 },
      ).ok,
    ).toBe(true);
    expect(declinedRuntime.state.objects[optional.defenderId]?.damage).toBe(3);

    const acceptedRuntime = new GrandArchiveMatchRuntime(optional.program, optional.prepared);
    const accepted = optional.reachReplacement(acceptedRuntime);
    expect(
      acceptedRuntime.execute(
        {
          move: "answer-decision",
          decisionId: accepted.id,
          stateVersion: accepted.stateVersion,
          answer: true,
        },
        { playerId: optional.p2 },
      ).ok,
    ).toBe(true);
    expect(acceptedRuntime.state.objects[optional.defenderId]?.damage).toBe(1);
  });

  it("resumes the remaining card effect after a replacement decision", () => {
    const guardedChampion = card(
      "resolution-replacement-champion",
      "CHAMPION",
      [
        {
          id: "resolutionReplacementChampion-a1",
          kind: "static",
          staticKind: "effects",
          text: "If damage would be dealt to your champion, you may prevent 2 of it.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: { kind: "event-object", controller: "controller" },
              },
              optionalFor: "controller",
              operation: { kind: "modify-amount", operation: "subtract", amount: 2 },
              duration: { kind: "while-source-on-field" },
            },
          ],
        },
      ],
      0,
      10,
    );
    const damageItem = card("resolution-replacement-item", "ITEM", [
      {
        id: "resolutionReplacementItem-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        text: "Deal 3 damage to target unit, then put a resolved counter on this item.",
        targets: [
          {
            id: "damage-target",
            kind: "target",
            declared: "announcement",
            chooser: "controller",
            count: { kind: "exactly", amount: 1 },
            candidates: { kind: "object", zones: ["field"] },
          },
        ],
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "deal-damage",
              recipient: { kind: "bound", binding: "damage-target" },
              amount: 3,
            },
            {
              kind: "add-counter",
              subject: { kind: "source" },
              counter: { named: "resolved" },
              amount: 1,
            },
          ],
        },
      },
    ]);
    const program = createGrandArchiveMatchProgram([
      champion,
      guardedChampion,
      damageItem,
      actionA,
    ]);
    const player = (
      id: string,
      startingChampion: typeof champion,
      includeItem: boolean,
    ): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: actionA.canonicalId, count: 2 }],
      materialDeck: [
        { definitionId: startingChampion.canonicalId, count: 1 },
        ...(includeItem ? [{ definitionId: damageItem.canonicalId, count: 1 }] : []),
      ],
      startingChampionDefinitionId: startingChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1", champion, true), player("p2", guardedChampion, false)],
      firstPlayerId: "p1",
      randomSeed: 43,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const itemId = Object.values(initial.objects).find(
      (object) => object.definitionId === damageItem.canonicalId,
    )!.id;
    const defenderId = initial.zones[p2].field[0]!;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: itemId, from: "material-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId: itemId,
          abilityId: "resolutionReplacementItem-a1",
          targets: { "damage-target": [defenderId] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "choose-replacement") {
      throw new Error("Expected optional damage replacement during resolution");
    }
    expect(runtime.state.resolution).not.toBeNull();
    expect(runtime.state.objects[itemId]?.counters["named:resolved"]).toBeUndefined();
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
    expect(runtime.state.objects[defenderId]?.damage).toBe(1);
    expect(runtime.state.objects[itemId]?.counters["named:resolved"]).toBe(1);
    expect(runtime.state.resolution).toBeNull();
    expect(runtime.state.stack).toHaveLength(0);
  });

  it("announces, rechecks, and breaks Link relationships", () => {
    const linkedItem = card(
      "linked-test-item",
      "ITEM",
      [
        {
          id: "linkedTestItem-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link",
          keyword: { name: "link", target: "ally" },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 0 } },
    );
    const linkAlly = card("link-test-ally", "ALLY", [], undefined, 5, { power: 1 });
    const program = createGrandArchiveMatchProgram([champion, linkedItem, linkAlly, actionA]);
    const player = (id: string, includeCards: boolean): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: includeCards
        ? [
            { definitionId: linkedItem.canonicalId, count: 1 },
            { definitionId: linkAlly.canonicalId, count: 1 },
          ]
        : [{ definitionId: actionA.canonicalId, count: 2 }],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1", true), player("p2", false)],
      firstPlayerId: "p1",
      randomSeed: 44,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const itemId = Object.values(initial.objects).find(
      (object) => object.definitionId === linkedItem.canonicalId,
    )!.id;
    const allyId = Object.values(initial.objects).find(
      (object) => object.definitionId === linkAlly.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: itemId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
    ]).state;

    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    const missingTarget = runtime.execute(
      { move: "activate-card", cardId: itemId },
      { playerId: p1 },
    );
    expect(missingTarget.ok).toBe(false);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: itemId,
          targets: { "intrinsic-link-target": [allyId] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[itemId]?.zone).toBe("field");
    expect(runtime.state.objects[itemId]?.hostId).toBe(allyId);

    const hostGone = new GrandArchiveTransactionKernel().transact(runtime.state, [
      {
        type: "object-moved",
        objectId: allyId,
        from: "field",
        to: "banishment",
        cause: { kind: "rule", rule: "test-host-left-field" },
      },
    ]).state;
    const brokenLinkEvents = collectGrandArchiveStateBasedEvents(program, hostGone);
    expect(brokenLinkEvents).toContainEqual(
      expect.objectContaining({
        type: "object-moved",
        objectId: itemId,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "broken-link-sacrifice" },
      }),
    );

    const typeChanged = executeGrandArchiveEffect(
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "linked-ally" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "B", modifies: "type" },
        change: { kind: "set-types", types: ["ITEM"] },
      },
      {
        program,
        state: runtime.state,
        controllerId: p1,
        sourceId: itemId,
        bindings: { "linked-ally": [allyId] },
      },
      (state, events) => {
        const transaction = new GrandArchiveTransactionKernel().transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;
    expect(collectGrandArchiveStateBasedEvents(program, typeChanged)).toContainEqual(
      expect.objectContaining({
        type: "object-moved",
        objectId: itemId,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "broken-link-sacrifice" },
      }),
    );

    const invalidatedRuntime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      invalidatedRuntime.execute(
        {
          move: "activate-card",
          cardId: itemId,
          targets: { "intrinsic-link-target": [allyId] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const targetRemoved = new GrandArchiveTransactionKernel().transact(invalidatedRuntime.state, [
      {
        type: "object-moved",
        objectId: allyId,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "test-link-target-removed" },
      },
    ]).state;
    const invalidated = new GrandArchiveMatchRuntime(program, targetRemoved);
    expect(invalidated.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(invalidated.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(invalidated.state.objects[itemId]?.zone).toBe("graveyard");
    expect(invalidated.state.objects[itemId]?.hostId).toBeUndefined();
  });

  it("uses Link Shield instead of destroying or sacrificing its linked object", () => {
    const shield = card("link-shield-test-item", "ITEM", [
      {
        id: "linkShieldTestItem-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Ally Link",
        keyword: { name: "link", target: "ally" },
      },
      {
        id: "linkShieldTestItem-a2",
        kind: "static",
        staticKind: "intrinsic",
        text: "Link Shield",
        keyword: { name: "link-shield" },
      },
    ]);
    const protectedAlly = card("link-shield-test-ally", "ALLY", [], undefined, 5, {
      power: 1,
    });
    const program = createGrandArchiveMatchProgram([champion, shield, protectedAlly, actionA]);
    const player = (id: string, includeCards: boolean): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: includeCards
        ? [
            { definitionId: shield.canonicalId, count: 1 },
            { definitionId: protectedAlly.canonicalId, count: 1 },
          ]
        : [{ definitionId: actionA.canonicalId, count: 2 }],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1", true), player("p2", false)],
      firstPlayerId: "p1",
      randomSeed: 45,
    });
    const p1 = grandArchivePlayerId("p1");
    const shieldId = Object.values(initial.objects).find(
      (object) => object.definitionId === shield.canonicalId,
    )!.id;
    const allyId = Object.values(initial.objects).find(
      (object) => object.definitionId === protectedAlly.canonicalId,
    )!.id;
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
      {
        type: "object-moved",
        objectId: shieldId,
        from: "main-deck",
        to: "field",
        hostId: allyId,
      },
      { type: "damage-marked", objectId: allyId, amount: 2 },
    ]).state;
    const replacementKernel = new GrandArchiveTransactionKernel({
      collectReplacements: (state, event) =>
        collectGrandArchiveReplacementCandidates(program, state, event),
      chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
    });
    const replacedChampionOutcome = replacementKernel.transact(positioned, [
      {
        type: "player-lost",
        playerId: p1,
        reason: "champion-died",
        cause: { kind: "rule", rule: "champion-died-state-check" },
      },
      {
        type: "match-finished",
        winnerIds: [grandArchivePlayerId("p2")],
        cause: { kind: "rule", rule: "game-ending-state-check" },
      },
    ]).state;
    expect(replacedChampionOutcome.players[p1]?.lost).toBe(false);
    expect(replacedChampionOutcome.status).toBe("playing");
    const destroyed = replacementKernel.transact(positioned, [
      {
        type: "object-moved",
        objectId: allyId,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "destroy-effect" },
      },
    ]).state;
    expect(destroyed.objects[allyId]?.zone).toBe("field");
    expect(destroyed.objects[allyId]?.damage).toBe(0);
    expect(destroyed.objects[shieldId]?.zone).toBe("graveyard");

    const sacrificed = replacementKernel.transact(positioned, [
      {
        type: "object-moved",
        objectId: allyId,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "sacrifice-effect" },
      },
    ]).state;
    expect(sacrificed.objects[allyId]?.zone).toBe("field");
    expect(sacrificed.objects[allyId]?.damage).toBe(2);
    expect(sacrificed.objects[shieldId]?.zone).toBe("graveyard");

    const lethal = new GrandArchiveTransactionKernel().transact(positioned, [
      { type: "damage-marked", objectId: allyId, amount: 3 },
    ]).state;
    const lethalEvents = collectGrandArchiveStateBasedEvents(program, lethal);
    expect(lethalEvents).toContainEqual(
      expect.objectContaining({ type: "object-moved", objectId: allyId }),
    );
    const savedFromLethal = replacementKernel.transact(lethal, lethalEvents).state;
    expect(savedFromLethal.objects[allyId]?.zone).toBe("field");
    expect(savedFromLethal.objects[allyId]?.damage).toBe(0);
    expect(savedFromLethal.objects[shieldId]?.zone).toBe("graveyard");

    const hostBanished = replacementKernel.transact(positioned, [
      {
        type: "object-moved",
        objectId: allyId,
        from: "field",
        to: "banishment",
        cause: { kind: "rule", rule: "banish-object-effect" },
      },
    ]).state;
    const brokenShield = collectGrandArchiveStateBasedEvents(program, hostBanished);
    expect(brokenShield).toContainEqual(
      expect.objectContaining({
        objectId: shieldId,
        cause: { kind: "rule", rule: "broken-link-shield-destroy" },
      }),
    );
  });

  it("pays Prepare counters and preserves prepared activation state through resolution", () => {
    const preparedAction = card(
      "prepare-test-action",
      "ACTION",
      [
        {
          id: "prepareTestAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 2",
          keyword: { name: "prepare", value: 2 },
        },
        {
          id: "prepareTestAction-a2",
          kind: "card-resolution",
          text: "If this was prepared, mark your champion.",
          effect: {
            kind: "conditional",
            condition: { kind: "activation-state", state: "prepared" },
            then: {
              kind: "add-counter",
              subject: { kind: "champion", player: "controller" },
              counter: { named: "prepare-resolved" },
              amount: 1,
            },
          },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 0 } },
    );
    const variablePrepareAction = card(
      "variable-prepare-test-action",
      "ACTION",
      [
        {
          id: "variablePrepareTestAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare X. X can't be 0.",
          keyword: { name: "prepare", value: { kind: "variable", symbol: "X" } },
          variables: [{ symbol: "X", kind: "chosen", minimum: 1 }],
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 0 } },
    );
    const program = createGrandArchiveMatchProgram([
      champion,
      preparedAction,
      variablePrepareAction,
      actionA,
    ]);
    const player = (id: string, includePrepare: boolean): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: includePrepare
        ? [
            { definitionId: preparedAction.canonicalId, count: 1 },
            { definitionId: variablePrepareAction.canonicalId, count: 1 },
          ]
        : [{ definitionId: actionA.canonicalId, count: 2 }],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1", true), player("p2", false)],
      firstPlayerId: "p1",
      randomSeed: 46,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const championId = initial.zones[p1].field[0]!;
    const preparedActionId = Object.values(initial.objects).find(
      (object) => object.definitionId === preparedAction.canonicalId,
    )!.id;
    const variableActionId = Object.values(initial.objects).find(
      (object) => object.definitionId === variablePrepareAction.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: preparedActionId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: variableActionId, from: "main-deck", to: "hand" },
      {
        type: "counter-changed",
        objectId: championId,
        counter: "preparation",
        delta: 2,
      },
    ]).state;

    const declinedRuntime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      declinedRuntime.execute({ move: "activate-card", cardId: preparedActionId }, { playerId: p1 })
        .ok,
    ).toBe(true);
    expect(declinedRuntime.state.stack.at(-1)?.activationStates).not.toContain("prepared");
    expect(declinedRuntime.state.objects[championId]?.counters.preparation).toBe(2);
    expect(declinedRuntime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(declinedRuntime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(
      declinedRuntime.state.objects[championId]?.counters["named:prepare-resolved"],
    ).toBeUndefined();

    const paidRuntime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      paidRuntime.execute(
        { move: "activate-card", cardId: preparedActionId, prepareAbilityIndexes: [0] },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(paidRuntime.state.stack.at(-1)?.activationStates).toContain("prepared");
    expect(paidRuntime.state.objects[preparedActionId]?.activationStates.has("prepared")).toBe(
      true,
    );
    expect(paidRuntime.state.objects[championId]?.counters.preparation).toBe(0);
    expect(paidRuntime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(paidRuntime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(paidRuntime.state.objects[championId]?.counters["named:prepare-resolved"]).toBe(1);

    const insufficient = {
      ...prepared,
      objects: {
        ...prepared.objects,
        [championId]: {
          ...prepared.objects[championId]!,
          counters: { ...prepared.objects[championId]!.counters, preparation: 1 },
        },
      },
    };
    const insufficientRuntime = new GrandArchiveMatchRuntime(program, insufficient);
    expect(
      insufficientRuntime.execute(
        { move: "activate-card", cardId: preparedActionId, prepareAbilityIndexes: [0] },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(insufficientRuntime.state.objects[preparedActionId]?.zone).toBe("hand");

    const variableRuntime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      variableRuntime.execute(
        {
          move: "activate-card",
          cardId: variableActionId,
          prepareAbilityIndexes: [0],
          variables: { X: 0 },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(
      variableRuntime.execute(
        {
          move: "activate-card",
          cardId: variableActionId,
          prepareAbilityIndexes: [0],
          variables: { X: 1 },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(variableRuntime.state.objects[championId]?.counters.preparation).toBe(1);
  });

  it("pays reserve activation costs with distinct fire cards through Kindle", () => {
    const fireChampion = card("kindle-test-champion", "CHAMPION", [], 0, undefined, {
      elements: ["FIRE"],
    });
    const kindleAction = card(
      "kindle-test-action",
      "ACTION",
      [
        {
          id: "kindleTestAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kindle 2",
          keyword: { name: "kindle", value: 2 },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 3 }, elements: ["FIRE"] },
    );
    const cheapKindleAction = card(
      "cheap-kindle-test-action",
      "ACTION",
      [
        {
          id: "cheapKindleTestAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kindle 2",
          keyword: { name: "kindle", value: 2 },
        },
        {
          id: "cheapKindleTestAction-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Efficiency",
          keyword: { name: "efficiency" },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 3 }, elements: ["FIRE"] },
    );
    const ephemerateKindleAction = card(
      "ephemerate-kindle-test-action",
      "ACTION",
      [
        {
          id: "ephemerateKindleTestAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kindle 2",
          keyword: { name: "kindle", value: 2 },
        },
        {
          id: "ephemerateKindleTestAction-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (2)",
          keyword: { name: "ephemerate", cost: { kind: "pay-reserve", amount: 2 } },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 2 }, elements: ["FIRE"] },
    );
    const fireFuel = card("kindle-fire-fuel", "ACTION", [], undefined, undefined, {
      elements: ["FIRE"],
    });
    const normFuel = card("kindle-norm-fuel", "ACTION");
    const program = createGrandArchiveMatchProgram([
      fireChampion,
      kindleAction,
      cheapKindleAction,
      ephemerateKindleAction,
      fireFuel,
      normFuel,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: kindleAction.canonicalId, count: 1 },
        { definitionId: cheapKindleAction.canonicalId, count: 1 },
        { definitionId: ephemerateKindleAction.canonicalId, count: 1 },
        { definitionId: fireFuel.canonicalId, count: 4 },
        { definitionId: normFuel.canonicalId, count: 3 },
      ],
      materialDeck: [{ definitionId: fireChampion.canonicalId, count: 1 }],
      startingChampionDefinitionId: fireChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 47,
    });
    const p1 = grandArchivePlayerId("p1");
    const objectIds = (definitionId: string) =>
      Object.values(initial.objects)
        .filter((object) => object.ownerId === p1 && object.definitionId === definitionId)
        .map((object) => object.id);
    const kindleActionId = objectIds(kindleAction.canonicalId)[0]!;
    const cheapKindleActionId = objectIds(cheapKindleAction.canonicalId)[0]!;
    const ephemerateKindleActionId = objectIds(ephemerateKindleAction.canonicalId)[0]!;
    const fireFuelIds = objectIds(fireFuel.canonicalId);
    const normFuelIds = objectIds(normFuel.canonicalId);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: kindleActionId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: cheapKindleActionId, from: "main-deck", to: "hand" },
      {
        type: "object-moved",
        objectId: ephemerateKindleActionId,
        from: "main-deck",
        to: "graveyard",
      },
      { type: "object-moved", objectId: fireFuelIds[0]!, from: "main-deck", to: "graveyard" },
      { type: "object-moved", objectId: fireFuelIds[1]!, from: "main-deck", to: "graveyard" },
      { type: "object-moved", objectId: fireFuelIds[2]!, from: "main-deck", to: "graveyard" },
      { type: "object-moved", objectId: fireFuelIds[3]!, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: normFuelIds[0]!, from: "main-deck", to: "graveyard" },
      { type: "object-moved", objectId: normFuelIds[1]!, from: "main-deck", to: "hand" },
      {
        type: "counter-changed",
        objectId: initial.zones[p1].field[0]!,
        counter: "level",
        delta: 2,
      },
    ]).state;

    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: kindleActionId,
          kindleCardIds: [fireFuelIds[0]!, fireFuelIds[1]!],
          reservePayment: [{ kind: "card", cardId: normFuelIds[1]! }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[fireFuelIds[0]!]?.zone).toBe("banishment");
    expect(runtime.state.objects[fireFuelIds[1]!]?.zone).toBe("banishment");
    expect(runtime.state.objects[normFuelIds[1]!]?.zone).toBe("memory");
    expect(runtime.state.objects[kindleActionId]?.zone).toBe("effects-stack");
    const programKindleAction = program.cardsById[kindleAction.canonicalId]!;
    expect(programKindleAction.layout.kind).toBe("single-faced");
    if (programKindleAction.layout.kind === "single-faced") {
      expect(programKindleAction.layout.face.cost).toEqual({
        kind: "reserve",
        amount: 3,
      });
    }

    const duplicateRuntime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      duplicateRuntime.execute(
        {
          move: "activate-card",
          cardId: kindleActionId,
          kindleCardIds: [fireFuelIds[0]!, fireFuelIds[0]!],
          reservePayment: [{ kind: "card", cardId: normFuelIds[1]! }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(duplicateRuntime.state.objects[fireFuelIds[0]!]?.zone).toBe("graveyard");
    expect(duplicateRuntime.state.objects[kindleActionId]?.zone).toBe("hand");

    const overLimitRuntime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      overLimitRuntime.execute(
        {
          move: "activate-card",
          cardId: kindleActionId,
          kindleCardIds: [fireFuelIds[0]!, fireFuelIds[1]!, fireFuelIds[2]!],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);

    const nonFireRuntime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      nonFireRuntime.execute(
        {
          move: "activate-card",
          cardId: kindleActionId,
          kindleCardIds: [normFuelIds[0]!],
          reservePayment: [
            { kind: "card", cardId: normFuelIds[1]! },
            { kind: "card", cardId: fireFuelIds[3]! },
          ],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);

    const overpaymentRuntime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      overpaymentRuntime.execute(
        {
          move: "activate-card",
          cardId: cheapKindleActionId,
          kindleCardIds: [fireFuelIds[0]!, fireFuelIds[1]!],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);

    const sourceAsFuelRuntime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      sourceAsFuelRuntime.execute(
        {
          move: "activate-card",
          cardId: ephemerateKindleActionId,
          activationMethod: "ephemerate",
          kindleCardIds: [ephemerateKindleActionId],
          reservePayment: [{ kind: "card", cardId: normFuelIds[1]! }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(sourceAsFuelRuntime.state.objects[ephemerateKindleActionId]?.zone).toBe("graveyard");

    const ephemerateRuntime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      ephemerateRuntime.execute(
        {
          move: "activate-card",
          cardId: ephemerateKindleActionId,
          activationMethod: "ephemerate",
          kindleCardIds: [fireFuelIds[0]!, fireFuelIds[1]!],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(ephemerateRuntime.state.objects[ephemerateKindleActionId]?.zone).toBe("effects-stack");
    expect(ephemerateRuntime.state.objects[fireFuelIds[0]!]?.zone).toBe("banishment");
    expect(ephemerateRuntime.state.objects[fireFuelIds[1]!]?.zone).toBe("banishment");
  });

  it("suppresses Opportunity through an Interdiction activation while triggers still resolve", () => {
    const interdictionAction = card(
      "interdiction-test-action",
      "ACTION",
      [
        {
          id: "interdictionTestAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Interdiction",
          keyword: { name: "interdiction" },
        },
        {
          id: "interdictionTestAction-a2",
          kind: "card-resolution",
          text: "You may mark your champion.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "add-counter",
              subject: { kind: "champion", player: "controller" },
              counter: { named: "interdiction-accepted" },
              amount: 1,
            },
          },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 0 }, speed: "fast" },
    );
    const triggerWatcher = card("interdiction-trigger-watcher", "ITEM", [
      {
        id: "interdictionTriggerWatcher-a1",
        kind: "triggered",
        text: "Whenever a card is activated, mark this item.",
        trigger: { kind: "event", event: { name: "card-activated" } },
        effect: {
          kind: "add-counter",
          subject: { kind: "source" },
          counter: { named: "activation-witnessed" },
          amount: 1,
        },
      },
    ]);
    const program = createGrandArchiveMatchProgram([
      champion,
      interdictionAction,
      triggerWatcher,
      actionA,
    ]);
    const player = (id: string, includeInterdiction: boolean): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: includeInterdiction
        ? [
            { definitionId: interdictionAction.canonicalId, count: 1 },
            { definitionId: actionA.canonicalId, count: 2 },
          ]
        : [{ definitionId: actionA.canonicalId, count: 3 }],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: triggerWatcher.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1", false), player("p2", true)],
      firstPlayerId: "p1",
      randomSeed: 48,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const actionId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === interdictionAction.canonicalId,
    )!.id;
    const watcherId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === triggerWatcher.canonicalId,
    )!.id;
    const otherActionId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === actionA.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: watcherId, from: "material-deck", to: "field" },
      { type: "object-moved", objectId: otherActionId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.state.opportunity?.holderId).toBe(p2);
    const activation = runtime.execute(
      { move: "activate-card", cardId: actionId },
      { playerId: p2 },
    );
    expect(activation.ok).toBe(true);
    expect(runtime.state.opportunity).toBeNull();
    expect(runtime.state.stack).toHaveLength(1);
    expect(runtime.state.stack[0]?.sourceId).toBe(actionId);
    expect(runtime.state.stack[0]?.opportunityPolicy).toBe("interdiction");
    expect(runtime.state.objects[watcherId]?.counters["named:activation-witnessed"]).toBe(1);
    expect(
      activation.ok && activation.events.some((event) => event.type === "opportunity-closed"),
    ).toBe(true);
    expect(
      activation.ok &&
        activation.events.some(
          (event) =>
            event.type === "stack-item-removed" && event.itemId !== runtime.state.stack[0]?.id,
        ),
    ).toBe(true);
    expect(
      activation.ok && activation.events.some((event) => event.type === "opportunity-opened"),
    ).toBe(false);
    expect(runtime.state.decision?.kind).toBe("resolve-optional-effect");
    expect(
      projectGrandArchiveViewerState(program, runtime.state, p1).opportunityHolderId,
    ).toBeNull();
    expect(() =>
      new GrandArchiveTransactionKernel().transact(runtime.state, [
        {
          type: "opportunity-opened",
          window: {
            holderId: p1,
            startedById: p1,
            passedPlayerIds: [],
            reason: "stack-item-added",
          },
        },
      ]),
    ).toThrow("Interdiction prevents Opportunity");
    expect(
      runtime.execute({ move: "activate-card", cardId: otherActionId }, { playerId: p1 }).ok,
    ).toBe(false);

    const snapshot = serializeGrandArchiveMatchSnapshot(runtime.state);
    const restored = new GrandArchiveMatchRuntime(
      program,
      restoreGrandArchiveMatchSnapshot(program, snapshot),
    );
    const decision = restored.state.decision;
    if (!decision || decision.kind !== "resolve-optional-effect") {
      throw new Error("Expected Interdiction resolution to remain suspended");
    }
    const resumed = restored.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: false,
      },
      { playerId: p2 },
    );
    expect(resumed.ok).toBe(true);
    expect(restored.state.stack).toEqual([]);
    expect(restored.state.objects[actionId]?.zone).toBe("graveyard");
    expect(restored.state.opportunity?.holderId).toBe(p1);
    expect(
      resumed.ok && resumed.events.filter((event) => event.type === "opportunity-opened").length,
    ).toBe(1);
  });

  it("persists a Glimpse decision, rejects invalid partitions, and resumes later instructions", () => {
    const glimpseItem = card("glimpse-item", "ITEM", [
      {
        id: "glimpse-item-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        text: "Glimpse 3, then put a resolved counter on this item.",
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "keyword-action",
              action: "glimpse",
              player: "controller",
              amount: 3,
              bindResultAs: "glimpsed-cards",
            },
            {
              kind: "add-counter",
              subject: { kind: "source" },
              counter: { named: "resolved" },
              amount: 1,
            },
          ],
        },
      },
    ]);
    const program = createGrandArchiveMatchProgram([champion, glimpseItem, actionA, actionB]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: actionA.canonicalId, count: 3 },
        { definitionId: actionB.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: glimpseItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 101,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === glimpseItem.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
    ]).state;
    const originalDeck = prepared.zones[p1]["main-deck"];
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "activate-ability", sourceId, abilityId: "glimpse-item-a1" },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-glimpse") {
      throw new Error("Expected a persisted Glimpse decision");
    }
    expect(decision.cardIds).toEqual(originalDeck.slice(0, 3));
    const invalid = runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: {
          kind: "reorder",
          top: [decision.cardIds[0]],
          bottom: [decision.cardIds[0]],
        },
      },
      { playerId: p1 },
    );
    expect(invalid.ok).toBe(false);
    expect(runtime.state.decision).toEqual(decision);
    const [first, second, third] = decision.cardIds;
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: { kind: "reorder", top: [second], bottom: [third, first] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.zones[p1]["main-deck"]).toEqual([
      second,
      ...originalDeck.slice(3),
      third,
      first,
    ]);
    expect(runtime.state.objects[sourceId]?.counters["named:resolved"]).toBe(1);
    expect(runtime.state.resolution).toBeNull();
  });

  it("Starcalls a looked-at card, bottoms every other card, and defers it until Glimpse resolves", () => {
    const glimpseItem = card("starcalling-glimpse-item", "ITEM", [
      {
        id: "starcalling-glimpse-item-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        text: "Glimpse 3, then put a resolved counter on this item.",
        effect: {
          kind: "sequence",
          effects: [
            { kind: "keyword-action", action: "glimpse", amount: 3 },
            {
              kind: "add-counter",
              subject: { kind: "source" },
              counter: { named: "glimpse-resolved" },
              amount: 1,
            },
          ],
        },
      },
    ]);
    const starcalledAction = card("starcalled-action", "ACTION", [
      {
        id: "starcalledAction-a1",
        kind: "card-resolution",
        text: "Put a counter on your champion.",
        effect: {
          kind: "add-counter",
          subject: { kind: "champion", player: "controller" },
          counter: { named: "starcalled-resolved" },
          amount: 1,
        },
      },
      {
        id: "starcalledAction-a2",
        kind: "static",
        staticKind: "intrinsic",
        text: "Starcalling — (1)",
        keyword: { name: "starcalling", cost: { kind: "pay-reserve", amount: 1 } },
      },
    ]);
    const fillerA = card("starcalling-filler-a", "ACTION");
    const fillerB = card("starcalling-filler-b", "ACTION");
    const program = createGrandArchiveMatchProgram([
      champion,
      glimpseItem,
      starcalledAction,
      fillerA,
      fillerB,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: starcalledAction.canonicalId, count: 1 },
        { definitionId: fillerA.canonicalId, count: 2 },
        { definitionId: fillerB.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: glimpseItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1810,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === glimpseItem.canonicalId,
    )!.id;
    const starcalledId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === starcalledAction.canonicalId,
    )!.id;
    const fillerIds = Object.values(initial.objects)
      .filter(
        (object) =>
          object.ownerId === p1 &&
          (object.definitionId === fillerA.canonicalId ||
            object.definitionId === fillerB.canonicalId),
      )
      .map((object) => object.id);
    const paymentId = fillerIds[2]!;
    const remainingDeckIds = initial.zones[p1]["main-deck"].filter(
      (objectId) =>
        objectId !== starcalledId &&
        objectId !== paymentId &&
        !fillerIds.slice(0, 2).includes(objectId),
    );
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
      { type: "object-moved", objectId: paymentId, from: "main-deck", to: "hand" },
      {
        type: "zone-reordered",
        playerId: p1,
        zone: "main-deck",
        objectIds: [starcalledId, fillerIds[0]!, fillerIds[1]!, ...remainingDeckIds],
        cause: { kind: "rule", rule: "test-fixture-order" },
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "activate-ability", sourceId, abilityId: "starcalling-glimpse-item-a1" },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-glimpse") {
      throw new Error("Expected a persisted Glimpse decision");
    }
    expect(decision.cardIds).toEqual([starcalledId, fillerIds[0], fillerIds[1]]);
    const suspendedState = runtime.state;
    const invalid = runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: {
          kind: "starcall",
          cardId: starcalledId,
          bottom: [fillerIds[0], fillerIds[0]],
        },
      },
      { playerId: p1 },
    );
    expect(invalid.ok).toBe(false);
    expect(runtime.state).toEqual(suspendedState);
    expect(runtime.state.decision).toEqual(decision);

    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "starcall",
            cardId: starcalledId,
            bottom: [fillerIds[1], fillerIds[0]],
            reservePayment: [{ kind: "card", cardId: paymentId }],
          },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[sourceId]?.counters["named:glimpse-resolved"]).toBe(1);
    const championId = runtime.state.zones[p1].field.find((objectId) => objectId !== sourceId)!;
    expect(
      runtime.state.objects[championId]?.counters["named:starcalled-resolved"],
    ).toBeUndefined();
    expect(runtime.state.objects[starcalledId]?.zone).toBe("effects-stack");
    expect(runtime.state.objects[paymentId]?.zone).toBe("memory");
    expect(runtime.state.objects[starcalledId]?.activationStates.has("starcalled")).toBe(true);
    expect(runtime.state.stack).toHaveLength(1);
    expect(runtime.state.stack[0]?.sourceId).toBe(starcalledId);
    expect(runtime.state.stack[0]?.activationStates).toContain("starcalled");
    expect(runtime.state.zones[p1]["main-deck"].slice(-2)).toEqual([fillerIds[1], fillerIds[0]]);
    expect(runtime.state.zones[p1]["main-deck"]).not.toContain(starcalledId);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[championId]?.counters["named:starcalled-resolved"]).toBe(1);
    expect(runtime.state.objects[starcalledId]?.zone).toBe("graveyard");
  });

  it("Starcalls a card that receives the keyword from a resolved rule modification", () => {
    const grantedAction = card("granted-starcalling-ally", "ALLY");
    const filler = card("granted-starcalling-filler", "ACTION");
    const glimpseItem = card("grant-starcalling-item", "ITEM", [
      {
        id: "grant-starcalling-item-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        text: "The next matching card you glimpse has Starcalling (0). Glimpse 3.",
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "rule-modification",
              mode: "grant-keyword",
              action: "glimpse",
              subject: { kind: "player", player: "controller" },
              filter: { kind: "canonical-id", value: grantedAction.canonicalId },
              grantedKeyword: {
                name: "starcalling",
                cost: { kind: "pay-reserve", amount: 0 },
              },
              occurrence: { count: 1, window: "this-turn", actorScope: "same-player" },
              duration: { kind: "this-turn" },
            },
            { kind: "keyword-action", action: "glimpse", amount: 3 },
          ],
        },
      },
    ]);
    const program = createGrandArchiveMatchProgram([champion, glimpseItem, grantedAction, filler]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: grantedAction.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 4 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: glimpseItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1811,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === glimpseItem.canonicalId,
    )!.id;
    const grantedActionId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === grantedAction.canonicalId,
    )!.id;
    const otherIds = initial.zones[p1]["main-deck"].filter(
      (objectId) => objectId !== grantedActionId,
    );
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
      {
        type: "zone-reordered",
        playerId: p1,
        zone: "main-deck",
        objectIds: [grantedActionId, ...otherIds],
        cause: { kind: "rule", rule: "test-fixture-order" },
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "activate-ability", sourceId, abilityId: "grant-starcalling-item-a1" },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-glimpse") {
      throw new Error("Expected a persisted Glimpse decision");
    }
    expect(runtime.state.ruleModifications).toHaveLength(1);
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "starcall",
            cardId: grantedActionId,
            bottom: [decision.cardIds[2]!, decision.cardIds[1]!],
          },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.stack.at(-1)?.sourceId).toBe(grantedActionId);
    expect(runtime.state.stack.at(-1)?.activationStates).toContain("starcalled");
    expect(runtime.state.objects[grantedActionId]?.zone).toBe("effects-stack");
    expect(runtime.state.ruleModifications).toHaveLength(0);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[grantedActionId]?.zone).toBe("field");
    expect(runtime.state.objects[grantedActionId]?.activationStates.has("starcalled")).toBe(true);
  });

  it("loads printed and granted Aethercalling cards during Glimpse and uses them as Aetherwing intent", () => {
    const aetherwing = card(
      "test-aetherwing",
      "WEAPON",
      [
        {
          id: "testAetherwing-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Aetherwing",
          keyword: { name: "aetherwing" },
        },
      ],
      undefined,
      undefined,
      { power: 0, durability: 3, subtypes: ["AETHERWING"] },
    );
    const printedAethercalling = card(
      "printed-aethercalling",
      "ACTION",
      [
        {
          id: "printedAethercalling-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Aethercalling",
          keyword: { name: "aethercalling" },
        },
      ],
      undefined,
      undefined,
      { power: 2, subtypes: ["AETHERCHARGE", "SPELL"] },
    );
    const grantedAethercalling = card("granted-aethercalling", "ACTION", [], undefined, undefined, {
      power: 3,
      subtypes: ["AETHERCHARGE", "SPELL"],
    });
    const filler = card("aethercalling-filler", "ACTION");
    const glimpseItem = card("aethercalling-glimpse-item", "ITEM", [
      {
        id: "aethercalling-glimpse-item-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        text: "Matching cards have Aethercalling this Glimpse. Glimpse 3.",
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "rule-modification",
              mode: "grant-keyword",
              action: "glimpse",
              subject: { kind: "player", player: "controller" },
              filter: { kind: "canonical-id", value: grantedAethercalling.canonicalId },
              grantedKeyword: { name: "aethercalling" },
              occurrence: { count: 1, window: "this-turn", actorScope: "same-player" },
              duration: { kind: "this-turn" },
            },
            { kind: "keyword-action", action: "glimpse", amount: 3 },
            {
              kind: "add-counter",
              subject: { kind: "source" },
              counter: { named: "glimpse-resolved" },
              amount: 1,
            },
          ],
        },
      },
    ]);
    const program = createGrandArchiveMatchProgram([
      champion,
      aetherwing,
      printedAethercalling,
      grantedAethercalling,
      filler,
      glimpseItem,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: printedAethercalling.canonicalId, count: 1 },
        { definitionId: grantedAethercalling.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 3 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: aetherwing.canonicalId, count: 1 },
        { definitionId: glimpseItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1812,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === glimpseItem.canonicalId,
    )!.id;
    const weaponId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === aetherwing.canonicalId,
    )!.id;
    const printedId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === printedAethercalling.canonicalId,
    )!.id;
    const grantedId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === grantedAethercalling.canonicalId,
    )!.id;
    const fillerIds = initial.zones[p1]["main-deck"].filter(
      (objectId) => objectId !== printedId && objectId !== grantedId,
    );
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: weaponId,
        from: "material-deck",
        to: "field",
        initialCounters: { durability: 3 },
      },
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
      {
        type: "zone-reordered",
        playerId: p1,
        zone: "main-deck",
        objectIds: [printedId, grantedId, ...fillerIds],
        cause: { kind: "rule", rule: "test-fixture-order" },
      },
    ]).state;
    const prepared = {
      ...positioned,
      players: {
        ...positioned.players,
        [p1]: { ...positioned.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const championId = prepared.zones[p1].field.find(
      (objectId) => prepared.objects[objectId]?.definitionId === champion.canonicalId,
    )!;
    const defenderId = prepared.zones[p2].field[0]!;
    const unloadedRuntime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      unloadedRuntime.execute(
        {
          move: "declare-attack",
          attackerId: championId,
          targetIds: [defenderId],
          weaponIds: [weaponId],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "activate-ability", sourceId, abilityId: "aethercalling-glimpse-item-a1" },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-glimpse") {
      throw new Error("Expected a persisted Glimpse decision");
    }
    const suspendedState = runtime.state;
    const invalid = runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: {
          kind: "reorder",
          loads: [{ cardId: decision.cardIds[2]!, weaponId }],
          top: [printedId, grantedId],
          bottom: [],
        },
      },
      { playerId: p1 },
    );
    expect(invalid.ok).toBe(false);
    expect(runtime.state).toEqual(suspendedState);

    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "reorder",
            loads: [
              { cardId: printedId, weaponId },
              { cardId: grantedId, weaponId },
            ],
            top: [decision.cardIds[2]!],
            bottom: [],
          },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    for (const cardId of [printedId, grantedId]) {
      expect(runtime.state.objects[cardId]?.zone).toBe("loaded");
      expect(runtime.state.objects[cardId]?.hostId).toBe(weaponId);
    }
    expect(runtime.state.objects[sourceId]?.counters["named:glimpse-resolved"]).toBe(1);
    expect(runtime.state.ruleModifications).toHaveLength(0);

    const orphanKernel = new GrandArchiveTransactionKernel();
    const hostRemoved = orphanKernel.transact(runtime.state, [
      { type: "object-moved", objectId: weaponId, from: "field", to: "graveyard" },
    ]).state;
    const orphanEvents = collectGrandArchiveStateBasedEvents(program, hostRemoved);
    const orphaned = orphanKernel.transact(hostRemoved, orphanEvents).state;
    expect(orphaned.objects[printedId]?.zone).toBe("graveyard");
    expect(orphaned.objects[grantedId]?.zone).toBe("graveyard");

    expect(
      runtime.execute(
        {
          move: "declare-attack",
          attackerId: championId,
          targetIds: [defenderId],
          weaponIds: [weaponId],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.combat?.intentIds).toEqual([printedId, grantedId]);
    for (const cardId of [printedId, grantedId]) {
      expect(runtime.state.objects[cardId]?.zone).toBe("intent");
      expect(runtime.state.objects[cardId]?.hostId).toBe(championId);
    }
    const cleanupState = {
      ...runtime.state,
      combat: { ...runtime.state.combat!, step: "end" as const },
    };
    const cleaned = new GrandArchiveTransactionKernel().transact(
      cleanupState,
      proposeGrandArchiveCombatCleanup(cleanupState),
    ).state;
    expect(cleaned.objects[printedId]?.zone).toBe("graveyard");
    expect(cleaned.objects[grantedId]?.zone).toBe("graveyard");
  });

  it("resolves hosted move effects into an object's loaded-card zone", () => {
    const weapon = card("hosted-move-weapon", "WEAPON", [], undefined, undefined, {
      power: 0,
      durability: 2,
      subtypes: ["AETHERWING"],
    });
    const payload = card("hosted-move-payload", "ACTION");
    const program = createGrandArchiveMatchProgram([champion, weapon, payload, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: payload.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: weapon.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1813,
    });
    const p1 = grandArchivePlayerId("p1");
    const weaponId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === weapon.canonicalId,
    )!.id;
    const payloadId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === payload.canonicalId,
    )!.id;
    const kernel = new GrandArchiveTransactionKernel();
    const positioned = kernel.transact(initial, [
      {
        type: "object-moved",
        objectId: weaponId,
        from: "material-deck",
        to: "field",
        initialCounters: { durability: 2 },
      },
    ]).state;
    const result = executeGrandArchiveEffect(
      {
        kind: "move",
        subject: { kind: "bound", binding: "payload" },
        destination: {
          zone: "loaded",
          host: { kind: "bound", binding: "weapon" },
        },
      },
      {
        program,
        state: positioned,
        controllerId: p1,
        bindings: { payload: [payloadId], weapon: [weaponId] },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(result.state.objects[payloadId]?.zone).toBe("loaded");
    expect(result.state.objects[payloadId]?.hostId).toBe(weaponId);
  });

  it("gathers one deterministic ingredient token as an independent field object", () => {
    const ingredients = [blightroot, fraysia, manaroot, razorvine, silvershine, springleaf];
    const program = createGrandArchiveMatchProgram([...executableCards, ...ingredients]);
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [standardPlayer("p1"), standardPlayer("p2")],
      firstPlayerId: "p1",
      randomSeed: 103,
    });
    const p1 = grandArchivePlayerId("p1");
    const sourceId = initial.zones[p1].field[0]!;
    const executeGather = () =>
      executeGrandArchiveEffect(
        {
          kind: "keyword-action",
          action: "gather",
          player: "controller",
          bindResultAs: "ingredient",
        },
        { program, state: initial, controllerId: p1, sourceId, bindings: {} },
        (state, events) => {
          const result = new GrandArchiveTransactionKernel().transact(state, events);
          return { state: result.state, events: result.result.events };
        },
      );
    const firstResult = executeGather();
    const secondResult = executeGather();
    expect(firstResult.bindings.ingredient).toEqual(secondResult.bindings.ingredient);
    const ingredientBinding = firstResult.bindings.ingredient;
    if (!Array.isArray(ingredientBinding)) throw new Error("Gather did not bind its token");
    const ingredientId = ingredientBinding[0];
    const object = Object.values(firstResult.state.objects).find(
      (candidate) => candidate.id === ingredientId,
    );
    expect(object?.zone).toBe("field");
    expect(object?.controllerId).toBe(p1);
    expect(ingredients.map((ingredient) => ingredient.canonicalId)).toContain(object?.definitionId);
    expect(firstResult.events.map((event) => event.type)).toContain("keyword-action-performed");
  });

  it("scavenges the first matching revealed card and randomizes only the remainder", () => {
    const program = createGrandArchiveMatchProgram(executableCards);
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [standardPlayer("p1"), standardPlayer("p2")],
      firstPlayerId: "p1",
      randomSeed: 107,
    });
    const p1 = grandArchivePlayerId("p1");
    const sourceId = initial.zones[p1].field[0]!;
    const actionAIds = initial.zones[p1]["main-deck"].filter(
      (id) => initial.objects[id]?.definitionId === actionA.canonicalId,
    );
    const actionBIds = initial.zones[p1]["main-deck"].filter(
      (id) => initial.objects[id]?.definitionId === actionB.canonicalId,
    );
    const ordered = [actionAIds[0]!, actionAIds[1]!, actionBIds[0]!, actionBIds[1]!];
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "zone-reordered",
        playerId: p1,
        zone: "main-deck",
        objectIds: ordered,
        cause: { kind: "rule", rule: "test-fixture-order" },
      },
    ]).state;
    const result = executeGrandArchiveEffect(
      {
        kind: "keyword-action",
        action: "scavenge",
        player: "controller",
        amount: 3,
        filter: { kind: "canonical-id", value: actionB.canonicalId },
        bindResultAs: "scavenged",
      },
      { program, state: prepared, controllerId: p1, sourceId, bindings: {} },
      (state, events) => {
        const transaction = new GrandArchiveTransactionKernel().transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(result.bindings.scavenged).toEqual([actionBIds[0]]);
    expect(result.state.zones[p1].hand).toEqual([actionBIds[0]]);
    expect(result.state.zones[p1]["main-deck"].slice(0, 1)).toEqual([actionBIds[1]]);
    expect(new Set(result.state.zones[p1]["main-deck"].slice(1))).toEqual(new Set(actionAIds));
    expect(result.events.filter((event) => event.type === "card-revealed")).toHaveLength(3);
  });

  it("suppresses an object and resolves its independent next-end-phase return trigger", () => {
    const suppressor = card("suppressor", "ITEM", [
      {
        id: "suppressor-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        targets: [
          {
            id: "suppressed-target",
            kind: "target",
            declared: "announcement",
            chooser: "controller",
            count: { kind: "exactly", amount: 1 },
            candidates: {
              kind: "object",
              zones: ["field"],
              filter: { kind: "type", oneOf: ["ALLY"] },
            },
          },
        ],
        text: "Suppress target ally.",
        effect: {
          kind: "keyword-action",
          action: "suppress",
          subject: { kind: "bound", binding: "suppressed-target" },
        },
      },
    ]);
    const ally = card("suppressed-ally", "ALLY", [], undefined, 3);
    const program = createGrandArchiveMatchProgram([champion, suppressor, ally, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: ally.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: suppressor.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 109,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === suppressor.canonicalId,
    )!.id;
    const targetId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === ally.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
      { type: "object-moved", objectId: targetId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "suppressor-a1",
          targets: { "suppressed-target": [targetId] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[targetId]?.zone).toBe("banishment");
    expect(runtime.state.delayedTriggers).toHaveLength(1);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.turn.phase).toBe("end");
    expect(runtime.state.stack.at(-1)?.kind).toBe("triggered-ability");
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[targetId]?.zone).toBe("field");
    expect(runtime.state.objects[targetId]?.controllerId).toBe(p2);
    expect(runtime.state.delayedTriggers).toHaveLength(0);
  });

  it("stacks Empower and fixes the bonus on the next Spell activation", () => {
    const empowerItem = card("empower-item", "ITEM", [
      {
        id: "empower-item-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        text: "Empower 2.",
        effect: { kind: "keyword-action", action: "empower", amount: 2 },
      },
      {
        id: "empower-item-a2",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        text: "Empower 1.",
        effect: { kind: "keyword-action", action: "empower", amount: 1 },
      },
      {
        id: "empower-item-a3",
        kind: "triggered",
        text: "Whenever you activate an empowered card, put a witnessed counter on this item.",
        trigger: {
          kind: "event",
          event: { name: "card-activated", activationState: "empowered" },
        },
        effect: {
          kind: "add-counter",
          subject: { kind: "source" },
          counter: { named: "witnessed" },
          amount: 1,
        },
      },
    ]);
    const levelSpell = card(
      "level-spell",
      "ACTION",
      [
        {
          id: "level-spell-a1",
          kind: "card-resolution",
          text: "Put counters on your champion equal to its level.",
          effect: {
            kind: "add-counter",
            subject: { kind: "champion", player: "controller" },
            counter: { named: "empowered-level" },
            amount: {
              kind: "property",
              subject: { kind: "champion", player: "controller" },
              property: "level",
              basis: "current",
            },
          },
        },
      ],
      undefined,
      undefined,
      { subtypes: ["SPELL"] },
    );
    const program = createGrandArchiveMatchProgram([champion, empowerItem, levelSpell, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: levelSpell.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: empowerItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 113,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === empowerItem.canonicalId,
    )!.id;
    const spellId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === levelSpell.canonicalId,
    )!.id;
    const championId = initial.zones[p1].field[0]!;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
      { type: "object-moved", objectId: spellId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    for (const abilityId of ["empower-item-a1", "empower-item-a2"]) {
      expect(
        runtime.execute({ move: "activate-ability", sourceId, abilityId }, { playerId: p1 }).ok,
      ).toBe(true);
      expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
      expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    }
    expect(runtime.state.players[p1]?.states.empower).toBe(3);
    expect(runtime.execute({ move: "activate-card", cardId: spellId }, { playerId: p1 }).ok).toBe(
      true,
    );
    expect(runtime.state.players[p1]?.states.empower).toBe(0);
    const spellActivation = runtime.state.stack.find((item) => item.kind === "card-activation");
    expect(spellActivation?.activationStates).toContain("empowered");
    expect(spellActivation?.championLevelModifier).toBe(3);
    expect(runtime.state.objects[spellId]?.activationStates.has("empowered")).toBe(true);
    expect(runtime.state.stack.at(-1)?.kind).toBe("triggered-ability");
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[sourceId]?.counters["named:witnessed"]).toBe(1);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[championId]?.counters["named:empowered-level"]).toBe(3);
  });

  it("does not perform zero-valued keyword actions", () => {
    const zeroItem = card("zero-keyword-item", "ITEM", [
      {
        id: "zero-keyword-item-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        text: "Glimpse 0. Empower 0. Scavenge 0. Then mark this item.",
        effect: {
          kind: "sequence",
          effects: [
            { kind: "keyword-action", action: "glimpse", amount: 0 },
            { kind: "keyword-action", action: "empower", amount: 0 },
            {
              kind: "keyword-action",
              action: "scavenge",
              amount: 0,
              filter: { kind: "canonical-id", value: actionA.canonicalId },
            },
            {
              kind: "add-counter",
              subject: { kind: "source" },
              counter: { named: "completed" },
              amount: 1,
            },
          ],
        },
      },
    ]);
    const program = createGrandArchiveMatchProgram([champion, zeroItem, actionA, actionB]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: actionA.canonicalId, count: 2 },
        { definitionId: actionB.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: zeroItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 127,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === zeroItem.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "activate-ability", sourceId, abilityId: "zero-keyword-item-a1" },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    const resolution = runtime.execute({ move: "pass" }, { playerId: p2 });
    expect(resolution.ok).toBe(true);
    if (!resolution.ok) throw new Error(resolution.message);
    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.objects[sourceId]?.counters["named:completed"]).toBe(1);
    expect(resolution.events.filter((event) => event.type === "keyword-action-performed")).toEqual(
      [],
    );
  });

  it("expires unused Empower when the granting player's turn ends", () => {
    const program = createGrandArchiveMatchProgram(executableCards);
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [standardPlayer("p1"), standardPlayer("p2")],
      firstPlayerId: "p1",
      randomSeed: 131,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const empowered = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "player-state-changed", playerId: p1, state: "empower", value: 4 },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, empowered);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.turn.phase).toBe("end");
    expect(runtime.state.players[p1]?.states.empower).toBe(4);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.turn.playerId).toBe(p2);
    expect(runtime.state.players[p1]?.states.empower).toBe(0);
  });

  it("declares a resolved Attack from intent, wields a weapon, and removes durability", () => {
    const intentAttack = card(
      "intent-attack",
      "ATTACK",
      [
        {
          id: "intentAttack-a1",
          kind: "triggered",
          text: "On Attack: Put a declared counter on this attack.",
          trigger: {
            kind: "event",
            event: { name: "attack-declared", subject: { kind: "source" } },
          },
          effect: {
            kind: "add-counter",
            subject: { kind: "source" },
            counter: { named: "declared" },
            amount: 1,
          },
        },
        {
          id: "intentAttack-a2",
          kind: "static",
          staticKind: "effects",
          text: "This attack gets +1 power.",
          effects: [
            {
              kind: "continuous",
              subjects: { kind: "source" },
              affectedSet: "dynamic",
              duration: { kind: "while-source-in-functional-zone" },
              layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
              change: { kind: "numeric", property: "power", operation: "add", amount: 1 },
            },
          ],
        },
      ],
      undefined,
      undefined,
      { power: 3 },
    );
    const testWeapon = card("intent-test-weapon", "WEAPON", [], undefined, undefined, {
      supertypes: ["REGALIA"],
      power: 2,
      durability: 2,
    });
    const program = createGrandArchiveMatchProgram([
      champion,
      intentAttack,
      testWeapon,
      actionA,
      actionB,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: intentAttack.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 2 },
        { definitionId: actionB.canonicalId, count: 1 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: testWeapon.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 137,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attackId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === intentAttack.canonicalId,
    )!.id;
    const weaponId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === testWeapon.canonicalId,
    )!.id;
    const attackerId = initial.zones[p1].field[0]!;
    const targetId = initial.zones[p2].field[0]!;
    const moved = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: attackId, from: "main-deck", to: "hand" },
      {
        type: "object-moved",
        objectId: weaponId,
        from: "material-deck",
        to: "field",
        initialCounters: { durability: 2 },
      },
    ]).state;
    const prepared = {
      ...moved,
      players: {
        ...moved.players,
        [p1]: { ...moved.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "activate-card", cardId: attackId, attackAttackerId: attackerId },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[attackerId]?.states.has("rested")).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const declaration = runtime.state.decision;
    if (!declaration || declaration.kind !== "declare-resolved-attack") {
      throw new Error("Expected the resolved Attack declaration decision");
    }
    expect(runtime.state.opportunity).toBeNull();
    expect(runtime.state.objects[attackId]?.zone).toBe("intent");
    expect(declaration.attackerCandidates).toContain(attackerId);
    expect(declaration.targetCandidates).toContain(targetId);
    expect(declaration.weaponCandidates).toContain(weaponId);

    const invalid = runtime.execute(
      {
        move: "answer-decision",
        decisionId: declaration.id,
        stateVersion: declaration.stateVersion,
        answer: { attackerId, targetIds: [targetId], weaponIds: [targetId] },
      },
      { playerId: p1 },
    );
    expect(invalid.ok).toBe(false);
    expect(runtime.state.decision).toEqual(declaration);
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: declaration.id,
          stateVersion: declaration.stateVersion,
          answer: { attackerId, targetIds: [targetId], weaponIds: [weaponId] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.turn.phase).toBe("combat");
    expect(runtime.state.combat?.intentIds).toEqual([attackId]);
    expect(runtime.state.combat?.weaponIds).toEqual([weaponId]);
    expect(runtime.state.objects[weaponId]?.states.has("wielded")).toBe(true);
    expect(runtime.state.stack.at(-1)?.kind).toBe("triggered-ability");

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[attackId]?.counters["named:declared"]).toBe(1);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.combat?.step).toBe("damage");
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[targetId]?.damage).toBe(6);
    expect(runtime.state.objects[weaponId]?.counters.durability).toBe(1);
    expect(runtime.state.objects[weaponId]?.states.has("wielded")).toBe(false);
    expect(runtime.state.objects[attackId]?.zone).toBe("graveyard");
    expect(runtime.state.combat).toBeNull();
    expect(runtime.state.turn.phase).toBe("main");
  });

  it("fizzles an Attack that resolves when its controller cannot legally declare combat", () => {
    const firstTurnAttack = card("first-turn-attack", "ATTACK", [], undefined, undefined, {
      power: 4,
    });
    const program = createGrandArchiveMatchProgram([champion, firstTurnAttack, actionA, regalia]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: firstTurnAttack.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 139,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attackId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === firstTurnAttack.canonicalId,
    )!.id;
    const attackerId = initial.zones[p1].field[0]!;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: attackId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "activate-card", cardId: attackId, attackAttackerId: attackerId },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[attackId]?.zone).toBe("graveyard");
    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.combat).toBeNull();
    expect(runtime.state.opportunity?.holderId).toBe(p1);
  });

  it("enforces Stealth and awake Taunt unless an attack has True Sight and Unblockable", () => {
    const ordinaryAttacker = card("ordinary-attacker", "ALLY", [], undefined, 4, { power: 2 });
    const unerringAttacker = card(
      "unerring-attacker",
      "ALLY",
      [
        {
          id: "unerringAttacker-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "True Sight",
          keyword: { name: "true-sight" },
        },
        {
          id: "unerringAttacker-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Unblockable",
          keyword: { name: "unblockable" },
        },
      ],
      undefined,
      4,
      { power: 2 },
    );
    const stealthDefender = card(
      "stealth-defender",
      "ALLY",
      [
        {
          id: "stealthDefender-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth",
          keyword: { name: "stealth" },
        },
      ],
      undefined,
      4,
    );
    const tauntDefender = card(
      "taunt-defender",
      "ALLY",
      [
        {
          id: "tauntDefender-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt",
          keyword: { name: "taunt" },
        },
      ],
      undefined,
      4,
    );
    const program = createGrandArchiveMatchProgram([
      champion,
      ordinaryAttacker,
      unerringAttacker,
      stealthDefender,
      tauntDefender,
      actionA,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: ordinaryAttacker.canonicalId, count: 1 },
        { definitionId: unerringAttacker.canonicalId, count: 1 },
        { definitionId: stealthDefender.canonicalId, count: 1 },
        { definitionId: tauntDefender.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 1 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 149,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const find = (ownerId: typeof p1, definitionId: string) =>
      Object.values(initial.objects).find(
        (object) => object.ownerId === ownerId && object.definitionId === definitionId,
      )!.id;
    const ordinaryId = find(p1, ordinaryAttacker.canonicalId);
    const unerringId = find(p1, unerringAttacker.canonicalId);
    const stealthId = find(p2, stealthDefender.canonicalId);
    const tauntId = find(p2, tauntDefender.canonicalId);
    const opponentChampionId = initial.zones[p2].field[0]!;
    const moved = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: ordinaryId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: unerringId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: stealthId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: tauntId, from: "main-deck", to: "field" },
    ]).state;
    const prepared = {
      ...moved,
      players: {
        ...moved.players,
        [p1]: { ...moved.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "declare-attack", attackerId: ordinaryId, targetIds: [stealthId] },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(
      runtime.execute(
        { move: "declare-attack", attackerId: ordinaryId, targetIds: [opponentChampionId] },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(
      runtime.execute(
        { move: "declare-attack", attackerId: unerringId, targetIds: [stealthId] },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.combat?.targetIds).toEqual([stealthId]);
  });

  it("puts Intercept on the stack and redirects a champion attack when it resolves", () => {
    const attackingAlly = card("intercept-test-attacker", "ALLY", [], undefined, 8, {
      power: 3,
    });
    const interceptor = card(
      "intercept-test-defender",
      "ALLY",
      [
        {
          id: "interceptTestDefender-a1",
          kind: "keyword-group",
          text: "Intercept, True Sight, Intercept",
          keywords: [{ name: "intercept" }, { name: "true-sight" }, { name: "intercept" }],
        },
      ],
      undefined,
      7,
      { power: 2 },
    );
    const program = createGrandArchiveMatchProgram([champion, attackingAlly, interceptor, actionA]);
    const combatPlayer = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: attackingAlly.canonicalId, count: 1 },
        { definitionId: interceptor.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [combatPlayer("p1"), combatPlayer("p2")],
      firstPlayerId: "p1",
      randomSeed: 150,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attackerId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === attackingAlly.canonicalId,
    )!.id;
    const interceptorId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === interceptor.canonicalId,
    )!.id;
    const championId = initial.zones[p2].field[0]!;
    const moved = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: attackerId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: interceptorId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, {
      ...moved,
      players: {
        ...moved.players,
        [p1]: { ...moved.players[p1]!, hasTakenFirstTurn: true },
      },
    });

    expect(
      runtime.execute(
        { move: "declare-attack", attackerId, targetIds: [championId] },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.stack.at(-1)?.kind).toBe("triggered-ability");
    expect(runtime.state.stack.at(-1)?.sourceId).toBe(interceptorId);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const intercept = runtime.state.decision;
    if (!intercept || intercept.kind !== "resolve-optional-effect") {
      throw new Error("Expected optional Intercept decision");
    }
    expect(intercept.playerId).toBe(p2);
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: intercept.id,
          stateVersion: intercept.stateVersion,
          answer: true,
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.combat?.targetIds).toEqual([interceptorId]);
    expect(runtime.state.objects[championId]?.states.has("defending")).toBe(false);
    expect(runtime.state.objects[interceptorId]?.states.has("defending")).toBe(true);
    expect(runtime.state.objects[interceptorId]?.states.has("intercepting")).toBe(true);
    const cleanupState = {
      ...runtime.state,
      combat: { ...runtime.state.combat!, step: "end" as const },
    };
    const cleaned = new GrandArchiveTransactionKernel().transact(
      cleanupState,
      proposeGrandArchiveCombatCleanup(cleanupState, { suppressOpportunity: true }),
    ).state;
    expect(cleaned.combat).toBeNull();
    expect(cleaned.objects[interceptorId]?.states.has("intercepting")).toBe(false);
  });

  it("admits Intercept while its ally is disobedient and rechecks obedience on resolution", () => {
    const attackingAlly = card("disobedient-intercept-attacker", "ALLY", [], undefined, 8, {
      power: 3,
    });
    const interceptor = card(
      "disobedient-intercept-defender",
      "ALLY",
      [
        {
          id: "disobedientInterceptDefender-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept",
          keyword: { name: "intercept" },
        },
        {
          id: "disobedientInterceptDefender-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 1",
          keyword: { name: "pride", value: 1 },
        },
      ],
      undefined,
      7,
      { power: 2 },
    );
    const program = createGrandArchiveMatchProgram([champion, attackingAlly, interceptor, actionA]);
    const combatPlayer = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: attackingAlly.canonicalId, count: 1 },
        { definitionId: interceptor.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });

    const run = (makeObedientBeforeResolution: boolean) => {
      const initial = createGrandArchiveMatchInitialState(program, {
        mode: "standard",
        players: [combatPlayer("p1"), combatPlayer("p2")],
        firstPlayerId: "p1",
        randomSeed: makeObedientBeforeResolution ? 151 : 152,
      });
      const p1 = grandArchivePlayerId("p1");
      const p2 = grandArchivePlayerId("p2");
      const attackerId = Object.values(initial.objects).find(
        (object) => object.ownerId === p1 && object.definitionId === attackingAlly.canonicalId,
      )!.id;
      const interceptorId = Object.values(initial.objects).find(
        (object) => object.ownerId === p2 && object.definitionId === interceptor.canonicalId,
      )!.id;
      const championId = initial.zones[p2].field[0]!;
      const moved = new GrandArchiveTransactionKernel().transact(initial, [
        { type: "object-moved", objectId: attackerId, from: "main-deck", to: "field" },
        { type: "object-moved", objectId: interceptorId, from: "main-deck", to: "field" },
      ]).state;
      let runtime = new GrandArchiveMatchRuntime(program, {
        ...moved,
        players: {
          ...moved.players,
          [p1]: { ...moved.players[p1]!, hasTakenFirstTurn: true },
        },
      });

      const declaration = runtime.execute(
        { move: "declare-attack", attackerId, targetIds: [championId] },
        { playerId: p1 },
      );
      expect(declaration.ok).toBe(true);
      expect(runtime.state.stack.at(-1)).toMatchObject({
        kind: "triggered-ability",
        sourceId: interceptorId,
      });
      expect(runtime.state.opportunity).not.toBeNull();

      if (makeObedientBeforeResolution) {
        const leveled = new GrandArchiveTransactionKernel().transact(runtime.state, [
          { type: "counter-changed", objectId: championId, counter: "level", delta: 1 },
        ]).state;
        runtime = new GrandArchiveMatchRuntime(program, leveled);
      }
      expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
      expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
      const decision = runtime.state.decision;
      if (!decision || decision.kind !== "resolve-optional-effect") {
        throw new Error("Expected optional Intercept decision for the disobedient ally");
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
      return { runtime, championId, interceptorId };
    };

    const stillDisobedient = run(false);
    expect(stillDisobedient.runtime.state.combat?.targetIds).toEqual([stillDisobedient.championId]);
    const madeObedient = run(true);
    expect(madeObedient.runtime.state.combat?.targetIds).toEqual([madeObedient.interceptorId]);
  });

  it("applies printed durability, Hindered, and Bulwark as an object enters the field", () => {
    const entryWeapon = card(
      "entry-keyword-weapon",
      "WEAPON",
      [
        {
          id: "entryKeywordWeapon-a1",
          kind: "keyword-group",
          text: "Hindered, Bulwark, Bulwark",
          keywords: [{ name: "hindered" }, { name: "bulwark" }, { name: "bulwark" }],
        },
      ],
      undefined,
      undefined,
      {
        supertypes: ["REGALIA"],
        power: 1,
        durability: 3,
        cost: { kind: "memory", amount: 2 },
      },
    );
    const floatingCard = card("entry-floating-memory", "ACTION", [
      {
        id: "entryFloatingMemory-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Floating Memory",
        keyword: { name: "floating-memory" },
      },
    ]);
    const program = createGrandArchiveMatchProgram([champion, entryWeapon, floatingCard, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: floatingCard.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: entryWeapon.canonicalId, count: 2 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1500,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const weaponIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === entryWeapon.canonicalId)
      .map((object) => object.id);
    const weaponId = weaponIds[0]!;
    const floatingCardId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === floatingCard.canonicalId,
    )!.id;
    const memoryCardId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === actionA.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: floatingCardId, from: "main-deck", to: "graveyard" },
      { type: "object-moved", objectId: memoryCardId, from: "main-deck", to: "memory" },
    ]).state;
    const entryKernel = new GrandArchiveTransactionKernel({
      collectReplacements: (state, event) =>
        collectGrandArchiveReplacementCandidates(program, state, event),
      chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
    });
    const preloadedEntry = entryKernel.transact(prepared, [
      {
        type: "object-moved",
        objectId: weaponIds[1]!,
        from: "material-deck",
        to: "field",
        initialCounters: { bulwark: 4 },
      },
    ]).state;
    expect(preloadedEntry.objects[weaponIds[1]!]!.counters).toMatchObject({
      bulwark: 6,
      durability: 3,
    });
    const runtime = new GrandArchiveMatchRuntime(program, {
      ...prepared,
      turn: { ...prepared.turn, phase: "materialize", materializeChoicePending: true },
      opportunity: null,
      players: {
        ...prepared.players,
        [p1]: { ...prepared.players[p1]!, hasTakenFirstTurn: true },
      },
    });

    expect(
      runtime.execute(
        { move: "materialize", cardId: weaponId, floatingMemoryCardIds: [floatingCardId] },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[floatingCardId]?.zone).toBe("banishment");
    expect(runtime.state.objects[memoryCardId]?.zone).toBe("banishment");
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[weaponId]?.zone).toBe("field");
    expect(runtime.state.objects[weaponId]?.states.has("rested")).toBe(true);
    expect(runtime.state.objects[weaponId]?.counters.durability).toBe(3);
    expect(runtime.state.objects[weaponId]?.counters.bulwark).toBe(2);
    expect(runtime.state.turn.phase).toBe("recollection");
    expect(runtime.state.opportunity?.holderId).toBe(p1);
  });

  it("honors active Fast Activation while an opponent has Opportunity", () => {
    const fastAlly = card("fast-activation-ally", "ALLY", [
      {
        id: "fastActivationAlly-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Fast Activation",
        keyword: { name: "fast-activation" },
      },
    ]);
    const program = createGrandArchiveMatchProgram([champion, fastAlly, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: fastAlly.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1504,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const cardId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === fastAlly.canonicalId,
    )!.id;
    const slowCardId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === actionA.canonicalId,
    )!.id;
    const moved = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: cardId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: slowCardId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, moved);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.state.opportunity?.holderId).toBe(p2);
    expect(
      runtime.execute({ move: "activate-card", cardId: slowCardId }, { playerId: p2 }).ok,
    ).toBe(false);
    expect(runtime.execute({ move: "activate-card", cardId }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.stack.at(-1)?.kind).toBe("card-activation");
    expect(runtime.state.opportunity?.holderId).toBe(p2);
  });

  it("defaults activated abilities to fast and returns Opportunity to the non-turn activator", () => {
    const abilityChampion = card(
      "timing-ability-champion",
      "CHAMPION",
      [
        {
          id: "timingAbilityChampion-a1",
          kind: "activated",
          activation: "ability",
          text: "Do nothing.",
          cost: { kind: "rest", subject: { kind: "source" } },
          effect: { kind: "no-op" },
        },
        {
          id: "timingAbilityChampion-a2",
          kind: "activated",
          activation: "ability",
          speed: "slow",
          text: "Slow — Do nothing.",
          cost: { kind: "rest", subject: { kind: "source" } },
          effect: { kind: "no-op" },
        },
      ],
      0,
    );
    const program = createGrandArchiveMatchProgram([abilityChampion, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: actionA.canonicalId, count: 4 }],
      materialDeck: [{ definitionId: abilityChampion.canonicalId, count: 1 }],
      startingChampionDefinitionId: abilityChampion.canonicalId,
    });
    const runtime = new GrandArchiveMatchRuntime(
      program,
      createGrandArchiveMatchInitialState(program, {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 1505,
      }),
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = runtime.state.zones[p2].field[0]!;

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.state.opportunity?.holderId).toBe(p2);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "timingAbilityChampion-a2",
        },
        { playerId: p2 },
      ).ok,
    ).toBe(false);
    const fastActivation = runtime.execute(
      {
        move: "activate-ability",
        sourceId,
        abilityId: "timingAbilityChampion-a1",
      },
      { playerId: p2 },
    );
    if (!fastActivation.ok) throw new Error(fastActivation.message);
    expect(runtime.state.opportunity?.holderId).toBe(p2);
  });

  it("stacks every active Efficiency instance against a card's reserve cost", () => {
    const levelTwoChampion = card("efficiency-champion", "CHAMPION", [], 0);
    const efficientAction = card(
      "efficient-action",
      "ACTION",
      [
        {
          id: "efficientAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Efficiency",
          keyword: { name: "efficiency" },
        },
        {
          id: "efficientAction-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Efficiency",
          keyword: { name: "efficiency" },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 3 } },
    );
    const program = createGrandArchiveMatchProgram([levelTwoChampion, efficientAction, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: efficientAction.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [{ definitionId: levelTwoChampion.canonicalId, count: 1 }],
      startingChampionDefinitionId: levelTwoChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1505,
    });
    const p1 = grandArchivePlayerId("p1");
    const cardId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === efficientAction.canonicalId,
    )!.id;
    const paymentId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === actionA.canonicalId,
    )!.id;
    const championId = initial.zones[p1].field[0]!;
    const moved = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: cardId, from: "main-deck", to: "hand" },
      { type: "counter-changed", objectId: championId, counter: "level", delta: 2 },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, moved);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[paymentId]?.zone).toBe("main-deck");
  });

  it("applies one Elysian Aura and tracks its level modifier during resolution", () => {
    const aura = card(
      "elysian-aura-item",
      "ITEM",
      [
        {
          id: "elysianAuraItem-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Elysian Aura",
          keyword: { name: "elysian-aura" },
        },
      ],
      undefined,
      undefined,
      { supertypes: ["REGALIA"] },
    );
    const aeneanSpell = card(
      "elysian-aenean-spell",
      "ACTION",
      [
        {
          id: "elysianAeneanSpell-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Efficiency",
          keyword: { name: "efficiency" },
        },
        {
          id: "elysianAeneanSpell-a2",
          kind: "card-resolution",
          text: "Destroy target item. Mark your champion equal to its level.",
          targets: [
            {
              id: "aura-target",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: { kind: "exactly", amount: 1 },
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: { kind: "canonical-id", value: aura.canonicalId },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              { kind: "destroy", subject: { kind: "bound", binding: "aura-target" } },
              {
                kind: "add-counter",
                subject: { kind: "champion", player: "controller" },
                counter: { named: "aura-level" },
                amount: {
                  kind: "property",
                  subject: { kind: "champion", player: "controller" },
                  property: "level",
                  basis: "current",
                },
              },
            ],
          },
        },
        {
          id: "elysianAeneanSpell-a3",
          kind: "card-resolution",
          text: "[Level 2+] Mark your champion after this effect resolves.",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: { kind: "champion", player: "controller" },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: { kind: "champion", player: "controller" },
            counter: { named: "aura-restricted" },
            amount: 1,
          },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 3 }, subtypes: ["AENEAN", "SPELL"] },
    );
    const program = createGrandArchiveMatchProgram([champion, aura, aeneanSpell, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: aeneanSpell.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: aura.canonicalId, count: 2 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1506,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const spellId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === aeneanSpell.canonicalId,
    )!.id;
    const auraIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === aura.canonicalId)
      .map((object) => object.id);
    const opponentAuraId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === aura.canonicalId,
    )!.id;
    const paymentIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === actionA.canonicalId)
      .map((object) => object.id);
    const paymentId = paymentIds[0]!;
    const championId = initial.zones[p1].field[0]!;
    const cardsInHand = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: spellId, from: "main-deck", to: "hand" },
      ...paymentIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
      {
        type: "object-moved",
        objectId: opponentAuraId,
        from: "material-deck",
        to: "field",
      },
    ]).state;
    const withoutAura = new GrandArchiveMatchRuntime(program, cardsInHand);
    expect(
      withoutAura.execute(
        {
          move: "activate-card",
          cardId: spellId,
          reservePayment: [{ kind: "card", cardId: paymentId }],
          targets: { "aura-target": [opponentAuraId] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);

    const gainedAuraRuntime = new GrandArchiveMatchRuntime(program, cardsInHand);
    expect(
      gainedAuraRuntime.execute(
        {
          move: "activate-card",
          cardId: spellId,
          reservePayment: paymentIds.map((cardId) => ({ kind: "card", cardId })),
          targets: { "aura-target": [opponentAuraId] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const auraGainedBeforeResolution = new GrandArchiveTransactionKernel().transact(
      gainedAuraRuntime.state,
      [{ type: "object-moved", objectId: auraIds[0]!, from: "material-deck", to: "field" }],
    ).state;
    const gainedBeforeResolution = new GrandArchiveMatchRuntime(
      program,
      auraGainedBeforeResolution,
    );
    expect(gainedBeforeResolution.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(gainedBeforeResolution.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(gainedBeforeResolution.state.objects[championId]?.counters["named:aura-level"]).toBe(2);

    const oneAura = new GrandArchiveTransactionKernel().transact(cardsInHand, [
      { type: "object-moved", objectId: auraIds[0]!, from: "material-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, oneAura);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: spellId,
          reservePayment: [{ kind: "card", cardId: paymentId }],
          targets: { "aura-target": [auraIds[0]!] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.stack.at(-1)?.championLevelModifier).toBe(0);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[auraIds[0]!]?.zone).not.toBe("field");
    expect(runtime.state.objects[championId]?.counters["named:aura-level"]).toBeUndefined();
    expect(runtime.state.objects[championId]?.counters["named:aura-restricted"]).toBe(1);

    const bothAuras = new GrandArchiveTransactionKernel().transact(cardsInHand, [
      { type: "object-moved", objectId: auraIds[0]!, from: "material-deck", to: "field" },
      { type: "object-moved", objectId: auraIds[1]!, from: "material-deck", to: "field" },
    ]).state;
    const nonStackingRuntime = new GrandArchiveMatchRuntime(program, bothAuras);
    expect(
      nonStackingRuntime.execute(
        {
          move: "activate-card",
          cardId: spellId,
          reservePayment: [{ kind: "card", cardId: paymentId }],
          targets: { "aura-target": [auraIds[0]!] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
  });

  it("counts each resolved Aenean card once and stacks its Progression instances", () => {
    const aeneanAction = card(
      "aenean-progression-action",
      "ACTION",
      [
        {
          id: "aeneanProgressionAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Aenean Progression",
          keyword: { name: "aenean-progression" },
        },
        {
          id: "aeneanProgressionAction-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Aenean Progression",
          keyword: { name: "aenean-progression" },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 0 } },
    );
    const program = createGrandArchiveMatchProgram([champion, aeneanAction, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: aeneanAction.canonicalId, count: 2 },
        { definitionId: actionA.canonicalId, count: 5 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1506,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const aeneanIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === aeneanAction.canonicalId)
      .map((object) => object.id);
    const paymentIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === actionA.canonicalId)
      .slice(0, 4)
      .map((object) => object.id);
    const prepared = new GrandArchiveTransactionKernel().transact(
      initial,
      [...aeneanIds, ...paymentIds].map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    ).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute({ move: "activate-card", cardId: aeneanIds[0]! }, { playerId: p1 }).ok,
    ).toBe(true);
    expect(runtime.state.players[p1]?.states.aeneanProgressionResolved).toBeUndefined();
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.players[p1]?.states.aeneanProgressionResolved).toBe(1);

    const beforeIllegalActivation = runtime.state;
    expect(
      runtime.execute({ move: "activate-card", cardId: aeneanIds[1]! }, { playerId: p1 }).ok,
    ).toBe(false);
    expect(runtime.state).toEqual(beforeIllegalActivation);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: aeneanIds[1]!,
          reservePayment: paymentIds.map((cardId) => ({ kind: "card", cardId })),
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(paymentIds.every((cardId) => runtime.state.objects[cardId]?.zone === "memory")).toBe(
      true,
    );
  });

  it("Brews with an exact non-overlapping ingredient assignment and preserves brewed state", () => {
    const namedHerb = card("brew-razorvine", "ITEM", [], undefined, undefined, {
      subtypes: ["HERB", "CATALYST"],
    });
    const otherHerb = card("brew-springleaf", "ITEM", [], undefined, undefined, {
      subtypes: ["HERB", "ADJUVANT"],
    });
    const brewedItem = card(
      "brew-result",
      "ITEM",
      [
        {
          id: "brew-result-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One brew-razorvine, One Herb",
          keyword: {
            name: "brew",
            requirements: [
              { kind: "name", value: "brew-razorvine", count: 1 },
              { kind: "subtype", value: "Herb", count: 1 },
            ],
          },
        },
        {
          id: "brew-result-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Aenean Progression",
          keyword: { name: "aenean-progression" },
        },
        {
          id: "brew-result-a3",
          kind: "triggered",
          text: "On Enter: If this was brewed, put an age counter on it.",
          trigger: {
            kind: "event",
            event: { name: "object-entered-field", subject: { kind: "source" } },
          },
          effect: {
            kind: "conditional",
            condition: { kind: "activation-state", state: "brewed" },
            then: {
              kind: "add-counter",
              subject: { kind: "source" },
              counter: { named: "age" },
              amount: 1,
            },
          },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 9 }, subtypes: ["POTION"] },
    );
    const brewWatcher = card(
      "brew-watcher",
      "ALLY",
      [
        {
          id: "brew-watcher-a1",
          kind: "triggered",
          text: "Whenever you brew a card, put a buff counter on this.",
          trigger: {
            kind: "event",
            event: {
              name: "keyword-action-performed",
              actor: "controller",
              action: "brew",
              subject: {
                kind: "event-object",
                filter: { kind: "subtype", oneOf: ["POTION"] },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: { kind: "source" },
            counter: "buff",
            amount: 1,
          },
        },
      ],
      undefined,
      2,
    );
    const program = createGrandArchiveMatchProgram([
      champion,
      namedHerb,
      otherHerb,
      brewedItem,
      brewWatcher,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: namedHerb.canonicalId, count: 1 },
        { definitionId: otherHerb.canonicalId, count: 1 },
        { definitionId: brewedItem.canonicalId, count: 1 },
        { definitionId: brewWatcher.canonicalId, count: 1 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1510,
    });
    const p1 = grandArchivePlayerId("p1");
    const owned = Object.values(initial.objects).filter((object) => object.ownerId === p1);
    const namedHerbId = owned.find((object) => object.definitionId === namedHerb.canonicalId)!.id;
    const otherHerbId = owned.find((object) => object.definitionId === otherHerb.canonicalId)!.id;
    const brewedItemId = owned.find((object) => object.definitionId === brewedItem.canonicalId)!.id;
    const watcherId = owned.find((object) => object.definitionId === brewWatcher.canonicalId)!.id;
    const kernel = new GrandArchiveTransactionKernel();
    const positioned = kernel.transact(initial, [
      { type: "object-moved", objectId: namedHerbId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: otherHerbId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: watcherId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: brewedItemId, from: "main-deck", to: "hand" },
      {
        type: "player-state-changed",
        playerId: p1,
        state: "aeneanProgressionResolved",
        value: 4,
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, positioned);
    const resolveCurrentTop = () => {
      const stackItemId = runtime.state.stack.at(-1)?.id;
      if (!stackItemId) throw new Error("Expected a stack item to resolve");
      for (let passCount = 0; passCount < 4; passCount += 1) {
        if (!runtime.state.stack.some((item) => item.id === stackItemId)) return;
        const holderId = runtime.state.opportunity?.holderId;
        if (!holderId) throw new Error("Expected an Opportunity window before resolution");
        const transition = runtime.execute({ move: "pass" }, { playerId: holderId });
        if (!transition.ok) throw new Error(transition.message);
      }
      throw new Error("The stack item did not resolve after a complete Opportunity cycle");
    };
    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: brewedItemId,
        activationMethod: "brew",
        brewIngredientIds: [namedHerbId, otherHerbId],
      },
      { playerId: p1 },
    );
    expect(activation.ok).toBe(true);
    expect(runtime.state.objects[namedHerbId]?.zone).toBe("graveyard");
    expect(runtime.state.objects[otherHerbId]?.zone).toBe("graveyard");
    expect(runtime.state.stack.some((item) => item.activationStates.includes("brewed"))).toBe(true);
    expect(
      runtime.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "brew-watcher-a1",
      ),
    ).toBe(true);

    resolveCurrentTop();
    expect(runtime.state.objects[watcherId]?.counters.buff).toBe(1);
    resolveCurrentTop();
    expect(runtime.state.objects[brewedItemId]?.zone).toBe("field");
    expect(runtime.state.objects[brewedItemId]?.activationStates.has("brewed")).toBe(true);
    resolveCurrentTop();
    expect(runtime.state.objects[brewedItemId]?.counters["named:age"]).toBe(1);
  });

  it("rejects an illegal Brew atomically, including ingredient name constraints", () => {
    const herbA = card("same-name-herb-a", "ITEM", [], undefined, undefined, {
      subtypes: ["HERB"],
    });
    const herbB = card("same-name-herb-b", "ITEM", [], undefined, undefined, {
      subtypes: ["HERB"],
    });
    const soothing = card(
      "same-name-brew",
      "ITEM",
      [
        {
          id: "same-name-brew-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — Two Herbs with the same name",
          keyword: {
            name: "brew",
            requirements: [{ kind: "subtype", value: "Herb", count: 2 }],
            nameConstraint: "same",
          },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 3 } },
    );
    const distinctTonic = card(
      "different-name-brew",
      "ITEM",
      [
        {
          id: "different-name-brew-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — Two Herbs with different names",
          keyword: {
            name: "brew",
            requirements: [{ kind: "subtype", value: "Herb", count: 2 }],
            nameConstraint: "different",
          },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 3 } },
    );
    const program = createGrandArchiveMatchProgram([
      champion,
      herbA,
      herbB,
      soothing,
      distinctTonic,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: herbA.canonicalId, count: 2 },
        { definitionId: herbB.canonicalId, count: 1 },
        { definitionId: soothing.canonicalId, count: 1 },
        { definitionId: distinctTonic.canonicalId, count: 1 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1511,
    });
    const p1 = grandArchivePlayerId("p1");
    const owned = Object.values(initial.objects).filter((object) => object.ownerId === p1);
    const herbAIds = owned
      .filter((object) => object.definitionId === herbA.canonicalId)
      .map((object) => object.id);
    const herbBId = owned.find((object) => object.definitionId === herbB.canonicalId)!.id;
    const soothingId = owned.find((object) => object.definitionId === soothing.canonicalId)!.id;
    const distinctTonicId = owned.find(
      (object) => object.definitionId === distinctTonic.canonicalId,
    )!.id;
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      ...herbAIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "field" as const,
      })),
      { type: "object-moved", objectId: herbBId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: soothingId, from: "main-deck", to: "hand" },
      {
        type: "object-moved",
        objectId: distinctTonicId,
        from: "main-deck",
        to: "hand",
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, positioned);
    const before = runtime.state;
    const result = runtime.execute(
      {
        move: "activate-card",
        cardId: soothingId,
        activationMethod: "brew",
        brewIngredientIds: [herbAIds[0]!, herbBId],
      },
      { playerId: p1 },
    );
    expect(result.ok).toBe(false);
    expect(runtime.state).toEqual(before);
    const distinctResult = runtime.execute(
      {
        move: "activate-card",
        cardId: distinctTonicId,
        activationMethod: "brew",
        brewIngredientIds: herbAIds,
      },
      { playerId: p1 },
    );
    expect(distinctResult.ok).toBe(false);
    expect(runtime.state).toEqual(before);
  });

  it("pays additional activation costs while Brewing without paying the reserve cost", () => {
    const herb = card("additional-brew-herb", "ITEM", [], undefined, undefined, {
      subtypes: ["HERB"],
    });
    const brewAction = card(
      "extra-brew-card",
      "ACTION",
      [
        {
          id: "extra-brew-card-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Herb",
          keyword: {
            name: "brew",
            requirements: [{ kind: "subtype", value: "Herb", count: 1 }],
          },
        },
        {
          id: "extra-brew-card-a2",
          kind: "card-resolution",
          text: "As an additional cost, pay one reserve.",
          additionalCost: { kind: "pay-reserve", amount: 1 },
          effect: { kind: "no-op" },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 8 } },
    );
    const program = createGrandArchiveMatchProgram([champion, herb, brewAction, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: herb.canonicalId, count: 1 },
        { definitionId: brewAction.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 1 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1512,
    });
    const p1 = grandArchivePlayerId("p1");
    const owned = Object.values(initial.objects).filter((object) => object.ownerId === p1);
    const herbId = owned.find((object) => object.definitionId === herb.canonicalId)!.id;
    const brewActionId = owned.find((object) => object.definitionId === brewAction.canonicalId)!.id;
    const reserveCardId = owned.find((object) => object.definitionId === actionA.canonicalId)!.id;
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: herbId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: brewActionId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: reserveCardId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, positioned);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: brewActionId,
          activationMethod: "brew",
          brewIngredientIds: [herbId],
          reservePayment: [{ kind: "card", cardId: reserveCardId }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[herbId]?.zone).toBe("graveyard");
    expect(runtime.state.objects[reserveCardId]?.zone).toBe("memory");
  });

  it("enforces Class Locked and composes every active Class Bonus resolution paragraph", () => {
    const mageChampion = card("restriction-mage-champion", "CHAMPION", [], 0, 20, {
      classes: ["MAGE"],
    });
    const clericChampion = card("restriction-cleric-champion", "CHAMPION", [], 0, 20, {
      classes: ["CLERIC"],
    });
    const classLockedAction = card(
      "restriction-locked-card",
      "ACTION",
      [
        {
          id: "restriction-locked-card-a1",
          kind: "static",
          staticKind: "effects",
          text: "Class Locked",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: { kind: "source" },
              condition: { kind: "champion-matches-source", characteristic: "class" },
              duration: { kind: "while-source-in-functional-zone" },
            },
          ],
        },
        {
          id: "restriction-locked-card-a2",
          kind: "card-resolution",
          text: "No effect.",
          effect: { kind: "no-op" },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 0 }, classes: ["CLERIC"] },
    );
    const classBonusAction = card(
      "restriction-bonus-card",
      "ACTION",
      [
        {
          id: "restriction-bonus-card-a1",
          kind: "card-resolution",
          text: "Put a buff counter on your champion.",
          effect: {
            kind: "add-counter",
            subject: { kind: "champion", player: "controller" },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "restriction-bonus-card-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Put two buff counters on your champion.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: { kind: "champion-matches-source", characteristic: "class" },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: { kind: "champion", player: "controller" },
            counter: "buff",
            amount: 2,
          },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 0 }, classes: ["MAGE"] },
    );
    const restrictedItem = card(
      "restriction-item",
      "ITEM",
      [
        {
          id: "restriction-item-a1",
          kind: "activated",
          activation: "ability",
          cost: { kind: "pay-reserve", amount: 0 },
          text: "[Class Bonus] Put a buff counter on this.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: { kind: "champion-matches-source", characteristic: "class" },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: { kind: "source" },
            counter: "buff",
            amount: 1,
          },
        },
      ],
      undefined,
      undefined,
      { classes: ["MAGE"] },
    );
    const program = createGrandArchiveMatchProgram([
      mageChampion,
      clericChampion,
      classLockedAction,
      classBonusAction,
      restrictedItem,
    ]);
    const player = (id: string, championDefinitionId: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: classLockedAction.canonicalId, count: 1 },
        { definitionId: classBonusAction.canonicalId, count: 1 },
        { definitionId: restrictedItem.canonicalId, count: 1 },
      ],
      materialDeck: [{ definitionId: championDefinitionId, count: 1 }],
      startingChampionDefinitionId: championDefinitionId,
    });
    const makeRuntime = (championDefinitionId: string, seed: number) => {
      const initial = createGrandArchiveMatchInitialState(program, {
        mode: "standard",
        players: [player("p1", championDefinitionId), player("p2", mageChampion.canonicalId)],
        firstPlayerId: "p1",
        randomSeed: seed,
      });
      const p1 = grandArchivePlayerId("p1");
      const owned = Object.values(initial.objects).filter((object) => object.ownerId === p1);
      const lockedId = owned.find(
        (object) => object.definitionId === classLockedAction.canonicalId,
      )!.id;
      const bonusId = owned.find(
        (object) => object.definitionId === classBonusAction.canonicalId,
      )!.id;
      const itemId = owned.find((object) => object.definitionId === restrictedItem.canonicalId)!.id;
      const positioned = new GrandArchiveTransactionKernel().transact(initial, [
        { type: "object-moved", objectId: lockedId, from: "main-deck", to: "hand" },
        { type: "object-moved", objectId: bonusId, from: "main-deck", to: "hand" },
        { type: "object-moved", objectId: itemId, from: "main-deck", to: "field" },
      ]).state;
      return {
        p1,
        lockedId,
        bonusId,
        itemId,
        championId: positioned.zones[p1].field.find(
          (objectId) => positioned.objects[objectId]?.definitionId === championDefinitionId,
        )!,
        runtime: new GrandArchiveMatchRuntime(program, positioned),
      };
    };
    const resolveCurrentTop = (runtime: GrandArchiveMatchRuntime) => {
      const stackItemId = runtime.state.stack.at(-1)?.id;
      if (!stackItemId) throw new Error("Expected a card activation to resolve");
      for (let passCount = 0; passCount < 4; passCount += 1) {
        if (!runtime.state.stack.some((item) => item.id === stackItemId)) return;
        const holderId = runtime.state.opportunity?.holderId;
        if (!holderId) throw new Error("Expected Opportunity before card resolution");
        const transition = runtime.execute({ move: "pass" }, { playerId: holderId });
        if (!transition.ok) throw new Error(transition.message);
      }
      throw new Error("Card activation did not resolve");
    };

    const mage = makeRuntime(mageChampion.canonicalId, 1515);
    const beforeLockedAttempt = mage.runtime.state;
    expect(
      mage.runtime.execute({ move: "activate-card", cardId: mage.lockedId }, { playerId: mage.p1 })
        .ok,
    ).toBe(false);
    expect(mage.runtime.state).toEqual(beforeLockedAttempt);
    expect(
      mage.runtime.execute({ move: "activate-card", cardId: mage.bonusId }, { playerId: mage.p1 })
        .ok,
    ).toBe(true);
    resolveCurrentTop(mage.runtime);
    expect(mage.runtime.state.objects[mage.championId]?.counters.buff).toBe(3);

    const cleric = makeRuntime(clericChampion.canonicalId, 1516);
    expect(
      cleric.runtime.execute(
        {
          move: "activate-ability",
          sourceId: cleric.itemId,
          abilityId: "restriction-item-a1",
        },
        { playerId: cleric.p1 },
      ).ok,
    ).toBe(false);
    expect(
      cleric.runtime.execute(
        { move: "activate-card", cardId: cleric.lockedId },
        { playerId: cleric.p1 },
      ).ok,
    ).toBe(true);
    resolveCurrentTop(cleric.runtime);
    expect(
      cleric.runtime.execute(
        { move: "activate-card", cardId: cleric.bonusId },
        { playerId: cleric.p1 },
      ).ok,
    ).toBe(true);
    resolveCurrentTop(cleric.runtime);
    expect(cleric.runtime.state.objects[cleric.championId]?.counters.buff).toBe(1);
  });

  it("keeps announced restrictions fixed and inherits resolution text granted while pending", () => {
    const mageChampion = card("pending-text-mage", "CHAMPION", [], 0, 20, {
      lineageName: "Pending Text",
      classes: ["MAGE"],
    });
    const clericUpgrade = card("pending-text-cleric", "CHAMPION", [], 1, 20, {
      lineageName: "Pending Text",
      classes: ["CLERIC"],
    });
    const action = card(
      "pending-text-action",
      "ACTION",
      [
        {
          id: "pendingTextAction-a1",
          kind: "card-resolution",
          text: "Put a buff counter on your champion.",
          effect: {
            kind: "add-counter",
            subject: { kind: "champion", player: "controller" },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "pendingTextAction-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Put two buff counters on your champion.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: { kind: "champion-matches-source", characteristic: "class" },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: { kind: "champion", player: "controller" },
            counter: "buff",
            amount: 2,
          },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 0 }, classes: ["MAGE"] },
    );
    const program = createGrandArchiveMatchProgram([mageChampion, clericUpgrade, action, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: action.canonicalId, count: id === "p1" ? 1 : 0 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: mageChampion.canonicalId, count: 1 },
        { definitionId: clericUpgrade.canonicalId, count: id === "p1" ? 1 : 0 },
      ],
      startingChampionDefinitionId: mageChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1517,
    });
    const p1 = grandArchivePlayerId("p1");
    const actionId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === action.canonicalId,
    )!.id;
    const clericUpgradeId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === clericUpgrade.canonicalId,
    )!.id;
    const championId = initial.zones[p1].field[0]!;
    const kernel = new GrandArchiveTransactionKernel();
    const positioned = kernel.transact(initial, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, positioned);
    const activation = runtime.execute(
      { move: "activate-card", cardId: actionId },
      { playerId: p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    expect(runtime.state.stack[0]).toMatchObject({
      announcedCardResolutionAbilities: [
        { ability: expect.objectContaining({ id: "pendingTextAction-a1" }), enabled: true },
        { ability: expect.objectContaining({ id: "pendingTextAction-a2" }), enabled: true },
      ],
    });

    const classChanged = kernel.transact(runtime.state, [
      {
        type: "champion-leveled-up",
        championId,
        cardId: clericUpgradeId,
        actorId: p1,
      },
    ]).state;
    const granted = executeGrandArchiveEffect(
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "pending-card" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "D", modifies: "ability" },
        change: {
          kind: "grant-ability",
          ability: {
            id: "pendingTextGranted-a1",
            kind: "card-resolution",
            text: "Put four buff counters on your champion.",
            effect: {
              kind: "add-counter",
              subject: { kind: "champion", player: "controller" },
              counter: "buff",
              amount: 4,
            },
          },
        },
      },
      {
        program,
        state: classChanged,
        controllerId: p1,
        sourceId: championId,
        abilityBearerId: championId,
        bindings: { "pending-card": [actionId] },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    const removed = executeGrandArchiveEffect(
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "pending-card" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "D", modifies: "ability" },
        change: {
          kind: "remove-abilities",
          filter: { abilityId: "pendingTextAction-a1" },
        },
      },
      {
        program,
        state: granted.state,
        controllerId: p1,
        sourceId: championId,
        abilityBearerId: championId,
        bindings: { "pending-card": [actionId] },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(removed.state))),
    );
    const resolving = new GrandArchiveMatchRuntime(program, restored);
    for (let passCount = 0; passCount < 4 && resolving.state.stack.length > 0; passCount += 1) {
      const holderId = resolving.state.opportunity?.holderId;
      if (!holderId) throw new Error("Expected Opportunity before pending card resolution");
      const transition = resolving.execute({ move: "pass" }, { playerId: holderId });
      if (!transition.ok) throw new Error(transition.message);
    }
    expect(resolving.state.stack).toEqual([]);
    expect(resolving.state.objects[championId]?.activeDefinitionId).toBe(clericUpgrade.canonicalId);
    expect(resolving.state.objects[championId]?.counters.buff).toBe(6);
  });

  it("advances activated Cascade before resolution, fixes mode targets, and resets by zone change", () => {
    const cascadeTarget = card("cascade-target", "ALLY", [], undefined, 3);
    const cascadeItem = card("cascade-item", "ITEM", [
      {
        id: "cascade-item-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        text: "Cascade",
        cascade: {
          kind: "cascade",
          advanceOn: "activation",
          tracking: {
            scope: "source-instance",
            includesCurrent: true,
            advancesIfStackEntryFailsToResolve: true,
          },
          copiedAbility: "repeat-pending-effect-without-advancing",
          modes: [
            {
              id: "cascade-1",
              text: "Put a buff counter on this.",
              counts: [1],
              effect: {
                kind: "add-counter",
                subject: { kind: "source" },
                counter: "buff",
                amount: 1,
              },
            },
            {
              id: "cascade-2",
              text: "Put two buff counters on target ally.",
              counts: [2],
              targets: [
                {
                  id: "cascade-ally",
                  kind: "target",
                  declared: "announcement",
                  chooser: "controller",
                  count: { kind: "exactly", amount: 1 },
                  unique: true,
                  candidates: {
                    kind: "object",
                    zones: ["field"],
                    filter: { kind: "type", oneOf: ["ALLY"] },
                  },
                },
              ],
              effect: {
                kind: "add-counter",
                subject: { kind: "bound", binding: "cascade-ally" },
                counter: "buff",
                amount: 2,
              },
            },
          ],
        },
      },
    ]);
    const program = createGrandArchiveMatchProgram([champion, cascadeItem, cascadeTarget]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: cascadeItem.canonicalId, count: 1 },
        { definitionId: cascadeTarget.canonicalId, count: 1 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1513,
    });
    const p1 = grandArchivePlayerId("p1");
    const owned = Object.values(initial.objects).filter((object) => object.ownerId === p1);
    const itemId = owned.find((object) => object.definitionId === cascadeItem.canonicalId)!.id;
    const targetId = owned.find((object) => object.definitionId === cascadeTarget.canonicalId)!.id;
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: itemId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: targetId, from: "main-deck", to: "field" },
    ]).state;
    let runtime = new GrandArchiveMatchRuntime(program, positioned);
    const activate = (targets?: Readonly<Record<string, readonly (typeof targetId)[]>>) =>
      runtime.execute(
        {
          move: "activate-ability",
          sourceId: itemId,
          abilityId: "cascade-item-a1",
          ...(targets ? { targets } : {}),
        },
        { playerId: p1 },
      );
    const resolveCurrentTop = () => {
      const stackItemId = runtime.state.stack.at(-1)?.id;
      if (!stackItemId) throw new Error("Expected a Cascade stack item");
      for (let passCount = 0; passCount < 4; passCount += 1) {
        if (!runtime.state.stack.some((item) => item.id === stackItemId)) return;
        const holderId = runtime.state.opportunity?.holderId;
        if (!holderId) throw new Error("Expected Opportunity for Cascade resolution");
        const transition = runtime.execute({ move: "pass" }, { playerId: holderId });
        if (!transition.ok) throw new Error(transition.message);
      }
      throw new Error("Cascade stack item did not resolve");
    };

    expect(activate().ok).toBe(true);
    expect(runtime.state.objects[itemId]?.cascadeCounts["cascade-item-a1"]).toBe(1);
    expect(runtime.state.stack.at(-1)?.selectedModeIds).toEqual(["cascade-1"]);
    runtime = new GrandArchiveMatchRuntime(program, {
      ...runtime.state,
      stack: runtime.state.stack.map((item) =>
        item.id === runtime.state.stack.at(-1)?.id ? { ...item, negated: true } : item,
      ),
    });
    resolveCurrentTop();
    expect(runtime.state.objects[itemId]?.counters.buff).toBeUndefined();
    expect(runtime.state.objects[itemId]?.cascadeCounts["cascade-item-a1"]).toBe(1);

    const beforeMissingTarget = runtime.state;
    expect(activate().ok).toBe(false);
    expect(runtime.state).toEqual(beforeMissingTarget);
    expect(activate({ "cascade-ally": [targetId] }).ok).toBe(true);
    expect(runtime.state.objects[itemId]?.cascadeCounts["cascade-item-a1"]).toBe(2);
    expect(runtime.state.stack.at(-1)?.selectedModeIds).toEqual(["cascade-2"]);
    resolveCurrentTop();
    expect(runtime.state.objects[targetId]?.counters.buff).toBe(2);

    const reset = new GrandArchiveTransactionKernel().transact(runtime.state, [
      { type: "object-moved", objectId: itemId, from: "field", to: "graveyard" },
      { type: "object-moved", objectId: itemId, from: "graveyard", to: "field" },
    ]).state;
    expect(reset.objects[itemId]?.cascadeCounts).toEqual({});
    runtime = new GrandArchiveMatchRuntime(program, reset);
    expect(activate().ok).toBe(true);
    expect(runtime.state.stack.at(-1)?.selectedModeIds).toEqual(["cascade-1"]);
  });

  it("numbers simultaneous triggered Cascade instances before they enter the Effects Stack", () => {
    const enteringAlly = card("cascade-entering-ally", "ALLY", [], undefined, 2);
    const cascadeWatcher = card("cascade-watcher", "ITEM", [
      {
        id: "cascade-watcher-a1",
        kind: "triggered",
        text: "Whenever an ally enters, cascade.",
        trigger: {
          kind: "event",
          event: {
            name: "object-entered-field",
            subject: {
              kind: "event-object",
              filter: { kind: "type", oneOf: ["ALLY"] },
            },
          },
        },
        cascade: {
          kind: "cascade",
          advanceOn: "trigger",
          tracking: {
            scope: "source-instance",
            includesCurrent: true,
            advancesIfStackEntryFailsToResolve: true,
          },
          copiedAbility: "repeat-pending-effect-without-advancing",
          modes: [
            {
              id: "cascade-1",
              text: "Put a buff counter on this.",
              counts: [1],
              effect: {
                kind: "add-counter",
                subject: { kind: "source" },
                counter: "buff",
                amount: 1,
              },
            },
            {
              id: "cascade-2",
              text: "Put a debuff counter on this.",
              counts: [2],
              effect: {
                kind: "add-counter",
                subject: { kind: "source" },
                counter: "debuff",
                amount: 1,
              },
            },
          ],
        },
      },
    ]);
    const program = createGrandArchiveMatchProgram([champion, enteringAlly, cascadeWatcher]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: enteringAlly.canonicalId, count: 2 },
        { definitionId: cascadeWatcher.canonicalId, count: 1 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1514,
    });
    const p1 = grandArchivePlayerId("p1");
    const owned = Object.values(initial.objects).filter((object) => object.ownerId === p1);
    const watcherId = owned.find(
      (object) => object.definitionId === cascadeWatcher.canonicalId,
    )!.id;
    const allyIds = owned
      .filter((object) => object.definitionId === enteringAlly.canonicalId)
      .map((object) => object.id);
    const kernel = new GrandArchiveTransactionKernel();
    const positioned = kernel.transact(initial, [
      { type: "object-moved", objectId: watcherId, from: "main-deck", to: "field" },
    ]).state;
    const entered = kernel.transact(
      positioned,
      allyIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "field" as const,
      })),
    );
    const triggerEvents = collectGrandArchiveTriggeredAbilityEvents(
      program,
      entered.state,
      entered.result.events,
    );
    const pendingModes = triggerEvents.flatMap((event) =>
      event.type === "pending-trigger-added" ? [event.trigger.selectedModeIds] : [],
    );
    expect(pendingModes).toEqual([["cascade-1"], ["cascade-2"]]);
    const triggered = kernel.transact(entered.state, triggerEvents).state;
    expect(triggered.objects[watcherId]?.cascadeCounts["cascade-watcher-a1"]).toBe(2);
  });

  it("gains Agility, triggers on the gain, and returns as many memory cards as possible", () => {
    const agilityItem = card("agility-item", "ITEM", [
      {
        id: "agility-item-a1",
        kind: "activated",
        activation: "ability",
        cost: { kind: "pay-reserve", amount: 0 },
        text: "You gain agility 3 for this turn.",
        effect: {
          kind: "set-player-state",
          player: "controller",
          state: "agility",
          value: true,
          amount: 3,
          duration: { kind: "this-turn" },
        },
      },
      {
        id: "agility-item-a2",
        kind: "triggered",
        text: "Whenever you gain agility, put a gained counter on this item.",
        trigger: {
          kind: "event",
          event: {
            name: "player-state-changed",
            actor: "controller",
            state: "agility",
            to: true,
          },
        },
        effect: {
          kind: "add-counter",
          subject: { kind: "source" },
          counter: { named: "agility-gained" },
          amount: 1,
        },
      },
    ]);
    const program = createGrandArchiveMatchProgram([champion, agilityItem, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: actionA.canonicalId, count: 4 }],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: agilityItem.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1507,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === agilityItem.canonicalId,
    )!.id;
    const memoryIds = initial.zones[p1]["main-deck"].slice(0, 2);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
      ...memoryIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "memory" as const,
      })),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "activate-ability", sourceId, abilityId: "agility-item-a1" },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.players[p1]?.states.agility).toBe(true);
    expect(runtime.state.delayedTriggers).toHaveLength(1);
    expect(runtime.state.stack.at(-1)?.kind).toBe("triggered-ability");

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[sourceId]?.counters["named:agility-gained"]).toBe(1);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.turn.phase).toBe("end");
    expect(runtime.state.stack.at(-1)?.kind).toBe("triggered-ability");

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected Agility's memory-return decision");
    }
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: memoryIds,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(memoryIds.every((cardId) => runtime.state.objects[cardId]?.zone === "hand")).toBe(true);
    expect(runtime.state.zones[p1].memory).toHaveLength(0);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.players[p1]?.states.agility).toBe(false);
    expect(runtime.state.turn.playerId).toBe(p2);
  });

  it("credits the combat participant that marks lethal damage for On Kill", () => {
    const killingAttacker = card("on-kill-attacker", "ALLY", [], undefined, 8, { power: 2 });
    const killingWeapon = card(
      "on-kill-weapon",
      "WEAPON",
      [
        {
          id: "onKillWeapon-a1",
          kind: "triggered",
          text: "On Kill: Put a trophy counter on this weapon.",
          trigger: {
            kind: "event",
            event: { name: "object-killed", subject: { kind: "source" } },
          },
          effect: {
            kind: "add-counter",
            subject: { kind: "source" },
            counter: { named: "trophy" },
            amount: 1,
          },
        },
      ],
      undefined,
      undefined,
      { supertypes: ["REGALIA"], power: 3, durability: 2 },
    );
    const killedDefender = card("on-kill-defender", "ALLY", [], undefined, 3, { power: 0 });
    const program = createGrandArchiveMatchProgram([
      champion,
      killingAttacker,
      killingWeapon,
      killedDefender,
      actionA,
    ]);
    const combatPlayer = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: killingAttacker.canonicalId, count: 1 },
        { definitionId: killedDefender.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: killingWeapon.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [combatPlayer("p1"), combatPlayer("p2")],
      firstPlayerId: "p1",
      randomSeed: 1501,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const find = (ownerId: typeof p1, definitionId: string) =>
      Object.values(initial.objects).find(
        (object) => object.ownerId === ownerId && object.definitionId === definitionId,
      )!.id;
    const attackerId = initial.zones[p1].field[0]!;
    const weaponId = find(p1, killingWeapon.canonicalId);
    const defenderId = find(p2, killedDefender.canonicalId);
    const moved = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: weaponId,
        from: "material-deck",
        to: "field",
        initialCounters: { durability: 2 },
      },
      { type: "object-moved", objectId: defenderId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, {
      ...moved,
      players: {
        ...moved.players,
        [p1]: { ...moved.players[p1]!, hasTakenFirstTurn: true },
      },
    });

    expect(
      runtime.execute(
        {
          move: "declare-attack",
          attackerId,
          targetIds: [defenderId],
          weaponIds: [weaponId],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[defenderId]?.zone).toBe("graveyard");
    expect(runtime.state.stack.at(-1)?.sourceId).toBe(weaponId);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[weaponId]?.counters["named:trophy"]).toBe(1);
  });

  it("expands every grouped Vigor instance into a separate end-phase trigger", () => {
    const vigorousAlly = card(
      "vigorous-ally",
      "ALLY",
      [
        {
          id: "vigorousAlly-a1",
          kind: "keyword-group",
          text: "Taunt, Vigor, Vigor",
          keywords: [{ name: "taunt" }, { name: "vigor" }, { name: "vigor" }],
        },
      ],
      undefined,
      6,
      { power: 2 },
    );
    const program = createGrandArchiveMatchProgram([champion, vigorousAlly, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: vigorousAlly.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1502,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const allyId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === vigorousAlly.canonicalId,
    )!.id;
    const moved = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
      { type: "object-state-changed", objectId: allyId, state: "rested", value: true },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, {
      ...moved,
      players: {
        ...moved.players,
        [p1]: { ...moved.players[p1]!, hasTakenFirstTurn: true },
      },
    });

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.turn.phase).toBe("end");
    const ordering = runtime.state.decision;
    if (!ordering || ordering.kind !== "order-triggered-abilities") {
      throw new Error("Expected separate Vigor triggers to require ordering");
    }
    expect(ordering.pendingTriggerIds).toHaveLength(2);
    expect(new Set(runtime.state.pendingTriggers.map((trigger) => trigger.id)).size).toBe(2);
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: ordering.id,
          stateVersion: ordering.stateVersion,
          answer: ordering.pendingTriggerIds,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.stack).toHaveLength(2);
    expect(runtime.state.stack.every((item) => item.sourceId === allyId)).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[allyId]?.states.has("rested")).toBe(false);
  });

  it("fosters an undamaged ally at recollection and emits its On Foster trigger", () => {
    const fosterAlly = card(
      "foster-ally",
      "ALLY",
      [
        {
          id: "fosterAlly-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Foster",
          keyword: { name: "foster" },
        },
        {
          id: "fosterAlly-a2",
          kind: "triggered",
          text: "On Foster: Put a training counter on this ally.",
          trigger: {
            kind: "event",
            event: { name: "object-fostered", subject: { kind: "source" } },
          },
          effect: {
            kind: "add-counter",
            subject: { kind: "source" },
            counter: { named: "training" },
            amount: 1,
          },
        },
      ],
      undefined,
      5,
      { power: 1 },
    );
    const program = createGrandArchiveMatchProgram([champion, fosterAlly, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: fosterAlly.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1503,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const allyId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === fosterAlly.canonicalId,
    )!.id;
    const moved = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, {
      ...moved,
      turn: { ...moved.turn, phase: "materialize", materializeChoicePending: true },
      opportunity: null,
      players: {
        ...moved.players,
        [p1]: { ...moved.players[p1]!, hasTakenFirstTurn: true },
      },
    });

    expect(runtime.execute({ move: "skip-materialization" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.state.turn.phase).toBe("recollection");
    expect(runtime.state.stack.at(-1)?.sourceId).toBe(allyId);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[allyId]?.states.has("fostered")).toBe(true);
    expect(runtime.state.stack.at(-1)?.sourceId).toBe(allyId);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[allyId]?.counters["named:training"]).toBe(1);
  });

  it("resolves Cleave against a snapshot of one player's attackable objects", () => {
    const cleavingAttacker = card(
      "cleaving-attacker",
      "ALLY",
      [
        {
          id: "cleavingAttacker-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Damage 20+] Cleave",
          keyword: { name: "cleave" },
          restrictions: [
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: { kind: "champion", player: "controller" },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: { kind: "champion", player: "controller" },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 20,
                },
              },
            },
          ],
        },
      ],
      undefined,
      10,
      { power: 3 },
    );
    const firstDefender = card(
      "cleave-defender-one",
      "ALLY",
      [
        {
          id: "cleaveDefenderOne-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept",
          keyword: { name: "intercept" },
        },
      ],
      undefined,
      8,
      { power: 1 },
    );
    const secondDefender = card("cleave-defender-two", "ALLY", [], undefined, 8, { power: 2 });
    const cleaveWeapon = card("cleave-weapon", "WEAPON", [], undefined, undefined, {
      supertypes: ["REGALIA"],
      power: 1,
      durability: 2,
    });
    const cards = [
      champion,
      cleavingAttacker,
      firstDefender,
      secondDefender,
      cleaveWeapon,
      actionA,
    ] as const;
    const program = createGrandArchiveMatchProgram(cards);
    const combatPlayer = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: cleavingAttacker.canonicalId, count: 1 },
        { definitionId: firstDefender.canonicalId, count: 1 },
        { definitionId: secondDefender.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 1 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: cleaveWeapon.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [combatPlayer("p1"), combatPlayer("p2")],
      firstPlayerId: "p1",
      randomSeed: 151,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const find = (ownerId: typeof p1, definitionId: string) =>
      Object.values(initial.objects).find(
        (object) => object.ownerId === ownerId && object.definitionId === definitionId,
      )!.id;
    const attackerId = find(p1, cleavingAttacker.canonicalId);
    const firstDefenderId = find(p2, firstDefender.canonicalId);
    const secondDefenderId = find(p2, secondDefender.canonicalId);
    const weaponId = find(p1, cleaveWeapon.canonicalId);
    const attackingChampionId = initial.zones[p1].field[0]!;
    const championId = initial.zones[p2].field[0]!;
    const moved = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: attackerId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: firstDefenderId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: secondDefenderId, from: "main-deck", to: "field" },
      {
        type: "object-moved",
        objectId: weaponId,
        from: "material-deck",
        to: "field",
        initialCounters: { durability: 2 },
      },
    ]).state;
    const prepared = {
      ...moved,
      players: {
        ...moved.players,
        [p1]: { ...moved.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const restrictedRuntime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      restrictedRuntime.execute(
        {
          move: "declare-attack",
          attackerId,
          targetIds: [],
          cleavePlayerId: p2,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    const enabled = new GrandArchiveTransactionKernel().transact(prepared, [
      {
        type: "damage-marked",
        objectId: attackingChampionId,
        amount: 20,
        cause: { kind: "rule", rule: "test-damage-threshold" },
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, enabled);
    expect(
      listGrandArchiveLegalCommands(program, enabled, p1).some(
        (candidate) =>
          candidate.command.move === "declare-attack" &&
          candidate.command.attackerId === attackerId &&
          candidate.command.cleavePlayerId === p2,
      ),
    ).toBe(true);

    expect(
      runtime.execute(
        {
          move: "declare-attack",
          attackerId,
          targetIds: [],
          cleavePlayerId: p2,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(new Set(runtime.state.combat?.targetIds)).toEqual(
      new Set([championId, firstDefenderId, secondDefenderId]),
    );
    expect(runtime.state.stack).toHaveLength(0);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const retaliation = runtime.state.decision;
    if (!retaliation || retaliation.kind !== "choose-retaliators") {
      throw new Error("Expected Cleave retaliation decision");
    }
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: retaliation.id,
          stateVersion: retaliation.stateVersion,
          answer: [firstDefenderId, secondDefenderId],
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const order = runtime.state.decision;
    if (!order || order.kind !== "order-retaliation-damage") {
      throw new Error("Expected retaliation damage order decision");
    }
    const invalidOrder = runtime.execute(
      {
        move: "answer-decision",
        decisionId: order.id,
        stateVersion: order.stateVersion,
        answer: [firstDefenderId, firstDefenderId],
      },
      { playerId: p1 },
    );
    expect(invalidOrder.ok).toBe(false);
    const damage = runtime.execute(
      {
        move: "answer-decision",
        decisionId: order.id,
        stateVersion: order.stateVersion,
        answer: [secondDefenderId, firstDefenderId],
      },
      { playerId: p1 },
    );
    expect(damage.ok).toBe(true);
    if (!damage.ok) throw new Error(damage.message);
    expect(
      damage.events
        .filter(
          (event) =>
            event.type === "damage-marked" &&
            event.objectId === attackerId &&
            event.cause?.kind === "rule" &&
            event.cause.rule === "retaliation-combat-damage",
        )
        .map((event) => (event.type === "damage-marked" ? event.sourceId : undefined)),
    ).toEqual([secondDefenderId, firstDefenderId]);
    expect(runtime.state.objects[attackerId]?.damage).toBe(3);
    expect(runtime.state.objects[championId]?.damage).toBe(3);
    expect(runtime.state.objects[firstDefenderId]?.damage).toBe(3);
    expect(runtime.state.objects[secondDefenderId]?.damage).toBe(3);
    expect(runtime.state.objects[weaponId]?.counters.durability).toBe(2);
    expect(runtime.state.combat).toBeNull();
  });

  it("allows Multistrike to add its exact number of unique targets", () => {
    const multistrikeAttacker = card(
      "multistrike-attacker",
      "ALLY",
      [
        {
          id: "multistrikeAttacker-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Multistrike 2",
          keyword: { name: "multistrike", value: 2 },
        },
      ],
      undefined,
      8,
      { power: 3 },
    );
    const targetOne = card("multistrike-target-one", "ALLY", [], undefined, 8);
    const targetTwo = card("multistrike-target-two", "ALLY", [], undefined, 8);
    const program = createGrandArchiveMatchProgram([
      champion,
      multistrikeAttacker,
      targetOne,
      targetTwo,
      actionA,
    ]);
    const combatPlayer = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: multistrikeAttacker.canonicalId, count: 1 },
        { definitionId: targetOne.canonicalId, count: 1 },
        { definitionId: targetTwo.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 1 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [combatPlayer("p1"), combatPlayer("p2")],
      firstPlayerId: "p1",
      randomSeed: 157,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const find = (ownerId: typeof p1, definitionId: string) =>
      Object.values(initial.objects).find(
        (object) => object.ownerId === ownerId && object.definitionId === definitionId,
      )!.id;
    const attackerId = find(p1, multistrikeAttacker.canonicalId);
    const targetOneId = find(p2, targetOne.canonicalId);
    const targetTwoId = find(p2, targetTwo.canonicalId);
    const championId = initial.zones[p2].field[0]!;
    const moved = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: attackerId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: targetOneId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: targetTwoId, from: "main-deck", to: "field" },
    ]).state;
    const prepared = {
      ...moved,
      players: {
        ...moved.players,
        [p1]: { ...moved.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        {
          move: "declare-attack",
          attackerId,
          targetIds: [championId, targetOneId, targetTwoId, find(p2, actionA.canonicalId)],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(
      runtime.execute(
        {
          move: "declare-attack",
          attackerId,
          targetIds: [championId, targetOneId, targetOneId],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(
      runtime.execute(
        {
          move: "declare-attack",
          attackerId,
          targetIds: [championId, targetOneId, targetTwoId],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.combat?.targetIds).toEqual([championId, targetOneId, targetTwoId]);
  });

  it("collects Pantheon retaliators in turn order before the attacker orders their damage", () => {
    const sweepingAttacker = card(
      "pantheon-sweeping-attacker",
      "ALLY",
      [
        {
          id: "pantheonSweepingAttacker-a1",
          kind: "keyword-group",
          text: "Cleave; Multistrike 1",
          keywords: [{ name: "cleave" }, { name: "multistrike", value: 1 }],
        },
      ],
      undefined,
      12,
      { power: 4 },
    );
    const defender = card("pantheon-retaliator", "ALLY", [], undefined, 9, { power: 2 });
    const ambusher = card(
      "pantheon-ambusher",
      "ALLY",
      [
        {
          id: "pantheonAmbusher-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ambush",
          keyword: { name: "ambush" },
        },
      ],
      undefined,
      9,
      { power: 3 },
    );
    const program = createGrandArchiveMatchProgram([
      champion,
      sweepingAttacker,
      defender,
      ambusher,
      actionA,
      lesserBoon,
      greaterBoon,
      barrier,
    ]);
    const combatPlayer = (id: string): GrandArchivePantheonPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: sweepingAttacker.canonicalId, count: 1 },
        { definitionId: defender.canonicalId, count: 1 },
        { definitionId: ambusher.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 1 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
      pantheon: {
        lesserBoonDefinitionId: lesserBoon.canonicalId,
        greaterBoonDefinitionId: greaterBoon.canonicalId,
        barrierDefinitionId: barrier.canonicalId,
      },
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "pantheon",
      players: [combatPlayer("p1"), combatPlayer("p2"), combatPlayer("p3")],
      firstPlayerId: "p1",
      randomSeed: 163,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const p3 = grandArchivePlayerId("p3");
    const find = (ownerId: typeof p1, definitionId: string) =>
      Object.values(initial.objects).find(
        (object) => object.ownerId === ownerId && object.definitionId === definitionId,
      )!.id;
    const attackerId = find(p1, sweepingAttacker.canonicalId);
    const p2DefenderId = find(p2, defender.canonicalId);
    const p3DefenderId = find(p3, defender.canonicalId);
    const p3AmbusherId = find(p3, ambusher.canonicalId);
    const moved = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: attackerId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: p2DefenderId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: p3DefenderId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: p3AmbusherId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, {
      ...moved,
      players: {
        ...moved.players,
        [p1]: { ...moved.players[p1]!, hasTakenFirstTurn: true },
      },
    });
    expect(
      runtime.execute(
        {
          move: "declare-attack",
          attackerId,
          targetIds: [p3DefenderId],
          cleavePlayerId: p2,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p3 }).ok).toBe(true);
    const p2Retaliation = runtime.state.decision;
    if (!p2Retaliation || p2Retaliation.kind !== "choose-retaliators") {
      throw new Error("Expected the first Pantheon retaliation decision");
    }
    expect(p2Retaliation.playerId).toBe(p2);
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: p2Retaliation.id,
          stateVersion: p2Retaliation.stateVersion,
          answer: [p2DefenderId],
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    const p3Retaliation = runtime.state.decision;
    if (!p3Retaliation || p3Retaliation.kind !== "choose-retaliators") {
      throw new Error("Expected the second Pantheon retaliation decision");
    }
    expect(p3Retaliation.playerId).toBe(p3);
    expect(p3Retaliation.selectedRetaliatorIds).toEqual([p2DefenderId]);
    expect(p3Retaliation.candidates).toEqual(expect.arrayContaining([p3DefenderId, p3AmbusherId]));
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: p3Retaliation.id,
          stateVersion: p3Retaliation.stateVersion,
          answer: [p3AmbusherId],
        },
        { playerId: p3 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p3 }).ok).toBe(true);
    const order = runtime.state.decision;
    if (!order || order.kind !== "order-retaliation-damage") {
      throw new Error("Expected Pantheon retaliation order decision");
    }
    expect(order.playerId).toBe(p1);
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: order.id,
          stateVersion: order.stateVersion,
          answer: [p3AmbusherId, p2DefenderId],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[attackerId]?.damage).toBe(5);
    expect(runtime.state.objects[p2DefenderId]?.damage).toBe(4);
    expect(runtime.state.objects[p3DefenderId]?.damage).toBe(4);
    expect(runtime.state.objects[p3AmbusherId]?.damage).toBe(0);
    expect(runtime.state.combat).toBeNull();
  });

  it("Preserves a resolving non-object, reveals it publicly, and returns it instead of materializing", () => {
    const preserveAction = card(
      "preserve-action",
      "ACTION",
      [
        {
          id: "preserveAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Preserve",
          keyword: { name: "preserve" },
        },
        {
          id: "preserveAction-a2",
          kind: "card-resolution",
          text: "Draw a card.",
          effect: { kind: "draw", player: "controller", amount: 1 },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 0 }, subtypes: ["SPELL"] },
    );
    const intendedRegalia = card("preserve-intended-regalia", "ITEM", [], undefined, undefined, {
      cost: { kind: "memory", amount: 99 },
      supertypes: ["REGALIA"],
    });
    const program = createGrandArchiveMatchProgram([
      champion,
      preserveAction,
      intendedRegalia,
      actionA,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: preserveAction.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: intendedRegalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1601,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const preserveId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === preserveAction.canonicalId,
    )!.id;
    const preserveObject = initial.objects[preserveId]!;
    const prepared =
      preserveObject.zone === "hand"
        ? initial
        : new GrandArchiveTransactionKernel().transact(initial, [
            {
              type: "object-moved",
              objectId: preserveId,
              from: preserveObject.zone,
              to: "hand",
            },
          ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(
      runtime.execute({ move: "activate-card", cardId: preserveId }, { playerId: p1 }).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[preserveId]?.zone).toBe("material-deck");
    expect(runtime.state.objects[preserveId]?.states.has("preserved")).toBe(true);
    expect(runtime.state.objects[preserveId]?.facing).toBe("face-up");

    const opponentMaterialDeck = projectGrandArchiveViewerState(
      program,
      runtime.state,
      p2,
    ).players.find((viewer) => viewer.id === p1)!.zones["material-deck"];
    expect(opponentMaterialDeck.visibility).toBe("hidden");
    if (opponentMaterialDeck.visibility !== "hidden") {
      throw new Error("Expected the opposing material deck to remain a private zone");
    }
    expect(opponentMaterialDeck.revealedObjects.map((object) => object.id)).toContain(preserveId);

    const materializeState = {
      ...runtime.state,
      opportunity: null,
      turn: {
        ...runtime.state.turn,
        phase: "materialize" as const,
        materializeChoicePending: true,
      },
      players: {
        ...runtime.state.players,
        [p1]: { ...runtime.state.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const materializeRuntime = new GrandArchiveMatchRuntime(program, materializeState);
    const preserveCommands = listGrandArchiveLegalCommands(program, materializeState, p1).filter(
      (candidate) => candidate.command.move === "return-preserved-card",
    );
    expect(preserveCommands).toHaveLength(1);
    expect(preserveCommands[0]?.command).toMatchObject({
      move: "return-preserved-card",
      cardId: preserveId,
    });
    const preserveCommand = preserveCommands[0]?.command;
    if (!preserveCommand || preserveCommand.move !== "return-preserved-card") {
      throw new Error("Expected an executable Preserve replacement");
    }
    const preservedResult = materializeRuntime.execute(preserveCommand, { playerId: p1 });
    expect(preservedResult.ok).toBe(true);
    expect(
      preservedResult.ok
        ? preservedResult.events.some((event) => event.type === "card-revealed")
        : true,
    ).toBe(false);
    expect(materializeRuntime.state.objects[preserveId]?.zone).toBe("hand");
    expect(materializeRuntime.state.objects[preserveId]?.states.has("preserved")).toBe(false);
    expect(materializeRuntime.state.objects[preserveId]?.facing).toBe("face-down");
    expect(materializeRuntime.state.turn.phase).toBe("materialize");
    expect(
      materializeRuntime.execute(
        {
          move: "return-preserved-card",
          cardId: preserveId,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(materializeRuntime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(materializeRuntime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(materializeRuntime.state.turn.phase).toBe("recollection");
  });

  it("treats sacrifice and lethal damage as destruction for object Preserve", () => {
    const preserveAlly = card(
      "preserve-ally",
      "ALLY",
      [
        {
          id: "preserveAlly-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Preserve",
          keyword: { name: "preserve" },
        },
        {
          id: "preserveAlly-a2",
          kind: "activated",
          activation: "ability",
          text: "Sacrifice this: Draw a card.",
          cost: { kind: "sacrifice", subject: { kind: "source" } },
          effect: { kind: "draw", player: "controller", amount: 1 },
        },
      ],
      undefined,
      2,
      { power: 1 },
    );
    const program = createGrandArchiveMatchProgram([champion, preserveAlly, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: preserveAlly.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1602,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const allyId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === preserveAlly.canonicalId,
    )!.id;
    const ally = initial.objects[allyId]!;
    const onField = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: allyId, from: ally.zone, to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, onField);

    expect(
      runtime.execute(
        { move: "activate-ability", sourceId: allyId, abilityId: "preserveAlly-a2" },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[allyId]?.zone).toBe("graveyard");
    const preserveItem = runtime.state.stack.at(-1);
    expect(preserveItem?.kind === "triggered-ability" ? preserveItem.ability.id : undefined).toBe(
      "preserveAlly-a1",
    );
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[allyId]?.zone).toBe("material-deck");
    expect(runtime.state.objects[allyId]?.states.has("preserved")).toBe(true);

    const lethalState = new GrandArchiveTransactionKernel().transact(onField, [
      {
        type: "object-moved",
        objectId: allyId,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "lethal-damage-state-check" },
      },
    ]);
    const lethalTriggers = collectGrandArchiveTriggeredAbilityEvents(
      program,
      lethalState.state,
      lethalState.result.events,
    );
    expect(lethalTriggers.some((event) => event.type === "pending-trigger-added")).toBe(true);

    const banishedState = new GrandArchiveTransactionKernel().transact(onField, [
      { type: "object-moved", objectId: allyId, from: "field", to: "banishment" },
    ]);
    expect(
      collectGrandArchiveTriggeredAbilityEvents(
        program,
        banishedState.state,
        banishedState.result.events,
      ),
    ).toEqual([]);
  });

  it("asks whether a memory-paid non-object with Preserve is Preserved or banished", () => {
    const memoryPreserve = card(
      "memory-preserve",
      "ACTION",
      [
        {
          id: "memoryPreserve-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Preserve",
          keyword: { name: "preserve" },
        },
        {
          id: "memoryPreserve-a2",
          kind: "card-resolution",
          text: "Draw a card.",
          effect: { kind: "draw", player: "controller", amount: 1 },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "memory", amount: 0 }, subtypes: ["SPELL"] },
    );
    const program = createGrandArchiveMatchProgram([champion, memoryPreserve, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: memoryPreserve.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const runChoice = (preserve: boolean) => {
      const initial = createGrandArchiveMatchInitialState(program, {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: preserve ? 1603 : 1604,
      });
      const p1 = grandArchivePlayerId("p1");
      const p2 = grandArchivePlayerId("p2");
      const cardId = Object.values(initial.objects).find(
        (object) => object.ownerId === p1 && object.definitionId === memoryPreserve.canonicalId,
      )!.id;
      const source = initial.objects[cardId]!;
      const prepared =
        source.zone === "hand"
          ? initial
          : new GrandArchiveTransactionKernel().transact(initial, [
              { type: "object-moved", objectId: cardId, from: source.zone, to: "hand" },
            ]).state;
      const runtime = new GrandArchiveMatchRuntime(program, prepared);
      expect(runtime.execute({ move: "activate-card", cardId }, { playerId: p1 }).ok).toBe(true);
      expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
      expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
      const decision = runtime.state.decision;
      if (!decision || decision.kind !== "choose-preserve-destination") {
        throw new Error("Expected the Preserve destination decision");
      }
      expect(
        runtime.execute(
          {
            move: "answer-decision",
            decisionId: decision.id,
            stateVersion: decision.stateVersion,
            answer: preserve,
          },
          { playerId: p1 },
        ).ok,
      ).toBe(true);
      return runtime.state.objects[cardId]!;
    };

    const preserved = runChoice(true);
    expect(preserved.zone).toBe("material-deck");
    expect(preserved.states.has("preserved")).toBe(true);
    expect(preserved.facing).toBe("face-up");
    const banished = runChoice(false);
    expect(banished.zone).toBe("banishment");
    expect(banished.states.has("preserved")).toBe(false);
  });

  it("activates an Action from the graveyard for its Ephemerate cost and persists Ephemeral", () => {
    const ephemeralAction = card(
      "ephemeral-action",
      "ACTION",
      [
        {
          id: "ephemeralAction-a1",
          kind: "card-resolution",
          text: "Draw a card.",
          effect: { kind: "draw", player: "controller", amount: 1 },
        },
        {
          id: "ephemeralAction-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (2)",
          keyword: { name: "ephemerate", cost: { kind: "pay-reserve", amount: 2 } },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 7 } },
    );
    const program = createGrandArchiveMatchProgram([champion, ephemeralAction, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: ephemeralAction.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 4 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1701,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const actionId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === ephemeralAction.canonicalId,
    )!.id;
    const paymentIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === actionA.canonicalId)
      .slice(0, 2)
      .map((object) => object.id);
    const setupEvents = [
      ...(initial.objects[actionId]?.zone === "graveyard"
        ? []
        : [
            {
              type: "object-moved" as const,
              objectId: actionId,
              from: initial.objects[actionId]!.zone,
              to: "graveyard" as const,
            },
          ]),
      ...paymentIds.flatMap((objectId) =>
        initial.objects[objectId]?.zone === "hand"
          ? []
          : [
              {
                type: "object-moved" as const,
                objectId,
                from: initial.objects[objectId]!.zone,
                to: "hand" as const,
              },
            ],
      ),
    ];
    const prepared = new GrandArchiveTransactionKernel().transact(initial, setupEvents).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(runtime.execute({ move: "activate-card", cardId: actionId }, { playerId: p1 }).ok).toBe(
      false,
    );
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: actionId,
          activationMethod: "ephemerate",
          reservePayment: paymentIds.map((cardId) => ({ kind: "card", cardId })),
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[actionId]?.zone).toBe("effects-stack");
    expect(runtime.state.objects[actionId]?.states.has("ephemeral")).toBe(true);
    expect(runtime.state.stack.at(-1)?.activationStates).toContain("ephemeral");
    expect(paymentIds.every((objectId) => runtime.state.objects[objectId]?.zone === "memory")).toBe(
      true,
    );

    const movementKernel = new GrandArchiveTransactionKernel({
      collectReplacements: (current, event) =>
        collectGrandArchiveReplacementCandidates(program, current, event),
      chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
    });
    const movedOffStack = movementKernel.transact(runtime.state, [
      {
        type: "object-moved",
        objectId: actionId,
        from: "effects-stack",
        to: "graveyard",
      },
    ]).state;
    expect(movedOffStack.objects[actionId]?.zone).toBe("banishment");

    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      serializeGrandArchiveMatchSnapshot(runtime.state),
    );
    expect(restored.objects[actionId]?.states.has("ephemeral")).toBe(true);
    expect(restored.stack.at(-1)?.activationStates).toContain("ephemeral");
    const restoredRuntime = new GrandArchiveMatchRuntime(program, restored);
    expect(restoredRuntime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(restoredRuntime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(restoredRuntime.state.objects[actionId]?.zone).toBe("banishment");
    expect(restoredRuntime.state.objects[actionId]?.states.has("ephemeral")).toBe(false);
  });

  it("makes an Ephemerated object Ephemeral only as it enters and banishes it when it leaves", () => {
    const ephemeralAlly = card(
      "ephemeral-ally",
      "ALLY",
      [
        {
          id: "ephemeralAlly-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (1)",
          keyword: { name: "ephemerate", cost: { kind: "pay-reserve", amount: 1 } },
        },
        {
          id: "ephemeralAlly-a2",
          kind: "activated",
          activation: "ability",
          text: "Sacrifice this: Draw a card.",
          cost: { kind: "sacrifice", subject: { kind: "source" } },
          effect: { kind: "draw", player: "controller", amount: 1 },
        },
      ],
      undefined,
      2,
      { cost: { kind: "reserve", amount: 4 }, power: 2 },
    );
    const program = createGrandArchiveMatchProgram([champion, ephemeralAlly, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: ephemeralAlly.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 4 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1702,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const allyId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === ephemeralAlly.canonicalId,
    )!.id;
    const paymentId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === actionA.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: allyId,
        from: initial.objects[allyId]!.zone,
        to: "graveyard",
      },
      ...(initial.objects[paymentId]?.zone === "hand"
        ? []
        : [
            {
              type: "object-moved" as const,
              objectId: paymentId,
              from: initial.objects[paymentId]!.zone,
              to: "hand" as const,
            },
          ]),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: allyId,
          activationMethod: "ephemerate",
          reservePayment: [{ kind: "card", cardId: paymentId }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[allyId]?.states.has("ephemeral")).toBe(false);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[allyId]?.zone).toBe("field");
    expect(runtime.state.objects[allyId]?.states.has("ephemeral")).toBe(true);
    expect(
      runtime.execute(
        { move: "activate-ability", sourceId: allyId, abilityId: "ephemeralAlly-a2" },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[allyId]?.zone).toBe("banishment");
    expect(runtime.state.objects[allyId]?.states.has("ephemeral")).toBe(false);
  });

  it("carries an Ephemerated Attack into Intent and banishes it during combat cleanup", () => {
    const ephemeralAttack = card(
      "ephemeral-attack",
      "ATTACK",
      [
        {
          id: "ephemeralAttack-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (0)",
          keyword: { name: "ephemerate", cost: { kind: "pay-reserve", amount: 0 } },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 3 }, power: 3 },
    );
    const program = createGrandArchiveMatchProgram([champion, ephemeralAttack, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: ephemeralAttack.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1703,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attackId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === ephemeralAttack.canonicalId,
    )!.id;
    const attackerId = initial.zones[p1].field[0]!;
    const targetId = initial.zones[p2].field[0]!;
    const moved = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: attackId,
        from: initial.objects[attackId]!.zone,
        to: "graveyard",
      },
    ]).state;
    const prepared = {
      ...moved,
      players: {
        ...moved.players,
        [p1]: { ...moved.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: attackId,
          attackAttackerId: attackerId,
          activationMethod: "ephemerate",
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[attackId]?.states.has("ephemeral")).toBe(false);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const declaration = runtime.state.decision;
    if (!declaration || declaration.kind !== "declare-resolved-attack") {
      throw new Error("Expected the Ephemerated Attack declaration decision");
    }
    expect(runtime.state.objects[attackId]?.zone).toBe("intent");
    expect(runtime.state.objects[attackId]?.states.has("ephemeral")).toBe(true);
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: declaration.id,
          stateVersion: declaration.stateVersion,
          answer: { attackerId, targetIds: [targetId], weaponIds: [] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    const combat = runtime.state.combat;
    if (!combat) throw new Error("Expected combat after declaring the Ephemerated Attack");
    const cleanupState = { ...runtime.state, combat: { ...combat, step: "end" as const } };
    const cleanup = new GrandArchiveTransactionKernel().transact(
      cleanupState,
      proposeGrandArchiveCombatCleanup(cleanupState),
    ).state;
    expect(cleanup.objects[attackId]?.zone).toBe("banishment");
    expect(cleanup.objects[attackId]?.states.has("ephemeral")).toBe(false);
  });

  it("enforces Ephemerate activation conditions and conditional cost modifiers", () => {
    const enabler = card("ephemerate-enabler", "ITEM");
    const conditionalAction = card(
      "conditional-ephemerate",
      "ACTION",
      [
        {
          id: "conditionalEphemerate-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (4). Costs (2) less while you control an item.",
          keyword: {
            name: "ephemerate",
            cost: { kind: "pay-reserve", amount: 4 },
            activationCondition: {
              kind: "controls",
              player: "controller",
              filter: { kind: "type", oneOf: ["ITEM"] },
            },
            costModifiers: [
              {
                operation: "subtract",
                amount: 2,
                condition: {
                  kind: "controls",
                  player: "controller",
                  filter: { kind: "type", oneOf: ["ITEM"] },
                },
              },
            ],
          },
        },
      ],
      undefined,
      undefined,
      { cost: { kind: "reserve", amount: 6 } },
    );
    const program = createGrandArchiveMatchProgram([champion, conditionalAction, enabler, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: conditionalAction.canonicalId, count: 1 },
        { definitionId: enabler.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 4 },
      ],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1704,
    });
    const p1 = grandArchivePlayerId("p1");
    const actionId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === conditionalAction.canonicalId,
    )!.id;
    const enablerId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === enabler.canonicalId,
    )!.id;
    const paymentIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === actionA.canonicalId)
      .slice(0, 2)
      .map((object) => object.id);
    const setupEvents = [
      {
        type: "object-moved" as const,
        objectId: actionId,
        from: initial.objects[actionId]!.zone,
        to: "graveyard" as const,
      },
      ...paymentIds.flatMap((objectId) =>
        initial.objects[objectId]?.zone === "hand"
          ? []
          : [
              {
                type: "object-moved" as const,
                objectId,
                from: initial.objects[objectId]!.zone,
                to: "hand" as const,
              },
            ],
      ),
    ];
    const withoutEnabler = new GrandArchiveTransactionKernel().transact(initial, setupEvents).state;
    const illegalRuntime = new GrandArchiveMatchRuntime(program, withoutEnabler);
    expect(
      illegalRuntime.execute(
        {
          move: "activate-card",
          cardId: actionId,
          activationMethod: "ephemerate",
          reservePayment: paymentIds.map((cardId) => ({ kind: "card", cardId })),
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);

    const enabled = new GrandArchiveTransactionKernel().transact(illegalRuntime.state, [
      {
        type: "object-moved",
        objectId: enablerId,
        from: illegalRuntime.state.objects[enablerId]!.zone,
        to: "field",
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, enabled);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: actionId,
          activationMethod: "ephemerate",
          reservePayment: [{ kind: "card", cardId: paymentIds[0]! }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: actionId,
          activationMethod: "ephemerate",
          reservePayment: paymentIds.map((cardId) => ({ kind: "card", cardId })),
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
  });

  it("activates a graveyard card with Ephemerate granted by a continuous effect", () => {
    const grantingChampion = card(
      "ephemerate-granting-champion",
      "CHAMPION",
      [
        {
          id: "ephemerateGrantingChampion-a1",
          kind: "static",
          staticKind: "effects",
          text: "Action cards in your graveyard have Ephemerate equal to their reserve cost.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["graveyard"],
                  player: "controller",
                  filter: { kind: "type", oneOf: ["ACTION"] },
                },
              },
              affectedSet: "dynamic",
              duration: { kind: "while-source-in-functional-zone" },
              layer: { layer: "D", modifies: "ability" },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "ephemerate",
                  cost: {
                    kind: "pay-reserve",
                    amount: {
                      kind: "property",
                      subject: { kind: "candidate" },
                      property: "reserve-cost",
                      basis: "base",
                    },
                  },
                  activationResult: {
                    entryState: { state: "ephemeral", value: true },
                  },
                },
              },
            },
          ],
        },
      ],
      0,
      10,
    );
    const grantedAction = card("granted-ephemerate-action", "ACTION", [], undefined, undefined, {
      cost: { kind: "reserve", amount: 2 },
    });
    const program = createGrandArchiveMatchProgram([grantingChampion, grantedAction, actionA]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: grantedAction.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 4 },
      ],
      materialDeck: [{ definitionId: grantingChampion.canonicalId, count: 1 }],
      startingChampionDefinitionId: grantingChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1705,
    });
    const p1 = grandArchivePlayerId("p1");
    const actionId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === grantedAction.canonicalId,
    )!.id;
    const paymentIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === actionA.canonicalId)
      .slice(0, 2)
      .map((object) => object.id);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: actionId,
        from: initial.objects[actionId]!.zone,
        to: "graveyard",
      },
      ...paymentIds.flatMap((objectId) =>
        initial.objects[objectId]?.zone === "hand"
          ? []
          : [
              {
                type: "object-moved" as const,
                objectId,
                from: initial.objects[objectId]!.zone,
                to: "hand" as const,
              },
            ],
      ),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: actionId,
          activationMethod: "ephemerate",
          reservePayment: paymentIds.map((cardId) => ({ kind: "card", cardId })),
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[actionId]?.states.has("ephemeral")).toBe(true);
  });

  it("resolves stacked Critical payments across opponents and doubles combat damage only once", () => {
    const criticalAttacker = card(
      "critical-attacker",
      "ALLY",
      [
        {
          id: "criticalAttacker-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Critical 1",
          keyword: { name: "critical", value: 1 },
        },
        {
          id: "criticalAttacker-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Critical 2",
          keyword: { name: "critical", value: 2 },
        },
      ],
      undefined,
      10,
      { power: 3 },
    );
    const criticalDefender = card("critical-defender", "ALLY", [], undefined, 10, {
      power: 0,
    });
    const program = createGrandArchiveMatchProgram([
      champion,
      criticalAttacker,
      criticalDefender,
      actionA,
      actionB,
      regalia,
      lesserBoon,
      greaterBoon,
      barrier,
    ]);
    const player = (
      id: string,
      ally: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
    ): GrandArchivePantheonPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: ally.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 3 },
        { definitionId: actionB.canonicalId, count: 3 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
      pantheon: {
        lesserBoonDefinitionId: lesserBoon.canonicalId,
        greaterBoonDefinitionId: greaterBoon.canonicalId,
        barrierDefinitionId: barrier.canonicalId,
      },
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "pantheon",
      players: [
        player("p1", criticalAttacker),
        player("p2", criticalDefender),
        player("p3", actionA),
      ],
      firstPlayerId: "p1",
      randomSeed: 1801,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const p3 = grandArchivePlayerId("p3");
    const findOwned = (playerId: typeof p1, definitionId: string) =>
      Object.values(initial.objects).find(
        (object) => object.ownerId === playerId && object.definitionId === definitionId,
      )!.id;
    const attackerId = findOwned(p1, criticalAttacker.canonicalId);
    const defenderId = findOwned(p2, criticalDefender.canonicalId);
    const p2DiscardId = findOwned(p2, actionA.canonicalId);
    const p3DiscardIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p3 && object.definitionId === actionB.canonicalId)
      .slice(0, 2)
      .map((object) => object.id);
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: attackerId,
        from: initial.objects[attackerId]!.zone,
        to: "field",
      },
      {
        type: "object-moved",
        objectId: defenderId,
        from: initial.objects[defenderId]!.zone,
        to: "field",
      },
      {
        type: "object-moved",
        objectId: p2DiscardId,
        from: initial.objects[p2DiscardId]!.zone,
        to: "hand",
      },
      ...p3DiscardIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: initial.objects[objectId]!.zone,
        to: "hand" as const,
      })),
    ]).state;
    const prepared = {
      ...positioned,
      players: {
        ...positioned.players,
        [p1]: { ...positioned.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const reachCritical = (runtime: GrandArchiveMatchRuntime) => {
      expect(
        runtime.execute(
          { move: "declare-attack", attackerId, targetIds: [defenderId] },
          { playerId: p1 },
        ).ok,
      ).toBe(true);
      for (const playerId of [p1, p2, p3]) {
        expect(runtime.execute({ move: "pass" }, { playerId }).ok).toBe(true);
      }
      const retaliation = runtime.state.decision;
      if (retaliation?.kind === "choose-retaliators") {
        expect(
          runtime.execute(
            {
              move: "answer-decision",
              decisionId: retaliation.id,
              stateVersion: retaliation.stateVersion,
              answer: [],
            },
            { playerId: p2 },
          ).ok,
        ).toBe(true);
      } else {
        expect(retaliation).toBeNull();
        expect(runtime.state.combat?.step).toBe("damage");
      }
      for (const playerId of [p1, p2, p3]) {
        expect(runtime.execute({ move: "pass" }, { playerId }).ok).toBe(true);
      }
      const ordering = runtime.state.decision;
      if (ordering?.kind === "choose-replacement") {
        const firstCriticalId = ordering.candidateIds.find((id) =>
          id.startsWith(`game:critical:${attackerId}:`),
        );
        if (!firstCriticalId) throw new Error("Expected Critical in replacement ordering");
        expect(
          runtime.execute(
            {
              move: "answer-decision",
              decisionId: ordering.id,
              stateVersion: ordering.stateVersion,
              answer: firstCriticalId,
            },
            { playerId: p2 },
          ).ok,
        ).toBe(true);
      }
      const critical = runtime.state.decision;
      if (!critical || critical.kind !== "resolve-critical") {
        throw new Error("Expected Critical discard decision");
      }
      return critical;
    };

    const paidRuntime = new GrandArchiveMatchRuntime(program, prepared);
    const firstPayment = reachCritical(paidRuntime);
    expect(firstPayment.playerId).toBe(p2);
    expect(firstPayment.amount).toBe(1);
    const invalid = paidRuntime.execute(
      {
        move: "answer-decision",
        decisionId: firstPayment.id,
        stateVersion: firstPayment.stateVersion,
        answer: [p2DiscardId, p2DiscardId],
      },
      { playerId: p2 },
    );
    expect(invalid.ok).toBe(false);
    expect(paidRuntime.state.decision?.id).toBe(firstPayment.id);
    expect(
      paidRuntime.execute(
        {
          move: "answer-decision",
          decisionId: firstPayment.id,
          stateVersion: firstPayment.stateVersion,
          answer: [p2DiscardId],
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    const secondPayment = paidRuntime.state.decision;
    if (!secondPayment || secondPayment.kind !== "resolve-critical") {
      throw new Error("Expected the second Critical instance");
    }
    expect(secondPayment.playerId).toBe(p3);
    expect(secondPayment.amount).toBe(2);
    expect(
      projectGrandArchiveViewerState(program, paidRuntime.state, p3).decision,
    ).not.toHaveProperty("continuation");
    expect(paidRuntime.state.objects[p2DiscardId]?.zone).toBe("hand");
    expect(
      paidRuntime.execute(
        {
          move: "answer-decision",
          decisionId: secondPayment.id,
          stateVersion: secondPayment.stateVersion,
          answer: p3DiscardIds,
        },
        { playerId: p3 },
      ).ok,
    ).toBe(true);
    expect(paidRuntime.state.objects[defenderId]?.damage).toBe(3);
    expect(paidRuntime.state.objects[p2DiscardId]?.zone).toBe("graveyard");
    for (const objectId of p3DiscardIds) {
      expect(paidRuntime.state.objects[objectId]?.zone).toBe("graveyard");
    }
    expect(paidRuntime.state.combat).toBeNull();

    const declinedRuntime = new GrandArchiveMatchRuntime(program, prepared);
    let declined = reachCritical(declinedRuntime);
    expect(
      declinedRuntime.execute(
        {
          move: "answer-decision",
          decisionId: declined.id,
          stateVersion: declined.stateVersion,
          answer: [],
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    const nextDecline = declinedRuntime.state.decision;
    if (!nextDecline || nextDecline.kind !== "resolve-critical") {
      throw new Error("Expected the next opponent's Critical decision");
    }
    declined = nextDecline;
    expect(declined.playerId).toBe(p3);
    expect(
      declinedRuntime.execute(
        {
          move: "answer-decision",
          decisionId: declined.id,
          stateVersion: declined.stateVersion,
          answer: [],
        },
        { playerId: p3 },
      ).ok,
    ).toBe(true);
    expect(declinedRuntime.state.objects[defenderId]?.damage).toBe(6);
    expect(declinedRuntime.state.objects[p2DiscardId]?.zone).toBe("hand");
    for (const objectId of p3DiscardIds) {
      expect(declinedRuntime.state.objects[objectId]?.zone).toBe("hand");
    }
    expect(declinedRuntime.state.decision).toBeNull();
    expect(declinedRuntime.state.combat).toBeNull();

    const defender = prepared.objects[defenderId]!;
    const replacementRuntime = new GrandArchiveMatchRuntime(program, {
      ...prepared,
      objects: {
        ...prepared.objects,
        [defenderId]: { ...defender, counters: { ...defender.counters, bulwark: 1 } },
      },
    });
    expect(
      replacementRuntime.execute(
        { move: "declare-attack", attackerId, targetIds: [defenderId] },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    for (const playerId of [p1, p2, p3, p1, p2]) {
      expect(replacementRuntime.execute({ move: "pass" }, { playerId }).ok).toBe(true);
    }
    const orderingTransition = replacementRuntime.execute({ move: "pass" }, { playerId: p3 });
    expect(orderingTransition.ok).toBe(true);
    expect(replacementRuntime.state.combat?.step).toBe("damage");
    const replacementOrder = replacementRuntime.state.decision;
    if (!replacementOrder || replacementOrder.kind !== "choose-replacement") {
      throw new Error("Expected Critical and Bulwark replacement ordering");
    }
    expect(replacementOrder.playerId).toBe(p2);
    expect(replacementOrder.candidateIds).toEqual(
      expect.arrayContaining([
        `game:critical:${attackerId}:0`,
        `game:critical:${attackerId}:1`,
        `game:bulwark:${defenderId}`,
      ]),
    );
    expect(
      replacementRuntime.execute(
        {
          move: "answer-decision",
          decisionId: replacementOrder.id,
          stateVersion: replacementOrder.stateVersion,
          answer: `game:bulwark:${defenderId}`,
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    expect(replacementRuntime.state.objects[defenderId]?.damage).toBe(0);
    expect(replacementRuntime.state.objects[defenderId]?.counters.bulwark).toBe(0);
    expect(replacementRuntime.state.objects[p2DiscardId]?.zone).toBe("hand");
    expect(replacementRuntime.state.combat).toBeNull();
    expect(replacementRuntime.state.decision).toBeNull();

    const criticalFirstRuntime = new GrandArchiveMatchRuntime(program, {
      ...prepared,
      objects: {
        ...prepared.objects,
        [defenderId]: { ...defender, counters: { ...defender.counters, bulwark: 1 } },
      },
    });
    expect(
      criticalFirstRuntime.execute(
        { move: "declare-attack", attackerId, targetIds: [defenderId] },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    for (const playerId of [p1, p2, p3, p1, p2, p3]) {
      expect(criticalFirstRuntime.execute({ move: "pass" }, { playerId }).ok).toBe(true);
    }
    const criticalFirstOrder = criticalFirstRuntime.state.decision;
    if (!criticalFirstOrder || criticalFirstOrder.kind !== "choose-replacement") {
      throw new Error("Expected mixed replacement ordering before Critical");
    }
    expect(
      criticalFirstRuntime.execute(
        {
          move: "answer-decision",
          decisionId: criticalFirstOrder.id,
          stateVersion: criticalFirstOrder.stateVersion,
          answer: `game:critical:${attackerId}:0`,
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    const criticalPayment = criticalFirstRuntime.state.decision;
    if (!criticalPayment || criticalPayment.kind !== "resolve-critical") {
      throw new Error("Expected Critical payment after choosing it first");
    }
    expect(
      criticalFirstRuntime.execute(
        {
          move: "answer-decision",
          decisionId: criticalPayment.id,
          stateVersion: criticalPayment.stateVersion,
          answer: [p2DiscardId],
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    expect(criticalFirstRuntime.state.objects[p2DiscardId]?.zone).toBe("hand");
    expect(
      JSON.stringify(projectGrandArchiveViewerState(program, criticalFirstRuntime.state, p3)),
    ).not.toContain(p2DiscardId);
    const restoredCriticalFirstRuntime = new GrandArchiveMatchRuntime(
      program,
      restoreGrandArchiveMatchSnapshot(
        program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(criticalFirstRuntime.state))),
      ),
    );
    const remainingOrder = restoredCriticalFirstRuntime.state.decision;
    if (!remainingOrder || remainingOrder.kind !== "choose-replacement") {
      throw new Error("Expected Bulwark ordering after the held Critical payment");
    }
    expect(
      restoredCriticalFirstRuntime.execute(
        {
          move: "answer-decision",
          decisionId: remainingOrder.id,
          stateVersion: remainingOrder.stateVersion,
          answer: `game:bulwark:${defenderId}`,
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);
    expect(restoredCriticalFirstRuntime.state.objects[p2DiscardId]?.zone).toBe("graveyard");
    expect(restoredCriticalFirstRuntime.state.objects[defenderId]?.damage).toBe(0);
    expect(restoredCriticalFirstRuntime.state.objects[defenderId]?.counters.bulwark).toBe(0);
    expect(restoredCriticalFirstRuntime.state.combat).toBeNull();
  });

  it("pays Attack costs at activation and lets a matching obedient ally perform Command", () => {
    const commandAttack = card(
      "command-attack",
      "ATTACK",
      [
        {
          id: "commandAttack-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Command Chessman",
          keyword: { name: "command", subtype: "Chessman" },
        },
      ],
      undefined,
      undefined,
      { power: 2, subtypes: ["CHESSMAN", "COMMAND"] },
    );
    const chessman = card(
      "command-chessman",
      "ALLY",
      [
        {
          id: "commandChessman-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Commanded Will 3",
          keyword: { name: "commanded-will", value: 3 },
        },
      ],
      undefined,
      10,
      { power: 1, subtypes: ["CHESSMAN"] },
    );
    const proudChessman = card(
      "proud-command-chessman",
      "ALLY",
      [
        {
          id: "proudCommandChessman-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 5",
          keyword: { name: "pride", value: 5 },
        },
      ],
      undefined,
      10,
      { power: 1, subtypes: ["CHESSMAN"] },
    );
    const automaton = card("command-automaton", "ALLY", [], undefined, 10, {
      power: 1,
      subtypes: ["AUTOMATON"],
    });
    const program = createGrandArchiveMatchProgram([
      champion,
      commandAttack,
      chessman,
      proudChessman,
      automaton,
      actionA,
      regalia,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: commandAttack.canonicalId, count: 2 },
        { definitionId: chessman.canonicalId, count: 1 },
        { definitionId: proudChessman.canonicalId, count: 1 },
        { definitionId: automaton.canonicalId, count: 1 },
        { definitionId: actionA.canonicalId, count: 2 },
      ],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: regalia.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(program, {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1901,
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const owned = (definitionId: string) =>
      Object.values(initial.objects).filter(
        (object) => object.ownerId === p1 && object.definitionId === definitionId,
      );
    const commandIds = owned(commandAttack.canonicalId).map((object) => object.id);
    const chessmanId = owned(chessman.canonicalId)[0]!.id;
    const proudChessmanId = owned(proudChessman.canonicalId)[0]!.id;
    const automatonId = owned(automaton.canonicalId)[0]!.id;
    const championId = initial.zones[p1].field[0]!;
    const targetId = initial.zones[p2].field[0]!;
    const moved = new GrandArchiveTransactionKernel().transact(initial, [
      ...commandIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: initial.objects[objectId]!.zone,
        to: "hand" as const,
      })),
      ...[chessmanId, proudChessmanId, automatonId].map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: initial.objects[objectId]!.zone,
        to: "field" as const,
      })),
    ]).state;
    const prepared = {
      ...moved,
      players: {
        ...moved.players,
        [p1]: { ...moved.players[p1]!, hasTakenFirstTurn: true },
      },
    };

    for (const invalidAttackerId of [championId, automatonId]) {
      const invalidRuntime = new GrandArchiveMatchRuntime(program, prepared);
      const invalid = invalidRuntime.execute(
        {
          move: "activate-card",
          cardId: commandIds[0]!,
          attackAttackerId: invalidAttackerId,
        },
        { playerId: p1 },
      );
      expect(invalid.ok).toBe(false);
      expect(invalidRuntime.state.objects[invalidAttackerId]?.states.has("rested")).toBe(false);
      expect(invalidRuntime.state.objects[commandIds[0]!]?.zone).toBe("hand");
    }

    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: commandIds[0]!,
        attackAttackerId: chessmanId,
      },
      { playerId: p1 },
    );
    expect(activation.ok).toBe(true);
    expect(runtime.state.objects[chessmanId]?.states.has("rested")).toBe(true);
    expect(runtime.state.objects[championId]?.states.has("rested")).toBe(false);
    expect(runtime.state.stack.at(-1)?.attackAttackerId).toBe(chessmanId);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    const declaration = runtime.state.decision;
    if (!declaration || declaration.kind !== "declare-resolved-attack") {
      throw new Error("Expected a Command attack declaration");
    }
    expect(declaration.attackerCandidates).toEqual([chessmanId]);
    expect(declaration.weaponCandidates).toEqual([]);
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: declaration.id,
          stateVersion: declaration.stateVersion,
          answer: { attackerId: chessmanId, targetIds: [targetId], weaponIds: [] },
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.combat?.attackerId).toBe(chessmanId);
    expect(runtime.state.objects[commandIds[0]!]?.hostId).toBe(chessmanId);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[targetId]?.damage).toBe(6);
    expect(runtime.state.objects[commandIds[0]!]?.zone).toBe("graveyard");
    expect(runtime.state.combat).toBeNull();

    const disobedientRuntime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      disobedientRuntime.execute(
        {
          move: "activate-card",
          cardId: commandIds[1]!,
          attackAttackerId: proudChessmanId,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(disobedientRuntime.state.objects[proudChessmanId]?.states.has("rested")).toBe(true);
    expect(disobedientRuntime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(disobedientRuntime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(disobedientRuntime.state.decision).toBeNull();
    expect(disobedientRuntime.state.combat).toBeNull();
    expect(disobedientRuntime.state.objects[commandIds[1]!]?.zone).toBe("graveyard");
    expect(disobedientRuntime.state.objects[proudChessmanId]?.states.has("rested")).toBe(true);
  });
});

it("Planar Abyss damages every opposing champion in a three-player Pantheon match", () => {
  const planarChampion = card("planar-champion", "CHAMPION", [], 0, 30, { elements: ["TERA"] });
  const program = createGrandArchiveMatchProgram([...executableCards, planarChampion, planarAbyss]);
  const setupPlayer = (id: string): GrandArchivePantheonPlayerSetup => ({
    ...pantheonPlayer(id),
    materialDeck: [{ definitionId: planarChampion.canonicalId, count: 1 }],
    startingChampionDefinitionId: planarChampion.canonicalId,
    mainDeck: [
      { definitionId: planarAbyss.canonicalId, count: 1 },
      { definitionId: actionA.canonicalId, count: 20 },
    ],
  });
  const initial = createGrandArchiveMatchInitialState(program, {
    mode: "pantheon",
    players: [setupPlayer("p1"), setupPlayer("p2"), setupPlayer("p3")],
    firstPlayerId: "p1",
    randomSeed: 22,
  });
  const p1 = grandArchivePlayerId("p1");
  const objects = Object.values(initial.objects).filter((object) => object.ownerId === p1);
  const activation = objects.find((object) => object.definitionId === planarAbyss.canonicalId)!;
  const reserveCards = objects
    .filter((object) => object.definitionId === actionA.canonicalId)
    .slice(0, 12);
  const arranged = new GrandArchiveTransactionKernel().transact(initial, [
    ...[activation, ...reserveCards]
      .filter((object) => object.zone !== "hand")
      .map((object) => ({
        type: "object-moved" as const,
        objectId: object.id,
        from: object.zone,
        to: "hand" as const,
      })),
    { type: "player-state-changed", playerId: p1, state: "shifting-currents", value: "south" },
  ]).state;
  const runtime = new GrandArchiveMatchRuntime(program, arranged);
  expect(
    runtime.execute(
      {
        move: "activate-card",
        cardId: activation.id,
        reservePayment: reserveCards.map((object) => ({ kind: "card", cardId: object.id })),
      },
      { playerId: p1 },
    ).ok,
  ).toBe(true);
  for (let step = 0; step < 100; step++) {
    const champions = Object.values(runtime.state.objects).filter(
      (object) => object.zone === "field" && object.definitionId === planarChampion.canonicalId,
    );
    if (champions.some((object) => object.damage > 0)) break;
    const wait = runtime.waitState();
    if (wait.kind === "opportunity")
      expect(runtime.execute({ move: "pass" }, { playerId: wait.playerId }).ok).toBe(true);
    else if (wait.kind === "materialization-choice")
      expect(
        runtime.execute({ move: "skip-materialization" }, { playerId: wait.playerId }).ok,
      ).toBe(true);
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  const champions = Object.values(runtime.state.objects).filter(
    (object) => object.zone === "field" && object.definitionId === planarChampion.canonicalId,
  );
  expect(champions).toHaveLength(3);
  for (const champion of champions)
    expect(champion.damage).toBe(champion.controllerId === p1 ? 0 : 10);
});
