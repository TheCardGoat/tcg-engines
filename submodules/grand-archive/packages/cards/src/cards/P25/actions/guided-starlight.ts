import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const guidedStarlight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "b0iz7wm7ow",
  slug: "guided-starlight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "b0iz7wm7ow:face:default",
      catalogId: "b0iz7wm7ow",
      name: "Guided Starlight",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "fast",
      stats: {
        power: 2,
      },
      rulesText:
        "[Element Bonus] Aethercalling\n\nYour champion's next attack this turn gains unblockable unless an opponent pays (3). \n\nYou may load Guided Starlight into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "b0iz7wm7ow-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Element Bonus] Aethercalling",
          keyword: {
            name: "aethercalling",
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
          ],
        },
        {
          id: "b0iz7wm7ow-a2",
          kind: "card-resolution",
          text: "Your champion's next attack this turn gains unblockable unless an opponent pays (3).",
          effect: {
            kind: "unless-paid",
            player: "any-opponent-in-turn-order",
            cost: {
              kind: "pay-reserve",
              amount: 3,
            },
            otherwise: {
              kind: "create-delayed-trigger",
              trigger: {
                kind: "event",
                event: {
                  name: "attack-declared",
                  subject: {
                    kind: "event-object",
                    controller: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                },
              },
              limit: 1,
              expires: {
                kind: "this-turn",
              },
              effect: {
                kind: "continuous",
                subjects: {
                  kind: "current-attack",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-attack",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "unblockable",
                  },
                },
              },
            },
          },
        },
        {
          id: "b0iz7wm7ow-a3",
          kind: "card-resolution",
          text: "You may load Guided Starlight into an Aetherwing weapon you control.",
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

export default guidedStarlight;
