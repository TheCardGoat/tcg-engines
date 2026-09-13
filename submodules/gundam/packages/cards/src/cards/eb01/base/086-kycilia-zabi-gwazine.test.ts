import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectBaseBurstAndDeployAbilities } from "../../../test-helpers/base-behavior-test-helpers.ts";
import { eb01KyciliaZabiGwazine086 } from "./086-kycilia-zabi-gwazine.ts";

describe("Kycilia Zabi & Gwazine (EB01-086)", () => {
  describe("【Burst】Deploy this card. 【Deploy】Add 1 of your Shields to your hand.", () => {
    it("executes its Burst deployment and Deploy Shield ability", () => {
      expectBaseBurstAndDeployAbilities(eb01KyciliaZabiGwazine086);
    });
  });

  describe("【Once per Turn】When a friendly (G Generation) Unit links, it gains <Repair 2> during this turn.", () => {
    it("grants Repair 2 to the linked G Generation Unit only once each turn", () => {
      const firstLinked = createMockUnit({
        traits: ["g generation"],
        linkCondition: "[Link Pilot]",
      });
      const secondLinked = createMockUnit({
        traits: ["g generation"],
        linkCondition: "[Link Pilot]",
      });
      const firstPilot = createMockPilot({ name: "Link Pilot", level: 0, cost: 0 });
      const secondPilot = createMockPilot({ name: "Link Pilot", level: 0, cost: 0 });
      const engine = GundamTestEngine.create({
        hand: [firstPilot, secondPilot],
        play: [firstLinked, secondLinked],
        baseSection: [eb01KyciliaZabiGwazine086],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [firstLinkedId, secondLinkedId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(firstPilot, firstLinkedId!));
      expect(p1.getVisibleCard(firstLinkedId!)?.keywords).toContain("Repair");

      expectSuccess(p1.assignPilot(secondPilot, secondLinkedId!));
      expect(p1.getVisibleCard(secondLinkedId!)?.keywords).not.toContain("Repair");
    });
  });
});
