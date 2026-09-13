import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const burningAethercharge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vrK16VZ2zU",
  slug: "burning-aethercharge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vrK16VZ2zU:face:default",
      catalogId: "vrK16VZ2zU",
      name: "Burning Aethercharge",
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
      elements: ["FIRE"],
      speed: "slow",
      stats: {
        power: 1,
      },
      rulesText:
        "[Class Bonus] Kindle 2 (You may banish up to two fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card’s cost.)\n\nDeal 2 damage to target champion. Then you may load Burning Aethercharge into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "vrK16VZ2zU-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Kindle 2 (You may banish up to two fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card’s cost.)",
          keyword: {
            name: "kindle",
            value: 2,
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
        },
        {
          id: "vrK16VZ2zU-a2",
          kind: "card-resolution",
          text: "Deal 2 damage to target champion. Then you may load Burning Aethercharge into an Aetherwing weapon you control.",
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: 2,
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

export default burningAethercharge;
