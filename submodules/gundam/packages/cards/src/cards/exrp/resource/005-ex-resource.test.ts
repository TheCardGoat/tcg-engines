import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { exrpExResource005 } from "./005-ex-resource.ts";

describe("EX Resource (EXRP-005)", () => {
  it("can be included in the resource deck as an EX Resource", () => {
    const engine = GundamTestEngine.create({ resourceDeck: [exrpExResource005] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("resourceDeck")).toHaveLength(1);
    expect(exrpExResource005.type).toBe("resource");
    expect(exrpExResource005.cardNumber).toBe("EXRP-005");
    expect(exrpExResource005.keywordEffects).toEqual([]);
  });
});
