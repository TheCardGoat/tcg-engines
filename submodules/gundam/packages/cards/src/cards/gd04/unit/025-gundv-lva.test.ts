import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd04GundvLva025 } from "./025-gundv-lva.ts";

describe("Gundvölva (GD04-025)", () => {
  describe("【Destroyed】During your turn, if you have another (Dawn of Fold) Unit in play, place 1 EX Resource.", () => {
    it("places an active EX Resource token when destroyed during your turn with another Dawn of Fold Unit", () => {
      const otherDawnOfFold = createMockUnit({
        name: "Other Dawn of Fold",
        traits: ["dawn of fold"],
      });
      const engine = GundamTestEngine.create({
        play: [gd04GundvLva025, otherDawnOfFold],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gundvLvaId] = p1.getCardsInZone("battleArea");
      const resourcesBefore = p1.getCardsInZone("resourceArea");

      engine.destroyUnit(gundvLvaId!);

      const resourcesAfter = p1.getCardsInZone("resourceArea");
      const newResourceId = resourcesAfter.find((id) => !resourcesBefore.includes(id));
      const framework = engine.getRuntime().getFrameworkReadAPI();

      expect(resourcesAfter).toHaveLength(resourcesBefore.length + 1);
      expect(newResourceId).toBeDefined();
      expect(framework.cards.getDefinition(newResourceId!)?.name).toBe("EX Resource");
      expect(engine.getG().exhausted[newResourceId!] ?? false).toBe(false);
    });

    it("does not place an EX Resource without another Dawn of Fold Unit", () => {
      const nonDawnOfFold = createMockUnit({ name: "Other Unit", traits: ["academy"] });
      const engine = GundamTestEngine.create({
        play: [gd04GundvLva025, nonDawnOfFold],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gundvLvaId] = p1.getCardsInZone("battleArea");
      const resourcesBefore = p1.getCardsInZone("resourceArea").length;

      engine.destroyUnit(gundvLvaId!);

      expect(p1.getCardsInZone("resourceArea")).toHaveLength(resourcesBefore);
    });

    it("does not place an EX Resource during the opponent's turn", () => {
      const otherDawnOfFold = createMockUnit({
        name: "Other Dawn of Fold",
        traits: ["dawn of fold"],
      });
      const engine = GundamTestEngine.create({
        play: [gd04GundvLva025, otherDawnOfFold],
        resourceArea: activeResources(3),
      });
      engine.getState().ctx.status.activePlayer = PLAYER_TWO as PlayerId;
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gundvLvaId] = p1.getCardsInZone("battleArea");
      const resourcesBefore = p1.getCardsInZone("resourceArea").length;

      engine.destroyUnit(gundvLvaId!);

      expect(p1.getCardsInZone("resourceArea")).toHaveLength(resourcesBefore);
    });
  });
});
