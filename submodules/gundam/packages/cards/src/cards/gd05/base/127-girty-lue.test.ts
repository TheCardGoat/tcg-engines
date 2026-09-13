import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { expectBaseBurstAndDeployAbilities } from "../../../test-helpers/base-behavior-test-helpers.ts";
import { gd05GirtyLue127 } from "./127-girty-lue.ts";

describe("Girty Lue (GD05-127)", () => {
  it("executes its Burst deployment and Deploy Shield ability", () => {
    expectBaseBurstAndDeployAbilities(gd05GirtyLue127);
  });

  it("adds the top Shield to hand on Deploy without a player choice (rule 4-6-4-1)", () => {
    const topShield = createMockUnit({ name: "Top Shield" });
    const bottomShield = createMockUnit({ name: "Bottom Shield" });
    const engine = GundamTestEngine.create({
      hand: [gd05GirtyLue127],
      shieldArea: [topShield, bottomShield],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baseId = p1.getHand()[0]!;
    const [topShieldId, bottomShieldId] = p1.getCardsInZone("shieldArea");

    expectSuccess(p1.deployBase(baseId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(topShieldId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(bottomShieldId!)).toBe(`shieldArea:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(1);
  });

  it("prevents the chosen enemy Unit from activating <Blocker> after a friendly (Phantom Pain) Unit links", () => {
    const linkedUnit = createMockUnit({
      traits: ["phantom pain"],
      linkCondition: "[Link Pilot]",
    });
    const pilot = createMockPilot({ name: "Link Pilot" });
    const attacker = createMockUnit();
    const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create(
      {
        baseSection: [gd05GirtyLue127],
        hand: [pilot],
        play: [linkedUnit, attacker],
        resourceArea: activeResources(4),
      },
      { play: [blocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [linkedUnitId, attackerId] = p1.getCardsInZone("battleArea");
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, linkedUnitId!));
    expectSuccess(p1.resolveEffect({ targets: [blockerId] }));
    expectSuccess(p1.enterBattle(attackerId!, "direct"));

    expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK");
  });

  it("does not restrict <Blocker> when the newly linked Unit is not (Phantom Pain)", () => {
    const linkedUnit = createMockUnit({ traits: ["academy"], linkCondition: "[Link Pilot]" });
    const pilot = createMockPilot({ name: "Link Pilot" });
    const attacker = createMockUnit();
    const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create(
      {
        baseSection: [gd05GirtyLue127],
        hand: [pilot],
        play: [linkedUnit, attacker],
        resourceArea: activeResources(4),
      },
      { play: [blocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [linkedUnitId, attackerId] = p1.getCardsInZone("battleArea");
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, linkedUnitId!));
    expectSuccess(p1.enterBattle(attackerId!, "direct"));

    expectSuccess(p2.declareBlock(blockerId));
  });
});
