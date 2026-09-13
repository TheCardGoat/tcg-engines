import {
  ferventLancer,
  hailfinch,
  simpleSlime,
  torRealmwalkerColossus,
} from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchiveObjectPower } from "./combat.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { collectGrandArchiveActionRules } from "../../rules/state/rule-modifications.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
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
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["TAMER", "GUARDIAN"],
          subtypes: [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { power: 2, life: 3 }
              : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("attack-rules-champion", "CHAMPION");
const filler = card("attack-rules-filler", "ACTION");
const attackingAlly = card("attack-rules-ally", "ALLY");

function setup(definition: typeof simpleSlime | typeof torRealmwalkerColossus) {
  const program = createGrandArchiveMatchProgram([champion, filler, definition]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1" ? [{ definitionId: definition.canonicalId, count: 1 }] : []),
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
      randomSeed: 191,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const attacker = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === definition.canonicalId,
  );
  if (!attacker) throw new Error(`Missing attack rule source ${definition.canonicalId}`);
  const field = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: attacker.id, from: attacker.zone, to: "field" },
    {
      type: "counter-changed",
      objectId: attacker.id,
      counter: definition === simpleSlime ? "buff" : "durability",
      delta: definition === simpleSlime ? 1 : 4,
    },
  ]).state;
  const prepared = {
    ...field,
    players: {
      ...field.players,
      [p1]: { ...field.players[p1]!, hasTakenFirstTurn: true },
    },
  };
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    p1,
    attackerId: attacker.id,
    defenderId: prepared.zones[p2].field[0]!,
  };
}

describe("Grand Archive attack rule modifications", () => {
  it("enforces Simple Slime's explicit prohibition even after it gains power", () => {
    const fixture = setup(simpleSlime);
    const result = fixture.runtime.execute(
      {
        move: "declare-attack",
        attackerId: fixture.attackerId,
        targetIds: [fixture.defenderId],
      },
      { playerId: fixture.p1 },
    );
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Simple Slime unexpectedly attacked");
    expect(result.message).toContain("forbids");
  });

  it("allows Tor, Realmwalker Colossus to attack as though it were an ally", () => {
    const fixture = setup(torRealmwalkerColossus);
    const attacker = fixture.runtime.state.objects[fixture.attackerId]!;
    expect(grandArchiveObjectPower(fixture.program, fixture.runtime.state, attacker)).toBe(1);
    expect(
      collectGrandArchiveActionRules({
        action: "attack-as-ally",
        activationKind: "card",
        playerId: fixture.p1,
        candidateId: fixture.attackerId,
        fromZone: "field",
        evaluation: {
          program: fixture.program,
          state: fixture.runtime.state,
          controllerId: fixture.p1,
          sourceId: fixture.attackerId,
          abilityBearerId: fixture.attackerId,
          candidateId: fixture.attackerId,
          bindings: {},
        },
      }).map((rule) => rule.effect.mode),
    ).toContain("allow");
    const result = fixture.runtime.execute(
      {
        move: "declare-attack",
        attackerId: fixture.attackerId,
        targetIds: [fixture.defenderId],
      },
      { playerId: fixture.p1 },
    );
    if (!result.ok) throw new Error(result.message);
    expect(result).toMatchObject({ ok: true });
    expect(fixture.runtime.state.combat?.attackerId).toBe(fixture.attackerId);
  });

  it("charges Hailfinch's target-specific attack cost only when Hailfinch is targeted", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, attackingAlly, hailfinch]);
    const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: filler.canonicalId, count: 6 },
        {
          definitionId: id === "p1" ? attackingAlly.canonicalId : hailfinch.canonicalId,
          count: 1,
        },
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
        randomSeed: 193,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attacker = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === attackingAlly.canonicalId,
    )!;
    const protectedTarget = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === hailfinch.canonicalId,
    )!;
    const paymentCards = Object.values(initial.objects)
      .filter(
        (object) =>
          object.ownerId === p1 &&
          object.definitionId === filler.canonicalId &&
          object.zone === "main-deck",
      )
      .slice(0, 2);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: attacker.id, from: attacker.zone, to: "field" },
      {
        type: "object-moved",
        objectId: protectedTarget.id,
        from: protectedTarget.zone,
        to: "field",
      },
      ...paymentCards.map((paymentCard) => ({
        type: "object-moved" as const,
        objectId: paymentCard.id,
        from: paymentCard.zone,
        to: "hand" as const,
      })),
    ]).state;
    const ready = {
      ...prepared,
      players: {
        ...prepared.players,
        [p1]: { ...prepared.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const unpaid = new GrandArchiveMatchRuntime(program, ready).execute(
      { move: "declare-attack", attackerId: attacker.id, targetIds: [protectedTarget.id] },
      { playerId: p1 },
    );
    expect(unpaid.ok).toBe(false);
    if (unpaid.ok) throw new Error("Hailfinch attack unexpectedly skipped its cost");
    expect(unpaid.message).toContain("exactly 2");

    const runtime = new GrandArchiveMatchRuntime(program, ready);
    const paid = runtime.execute(
      {
        move: "declare-attack",
        attackerId: attacker.id,
        targetIds: [protectedTarget.id],
        reservePayment: paymentCards.map((paymentCard) => ({
          kind: "card" as const,
          cardId: paymentCard.id,
        })),
      },
      { playerId: p1 },
    );
    if (!paid.ok) throw new Error(paid.message);
    expect(paid).toMatchObject({ ok: true });
    expect(paymentCards.map((card) => runtime.state.objects[card.id]?.zone)).toEqual([
      "memory",
      "memory",
    ]);

    const unprotected = new GrandArchiveMatchRuntime(program, ready).execute(
      {
        move: "declare-attack",
        attackerId: attacker.id,
        targetIds: [ready.zones[p2].field[0]!],
      },
      { playerId: p1 },
    );
    expect(unprotected).toMatchObject({ ok: true });
  });

  it("keeps Main open for Fervent Lancer until its required attack is attempted", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, ferventLancer]);
    const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: filler.canonicalId, count: 6 },
        ...(id === "p1" ? [{ definitionId: ferventLancer.canonicalId, count: 1 }] : []),
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
        randomSeed: 197,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const lancer = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === ferventLancer.canonicalId,
    )!;
    const banished = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === filler.canonicalId,
    )!;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: lancer.id,
        from: lancer.zone,
        to: "field",
        entryStates: ["rested"],
      },
      {
        type: "object-moved",
        objectId: banished.id,
        from: banished.zone,
        to: "banishment",
        banishedBySourceId: lancer.id,
      },
    ]).state;
    const ready = {
      ...prepared,
      players: {
        ...prepared.players,
        [p1]: { ...prepared.players[p1]!, hasTakenFirstTurn: true },
      },
    };
    const runtime = new GrandArchiveMatchRuntime(program, ready);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.turn.phase).toBe("main");
    expect(runtime.state.opportunity?.holderId).toBe(p1);

    const requiredTargetId = runtime.state.zones[p2].field[0]!;
    const attempt = runtime.execute(
      { move: "declare-attack", attackerId: lancer.id, targetIds: [requiredTargetId] },
      { playerId: p1 },
    );
    expect(attempt).toMatchObject({ ok: true });
    expect(runtime.state.combat).toBeNull();
    expect(runtime.state.turn.attackAttempts).toEqual([
      { attackerId: lancer.id, targetIds: [requiredTargetId], declared: false },
    ]);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.turn.phase).toBe("end");
  });
});
