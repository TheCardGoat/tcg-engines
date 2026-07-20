import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd04Reformationist114 } from "./114-reformationist.ts";

describe("Reformationist (GD04-114)", () => {
  describe('【Burst】Choose 1 Unit card with "Trans-Am" in its card name from your trash. Add it to your hand.', () => {
    function revealBurst(...trash: ReturnType<typeof createMockUnit>[]) {
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { shieldArea: [gd04Reformationist114], trash },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        sourceCardId: expect.any(String),
        directiveIndex: -1,
      });

      return { p1 };
    }

    it('adds the chosen Unit card with "Trans-Am" in its name when accepted', () => {
      const transAm = createMockUnit({ name: "Gundam Exia Trans-Am" });
      const { p1 } = revealBurst(transAm);
      const transAmId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: expect.any(String),
        directiveIndex: 0,
      });
      expectSuccess(p1.resolveEffect({ targets: [transAmId] }));

      expect(p1.getHand()).toContain(transAmId);
      expect(p1.getCardZone(gd04Reformationist114)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("leaves the Trans-Am Unit in trash when the Burst is declined", () => {
      const transAm = createMockUnit({ name: "Gundam Exia Trans-Am" });
      const { p1 } = revealBurst(transAm);
      const transAmId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: false } }));

      expect(p1.getCardsInZone("trash")).toContain(transAmId);
      expect(p1.getCardZone(gd04Reformationist114)).toBe(`trash:${PLAYER_ONE}`);
    });

    it('rejects a trash Unit without "Trans-Am" in its name', () => {
      const transAm = createMockUnit({ name: "Gundam Exia Trans-Am" });
      const nonMatch = createMockUnit({ name: "Gundam Exia" });
      const { p1 } = revealBurst(transAm, nonMatch);
      const [transAmId, nonMatchId] = p1.getCardsInZone("trash");

      expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
      expectFailure(p1.resolveEffect({ targets: [nonMatchId!] }), "ILLEGAL_TARGET");
      expectSuccess(p1.resolveEffect({ targets: [transAmId!] }));

      expect(p1.getCardsInZone("trash")).toContain(nonMatchId);
    });
  });

  describe("【Main】/【Action】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.", () => {
    function setup(canPay = true) {
      const friendly = createMockUnit({ hp: 3 });
      const enemy = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04Reformationist114],
          play: [friendly],
          resourceArea: canPay ? activeResources(2) : restedResources(2),
          deck: 3,
        },
        { play: [enemy], deck: 3 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      return { p1, p2, commandId, friendlyId, enemyId };
    }

    it("deals 1 damage to the chosen friendly and enemy Units during Main", () => {
      const { p1, p2, commandId, friendlyId, enemyId } = setup();

      expectSuccess(p1.playCommand(commandId, { targets: [friendlyId, enemyId] }));

      expect(p1.getDamage(friendlyId)).toBe(1);
      expect(p2.getDamage(enemyId)).toBe(1);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("deals 1 damage to both targets through the end-phase Action window", () => {
      const { p1, p2, commandId, friendlyId, enemyId } = setup();

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(commandId, { targets: [friendlyId, enemyId] }));

      expect(p1.getDamage(friendlyId)).toBe(1);
      expect(p2.getDamage(enemyId)).toBe(1);
    });

    it("rejects targets that do not include one friendly Unit and one enemy Unit", () => {
      const { p1, commandId, friendlyId } = setup();

      expectFailure(p1.playCommand(commandId, { targets: [friendlyId] }), "INVALID_TARGET");
    });

    it("cannot be played without an active Resource for its cost", () => {
      const { p1, commandId, friendlyId, enemyId } = setup(false);

      expectFailure(
        p1.playCommand(commandId, { targets: [friendlyId, enemyId] }),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });
});
