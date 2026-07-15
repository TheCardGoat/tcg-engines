import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockPilot,
  enqueueOwnCardTriggers,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd02GundamMkIiTitans003 } from "./003-gundam-mk-ii-titans.ts";

describe("Gundam Mk-II (Titans) (GD02-003)", () => {
  it("data: duringPair + destroyed timing with level-qualification present", () => {
    // Structural guard: the card's triggered effect carries the `destroyed`
    // event timing and an `activation.qualification` that the engine gates
    // enqueue on. See `resolveQualificationActorId` for the actor mapping
    // for unitDestroyed events.
    const effect = gd02GundamMkIiTitans003.effects?.find((e) => e.type === "triggered");
    expect(effect?.activation.timing).toEqual(["destroyed"]);
    expect(effect?.activation.conditions).toContainEqual({ type: "duringPair" });
    expect(effect?.activation.qualification).toEqual({
      attribute: "level",
      comparison: "lte",
      value: 3,
    });
  });

  it("【Destroyed】 — qualification resolves to the destroyed unit (unitDestroyed → event.cardId)", () => {
    // PR #124 (Wave 8): `resolveQualificationActorId` now maps
    // `unitDestroyed` → `event.cardId`, so a qualification printed on a
    // 【Destroyed】 trigger checks the dying card itself. This card's
    // unit level is 4, which fails `level ≤ 3` — the effect therefore
    // does NOT enqueue even though the timing matches. That's the
    // correct fail-closed behaviour for this printed data shape;
    // pairing-pilot-level semantics (the card text implies the paired
    // pilot, not the unit) remain tracked separately as a card-data
    // follow-up.
    const pilot = createMockPilot({ level: 2 });
    const engine = GundamTestEngine.create({ play: [gd02GundamMkIiTitans003] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    // Pair the pilot directly so duringPair gate holds.
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G }) => {
      G.pilotAssignments[unitId] = pilot.cardNumber;
    });

    let qLen = 0;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      enqueueOwnCardTriggers(
        G,
        { type: "unitDestroyed", cardId: unitId, ownerId: PLAYER_ONE },
        unitId,
        PLAYER_ONE,
        framework,
      );
      qLen = G.pendingEffects.length;
    });

    // Unit level is 4 > 3 → qualification (on destroyed card) fails → no enqueue.
    // This documents the mapping chosen in Wave 8: without pairing-pilot
    // actor resolution, the destroyed-unit actor path is the contract.
    expect(qLen).toBe(0);
  });
});
