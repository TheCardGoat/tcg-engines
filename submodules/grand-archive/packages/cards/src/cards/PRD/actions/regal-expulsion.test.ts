import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { regalExpulsion } from "./regal-expulsion.ts";
import { lostProvidence } from "../../PTM/items/lost-providence.ts";
import { polarisTwinklingCauldron } from "../../PRXY/items/polaris-twinkling-cauldron.ts";
import { spellwardScepter } from "../../DTR/items/spellward-scepter.ts";
import { trivialTrinket } from "../../RDO/items/trivial-trinket.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers OvihPzTqcP-a1 */
describe("Regal Expulsion — activation origin checked at resolution", () => {
  for (const own of [false, true])
    for (const protectedActivation of [false, true])
      for (const card of [fireball, lostProvidence, polarisTwinklingCauldron])
        it(`own=${own}, protected=${protectedActivation}, source=${card.slug}`, () => {
          const champion = enableAllTestElements(lineageTestChampion("Arisanna", 0));
          const material = card !== fireball;
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: own ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                hand: [
                  regalExpulsion,
                  fireball,
                  ...Array.from({ length: 7 }, () => woodlandSquirrels),
                ],
                field: [spellwardScepter],
                "material-deck": [lostProvidence, polarisTwinklingCauldron],
                memory: [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: [fireball, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
                field: [spellwardScepter],
                "material-deck": [lostProvidence, polarisTwinklingCauldron],
                memory: [woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            actor = own ? p : q,
            defender = own ? q : p;
          const pay = (player: typeof p, n: number) =>
            player
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (protectedActivation) {
            actor.activateAbility(spellwardScepter, "f6lxizyuml-a2");
            passEffectsStack(game);
          }
          const source = actor.card(card, { zone: material ? "material-deck" : "hand" });
          actor.activate(
            source,
            material
              ? {}
              : {
                  reservePayment: pay(actor, 4),
                  targets: { "target-1": [defender.card(champion).objectId] },
                },
          );
          const item = game.state.stack.find(
            (s) => s.kind === "card-activation" && s.cardId === source.objectId,
          );
          if (!item || item.kind !== "card-activation")
            throw new Error("Missing source activation");
          expect(item.originZone).toBe(material ? "material-deck" : "hand");
          if (!own) q.pass();
          const before = game.state;
          for (const targets of [
            [],
            [source.objectId],
            [p.card(champion).objectId],
            [item.id, item.id],
          ]) {
            expect(() =>
              p.activate(regalExpulsion, {
                reservePayment: pay(p, 2),
                targets: { "target-stack-item": targets },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          for (const cost of [1, 3]) {
            expect(() =>
              p.activate(regalExpulsion, {
                reservePayment: pay(p, cost),
                targets: { "target-stack-item": [item.id] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(regalExpulsion, {
            reservePayment: pay(p, 2),
            targets: { "target-stack-item": [item.id] },
          });
          passEffectsStack(game);
          const negations = game.state.eventHistory.filter(
            (e) => e.type === "stack-item-negated" && e.item.id === item.id,
          );
          expect(negations).toHaveLength(material && !protectedActivation ? 1 : 0);
          expect(game.state.objects[source.objectId]?.zone).toBe(
            material ? (protectedActivation ? "field" : "banishment") : "graveyard",
          );
          expect(game.state.objects[defender.card(champion).objectId]?.damage).toBe(
            material ? 0 : 1,
          );
          expect(p.card(regalExpulsion, { zone: "graveyard" })).toBeDefined();
          expect(game.state.stack).toHaveLength(0);
          expect(game.state.decision).toBeNull();
        });
  for (const own of [false, true])
    for (const kind of ["ability", "materialization"] as const)
      it(`rejects a ${kind} even from a material card, own=${own}`, () => {
        const champion = enableAllTestElements(lineageTestChampion("Arisanna", 0));
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: own ? "playerOne" : "playerTwo",
          phase: kind === "materialization" ? "materialize" : "main",
          playerOne: {
            champion,
            zones: {
              hand: [regalExpulsion, woodlandSquirrels, woodlandSquirrels],
              field: [trivialTrinket],
              "material-deck": [lostProvidence],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [trivialTrinket], "material-deck": [lostProvidence] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          actor = own ? p : q;
        if (kind === "materialization") actor.materialize(lostProvidence);
        else
          actor.activateAbility(trivialTrinket, "Nym5Y3JsO5-a1", {
            targets: { "target-player": [(own ? q : p).id] },
          });
        if (!own) q.pass();
        const item = game.state.stack[0]!;
        const before = game.state;
        expect(() =>
          p.activate(regalExpulsion, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card", cardId: c.objectId })),
            targets: { "target-stack-item": [item.id] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        passEffectsStack(game);
      });
});
