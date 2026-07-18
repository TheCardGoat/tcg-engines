import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op11BulgeEyedNeptunian027, op11Shirahoshi022 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-027 Bulge-Eyed Neptunian", () => {
  test("with Shirahoshi, can attack a rested Character on the turn it is played", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op11Shirahoshi022,
        hand: [op11BulgeEyedNeptunian027],
        activeDon: op11BulgeEyedNeptunian027.cost,
      },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op11BulgeEyedNeptunian027, "south");
    const neptunianId = engine.findCardInZone("south", "character", op11BulgeEyedNeptunian027);
    engine.declareAttack(neptunianId, targetId, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === neptunianId)?.rested,
    ).toBe(true);
  });

  test("without Shirahoshi, cannot attack on the turn it is played", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11BulgeEyedNeptunian027],
        activeDon: op11BulgeEyedNeptunian027.cost,
      },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.playCard(op11BulgeEyedNeptunian027, "south");
    const neptunianId = engine.findCardInZone("south", "character", op11BulgeEyedNeptunian027);

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: neptunianId,
        targetId,
      }).accepted,
    ).toBe(false);
  });
});
