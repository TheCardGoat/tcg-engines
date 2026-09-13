import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockCommand,
  expectCard,
  expectFailure,
  expectPlayer,
  expectPublicLog,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  restedResources,
} from "@tcg/gundam-engine";
import { gd05KayraSReGz029 } from "./029-kayra-s-re-gz.ts";

function freeDrawCommand() {
  return createMockCommand({
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [{ action: { action: "draw", count: 1 } }],
        sourceText: "Draw 1.",
      },
    ],
  });
}

describe("Kayra's Re-GZ (GD05-029)", () => {
  describe("【Deploy】Look at the top card of your deck. Return it to the top or bottom of your deck.", () => {
    it("exposes the top card and accepts a legal move to the deck bottom", () => {
      const drawCommand = freeDrawCommand();
      const engine = GundamTestEngine.create({
        hand: [gd05KayraSReGz029, drawCommand],
        deck: 3,
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      p1.must.deployUnit(gd05KayraSReGz029);
      expectPublicLog(engine, "gundam.move.deployUnit", {
        playerId: PLAYER_ONE,
        cost: gd05KayraSReGz029.cost,
      });
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected the one-card deck look");
      const revealedId = choice.revealedCardIds[0]!;
      expect(choice.revealedCardIds).toHaveLength(1);

      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { [choice.directiveIndex]: { toBottom: [revealedId] } },
        }),
      );
      p1.must.playCommand(drawCommand);

      expectPlayer(p1).toHaveZoneCount("battleArea", 1).toHaveHandCount(1);
      expect(p1.getHand()).not.toContain(revealedId);
    });

    it("keeps the revealed card on top when that public option is selected", () => {
      const drawCommand = freeDrawCommand();
      const engine = GundamTestEngine.create({
        hand: [gd05KayraSReGz029, drawCommand],
        deck: 3,
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      p1.must.deployUnit(gd05KayraSReGz029);
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected the one-card deck look");
      const revealedId = choice.revealedCardIds[0]!;

      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { [choice.directiveIndex]: { toTop: [revealedId] } },
        }),
      );
      p1.must.playCommand(drawCommand);

      expect(p1.getHand()).toContain(revealedId);
    });

    it("finishes deploy without a deck-look prompt when the deck is empty", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05KayraSReGz029],
        deck: 0,
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      p1.must.deployUnit(gd05KayraSReGz029);

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expectCard(p1, gd05KayraSReGz029).toBeIn("battleArea");
      expectPlayer(p1).toHaveDeckCount(0);
    });

    it("stays in hand below its printed Lv.3 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05KayraSReGz029],
        resourceArea: activeResources(2),
        deck: 2,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(gd05KayraSReGz029), "INSUFFICIENT_RESOURCE_LEVEL");

      expectPlayer(p1).toHaveHandCount(1).toHaveZoneCount("battleArea", 0);
    });

    it("stays in hand when there are too few active Resources for its cost", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05KayraSReGz029],
        // Lv.3 is met by total resources, but cost 2 needs 2 active.
        resourceArea: [...activeResources(1), ...restedResources(2)],
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(gd05KayraSReGz029), "INSUFFICIENT_RESOURCES");
      expectPlayer(p1).toHaveHandCount(1).toHaveZoneCount("battleArea", 0);
    });
  });
});
