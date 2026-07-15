import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01BlitzGundam049 } from "./049-blitz-gundam.ts";

describe("Blitz Gundam (GD01-049)", () => {
  it("offers eligible friendly ZAFT Units and grants First Strike to the chosen Unit", () => {
    const eligible = createMockUnit({ traits: ["zaft"], ap: 5, hp: 5 });
    const ineligible = createMockUnit({ traits: ["zaft"], ap: 4, hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [gd01BlitzGundam049],
      play: [eligible, ineligible],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [eligibleId, ineligibleId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd01BlitzGundam049));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p1.getVisibleCard(eligibleId!)?.keywords).toContain("FirstStrike");
    expect(p1.getVisibleCard(ineligibleId!)?.keywords).not.toContain("FirstStrike");
  });

  it("does not offer a target when AP and ZAFT filters are not both satisfied", () => {
    const lowApZaft = createMockUnit({ traits: ["zaft"], ap: 4, hp: 5 });
    const highApAcademy = createMockUnit({ traits: ["academy"], ap: 5, hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [gd01BlitzGundam049],
      play: [lowApZaft, highApAcademy],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [lowApZaftId, highApAcademyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd01BlitzGundam049));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getVisibleCard(lowApZaftId!)?.keywords).not.toContain("FirstStrike");
    expect(p1.getVisibleCard(highApAcademyId!)?.keywords).not.toContain("FirstStrike");
  });

  it("links with Nicol Amarfi and can attack on the deployment turn", () => {
    const nicol = createMockPilot({ name: "Nicol Amarfi", level: 1, cost: 1 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01BlitzGundam049, nicol],
        deck: 2,
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expectSuccess(p1.deployUnit(gd01BlitzGundam049));
    const blitzId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(nicol, blitzId));

    expectSuccess(p1.enterBattle(blitzId, enemyId));
  });
});
