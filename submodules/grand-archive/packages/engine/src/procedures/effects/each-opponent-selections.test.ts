import {
  pantheonBarrier,
  zanderBlindingSteel,
  zhangJiaoWayOfPeace,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchivePantheonPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveDecision, GrandArchiveMatchState } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function zanderOpponentChoice(): GrandArchiveEffect {
  if (zanderBlindingSteel.layout.kind !== "single-faced") {
    throw new Error("Zander, Blinding Steel must be single-faced");
  }
  const ability = zanderBlindingSteel.layout.face.abilities[1];
  if (ability?.kind !== "triggered" || ability.effect?.kind !== "optional") {
    throw new Error("Zander must have its optional recollection effect");
  }
  const sequence = ability.effect.effect;
  if (sequence.kind !== "sequence" || sequence.effects[1]?.kind !== "for-each") {
    throw new Error("Zander must repeat its opponent choice");
  }
  const choice = sequence.effects[1].effect;
  if (choice.kind !== "choose") throw new Error("Zander must choose an opponent hand card");
  return choice;
}

function zhangJiaoRandomDiscard(): GrandArchiveEffect {
  if (zhangJiaoWayOfPeace.layout.kind !== "single-faced") {
    throw new Error("Zhang Jiao, Way of Peace must be single-faced");
  }
  const ability = zhangJiaoWayOfPeace.layout.face.abilities[0];
  if (ability?.kind !== "triggered" || ability.effect?.kind !== "branch-on-value") {
    throw new Error("Zhang Jiao must branch on memory count");
  }
  const effect = ability.effect.branches.at(-1)?.effect;
  if (effect?.kind !== "discard") throw new Error("Zhang Jiao must randomly discard");
  return effect;
}

