import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { betaAsticassiaSchoolOfTechnologyEarthHouse016 as betaAsticassia016 } from "./016-asticassia-school-of-technology-earth-house.ts";

describe("Asticassia School of Technology, Earth House (ST01-016)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("deploys the revealed Shield into its owner's Base section", () => {
      const engine = GundamTestEngine.create(
        { play: [createMockUnit({ ap: 1, hp: 4 })] },
        { shieldArea: [betaAsticassia016] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      const baseId = burst.sourceCardId;
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(baseId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
    });
  });

  describe("【Activate･Main】Rest this Base：All friendly Link Units get AP+1 during this turn.", () => {
    it("rests Earth House and raises only its controller's linked Unit", () => {
      const host = createMockUnit({ ap: 2, hp: 3, linkCondition: "[Test Pilot]" });
      const nonLink = createMockUnit({ ap: 2, hp: 3 });
      const pilot = createMockPilot({ name: "Test Pilot", cost: 0, apBonus: 0, hpBonus: 0 });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        baseSection: [betaAsticassia016],
        play: [host, nonLink],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [hostId, nonLinkId] = p1.getCardsInZone("battleArea");
      const baseId = p1.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.assignPilot(pilot, hostId!));
      expectSuccess(p1.activateBaseAbility(baseId));

      expect(p1.isExhausted(baseId)).toBe(true);
      expect(p1.getVisibleCard(hostId!)?.effectiveAp).toBe(3);
      expect(p1.getVisibleCard(nonLinkId!)?.effectiveAp).toBe(2);
    });
  });
});
