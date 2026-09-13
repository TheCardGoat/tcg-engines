import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const deliciousPastry: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "token-representation"
> = {
  canonicalId: "tCTH0Bpfr5",
  slug: "delicious-pastry",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "tCTH0Bpfr5:face:default",
      catalogId: "tCTH0Bpfr5",
      name: "Delicious Pastry",
      cost: {
        kind: "reserve",
        amount: 1,
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
        "Sacrifice Delicious Pastry: Recover 2.\n\n(2), Sacrifice Delicious Pastry: Put a buff counter on target ally.",
      abilities: [
        {
          id: "tCTH0Bpfr5-a1",
          kind: "activated",
          text: "Sacrifice Delicious Pastry: Recover 2.",
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
            amount: 2,
          },
        },
        {
          id: "tCTH0Bpfr5-a2",
          kind: "activated",
          text: "(2), Sacrifice Delicious Pastry: Put a buff counter on target ally.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
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

export default deliciousPastry;
