import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Kaido094 } from "@tcg/op-cards";
import { op13StJaygarciaSaturn083 } from "../../../../../cards/src/cards/OP13/characters/083-st-jaygarcia-saturn.ts";
import { op13StShepherdJuPeter084 } from "../../../../../cards/src/cards/OP13/characters/084-st-shepherd-ju-peter.ts";

import { registerCards } from "../../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../index.ts";

const koByEffect: EventCard = {
  id: "TEST-OP13-083-KO",
  canonicalId: "TEST-OP13-083-KO",
  slug: "test-op13-083-ko",
  name: "K.O. by Effect",
  printings: [],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "TEST",
  cost: 0,
  traits: [],
  effect: "[Main] K.O. up to 1 of your opponent's Characters.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
  i18n: { en: { name: "K.O. by Effect" } },
};

registerCards([koByEffect]);

describe("OP13-083 St. Jaygarcia Saturn", () => {
  test("searches five for an included Five Elders card and bottom-orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13StJaygarciaSaturn083],
      deck: [
        op13StShepherdJuPeter084,
        eb01Doma005,
        eb01MountainGod018,
        op01Kaido094,
        eb01Fourtricks025,
        eb01Doma005,
      ],
      activeDon: op13StJaygarciaSaturn083.cost,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op13StShepherdJuPeter084);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op13StJaygarciaSaturn083, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Saturn's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Saturn's remainder order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    expect(order).toHaveLength(4);
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.deckCount).toBe(5);
    expect(view.prompts).toHaveLength(0);
  });

  test("at seven trash cards cannot be selected by an opponent effect for removal", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op13StJaygarciaSaturn083, eb01Doma005],
        trash: Array.from({ length: 7 }, () => eb01Fourtricks025),
      },
      { hand: [koByEffect] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const saturnId = engine.findCardInZone("south", "character", op13StJaygarciaSaturn083);
    const unprotectedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(koByEffect, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the opposing removal choice.");
    const candidates = target.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).not.toContain(saturnId);
    expect(candidates).toContain(unprotectedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [unprotectedId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(saturnId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(unprotectedId);
    expect(view.prompts).toHaveLength(0);
  });
});
