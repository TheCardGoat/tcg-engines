import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const plumingCrescendo: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xgi39z49tu",
  slug: "pluming-crescendo",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xgi39z49tu:face:default",
      catalogId: "xgi39z49tu",
      name: "Pluming Crescendo",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "HARMONY"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "Harmonize — If you've activated a Melody card this turn, summon two Fledgling tokens.\n\nAnimals you control get +1 POWER until end of turn.",
      abilities: [
        {
          id: "xgi39z49tu-a1",
          kind: "card-resolution",
          text: "Harmonize — If you've activated a Melody card this turn, summon two Fledgling tokens.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "history",
              event: "card-activated",
              window: "this-turn",
              actor: "controller",
              filter: {
                kind: "subtype",
                oneOf: ["MELODY"],
              },
              minimum: 1,
            },
            then: {
              kind: "summon",
              object: "Fledgling",
              controller: "controller",
              bindResultAs: "summoned-token",
              amount: 2,
            },
          },
          label: {
            name: "Harmonize",
          },
        },
        {
          id: "xgi39z49tu-a2",
          kind: "card-resolution",
          text: "Animals you control get +1 POWER until end of turn.",
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
                      kind: "subtype",
                      oneOf: ["ANIMAL"],
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

export default plumingCrescendo;
