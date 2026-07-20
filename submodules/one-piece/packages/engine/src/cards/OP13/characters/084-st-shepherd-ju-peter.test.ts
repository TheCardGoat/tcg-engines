import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Kaido094 } from "@tcg/op-cards";
import { op13StJaygarciaSaturn083 } from "../../../../../cards/src/cards/OP13/characters/083-st-jaygarcia-saturn.ts";
import { op13StShepherdJuPeter084 } from "../../../../../cards/src/cards/OP13/characters/084-st-shepherd-ju-peter.ts";

import { registerCards } from "../../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../index.ts";

const koByEffect: EventCard = {
  id: "TEST-OP13-084-KO",
  canonicalId: "TEST-OP13-084-KO",
  slug: "test-op13-084-ko",
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

describe("OP13-084 St. Shepherd Ju Peter", () => {
  test("may reveal no Five Elders card and bottom-orders all five looked cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13StShepherdJuPeter084],
      deck: [
        op13StJaygarciaSaturn083,
        eb01Doma005,
        eb01MountainGod018,
        op01Kaido094,
        eb01Fourtricks025,
      ],
      activeDon: op13StShepherdJuPeter084.cost,
    });

    engine.playCard(op13StShepherdJuPeter084, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Ju Peter's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Ju Peter's remainder order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    expect(order).toHaveLength(5);
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ handCount: 0, deckCount: 5 });
    expect(view.prompts).toHaveLength(0);
  });

  test("at seven trash cards survives an opponent effect while another Character is removable", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op13StShepherdJuPeter084, eb01Doma005],
        trash: Array.from({ length: 7 }, () => eb01Fourtricks025),
      },
      { hand: [koByEffect] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const juPeterId = engine.findCardInZone("south", "character", op13StShepherdJuPeter084);
    const unprotectedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(koByEffect, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the opposing removal choice.");
    const candidates = target.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).not.toContain(juPeterId);
    expect(candidates).toContain(unprotectedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [unprotectedId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(juPeterId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(unprotectedId);
    expect(view.prompts).toHaveLength(0);
  });
});
