import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05ForbiddenGundam012 } from "./012-forbidden-gundam.ts";

describe("Forbidden Gundam (GD05-012)", () => {
  /** @behavioral-proof complete: Link timing, owner/state/level target filter, return destination, and no-target branch are public. */
  describe("【When Linked】Choose 1 rested enemy Unit that is Lv.3 or lower. Return it to its owner's hand.", () => {
    it("returns only the chosen rested enemy Unit at the Lv.3 limit", () => {
      const pilot = createMockPilot({ traits: ["biological cpu"] });
      const eligible = createMockUnit({ level: 3 });
      const tooHigh = createMockUnit({ level: 4 });
      const active = createMockUnit({ level: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd05ForbiddenGundam012],
          resourceArea: activeResources(4),
        },
        {
          play: [{ card: eligible, exhausted: true }, { card: tooHigh, exhausted: true }, active],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sourceId = p1.getCardsInZone("battleArea")[0]!;
      const [eligibleId, tooHighId, activeId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, sourceId));
      const choice = p1.getBoardView().pendingChoice;
      expect(choice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [eligibleId],
      });
      expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

      expect(p2.getCardZone(eligibleId!)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getCardZone(tooHighId!)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p2.getCardZone(activeId!)).toBe(`battleArea:${PLAYER_TWO}`);
    });

    it("does not publish a target choice when every enemy Unit is active or above Lv.3", () => {
      const pilot = createMockPilot({ traits: ["biological cpu"] });
      const active = createMockUnit({ level: 3 });
      const tooHigh = createMockUnit({ level: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd05ForbiddenGundam012],
          resourceArea: activeResources(4),
        },
        { play: [active, { card: tooHigh, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sourceId = p1.getCardsInZone("battleArea")[0]!;
      const [activeId, tooHighId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, sourceId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getCardZone(activeId!)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p2.getCardZone(tooHighId!)).toBe(`battleArea:${PLAYER_TWO}`);
    });
  });
});
