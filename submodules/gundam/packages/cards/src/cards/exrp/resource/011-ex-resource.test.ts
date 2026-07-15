import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { exrpExResource011 } from "./011-ex-resource.ts";

describe("EX Resource (EXRP-011)", () => {
  it("can be included in the resource deck as an EX Resource", () => {
    const engine = GundamTestEngine.create({ resourceDeck: [exrpExResource011] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("resourceDeck")).toHaveLength(1);
    expect(exrpExResource011.type).toBe("resource");
    expect(exrpExResource011.cardNumber).toBe("EXRP-011");
    expect(exrpExResource011.keywordEffects).toEqual([]);
  });
});
