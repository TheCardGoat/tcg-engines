import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stormTyrantsEye: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "EQZZsiUDyl",
  slug: "storm-tyrants-eye",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "EQZZsiUDyl:face:default",
      catalogId: "EQZZsiUDyl",
      name: "Storm Tyrant's Eye",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ARTIFACT"],
      },
      elements: ["ARCANE"],
      stats: {},
      rulesText:
        "Banish Storm Tyrant's Eye: Reveal cards from the top of your deck until you reveal an arcane element card. Deal unpreventable damage to your champion equal to the amount of cards revealed this way. Put one of those cards into your hand and the rest on the bottom of your deck in a random order.",
      abilities: [
        {
          id: "EQZZsiUDyl-a1",
          kind: "activated",
          text: "Banish Storm Tyrant's Eye: Reveal cards from the top of your deck until you reveal an arcane element card. Deal unpreventable damage to your champion equal to the amount of cards revealed this way. Put one of those cards into your hand and the rest on the bottom of your deck in a random order.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal-until",
                player: "controller",
                zone: "main-deck",
                stopWhen: {
                  kind: "element",
                  oneOf: ["ARCANE"],
                },
                bindMatchAs: "revealed-arcane-card",
                bindRemainderAs: "revealed-before-arcane",
                bindResultAs: "revealed-cards",
              },
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "champion",
                  player: "controller",
                },
                amount: {
                  kind: "count",
                  collection: {
                    binding: "revealed-cards",
                  },
                },
                preventable: false,
              },
              {
                kind: "choose",
                selection: {
                  id: "chosen-revealed-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "revealed-cards",
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "chosen-revealed-card",
                      },
                      destination: {
                        zone: "hand",
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "binding-remainder",
                        binding: "revealed-cards",
                        excluding: "chosen-revealed-card",
                      },
                      destination: {
                        zone: "main-deck",
                        placement: {
                          kind: "bottom",
                          order: {
                            kind: "random",
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
      ],
    },
  },
};

export default stormTyrantsEye;
