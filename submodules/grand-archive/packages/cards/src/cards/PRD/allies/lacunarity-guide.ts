import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lacunarityGuide: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6rheGKZGyG",
  slug: "lacunarity-guide",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6rheGKZGyG:face:default",
      catalogId: "6rheGKZGyG",
      name: "Lacunarity Guide",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "As long as you control one or more Fractal phantasias, Lacunarity Guide has stealth. \n\nYou may sacrifice two Fractal phantasias rather than pay the memory cost of champion cards you materialize.",
      abilities: [
        {
          id: "6rheGKZGyG-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control one or more Fractal phantasias, Lacunarity Guide has stealth.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["PHANTASIA"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["FRACTAL"],
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "stealth",
                },
              },
            },
          ],
        },
        {
          id: "6rheGKZGyG-a2",
          kind: "card-resolution",
          text: "You may sacrifice two Fractal phantasias rather than pay the memory cost of champion cards you materialize.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "sacrificed-object",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  relationship: "controlled-by",
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["PHANTASIA"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["FRACTAL"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "sacrifice",
                subject: {
                  kind: "bound",
                  binding: "sacrificed-object",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default lacunarityGuide;
