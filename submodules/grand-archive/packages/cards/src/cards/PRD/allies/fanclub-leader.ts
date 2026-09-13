import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fanclubLeader: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "u7IxJt1EaD",
  slug: "fanclub-leader",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "u7IxJt1EaD:face:default",
      catalogId: "u7IxJt1EaD",
      name: "Fanclub Leader",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "RESONATOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Whenever you activate a Harmony or Melody card, Resonator allies you control get +1POWER until end of turn.",
      abilities: [
        {
          id: "u7IxJt1EaD-a1",
          kind: "triggered",
          text: "Whenever you activate a Harmony or Melody card, Resonator allies you control get +1POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["HARMONY", "MELODY"],
                },
              },
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["RESONATOR"],
                    },
                  ],
                },
              },
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "power",
              operation: "add",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default fanclubLeader;
