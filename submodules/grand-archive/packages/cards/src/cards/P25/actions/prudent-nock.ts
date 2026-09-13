import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const prudentNock: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0w5bp5nuae",
  slug: "prudent-nock",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0w5bp5nuae:face:default",
      catalogId: "0w5bp5nuae",
      name: "Prudent Nock",
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
      elements: ["NORM"],
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "Draw a card into your memory. Then you may load Prudent Nock into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "0w5bp5nuae-a1",
          kind: "card-resolution",
          text: "Draw a card into your memory. Then you may load Prudent Nock into an Aetherwing weapon you control.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
              {
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
            ],
          },
        },
      ],
    },
  },
};

export default prudentNock;
