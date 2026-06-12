import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
} from "@tcg/gundam-engine";
import { gd02PoliceZakuArmoredRruType035 } from "./035-police-zaku-armored-rru-type.ts";

describe("Police Zaku (Armored RRU Type) (GD02-035)", () => {
  it("This Unit can't choose the enemy player as its attack target.", () => {
    const enemy = createMockUnit({ ap: 1, hp: 2 });
    const engine = GundamTestEngine.create(
      { play: [gd02PoliceZakuArmoredRruType035] },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [policeZakuId] = p1.getCardsInZone("battleArea");
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    // Direct attack should be rejected
    expectFailure(p1.enterBattle(policeZakuId!, "direct"), "CANNOT_TARGET_PLAYER");

    // Attacking an enemy unit should still work
    expectSuccess(p1.enterBattle(policeZakuId!, enemyId!));
  });
});
