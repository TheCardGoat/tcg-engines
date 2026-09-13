import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const exquisiteDessert: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5HPvGPjsD9",
  slug: "exquisite-dessert",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5HPvGPjsD9:face:default",
      catalogId: "5HPvGPjsD9",
      name: "Exquisite Dessert",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FOOD"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Sacrifice Exquisite Dessert: Recover 4.\n\n(1), Sacrifice Exquisite Dessert: Put a buff counter on target ally.",
      abilities: [
        {
          id: "5HPvGPjsD9-a1",
          kind: "activated",
          text: "Sacrifice Exquisite Dessert: Recover 4.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "recover",
            player: "controller",
            amount: 4,
          },
        },
        {
          id: "5HPvGPjsD9-a2",
          kind: "activated",
          text: "(1), Sacrifice Exquisite Dessert: Put a buff counter on target ally.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 1,
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default exquisiteDessert;
