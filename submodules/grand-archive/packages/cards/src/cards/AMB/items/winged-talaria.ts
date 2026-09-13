import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wingedTalaria: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yfid3xuxax",
  slug: "winged-talaria",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yfid3xuxax:face:default",
      catalogId: "yfid3xuxax",
      name: "Winged Talaria",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BOOTS"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "(2), Banish Winged Talaria: Target unit becomes distant. (Units stay distant until the end of their controller's turn.)",
      abilities: [
        {
          id: "yfid3xuxax-a1",
          kind: "activated",
          text: "(2), Banish Winged Talaria: Target unit becomes distant. (Units stay distant until the end of their controller's turn.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "banish-self",
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
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "set-object-state",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            state: "distant",
            value: true,
          },
        },
      ],
    },
  },
};

export default wingedTalaria;
