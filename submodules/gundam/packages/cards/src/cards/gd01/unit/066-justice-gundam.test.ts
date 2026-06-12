import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  canAttack,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st04AthrunZala011 } from "../../st04/pilot/011-athrun-zala.ts";
import { gd01JusticeGundam066 } from "./066-justice-gundam.ts";

describe("Justice Gundam (GD01-066)", () => {
  it("deploys a Fatum-00 Blocker token", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01JusticeGundam066],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01JusticeGundam066));

    const battle = p1.getCardsInZone("battleArea");
    expect(battle.length).toBe(2);
    const token = engine.getRuntime().getFrameworkReadAPI().cards.get(battle[1]!);
    expect(token?.definition.name).toBe("Fatum-00");
  });

  it("during pair lets a chosen TSA token attack on the turn it was deployed", () => {
    const defender = createMockUnit({ name: "Rested Defender", ap: 1, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01JusticeGundam066, st04AthrunZala011],
        resourceArea: activeResources(7),
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01JusticeGundam066));
    expectSuccess(p1.assignPilot(st04AthrunZala011, gd01JusticeGundam066));
    const [justiceId, tokenId] = p1.getCardsInZone("battleArea");
    const [defenderId] = p2.getCardsInZone("battleArea");
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(canAttack(tokenId!, engine.getG(), framework.cards, framework)).toBe(false);

    expectSuccess(p1.enterBattle(justiceId!, defenderId!));

    expect(canAttack(tokenId!, engine.getG(), framework.cards, framework)).toBe(true);
  });
});
