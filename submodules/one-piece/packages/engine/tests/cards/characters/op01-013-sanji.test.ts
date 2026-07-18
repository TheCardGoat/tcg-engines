import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Sanji013 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-013 Sanji", () => {
  test("once per turn pays top Life, gains turn power, and takes up to two rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op01Sanji013],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        restedDon: 2,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sanjiId = engine.findCardInZone("south", "character", op01Sanji013);
    const topLifeId = engine.findCardInZone("south", "life", eb01Doma005);

    engine.activateEffect(sanjiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(topLifeId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === sanjiId),
    ).toMatchObject({ attachedDon: 2, power: 7000 });
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: sanjiId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === sanjiId)?.power).toBe(
      3000,
    );
  });
});
