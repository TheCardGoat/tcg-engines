import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { excaliburReflectedEdge } from "./excalibur-reflected-edge.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { corhaziCourier } from "../../DOA/allies/corhazi-courier.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { channelingStone } from "../../DOA/items/channeling-stone.ts";
import { nocturnesOblivion } from "../../P25/actions/nocturnes-oblivion.ts";
import { spellwardScepter } from "../items/spellward-scepter.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  advanceToMain,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";

/** @covers u1a1s4ys44-a1 @covers u1a1s4ys44-a2 */
describe("Excalibur — True Sight, Spellshroud, and Merlin's power", () => {
  for (const merlin of [false, true])
    for (const stealth of [false, true])
      for (const cast of [false, true]) {
        it(`Merlin=${merlin}, Stealth target=${stealth}, paid activation=${cast}`, () => {
          const champion = enableAllTestElements(
            createLineageTestChampion(excaliburReflectedEdge, merlin ? "Merlin" : "Other"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  nocturnesOblivion,
                  ...(cast ? [excaliburReflectedEdge] : []),
                  ...Array.from({ length: 6 }, () => woodlandSquirrels),
                ],
                field: [
                  trainingSword,
                  woodlandSquirrels,
                  ...(cast ? [] : [excaliburReflectedEdge]),
                ],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [corhaziCourier, trainingSword],
                hand: [nocturnesOblivion, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const pay = (actor: typeof p, n: number) =>
            actor
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (cast) {
            const before = game.state;
            expect(() =>
              p.activate(excaliburReflectedEdge, { reservePayment: pay(p, 2) }),
            ).toThrow();
            expect(game.state).toEqual(before);
            p.activate(excaliburReflectedEdge, { reservePayment: pay(p, 3) });
            passEffectsStack(game);
            expect(p.zone("memory")).toHaveLength(3);
          }
          const sword = p.card(excaliburReflectedEdge),
            target = stealth ? q.card(corhaziCourier) : q.card(champion);
          for (const actor of [p, q]) {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            if (wait.playerId !== actor.id) game.player(wait.playerId).pass();
            const before = game.state;
            expect(() =>
              actor.activate(nocturnesOblivion, {
                reservePayment: pay(actor, 3),
                targets: { "target-1": [sword.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          q.activate(nocturnesOblivion, {
            reservePayment: pay(q, 3),
            targets: { "target-1": [q.card(trainingSword).objectId] },
          });
          passEffectsStack(game);
          if (stealth) {
            expect(() =>
              p.declareAttack(p.card(champion), target, {
                weaponIds: [p.card(trainingSword).objectId],
              }),
            ).toThrow();
            expect(() =>
              p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), target),
            ).toThrow();
          }
          p.declareAttack(p.card(champion), target, { weaponIds: [sword.objectId] });
          game.resolveCombatWithoutRetaliation();
          if (stealth && merlin)
            expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
          else expect(game.state.objects[target.objectId]!.damage).toBe(merlin ? 2 : 1);
          expect(game.state.objects[sword.objectId]!.counters.durability).toBe(1);
          // The same Spell remains legal against an ordinary weapon.
          p.activate(nocturnesOblivion, {
            reservePayment: pay(p, 3),
            targets: { "target-1": [p.card(trainingSword).objectId] },
          });
          passEffectsStack(game);
          expect(q.cards(trainingSword, { zone: "banishment" })).toHaveLength(1);
        });
      }
});

/** @covers u1a1s4ys44-a3 */
describe("Excalibur — destruction copies only eligible controlled Regalia", () => {
  for (const chosen of ["weapon", "item", "none"] as const) {
    it(`copies ${chosen}, preserving the original and excluding its Distortion copy`, () => {
      const champion = enableAllTestElements(
        createLineageTestChampion(excaliburReflectedEdge, "Other"),
      );
      const eligible = chosen !== "none";
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [
              excaliburReflectedEdge,
              enfeebledDagger,
              channelingStone,
              woodlandSquirrels,
              ...(eligible ? [trainingSword, spellwardScepter] : []),
            ],
            hand: [
              excaliburReflectedEdge,
              nocturnesOblivion,
              ...Array.from({ length: 8 }, () => woodlandSquirrels),
            ],
            "material-deck": [trainingSword],
            graveyard: [trainingSword],
            "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [trainingSword],
            "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const pay = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const source = p.card(excaliburReflectedEdge, { zone: "field" });
      const destroy = (weapon: typeof source) => {
        for (let attack = 0; attack < 2; attack++) {
          p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapon.objectId] });
          if (attack === 0) game.resolveCombatWithoutRetaliation();
          else advanceCombatToTrigger(game, "u1a1s4ys44-a3");
          if (attack === 0) {
            expect(game.state.objects[weapon.objectId]!.zone).toBe("field");
            expect(
              p
                .cards(trainingSword, { zone: "field" })
                .filter((c) => game.state.objects[c.objectId]!.isToken),
            ).toHaveLength(0);
            advanceToMain(game, p.id, game.state.turn.number);
          }
        }
        passEffectsStack(game);
        expect(game.state.objects[weapon.objectId]!.zone).toBe("graveyard");
      };
      destroy(source);
      if (!eligible) {
        expect(game.state.decision).toBeNull();
        expect(p.zone("field").some((c) => game.state.objects[c.objectId]!.isToken)).toBe(false);
        return;
      }
      const definition = chosen === "weapon" ? trainingSword : spellwardScepter;
      const original = p.card(definition, { zone: "field" });
      for (const invalid of [
        [],
        [original.objectId, original.objectId],
        [q.card(trainingSword).objectId],
        [p.card(trainingSword, { zone: "material-deck" }).objectId],
        [p.card(trainingSword, { zone: "graveyard" }).objectId],
        [p.card(enfeebledDagger).objectId],
        [p.card(channelingStone).objectId],
        [p.card(woodlandSquirrels, { zone: "field" }).objectId],
        [source.objectId],
      ]) {
        expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
      }
      answerDecision(game, "resolve-effect-choice", [original.objectId]);
      passEffectsStack(game);
      game.resolveCombatWithoutRetaliation();
      const copies = () =>
        p
          .cards(definition, { zone: "field" })
          .filter((c) => game.state.objects[c.objectId]!.isToken);
      expect(copies()).toHaveLength(1);
      const copy = copies()[0]!;
      expect(game.state.objects[original.objectId]!.zone).toBe("field");
      expect(game.state.objects[copy.objectId]!.controllerId).toBe(p.id);
      expect(game.state.objects[copy.objectId]!.states.has("rested")).toBe(chosen === "item");
      if (chosen === "weapon")
        expect(game.state.objects[copy.objectId]!.counters.durability).toBe(2);
      // A second destruction must not be able to copy the first token: it is now a Distortion.
      advanceToMain(game, p.id, game.state.turn.number);
      const second = p.card(excaliburReflectedEdge, { zone: "hand" });
      p.activate(second, { reservePayment: pay(3) });
      passEffectsStack(game);
      for (let attack = 0; attack < 2; attack++) {
        p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [second.objectId] });
        if (attack === 0) game.resolveCombatWithoutRetaliation();
        else advanceCombatToTrigger(game, "u1a1s4ys44-a3");
        if (attack === 0) advanceToMain(game, p.id, game.state.turn.number);
      }
      passEffectsStack(game);
      expect(() => answerDecision(game, "resolve-effect-choice", [copy.objectId])).toThrow();
      answerDecision(game, "resolve-effect-choice", [original.objectId]);
      passEffectsStack(game);
      game.resolveCombatWithoutRetaliation();
      expect(copies()).toHaveLength(2);
      if (chosen === "item") {
        p.activateAbility(copy, "f6lxizyuml-a2");
        passEffectsStack(game);
        expect(game.state.objects[copy.objectId]).toBeUndefined();
      } else {
        advanceToMain(game, p.id, game.state.turn.number);
        p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [copy.objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(5);
        expect(game.state.objects[copy.objectId]!.counters.durability).toBe(1);
        p.activate(nocturnesOblivion, {
          reservePayment: pay(3),
          targets: { "target-1": [copy.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[copy.objectId]).toBeUndefined();
      }
      expect(game.state.objects[original.objectId]!.zone).toBe("field");
    });
  }
});

/** @covers u1a1s4ys44-a1 @covers u1a1s4ys44-a3 */
describe("Excalibur — non-Spell abilities and destruction versus movement", () => {
  for (const movement of ["destroy", "banish", "return"] as const)
    for (const opponent of [false, true]) {
      it(`${opponent ? "opposing" : "own"} non-Spell ability ${movement}`, () => {
        const base = enableAllTestElements(
          createLineageTestChampion(excaliburReflectedEdge, "Other"),
        );
        const champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
          ...base,
          layout: {
            kind: "single-faced",
            face: {
              ...requireSingleFace(base),
              abilities: [
                ...requireSingleFace(base).abilities,
                {
                  id: `${base.canonicalId}-a9`,
                  kind: "activated",
                  activation: "ability",
                  text: "Move the chosen weapon.",
                  cost: { kind: "pay-reserve", amount: 0 },
                  targets: [
                    {
                      id: "weapon",
                      kind: "target",
                      declared: "announcement",
                      chooser: "controller",
                      count: { kind: "exactly", amount: 1 },
                      unique: true,
                      candidates: {
                        kind: "object",
                        zones: ["field"],
                        filter: { kind: "type", oneOf: ["WEAPON"] },
                      },
                    },
                  ],
                  effect:
                    movement === "destroy"
                      ? { kind: "destroy", subject: { kind: "bound", binding: "weapon" } }
                      : movement === "banish"
                        ? { kind: "banish-object", subject: { kind: "bound", binding: "weapon" } }
                        : {
                            kind: "move",
                            subject: { kind: "bound", binding: "weapon" },
                            destination: { zone: "hand" },
                          },
                },
              ],
            },
          },
        };
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: { field: [excaliburReflectedEdge, trainingSword, spellwardScepter] },
          },
          playerTwo: { champion, zones: { field: [trainingSword] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          actor = opponent ? q : p;
        const source = p.card(excaliburReflectedEdge);
        if (opponent) p.pass();
        actor.activateAbility(actor.card(champion), `${base.canonicalId}-a9`, {
          targets: { weapon: [source.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe(
          movement === "destroy" ? "graveyard" : movement === "banish" ? "banishment" : "hand",
        );
        if (movement === "destroy") {
          expect(game.state.decision?.playerId).toBe(p.id);
          answerDecision(game, "resolve-effect-choice", [p.card(trainingSword).objectId]);
          passEffectsStack(game);
        } else expect(game.state.decision).toBeNull();
        expect(
          p
            .cards(trainingSword, { zone: "field" })
            .filter((c) => game.state.objects[c.objectId]!.isToken),
        ).toHaveLength(movement === "destroy" ? 1 : 0);
        expect(q.cards(trainingSword, { zone: "field" })).toHaveLength(1);
      });
    }
});
