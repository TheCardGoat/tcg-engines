import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Inuarashi034, op17InuarashiNekomamushi004 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-004 Inuarashi & Nekomamushi", () => {
  test("grants [Rush] to a {Land of Wano} or {Whitebeard Pirates} Character on play", () => {
    let engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-002",
        hand: [op01Inuarashi034, op17InuarashiNekomamushi004],
        activeDon: op01Inuarashi034.cost + op17InuarashiNekomamushi004.cost,
      },
      {},
    );
    engine.asSouth().play(op01Inuarashi034);
    const targetId = engine.findCardInZone("south", "character", op01Inuarashi034);
    const failed = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: targetId,
      targetId: engine.asNorth().leader(),
    });
    engine = OnePieceTestEngine.fromState(failed.state);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(false);

    engine.playCard(op17InuarashiNekomamushi004, "south");
    const grant = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (grant?.kind !== "selectEntity") throw new Error("Expected the Rush grant.");
    const candidates = grant.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(targetId);
    // Inuarashi & Nekomamushi itself is {Land of Wano} and also qualifies.
    expect(candidates.length).toBe(2);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    // [Rush]: the granted Character may attack the same turn — the accepted
    // declare is the proof (4000 power deals no damage to the Leader).
    engine.asSouth().attack(targetId, engine.asNorth().leader());
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("offers Whitebeard Pirates Allies and itself, excludes Higuma, and allows declining", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op17InuarashiNekomamushi004],
        character: [{ card: eb01Doma005 }, { cardId: "OP13-013" }],
        activeDon: op17InuarashiNekomamushi004.cost,
      },
      {},
    );

    engine.playCard(op17InuarashiNekomamushi004, "south");

    // The printed includes clause accepts Whitebeard Pirates Allies.
    const grant = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (grant?.kind !== "selectEntity") throw new Error("Expected the grant window.");
    const selfId = engine.findCardInZone("south", "character", op17InuarashiNekomamushi004);
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);
    // Doma's {Whitebeard Pirates Allies} trait matches too; Higuma does not.
    expect(grant.candidates.map((candidate) => candidate.ref.id)).toEqual([domaId, selfId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.find((c) => c?.cardId === "OP13-013")?.rested ?? false).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
