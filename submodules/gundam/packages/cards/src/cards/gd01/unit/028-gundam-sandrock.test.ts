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
import { gd01GundamSandrock028 } from "./028-gundam-sandrock.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Gundam Sandrock (GD01-028)", () => {
  it("offers and deploys the chosen Maganac Corps Unit from hand without paying its cost", () => {
    const maganac = createMockUnit({ traits: ["maganac corps"], level: 7, cost: 7 });
    const wrongTrait = createMockUnit({ traits: ["earth federation"] });
    const engine = GundamTestEngine.create({
      hand: [gd01GundamSandrock028, maganac, wrongTrait],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [, maganacId, wrongTraitId] = p1.getHand();

    expectSuccess(p1.deployUnit(gd01GundamSandrock028));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_ONE,
      directiveIndex: 0,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [maganacId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [maganacId!] }));

    expect(p1.getCardZone(gd01GundamSandrock028)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardZone(maganacId!)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardZone(wrongTraitId!)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("may decline the optional deployment and leave the Maganac Corps Unit in hand", () => {
    const maganac = createMockUnit({ traits: ["maganac corps"] });
    const engine = GundamTestEngine.create({
      hand: [gd01GundamSandrock028, maganac],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const maganacId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(gd01GundamSandrock028));
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional" });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

    expect(p1.getCardZone(maganacId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("does not show an unusable optional prompt without a Maganac Corps Unit in hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01GundamSandrock028, createMockUnit({ traits: ["earth federation"] })],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01GundamSandrock028));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
  });

  it("can attack on its deploy turn after pairing Quatre Raberba Winner", () => {
    const quatre = createMockPilot({ name: "Quatre Raberba Winner", level: 1, cost: 1 });
    const enemy = createMockUnit({ ap: 0, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01GundamSandrock028, quatre],
        resourceArea: activeResources(5),
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
    expectSuccess(p1.deployUnit(gd01GundamSandrock028));
    expectSuccess(p1.assignPilot(quatre, gd01GundamSandrock028));
    expectSuccess(p1.enterBattle(gd01GundamSandrock028, enemyId));
  });
});
