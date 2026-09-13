import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05HokaKyotenJuzetsujin112 } from "../command/112-hoka-kyoten-juzetsujin.ts";
import { gd05DragonGundam035 } from "./035-dragon-gundam.ts";

function finishBattle(
  p1: ReturnType<GundamTestEngine["asPlayer"]>,
  p2: ReturnType<GundamTestEngine["asPlayer"]>,
) {
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
}

function pairedMainCommand(pilotName: string) {
  return createMockCommand({
    name: `${pilotName} Special Move`,
    pilotName,
    level: 1,
    cost: 1,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [{ action: { action: "draw", count: 1 } }],
        sourceText: "【Main】Draw 1.",
      },
    ],
  });
}

describe("Dragon Gundam (GD05-035)", () => {
  /** @behavioral-proof complete: both printed abilities, filters, source gate, and once-per-turn are public. */
  describe("【Once per Turn】When this Unit destroys an enemy shield area card with damage, choose 1 enemy Unit with 3 or less AP. Deal 2 damage to it.", () => {
    it("offers only an enemy Unit with 3 or less AP and deals 2 damage to the choice", () => {
      const eligible = createMockUnit({ name: "Eligible", ap: 3, hp: 5 });
      const highAp = createMockUnit({ name: "High AP", ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd05DragonGundam035], deck: 5 },
        {
          play: [eligible, highAp],
          shieldArea: [createMockUnit({ name: "Enemy Shield" })],
          deck: 5,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const dragonId = p1.getCardsInZone("battleArea")[0]!;
      const [eligibleId, highApId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(dragonId, "direct"));
      finishBattle(p1, p2);

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: dragonId,
        legalTargetIds: [eligibleId],
      });
      expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

      expect(p2.getDamage(eligibleId!)).toBe(2);
      expect(p2.getDamage(highApId!)).toBe(0);
    });

    it("does not trigger when another friendly Unit destroys the Shield", () => {
      const otherAttacker = createMockUnit({ name: "Other Attacker", ap: 3 });
      const target = createMockUnit({ name: "Damage Target", ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd05DragonGundam035, otherAttacker], deck: 5 },
        {
          play: [target],
          shieldArea: [createMockUnit({ name: "Enemy Shield" })],
          deck: 5,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [, otherId] = p1.getCardsInZone("battleArea");
      const targetId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(otherId!, "direct"));
      finishBattle(p1, p2);

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(targetId)).toBe(0);
    });

    it("does not create a target choice when every enemy Unit has 4 or more AP", () => {
      const highAp = createMockUnit({ name: "High AP", ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd05DragonGundam035], deck: 5 },
        {
          play: [highAp],
          shieldArea: [createMockUnit({ name: "Enemy Shield" })],
          deck: 5,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const dragonId = p1.getCardsInZone("battleArea")[0]!;
      const highApId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(dragonId, "direct"));
      finishBattle(p1, p2);

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(highApId)).toBe(0);
    });

    it("triggers only once when Dragon Gundam destroys two Shields in the same turn", () => {
      const setActive = createMockCommand({
        name: "Set Dragon Active",
        level: 1,
        cost: 1,
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [
              {
                action: {
                  action: "setActive",
                  target: { owner: "friendly", cardType: "unit", count: 1 },
                },
              },
            ],
            sourceText: "【Main】Choose 1 friendly Unit. Set it as active.",
          },
        ],
      });
      const target = createMockUnit({ name: "Damage Target", ap: 3, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [setActive],
          play: [gd05DragonGundam035],
          resourceArea: activeResources(1),
          deck: 5,
        },
        {
          play: [target],
          shieldArea: [
            createMockUnit({ name: "First Shield" }),
            createMockUnit({ name: "Second Shield" }),
          ],
          deck: 5,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const dragonId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(dragonId, "direct"));
      finishBattle(p1, p2);
      expectSuccess(p1.resolveEffect({ targets: [targetId] }));
      expect(p2.getDamage(targetId)).toBe(2);

      expectSuccess(p1.playCommand(setActive, { targets: [dragonId] }));
      expectSuccess(p1.enterBattle(dragonId, "direct"));
      finishBattle(p1, p2);

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(targetId)).toBe(2);
      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
    });
  });

  describe("【During Link】【Attack】Activate 【Main】 on the card paired with this Unit.", () => {
    it("activates the paired Sai Saici card's Main effect when Dragon Gundam attacks", () => {
      const specialMove = pairedMainCommand("Sai Saici");
      const engine = GundamTestEngine.create({
        hand: [specialMove],
        play: [gd05DragonGundam035],
        resourceArea: activeResources(5),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const dragonId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommandAsPilot(specialMove, dragonId));
      const handBeforeAttack = p1.getHand().length;
      expectSuccess(p1.enterBattle(dragonId, "direct"));

      expect(p1.getHand()).toHaveLength(handBeforeAttack + 1);
    });

    it("does not activate the paired Main effect before Dragon Gundam attacks", () => {
      const specialMove = pairedMainCommand("Sai Saici");
      const engine = GundamTestEngine.create({
        hand: [specialMove],
        play: [gd05DragonGundam035],
        resourceArea: activeResources(5),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const dragonId = p1.getCardsInZone("battleArea")[0]!;
      const handBeforePairing = p1.getHand().length;

      expectSuccess(p1.playCommandAsPilot(specialMove, dragonId));

      expect(p1.getHand()).toHaveLength(handBeforePairing - 1);
    });

    it("does not activate Main when the paired card does not satisfy the Link condition", () => {
      const wrongPilot = pairedMainCommand("Wrong Pilot");
      const engine = GundamTestEngine.create({
        hand: [wrongPilot],
        play: [gd05DragonGundam035],
        resourceArea: activeResources(5),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const dragonId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommandAsPilot(wrongPilot, dragonId));
      const handBeforeAttack = p1.getHand().length;
      expectSuccess(p1.enterBattle(dragonId, "direct"));

      expect(p1.getHand()).toHaveLength(handBeforeAttack);
    });

    it("resolves Hoka Kyoten Juzetsujin's Main but does not activate its trash-only Pair clause", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05HokaKyotenJuzetsujin112],
        play: [gd05DragonGundam035],
        resourceArea: activeResources(5),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const dragonId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, dragonId));
      expectSuccess(p1.enterBattle(dragonId, "direct"));
      expectSuccess(p1.resolveEffect({ targets: [dragonId] }));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getVisibleCard(dragonId)?.keywords).toContain("Breach");
      expect(p1.getPilotId(dragonId)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("resolves the paired Command Main before an older queued attack trigger", () => {
      const attackObserver = createMockUnit({
        name: "Attack Observer",
        effects: [
          {
            type: "triggered",
            activation: {
              timing: ["attack"],
              conditions: [{ type: "eventPlayerIsSelf" }],
            },
            directives: [
              {
                action: {
                  action: "dealDamage",
                  amount: 1,
                  target: { owner: "opponent", cardType: "unit", count: 1 },
                },
              },
            ],
            sourceText: "When your Unit attacks, choose 1 enemy Unit. Deal 1 damage to it.",
          },
        ],
      });
      const enemy = createMockUnit({ name: "Enemy", hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05HokaKyotenJuzetsujin112],
          play: [gd05DragonGundam035, attackObserver],
          resourceArea: activeResources(5),
          deck: 5,
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [dragonId, observerId] = p1.getCardsInZone("battleArea");
      const commandId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, dragonId!));
      expectSuccess(p1.enterBattle(dragonId!, enemyId));
      const ordering = p1.getBoardView().pendingChoice;
      if (ordering?.kind !== "ordering") throw new Error("Expected attack-trigger ordering");
      const dragonEffect = ordering.candidates.find(
        (candidate) => candidate.sourceCardId === dragonId,
      );
      if (!dragonEffect) throw new Error("Expected Dragon Gundam's Attack effect");
      expectSuccess(p1.resolveEffect({ pendingEffectId: dragonEffect.effectId }));

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: commandId,
        legalTargetIds: [dragonId],
      });
      expectSuccess(p1.resolveEffect({ targets: [dragonId!] }));

      expect(p1.getPilotId(dragonId!)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: observerId,
        legalTargetIds: [enemyId],
      });
    });
  });
});
