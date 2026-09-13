import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ombreuxChevalier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "crv1etn4g3",
  slug: "ombreux-chevalier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "crv1etn4g3:face:default",
      catalogId: "crv1etn4g3",
      name: "Ombreux Chevalier",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "On Enter: Return one of your omens to your hand. If you do, banish a card from your hand and put an omen counter on it. (An omen is a card in a banishment with an omen counter on it.)",
      abilities: [
        {
          id: "crv1etn4g3-a1",
          kind: "triggered",
          text: "On Enter: Return one of your omens to your hand. If you do, banish a card from your hand and put an omen counter on it. (An omen is a card in a banishment with an omen counter on it.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "reflexive",
            action: {
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
            },
            consequence: {
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
                    bindResultAs: "new-omen",
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
          },
        },
      ],
    },
  },
};

export default ombreuxChevalier;
