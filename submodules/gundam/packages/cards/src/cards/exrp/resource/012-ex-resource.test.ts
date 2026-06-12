import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { exrpExResource012 } from "./012-ex-resource.ts";

describe("EX Resource (EXRP-012)", () => {
  it("can be included in the resource deck as an EX Resource", () => {
    const engine = GundamTestEngine.create({ resourceDeck: [exrpExResource012] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("resourceDeck")).toHaveLength(1);
    expect(exrpExResource012.type).toBe("resource");
    expect(exrpExResource012.cardNumber).toBe("EXRP-012");
    expect(exrpExResource012.keywordEffects).toEqual([]);
  });
});
