import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01Izo002,
  op02Vista011,
  op08Kingdew044,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-044 Kingdew", () => {
  test("once per turn reveals two inclusive Whitebeard Pirates cards for 2000 power", () => {
    const engine = OnePieceTestEngine.create({
      character: [op08Kingdew044],
      hand: [eb01Doma005, eb01Izo002, op02Vista011, eb01Fourtricks025],
    });
    const kingdewId = engine.findCardInZone("south", "character", op08Kingdew044);
    const firstRevealId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondRevealId = engine.findCardInZone("south", "hand", eb01Izo002);
    const excludedId = engine.findCardInZone("south", "hand", eb01Fourtricks025);

    engine.activateEffect(kingdewId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostRevealFromHand", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 2, max: 2 });
    if (cost?.kind !== "payCost") throw new Error("Expected Kingdew's reveal payment.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstRevealId, secondRevealId]),
    );
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision(
      "effectCostRevealFromHand",
      { selectedIds: [firstRevealId, secondRevealId] },
      "south",
    );

    let view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === kingdewId)?.power,
    ).toBe((op08Kingdew044.power ?? 0) + 2000);
    expect(
      engine
        .getView("north")
        .logs.some(
          (entry) =>
            entry.message.includes(eb01Doma005.name) && entry.message.includes(eb01Izo002.name),
        ),
    ).toBe(true);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: kingdewId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === kingdewId)?.power,
    ).toBe(op08Kingdew044.power);
  });

  test("cannot activate without two eligible reveal cards", () => {
    const engine = OnePieceTestEngine.create({
      character: [op08Kingdew044],
      hand: [eb01Doma005, eb01Fourtricks025],
    });
    const kingdewId = engine.findCardInZone("south", "character", op08Kingdew044);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: kingdewId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
