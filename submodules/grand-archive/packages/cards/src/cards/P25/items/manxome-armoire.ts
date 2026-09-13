import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const manxomeArmoire: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fm894uc4ij",
  slug: "manxome-armoire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fm894uc4ij:face:default",
      catalogId: "fm894uc4ij",
      name: "Manxome Armoire",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Ciel Bonus] Banish Manxome Armoire: Return one of your omens to your hand. If you do, banish a card from your hand and put an omen counter on it. (An omen is a card in a banishment with an omen counter on it.)",
      abilities: [
        {
          id: "fm894uc4ij-a1",
          kind: "activated",
          text: "[Ciel Bonus] Banish Manxome Armoire: Return one of your omens to your hand. If you do, banish a card from your hand and put an omen counter on it. (An omen is a card in a banishment with an omen counter on it.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "returned-omen",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["banishment"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "has-counter",
                  counter: "omen",
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "returned-omen",
                  },
                  from: "banishment",
                  destination: {
                    zone: "hand",
                  },
                },
                {
                  kind: "choose",
                  selection: {
                    id: "new-omen",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
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
                        kind: "banish",
                        player: "controller",
                        selection: {
                          id: "new-omen",
                          kind: "choice",
                          declared: "resolution",
                          chooser: "controller",
                          count: {
                            kind: "exactly",
                            amount: 1,
                          },
                          candidates: {
                            kind: "card",
                            zones: ["hand"],
                            relationship: "zone-of",
                            player: "controller",
                          },
                        },
                      },
                      {
                        kind: "add-counter",
                        subject: {
                          kind: "bound",
                          binding: "new-omen",
                        },
                        counter: "omen",
                        amount: 1,
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default manxomeArmoire;
