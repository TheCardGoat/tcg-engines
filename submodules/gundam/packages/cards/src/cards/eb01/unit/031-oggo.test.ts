import { describe, it } from "vite-plus/test";
import {
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { eb01Oggo031 } from "./031-oggo.ts";

describe("Oggo (EB01-031)", () => {
  it("may attack an active enemy Unit at Lv.3 but not one at Lv.4", () => {
    const eligible = createMockUnit({ level: 3 });
    const ineligible = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      { play: [eb01Oggo031] },
      { play: [eligible, ineligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, ineligibleId] = p2.getCardsInZone("battleArea");

    expectFailure(p1.enterBattle(sourceId, ineligibleId!), "INVALID_TARGET");
    expectSuccess(p1.enterBattle(sourceId, eligibleId!));
  });
});
