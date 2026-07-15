import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { exrpExResource006 } from "./006-ex-resource.ts";

describe("EX Resource (EXRP-006)", () => {
  it("can be included in the resource deck as an EX Resource", () => {
    const engine = GundamTestEngine.create({ resourceDeck: [exrpExResource006] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("resourceDeck")).toHaveLength(1);
    expect(exrpExResource006.type).toBe("resource");
    expect(exrpExResource006.cardNumber).toBe("EXRP-006");
    expect(exrpExResource006.keywordEffects).toEqual([]);
  });
});
