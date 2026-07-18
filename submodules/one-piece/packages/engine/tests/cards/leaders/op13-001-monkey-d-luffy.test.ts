import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Sanji013, op12Issho082, op13MonkeyDLuffy001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP13-001 Monkey.D.Luffy", () => {
  test("maps the DON-rest count and power recipient during an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op13MonkeyDLuffy001,
        hand: [eb01Doma005],
        character: [{ card: op01Sanji013, playedOnTurn: 0 }],
        activeDon: 4,
      },
      { character: [{ card: op12Issho082, playedOnTurn: 0 }] },
    );
    const sanjiId = engine.findCardInZone("south", "character", op01Sanji013);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.endTurn("south");
    engine.declareAttack(
      engine.findCardInZone("north", "character", op12Issho082),
      engine.leader("south"),
      "north",
    );
    engine.resolveDecision("effectRestDonForPowerCount", { optionId: "2" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [sanjiId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === sanjiId)
        ?.power,
    ).toBe(7000);
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 2 });
    expect(engine.pendingDecision("battleCounter", "south")).toBeDefined();
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
