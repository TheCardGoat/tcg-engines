/**
 * `TargetFilter.isBattling` — predicate for "battling" phrasings. Maps the
 * card's instance id against the combatant set derived from
 * `g.turnMetadata.pendingCombat`.
 *
 * Semantics:
 *   - `true`  → card must be one of the two combatants in the current attack.
 *   - `false` → card must NOT be a combatant.
 *   - omitted → no constraint (today's behaviour).
 *
 * Direct attacks (`pendingCombat.target === "direct"`) yield the attacker
 * plus the defender's baseSection card(s) when present, otherwise the
 * defender's shieldArea cards — mirroring rule 8-5-2-1's damage routing so
 * card text like "enemy Base/enemy Shield this Unit is battling" resolves.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import { evaluateTargetFilter } from "./target-dsl.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockBase,
  createMockUnit,
  buildTargetResolutionContext,
} from "../index.ts";

function setup() {
  const attacker = createMockUnit({ name: "Attacker", ap: 3, hp: 3 });
  const friendly = createMockUnit({ name: "Friendly", ap: 2, hp: 3 });
  const defender = createMockUnit({ name: "Defender", ap: 2, hp: 3 });
  const bystander = createMockUnit({ name: "Bystander", ap: 2, hp: 3 });

  const engine = GundamTestEngine.create(
    { play: [attacker, friendly] },
    { play: [defender, bystander] },
  );
  const runtime = engine.getRuntime();
  const attackerId = runtime.getInstanceIdByDefinition(
    PLAYER_ONE as PlayerId,
    attacker.cardNumber,
  )!;
  const friendlyId = runtime.getInstanceIdByDefinition(
    PLAYER_ONE as PlayerId,
    friendly.cardNumber,
  )!;
  const defenderId = runtime.getInstanceIdByDefinition(
    PLAYER_TWO as PlayerId,
    defender.cardNumber,
  )!;
  const bystanderId = runtime.getInstanceIdByDefinition(
    PLAYER_TWO as PlayerId,
    bystander.cardNumber,
  )!;

  return { engine, runtime, attackerId, friendlyId, defenderId, bystanderId };
}

function allBattleAreaCards(runtime: ReturnType<GundamTestEngine["getRuntime"]>) {
  const framework = runtime.getFrameworkReadAPI();
  return [
    ...framework.zones.getCards({ zone: "battleArea", playerId: PLAYER_ONE }),
    ...framework.zones.getCards({ zone: "battleArea", playerId: PLAYER_TWO }),
  ]
    .map((id) => framework.cards.get(id))
    .filter((c): c is NonNullable<ReturnType<typeof framework.cards.get>> => c !== undefined);
}

describe("TargetFilter.isBattling", () => {
  it("true → only the two combatants match during a unit-vs-unit attack", () => {
    const { engine, runtime, attackerId, defenderId } = setup();
    const g = engine.getG();
    g.turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId,
      attackerPlayerId: PLAYER_ONE,
      target: defenderId,
    };

    const framework = runtime.getFrameworkReadAPI();
    const ctx = buildTargetResolutionContext(g, PLAYER_ONE, framework, {
      sourceCardId: attackerId,
    });
    const cards = allBattleAreaCards(runtime);

    const matched = evaluateTargetFilter({ owner: "any", isBattling: true }, cards, ctx);
    expect(matched).toHaveLength(2);
    expect(matched).toContain(attackerId);
    expect(matched).toContain(defenderId);
  });

  it("false → excludes the combatants, matches everyone else", () => {
    const { engine, runtime, attackerId, defenderId, friendlyId, bystanderId } = setup();
    const g = engine.getG();
    g.turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId,
      attackerPlayerId: PLAYER_ONE,
      target: defenderId,
    };

    const framework = runtime.getFrameworkReadAPI();
    const ctx = buildTargetResolutionContext(g, PLAYER_ONE, framework, {
      sourceCardId: attackerId,
    });
    const cards = allBattleAreaCards(runtime);

    const matched = evaluateTargetFilter({ owner: "any", isBattling: false }, cards, ctx);
    expect(matched).not.toContain(attackerId);
    expect(matched).not.toContain(defenderId);
    expect(matched).toContain(friendlyId);
    expect(matched).toContain(bystanderId);
  });

  it("no active combat → isBattling: true matches nothing", () => {
    const { engine, runtime, attackerId } = setup();
    const g = engine.getG();
    expect(g.turnMetadata.pendingCombat).toBeUndefined();

    const framework = runtime.getFrameworkReadAPI();
    const ctx = buildTargetResolutionContext(g, PLAYER_ONE, framework, {
      sourceCardId: attackerId,
    });
    const cards = allBattleAreaCards(runtime);

    const matched = evaluateTargetFilter({ owner: "any", isBattling: true }, cards, ctx);
    expect(matched).toEqual([]);
  });

  it("direct attack → only the attacker matches isBattling: true", () => {
    const { engine, runtime, attackerId, defenderId, friendlyId, bystanderId } = setup();
    const g = engine.getG();
    g.turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId,
      attackerPlayerId: PLAYER_ONE,
      target: "direct",
    };

    const framework = runtime.getFrameworkReadAPI();
    const ctx = buildTargetResolutionContext(g, PLAYER_ONE, framework, {
      sourceCardId: attackerId,
    });
    const cards = allBattleAreaCards(runtime);

    const matched = evaluateTargetFilter({ owner: "any", isBattling: true }, cards, ctx);
    expect(matched).toEqual([attackerId]);

    // defender is the player, not a card — these remain non-battling.
    const nonBattling = evaluateTargetFilter({ owner: "any", isBattling: false }, cards, ctx);
    expect(nonBattling).toContain(defenderId);
    expect(nonBattling).toContain(friendlyId);
    expect(nonBattling).toContain(bystanderId);
    expect(nonBattling).not.toContain(attackerId);
  });

  it("composes with owner: 'opponent' → picks the battling enemy of the source's controller", () => {
    const { engine, runtime, attackerId, defenderId } = setup();
    const g = engine.getG();
    g.turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId,
      attackerPlayerId: PLAYER_ONE,
      target: defenderId,
    };

    const framework = runtime.getFrameworkReadAPI();
    // Source is the attacker (player_one) — opponent = player_two.
    const ctx = buildTargetResolutionContext(g, PLAYER_ONE, framework, {
      sourceCardId: attackerId,
    });
    const cards = allBattleAreaCards(runtime);

    const matched = evaluateTargetFilter(
      { owner: "opponent", cardType: "unit", isBattling: true },
      cards,
      ctx,
    );
    expect(matched).toEqual([defenderId]);
  });

  it("direct attack with a base → base counts as battling, shields don't", () => {
    const { engine, runtime, attackerId } = setup();
    const g = engine.getG();
    const framework = runtime.getFrameworkReadAPI();

    // Seed a proper base card into PLAYER_TWO's baseSection, plus a
    // shieldArea card — with a base present, only the base should be
    // considered battling on the direct attack (rule 8-5-2-1 routing).
    const baseDef = createMockBase({ name: "TestBase", hp: 5 });
    const baseId = engine.giveCard(PLAYER_TWO as PlayerId, baseDef.cardNumber, {
      zone: "baseSection",
      playerId: PLAYER_TWO as PlayerId,
    }) as CardInstanceId;
    runtime.registerCardInstance(baseId, baseDef.cardNumber, PLAYER_TWO as PlayerId);
    const shieldDef = createMockUnit({ name: "TestShield", ap: 0, hp: 1 });
    const shieldId = engine.giveCard(PLAYER_TWO as PlayerId, shieldDef.cardNumber, {
      zone: "shieldArea",
      playerId: PLAYER_TWO as PlayerId,
    }) as CardInstanceId;
    runtime.registerCardInstance(shieldId, shieldDef.cardNumber, PLAYER_TWO as PlayerId);

    g.turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId,
      attackerPlayerId: PLAYER_ONE,
      target: "direct",
    };

    const ctx = buildTargetResolutionContext(g, PLAYER_ONE, framework, {
      sourceCardId: attackerId,
    });
    expect(ctx.currentBattleParticipantIds?.has(attackerId as CardInstanceId)).toBe(true);
    expect(ctx.currentBattleParticipantIds?.has(baseId)).toBe(true);
    expect(ctx.currentBattleParticipantIds?.has(shieldId)).toBe(false);
  });

  it("direct attack without a base → shieldArea cards count as battling", () => {
    const { engine, runtime, attackerId } = setup();
    const g = engine.getG();
    const framework = runtime.getFrameworkReadAPI();

    const shieldDef = createMockUnit({ name: "TestShield", ap: 0, hp: 1 });
    const shieldId = engine.giveCard(PLAYER_TWO as PlayerId, shieldDef.cardNumber, {
      zone: "shieldArea",
      playerId: PLAYER_TWO as PlayerId,
    }) as CardInstanceId;
    runtime.registerCardInstance(shieldId, shieldDef.cardNumber, PLAYER_TWO as PlayerId);

    g.turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId,
      attackerPlayerId: PLAYER_ONE,
      target: "direct",
    };

    const ctx = buildTargetResolutionContext(g, PLAYER_ONE, framework, {
      sourceCardId: attackerId,
    });
    expect(ctx.currentBattleParticipantIds?.has(attackerId as CardInstanceId)).toBe(true);
    expect(ctx.currentBattleParticipantIds?.has(shieldId)).toBe(true);
  });

  it("omitted (backwards-compat) → no constraint, even with active combat", () => {
    const { engine, runtime, attackerId, defenderId, friendlyId, bystanderId } = setup();
    const g = engine.getG();
    g.turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId,
      attackerPlayerId: PLAYER_ONE,
      target: defenderId,
    };

    const framework = runtime.getFrameworkReadAPI();
    const ctx = buildTargetResolutionContext(g, PLAYER_ONE, framework, {
      sourceCardId: attackerId,
    });
    const cards = allBattleAreaCards(runtime);

    const matched = evaluateTargetFilter({ owner: "any", cardType: "unit" }, cards, ctx);
    expect(matched).toContain(attackerId);
    expect(matched).toContain(defenderId);
    expect(matched).toContain(friendlyId);
    expect(matched).toContain(bystanderId);
  });
});
