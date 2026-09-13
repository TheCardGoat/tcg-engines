import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fluffyShopkeep: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "px60u5n1do",
  slug: "fluffy-shopkeep",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "px60u5n1do:face:default",
      catalogId: "px60u5n1do",
      name: "Fluffy Shopkeep",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "HUMAN", "SHEEP"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)\n\nOn Enter: You may banish two cards from your material deck. If you do, draw a card into your memory.",
      abilities: [
        {
          id: "px60u5n1do-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "px60u5n1do-a2",
          kind: "triggered",
          text: "On Enter: You may banish two cards from your material deck. If you do, draw a card into your memory.",
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
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "banished-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 2,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["material-deck"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default fluffyShopkeep;
