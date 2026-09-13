import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bellOfTheChosen: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dvxsl5klqe",
  slug: "bell-of-the-chosen",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dvxsl5klqe:face:default",
      catalogId: "dvxsl5klqe",
      name: "Bell of the Chosen",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ACCESSORY"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "On Enter: Put a quest counter on your champion. If Bell of the Chosen entered from a banishment, glimpse 2. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
      abilities: [
        {
          id: "dvxsl5klqe-a1",
          kind: "triggered",
          text: "On Enter: Put a quest counter on your champion. If Bell of the Chosen entered from a banishment, glimpse 2. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
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
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: {
                  named: "quest",
                },
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "entered-from-banishment",
                },
                then: {
                  kind: "keyword-action",
                  action: "glimpse",
                  amount: 2,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default bellOfTheChosen;
