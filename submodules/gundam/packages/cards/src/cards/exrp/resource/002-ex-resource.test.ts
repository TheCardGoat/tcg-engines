import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { exrpExResource002 } from "./002-ex-resource.ts";

describe("EX Resource (EXRP-002)", () => {
  it("can be included in the resource deck as an EX Resource", () => {
    const engine = GundamTestEngine.create({ resourceDeck: [exrpExResource002] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("resourceDeck")).toHaveLength(1);
    expect(exrpExResource002.type).toBe("resource");
    expect(exrpExResource002.cardNumber).toBe("EXRP-002");
    expect(exrpExResource002.keywordEffects).toEqual([]);
  });
});
