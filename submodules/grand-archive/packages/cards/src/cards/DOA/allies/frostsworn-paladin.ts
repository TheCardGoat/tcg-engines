import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const frostswornPaladin: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rpOaAjgtue",
  slug: "frostsworn-paladin",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rpOaAjgtue:face:default",
      catalogId: "rpOaAjgtue",
      name: "Frostsworn Paladin",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "WARRIOR"],
        subtypes: ["CLERIC", "WARRIOR", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)\n\nOn Enter: You may banish a card with floating memory from your graveyard. If you do, draw a card and put a buff counter on Frostsworn Paladin.",
      abilities: [
        {
          id: "rpOaAjgtue-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "rpOaAjgtue-a2",
          kind: "triggered",
          text: "On Enter: You may banish a card with floating memory from your graveyard. If you do, draw a card and put a buff counter on Frostsworn Paladin.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["graveyard"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "has-keyword",
                          keyword: "floating-memory",
                        },
                      },
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "draw",
                        player: "controller",
                        amount: 1,
                      },
                      {
                        kind: "add-counter",
                        subject: {
                          kind: "source",
                        },
                        counter: "buff",
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

export default frostswornPaladin;
