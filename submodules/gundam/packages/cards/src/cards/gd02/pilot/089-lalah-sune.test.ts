import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02LalahSune089 } from "./089-lalah-sune.ts";

describe("Lalah Sune (GD02-089)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02LalahSune089] },
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
      throw new Error("Expected Lalah Sune's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02LalahSune089)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("grants Breach 1 to the chosen other Zeon Link Unit for the turn", () => {
    const host = createMockUnit({ name: "Lalah Host" });
    const linkTarget = createMockUnit({
      name: "Zeon Link Target",
      traits: ["zeon"],
      linkCondition: "[Link Pilot]",
    });
    const linkPilot = createMockPilot({ name: "Link Pilot", level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [linkPilot, gd02LalahSune089],
      play: [host, linkTarget],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, linkTargetId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(linkPilot, linkTargetId!));
    expectSuccess(p1.assignPilot(gd02LalahSune089, hostId!));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible choice of another Zeon Link Unit");
    }
    expect(choice.legalTargetIds).toEqual([linkTargetId]);
    expectSuccess(p1.resolveEffect({ targets: [linkTargetId!] }));

    expect(p1.getVisibleCard(linkTargetId!)?.keywordEffects).toContainEqual({
      keyword: "Breach",
      value: 1,
    });
    expect(p1.getVisibleCard(hostId!)?.keywords).not.toContain("Breach");
  });

  it("does not offer an unlinked Zeon Unit or a linked non-Zeon Unit", () => {
    const host = createMockUnit({ name: "Lalah Host" });
    const unlinkedZeon = createMockUnit({ traits: ["zeon"] });
    const nonZeonLink = createMockUnit({
      traits: ["aeug"],
      linkCondition: "[Link Pilot]",
    });
    const linkPilot = createMockPilot({ name: "Link Pilot", level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [linkPilot, gd02LalahSune089],
      play: [host, unlinkedZeon, nonZeonLink],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, unlinkedZeonId, nonZeonLinkId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(linkPilot, nonZeonLinkId!));
    expectSuccess(p1.assignPilot(gd02LalahSune089, hostId!));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getVisibleCard(unlinkedZeonId!)?.keywords).not.toContain("Breach");
    expect(p1.getVisibleCard(nonZeonLinkId!)?.keywords).not.toContain("Breach");
  });

  it("requires both its printed Lv.3 and one active Resource to be paired", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02LalahSune089],
      play: [createMockUnit({ name: "Low-Level Host" })],
      resourceArea: activeResources(2),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    const lowHostId = lowP1.getCardsInZone("battleArea")[0]!;

    expectFailure(lowP1.assignPilot(gd02LalahSune089, lowHostId), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02LalahSune089)).toBe(`hand:${PLAYER_ONE}`);
    expect(lowP1.getPilotId(lowHostId)).toBeUndefined();

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 3,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02LalahSune089],
      play: [createMockUnit({ name: "Cost-Gate Host" })],
      resourceArea: activeResources(3),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.assignPilot(gd02LalahSune089, hostId), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02LalahSune089)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
