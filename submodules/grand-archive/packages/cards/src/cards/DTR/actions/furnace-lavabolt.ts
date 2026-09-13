import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const furnaceLavabolt: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ru4g75uz1i",
  slug: "furnace-lavabolt",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ru4g75uz1i:face:default",
      catalogId: "ru4g75uz1i",
      name: "Furnace Lavabolt",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nEach player draws a card. \n\nYou may load Furnace Lavabolt into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "ru4g75uz1i-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ru4g75uz1i-a2",
          kind: "card-resolution",
          text: "Each player draws a card.",
          effect: {
            kind: "draw",
            player: "each-player",
            amount: 1,
          },
        },
        {
          id: "ru4g75uz1i-a3",
          kind: "card-resolution",
          text: "You may load Furnace Lavabolt into an Aetherwing weapon you control.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "chosen-weapon",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                unique: true,
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
                        oneOf: ["WEAPON"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["AETHERWING"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "move",
                subject: {
                  kind: "source",
                },
                destination: {
                  zone: "loaded",
                  host: {
                    kind: "bound",
                    binding: "chosen-weapon",
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default furnaceLavabolt;
