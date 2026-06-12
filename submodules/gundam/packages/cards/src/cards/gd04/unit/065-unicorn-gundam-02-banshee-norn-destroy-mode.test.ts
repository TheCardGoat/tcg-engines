import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
  findStatModifier,
} from "@tcg/gundam-engine";
import { gd04UnicornGundam02BansheeNornDestroyMode065 } from "./065-unicorn-gundam-02-banshee-norn-destroy-mode.ts";

describe("Unicorn Gundam 02 Banshee Norn (Destroy Mode) (GD04-065)", () => {
  it("【Attack】 applies AP-1 to all enemy Units this turn", () => {
    const enemy1 = createMockUnit({ ap: 4, hp: 5 });
    const enemy2 = createMockUnit({ ap: 4, hp: 5 });

    const engine = GundamTestEngine.create(
      { play: [gd04UnicornGundam02BansheeNornDestroyMode065] },
      { play: [{ card: enemy1, exhausted: true }, enemy2] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const bansheeId = p1.getCardsInZone("battleArea")[0]!;
    const [enemy1Id, enemy2Id] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(bansheeId, enemy1Id!));

    expect(findStatModifier(engine, enemy1Id!, "ap")?.modifier).toBe(-1);
    expect(findStatModifier(engine, enemy2Id!, "ap")?.modifier).toBe(-1);
  });
});
