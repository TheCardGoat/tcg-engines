import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const felicitousFlock: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "it9jbu4axg",
  slug: "felicitous-flock",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "it9jbu4axg:face:default",
      catalogId: "it9jbu4axg",
      name: "Felicitous Flock",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "BIRD"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Intercept\n\n[Element Bonus] [Class Bonus] Whenever you reveal Felicitous Flock from your memory, summon a Fledgling token with a buff counter on it. It gains intercept until end of turn.",
      abilities: [
        {
          id: "it9jbu4axg-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "it9jbu4axg-a2",
          kind: "triggered",
          text: "[Element Bonus] [Class Bonus] Whenever you reveal Felicitous Flock from your memory, summon a Fledgling token with a buff counter on it. It gains intercept until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "card-revealed",
              actor: "controller",
              from: "memory",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "summon",
                object: "Fledgling",
                controller: "controller",
                bindResultAs: "summoned-token",
                entersWithCounters: [
                  {
                    counter: "buff",
                    amount: 1,
                  },
                ],
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "source",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "intercept",
                  },
                },
              },
            ],
          },
          functionalZones: ["memory"],
        },
      ],
    },
  },
};

export default felicitousFlock;
