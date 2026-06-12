import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03OrgaSOrder117 } from "./117-orga-s-order.ts";

function findToken(engine: GundamTestEngine, tokenName: string): boolean {
  const framework = engine.getRuntime().getFrameworkReadAPI();
  return engine
    .asPlayer(PLAYER_ONE)
    .getCardsInZone("battleArea")
    .some((id) => {
      const def = framework.cards.getDefinition(id) as { name?: string } | undefined;
      return def?.name === tokenName;
    });
}

describe("Orga's Order (GD03-117)", () => {
  it("【Main】 deploys a Graze Custom token when 1–4 enemy Units are in play", () => {
    const enemy1 = createMockUnit({ ap: 1, hp: 1 });
    const enemy2 = createMockUnit({ ap: 1, hp: 1 });

    const engine = GundamTestEngine.create(
      { hand: [gd03OrgaSOrder117], resourceArea: activeResources(3) },
      { play: [enemy1, enemy2] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(gd03OrgaSOrder117));

    expect(findToken(engine, "Graze Custom")).toBe(true);
    expect(findToken(engine, "Gundam Barbatos 4th Form")).toBe(false);
  });

  it("【Main】 deploys a Gundam Barbatos 4th Form token when 5+ enemy Units are in play", () => {
    const enemies = Array.from({ length: 5 }, () => createMockUnit({ ap: 1, hp: 1 }));

    const engine = GundamTestEngine.create(
      { hand: [gd03OrgaSOrder117], resourceArea: activeResources(3) },
      { play: enemies },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(gd03OrgaSOrder117));

    expect(findToken(engine, "Gundam Barbatos 4th Form")).toBe(true);
    expect(findToken(engine, "Graze Custom")).toBe(false);
  });

  it("【Main】 deploys nothing when there are 0 enemy Units in play", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03OrgaSOrder117],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(gd03OrgaSOrder117));

    expect(findToken(engine, "Graze Custom")).toBe(false);
    expect(findToken(engine, "Gundam Barbatos 4th Form")).toBe(false);
  });
});
