import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const constellationsBlessing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nypwwnirjk",
  slug: "constellations-blessing",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nypwwnirjk:face:default",
      catalogId: "nypwwnirjk",
      name: "Constellation's Blessing",
      cost: {
        kind: "reserve",
        amount: 1,
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
        "[Element Bonus] Aethercalling (As you're looking at this card while glimpsing, you may load it into an Aetherwing weapon you control.)\n\n[Class Bonus] Draw a card. Then you may load Constellation's Blessing into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "nypwwnirjk-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Element Bonus] Aethercalling (As you're looking at this card while glimpsing, you may load it into an Aetherwing weapon you control.)",
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
          id: "nypwwnirjk-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Draw a card. Then you may load Constellation's Blessing into an Aetherwing weapon you control.",
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
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
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

export default constellationsBlessing;
