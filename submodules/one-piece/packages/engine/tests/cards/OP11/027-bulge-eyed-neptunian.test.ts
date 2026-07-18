import { describe, expect, test } from "vite-plus/test";
import { op11BulgeEyedNeptunian027 } from "../../../../cards/src/cards/OP11/characters/027-bulge-eyed-neptunian.ts";
import { op11Shirahoshi022 } from "../../../../cards/src/cards/OP11/leaders/022-shirahoshi.ts";
import { op14eb04Killer005 } from "../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP11-027 Bulge-Eyed Neptunian", () => {
  test("can attack a Character on the turn it is played with a Shirahoshi Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op11Shirahoshi022,
        hand: [op11BulgeEyedNeptunian027],
        activeDon: op11BulgeEyedNeptunian027.cost,
      },
      {
        character: [{ card: op14eb04Killer005, rested: true }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", op14eb04Killer005);

    engine.playCard(op11BulgeEyedNeptunian027);
    const neptunianId = engine.findCardInZone("south", "character", op11BulgeEyedNeptunian027);
    engine.declareAttack(neptunianId, targetId);

    expect(engine.getState().cards[neptunianId]?.rested).toBe(true);
    expect(
      engine
        .getView("south")
        .logs.some(
          (entry) => entry.sourceInstanceId === neptunianId && entry.targetIds?.includes(targetId),
        ),
    ).toBe(true);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
