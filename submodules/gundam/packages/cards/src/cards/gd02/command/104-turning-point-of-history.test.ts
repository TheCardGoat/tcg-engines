import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  expectCardInTrash,
} from "@tcg/gundam-engine";
import { gd02TurningPointOfHistory104 } from "./104-turning-point-of-history.ts";

describe("Turning Point of History (GD02-104)", () => {
  describe("【Main】Look at the top 3 cards of your deck ... Then draw 1.", () => {
    it("draws 1 card after queueing the look-at-top task", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02TurningPointOfHistory104],
        resourceArea: activeResources(1),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;
      const deckBefore = p1.getCardsInZone("deck").length;
      const [topId, secondId, thirdId] = p1.getCardsInZone("deck");

      expectSuccess(p1.playCommand(gd02TurningPointOfHistory104));
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            0: { toTop: [topId!], toBottom: [secondId!, thirdId!] },
          },
        }),
      );

      // Net hand: -1 command, +1 draw = 0; deck -1
      expect(p1.getHand().length).toBe(handBefore);
      expect(p1.getCardsInZone("deck").length).toBe(deckBefore - 1);
    });

    it("moves the command card to trash after resolution", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02TurningPointOfHistory104],
        resourceArea: activeResources(1),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cmdId = p1.getHand()[0]!;
      const [topId, secondId, thirdId] = p1.getCardsInZone("deck");

      expectSuccess(p1.playCommand(gd02TurningPointOfHistory104));
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            0: { toTop: [topId!], toBottom: [secondId!, thirdId!] },
          },
        }),
      );
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
