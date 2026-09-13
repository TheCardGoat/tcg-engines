import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb0130cmCannonApfsdsRound084 } from "./084-30cm-cannon-apfsds-round.ts";

describe("30cm Cannon (APFSDS Round) (EB01-084)", () => {
  describe("【Main】/【Action】Choose 1 Unit with <Blocker>. Set it as active. It can't attack during this turn.", () => {
    it("sets a rested Blocker active during Main and prevents it from attacking this turn", () => {
      const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
      const engine = GundamTestEngine.create({
        hand: [eb0130cmCannonApfsdsRound084],
        play: [{ card: blocker, exhausted: true }],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const blockerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(eb0130cmCannonApfsdsRound084));
      expectSuccess(p1.resolveEffect({ targets: [blockerId] }));

      expect(p1.isExhausted(blockerId)).toBe(false);
      expectFailure(p1.enterBattle(blockerId, "direct"), "CANNOT_ATTACK");
    });

    it("sets a Blocker active during a legally reached Action step", () => {
      const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
      const engine = GundamTestEngine.create({
        hand: [eb0130cmCannonApfsdsRound084],
        play: [{ card: blocker, exhausted: true }],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const blockerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(eb0130cmCannonApfsdsRound084));
      expectSuccess(p1.resolveEffect({ targets: [blockerId] }));

      expect(p1.isExhausted(blockerId)).toBe(false);
    });

    it("rejects a Unit without <Blocker>", () => {
      const nonBlocker = createMockUnit();
      const engine = GundamTestEngine.create({
        hand: [eb0130cmCannonApfsdsRound084],
        play: [nonBlocker],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const nonBlockerId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(eb0130cmCannonApfsdsRound084, { targets: [nonBlockerId] }),
        "INVALID_TARGET",
      );
      expect(p1.getCardZone(eb0130cmCannonApfsdsRound084)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
