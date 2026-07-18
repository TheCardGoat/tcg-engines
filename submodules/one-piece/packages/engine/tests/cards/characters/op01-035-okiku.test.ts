import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01KinEmon040, op01Okiku035 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-035 Okiku", () => {
  test("with DON!! attached, rests a cost-5-or-less opponent once per turn when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op01Okiku035, attachedDon: 1, playedOnTurn: 0 },
          { card: op01KinEmon040, attachedDon: 1, playedOnTurn: 0 },
        ],
      },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const okikuId = engine.findCardInZone("south", "character", op01Okiku035);
    const kinEmonId = engine.findCardInZone("south", "character", op01KinEmon040);
    const opposingIds = engine
      .getView("south")
      .players.north.characters.filter((card) => card?.cardId === eb01Doma005.id)
      .map((card) => card!.instanceId);

    engine.declareAttack(okikuId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingIds[0]!] }, "south");

    engine.declareAttack(kinEmonId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [okikuId] }, "south");
    engine.declareAttack(okikuId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingIds[0])?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingIds[1])?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
