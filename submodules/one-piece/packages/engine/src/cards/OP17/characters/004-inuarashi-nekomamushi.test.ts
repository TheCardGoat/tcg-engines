import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Inuarashi034, op17InuarashiNekomamushi004 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-004 Inuarashi & Nekomamushi", () => {
  test("grants [Rush] to a {Land of Wano} or {Whitebeard Pirates} Character on play", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op17InuarashiNekomamushi004],
        character: [{ card: op01Inuarashi034 }],
        activeDon: op17InuarashiNekomamushi004.cost,
      },
      {},
    );
    const targetId = engine.findCardInZone("south", "character", op01Inuarashi034);

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
    expect(() => engine.asSouth().attack(targetId, engine.asNorth().leader())).not.toThrow();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("offers no targets when only non-matching Characters are on the field", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op17InuarashiNekomamushi004],
        character: [{ card: eb01Doma005 }, { cardId: "OP13-013" }],
        activeDon: op17InuarashiNekomamushi004.cost,
      },
      {},
    );

    engine.playCard(op17InuarashiNekomamushi004, "south");

    // Only the played card itself (Land of Wano) qualifies — the non-matching
    // Characters must not be selectable.
    const grant = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (grant?.kind !== "selectEntity") throw new Error("Expected the grant window.");
    const selfId = engine.findCardInZone("south", "character", op17InuarashiNekomamushi004);
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);
    // Doma's {Whitebeard Pirates Allies} trait matches too; Higuma does not.
    expect(grant.candidates.map((candidate) => candidate.ref.id)).toEqual([domaId, selfId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.find((c) => c?.cardId === "OP13-013")?.rested ?? false).toBe(false);
    expect(south.characters.find((c) => c?.cardId === "OP13-013")?.rested ?? false).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
