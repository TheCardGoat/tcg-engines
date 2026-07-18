import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb02JewelryBonney015,
  op10TrafalgarLaw022,
  op10Urouge101,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-015 Jewelry Bonney", () => {
  test("freezes a rested Character and activates DON!! at end of turn after leaving the field", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10TrafalgarLaw022,
        hand: [eb02JewelryBonney015],
        life: [op10Urouge101],
        activeDon: 10,
      },
      {
        character: [{ card: eb01MountainGod018, rested: true, playedOnTurn: 0 }],
        deck: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const frozenId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb02JewelryBonney015, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [frozenId] }, "south");
    const bonneyId = engine.findCardInZone("south", "character", eb02JewelryBonney015);

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 3,
      restedDon: 7,
    });

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectRevealFromLifePlay", { optionId: "keep" }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      bonneyId,
    );
    engine.endTurn("south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(3);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === frozenId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
