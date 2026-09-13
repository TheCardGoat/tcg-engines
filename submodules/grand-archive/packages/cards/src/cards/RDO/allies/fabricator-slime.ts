import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fabricatorSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rpELNyrSrM",
  slug: "fabricator-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rpELNyrSrM:face:default",
      catalogId: "rpELNyrSrM",
      name: "Fabricator Slime",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SLIME"],
      },
      elements: ["NEOS"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Pride 3\n\nFabricator Slime enters the field with a buff counter on it.\n\n[Class Bonus] REST: For each of up to three buff counters on Fabricator Slime, summon a Baby Slime token.",
      abilities: [
        {
          id: "rpELNyrSrM-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 3",
          keyword: {
            name: "pride",
            value: 3,
          },
        },
        {
          id: "rpELNyrSrM-a2",
          kind: "static",
          staticKind: "effects",
          text: "Fabricator Slime enters the field with a buff counter on it.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "add-object-counters",
                counters: [
                  {
                    counter: "buff",
                    amount: 1,
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "rpELNyrSrM-a3",
          kind: "activated",
          text: "[Class Bonus] REST: For each of up to three buff counters on Fabricator Slime, summon a Baby Slime token.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
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
          effect: {
            kind: "repeat",
            count: {
              kind: "calculate",
              operator: "minimum",
              operands: [
                {
                  kind: "counter-count",
                  subject: {
                    kind: "source",
                  },
                  counter: "buff",
                },
                3,
              ],
            },
            effect: {
              kind: "summon",
              object: "Baby Slime",
              controller: "controller",
              bindResultAs: "summoned-token",
            },
          },
        },
      ],
    },
  },
};

export default fabricatorSlime;
