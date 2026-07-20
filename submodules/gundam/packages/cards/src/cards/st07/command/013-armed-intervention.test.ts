import { describe, expect, it } from "vite-plus/test";
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
import { st07ArmedIntervention013 } from "./013-armed-intervention.ts";

function revealBurst(deck: number | ReturnType<typeof createMockUnit>[] = 1): {
  p2: ReturnType<GundamTestEngine["asPlayer"]>;
  sourceCardId: string;
  directiveIndex: number;
} {
  const engine = GundamTestEngine.create(
    { play: [createMockUnit({ ap: 1, hp: 4 })] },
    { shieldArea: [st07ArmedIntervention013], deck },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
  const choice = p2.getBoardView().pendingChoice;
  if (choice?.kind !== "optional") throw new Error("Expected Armed Intervention's Burst");
  return { p2, sourceCardId: choice.sourceCardId, directiveIndex: choice.directiveIndex };
}

describe("Armed Intervention (ST07-013)", () => {
  describe("【Burst】Draw 1.", () => {
    it("draws one card for the Shield owner and trashes the revealed Command when accepted", () => {
      const { p2, sourceCardId, directiveIndex } = revealBurst([
        createMockUnit({ name: "Drawn Card" }),
      ]);
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [directiveIndex]: true } }));
      expect(p2.getHand()).toHaveLength(1);
      expect(p2.getCardZone(sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("draws nothing and trashes the revealed Command when declined", () => {
      const { p2, sourceCardId, directiveIndex } = revealBurst(1);
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [directiveIndex]: false } }));
      expect(p2.getHand()).toHaveLength(0);
      expect(p2.getCardZone(sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("resolves cleanly when accepted with an empty deck", () => {
      const { p2, sourceCardId, directiveIndex } = revealBurst(0);
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [directiveIndex]: true } }));
      expect(p2.getHand()).toHaveLength(0);
      expect(p2.getCardZone(sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("【Action】redirect to one rested friendly CB Unit", () => {
    it("offers only legal defenders, redirects the enemy attacker, and resolves damage there", () => {
      const eligible = createMockUnit({ traits: ["cb"], hp: 6 });
      const activeCb = createMockUnit({ traits: ["cb"], hp: 6 });
      const nonCb = createMockUnit({ traits: ["zeon"], hp: 6 });
      const attacker = createMockUnit({ ap: 3, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [st07ArmedIntervention013],
          resourceArea: activeResources(4),
          play: [{ card: eligible, exhausted: true }, activeCb, { card: nonCb, exhausted: true }],
          deck: 5,
        },
        { play: [attacker], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [eligibleId] = p1.getCardsInZone("battleArea");
      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p1.passBlock());
      const commandId = p1.getHand()[0]!;
      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: commandId,
        legalTargetIds: [eligibleId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));
      expect(p1.getBoardView().pendingCombat?.target).toBe(eligibleId);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getDamage(eligibleId!)).toBe(3);
    });

    it("rejects an active CB Unit, a rested non-CB Unit, and an enemy rested CB Unit", () => {
      const activeCb = createMockUnit({ traits: ["cb"] });
      const restedCb = createMockUnit({ traits: ["cb"] });
      const nonCb = createMockUnit({ traits: ["zeon"] });
      const enemyCb = createMockUnit({ traits: ["cb"] });
      const attacker = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st07ArmedIntervention013],
          resourceArea: activeResources(4),
          play: [activeCb, { card: restedCb, exhausted: true }, { card: nonCb, exhausted: true }],
        },
        { play: [attacker, { card: enemyCb, exhausted: true }] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [activeId, , nonCbId] = p1.getCardsInZone("battleArea");
      const [attackerId, enemyCbId] = p2.getCardsInZone("battleArea");
      expectSuccess(p2.enterBattle(attackerId!, "direct"));
      expectSuccess(p1.passBlock());
      expectFailure(
        p1.playCommand(st07ArmedIntervention013, { targets: [activeId!] }),
        "INVALID_TARGET",
      );
      expectFailure(
        p1.playCommand(st07ArmedIntervention013, { targets: [nonCbId!] }),
        "INVALID_TARGET",
      );
      expectFailure(
        p1.playCommand(st07ArmedIntervention013, { targets: [enemyCbId!] }),
        "INVALID_TARGET",
      );
    });

    it("cannot be played when no rested friendly CB Unit exists", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st07ArmedIntervention013],
          resourceArea: activeResources(4),
          play: [createMockUnit({ traits: ["cb"] })],
        },
        { play: [createMockUnit()] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p1.passBlock());
      expectFailure(p1.playCommand(st07ArmedIntervention013), "NO_LEGAL_TARGETS");
    });

    it("cannot be played in the Main Phase before a battle Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st07ArmedIntervention013],
        play: [{ card: createMockUnit({ traits: ["cb"] }), exhausted: true }],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectFailure(p1.playCommand(st07ArmedIntervention013), "WRONG_TIMING");
      expect(p1.getCardZone(st07ArmedIntervention013)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("enforces printed Lv.4 and cost 1 without moving the source", () => {
      const target = { card: createMockUnit({ traits: ["cb"] }), exhausted: true };
      const attacker = createMockUnit();
      const lowEngine = GundamTestEngine.create(
        { hand: [st07ArmedIntervention013], play: [target], resourceArea: activeResources(3) },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const low = lowEngine.asPlayer(PLAYER_ONE);
      const lowOpponent = lowEngine.asPlayer(PLAYER_TWO);
      expectSuccess(
        lowOpponent.enterBattle(lowOpponent.getCardsInZone("battleArea")[0]!, "direct"),
      );
      expectSuccess(low.passBlock());
      expectFailure(low.playCommand(st07ArmedIntervention013), "INSUFFICIENT_RESOURCE_LEVEL");

      const unpaidEngine = GundamTestEngine.create(
        { hand: [st07ArmedIntervention013], play: [target], resourceArea: restedResources(4) },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const unpaid = unpaidEngine.asPlayer(PLAYER_ONE);
      const opponent = unpaidEngine.asPlayer(PLAYER_TWO);
      expectSuccess(opponent.enterBattle(opponent.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(unpaid.passBlock());
      expectFailure(unpaid.playCommand(st07ArmedIntervention013), "INSUFFICIENT_RESOURCES");
      expect(unpaid.getCardZone(st07ArmedIntervention013)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
