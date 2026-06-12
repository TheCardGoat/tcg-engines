import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03DuelGundamAssaultShroud042 } from "./042-duel-gundam-assault-shroud.ts";

describe("Duel Gundam (Assault Shroud) (GD03-042)", () => {
  it("may attack an active enemy Lv.5 or lower Unit while it has 5 or more AP", () => {
    const yzak = createMockPilot({ name: "Yzak Jule", apBonus: 2 });
    const enemy = createMockUnit({ level: 5, ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [yzak],
        play: [gd03DuelGundamAssaultShroud042],
        resourceArea: activeResources(5),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(yzak, unitId));
    expectSuccess(p1.enterBattle(unitId, enemyId));
  });
});
