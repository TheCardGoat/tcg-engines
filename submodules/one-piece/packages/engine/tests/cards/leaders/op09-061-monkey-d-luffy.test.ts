import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op08CandyMaiden075,
  op09GumGumLightning077,
  op09MonkeyDLuffy061,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-061 Monkey.D.Luffy", () => {
  test("ignores one returned DON!!, then adds one active and one rested after two are returned", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MonkeyDLuffy061,
        hand: [op08CandyMaiden075, op09GumGumLightning077],
        character: [eb01Doma005],
        life: [eb01Doma005],
        activeDon: 8,
        donDeckCount: 2,
      },
      {},
    );
    const characterId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.attachDon(engine.leader("south"), 1, "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === characterId)?.cost,
    ).toBe(2);

    engine.playCard(op08CandyMaiden075, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["rested-don:0"] }, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);

    engine.playCard(op09GumGumLightning077, "south");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["rested-don:0", "rested-don:1"] },
      "south",
    );

    const active = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(active?.kind).toBe("chooseOption");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    const rested = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(rested?.kind).toBe("chooseOption");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 5, restedDon: 1, donDeckCount: 3 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
