import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const secondWind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Huh1DljE0j",
  slug: "second-wind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Huh1DljE0j:face:default",
      catalogId: "Huh1DljE0j",
      name: "Second Wind",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Wake up target ally. Class Bonus: That ally gets +1 POWER until end of turn. (Apply the additional effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "Huh1DljE0j-a1",
          kind: "card-resolution",
          text: "Wake up target ally. Class Bonus: That ally gets +1 POWER until end of turn. (Apply the additional effect only if your champion's class matches this card's class.)",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "wake",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "champion-matches-source",
                  characteristic: "class",
                },
                then: {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-1",
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
      ],
    },
  },
};

export default secondWind;
