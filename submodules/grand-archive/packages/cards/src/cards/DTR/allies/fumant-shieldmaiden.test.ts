import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { fumantShieldmaiden } from "./fumant-shieldmaiden.ts";
import { rivuletAdjutant } from "./rivulet-adjutant.ts";
import { threeOfSpades } from "./three-of-spades.ts";
import { tomeOfIgnorance } from "../items/tome-of-ignorance.ts";
import { backdash } from "../actions/backdash.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  advanceToMain,
  passEffectsStack,
} from "../../../testing/decisions.ts";

/** @covers r3bmriltuw-a1 */
describe("Fumant Shieldmaiden — influence strictly below owned omens", () => {
  for (const influence of [2, 3, 4])
    it(`updates its power when influence crosses the three-omen boundary from ${influence}`, () => {
      const champion = createClassBonusTestChampion(
        fumantShieldmaiden,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [
              fumantShieldmaiden,
              tomeOfIgnorance,
              rivuletAdjutant,
              rivuletAdjutant,
              rivuletAdjutant,
            ],
            hand: [backdash, ...(influence >= 3 ? [woodlandSquirrels] : [])],
            memory: influence === 4 ? [woodlandSquirrels] : [],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(fumantShieldmaiden);
      const guards = p.cards(rivuletAdjutant);
      for (const [index, attacker] of q.cards(woodlandSquirrels).entries()) {
        q.declareAttack(attacker, guards[index]!);
        advanceCombatToTrigger(game, "y547d3iixm-a2");
        passEffectsStack(game);
        game.resolveCombatWithoutRetaliation();
      }
      expect(guards.every((g) => game.state.objects[g.objectId]!.counters.omen === 1)).toBe(true);
      advanceToMain(game, p.id);
      const power = () =>
        deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "power", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      expect(p.zone("hand").length + p.zone("memory").length).toBe(influence);
      expect(power()).toBe(influence < 3 ? 3 : 1);
      p.activate(backdash, {
        targets: { "target-1": [source.objectId] },
        reservePayment: [
          { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
        ],
      });
      passEffectsStack(game);
      expect(p.zone("hand").length + p.zone("memory").length).toBe(influence - 1);
      expect(power()).toBe(influence - 1 < 3 ? 3 : 1);
      p.declareAttack(source, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      const dealt = influence - 1 < 3 ? 3 : 1;
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(dealt);
      p.activateAbility(p.card(tomeOfIgnorance), "dz4qd82liq-a2");
      passEffectsStack(game);
      expect(p.zone("hand").length + p.zone("memory").length).toBe(influence);
      expect(power()).toBe(influence < 3 ? 3 : 1);
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
      p.declareAttack(source, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(dealt + 1);
    });
});

/** @covers r3bmriltuw-a2 */
describe("Fumant Shieldmaiden — independent death draw threshold", () => {
  for (const own of [3, 4, 5])
    for (const opposing of [3, 4, 5])
      it(`checks hand plus memory separately for both players: own=${own}, opponent=${opposing}`, () => {
        const champion = createClassBonusTestChampion(
          fumantShieldmaiden,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [fumantShieldmaiden],
              hand: [woodlandSquirrels],
              memory: Array.from({ length: own - 1 }, () => woodlandSquirrels),
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [giantTortoise, threeOfSpades],
              hand: Array.from({ length: opposing - 1 }, () => woodlandSquirrels),
              memory: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(fumantShieldmaiden);
        const ownTop = p.zone("main-deck")[0]!,
          opposingTop = q.zone("main-deck")[0]!;
        q.declareAttack(q.card(giantTortoise), source);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[ownTop.objectId]!.zone).toBe("main-deck");
        q.declareAttack(q.card(threeOfSpades), source);
        advanceCombatToTrigger(game, "r3bmriltuw-a2");
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        for (const top of [ownTop, opposingTop])
          expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
        passEffectsStack(game);
        expect(game.state.objects[ownTop.objectId]!.zone).toBe(own <= 4 ? "hand" : "main-deck");
        expect(game.state.objects[opposingTop.objectId]!.zone).toBe(
          opposing <= 4 ? "hand" : "main-deck",
        );
        expect(p.zone("hand").length + p.zone("memory").length).toBe(own + Number(own <= 4));
        expect(q.zone("hand").length + q.zone("memory").length).toBe(
          opposing + Number(opposing <= 4),
        );
      });
});
