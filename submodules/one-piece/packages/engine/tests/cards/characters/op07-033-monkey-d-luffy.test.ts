import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard, EventCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01OffWhite019,
  op07MonkeyDLuffy033,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const koThree: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP07-033-KO-THREE",
  canonicalId: "TEST-OP07-033-KO-THREE",
  name: "Luffy Protection Review",
  cost: 0,
  effect: "[Main] K.O. up to 3 of your opponent's Characters.",
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
              count: { amount: 3, upTo: true },
            },
          },
        ],
      },
    ],
  },
};

const koOwnCharacter: EventCard = {
  ...koThree,
  id: "TEST-OP07-033-OWN-KO",
  canonicalId: "TEST-OP07-033-OWN-KO",
  name: "Luffy Own-Effect Review",
  effect: "[Main] K.O. up to 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
};

registerCards([koThree, koOwnCharacter]);

describe("OP07-033 Monkey.D.Luffy", () => {
  test("with three Characters protects another cost-3-or-less Character from an opponent effect", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07MonkeyDLuffy033, eb01Doma005, eb01MountainGod018] },
      { hand: [koThree] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const protectedId = engine.findCardInZone("south", "character", eb01Doma005);
    const luffyId = engine.findCardInZone("south", "character", op07MonkeyDLuffy033);
    const highCostId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.playCard(koThree, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Luffy's K.O. candidates.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(protectedId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([luffyId, highCostId]),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [luffyId, highCostId] },
      "north",
    );

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(protectedId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(protectedId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([luffyId, highCostId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not protect Monkey.D.Luffy itself or a cost-5 Character", () => {
    const targetExcludedCard = (target: CharacterCard) => {
      const engine = OnePieceTestEngine.create(
        { character: [op07MonkeyDLuffy033, eb01Doma005, eb01MountainGod018] },
        { hand: [koThree] },
        { firstPlayer: "south", activeSeat: "north" },
      );
      const targetId = engine.findCardInZone("south", "character", target);
      engine.playCard(koThree, "north");
      engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");
      expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
        targetId,
      );
    };

    targetExcludedCard(op07MonkeyDLuffy033);
    targetExcludedCard(eb01MountainGod018);
  });

  test("does not protect a low-cost Character from its controller's own effect", () => {
    const engine = OnePieceTestEngine.create({
      hand: [koOwnCharacter],
      character: [op07MonkeyDLuffy033, eb01Doma005, eb01MountainGod018],
    });
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(koOwnCharacter, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the own-effect K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });

  test("does not protect a low-cost Character while its controller has fewer than three Characters", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07MonkeyDLuffy033, eb01Doma005] },
      { hand: [koThree] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(koThree, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
