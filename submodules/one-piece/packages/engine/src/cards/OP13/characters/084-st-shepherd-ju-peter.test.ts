import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { op13StShepherdJuPeter084 } from "../../../../../cards/src/cards/characters/op13-084-st-shepherd-ju-peter.ts";

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
  test("On Play does not search, and ten trash sets own Five Elders base power to 7000 only on your turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13StShepherdJuPeter084],
        character: ["OP13-082", eb01Doma005],
        trash: Array.from({ length: 10 }, () => eb01Fourtricks025),
        activeDon: 8,
      },
      { character: ["OP13-082"] },
    );
    const elder = engine.findCardInZone("south", "character", "OP13-082");
    const other = engine.findCardInZone("south", "character", eb01Doma005);
    engine.attachDon(elder, 1);
    engine.playCard(op13StShepherdJuPeter084);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === elder)?.power,
    ).toBe(8000);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.cardId === "OP13-084")?.power,
    ).toBe(7000);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === other)?.power,
    ).toBe(eb01Doma005.power);
    expect(engine.getView("south").players.north.characters[0]?.power).toBe(12000);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === elder)?.power,
    ).toBe(12000);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.cardId === "OP13-084")?.power,
    ).toBe(5000);
  });

  test("nine trash does not set the base power of Five Elders", () => {
    const engine = OnePieceTestEngine.create({
      character: [op13StShepherdJuPeter084, "OP13-082"],
      trash: Array.from({ length: 9 }, () => eb01Fourtricks025),
      activeDon: 1,
    });
    const elder = engine.findCardInZone("south", "character", "OP13-082");
    engine.attachDon(elder, 1);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === elder)?.power,
    ).toBe(13000);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.cardId === "OP13-084")?.power,
    ).toBe(5000);
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
    expect(candidates).toContain(juPeterId);
    expect(candidates).toContain(unprotectedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [juPeterId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(juPeterId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(unprotectedId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(juPeterId);
    expect(view.prompts).toHaveLength(0);
  });
});
