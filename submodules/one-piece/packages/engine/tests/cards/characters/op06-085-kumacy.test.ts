import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op06Kumacy085 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function kumacyWithTrash(trashCount: number, donCount = 2) {
  const engine = OnePieceTestEngine.create(
    {
      character: [op06Kumacy085],
      trash: Array.from({ length: trashCount }, () => eb01Doma005),
      activeDon: donCount,
    },
    {},
    { firstPlayer: "north", activeSeat: "south" },
  );
  const kumacyId = engine.findCardInZone("south", "character", op06Kumacy085);
  engine.attachDon(kumacyId, donCount, "south");
  return { engine, kumacyId };
}

function kumacyPower(engine: OnePieceTestEngine, kumacyId: string) {
  return engine
    .getView("south")
    .players.south.characters.find((card) => card?.instanceId === kumacyId)?.power;
}

describe("OP06-085 Kumacy", () => {
  test("with DON!! x2 gains +1000 for each complete group of five trash cards", () => {
    const below = kumacyWithTrash(4);
    const firstGroup = kumacyWithTrash(5);
    const secondGroup = kumacyWithTrash(10);

    expect(kumacyPower(below.engine, below.kumacyId)).toBe(5000);
    expect(kumacyPower(firstGroup.engine, firstGroup.kumacyId)).toBe(6000);
    expect(kumacyPower(secondGroup.engine, secondGroup.kumacyId)).toBe(7000);
  });

  test("requires two given DON!! and applies only during its controller's turn", () => {
    const oneDon = kumacyWithTrash(5, 1);
    expect(kumacyPower(oneDon.engine, oneDon.kumacyId)).toBe(4000);

    const opponentTurn = kumacyWithTrash(10);
    opponentTurn.engine.endTurn("south");

    expect(kumacyPower(opponentTurn.engine, opponentTurn.kumacyId)).toBe(3000);
    expect(
      opponentTurn.engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === opponentTurn.kumacyId)
        ?.attachedDon,
    ).toBe(2);
  });
});
