import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Guntank008 } from "./008-guntank.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Guntank (GD01-008)", () => {
  it("deals 1 damage to the rested enemy Unit chosen on deploy", () => {
    const enemy = createMockUnit({ ap: 0, hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Guntank008],
        resourceArea: activeResources(2),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [enemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.deployUnit(gd01Guntank008));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p1.getCardZone(gd01Guntank008)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p2.getDamage(enemyId)).toBe(1);
  });

  it("does not offer a friendly rested Unit as the deploy target", () => {
    const friendly = createMockUnit({ ap: 0, hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Guntank008],
        play: [friendly],
        resourceArea: activeResources(2),
      },
      { shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [friendlyId]);
    expectSuccess(p1.deployUnit(gd01Guntank008));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getDamage(friendlyId)).toBe(0);
  });

  it("does not offer an active enemy Unit as the deploy target", () => {
    const enemy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [gd01Guntank008], resourceArea: activeResources(2) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd01Guntank008));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(0);
  });

  it("deploys without a prompt when no rested enemy Unit exists", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01Guntank008],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01Guntank008));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(gd01Guntank008)).toBe(`battleArea:${PLAYER_ONE}`);
  });
});
