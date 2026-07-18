import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02EdwardNewgate001,
  op02Jozu008,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-008 Jozu", () => {
  test("gains Rush with one DON!!, two Life, and a compound Whitebeard Pirates Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EdwardNewgate001,
        hand: [op02Jozu008],
        life: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: 5,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op02Jozu008, "south");
    const jozuId = engine.findCardInZone("south", "character", op02Jozu008);
    engine.attachDon(jozuId, 1, "south");
    engine.declareAttack(jozuId, engine.leader("north"), "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === jozuId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not gain Rush above the two-Life boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EdwardNewgate001,
        hand: [op02Jozu008],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: 5,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op02Jozu008, "south");
    const jozuId = engine.findCardInZone("south", "character", op02Jozu008);
    engine.attachDon(jozuId, 1, "south");

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: jozuId,
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
  });
});
