import { backdash, trainingSword, woodlandSquirrels } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";

function champion(level: number): GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> {
  const id = `hosted-keyword-${level}`;
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        lineageName: "Fixture",
        cost: { kind: "memory", amount: level },
        elements: ["NORM"],
        stats: { level, life: 20 },
        typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["SPIRIT"], subtypes: [] },
        rulesText: "",
        abilities:
          level === 0
            ? []
            : [
                {
                  id: `${id}-a1`,
                  kind: "static",
                  staticKind: "intrinsic",
                  text: `Inherited Effect — Ranged ${level}`,
                  keyword: { name: "ranged", value: level },
                  executionSource: "lineage-host",
                  functionalZones: ["inner-lineage"],
                },
              ],
      },
    },
  };
}

describe("Hosted keyword origins contribute exactly once", () => {
  for (const level of [0, 1, 2])
    for (const distant of [false, true])
      it(`level=${level}, distant=${distant}`, () => {
        const starter = champion(0),
          one = champion(1),
          two = champion(2);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion: starter,
            lineage: level === 0 ? [] : level === 1 ? [one] : [one, two],
            zones: {
              field: [trainingSword],
              hand: [backdash, woodlandSquirrels],
              "material-deck": level === 0 ? [one, two] : [],
            },
          },
          playerTwo: { champion: starter },
        });
        const p = game.player("player-one"),
          source = p.card(starter),
          target = game.player("player-two").card(starter);
        if (distant) {
          p.activate(backdash, {
            targets: { "target-1": [source.objectId] },
            reservePayment: [{ kind: "card", cardId: p.card(woodlandSquirrels).objectId }],
          });
          expect(game.resolveStackUntilChoice()).toBe("stack-empty");
        }
        p.declareAttack(source, target, { weaponIds: [p.card(trainingSword).objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(
          1 + (distant ? (level === 2 ? 3 : level) : 0),
        );
      });
});