function card(
  canonicalId: string,
  type: "ACTION" | "CHAMPION" | "GREATER BOON" | "LESSER BOON" | "PHANTASIA",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
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
        name: canonicalId,
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["ASSASSIN"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("each-opponent-champion", "CHAMPION", [
  {
    id: "eachOpponentChampion-a3",
    kind: "activated",
    activation: "ability",
    text: "Each opponent puts a card from their hand into their memory.",
    cost: { kind: "pay-reserve", amount: 0 },
    effect: {
      kind: "reserve",
      player: "each-opponent",
      selection: {
        id: "reserved-hand",
        kind: "choice",
        declared: "resolution",
        chooser: "each-opponent",
        count: { kind: "exactly", amount: 1 },
        unique: true,
        candidates: {
          kind: "card",
          zones: ["hand"],
          relationship: "zone-of",
          player: "each-opponent",
        },
      },
    },
  },
  {
    id: "eachOpponentChampion-a1",
    kind: "activated",
    activation: "ability",
    text: "Each opponent puts a card from their hand into their memory.",
    cost: { kind: "pay-reserve", amount: 0 },
    effect: zanderOpponentChoice(),
  },
  {
    id: "eachOpponentChampion-a2",
    kind: "activated",
    activation: "ability",
    text: "Each opponent discards a card at random from their memory.",
    cost: { kind: "pay-reserve", amount: 0 },
    effect: zhangJiaoRandomDiscard(),
  },
]);
const filler = card("each-opponent-filler", "ACTION");
const lesserBoon = card("each-opponent-lesser-boon", "LESSER BOON");
const greaterBoon = card("each-opponent-greater-boon", "GREATER BOON");
const barrier = pantheonBarrier;

type PlayerKey = "p1" | "p2" | "p3";

function setup(extraHandChoice = false): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly state: GrandArchiveMatchState;
  readonly players: Readonly<Record<PlayerKey, ReturnType<typeof grandArchivePlayerId>>>;
  readonly championId: GrandArchiveObjectId;
  readonly handIds: Readonly<Record<PlayerKey, GrandArchiveObjectId>>;
  readonly memoryIds: Readonly<
    Record<PlayerKey, readonly [GrandArchiveObjectId, GrandArchiveObjectId]>
  >;
} {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    lesserBoon,
    greaterBoon,
    barrier,
  ]);
  const player = (id: PlayerKey): GrandArchivePantheonPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 3 }],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
    pantheon: {
      lesserBoonDefinitionId: lesserBoon.canonicalId,
      greaterBoonDefinitionId: greaterBoon.canonicalId,
      barrierDefinitionId: barrier.canonicalId,
    },
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "pantheon",
      players: [player("p1"), player("p2"), player("p3")],
      firstPlayerId: "p2",
      randomSeed: 12345,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const players = {
    p1: grandArchivePlayerId("p1"),
    p2: grandArchivePlayerId("p2"),
    p3: grandArchivePlayerId("p3"),
  };
  const ids = (playerId: ReturnType<typeof grandArchivePlayerId>): GrandArchiveObjectId[] =>
    Object.values(initial.objects)
      .filter((object) => object.ownerId === playerId && object.definitionId === filler.canonicalId)
      .map((object) => object.id);
  const p1Ids = ids(players.p1);
  const p2Ids = ids(players.p2);
  const p3Ids = ids(players.p3);
  if (p1Ids.length !== 3 || p2Ids.length !== 3 || p3Ids.length !== 3) {
    throw new Error("Missing each-opponent filler cards");
  }
  const handFor = (objectIds: readonly GrandArchiveObjectId[]): GrandArchiveObjectId =>
    objectIds.find((objectId) => initial.objects[objectId]?.zone === "hand") ?? objectIds[0]!;
  const handIds = { p1: handFor(p1Ids), p2: handFor(p2Ids), p3: handFor(p3Ids) };
  const memoryFor = (
    objectIds: readonly GrandArchiveObjectId[],
    handId: GrandArchiveObjectId,
  ): readonly [GrandArchiveObjectId, GrandArchiveObjectId] => {
    const remaining = objectIds.filter((objectId) => objectId !== handId);
    return [remaining[0]!, remaining[1]!];
  };
  const memoryIds = {
    p1: memoryFor(p1Ids, handIds.p1),
    p2: memoryFor(p2Ids, handIds.p2),
    p3: memoryFor(p3Ids, handIds.p3),
  };
  const kernel = new GrandArchiveTransactionKernel();
  const state = kernel.transact(initial, [
    ...Object.values(handIds).map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: initial.objects[objectId]!.zone,
      to: "hand" as const,
    })),
    ...Object.values(memoryIds)
      .flat()
      .map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: initial.objects[objectId]!.zone,
        to:
          extraHandChoice && Object.values(memoryIds).some((ids) => ids[0] === objectId)
            ? ("hand" as const)
            : ("memory" as const),
      })),
  ]).state;
  return {
    program,
    state,
    players,
    championId: Object.values(state.objects).find(
      (object) =>
        object.controllerId === players.p2 && object.definitionId === champion.canonicalId,
    )!.id,
    handIds,
    memoryIds,
  };
}

function passUntilDecision(runtime: GrandArchiveMatchRuntime): Exclude<GrandArchiveDecision, null> {
  for (let pass = 0; pass < 16 && !runtime.state.decision; pass += 1) {
    const holderId = runtime.state.opportunity?.holderId;
    if (!holderId) throw new Error("Each-opponent resolution requires Opportunity");
    const result = runtime.execute({ move: "pass" }, { playerId: holderId });
    if (!result.ok)
      throw new Error("diagnostic" in result ? JSON.stringify(result.diagnostic) : result.message);
  }
  const decision = runtime.state.decision;
  if (!decision) throw new Error("Expected an each-opponent decision");
  return decision;
}

function answer(
  runtime: GrandArchiveMatchRuntime,
  decision: Exclude<GrandArchiveDecision, null>,
  objectId: GrandArchiveObjectId,
): void {
  const result = runtime.execute(
    {
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: [objectId],
    },
    { playerId: decision.playerId },
  );
  if (!result.ok)
    throw new Error("diagnostic" in result ? JSON.stringify(result.diagnostic) : result.message);
}

