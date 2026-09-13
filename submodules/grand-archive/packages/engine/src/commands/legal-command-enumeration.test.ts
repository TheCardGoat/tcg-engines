import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
  GrandArchivePrintedCost,
  GrandArchiveSupertype,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchiveDecisionId, grandArchivePlayerId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { listGrandArchiveLegalCommands } from "./legal-commands.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import { applyGrandArchiveCommand } from "../procedures/game-flow/runtime.ts";
import { serializeGrandArchiveMatchSnapshot } from "../snapshot/snapshot.ts";
import { collectGrandArchiveStateBasedEvents } from "../rules/state/state-based.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
  supertypes: readonly GrandArchiveSupertype[] = [],
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  cost: GrandArchivePrintedCost = { kind: "none" },
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
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
        cost,
        typeLine: { supertypes, types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("legal-command-champion", "CHAMPION");
const filler = card("legal-command-filler", "ACTION");
const uniqueItem = card("legal-command-unique-item", "ITEM", ["UNIQUE"]);
const targetedAction = card(
  "legal-command-targeted-action",
  "ACTION",
  [],
  [
    {
      id: "legalCommandTargetedAction-a1",
      kind: "card-resolution",
      text: "Deal X damage to target opposing champion.",
      variables: [{ symbol: "X", kind: "chosen", minimum: 1, maximum: 2 }],
      targets: [
        {
          id: "target-champion",
          kind: "target",
          declared: "announcement",
          chooser: "controller",
          count: { kind: "exactly", amount: 1 },
          candidates: {
            kind: "object",
            zones: ["field"],
            player: "opponent",
            relationship: "controlled-by",
            filter: { kind: "type", oneOf: ["CHAMPION"] },
          },
        },
      ],
      effect: {
        kind: "deal-damage",
        source: { kind: "source" },
        recipient: { kind: "bound", binding: "target-champion" },
        amount: { kind: "variable", symbol: "X" },
      },
    },
  ],
  { kind: "reserve", amount: 1 },
);
const modalAbilityItem = card(
  "legal-command-modal-item",
  "ITEM",
  [],
  [
    {
      id: "legalCommandModalItem-a1",
      kind: "activated",
      activation: "ability",
      text: "[REST], Choose one — draw a card; or recover 1.",
      cost: { kind: "rest", subject: { kind: "source" } },
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
            id: "recover-mode",
            text: "Recover 1.",
            effect: { kind: "recover", player: "controller", amount: 1 },
          },
        ],
      },
      effect: { kind: "no-op" },
    },
  ],
);
const orderedCostItem = card(
  "legal-command-ordered-cost-item",
  "ITEM",
  [],
  [
    {
      id: "legalCommandOrderedCostItem-a1",
      kind: "activated",
      activation: "ability",
      text: "[REST], [Class Bonus]. Draw a card.",
      cost: {
        kind: "all",
        costs: [
          { kind: "rest", subject: { kind: "source" } },
          {
            kind: "add-counter",
            subject: { kind: "champion", player: "controller" },
            counter: "preparation",
            amount: 1,
          },
        ],
      },
      effect: { kind: "draw", player: "controller", amount: 1 },
    },
  ],
);

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    uniqueItem,
    targetedAction,
    modalAbilityItem,
    orderedCostItem,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: uniqueItem.canonicalId, count: 2 },
      { definitionId: targetedAction.canonicalId, count: 1 },
      { definitionId: modalAbilityItem.canonicalId, count: 1 },
      { definitionId: orderedCostItem.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 3 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 907,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return {
    program,
    state,
    p1: grandArchivePlayerId("p1"),
    p2: grandArchivePlayerId("p2"),
  };
}

function expectEveryCommandApplies(
  fixture: ReturnType<typeof setup>,
  state: ReturnType<typeof setup>["state"],
  playerId: ReturnType<typeof grandArchivePlayerId>,
) {
  const commands = listGrandArchiveLegalCommands(fixture.program, state, playerId);
  for (const candidate of commands) {
    expect(
      applyGrandArchiveCommand(fixture.program, state, candidate.command, {
        playerId,
        expectedStateVersion: state.stateVersion,
      }).ok,
      candidate.label,
    ).toBe(true);
  }
  return commands;
}

