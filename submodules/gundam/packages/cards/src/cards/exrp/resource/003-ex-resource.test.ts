import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { exrpExResource003 } from "./003-ex-resource.ts";

describe("EX Resource (EXRP-003)", () => {
  it("can be included in the resource deck as an EX Resource", () => {
    const engine = GundamTestEngine.create({ resourceDeck: [exrpExResource003] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("resourceDeck")).toHaveLength(1);
    expect(exrpExResource003.type).toBe("resource");
    expect(exrpExResource003.cardNumber).toBe("EXRP-003");
    expect(exrpExResource003.keywordEffects).toEqual([]);
  });
});
