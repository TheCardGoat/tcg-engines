/**
 * Regression test: `resolveCombat` must commit the destroyed unit's
 * `zones.moveCard → trash` write when the combat destroys a unit that
 * is also a `markAsLinkUnit`-paired observer of the destroy event.
 *
 * Pre-fix: `markAsLinkUnit` synthesised a pilot definition without
 * `apBonus` / `hpBonus`. `getEffectiveStats` added those bonuses
 * unconditionally, producing NaN ap/hp for the paired unit. That meant
 * `isDefeated` (`damage >= hp`) never triggered against a defender
 * whose attacker was paired, so `handleUnitDefeated` was never called
 * and the defender stayed in `battleArea` with `damage: NaN`. The
 * failure surfaced as a "card not in trash" assertion — the caller
 * reasonably suspected `resolveCombat` / destroy-path orchestration.
 *
 * Post-fix: `markAsLinkUnit`'s synthetic pilot defaults `apBonus: 0`
 * and `hpBonus: 0`, so link-unit fixtures are stat-neutral and combat
 * destruction resolves exactly like the unpaired case. This test
 * locks in that invariant for any `duringLink` / `duringPair`
 * combat-reactive scenario (ST02-011 Zechs, ST05-011 Akihiro,
 * ST02-003 Heavyarms, …).
 */
import { describe, expect, it } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO } from "./test-engine.ts";
import { createMockUnit } from "./card-mocks.ts";
import { expectCardInTrash, markAsLinkUnit } from "./command-test-helpers.ts";

describe("resolveCombat — destroy zone commit with markAsLinkUnit attacker", () => {
  it("moves the defeated defender to trash when the attacker is a link unit", () => {
    const attacker = createMockUnit({ ap: 3, hp: 4 });
    const defender = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [attacker], deck: 5 },
      { play: [defender], deck: 5 },
    );
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const defenderId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    // Ready the attacker — pre-placed units keep their deploy exhaustion.
    engine.getG().exhausted[attackerId] = false;

    // Link the attacker. Historically this corrupted stats (NaN ap/hp)
    // because the synthetic pilot omitted `apBonus` / `hpBonus`, so the
    // defender below would fail `isDefeated` and stay in battleArea.
    markAsLinkUnit(engine, attackerId);

    engine.resolveCombat({ attackerId, target: defenderId });

    // The defender died — assert the zone-move committed and damage
    // cleanup ran through `cleanupCardOnLeave`.
    expectCardInTrash(engine, defenderId, PLAYER_TWO);
    expect(engine.getG().damage[defenderId]).toBeUndefined();
  });

  it("does not perturb combat stats: paired attacker deals exactly its base AP", () => {
    // Locks in the stat-neutrality of `markAsLinkUnit`. A synthetic
    // pilot that silently grants ap/hp bonuses would cause downstream
    // "counter-damage" and "defender survives" tests to drift the moment
    // the harness is touched.
    const attacker = createMockUnit({ ap: 2, hp: 4 });
    const defender = createMockUnit({ ap: 1, hp: 5 }); // survives the attack
    const engine = GundamTestEngine.create(
      { play: [attacker], deck: 3 },
      { play: [defender], deck: 3 },
    );
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const defenderId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
    engine.getG().exhausted[attackerId] = false;
    markAsLinkUnit(engine, attackerId);

    engine.resolveCombat({ attackerId, target: defenderId });

    // Exact base AP damage on defender, exact base AP counter on attacker.
    expect(engine.getG().damage[defenderId]).toBe(2);
    expect(engine.getG().damage[attackerId]).toBe(1);
  });
});