describe("Grand Archive concrete legal-command enumeration", () => {
  it("returns only executable commands without mutating the probed state", () => {
    const fixture = setup();
    const retained = fixture.state;
    const before = serializeGrandArchiveMatchSnapshot(retained);

    const commands = expectEveryCommandApplies(fixture, retained, fixture.p1);

    expect(commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          playerId: fixture.p1,
          stateVersion: retained.stateVersion,
          command: { move: "pass" },
          label: "Pass",
        }),
      ]),
    );
    expect(commands.some((candidate) => candidate.command.move === "concede")).toBe(false);
    expect(serializeGrandArchiveMatchSnapshot(retained)).toEqual(before);
    expect(
      listGrandArchiveLegalCommands(fixture.program, retained, fixture.p1, {
        includeConcede: true,
      }),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          playerId: fixture.p1,
          stateVersion: retained.stateVersion,
          command: { move: "concede" },
          label: "Concede",
        }),
      ]),
    );
  });

  it("binds every legal command to the actor and exact state version it was quoted from", () => {
    const fixture = setup();
    const [quoted] = listGrandArchiveLegalCommands(fixture.program, fixture.state, fixture.p1);
    expect(quoted).toBeDefined();
    expect(quoted?.playerId).toBe(fixture.p1);
    expect(quoted?.stateVersion).toBe(fixture.state.stateVersion);

    const advanced = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "opportunity-passed",
        playerId: fixture.p1,
      },
    ]).state;
    expect(
      applyGrandArchiveCommand(fixture.program, advanced, quoted!.command, {
        playerId: quoted!.playerId,
        expectedStateVersion: quoted!.stateVersion,
      }),
    ).toMatchObject({ ok: false, code: "stale-state", state: advanced });
  });

  it("enumerates every legal object that can be kept for the Unique check", () => {
    const fixture = setup();
    const uniqueObjects = Object.values(fixture.state.objects).filter(
      (object) => object.ownerId === fixture.p1 && object.definitionId === uniqueItem.canonicalId,
    );
    const kernel = new GrandArchiveTransactionKernel();
    const duplicated = kernel.transact(
      fixture.state,
      uniqueObjects.map((object) => ({
        type: "object-moved" as const,
        objectId: object.id,
        from: object.zone,
        to: "field" as const,
      })),
    ).state;
    const pending = kernel.transact(
      duplicated,
      collectGrandArchiveStateBasedEvents(fixture.program, duplicated),
    ).state;

    const commands = expectEveryCommandApplies(fixture, pending, fixture.p1);

    expect(commands.map((candidate) => candidate.command)).toEqual(
      uniqueObjects.map((object) => ({
        move: "answer-decision",
        decisionId: pending.decision!.id,
        stateVersion: pending.decision!.stateVersion,
        answer: object.id,
      })),
    );
    expect(listGrandArchiveLegalCommands(fixture.program, pending, fixture.p2)).toEqual([]);
  });

  it("enumerates exact-card combinations for Recollection", () => {
    const fixture = setup();
    const memoryCards = fixture.state.zones[fixture.p1]["main-deck"].slice(0, 3);
    const kernel = new GrandArchiveTransactionKernel();
    const memory = kernel.transact(fixture.state, [
      ...memoryCards.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "memory" as const,
      })),
      { type: "phase-changed" as const, phase: "recollection" as const },
    ]).state;
    const pending = kernel.transact(memory, [
      {
        type: "decision-created",
        decision: {
          id: grandArchiveDecisionId(`decision-${memory.nextDecisionOrdinal}`),
          kind: "choose-recollection",
          playerId: fixture.p1,
          amount: 2,
          candidateIds: memoryCards,
          stateVersion: memory.stateVersion,
        },
      },
    ]).state;

    const commands = expectEveryCommandApplies(fixture, pending, fixture.p1);
    const answers = commands.flatMap((candidate) =>
      candidate.command.move === "answer-decision" ? [candidate.command.answer] : [],
    );

    expect(answers).toHaveLength(3);
    expect(answers).toEqual(
      expect.arrayContaining([
        [memoryCards[0], memoryCards[1]],
        [memoryCards[0], memoryCards[2]],
        [memoryCards[1], memoryCards[2]],
      ]),
    );
  });

  it("expands card cost parameters, targets, and reserve payments into executable commands", () => {
    const fixture = setup();
    const source = Object.values(fixture.state.objects).find(
      (object) =>
        object.ownerId === fixture.p1 && object.definitionId === targetedAction.canonicalId,
    )!;
    const payment = Object.values(fixture.state.objects).find(
      (object) =>
        object.ownerId === fixture.p1 &&
        object.definitionId === filler.canonicalId &&
        object.id !== source.id,
    )!;
    const opposingChampion = Object.values(fixture.state.objects).find(
      (object) =>
        object.ownerId === fixture.p2 &&
        object.definitionId === champion.canonicalId &&
        object.zone === "field",
    )!;
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      ...(source.zone === "hand"
        ? []
        : [
            {
              type: "object-moved" as const,
              objectId: source.id,
              from: source.zone,
              to: "hand" as const,
            },
          ]),
      ...(payment.zone === "hand"
        ? []
        : [
            {
              type: "object-moved" as const,
              objectId: payment.id,
              from: payment.zone,
              to: "hand" as const,
            },
          ]),
    ]).state;

    const commands = expectEveryCommandApplies(fixture, prepared, fixture.p1).flatMap((candidate) =>
      candidate.command.move === "activate-card" && candidate.command.cardId === source.id
        ? [candidate.command]
        : [],
    );

    expect(commands.length).toBeGreaterThanOrEqual(2);
    expect(new Set(commands.map((command) => command.variables?.X))).toEqual(new Set([1, 2]));
    expect(commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          targets: { "target-champion": [opposingChampion.id] },
          reservePayment: expect.arrayContaining([{ kind: "card", cardId: payment.id }]),
        }),
      ]),
    );
    const eligiblePaymentIds = prepared.zones[fixture.p1].hand.filter(
      (objectId) => objectId !== source.id,
    );
    const enumeratedPaymentIds = commands
      .filter((command) => command.variables?.X === 1)
      .flatMap(
        (command) =>
          command.reservePayment?.flatMap((paymentSource) =>
            paymentSource.kind === "card" ? [paymentSource.cardId] : [],
          ) ?? [],
      );
    expect(new Set(enumeratedPaymentIds)).toEqual(new Set(eligiblePaymentIds));
  });

  it("enumerates every legal mode of an activated ability", () => {
    const fixture = setup();
    const item = Object.values(fixture.state.objects).find(
      (object) =>
        object.ownerId === fixture.p1 && object.definitionId === modalAbilityItem.canonicalId,
    )!;
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: item.id,
        from: item.zone,
        to: "field",
      },
    ]).state;

    const commands = expectEveryCommandApplies(fixture, prepared, fixture.p1).flatMap((candidate) =>
      candidate.command.move === "activate-ability" && candidate.command.sourceId === item.id
        ? [candidate.command]
        : [],
    );

    expect(commands.map((command) => command.modeIds)).toEqual(
      expect.arrayContaining([["draw-mode"], ["recover-mode"]]),
    );
  });

  it("enumerates player-selected compound cost payment orders", () => {
    const fixture = setup();
    const item = Object.values(fixture.state.objects).find(
      (object) =>
        object.ownerId === fixture.p1 && object.definitionId === orderedCostItem.canonicalId,
    )!;
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: item.id, from: item.zone, to: "field" },
    ]).state;

    const commands = expectEveryCommandApplies(fixture, prepared, fixture.p1).flatMap((candidate) =>
      candidate.command.move === "activate-ability" && candidate.command.sourceId === item.id
        ? [candidate.command]
        : [],
    );

    expect(commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ costPaymentOrders: [{ path: [], order: [1, 0] }] }),
      ]),
    );
  });
});
