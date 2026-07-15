import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { exrpExResource004 } from "./004-ex-resource.ts";

describe("EX Resource (EXRP-004)", () => {
  it("can be included in the resource deck as an EX Resource", () => {
    const engine = GundamTestEngine.create({ resourceDeck: [exrpExResource004] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("resourceDeck")).toHaveLength(1);
    expect(exrpExResource004.type).toBe("resource");
    expect(exrpExResource004.cardNumber).toBe("EXRP-004");
    expect(exrpExResource004.keywordEffects).toEqual([]);
  });
});
