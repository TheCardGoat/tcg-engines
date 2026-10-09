import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { glacialGuidance } from "../cards/DOA/actions/glacial-guidance.ts";
import { frozenQuill } from "../cards/AMB/items/frozen-quill.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { declareResolvedAttack, passEffectsStack } from "./decisions.ts";

export function proveWaterGraveyardPower(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  threshold: number,
  bonus: number,
  weapon: boolean,
) {
  const water = [giantTortoise, glacialGuidance, frozenQuill];
  const cards = (n: number) => Array.from({ length: n }, (_, i) => water[i % water.length]!);
  for (const matching of [false, true])
    for (const count of [0, threshold - 1, threshold, threshold + 1])
      for (const opposing of [0, threshold + 1]) {
        check(matching, count, opposing, false);
      }
  for (const matching of [false, true]) check(matching, threshold - 1, threshold + 1, true);
  function check(matching: boolean, count: number, opposing: number, response: boolean) {
    it(`class=${matching}, own water=${count}, opposing=${opposing}, response=${response}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, matching, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [woodlandSquirrels, giantTortoise, ...(weapon ? [card] : [])],
            hand: [
              ...(weapon ? [] : [card]),
              glacialGuidance,
              ...Array.from({ length: 3 }, () => woodlandSquirrels),
            ],
            memory: [giantTortoise],
            banishment: [giantTortoise],
            graveyard: [...cards(count), woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { graveyard: cards(opposing) } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion),
        foe = q.card(champion),
        source = p.card(card, { zone: weapon ? "field" : "hand" });
      const pay = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const power = () =>
        deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "power", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      const initial = 1 + (matching && count >= threshold ? bonus : 0);
      if (weapon) p.declareAttack(hero, foe, { weaponIds: [source.objectId] });
      else {
        p.activate(source, { attackAttackerId: hero.objectId, reservePayment: pay(2) });
        passEffectsStack(game);
        declareResolvedAttack(game, hero.objectId, foe.objectId, "Attack with Floodborne Swing");
      }
      expect(power()).toBe(initial);
      if (response) {
        p.activate(p.card(glacialGuidance, { zone: "hand" }), {
          reservePayment: pay(1),
          targets: { "target-1": [p.card(woodlandSquirrels, { zone: "field" }).objectId] },
        });
        passEffectsStack(game);
        expect(p.cards(glacialGuidance, { zone: "graveyard" })).toHaveLength(
          cards(count).filter((c) => c === glacialGuidance).length + 1,
        );
      }
      const expected = response ? 1 + (matching ? bonus : 0) : initial;
      expect(power()).toBe(expected);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[foe.objectId]!.damage).toBe(expected);
      if (weapon) expect(game.state.objects[source.objectId]!.counters.durability).toBe(1);
    });
  }
}
