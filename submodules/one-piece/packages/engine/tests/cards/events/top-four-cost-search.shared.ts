import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01Sanji014,
  op13Otama043,
} from "@tcg/op-cards";
import type { EventCard } from "@tcg/op-types";

import { OnePieceTestEngine } from "../../../src/index.ts";

export function defineTopFourCostSearchEventTests(card: EventCard) {
  describe(`${card.id} ${card.name}`, () => {
    test("adds a chosen cost-4-or-more card from the top 4 and bottom-decks the ordered remainder", () => {
      const engine = OnePieceTestEngine.create({
        hand: [card],
        deck: [eb01Doma005, eb01Sanji014, eb01Fourtricks025, eb01MountainGod018],
        activeDon: card.cost,
      });
      const eventId = engine.findCardInZone("south", "hand", card);
      const firstIneligibleId = engine.findCardInZone("south", "deck", eb01Doma005);
      const firstEligibleId = engine.findCardInZone("south", "deck", eb01Sanji014);
      const secondIneligibleId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
      const selectedId = engine.findCardInZone("south", "deck", eb01MountainGod018);

      engine.playCard(card);

      const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
      const searchStep = searchDecision.steps[0];
      expect(searchDecision.actorId).toBe("south");
      expect(searchStep?.kind).toBe("selectEntity");
      if (searchStep?.kind !== "selectEntity") {
        throw new Error(`Expected ${card.name} to publish its private top-4 search choice.`);
      }
      expect(
        searchStep.candidates.map((candidate) => ({
          id: candidate.ref.id,
          legal: candidate.legal,
        })),
      ).toEqual([
        { id: firstIneligibleId, legal: false },
        { id: firstEligibleId, legal: true },
        { id: secondIneligibleId, legal: false },
        { id: selectedId, legal: true },
      ]);
      engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");
      engine.resolveDecision(
        "effectSearchRemainderOrder",
        { selectedIds: [secondIneligibleId, firstEligibleId, firstIneligibleId] },
        "south",
      );

      const view = engine.getView("south");
      expect(view.players.south.hand.some((candidate) => candidate.instanceId === selectedId)).toBe(
        true,
      );
      expect(view.players.south.trash.map((candidate) => candidate.instanceId)).toContain(eventId);
      expect(view.players.south).toMatchObject({
        activeDon: 0,
        restedDon: card.cost,
      });
      expect(engine.getState().players.south.deck).toEqual([
        secondIneligibleId,
        firstEligibleId,
        firstIneligibleId,
      ]);
      expect(view.prompts).toHaveLength(0);
      expect(engine.getState().capabilityHistory).toHaveLength(0);
    });

    test("activates Main from its Life Trigger without paying the Event cost", () => {
      const engine = OnePieceTestEngine.create(
        {
          character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        },
        {
          deck: [op13Otama043, eb01Doma005, eb01Sanji014, eb01Fourtricks025, eb01MountainGod018],
          life: [card],
        },
      );
      const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

      engine.endTurn("south");
      engine.endTurn("north");
      const lookedIds = [...engine.getState().players.north.deck];
      engine.declareAttack(attackerId, engine.leader("north"), "south");
      engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
      const activeDonBeforeTrigger = engine.getView("north").players.north.activeDon;
      engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

      const searchDecision = engine.pendingDecision("effectSearchSelection", "north");
      expect(searchDecision.actorId).toBe("north");
      engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "north");
      engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: lookedIds }, "north");

      const view = engine.getView("north");
      expect(view.players.north.activeDon).toBe(activeDonBeforeTrigger);
      expect(view.players.north.trash.map((candidate) => candidate.cardId)).toContain(card.id);
      expect(view.prompts).toHaveLength(0);
      expect(engine.getState().capabilityHistory).toHaveLength(0);
    });
  });
}
