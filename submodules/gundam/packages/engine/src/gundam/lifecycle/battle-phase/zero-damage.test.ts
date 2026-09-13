/**
 * Rule 5-5-5: damage is not dealt when the amount of damage dealt would
 * be zero. No damage counter, no DAMAGE_DEALT event, no log entry, and
 * no `effectDamageReceived` reactive trigger.
 */

import { describe, expect, it } from "vite-plus/test";
import type { CardEffect, UnitCard } from "@tcg/gundam-types";
import type { CardInstanceId, PlayerId } from "../../../types/branded.ts";
import {
  activeResources,
  createMockCommand,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  createMockBase,
} from "../../../index.ts";
import type { TestCardEntry } from "../../../index.ts";
import { handleDealDamageAction } from "../../effects/handlers/combat.ts";

function rested(card: ReturnType<typeof createMockUnit>): TestCardEntry {
  return { card, exhausted: true };
}

let listenerCounter = 0;

function makeEffectDamageListener(): UnitCard {
  const effect: CardEffect = {
    type: "triggered",
    activation: { timing: ["onEnemyEffectDamage"] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "【When this Unit receives effect damage】Draw 1.",
  };
  listenerCounter += 1;
  return {
    cardNumber: `TEST-EFFECT-DMG-${listenerCounter}`,
    name: "Effect Damage Listener",
    type: "unit",
    canonicalId: "mock",
    slug: "mock",
    printings: [],
    traits: [],
    level: 1,
    cost: 1,
    ap: 1,
    hp: 5,
    keywordEffects: [],
    rarity: "common",
    effects: [effect],
  };
}

describe("Rule 5-5-5 — zero damage is not dealt", () => {
  it("battle damage: 0-AP attacker writes no damage counter to defender", () => {
    const attacker = createMockUnit({ ap: 0, hp: 5 });
    const defender = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    // Defender takes no damage from the 0-AP attacker.
    expect(p2.getDamage(defenderId)).toBe(0);
    // Attacker still takes the defender's 2 AP damage.
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getDamage(attackerId)).toBe(2);
  });

  it("direct attack: 0-AP attacker does not damage the base", () => {
    const attacker = createMockUnit({ ap: 0, hp: 5 });
    const base = createMockBase({ hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { baseSection: [base] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const baseId = p2.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.enterBattle(attacker, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getDamage(baseId)).toBe(0);
  });

  it("direct attack: 0-AP attacker leaves Shields in place", () => {
    const attacker = createMockUnit({ ap: 0, hp: 5 });
    const shield = createMockUnit();
    const engine = GundamTestEngine.create(
      { play: [attacker], deck: 1 },
      { shieldArea: [shield], deck: 1 },
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.enterBattle(attacker, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardsInZone("shieldArea")).toHaveLength(1);
    expect(p2.getCardsInZone("trash")).toHaveLength(0);
    expect(p2.getBoardView().pendingChoice).toBeUndefined();
  });

  it("direct attack: positive AP still removes a Shield", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker], deck: 1 },
      { shieldArea: [createMockUnit()], deck: 1 },
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.enterBattle(attacker, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
    expect(p2.getCardsInZone("trash")).toHaveLength(1);
  });

  it("uses AP reduced by an Action Command before direct-attack damage", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const apReduction = createMockCommand({
      level: 1,
      cost: 0,
      effects: [
        {
          type: "command",
          activation: { timing: ["action"] },
          directives: [
            {
              action: {
                action: "statModifier",
                stat: "ap",
                amount: -3,
                duration: "thisBattle",
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Action】Choose 1 enemy Unit. It gets AP-3 during this battle.",
        },
      ],
    });
    const engine = GundamTestEngine.create(
      { play: [attacker], deck: 1 },
      {
        hand: [apReduction],
        resourceArea: activeResources(1),
        shieldArea: [createMockUnit()],
        deck: 1,
      },
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p2.getHand()[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.playCommand(commandId, { targets: [attackerId] }));
    expect(p1.getVisibleCard(attackerId)?.effectiveAp).toBe(0);
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p2.getCardsInZone("shieldArea")).toHaveLength(1);
    expect(p2.getBoardView().pendingChoice).toBeUndefined();
  });

  it("direct attack: 0-AP Suppression does not remove Shields", () => {
    const attacker = createMockUnit({
      ap: 0,
      hp: 5,
      keywordEffects: [{ keyword: "Suppression" }],
    });
    const engine = GundamTestEngine.create(
      { play: [attacker], deck: 1 },
      { shieldArea: [createMockUnit(), createMockUnit()], deck: 1 },
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.enterBattle(attacker, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardsInZone("shieldArea")).toHaveLength(2);
    expect(p2.getBoardView().pendingChoice).toBeUndefined();
  });

  it("direct attack: 0-AP attacker does not defeat an unshielded player", () => {
    const attacker = createMockUnit({ ap: 0, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker], deck: 1 }, { deck: 1 });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.enterBattle(attacker, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(engine.getState().ctx.status.gameEnded).toBeFalsy();
  });

  it("effect damage with amount=0 does not write damage, emit events, or enqueue triggers", () => {
    const listener = makeEffectDamageListener();
    const engine = GundamTestEngine.create({}, { play: [listener] });
    const listenerId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    let qLen = 0;
    const emittedKinds: string[] = [];
    const loggedTypes: string[] = [];
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      const origEmit = framework.events.emit.bind(framework.events);
      const origLog = framework.log.bind(framework);
      const eventsMut = framework.events as { emit: typeof origEmit };
      eventsMut.emit = (event) => {
        emittedKinds.push(event.type);
        origEmit(event);
      };
      const frameworkMut = framework as { log: typeof origLog };
      frameworkMut.log = (entry) => {
        const e = entry as { type?: string };
        if (e?.type) loggedTypes.push(e.type);
        origLog(entry);
      };

      handleDealDamageAction([listenerId as CardInstanceId], 0, {
        G,
        framework,
        sourcePlayerId: PLAYER_ONE,
        sourceCardId: listenerId,
      });
      qLen = G.pendingEffects.length;
    });

    expect(qLen).toBe(0);
    expect(engine.asPlayer(PLAYER_TWO).getDamage(listenerId)).toBe(0);
    expect(emittedKinds).not.toContain("DAMAGE_DEALT");
    expect(emittedKinds).not.toContain("EFFECT_DAMAGE_RECEIVED");
    expect(loggedTypes).not.toContain("gundam.combat.damage");
  });
});
