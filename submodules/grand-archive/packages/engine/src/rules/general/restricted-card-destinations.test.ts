import { blightsRing, cooktechApron, spiritOfChess } from "@tcg/grand-archive-cards";
import type { GrandArchiveEffect } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { prepareGrandArchiveRuleBoundEvent } from "../../kernel/event-admission.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { observeGrandArchiveCommittedEvent } from "../../kernel/observed-events.ts";
import {
  chooseGrandArchiveReplacement,
  collectGrandArchiveReplacementCandidates,
} from "../replacements/replacements.ts";
import { collectGrandArchiveStateBasedEvents } from "../state/state-based.ts";

function setup() {
  const program = createGrandArchiveMatchProgram([spiritOfChess, blightsRing, cooktechApron]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: cooktechApron.canonicalId, count: 1 }],
    materialDeck: [
      { definitionId: spiritOfChess.canonicalId, count: 1 },
      { definitionId: blightsRing.canonicalId, count: 1 },
    ],
    startingChampionDefinitionId: spiritOfChess.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 20260825,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const objectId = (definitionId: string): GrandArchiveObjectId => {
    const object = Object.values(state.objects).find(
      (candidate) => candidate.ownerId === p1 && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing fixture object ${definitionId}`);
    return object.id;
  };
  return {
    program,
    state,
    p1,
    p2,
    championId: state.zones[p1].field[0]!,
    regaliaId: objectId(blightsRing.canonicalId),
    ordinaryId: objectId(cooktechApron.canonicalId),
  };
}

function rulesKernel(program: ReturnType<typeof createGrandArchiveMatchProgram>) {
  return new GrandArchiveTransactionKernel({
    prepareEvent: (state, event) => prepareGrandArchiveRuleBoundEvent(program, state, event),
    collectReplacements: (state, event) =>
      collectGrandArchiveReplacementCandidates(program, state, event),
    chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
  });
}

function observedNames(
  events: ReturnType<GrandArchiveTransactionKernel["transact"]>["result"]["events"],
) {
  return events.flatMap(observeGrandArchiveCommittedEvent).map((event) => event.name);
}

function executeMoveEffect(
  fixture: ReturnType<typeof setup>,
  destination: "hand" | "main-deck" | "memory",
) {
  const effect: GrandArchiveEffect = {
    kind: "move",
    subject: { kind: "bound", binding: "regalia" },
    from: "field",
    destination: { zone: destination },
  };
  const kernel = rulesKernel(fixture.program);
  const fielded = kernel.transact(fixture.state, [
    {
      type: "object-moved",
      objectId: fixture.regaliaId,
      from: "material-deck",
      to: "field",
      newControllerId: fixture.p2,
    },
  ]).state;
  return executeGrandArchiveEffect(
    effect,
    {
      program: fixture.program,
      state: fielded,
      controllerId: fixture.p1,
      sourceId: fixture.championId,
      abilityBearerId: fixture.championId,
      bindings: { regalia: [fixture.regaliaId] },
    },
    (state, events) => {
      const transaction = kernel.transact(state, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

describe("Champion and Regalia destination rules", () => {
  it("banishes a lethally damaged Champion while preserving the game loss", () => {
    const fixture = setup();
    const kernel = rulesKernel(fixture.program);
    const damaged = kernel.transact(fixture.state, [
      {
        type: "damage-marked",
        objectId: fixture.championId,
        amount: 15,
        cause: { kind: "rule", rule: "deal-damage-effect" },
      },
    ]).state;
    const result = kernel.transact(
      damaged,
      collectGrandArchiveStateBasedEvents(fixture.program, damaged),
    );

    expect(result.state.objects[fixture.championId]?.zone).toBe("banishment");
    expect(result.state.players[fixture.p1]?.lost).toBe(true);
    expect(result.state.status).toBe("finished");
    expect(result.state.winnerIds).toEqual([fixture.p2]);
    expect(observedNames(result.result.events)).toContain("object-destroyed");
    expect(observedNames(result.result.events)).not.toContain("object-died");
  });

  it("applies the Champion graveyard replacement outside the field", () => {
    const fixture = setup();
    const kernel = rulesKernel(fixture.program);
    const inHand = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.championId,
        from: "field",
        to: "hand",
      },
    ]).state;
    const result = kernel.transact(inHand, [
      {
        type: "object-moved",
        objectId: fixture.championId,
        from: "hand",
        to: "graveyard",
      },
    ]);

    expect(result.state.objects[fixture.championId]?.zone).toBe("banishment");
  });

  it("banishes a sacrificed Regalia without losing sacrifice and destruction semantics", () => {
    const fixture = setup();
    const kernel = rulesKernel(fixture.program);
    const fielded = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.regaliaId,
        from: "material-deck",
        to: "field",
      },
    ]).state;
    const result = kernel.transact(fielded, [
      {
        type: "object-moved",
        objectId: fixture.regaliaId,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "sacrifice-effect" },
      },
    ]);
    const names = observedNames(result.result.events);

    expect(result.state.objects[fixture.regaliaId]?.zone).toBe("banishment");
    expect(names).toContain("object-sacrificed");
    expect(names).toContain("object-destroyed");
    expect(names).not.toContain("object-died");
  });

  it.each(["hand", "main-deck", "memory"] as const)(
    "returns Regalia to its owner's material deck when an effect sends it to %s",
    (destination) => {
      const fixture = setup();
      const result = executeMoveEffect(fixture, destination);
      const move = result.events.find(
        (event) => event.type === "object-moved" && event.objectId === fixture.regaliaId,
      );

      expect(result.state.objects[fixture.regaliaId]?.zone).toBe("material-deck");
      expect(result.state.zones[fixture.p1]["material-deck"]).toContain(fixture.regaliaId);
      expect(result.state.zones[fixture.p2]["material-deck"]).not.toContain(fixture.regaliaId);
      expect(move).toMatchObject({
        type: "object-moved",
        from: "field",
        to: "material-deck",
        effectSpecified: true,
      });
    },
  );

  it("does not replace a non-effect Regalia move to hand", () => {
    const fixture = setup();
    const kernel = rulesKernel(fixture.program);
    const result = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.regaliaId,
        from: "material-deck",
        to: "hand",
        cause: { kind: "rule", rule: "test-turn-based-action" },
      },
    ]);

    expect(result.state.objects[fixture.regaliaId]?.zone).toBe("hand");
  });

  it("does not apply either restricted-card destination rule to an ordinary card", () => {
    const fixture = setup();
    const kernel = rulesKernel(fixture.program);
    const from = fixture.state.objects[fixture.ordinaryId]!.zone;
    const result = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.ordinaryId,
        from,
        to: "graveyard",
        effectSpecified: true,
        cause: { kind: "rule", rule: "discard-object-effect" },
      },
    ]);

    expect(result.state.objects[fixture.ordinaryId]?.zone).toBe("graveyard");
  });

  it("applies the more restrictive destination when an object gains Champion as an extra type", () => {
    const fixture = setup();
    const kernel = rulesKernel(fixture.program);
    const fielded = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.ordinaryId,
        from: fixture.state.objects[fixture.ordinaryId]!.zone,
        to: "field",
      },
    ]).state;
    const expanded = executeGrandArchiveEffect(
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "object" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "B", modifies: "type" },
        change: {
          kind: "add-characteristic",
          characteristic: { kind: "type", value: "CHAMPION" },
        },
      },
      {
        program: fixture.program,
        state: fielded,
        controllerId: fixture.p1,
        sourceId: fixture.championId,
        abilityBearerId: fixture.championId,
        bindings: { object: [fixture.ordinaryId] },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;
    const destroyed = kernel.transact(expanded, [
      {
        type: "object-moved",
        objectId: fixture.ordinaryId,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "destroy-effect" },
      },
    ]);

    expect(destroyed.state.objects[fixture.ordinaryId]?.zone).toBe("banishment");
  });
});
