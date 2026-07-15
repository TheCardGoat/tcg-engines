import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { exrpExResource010 } from "./010-ex-resource.ts";

describe("EX Resource (EXRP-010)", () => {
  it("can be included in the resource deck as an EX Resource", () => {
    const engine = GundamTestEngine.create({ resourceDeck: [exrpExResource010] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("resourceDeck")).toHaveLength(1);
    expect(exrpExResource010.type).toBe("resource");
    expect(exrpExResource010.cardNumber).toBe("EXRP-010");
    expect(exrpExResource010.keywordEffects).toEqual([]);
  });
});
