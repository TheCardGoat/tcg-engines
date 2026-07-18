import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op05BeloBetty002 } from "@tcg/op-cards";
import { op09Karasu100 } from "../../../../../cards/src/cards/OP09/characters/100-karasu.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-100 Karasu", () => {
  test("Life Trigger offers to play this physical card at five total Life or less", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { leaderCardId: op05BeloBetty002, life: [op09Karasu100] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const karasuId = engine.findCardInZone("north", "life", op09Karasu100);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(karasuId);
  });
});
