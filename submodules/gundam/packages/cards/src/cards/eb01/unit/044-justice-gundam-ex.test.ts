import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectBlockerAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { eb01JusticeGundamEx044 } from "./044-justice-gundam-ex.ts";

describe("Justice Gundam (EX) (EB01-044)", () => {
  /** @behavioral-proof complete: Blocker plus the standard two-player enemy-count gate are public. */
  it("does not trigger with only one enemy player", () => {
    const enemy = createMockUnit({ name: "Enemy" });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01JusticeGundamEx044],
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(eb01JusticeGundamEx044));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});

expectBlockerAbility(eb01JusticeGundamEx044);
