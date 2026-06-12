import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { gd03DaughtressFlyer044 } from "./044-daughtress-flyer.ts";

describe("Daughtress Flyer (GD03-044)", () => {
  it("【Deploy】 deploys a rested Daughtress token", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03DaughtressFlyer044],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd03DaughtressFlyer044));

    const tokenId = p1.getCardsInZone("battleArea").at(-1)!;
    const token = engine.getRuntime().getFrameworkReadAPI().cards.getDefinition(tokenId);
    expect(token?.name).toBe("Daughtress");
    expect(engine.getG().exhausted[tokenId]).toBe(true);
  });
});
