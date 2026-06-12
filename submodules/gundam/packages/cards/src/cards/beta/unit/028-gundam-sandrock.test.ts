import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { betaGundamSandrock028 } from "./028-gundam-sandrock.ts";

describe("Gundam Sandrock (GD01-028)", () => {
  it("【Deploy】 deploys without recursion when no Maganac Corps unit in hand", () => {
    const engine = GundamTestEngine.create({
      hand: [betaGundamSandrock028],
      resourceArea: activeResources(5),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    // Deploy Sandrock — should not recurse because no (Maganac Corps) unit in hand.
    expectSuccess(p1.deployUnit(betaGundamSandrock028));

    // Sandrock is in play.
    expect(p1.getCardsInZone("battleArea").length).toBe(1);
  });

  it("card data has excludeSource and optional on the deploy directive", () => {
    const effect = betaGundamSandrock028.effects?.find((e) => e.type === "triggered");
    expect(effect).toBeDefined();
    // biome-ignore lint/suspicious/noExplicitAny: card-effect union is structurally tested
    const directive = (effect as any).directives?.[0];
    expect(directive?.optional).toBe(true);
    expect(directive?.action?.target?.excludeSource).toBe(true);
  });
});
