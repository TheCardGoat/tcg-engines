import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { exrpExResource001 } from "./001-ex-resource.ts";

describe("EX Resource (EXRP-001)", () => {
  it("can be included in the resource deck as an EX Resource", () => {
    const engine = GundamTestEngine.create({ resourceDeck: [exrpExResource001] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("resourceDeck")).toHaveLength(1);
    expect(exrpExResource001.type).toBe("resource");
    expect(exrpExResource001.cardNumber).toBe("EXRP-001");
    expect(exrpExResource001.keywordEffects).toEqual([]);
  });
});
