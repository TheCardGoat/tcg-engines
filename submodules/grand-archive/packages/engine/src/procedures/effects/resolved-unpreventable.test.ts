import { enfeebledDagger, sovereignSanctuary, woodlandSquirrels } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";
function settle(game: GrandArchiveTestEngine) {
  for (let n = 0; n < 32 && game.state.stack.length; n++) {
    const w = game.waitState();
    if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
    game.player(w.playerId).pass();
  }
}
describe("Resolved damage-prevention prohibitions", () => {
  for (const damageKind of ["combat", "non-combat"] as const)
    it(`resolves a ${damageKind} source-scoped prohibition without bypassing other damage prevention`, () => {
      const champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
        canonicalId: "resolved-unpreventable-champion",
        slug: "resolved-unpreventable-champion",
        definitionKind: "card",
        layout: {
          kind: "single-faced",
          face: {
            id: "resolved-unpreventable-champion:face:default",
            catalogId: "resolved-unpreventable-champion",
            name: "Unpreventable Fixture",
            cost: { kind: "memory", amount: 0 },
            elements: ["NORM"],
            stats: { level: 0, life: 20, power: 2 },
            typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["SPIRIT"], subtypes: [] },
            rulesText: "",
            abilities: [
              {
                id: "resolvedUnpreventable-a1",
                kind: "activated",
                activation: "ability",
                text: "This champion's selected damage type cannot be prevented this turn.",
                cost: { kind: "pay-reserve", amount: 0 },
                effect: {
                  kind: "rule-modification",
                  mode: "forbid",
                  action: "prevent-damage",
                  using: { kind: "source" },
                  damageKind,
                  duration: { kind: "this-turn" },
                },
              },
            ],
          },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion, zones: { field: [enfeebledDagger, woodlandSquirrels] } },
        playerTwo: { champion, zones: { field: [sovereignSanctuary] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion),
        target = q.card(champion);
      p.activateAbility(hero, "resolvedUnpreventable-a1");
      expect(game.state.objects[target.objectId]!.damage).toBe(0);
      settle(game);
      p.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
        targets: { "target-unit": [target.objectId] },
      });
      settle(game);
      expect(game.state.objects[target.objectId]!.damage).toBe(0);
      p.declareAttack(p.card(woodlandSquirrels), target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(0);
      p.declareAttack(hero, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(damageKind === "combat" ? 2 : 0);
    });
});
