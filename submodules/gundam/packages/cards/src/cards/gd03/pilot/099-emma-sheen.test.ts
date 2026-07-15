import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03EmmaSheen099 } from "./099-emma-sheen.ts";

describe("Emma Sheen (GD03-099)", () => {
  it("【Burst】 adds this revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03EmmaSheen099] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03EmmaSheen099)).toBe(`hand:${PLAYER_TWO}`);
  });

  describe("【During Link】【Destroyed】If a friendly white Base is in play, choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Return it to its owner's hand.", () => {
    function destroyPairedHost({
      linkCondition = "[Emma Sheen]",
      baseColor = "white" as "white" | "blue" | null,
      enemyLevel = 4,
    } = {}) {
      const host = createMockUnit({
        name: "Emma Host",
        level: 4,
        hp: 4,
        linkCondition,
      });
      const base = baseColor === null ? null : createMockBase({ color: baseColor });
      const attacker = createMockUnit({ name: "Destroying Attacker", level: 6, ap: 8, hp: 10 });
      const returnTarget = createMockUnit({ name: "Return Target", level: enemyLevel, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03EmmaSheen099],
          play: [{ card: host, exhausted: true }],
          ...(base ? { baseSection: [base] } : {}),
          resourceArea: activeResources(4),
          deck: 3,
        },
        { play: [attacker, returnTarget], deck: 3 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const [attackerId, returnTargetId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd03EmmaSheen099, hostId));
      const pilotId = p1.getPilotId(hostId)!;
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.enterBattle(attackerId!, hostId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      return { p1, p2, hostId, pilotId, returnTargetId: returnTargetId! };
    }

    it("returns an eligible enemy Unit and visibly trashes the destroyed linked pair", () => {
      const { p1, p2, hostId, pilotId, returnTargetId } = destroyPairedHost();

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [returnTargetId],
      });
      expectSuccess(p1.resolveEffect({ targets: [returnTargetId] }));

      expect(p1.getCardZone(hostId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(pilotId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(returnTargetId)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("does not offer an enemy Unit above the destroyed linked Unit's Lv.", () => {
      const { p1, p2, returnTargetId } = destroyPairedHost({ enemyLevel: 5 });

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getCardsInZone("battleArea")).toContain(returnTargetId);
    });

    it("does not trigger without a friendly Base", () => {
      const { p1, p2, returnTargetId } = destroyPairedHost({ baseColor: null });

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getCardsInZone("battleArea")).toContain(returnTargetId);
    });

    it("does not trigger when the friendly Base is not white", () => {
      const { p1, p2, returnTargetId } = destroyPairedHost({ baseColor: "blue" });

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getCardsInZone("battleArea")).toContain(returnTargetId);
    });

    it("does not trigger when Emma's paired Unit is not linked", () => {
      const { p1, p2, returnTargetId } = destroyPairedHost({
        linkCondition: "[Kamille Bidan]",
      });

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getCardsInZone("battleArea")).toContain(returnTargetId);
    });
  });
});
