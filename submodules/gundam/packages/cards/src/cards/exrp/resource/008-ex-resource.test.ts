import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { exrpExResource008 } from "./008-ex-resource.ts";

describe("EX Resource (EXRP-008)", () => {
  it("can be included in the resource deck as an EX Resource", () => {
    const engine = GundamTestEngine.create({ resourceDeck: [exrpExResource008] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("resourceDeck")).toHaveLength(1);
    expect(exrpExResource008.type).toBe("resource");
    expect(exrpExResource008.cardNumber).toBe("EXRP-008");
    expect(exrpExResource008.keywordEffects).toEqual([]);
  });
});
