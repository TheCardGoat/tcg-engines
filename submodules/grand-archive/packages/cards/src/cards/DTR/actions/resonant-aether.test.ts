import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { resonantAether } from "./resonant-aether.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 3ppahdhe7g-a1 @covers 3ppahdhe7g-a2 */
describe("Resonant Aether — loading and level-dependent intent power", () => {
  for (const level of [0, 1, 2, 3])
    it(`loads into a controlled Aetherwing and deals printed power at level ${level}`, () => {
      const champion = grantTestChampionLevel(
        createClassBonusTestChampion(resonantAether, false, "activation-discount"),
        level,
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [trivariateDream, trivariateDream, trainingSword, woodlandSquirrels],
            hand: [resonantAether, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [trivariateDream], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        charge = p.card(resonantAether),
        weapons = p.cards(trivariateDream);
      p.activate(charge, {
        reservePayment: [
          { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
      });
      expect(game.state.objects[charge.objectId]!.zone).toBe("effects-stack");
      passEffectsStack(game);
      expect(game.state.decision?.kind).toBe("resolve-effect-choice");
      for (const invalid of [
        q.card(trivariateDream),
        p.card(trainingSword),
        p.card(woodlandSquirrels, { zone: "field" }),
      ]) {
        const before = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", [invalid.objectId])).toThrow();
        expect(game.state).toEqual(before);
      }
      answerDecision(game, "resolve-effect-choice", [weapons[1]!.objectId]);
      passEffectsStack(game);
      expect(game.state.objects[charge.objectId]!.zone).toBe("loaded");
      expect(game.state.objects[charge.objectId]!.hostId).toBe(weapons[1]!.objectId);
      const before = game.state;
      expect(() =>
        p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapons[0]!.objectId] }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapons[1]!.objectId] });
      expect(game.state.objects[charge.objectId]!.zone).toBe("intent");
      expect(game.state.objects[charge.objectId]!.hostId).toBe(p.card(champion).objectId);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(level >= 2 ? 3 : 2);
      expect(game.state.objects[charge.objectId]!.zone).toBe("graveyard");
      expect(game.state.objects[weapons[1]!.objectId]!.counters.durability).toBe(2);
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
      const unloaded = game.state;
      expect(() =>
        p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapons[1]!.objectId] }),
      ).toThrow();
      expect(game.state).toEqual(unloaded);
    });

  it("resolves into the graveyard without a controlled eligible weapon", () => {
    const champion = createClassBonusTestChampion(resonantAether, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { hand: [resonantAether, woodlandSquirrels], field: [trainingSword] },
      },
      playerTwo: { champion, zones: { field: [trivariateDream] } },
    });
    const p = game.player("player-one"),
      source = p.card(resonantAether);
    p.activate(source, {
      reservePayment: [{ kind: "card", cardId: p.card(woodlandSquirrels).objectId }],
    });
    passEffectsStack(game);
    expect(game.state.decision).toBeNull();
    expect(game.state.stack).toHaveLength(0);
    expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
  });
});
