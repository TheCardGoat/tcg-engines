import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op07MonkeyDLuffy073 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function payReturnDon(engine: OnePieceTestEngine, sourceId: string) {
  engine.activateEffect(sourceId, "activateMain", "south");
}

describe("OP07-073 Monkey.D.Luffy", () => {
  test("returns three DON!! to set itself active with three opposing Characters, only once", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op07MonkeyDLuffy073, rested: true }],
        activeDon: 4,
      },
      { character: [eb01Doma005, eb01Fourtricks025, eb01Doma005] },
    );
    const luffyId = engine.findCardInZone("south", "character", op07MonkeyDLuffy073);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    payReturnDon(engine, luffyId);

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.rested).toBe(
      false,
    );
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 3);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: luffyId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("still pays DON!! -3 when the post-colon Character-count condition is false", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op07MonkeyDLuffy073, rested: true }],
        activeDon: 4,
      },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );
    const luffyId = engine.findCardInZone("south", "character", op07MonkeyDLuffy073);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    payReturnDon(engine, luffyId);

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.rested).toBe(
      true,
    );
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 3);
    expect(view.prompts).toHaveLength(0);
  });
});
