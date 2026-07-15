/**
 * PR 1 of the useSupport → activateAbility consolidation.
 *
 * `TargetFilter.excludeSource` — when true, the card owning the effect
 * (`ctx.sourceCardId`) is dropped from the candidate set. Used by
 * "choose one OTHER friendly unit" phrasings, most immediately the
 * Support keyword (rule 13-1-3) which PR 2 will model as a synthetic
 * activated ability.
 */

import { describe, it, expect } from "vite-plus/test";
import type { PlayerId } from "../types/branded.ts";
import { evaluateTargetFilter } from "./target-dsl.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  buildTargetResolutionContext,
} from "../index.ts";

function setupTwoFriendliesOneEnemy() {
  const source = createMockUnit({ name: "Source", ap: 2, hp: 3 });
  const friend = createMockUnit({ name: "Friend", ap: 2, hp: 3 });
  const enemy = createMockUnit({ name: "Enemy", ap: 2, hp: 3 });

  const engine = GundamTestEngine.create({ play: [source, friend] }, { play: [enemy] });
  const runtime = engine.getRuntime();
  const sourceId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, source.cardNumber)!;
  const friendId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, friend.cardNumber)!;
  const enemyId = runtime.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, enemy.cardNumber)!;

  return { engine, runtime, sourceId, friendId, enemyId };
}

describe("TargetFilter.excludeSource", () => {
  it("excludes the source card when true", () => {
    const { engine, runtime, sourceId, friendId } = setupTwoFriendliesOneEnemy();
    const framework = runtime.getFrameworkReadAPI();
    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
      sourceCardId: sourceId,
    });

    const cards = framework.zones
      .getCards({ zone: "battleArea", playerId: PLAYER_ONE })
      .map((id) => framework.cards.get(id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    const matched = evaluateTargetFilter(
      { owner: "friendly", cardType: "unit", excludeSource: true },
      cards,
      ctx,
    );
    expect(matched).toContain(friendId);
    expect(matched).not.toContain(sourceId);
  });

  it("includes the source card when omitted (backwards-compat)", () => {
    const { engine, runtime, sourceId, friendId } = setupTwoFriendliesOneEnemy();
    const framework = runtime.getFrameworkReadAPI();
    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
      sourceCardId: sourceId,
    });

    const cards = framework.zones
      .getCards({ zone: "battleArea", playerId: PLAYER_ONE })
      .map((id) => framework.cards.get(id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    const matched = evaluateTargetFilter({ owner: "friendly", cardType: "unit" }, cards, ctx);
    expect(matched).toContain(friendId);
    expect(matched).toContain(sourceId);
  });

  it("is a no-op when ctx.sourceCardId is unset", () => {
    const { engine, runtime, sourceId, friendId } = setupTwoFriendliesOneEnemy();
    const framework = runtime.getFrameworkReadAPI();
    // No sourceCardId passed — excludeSource has nothing to compare.
    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework);

    const cards = framework.zones
      .getCards({ zone: "battleArea", playerId: PLAYER_ONE })
      .map((id) => framework.cards.get(id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    const matched = evaluateTargetFilter(
      { owner: "friendly", cardType: "unit", excludeSource: true },
      cards,
      ctx,
    );
    expect(matched).toContain(sourceId);
    expect(matched).toContain(friendId);
  });

  it("composes with other filter fields — opponent + excludeSource is still a no-op for self", () => {
    const { engine, runtime, sourceId, enemyId } = setupTwoFriendliesOneEnemy();
    const framework = runtime.getFrameworkReadAPI();
    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
      sourceCardId: sourceId,
    });

    const cards = [
      ...framework.zones.getCards({ zone: "battleArea", playerId: PLAYER_ONE }),
      ...framework.zones.getCards({ zone: "battleArea", playerId: PLAYER_TWO }),
    ]
      .map((id) => framework.cards.get(id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    const matched = evaluateTargetFilter(
      { owner: "opponent", cardType: "unit", excludeSource: true },
      cards,
      ctx,
    );
    // source is friendly so owner filter already excludes it; enemy remains.
    expect(matched).toEqual([enemyId]);
  });
});
