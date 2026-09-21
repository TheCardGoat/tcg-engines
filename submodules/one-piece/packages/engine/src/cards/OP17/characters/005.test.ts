import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-005", () => {
  test("[Blocker/ability] on-field state", () => {
    const engine = OnePieceTestEngine.create({ character: ["OP17-005"], activeDon: 3 }, {});
    expect(engine.findCardInZone("south", "character", "OP17-005")).toBeDefined();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
