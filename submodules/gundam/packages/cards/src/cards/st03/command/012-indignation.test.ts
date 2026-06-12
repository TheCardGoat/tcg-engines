import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  findStatModifier,
  expectCardInTrash,
} from "@tcg/gundam-engine";
import { st03Indignation012 } from "./012-indignation.ts";

describe("Indignation (ST03-012)", () => {
  describe("【Main】/【Action】Choose 1 friendly Unit. It gets AP+2 during this turn.", () => {
    it("applies AP+2 modifier to a friendly unit", () => {
      const unit = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st03Indignation012],
        play: [unit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(st03Indignation012, { targets: [unitId!] }));

      const mod = findStatModifier(engine, unitId!, "ap");
      expect(mod).toBeDefined();
      expect(mod!.modifier).toBe(2);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("also fires during action-phase", () => {
      const unit = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st03Indignation012],
        play: [unit],
        resourceArea: activeResources(4),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(st03Indignation012, { targets: [unitId!] }));

      const mod = findStatModifier(engine, unitId!, "ap");
      expect(mod!.modifier).toBe(2);
    });

    it("cannot target an enemy unit", () => {
      const friendly = createMockUnit({ ap: 2, hp: 3 });
      const enemy = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st03Indignation012], play: [friendly], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(st03Indignation012, { targets: [enemyId!] }), "INVALID_TARGET");
    });
  });
});
