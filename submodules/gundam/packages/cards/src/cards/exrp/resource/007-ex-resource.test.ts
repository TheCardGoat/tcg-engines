import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { exrpExResource007 } from "./007-ex-resource.ts";

describe("EX Resource (EXRP-007)", () => {
  it("can be included in the resource deck as an EX Resource", () => {
    const engine = GundamTestEngine.create({ resourceDeck: [exrpExResource007] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("resourceDeck")).toHaveLength(1);
    expect(exrpExResource007.type).toBe("resource");
    expect(exrpExResource007.cardNumber).toBe("EXRP-007");
    expect(exrpExResource007.keywordEffects).toEqual([]);
  });
});
