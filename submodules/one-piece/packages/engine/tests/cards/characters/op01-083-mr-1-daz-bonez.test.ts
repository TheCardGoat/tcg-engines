import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01Crocodile062,
  op01Mr1DazBonez083,
  op01OfficerAgents087,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-083 Mr.1 (Daz.Bonez)", () => {
  test("gains +1000 per complete pair of trashed Events only with every printed gate", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01Crocodile062,
        character: [{ card: op01Mr1DazBonez083, attachedDon: 1 }],
        trash: [
          op01OfficerAgents087,
          op01OfficerAgents087,
          op01OfficerAgents087,
          op01OfficerAgents087,
          op01OfficerAgents087,
          eb01Doma005,
          eb01Doma005,
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const mr1Id = engine.findCardInZone("south", "character", op01Mr1DazBonez083);

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === mr1Id)
        ?.power,
    ).toBe(6000);

    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === mr1Id)
        ?.power,
    ).toBe(3000);

    const noDon = OnePieceTestEngine.create(
      {
        leaderCardId: op01Crocodile062,
        character: [op01Mr1DazBonez083],
        trash: [op01OfficerAgents087, op01OfficerAgents087],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const noDonId = noDon.findCardInZone("south", "character", op01Mr1DazBonez083);
    expect(
      noDon.getView("south").players.south.characters.find((card) => card?.instanceId === noDonId)
        ?.power,
    ).toBe(3000);

    const wrongLeader = OnePieceTestEngine.create(
      {
        character: [{ card: op01Mr1DazBonez083, attachedDon: 1 }],
        trash: [op01OfficerAgents087, op01OfficerAgents087],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const wrongLeaderId = wrongLeader.findCardInZone("south", "character", op01Mr1DazBonez083);
    expect(
      wrongLeader
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === wrongLeaderId)?.power,
    ).toBe(4000);
  });
});
