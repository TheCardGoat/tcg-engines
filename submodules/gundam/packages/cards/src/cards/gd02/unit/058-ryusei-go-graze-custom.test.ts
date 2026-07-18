/**
 * Ryusei-Go (Graze Custom Ⅱ) (GD02-058)
 *
 * 【Deploy】Choose 1 of your Units. Deal 1 damage to it. If you do,
 * draw 1. Then, discard 1.
 *
 * Exercises the generic `dependsOnPrevious` primitive on a **mandatory
 * targeted** predecessor — the damage directive is not optional, but
 * the gate still applies when no friendly Unit is available to damage.
 */

import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02RyuseiGoGrazeCustom058 } from "./058-ryusei-go-graze-custom.ts";
import { gd02ItSNameIsRyuseiGo114 } from "../command/114-it-s-name-is-ryusei-go.ts";
import { gd02LafterFrankland095 } from "../pilot/095-lafter-frankland.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Ryusei-Go (Graze Custom Ⅱ) (GD02-058)", () => {
  describe("Playing the Unit", () => {
    it("stays in hand below its printed Lv.3 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02RyuseiGoGrazeCustom058],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("stays in hand after another legal deployment leaves too few active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02RyuseiGoGrazeCustom058],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("Link Condition: (Tekkadan) Trait", () => {
    it("becomes a Link Unit when paired with a Tekkadan Pilot", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02ItSNameIsRyuseiGo114, linkCheck],
        play: [gd02RyuseiGoGrazeCustom058],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, commandId] = p1.getHand();

      expectSuccess(p1.playCommandAsPilot(pilotId!, unitId));
      const apBefore = p1.getVisibleCard(unitId)?.effectiveAp;
      expectSuccess(p1.playCommand(commandId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [unitId],
      });
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));

      expect(apBefore).toBeDefined();
      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(apBefore! + 1);
    });

    it("does not become a Link Unit when paired with a Pilot from another faction", () => {
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [gd02LafterFrankland095, linkCheck],
        play: [gd02RyuseiGoGrazeCustom058],
        resourceArea: activeResources(4),
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

  it("damages the chosen friendly Unit, draws 1, then asks which card to discard", () => {
    const friendly = createMockUnit({ ap: 1, hp: 3, level: 1 });
    const discardOption = createMockUnit({ name: "Discard Option" });
    const drawnCard = createMockUnit({ name: "Drawn Card" });
    const remainingDeckCard = createMockUnit({ name: "Remaining Deck Card" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02RyuseiGoGrazeCustom058, discardOption],
        play: [friendly],
        deck: [remainingDeckCard, drawnCard],
        resourceArea: activeResources(3),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const discardOptionId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(gd02RyuseiGoGrazeCustom058));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([friendlyId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [friendlyId] }));

    const discardChoice = p1.getBoardView().pendingChoice;
    expect(discardChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([discardOptionId]),
      minTargets: 1,
      maxTargets: 1,
    });
    if (discardChoice?.kind !== "targetSelection") {
      throw new Error("Expected Ryusei-Go to ask which card to discard after drawing");
    }
    expect(discardChoice.legalTargetIds).toHaveLength(2);
    expectSuccess(p1.resolveEffect({ targets: [discardOptionId] }));

    expect(p1.getDamage(friendlyId)).toBe(1);
    expect(p1.getCardZone(discardOptionId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(1);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
  });

  it("offers the newly deployed Unit when no other friendly Unit is available", () => {
    const discardCard = createMockUnit({ name: "Discard Option" });
    const engine = GundamTestEngine.create({
      hand: [gd02RyuseiGoGrazeCustom058, discardCard],
      deck: 2,
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getHand()[0]!;
    const discardCardId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(sourceId));
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const choice = p1.getBoardView().pendingChoice;
    expect(choice?.kind).toBe("targetSelection");
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Ryusei-Go to ask which friendly Unit to damage");
    }
    expect(choice.legalTargetIds).toEqual([unitId]);
    expectSuccess(p1.resolveEffect({ targets: [unitId] }));
    const discardChoice = p1.getBoardView().pendingChoice;
    expect(discardChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([discardCardId]),
      minTargets: 1,
      maxTargets: 1,
    });
    if (discardChoice?.kind !== "targetSelection") {
      throw new Error("Expected Ryusei-Go to ask which card to discard after drawing");
    }
    expectSuccess(p1.resolveEffect({ targets: [discardCardId] }));

    expect(p1.getDamage(unitId)).toBe(1);
    expect(p1.getCardZone(discardCardId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
  });
});
