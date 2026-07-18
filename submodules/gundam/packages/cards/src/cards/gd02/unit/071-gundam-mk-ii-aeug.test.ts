import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockBase,
  createMockCommand,
  createMockPilot,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02GundamMkIiAeug071 } from "./071-gundam-mk-ii-aeug.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import { gd02KamilleBidan097 } from "../pilot/097-kamille-bidan.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Gundam Mk-II (AEUG) (GD02-071)", () => {
  it("requires its printed Lv.4 and three active Resources to deploy", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02GundamMkIiAeug071],
      resourceArea: activeResources(3),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);

    expectFailure(lowP1.deployUnit(gd02GundamMkIiAeug071), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02GundamMkIiAeug071)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 4,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02GundamMkIiAeug071],
      resourceArea: activeResources(4),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(setup));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployUnit(gd02GundamMkIiAeug071), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02GundamMkIiAeug071)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("Link Condition: (AEUG) Trait", () => {
    it("becomes a Link Unit when paired with an AEUG Pilot", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02KamilleBidan097, linkCheck],
        play: [gd02GundamMkIiAeug071],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, commandId] = p1.getHand();

      expectSuccess(p1.assignPilot(pilotId!, unitId));
      const apBefore = p1.getVisibleCard(unitId)?.effectiveAp;
      expectSuccess(p1.playCommand(commandId!));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected the Link check to ask which friendly Unit gets AP+1");
      }
      expect(choice.legalTargetIds).toEqual([unitId]);
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));

      expect(apBefore).toBeDefined();
      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(apBefore! + 1);
    });

    it("does not become a Link Unit when paired with a Pilot from another faction", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02JeridMessa086, linkCheck],
        play: [gd02GundamMkIiAeug071],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, commandId] = p1.getHand();

      expectSuccess(p1.assignPilot(pilotId!, unitId));
      expectFailure(p1.playCommand(commandId!), "NO_LEGAL_TARGETS");

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  it("【Deploy】 pairs only an AEUG Pilot from hand while a friendly white Base is in play", () => {
    const whiteBase = createMockBase({ color: "white" });
    const aeugPilot = createMockPilot({ traits: ["aeug"], level: 1, cost: 5 });
    const otherPilot = createMockPilot({ traits: ["gjallarhorn"], level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [gd02GundamMkIiAeug071, aeugPilot, otherPilot],
      baseSection: [whiteBase],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [, aeugPilotId, otherPilotId] = p1.getHand();

    expectSuccess(p1.deployUnit(gd02GundamMkIiAeug071));
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    const pairChoice = p1.getBoardView().pendingChoice;
    if (pairChoice?.kind !== "optional") {
      throw new Error("Expected the visible choice to pair an AEUG Pilot");
    }
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [pairChoice.directiveIndex]: true } }));
    const pilotChoice = p1.getBoardView().pendingChoice;
    if (pilotChoice?.kind !== "targetSelection") {
      throw new Error("Expected the visible eligible AEUG Pilot choice");
    }
    expect(pilotChoice.legalTargetIds).toEqual([aeugPilotId]);
    expectSuccess(p1.resolveEffect({ targets: [aeugPilotId!] }));

    expect(p1.getPilotId(unitId)).toBe(aeugPilotId);
    expect(p1.getHand()).toContain(otherPilotId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
  });

  it("allows the player to decline pairing the AEUG Pilot", () => {
    const whiteBase = createMockBase({ color: "white" });
    const pilot = createMockPilot({ traits: ["aeug"], level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [gd02GundamMkIiAeug071, pilot],
      baseSection: [whiteBase],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const pilotId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(gd02GundamMkIiAeug071));
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const pairChoice = p1.getBoardView().pendingChoice;
    if (pairChoice?.kind !== "optional") {
      throw new Error("Expected the visible choice to pair an AEUG Pilot");
    }
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [pairChoice.directiveIndex]: false } }));

    expect(p1.getPilotId(unitId)).toBeUndefined();
    expect(p1.getHand()).toContain(pilotId);
  });

  it("does not offer pairing with only a friendly non-white Base", () => {
    const blueBase = createMockBase({ color: "blue" });
    const pilot = createMockPilot({ traits: ["aeug"], level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [gd02GundamMkIiAeug071, pilot],
      baseSection: [blueBase],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const pilotId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(gd02GundamMkIiAeug071));
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getPilotId(unitId)).toBeUndefined();
    expect(p1.getHand()).toContain(pilotId);
  });

  it("does not publish a prompt when a white Base is present but no AEUG Pilot is in hand", () => {
    const whiteBase = createMockBase({ color: "white" });
    const wrongPilot = createMockPilot({ traits: ["titans"], level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [gd02GundamMkIiAeug071, wrongPilot],
      baseSection: [whiteBase],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const wrongPilotId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(gd02GundamMkIiAeug071));
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getPilotId(unitId)).toBeUndefined();
    expect(p1.getCardZone(wrongPilotId)).toBe(`hand:${PLAYER_ONE}`);
  });
});
