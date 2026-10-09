import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { dusksoulStone } from "./dusksoul-stone.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision } from "../../../testing/decisions.ts";
/** @covers u25fuv184p-a3 */
describe("Dusksoul Stone — banish from one graveyard", () => {
  for (const matching of [false, true])
    for (const opposing of [false, true])
      for (const count of [0, 1, 2])
        it(`class=${matching}, opposing=${opposing}, count=${count}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(dusksoulStone, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [dusksoulStone],
                hand: [woodlandSquirrels],
                graveyard: [woodlandSquirrels, fireball, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { graveyard: [woodlandSquirrels, fireball, woodlandSquirrels] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(dusksoulStone),
            owner = opposing ? q : p,
            cards = owner.zone("graveyard");
          p.activateAbility(source, "u25fuv184p-a3");
          expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
          passEffectsStack(game);
          expect(game.state.decision?.kind).toBe("resolve-effect-choice");
          const before = game.state;
          for (const ids of [
            [p.card(woodlandSquirrels, { zone: "hand" }).objectId],
            [p.zone("graveyard")[0]!.objectId, q.zone("graveyard")[0]!.objectId],
            cards.map((c) => c.objectId),
            [cards[0]!.objectId, cards[0]!.objectId],
          ]) {
            expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(
            game,
            "resolve-effect-choice",
            cards.slice(0, count).map((c) => c.objectId),
          );
          passEffectsStack(game);
          for (const [i, card] of cards.entries())
            expect(game.state.objects[card.objectId]!.zone).toBe(
              i < count ? "banishment" : "graveyard",
            );
          expect((opposing ? p : q).zone("graveyard")).toHaveLength(3);
          expect(p.zone("hand")).toHaveLength(1);
        });
});
/** @covers u25fuv184p-a1 */
describe("Dusksoul Stone — additional materialization payment", () => {
  for (const matching of [false, true])
    for (const opposing of [false, true])
      it(`class=${matching}, opposing=${opposing}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(dusksoulStone, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              "material-deck": [dusksoulStone],
              hand: [woodlandSquirrels],
              graveyard: [woodlandSquirrels, woodlandSquirrels, fireball],
            },
          },
          playerTwo: {
            champion,
            zones: { graveyard: [woodlandSquirrels, woodlandSquirrels, fireball] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          owner = opposing ? q : p,
          allies = owner.cards(woodlandSquirrels, { zone: "graveyard" });
        const before = game.state;
        for (const ids of [
          [],
          [allies[0]!.objectId],
          [allies[0]!.objectId, allies[0]!.objectId],
          [allies[0]!.objectId, owner.card(fireball).objectId],
          [
            p.cards(woodlandSquirrels, { zone: "graveyard" })[0]!.objectId,
            q.cards(woodlandSquirrels, { zone: "graveyard" })[0]!.objectId,
          ],
          [allies[0]!.objectId, p.card(woodlandSquirrels, { zone: "hand" }).objectId],
        ]) {
          expect(() => p.materialize(dusksoulStone, { costSelections: [ids] })).toThrow();
          expect(game.state).toEqual(before);
        }
        p.materialize(dusksoulStone, { costSelections: [allies.map((c) => c.objectId)] });
        passEffectsStack(game);
        expect(p.cards(dusksoulStone, { zone: "field" })).toHaveLength(1);
        for (const card of allies)
          expect(game.state.objects[card.objectId]!.zone).toBe("banishment");
      });
});

import { proveGrantedSpellshroud } from "../../../testing/granted-spellshroud.ts";
/** @covers u25fuv184p-a2 */
describe("Dusksoul Stone — phantasia Spellshroud", () =>
  proveGrantedSpellshroud(dusksoulStone, true));

import { chasingShadows } from "../../RDO/phantasias/chasing-shadows.ts";
import { anointedPurifier } from "../../PRD/allies/anointed-purifier.ts";
describe("Dusksoul Stone — non-Spell targeting", () => {
  for (const matching of [false, true])
    for (const own of [false, true])
      it(`class=${matching}, own ability=${own}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(dusksoulStone, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: own ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [dusksoulStone, chasingShadows],
              hand: own
                ? [anointedPurifier, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels]
                : [],
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: own
                ? []
                : [anointedPurifier, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          caster = own ? p : q,
          target = p.card(chasingShadows);
        caster.activate(anointedPurifier, {
          reservePayment: caster
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        passEffectsStack(game);
        const ally = caster.card(anointedPurifier);
        expect(game.state.objects[ally.objectId]!.counters.buff).toBe(2);
        caster.activateAbility(ally, "mt1I9kfowQ-a2", {
          targets: { "target-1": [target.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
        expect(game.state.objects[p.card(dusksoulStone).objectId]!.zone).toBe("field");
      });
});
