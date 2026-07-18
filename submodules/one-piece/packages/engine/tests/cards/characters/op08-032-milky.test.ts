import { describe, expect, test } from "vite-plus/test";
import { op08Carrot021, op08Milky032 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-032 Milky", () => {
  test("rests itself and sets up to one DON!! active with a Minks Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op08Carrot021,
      character: [op08Milky032],
      restedDon: 1,
    });
    const milkyId = engine.findCardInZone("south", "character", op08Milky032);

    engine.activateEffect(milkyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const donCount = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    expect(donCount).toMatchObject({ kind: "chooseOption" });
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(view.players.south.characters.find((card) => card?.instanceId === milkyId)?.rested).toBe(
      true,
    );
  });

  test("may pay the rest cost but does not set DON!! active without a Minks Leader", () => {
    const engine = OnePieceTestEngine.create({
      character: [op08Milky032],
      restedDon: 1,
    });
    const milkyId = engine.findCardInZone("south", "character", op08Milky032);

    engine.activateEffect(milkyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.players.south.characters.find((card) => card?.instanceId === milkyId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
