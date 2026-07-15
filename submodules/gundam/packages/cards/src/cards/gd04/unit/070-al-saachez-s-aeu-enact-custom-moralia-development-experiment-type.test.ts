import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04AliAlSaachez099 } from "../pilot/099-ali-al-saachez.ts";
import { gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070 } from "./070-al-saachez-s-aeu-enact-custom-moralia-development-experiment-type.ts";

describe("Al-Saachez's AEU Enact Custom Moralia Development Experiment Type (GD04-070)", () => {
  describe('【Deploy】You may pair 1 Pilot card with "Ali al-Saachez" in its card name from your hand with this Unit.', () => {
    it("pairs Ali al-Saachez from hand with this Unit when deployed", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [
            gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070,
            gd04AliAlSaachez099,
          ],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId, pilotId] = p1.getHand();

      expectSuccess(p1.deployUnit(unitId!, { targets: [pilotId!] }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        controllerId: PLAYER_ONE,
        sourceCardId: unitId,
        directiveIndex: 0,
      });
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

      expect(p1.getPilotId(unitId!)).toBe(pilotId);
      expect(p1.getCardZone(unitId!)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardZone(pilotId!)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("can decline the optional pairing after deployment", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [
            gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070,
            gd04AliAlSaachez099,
          ],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId, pilotId] = p1.getHand();

      expectSuccess(p1.deployUnit(unitId!, { targets: [pilotId!] }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        controllerId: PLAYER_ONE,
        sourceCardId: unitId,
        directiveIndex: 0,
      });
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

      expect(p1.getPilotId(unitId!)).toBeUndefined();
      expect(p1.getCardZone(unitId!)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardZone(pilotId!)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("does not present an unusable optional prompt without an Ali al-Saachez Pilot", () => {
      const otherPilot = createMockPilot({ name: "Graham Aker", color: "white" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04AlSaachezSAeuEnactCustomMoraliaDevelopmentExperimentType070, otherPilot],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId, pilotId] = p1.getHand();

      expectSuccess(p1.deployUnit(unitId!));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getPilotId(unitId!)).toBeUndefined();
      expect(p1.getCardZone(unitId!)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardZone(pilotId!)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
