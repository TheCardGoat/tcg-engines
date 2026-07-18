import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Crocodile067,
  op05BartholomewKuma011,
  op05IBid500Million096,
  op05Sabo007,
  op13StMarcusMars091,
  op13SaintRosward095,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP05-096 I Bid 500 Million!!", () => {
  test.each(["top", "bottom"] as const)(
    "Main places the chosen Character at the %s of Life face-up, then draws for an included Celestial Dragons trait",
    (position) => {
      const engine = OnePieceTestEngine.create(
        {
          hand: [op05IBid500Million096],
          deck: [eb01Fourtricks025],
          character: [op13StMarcusMars091],
          activeDon: 3,
        },
        {
          life: [eb01MountainGod018],
          character: [eb01Doma005, op05BartholomewKuma011],
        },
      );
      const targetId = engine.findCardInZone("north", "character", eb01Doma005);
      const excludedId = engine.findCardInZone("north", "character", op05BartholomewKuma011);
      const drawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

      engine.playCard(op05IBid500Million096);

      const choiceDecision = engine.pendingDecision("effectActionChoice", "south");
      const choiceStep = choiceDecision.steps[0];
      expect(choiceStep?.kind).toBe("chooseOption");
      if (choiceStep?.kind !== "chooseOption") {
        throw new Error("Expected the controller to choose among all three Main branches.");
      }
      expect(choiceStep.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
      engine.resolveDecision("effectActionChoice", { optionId: "2" }, "south");

      const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
      const targetStep = targetDecision.steps[0];
      expect(targetStep?.kind).toBe("selectEntity");
      if (targetStep?.kind !== "selectEntity") {
        throw new Error("Expected the cost-1 Life-placement target choice.");
      }
      expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
      expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
      engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
      engine.resolveDecision("effectLifePosition", { optionId: position }, "south");

      const life = engine.getState().players.north.life;
      expect(position === "top" ? life[0] : life.at(-1)).toBe(targetId);
      expect(engine.getState().cards[targetId]?.faceUp).toBe(true);
      expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
        drawId,
      );
      expect(engine.getView("south").prompts).toHaveLength(0);
      expect(engine.getState().capabilityHistory).toHaveLength(0);
    },
  );

  test.each([
    { optionId: "0", destination: "trash" },
    { optionId: "1", destination: "hand" },
  ] as const)(
    "Main option $optionId affects only a cost-1 Character and does not draw without the trait",
    ({ optionId, destination }) => {
      const engine = OnePieceTestEngine.create(
        {
          hand: [op05IBid500Million096],
          deck: [eb01Fourtricks025],
          activeDon: 3,
        },
        {
          character: [eb01Doma005, op05BartholomewKuma011],
        },
      );
      const targetId = engine.findCardInZone("north", "character", eb01Doma005);
      const excludedId = engine.findCardInZone("north", "character", op05BartholomewKuma011);
      const drawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

      engine.playCard(op05IBid500Million096);
      engine.resolveDecision("effectActionChoice", { optionId }, "south");
      const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
      const targetStep = targetDecision.steps[0];
      expect(targetStep?.kind).toBe("selectEntity");
      if (targetStep?.kind !== "selectEntity") {
        throw new Error("Expected the chosen cost-1 removal target choice.");
      }
      expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
      expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
      engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

      expect(engine.getState().players.north[destination]).toContain(targetId);
      expect(
        engine.getView("south").players.south.hand.map((card) => card.instanceId),
      ).not.toContain(drawId);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );

  test("the post-choice draw still resolves when the chosen up-to target is skipped", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05IBid500Million096],
      deck: [eb01Fourtricks025],
      character: [op13SaintRosward095],
      activeDon: 3,
    });
    const drawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op05IBid500Million096);
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test.each([
    { optionId: "0", destination: "trash" },
    { optionId: "1", destination: "hand" },
  ] as const)(
    "Life Trigger option $optionId handles the cost-6 boundary and excludes cost 7",
    ({ optionId, destination }) => {
      const engine = OnePieceTestEngine.create(
        {
          character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op05Sabo007, op01Crocodile067],
        },
        {
          life: [op05IBid500Million096],
        },
        SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
      );
      const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
      const targetId = engine.findCardInZone("south", "character", op05Sabo007);
      const excludedId = engine.findCardInZone("south", "character", op01Crocodile067);

      engine.declareAttack(attackerId, engine.leader("north"), "south");
      engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
      engine.resolveDecision("effectActionChoice", { optionId }, "north");
      const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
      const targetStep = targetDecision.steps[0];
      expect(targetStep?.kind).toBe("selectEntity");
      if (targetStep?.kind !== "selectEntity") {
        throw new Error("Expected the Trigger removal target choice.");
      }
      expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
      expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
      engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

      expect(engine.getState().players.south[destination]).toContain(targetId);
      expect(engine.getView("north").prompts).toHaveLength(0);
      expect(engine.getState().capabilityHistory).toHaveLength(0);
    },
  );
});
