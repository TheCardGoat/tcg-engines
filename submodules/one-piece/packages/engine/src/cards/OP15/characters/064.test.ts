import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-064 Kotori", () => {
  test("pays both costs without companions and produces no result", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP15-064"], activeDon: 2 },
      { character: ["EB01-005"] },
    );
    const source = engine.findCardInZone("south", "character", "OP15-064");
    engine.activateEffect(source, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.characters[0]?.rested).toBe(true);
    expect(view.players.north.characters[0]?.rested).toBe(false);
    expect(view.players.north.characters[0]?.power).toBe(3000);
    expect(view.prompts).toHaveLength(0);
  });
  test("with both companions pays costs and affects the selected opponent", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP15-064", "OP15-066", "OP15-072"], activeDon: 2 },
      { character: ["EB01-005", "OP01-025"] },
    );
    const target = engine.findCardInZone("north", "character", "EB01-005");
    engine.activateEffect(
      engine.findCardInZone("south", "character", "OP15-064"),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.characters[0]?.rested).toBe(true);
    expect(view.players.north.characters[0]?.rested).toBe(true);
    expect(view.players.north.characters[1]?.power).toBe(5000);
  });
  test("declines the optional payment and keeps both DON and the active source", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP15-064", "OP15-066", "OP15-072"], activeDon: 2 },
      { character: ["EB01-005"] },
    );
    engine.activateEffect(
      engine.findCardInZone("south", "character", "OP15-064"),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(2);
    expect(view.players.south.characters[0]?.rested).toBe(false);
    expect(view.players.north.characters[0]?.power).toBe(3000);
    expect(view.prompts).toHaveLength(0);
  });
});
