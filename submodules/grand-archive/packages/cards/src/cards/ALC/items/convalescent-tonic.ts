import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const convalescentTonic: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l8ao8bls6g",
  slug: "convalescent-tonic",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "l8ao8bls6g:face:default",
      catalogId: "l8ao8bls6g",
      name: "Convalescent Tonic",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Brew — One Fraysia (You may sacrifice the listed objects rather than pay this card's reserve cost.) \n\nSacrifice Convalescent Tonic: Put up to two cards from your hand on the bottom of your deck then draw that many cards. Recover 3. ",
      abilities: [
        {
          id: "l8ao8bls6g-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Fraysia (You may sacrifice the listed objects rather than pay this card's reserve cost.)",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "name",
                value: "Fraysia",
                count: 1,
              },
            ],
          },
        },
        {
          id: "l8ao8bls6g-a2",
          kind: "activated",
          text: "Sacrifice Convalescent Tonic: Put up to two cards from your hand on the bottom of your deck then draw that many cards. Recover 3.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose",
                selection: {
                  id: "moved-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 2,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "moved-cards",
                      },
                      from: "hand",
                      destination: {
                        zone: "main-deck",
                        placement: {
                          kind: "bottom",
                          orderChosenBy: "controller",
                        },
                      },
                      bindResultAs: "moved-card-count",
                    },
                    {
                      kind: "draw",
                      player: "controller",
                      amount: {
                        kind: "binding-count",
                        binding: "moved-card-count",
                      },
                    },
                  ],
                },
              },
              {
                kind: "recover",
                player: "controller",
                amount: 3,
              },
            ],
          },
        },
      ],
    },
  },
};

export default convalescentTonic;
