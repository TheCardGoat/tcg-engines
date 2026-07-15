import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  findStatModifier,
  expectCardInTrash,
} from "@tcg/gundam-engine";
import { gd02MouarSDetermination102 } from "./102-mouar-s-determination.ts";

describe("Mouar’s Determination (GD02-102)", () => {
  describe("【Main】/【Action】Choose 1 friendly (Titans) Unit. It gets AP+2 during this turn.", () => {
    it("applies AP+2 modifier to a friendly (Titans) unit during main-phase", () => {
      const titansUnit = createMockUnit({ traits: ["titans"], ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd02MouarSDetermination102],
        play: [titansUnit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd02MouarSDetermination102, { targets: [unitId!] }));

      const mod = findStatModifier(engine, unitId!, "ap");
      expect(mod).toBeDefined();
      expect(mod!.modifier).toBe(2);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("also fires during action-phase", () => {
      const titansUnit = createMockUnit({ traits: ["titans"], ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd02MouarSDetermination102],
        play: [titansUnit],
        resourceArea: activeResources(4),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd02MouarSDetermination102, { targets: [unitId!] }));

      const mod = findStatModifier(engine, unitId!, "ap");
      expect(mod!.modifier).toBe(2);
    });

    it("cannot target a non-(Titans) unit", () => {
      const nonTitansUnit = createMockUnit({ traits: ["earth federation"], ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd02MouarSDetermination102],
        play: [nonTitansUnit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd02MouarSDetermination102, { targets: [unitId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
