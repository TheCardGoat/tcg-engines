import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05AWindAgainstFires119 } from "./119-a-wind-against-fires.ts";

describe("A Wind Against Fires (GD05-119)", () => {
  it("gives AP-3 to an enemy battling a friendly Lv.5-or-higher Unit", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd05AWindAgainstFires119],
        play: [{ card: createMockUnit({ level: 5, hp: 7 }), exhausted: true }],
        resourceArea: activeResources(5),
      },
      { play: [createMockUnit({ ap: 5, hp: 7 })] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(enemyId, friendlyId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.playCommand(gd05AWindAgainstFires119));
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p1.getVisibleCard(enemyId)).toMatchObject({ effectiveAp: 2 });
  });

  it("cannot target an enemy battling only a friendly Lv.4-or-lower Unit", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd05AWindAgainstFires119],
        play: [{ card: createMockUnit({ level: 4, hp: 7 }), exhausted: true }],
        resourceArea: activeResources(5),
      },
      { play: [createMockUnit({ ap: 5, hp: 7 })] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(enemyId, friendlyId));
    expectSuccess(p1.passBlock());
    expectFailure(p1.playCommand(gd05AWindAgainstFires119), "NO_LEGAL_TARGETS");
  });
});
