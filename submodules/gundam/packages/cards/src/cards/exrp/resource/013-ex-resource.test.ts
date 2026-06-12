import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { exrpExResource013 } from "./013-ex-resource.ts";

describe("EX Resource (EXRP-013)", () => {
  it("can be included in the resource deck as an EX Resource", () => {
    const engine = GundamTestEngine.create({ resourceDeck: [exrpExResource013] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("resourceDeck")).toHaveLength(1);
    expect(exrpExResource013.type).toBe("resource");
    expect(exrpExResource013.cardNumber).toBe("EXRP-013");
    expect(exrpExResource013.keywordEffects).toEqual([]);
  });
});
