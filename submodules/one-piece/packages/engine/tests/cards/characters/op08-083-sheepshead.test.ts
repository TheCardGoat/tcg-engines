import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, eb01MountainGod018, op08Sheepshead083 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-083 Sheepshead", () => {
  test("with DON!! attached reduces all opposing Characters only during its controller's turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op08Sheepshead083], activeDon: 1 },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sheepsheadId = engine.findCardInZone("south", "character", op08Sheepshead083);
    const costThreeId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const costFiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.attachDon(sheepsheadId, 1, "south");

    let view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costThreeId)?.cost,
    ).toBe(2);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costFiveId)?.cost,
    ).toBe(4);

    engine.endTurn("south");
    view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costThreeId)?.cost,
    ).toBe(3);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costFiveId)?.cost,
    ).toBe(5);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === sheepsheadId)?.attachedDon,
    ).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
