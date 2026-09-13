import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05GaiaGundam034 } from "./034-gaia-gundam.ts";

describe("Gaia Gundam (GD05-034)", () => {
  it("lets its controller deploy only a Lv.4-or-lower Phantom Pain Unit when the enemy declines to discard", () => {
    const pilot = createMockPilot();
    const eligible = createMockUnit({ name: "Eligible", level: 4, traits: ["phantom pain"] });
    const tooHigh = createMockUnit({ name: "Too high", level: 5, traits: ["phantom pain"] });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot, eligible, tooHigh],
        play: [gd05GaiaGundam034],
        resourceArea: activeResources(1),
      },
      {
        hand: [createMockUnit({ name: "Discard option" })],
        shieldArea: [createMockUnit({ name: "Shield" })],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [, eligibleId, tooHighId] = p1.getHand();
    expectSuccess(p1.assignPilot(pilot, sourceId));

    expectSuccess(p1.enterBattle(sourceId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "chooseOne",
      controllerId: PLAYER_TWO,
      options: [{ label: "Discard 1 card" }, { label: "Do not discard" }],
    });
    expectSuccess(p2.resolveEffect({ chooseOneAnswers: { 0: 1 } }));

    const deployOptional = p1.getBoardView().pendingChoice;
    if (deployOptional?.kind !== "targetSelection")
      throw new Error("Expected Gaia's optional deploy");
    expectSuccess(
      p1.resolveEffect({
        optionalAnswers: { [deployOptional.directiveIndex]: true },
      }),
    );
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p1.getCardZone(eligibleId!)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardZone(tooHighId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p2.getHand()).toHaveLength(1);
  });

  it("lets the enemy choose their discard and does not offer a deployment when they pay", () => {
    const pilot = createMockPilot();
    const deployable = createMockUnit({ level: 4, traits: ["phantom pain"] });
    const discardA = createMockUnit({ name: "Discard A" });
    const discardB = createMockUnit({ name: "Discard B" });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot, deployable],
        play: [gd05GaiaGundam034],
        resourceArea: activeResources(1),
      },
      {
        hand: [discardA, discardB],
        shieldArea: [createMockUnit({ name: "Shield" })],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const deployableId = p1.getHand()[1]!;
    const discardId = p2.getHand()[1]!;
    expectSuccess(p1.assignPilot(pilot, sourceId));
    expectSuccess(p1.enterBattle(sourceId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expectSuccess(p2.resolveEffect({ chooseOneAnswers: { 0: 0 } }));
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_TWO,
      legalTargetIds: p2.getHand(),
    });
    expectSuccess(p2.resolveEffect({ targets: [discardId] }));

    expect(p2.getCardZone(discardId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(deployableId)).toBe(`hand:${PLAYER_ONE}`);
  });
});
