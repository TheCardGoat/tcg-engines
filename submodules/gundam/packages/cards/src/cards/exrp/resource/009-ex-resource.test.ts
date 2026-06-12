import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { exrpExResource009 } from "./009-ex-resource.ts";

describe("EX Resource (EXRP-009)", () => {
  it("can be included in the resource deck as an EX Resource", () => {
    const engine = GundamTestEngine.create({ resourceDeck: [exrpExResource009] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("resourceDeck")).toHaveLength(1);
    expect(exrpExResource009.type).toBe("resource");
    expect(exrpExResource009.cardNumber).toBe("EXRP-009");
    expect(exrpExResource009.keywordEffects).toEqual([]);
  });
});
