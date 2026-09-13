/**
 * Topic suite: targeting & impossible actions (CR 1-3-2 family + related filters).
 *
 * Chapter 1 keeps a single sample; this file expands invalid targets, cost
 * filters, already-in-state exclusions, and “skip impossible, continue rest”.
 */
import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op03Namule007,
  op03OneTwoJango039,
  op04Sugar024,
  op13NicoRobin032,
  op13Otama043,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;

describe("Rules topics: targeting and impossible actions", () => {
  test("1-3-2 / 7-1-1-2: an active Character is not a legal attack target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [eb01Doma005, { card: op03Namule007, rested: true }] },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const attackerId = south.findOnField(eb01MountainGod018);
    const activeId = north.findOnField(eb01Doma005);
    const restedId = north.findOnField(op03Namule007);

    expect(
      south.expectFailure({
        type: "declareAttack",
        attackerId,
        targetId: activeId,
      }).reason,
    ).toBe("The selected target cannot be attacked.");

    // Rested Character remains a legal attack target; declaration is accepted.
    south.attack(eb01MountainGod018, op03Namule007);
    expect(south.view().status).toBe("active");
    // Attacker rests as part of declaring the attack.
    expect(
      south.view().players.south.characters.find((card) => card?.instanceId === attackerId)?.rested,
    ).toBe(true);
    // Active Character was never a legal target and is untouched.
    expect(
      north.view().players.north.characters.some((card) => card?.instanceId === activeId),
    ).toBe(true);
    // Rested target id was used only for the legal declareAttack path above.
    expect(restedId).toBeTruthy();
  });

  test("1-3-2: cost filter excludes over-cost Characters from rest candidates", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        hand: [op03OneTwoJango039],
        activeDon: 1,
      },
      // Sugar costs 2 → not a legal “cost ≤ 1” rest target.
      { character: [op04Sugar024, op13Otama043] },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const sugarId = north.findOnField(op04Sugar024);
    const otamaId = north.findOnField(op13Otama043);

    south.play(op03OneTwoJango039);
    const decision = south.pendingDecision("effectTargetSelection");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected rest target selection.");
    const candidateIds = step.candidates.map((c) => c.ref.id);
    expect(candidateIds).toContain(otamaId);
    expect(candidateIds).not.toContain(sugarId);

    // Choosing the legal cost-1 target rests her; the effect continues to power.
    south.chooseTargets(op13Otama043);
    south.chooseTargets(eb01MountainGod018);

    expect(
      north.view().players.north.characters.find((card) => card?.instanceId === otamaId)?.rested,
    ).toBe(true);
    expect(
      north.view().players.north.characters.find((card) => card?.instanceId === sugarId)?.rested,
    ).toBe(false);
  });

  test("1-3-2: when no rest candidates exist, the action is skipped and later clauses still run", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        hand: [op03OneTwoJango039],
        activeDon: 1,
      },
      { character: [op04Sugar024] },
    );
    const south = engine.asSouth();
    const mountainGodId = south.findOnField(eb01MountainGod018);

    south.play(op03OneTwoJango039);
    // Rest step has no legal targets → auto-skipped or empty; only power remains.
    south.chooseTargets(eb01MountainGod018);

    const view = south.view();
    expect(
      view.players.south.characters.find((card) => card?.instanceId === mountainGodId)?.power,
    ).toBe(8000);
    expect(view.players.north.characters.every((card) => !card || !card.rested)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("1-3-2-1: already-rested Characters are excluded from rest candidates", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        hand: [op03OneTwoJango039],
        activeDon: 1,
      },
      { character: [{ card: op13Otama043, rested: true }, op04Sugar024] },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const otamaId = north.findOnField(op13Otama043);

    south.play(op03OneTwoJango039);
    const decision = south.pendingDecision("effectTargetSelection");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected rest target selection.");
    expect(step.candidates.map((c) => c.ref.id)).not.toContain(otamaId);

    south.chooseNoTargets();
    south.chooseTargets(eb01MountainGod018);

    expect(
      north.view().players.north.characters.find((card) => card?.instanceId === otamaId)?.rested,
    ).toBe(true);
  });

  test("1-3-3 / targeting: a cannot-be-rested permanent keeps the card out of rest candidates", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13NicoRobin032, op03OneTwoJango039],
        activeDon: 8,
      },
      { character: [op13Otama043] },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const otamaId = north.findOnField(op13Otama043);

    // Robin: cannot be rested until end of opponent's next End Phase.
    south.play(op13NicoRobin032);
    south.chooseTargets(op13Otama043);

    south.play(op03OneTwoJango039);
    const decision = south.pendingDecision("effectTargetSelection");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected rest target selection.");
    // Protected Otama is not offered as a rest target.
    expect(step.candidates.map((c) => c.ref.id)).not.toContain(otamaId);

    south.chooseNoTargets();
    // Power step still resolves if a friendly Character exists — field empty
    // of south characters here, so decline power target.
    if (south.hasPendingChoice()) {
      south.chooseNoTargets();
    }

    expect(
      north.view().players.north.characters.find((card) => card?.instanceId === otamaId)?.rested,
    ).toBe(false);
  });

  test("1-3-5-1 / targeting: up-to rest may choose zero targets while candidates exist", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        hand: [op03OneTwoJango039],
        activeDon: 1,
      },
      { character: [op13Otama043] },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const otamaId = north.findOnField(op13Otama043);

    south.play(op03OneTwoJango039);
    const decision = south.pendingDecision("effectTargetSelection");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected rest target selection.");
    expect(step.min).toBe(0);
    expect(step.candidates.map((c) => c.ref.id)).toContain(otamaId);

    south.chooseNoTargets();
    south.chooseTargets(eb01MountainGod018);

    expect(
      north.view().players.north.characters.find((card) => card?.instanceId === otamaId)?.rested,
    ).toBe(false);
  });
});
