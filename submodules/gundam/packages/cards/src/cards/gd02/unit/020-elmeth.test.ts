import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02Elmeth020 } from "./020-elmeth.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import { gd02LalahSune089 } from "../pilot/089-lalah-sune.ts";

describe("Elmeth (GD02-020)", () => {
  describe("Printed Lv.6 and cost 5", () => {
    it("cannot deploy with only 5 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02Elmeth020],
        resourceArea: activeResources(5),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 4 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02Elmeth020],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("【Deploy】Look at the top 5 cards of your deck. You may reveal 1 green (Zeon) Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.", () => {
    it("shows the five revealed cards and adds the chosen eligible Pilot to hand", () => {
      const eligible = createMockPilot({ color: "green", traits: ["zeon"] });
      const wrongColor = createMockPilot({ color: "blue", traits: ["zeon"] });
      const wrongTrait = createMockPilot({ color: "green", traits: ["earth federation"] });
      const unit = createMockUnit({ color: "green", traits: ["zeon"] });
      const filler = createMockUnit();
      const engine = GundamTestEngine.create({
        hand: [gd02Elmeth020],
        resourceArea: activeResources(6),
        deck: [wrongColor, wrongTrait, unit, filler, eligible],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02Elmeth020));
      const choice = p1.getBoardView().pendingChoice;
      expect(choice).toMatchObject({ kind: "deckLook" });
      if (choice?.kind !== "deckLook") throw new Error("Expected a visible deck-look choice");
      expect(choice.revealedCardIds).toHaveLength(5);
      expect(choice.legalTutorCardIds).toHaveLength(1);
      const eligibleId = choice.legalTutorCardIds[0]!;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: {
              tutorCardId: eligibleId,
            },
          },
        }),
      );

      expect(p1.getCardZone(eligibleId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]!.handCount).toBe(1);
      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(4);
    });

    it("lets the player decline an eligible Pilot and returns every revealed card to deck", () => {
      const eligible = createMockPilot({ color: "green", traits: ["zeon"] });
      const engine = GundamTestEngine.create({
        hand: [gd02Elmeth020],
        resourceArea: activeResources(6),
        deck: [eligible, createMockUnit(), createMockUnit()],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02Elmeth020));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a visible deck-look choice");
      expect(choice.legalTutorCardIds).toHaveLength(1);
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: {},
          },
        }),
      );

      expect(p1.getBoardView().players[PLAYER_ONE]!.handCount).toBe(0);
      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(3);
    });

    it("shows no add-to-hand option when no revealed card matches color, trait, and type", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02Elmeth020],
        resourceArea: activeResources(6),
        deck: [
          createMockPilot({ color: "blue", traits: ["zeon"] }),
          createMockPilot({ color: "green", traits: ["earth federation"] }),
          createMockUnit({ color: "green", traits: ["zeon"] }),
        ],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02Elmeth020));
      const choice = p1.getBoardView().pendingChoice;
      expect(choice).toMatchObject({ kind: "deckLook", legalTutorCardIds: [] });
      if (choice?.kind !== "deckLook") throw new Error("Expected a visible deck-look choice");
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: {},
          },
        }),
      );

      expect(p1.getBoardView().players[PLAYER_ONE]!.handCount).toBe(0);
      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(3);
    });
  });

  describe("【During Link】 This Unit gets AP+2.", () => {
    it("shows AP+2 after Lalah Sune is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02LalahSune089],
        play: [gd02Elmeth020],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const elmethId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd02LalahSune089, elmethId));

      expect(p1.getVisibleCard(elmethId)?.effectiveAp).toBe(7);
    });

    it("keeps its printed AP when paired with a Pilot outside its Link Condition", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02JeridMessa086],
        play: [gd02Elmeth020],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const elmethId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd02JeridMessa086, elmethId));

      expect(p1.getVisibleCard(elmethId)?.effectiveAp).toBe(5);
    });
  });
});
