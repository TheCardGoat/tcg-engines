import { describe, expect, test } from "vite-plus/test";
import { eb02FakeStrawHatCrew005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-005 Fake Straw Hat Crew", () => {
  test("has +2000 power on its turn and -2000 power on the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [eb02FakeStrawHatCrew005] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const crewId = engine.findCardInZone("south", "character", eb02FakeStrawHatCrew005);

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === crewId)
        ?.power,
    ).toBe(5000);

    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === crewId)
        ?.power,
    ).toBe(1000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
