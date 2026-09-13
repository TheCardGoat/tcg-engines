import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rightOfRealm: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ptrz1bqry4",
  slug: "right-of-realm",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ptrz1bqry4:face:default",
      catalogId: "ptrz1bqry4",
      name: "Right of Realm",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Whenever you activate a domain card, you may sacrifice Right of Realm. If you do, that domain enters the field without any of its upkeep abilities.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "ptrz1bqry4-a1",
          kind: "triggered",
          text: "Whenever you activate a domain card, you may sacrifice Right of Realm. If you do, that domain enters the field without any of its upkeep abilities.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["DOMAIN"],
                },
                bindAs: "activated-domain",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "sacrifice",
                  subject: {
                    kind: "source",
                  },
                },
                {
                  kind: "create-delayed-trigger",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "object-entered-field",
                      subject: {
                        kind: "bound-object",
                        binding: "activated-domain",
                      },
                      cause: {
                        kind: "card-activation",
                        controller: "controller",
                      },
                    },
                  },
                  limit: 1,
                  effect: {
                    kind: "continuous",
                    subjects: {
                      kind: "event-subject",
                    },
                    affectedSet: "locked",
                    duration: {
                      kind: "permanent",
                    },
                    layer: {
                      layer: "D",
                      modifies: "ability",
                    },
                    change: {
                      kind: "remove-abilities",
                      filter: {
                        label: "Upkeep",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          id: "ptrz1bqry4-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default rightOfRealm;
