import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slySongstress: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "f28y5rn0dt",
  slug: "sly-songstress",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "f28y5rn0dt:face:default",
      catalogId: "f28y5rn0dt",
      name: "Sly Songstress",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN", "MELODY"],
      },
      elements: ["FIRE"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Stealth (This unit can't be targeted by attacks unless permitted by true sight.)\n\nWhenever you activate a Harmony or a Melody card, you may discard a card. If you do, draw a card.",
      abilities: [
        {
          id: "f28y5rn0dt-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
        {
          id: "f28y5rn0dt-a2",
          kind: "triggered",
          text: "Whenever you activate a Harmony or a Melody card, you may discard a card. If you do, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["MELODY"],
                },
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "discard",
                  player: "controller",
                  selection: {
                    id: "discarded-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["hand"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default slySongstress;
