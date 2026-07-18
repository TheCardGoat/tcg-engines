import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02OrgaCrotAndShani087 } from "./087-orga-crot-and-shani.ts";

describe("Orga, Crot, and Shani (GD02-087)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02OrgaCrotAndShani087] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstChoice = p2.getBoardView().pendingChoice;
    if (burstChoice?.kind !== "optional") {
      throw new Error("Expected Orga, Crot, and Shani's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02OrgaCrotAndShani087)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("rests the chosen enemy Blocker when linked to a blue Unit", () => {
    const host = createMockUnit({
      color: "blue",
      linkCondition: "[Orga, Crot, and Shani]",
    });
    const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const plainEnemy = createMockUnit();
    const engine = GundamTestEngine.create(
      {
        hand: [gd02OrgaCrotAndShani087],
        play: [host],
        resourceArea: activeResources(5),
      },
      { play: [blocker, plainEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [blockerId, plainEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd02OrgaCrotAndShani087, hostId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible enemy Blocker choice");
    }
    expect(choice.legalTargetIds).toEqual([blockerId]);
    expectSuccess(p1.resolveEffect({ targets: [blockerId!] }));

    expect(p2.isExhausted(blockerId!)).toBe(true);
    expect(p2.isExhausted(plainEnemyId!)).toBe(false);
  });

  it("does not offer a target when linked to a non-blue Unit", () => {
    const host = createMockUnit({
      color: "red",
      linkCondition: "[Orga, Crot, and Shani]",
    });
    const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02OrgaCrotAndShani087],
        play: [host],
        resourceArea: activeResources(5),
      },
      { play: [blocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02OrgaCrotAndShani087, hostId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(blockerId)).toBe(false);
  });

  it("requires both its printed Lv.5 and one active Resource to be paired", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02OrgaCrotAndShani087],
      play: [createMockUnit({ name: "Low-Level Host" })],
      resourceArea: activeResources(4),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    const lowHostId = lowP1.getCardsInZone("battleArea")[0]!;

    expectFailure(
      lowP1.assignPilot(gd02OrgaCrotAndShani087, lowHostId),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowP1.getCardZone(gd02OrgaCrotAndShani087)).toBe(`hand:${PLAYER_ONE}`);
    expect(lowP1.getPilotId(lowHostId)).toBeUndefined();

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 5,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02OrgaCrotAndShani087],
      play: [createMockUnit({ name: "Cost-Gate Host" })],
      resourceArea: activeResources(5),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.assignPilot(gd02OrgaCrotAndShani087, hostId), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02OrgaCrotAndShani087)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
