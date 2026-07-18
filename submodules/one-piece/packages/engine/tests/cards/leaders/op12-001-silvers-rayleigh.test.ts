import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op08PhoenixBrand055,
  op11Doll008,
  op12SilversRayleigh001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-001 Silvers Rayleigh", () => {
  test("reveals exactly two Events without discarding them and boosts a low-power Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12SilversRayleigh001,
      hand: [op08PhoenixBrand055, op08PhoenixBrand055, op08PhoenixBrand055, eb01Doma005],
      character: [{ card: op11Doll008, playedOnTurn: 0 }],
    });
    const eventIds = engine
      .getView("south")
      .players.south.hand.filter((card) => card.cardId === op08PhoenixBrand055.id)
      .map((card) => card.instanceId)
      .filter((id): id is string => Boolean(id))
      .slice(0, 2);
    const targetId = engine.findCardInZone("south", "character", op11Doll008);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostRevealFromHand", { selectedIds: eventIds }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(eventIds),
    );
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(3000);
    expect(op12SilversRayleigh001.effects?.deckBuildingRules).toEqual([
      { rule: "cannotInclude", filters: [{ filter: "cost", comparison: "gte", value: 5 }] },
    ]);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
