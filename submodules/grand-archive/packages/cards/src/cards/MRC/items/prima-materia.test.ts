import { describe } from "vitest";
import { primaMateria } from "./prima-materia.ts";
import { proveArisannaBrew } from "../../../testing/arisanna-brew.ts";
/** @covers vt9y597fqr-a1 */
describe("Prima Materia — Arisanna Brew with four differently named Herbs", () =>
  proveArisannaBrew(primaMateria, true, 4));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { blightroot } from "../../ALC/tokens/blightroot.ts";
import { silvershine } from "../../ALC/tokens/silvershine.ts";
import { razorvine } from "../../ALC/tokens/razorvine.ts";
import { manaroot } from "../../ALC/tokens/manaroot.ts";
import { astralShard } from "../../DTR/tokens/astral-shard.ts";
import { meteorStrike } from "../actions/meteor-strike.ts";
import { dwarfStarsGlow } from "../../RDO/actions/dwarf-stars-glow.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
/** @covers vt9y597fqr-a2 */
describe("Prima Materia — memory draw and next own Astra damage", () => {
  for (const brewed of [false, true])
    for (const mode of [
      "astra",
      "other-element-first",
      "opponent-first",
      "expired",
      "area",
    ] as const)
      it(`brewed=${brewed}, mode=${mode}`, () => {
        const champion = enableAllTestElements(lineageTestChampion("Arisanna", 0));
        const herbs = [blightroot, silvershine, razorvine, manaroot];
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            preserveMainDeckOrder: true,
            zones: {
              field: [...herbs, astralShard, giantTortoise],
              hand: [
                primaMateria,
                fireball,
                dwarfStarsGlow,
                dwarfStarsGlow,
                ...Array.from({ length: 16 }, () => woodlandSquirrels),
              ],
              "main-deck": [
                woodlandSquirrels,
                meteorStrike,
                meteorStrike,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [giantTortoise],
              hand: [dwarfStarsGlow, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(primaMateria),
          hero = p.card(champion),
          foe = q.card(champion),
          pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        p.activate(
          source,
          brewed
            ? { activationMethod: "brew", brewIngredientIds: herbs.map((c) => p.card(c).objectId) }
            : { reservePayment: pay(4) },
        );
        passEffectsStack(game);
        const top = p.zone("main-deck")[0]!,
          beforeMemory = p.zone("memory").length,
          hand = p.zone("hand");
        p.activateAbility(source, "vt9y597fqr-a2");
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
        expect(p.zone("memory")).toHaveLength(beforeMemory);
        {
          const before = game.state;
          expect(() => p.activateAbility(source, "vt9y597fqr-a2")).toThrow();
          expect(game.state).toEqual(before);
        }
        passEffectsStack(game);
        expect(p.zone("memory")).toHaveLength(beforeMemory + 1);
        expect(p.zone("memory")).toContainEqual(top);
        expect(p.zone("hand")).toEqual(hand);
        if (mode === "expired") advanceToMain(game, p.id, game.state.turn.number);
        if (mode === "other-element-first") {
          p.activate(fireball, { reservePayment: pay(4), targets: { "target-1": [foe.objectId] } });
          passEffectsStack(game);
          expect(game.state.objects[foe.objectId]!.damage).toBe(1);
        }
        if (mode === "opponent-first") {
          p.pass();
          q.activate(dwarfStarsGlow, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            targets: { "target-1": [hero.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.damage).toBe(2);
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId === q.id) q.pass();
        }
        const bonus = brewed && mode !== "expired" ? 3 : 0;
        if (mode === "area") {
          const allies = [p.card(giantTortoise), q.card(giantTortoise)],
            start = game.state.eventHistory.length;
          p.activateAbility(astralShard, "eP07Xxscuq-a1");
          passEffectsStack(game);
          const d = game.state.decision;
          if (d?.kind !== "resolve-glimpse") throw new Error("Expected glimpse");
          answerDecision(game, d.kind, {
            kind: "starcall",
            cardId: d.cardIds[0]!,
            bottom: d.cardIds.slice(1),
            reservePayment: pay(3),
          });
          passEffectsStack(game);
          for (const target of [foe, ...allies]) {
            const dealt = game.state.eventHistory
              .slice(start)
              .filter((e) => e.type === "damage-marked" && e.objectId === target.objectId)
              .reduce((n, e) => n + (e.type === "damage-marked" ? e.amount : 0), 0);
            expect(dealt).toBe(3 + bonus);
          }
          for (const ally of allies)
            expect(game.state.objects[ally.objectId]!.zone).toBe(brewed ? "graveyard" : "field");
          expect(game.state.objects[hero.objectId]!.damage).toBe(0);
        } else {
          p.activate(p.cards(dwarfStarsGlow, { zone: "hand" })[0]!, {
            reservePayment: pay(2),
            targets: { "target-1": [foe.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[foe.objectId]!.damage).toBe(
            2 + bonus + (mode === "other-element-first" ? 1 : 0),
          );
        }
        const beforeDamage = game.state.objects[foe.objectId]!.damage;
        p.activate(p.cards(dwarfStarsGlow, { zone: "hand" })[0]!, {
          reservePayment: pay(2),
          targets: { "target-1": [foe.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[foe.objectId]!.damage).toBe(beforeDamage + 2);
      });
});
