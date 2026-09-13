import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveCard,
  GrandArchiveEventPattern,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";
function card(
  id: string,
  type: "CHAMPION" | "ALLY" | "ACTION",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
): GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> {
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
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { life: 20, level: 0 }
            : type === "ALLY"
              ? { life: 4, power: 1 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}
const ally = card("recipientAlly", "ALLY");
const action = card("recipientAction", "ACTION", [
  {
    id: "recipientAction-a1",
    kind: "card-resolution",
    text: "Target up to two allies.",
    targets: [
      {
        id: "allies",
        kind: "target",
        declared: "announcement",
        chooser: "controller",
        count: { kind: "up-to", amount: 2 },
        unique: true,
        candidates: { kind: "object", zones: ["field"], filter: { kind: "type", oneOf: ["ALLY"] } },
      },
    ],
    effect: { kind: "draw", player: "controller", amount: 0 },
  },
]);
describe("activation recipient bindings", () => {
  for (const mode of ["trigger", "replacement"] as const)
    for (const alias of [false, true])
      for (const count of [1, 2])
        it(`${mode}, alias=${alias}, targets=${count}`, () => {
          const pattern: GrandArchiveEventPattern = {
            name: "card-activated",
            actor: "controller",
            recipient: { kind: "event-object", ...(alias ? { bindAs: "selectedAllies" } : {}) },
          };
          const effect: GrandArchiveEffect = {
            kind: "add-counter",
            subject: { kind: "bound", binding: alias ? "selectedAllies" : "eventRecipient" },
            counter: "buff",
            amount: 1,
          };
          const observer: GrandArchiveAbilityDefinition =
            mode === "trigger"
              ? {
                  id: "recipientObserver-a1",
                  kind: "triggered",
                  text: "Mark the targeted allies.",
                  trigger: { kind: "event", event: pattern },
                  effect,
                }
              : {
                  id: "recipientObserver-a1",
                  kind: "static",
                  staticKind: "effects",
                  text: "Mark targets before activation.",
                  effects: [
                    {
                      kind: "replacement",
                      event: pattern,
                      operation: { kind: "perform-before-commit", effect },
                      duration: { kind: "while-source-in-functional-zone" },
                    },
                  ],
                };
          const hero = card("recipientChampion", "CHAMPION", [observer]);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: { champion: hero, zones: { hand: [action], field: [ally, ally, ally] } },
            playerTwo: { champion: card("otherChampion", "CHAMPION") },
          });
          const p = game.player("player-one"),
            allies = p.cards(ally);
          p.activate(action, {
            targets: { allies: allies.slice(0, count).map((c) => c.objectId) },
          });
          for (let i = 0; game.state.stack.length && i < 50; i++) {
            const w = game.waitState();
            if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
            game.player(w.playerId).pass();
          }
          expect(game.state.stack).toHaveLength(0);
          for (const [i, a] of allies.entries())
            expect(game.state.objects[a.objectId]!.counters.buff ?? 0).toBe(i < count ? 1 : 0);
        });
});
