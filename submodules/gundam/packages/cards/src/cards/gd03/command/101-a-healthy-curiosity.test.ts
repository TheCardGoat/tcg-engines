import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03AHealthyCuriosity101 } from "./101-a-healthy-curiosity.ts";

function healthyCuriosityCopy() {
  return createMockCommand({ name: "A Healthy Curiosity" });
}

describe("A Healthy Curiosity (GD03-101)", () => {
  it("has the printed command identity", () => {
    expect(gd03AHealthyCuriosity101.type).toBe("command");
    expect(gd03AHealthyCuriosity101.cardNumber).toBe("GD03-101");
  });

  describe('【Main】Draw 1. Then, if there are 2 or more cards with "A Healthy Curiosity" in their card name in your trash, choose 1 enemy Unit with 4 or less HP. Rest it.', () => {
    it("draws 1 and rests an enemy Unit with 4 or less HP when two copies are in trash", () => {
      const enemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03AHealthyCuriosity101],
          trash: [healthyCuriosityCopy(), healthyCuriosityCopy()],
          resourceArea: activeResources(3),
          deck: 3,
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.playCommand(gd03AHealthyCuriosity101, { targets: [enemyId] }));

      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore - 1);
      expect(engine.getG().exhausted[enemyId]).toBe(true);
    });

    it("draws 1 but does not rest the target when fewer than two copies are in trash", () => {
      const enemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03AHealthyCuriosity101],
          trash: [healthyCuriosityCopy()],
          resourceArea: activeResources(3),
          deck: 3,
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.playCommand(gd03AHealthyCuriosity101));

      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore - 1);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      expect(engine.getG().exhausted[enemyId] ?? false).toBe(false);
    });

    it("rejects an enemy Unit with more than 4 HP", () => {
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03AHealthyCuriosity101],
          trash: [healthyCuriosityCopy(), healthyCuriosityCopy()],
          resourceArea: activeResources(3),
          deck: 3,
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(gd03AHealthyCuriosity101, { targets: [enemyId] }),
        "INVALID_TARGET",
      );
    });
  });
});
