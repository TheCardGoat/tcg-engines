import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const siderealSpellshot: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xwwkxq0vp3",
  slug: "sidereal-spellshot",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xwwkxq0vp3:face:default",
      catalogId: "xwwkxq0vp3",
      name: "Sidereal Spellshot",
      cost: {
        kind: "reserve",
        amount: {
          kind: "variable",
          symbol: "X",
        },
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
        "[Element Bonus] Aethercalling (As you're looking at this card while glimpsing, you may load it into an Aetherwing weapon you control.)\n\n[Class Bonus] Glimpse X. Then you may load Sidereal Spellshot into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "xwwkxq0vp3-a1",
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
          id: "xwwkxq0vp3-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Glimpse X. Then you may load Sidereal Spellshot into an Aetherwing weapon you control.",
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
                kind: "keyword-action",
                action: "glimpse",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
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

export default siderealSpellshot;
