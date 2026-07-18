import { describe, expect, test } from "vite-plus/test";
import { op01WhoSWhoBoxTopper109 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function whoPower(engine: OnePieceTestEngine): number | undefined {
  const whoId = engine.findCardInZone("south", "character", op01WhoSWhoBoxTopper109);
  return (
    engine.getView("south").players.south.characters.find((card) => card?.instanceId === whoId)
      ?.power ?? undefined
  );
}

describe("OP01-109 Who's.Who (Box Topper)", () => {
  test("gains +1000 only with attached DON!!, on its turn, at eight field DON!!", () => {
    const basePower = op01WhoSWhoBoxTopper109.power;
    if (basePower === undefined) throw new Error("Expected Who's.Who's printed power.");
    const eligible = OnePieceTestEngine.create(
      {
        character: [op01WhoSWhoBoxTopper109],
        activeDon: 8,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    eligible.attachDon(
      eligible.findCardInZone("south", "character", op01WhoSWhoBoxTopper109),
      1,
      "south",
    );
    expect(whoPower(eligible)).toBe(basePower + 2000);

    const sevenDon = OnePieceTestEngine.create(
      {
        character: [op01WhoSWhoBoxTopper109],
        activeDon: 7,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    sevenDon.attachDon(
      sevenDon.findCardInZone("south", "character", op01WhoSWhoBoxTopper109),
      1,
      "south",
    );
    expect(whoPower(sevenDon)).toBe(basePower + 1000);

    const noAttachedDon = OnePieceTestEngine.create(
      {
        character: [op01WhoSWhoBoxTopper109],
        activeDon: 8,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    expect(whoPower(noAttachedDon)).toBe(basePower);

    const opponentTurn = OnePieceTestEngine.create(
      {
        character: [op01WhoSWhoBoxTopper109],
        activeDon: 8,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    opponentTurn.attachDon(
      opponentTurn.findCardInZone("south", "character", op01WhoSWhoBoxTopper109),
      1,
      "south",
    );
    opponentTurn.endTurn("south");
    expect(whoPower(opponentTurn)).toBe(basePower);
  });
});
