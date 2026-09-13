import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aethericCalibration: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7l9th23niu",
  slug: "aetheric-calibration",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7l9th23niu:face:default",
      catalogId: "7l9th23niu",
      name: "Aetheric Calibration",
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
        "Glimpse 4. Then reveal the top card of your deck. If that card is an Aethercharge card, put it into your memory. \n\nYou may load Aetheric Calibration into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "7l9th23niu-a1",
          kind: "card-resolution",
          text: "Glimpse 4. Then reveal the top card of your deck. If that card is an Aethercharge card, put it into your memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 4,
              },
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "reveal",
                    player: "controller",
                    selection: {
                      id: "referenced-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["main-deck"],
                        relationship: "zone-of",
                        player: "controller",
                        fromTop: true,
                      },
                    },
                  },
                  {
                    kind: "conditional",
                    condition: {
                      kind: "subject-matches",
                      subject: {
                        kind: "bound",
                        binding: "referenced-cards",
                      },
                      filter: {
                        kind: "subtype",
                        oneOf: ["AETHERCHARGE"],
                      },
                    },
                    then: {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "referenced-cards",
                      },
                      destination: {
                        zone: "memory",
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          id: "7l9th23niu-a2",
          kind: "card-resolution",
          text: "You may load Aetheric Calibration into an Aetherwing weapon you control.",
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

export default aethericCalibration;