function resolveWithoutDecisions(runtime: GrandArchiveMatchRuntime): void {
  for (let pass = 0; pass < 20 && runtime.state.stack.length > 0; pass += 1) {
    if (runtime.state.decision) throw new Error("Random each-opponent effect created a decision");
    const holderId = runtime.state.opportunity?.holderId;
    if (!holderId) throw new Error("Random each-opponent resolution requires Opportunity");
    const result = runtime.execute({ move: "pass" }, { playerId: holderId });
    if (!result.ok)
      throw new Error("diagnostic" in result ? JSON.stringify(result.diagnostic) : result.message);
  }
  expect(runtime.state.stack).toHaveLength(0);
}

describe("Grand Archive each-opponent selections", () => {
  for (const abilityId of ["eachOpponentChampion-a1", "eachOpponentChampion-a3"])
    it(`collects ${abilityId} opponent choices in turn order and applies them together`, () => {
      const fixture = setup(abilityId === "eachOpponentChampion-a3");
      const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
      expect(
        runtime.execute(
          {
            move: "activate-ability",
            sourceId: fixture.championId,
            abilityId,
          },
          { playerId: fixture.players.p2 },
        ).ok,
      ).toBe(true);
      const expectedOrder = [...runtime.state.turnOrder, ...runtime.state.turnOrder]
        .slice(
          runtime.state.turnOrder.indexOf(runtime.state.turn.playerId),
          runtime.state.turnOrder.indexOf(runtime.state.turn.playerId) +
            runtime.state.turnOrder.length,
        )
        .filter((playerId) => playerId !== fixture.players.p2);
      const first = passUntilDecision(runtime);
      expect(first.playerId).toBe(expectedOrder[0]);
      const firstKey = first.playerId === fixture.players.p1 ? "p1" : "p3";
      answer(runtime, first, fixture.handIds[firstKey]);

      const second = runtime.state.decision;
      if (!second) throw new Error("Expected the second opponent choice");
      expect(second.playerId).toBe(expectedOrder[1]);
      expect(runtime.state.objects[fixture.handIds.p1]?.zone).toBe("hand");
      expect(runtime.state.objects[fixture.handIds.p3]?.zone).toBe("hand");
      const secondKey = second.playerId === fixture.players.p1 ? "p1" : "p3";
      answer(runtime, second, fixture.handIds[secondKey]);
      expect(runtime.state.objects[fixture.handIds.p1]?.zone).toBe("memory");
      expect(runtime.state.objects[fixture.handIds.p3]?.zone).toBe("memory");
      expect(runtime.state.objects[fixture.handIds.p2]?.zone).toBe("hand");
    });

  it("randomly discards per opponent and treats an empty memory as a no-op", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const withEmptyOpponentMemory = kernel.transact(
      fixture.state,
      fixture.memoryIds.p3.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "memory" as const,
        to: "main-deck" as const,
      })),
    ).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, withEmptyOpponentMemory);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId: fixture.championId,
          abilityId: "eachOpponentChampion-a2",
        },
        { playerId: fixture.players.p2 },
      ).ok,
    ).toBe(true);
    resolveWithoutDecisions(runtime);

    expect(runtime.state.zones[fixture.players.p1].memory).toHaveLength(1);
    expect(runtime.state.zones[fixture.players.p3].memory).toHaveLength(0);
    expect(runtime.state.zones[fixture.players.p2].memory).toHaveLength(2);
    expect(
      fixture.memoryIds.p1.filter(
        (objectId) => runtime.state.objects[objectId]?.zone === "graveyard",
      ),
    ).toHaveLength(1);
    expect(
      fixture.memoryIds.p3.filter(
        (objectId) => runtime.state.objects[objectId]?.zone === "graveyard",
      ),
    ).toHaveLength(0);
  });
});
