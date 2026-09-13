import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const feuAwakening: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0rKmarZ8QN",
  slug: "feu-awakening",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0rKmarZ8QN:face:default",
      catalogId: "0rKmarZ8QN",
      name: "Feu Awakening",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Interdiction (As long as this card's activation is on the effects stack, players can't gain opportunity.)\n\n[Ciel Bonus] Discard all cards from your hand and memory. Then banish up to two cards from your graveyard. Put an omen counter on each card banished this way. Until end of turn, card activations you control can't be negated.\n\n",
      abilities: [
        {
          id: "0rKmarZ8QN-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Interdiction (As long as this card's activation is on the effects stack, players can't gain opportunity.)",
          keyword: {
            name: "interdiction",
          },
        },
        {
          id: "0rKmarZ8QN-a2",
          kind: "card-resolution",
          text: "[Ciel Bonus] Discard all cards from your hand and memory. Then banish up to two cards from your graveyard. Put an omen counter on each card banished this way. Until end of turn, card activations you control can't be negated.",
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
            kind: "sequence",
            effects: [
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "discarded-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["hand", "memory"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
              },
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "up-to",
                        amount: 2,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["graveyard"],
                        relationship: "zone-of",
                        player: "controller",
                      },
                    },
                  },
                  {
                    kind: "add-counter",
                    subject: {
                      kind: "bound",
                      binding: "banished-cards",
                    },
                    counter: "omen",
                    amount: 1,
                  },
                  {
                    kind: "rule-modification",
                    mode: "forbid",
                    action: "negate",
                    activationKind: "card",
                    against: {
                      kind: "each",
                      collection: {
                        zones: ["effects-stack"],
                        player: "controller",
                      },
                    },
                    duration: {
                      kind: "this-turn",
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },
};

export default feuAwakening;
