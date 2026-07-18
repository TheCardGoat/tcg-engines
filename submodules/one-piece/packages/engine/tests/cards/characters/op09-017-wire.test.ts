import { describe, expect, test } from "vite-plus/test";
import { op09Wire017, op10EustassCaptainKid099 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function wireFixture() {
  return OnePieceTestEngine.create(
    {
      leaderCardId: op10EustassCaptainKid099,
      hand: [op09Wire017],
      activeDon: op09Wire017.cost + 3,
    },
    {},
    { firstPlayer: "north", activeSeat: "south" },
  );
}

describe("OP09-017 Wire", () => {
  test("with DON!! x1 and a 7000-power Kid Pirates Leader gains Rush", () => {
    const engine = wireFixture();

    engine.playCard(op09Wire017, "south");
    const wireId = engine.findCardInZone("south", "character", op09Wire017);
    engine.attachDon(wireId, 1, "south");
    engine.attachDon(engine.leader("south"), 2, "south");

    expect(() => engine.declareAttack(wireId, engine.leader("north"), "south")).not.toThrow();
  });

  test("cannot attack that turn when either DON!! x1 or 7000 Leader power is missing", () => {
    const missingDon = wireFixture();
    missingDon.playCard(op09Wire017, "south");
    const missingDonWireId = missingDon.findCardInZone("south", "character", op09Wire017);
    missingDon.attachDon(missingDon.leader("south"), 2, "south");
    expect(
      missingDon.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: missingDonWireId,
        targetId: missingDon.leader("north"),
      }).accepted,
    ).toBe(false);

    const missingPower = wireFixture();
    missingPower.playCard(op09Wire017, "south");
    const missingPowerWireId = missingPower.findCardInZone("south", "character", op09Wire017);
    missingPower.attachDon(missingPowerWireId, 1, "south");
    expect(
      missingPower.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: missingPowerWireId,
        targetId: missingPower.leader("north"),
      }).accepted,
    ).toBe(false);
  });
});
