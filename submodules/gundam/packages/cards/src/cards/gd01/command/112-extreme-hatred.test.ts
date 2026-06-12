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
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd01ExtremeHatred112 } from "./112-extreme-hatred.ts";

describe("Extreme Hatred (GD01-112)", () => {
  describe("【Main】Rest 2 active friendly Units. Then deal 3 damage to 1 enemy Unit.", () => {
    it("rests two chosen friendly units and deals 3 damage to the chosen enemy", () => {
      const friendlyA = createMockUnit({ ap: 2, hp: 5 });
      const friendlyB = createMockUnit({ ap: 3, hp: 4 });
      const enemy = createMockUnit({ ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd01ExtremeHatred112],
          resourceArea: activeResources(6),
          play: [friendlyA, friendlyB],
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [fAId, fBId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(
        p1.playCommand(gd01ExtremeHatred112, {
          targets: [fAId!, fBId!, enemyId!],
        }),
      );

      expect(engine.getG().exhausted[fAId!]).toBe(true);
      expect(engine.getG().exhausted[fBId!]).toBe(true);
      expect(getDamageCounter(engine, enemyId!)).toBe(3);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot be played during action-phase (timing is main only)", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01ExtremeHatred112],
        resourceArea: activeResources(6),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(gd01ExtremeHatred112), "WRONG_TIMING");
    });
  });
});
