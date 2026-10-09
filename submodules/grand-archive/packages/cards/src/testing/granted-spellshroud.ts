import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { disenchant } from "../cards/P25/actions/disenchant.ts";
import { reposition } from "../cards/ALC/actions/reposition.ts";
import { disorientingWinds } from "../cards/DOA/actions/disorienting-winds.ts";
import { meltdown } from "../cards/ALC/actions/meltdown.ts";
import { chasingShadows } from "../cards/RDO/phantasias/chasing-shadows.ts";
export function proveGrantedSpellshroud(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  phantasia: boolean,
) {
  for (const matching of [false, true])
    for (const own of [false, true])
      for (const zone of ["field", "hand", "banishment"] as const)
        it(`class=${matching}, own caster=${own}, source=${zone}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, matching, "activation-discount"),
          );
          const spell = phantasia ? disenchant : fireball,
            removal = phantasia ? meltdown : disorientingWinds;
          const hand = [
            spell,
            spell,
            reposition,
            removal,
            ...Array.from({ length: 18 }, () => woodlandSquirrels),
          ];
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: own ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [chasingShadows, ...(zone === "field" ? [card] : [])],
                hand: [...(own ? hand : []), ...(zone === "hand" ? [card] : [])],
                ...(zone === "banishment" ? { banishment: [card] } : {}),
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [chasingShadows],
                hand: own ? [] : hand,
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            caster = own ? p : q,
            source = p.card(card),
            protectedObject = p.card(phantasia ? chasingShadows : champion),
            other = q.card(phantasia ? chasingShadows : champion);
          const pay = (n: number) =>
            caster
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const spellCost = phantasia
            ? 2
            : grandArchiveTestFace(champion).typeLine.classes.includes("MAGE")
              ? 2
              : 4;
          if (zone === "field") {
            const before = game.state;
            expect(() =>
              caster.activate(caster.cards(spell, { zone: "hand" })[0]!, {
                reservePayment: pay(spellCost),
                targets: { "target-1": [protectedObject.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          caster.activate(caster.cards(spell, { zone: "hand" })[0]!, {
            reservePayment: pay(spellCost),
            targets: { "target-1": [other.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[other.objectId]!.zone).toBe(phantasia ? "graveyard" : "field");
          if (!phantasia) expect(game.state.objects[other.objectId]!.damage).toBe(1);
          if (!phantasia) {
            caster.activate(reposition, {
              reservePayment: pay(1),
              targets: { "target-1": [protectedObject.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[protectedObject.objectId]!.states.has("distant")).toBe(true);
          }
          if (zone === "field") {
            caster.activate(removal, {
              reservePayment: pay(phantasia ? 4 : 5),
              targets: { "target-1": [source.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[source.objectId]!.zone).toBe(
              phantasia ? "banishment" : "material-deck",
            );
          }
          caster.activate(caster.cards(spell, { zone: "hand" })[0]!, {
            reservePayment: pay(spellCost),
            targets: { "target-1": [protectedObject.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[protectedObject.objectId]!.zone).toBe(
            phantasia ? "graveyard" : "field",
          );
          if (!phantasia) expect(game.state.objects[protectedObject.objectId]!.damage).toBe(1);
        });
}
