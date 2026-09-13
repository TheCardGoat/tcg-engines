import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { listGrandArchiveLegalCommands } from "../../commands/legal-commands.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
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
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("activation-limit-champion", "CHAMPION");
const filler = card("activation-limit-filler", "ACTION");
const source = card("activation-limit-source", "ITEM", [
  {
    id: "activationLimitSource-a1",
    kind: "activated",
    activation: "ability",
    text: "(1): Do nothing. Activate this ability only once per turn.",
    cost: { kind: "pay-reserve", amount: 1 },
    limit: { count: 1, per: "turn" },
    effect: { kind: "no-op" },
  },
  {
    id: "activationLimitSource-a2",
    kind: "activated",
    activation: "ability",
    activationAuthority: "any-player",
    text: "(1): Do nothing. Activate this ability only once during each of your turns.",
    cost: { kind: "pay-reserve", amount: 1 },
    limit: { count: 1, per: "turn", whoseTurn: "controller" },
    effect: { kind: "no-op" },
  },
  {
    id: "activationLimitSource-a3",
    kind: "activated",
    activation: "ability",
    text: "(1): Do nothing. Activate this ability only once.",
    cost: { kind: "pay-reserve", amount: 1 },
    limit: { count: 1, per: "source-instance" },
    effect: { kind: "no-op" },
  },
]);

function setup() {
  const program = createGrandArchiveMatchProgram([champion, filler, source]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 4 },
      ...(id === "p1" ? [{ definitionId: source.canonicalId, count: 1 }] : []),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 813,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const sourceId = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === source.canonicalId,
  )!.id;
  const paymentIds = Object.values(initial.objects)
    .filter((object) => object.ownerId === p1 && object.definitionId === filler.canonicalId)
    .slice(0, 3)
    .map((object) => object.id);
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    {
      type: "object-moved",
      objectId: sourceId,
      from: initial.objects[sourceId]!.zone,
      to: "field",
    },
    ...paymentIds.map(
      (objectId) =>
        ({
          type: "object-moved",
          objectId,
          from: initial.objects[objectId]!.zone,
          to: "hand",
        }) as const,
    ),
  ]).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    p1,
    p2,
    sourceId,
    paymentIds,
  };
}

function activate(
  runtime: GrandArchiveMatchRuntime,
  playerId: ReturnType<typeof grandArchivePlayerId>,
  sourceId: ReturnType<typeof setup>["sourceId"],
  abilityId: string,
  paymentId: ReturnType<typeof setup>["paymentIds"][number],
) {
  return runtime.execute(
    {
      move: "activate-ability",
      sourceId,
      abilityId,
      reservePayment: [{ kind: "card", cardId: paymentId }],
    },
    { playerId },
  );
}

describe("Grand Archive activated-ability limits", () => {
  it("records usage only after successful payment and enforces it through snapshots and legal commands", () => {
    const fixture = setup();
    const [firstPaymentId, secondPaymentId] = fixture.paymentIds;
    expect(firstPaymentId).toBeDefined();
    expect(secondPaymentId).toBeDefined();

    const unpaid = fixture.runtime.execute(
      {
        move: "activate-ability",
        sourceId: fixture.sourceId,
        abilityId: "activationLimitSource-a1",
      },
      { playerId: fixture.p1 },
    );
    expect(unpaid.ok).toBe(false);
    expect(fixture.runtime.state.stack).toHaveLength(0);

    expect(
      activate(
        fixture.runtime,
        fixture.p1,
        fixture.sourceId,
        "activationLimitSource-a1",
        firstPaymentId!,
      ).ok,
    ).toBe(true);

    const restored = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fixture.runtime.state))),
      ),
    );
    expect(
      listGrandArchiveLegalCommands(fixture.program, restored.state, fixture.p1).some(
        ({ command }) =>
          command.move === "activate-ability" &&
          command.sourceId === fixture.sourceId &&
          command.abilityId === "activationLimitSource-a1",
      ),
    ).toBe(false);
    const repeated = activate(
      restored,
      fixture.p1,
      fixture.sourceId,
      "activationLimitSource-a1",
      secondPaymentId!,
    );
    expect(repeated.ok).toBe(false);
    expect(restored.state.objects[secondPaymentId!]?.zone).toBe("hand");

    const nextTurn = new GrandArchiveTransactionKernel().transact(restored.state, [
      {
        type: "turn-started",
        playerId: fixture.p1,
        turnNumber: restored.state.turn.number + 1,
      },
    ]).state;
    const nextTurnRuntime = new GrandArchiveMatchRuntime(fixture.program, nextTurn);
    expect(
      activate(
        nextTurnRuntime,
        fixture.p1,
        fixture.sourceId,
        "activationLimitSource-a1",
        secondPaymentId!,
      ).ok,
    ).toBe(true);
  });

  it("re-instances a source-instance limit after the source leaves and re-enters its zone", () => {
    const fixture = setup();
    const [firstPaymentId, secondPaymentId] = fixture.paymentIds;
    expect(
      activate(
        fixture.runtime,
        fixture.p1,
        fixture.sourceId,
        "activationLimitSource-a3",
        firstPaymentId!,
      ).ok,
    ).toBe(true);
    const firstIncarnation = fixture.runtime.state.objects[fixture.sourceId]!.incarnation;
    const reentered = new GrandArchiveTransactionKernel().transact(fixture.runtime.state, [
      { type: "object-moved", objectId: fixture.sourceId, from: "field", to: "banishment" },
      { type: "object-moved", objectId: fixture.sourceId, from: "banishment", to: "field" },
    ]).state;
    expect(reentered.objects[fixture.sourceId]!.incarnation).toBeGreaterThan(firstIncarnation);
    const runtime = new GrandArchiveMatchRuntime(fixture.program, reentered);
    expect(
      activate(runtime, fixture.p1, fixture.sourceId, "activationLimitSource-a3", secondPaymentId!)
        .ok,
    ).toBe(true);
  });

  it("enforces a controller-turn-qualified limit even when another player has activation authority", () => {
    const fixture = setup();
    const opponentTurn = new GrandArchiveTransactionKernel().transact(fixture.runtime.state, [
      {
        type: "turn-started",
        playerId: fixture.p2,
        turnNumber: fixture.runtime.state.turn.number + 1,
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, opponentTurn);
    expect(
      activate(
        runtime,
        fixture.p1,
        fixture.sourceId,
        "activationLimitSource-a2",
        fixture.paymentIds[0]!,
      ).ok,
    ).toBe(false);
    expect(runtime.state.stack).toHaveLength(0);
  });
});
