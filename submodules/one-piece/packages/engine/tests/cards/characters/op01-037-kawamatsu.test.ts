import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Kawamatsu037 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-037 Kawamatsu", () => {
  test("plays the damaged Life card itself when its Trigger is activated", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op01Kawamatsu037] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const kawamatsuId = engine.findCardInZone("north", "life", op01Kawamatsu037);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(kawamatsuId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(kawamatsuId);
    expect(view.prompts).toHaveLength(0);
  });
});
