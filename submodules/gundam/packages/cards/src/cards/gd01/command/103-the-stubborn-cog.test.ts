import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  isCardExhausted,
} from "@tcg/gundam-engine";
import { gd01TheStubbornCog103 } from "./103-the-stubborn-cog.ts";

describe("The Stubborn Cog (GD01-103)", () => {
  // Card text: "Choose 1 active friendly (Earth Federation) Unit and 1 active
  // enemy Unit. Rest them."
  describe("【Main】Choose 1 active friendly (Earth Federation) Unit and 1 active enemy Unit. Rest them.", () => {
    it("rests a friendly EF unit and an enemy unit", () => {
      const friendly = createMockUnit({
        ap: 2,
        hp: 3,
        traits: ["earth federation"],
      });
      const enemy = createMockUnit({
        ap: 2,
        hp: 3,
      });
      const engine = GundamTestEngine.create(
        { hand: [gd01TheStubbornCog103], play: [friendly], resourceArea: activeResources(2) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [friendlyId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01TheStubbornCog103, { targets: [friendlyId!, enemyId!] }));

      expect(isCardExhausted(engine, friendlyId!)).toBe(true);
      expect(isCardExhausted(engine, enemyId!)).toBe(true);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot be played during action-phase (timing is main only)", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01TheStubbornCog103],
        resourceArea: activeResources(2),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(gd01TheStubbornCog103), "WRONG_TIMING");
    });
  });
});
