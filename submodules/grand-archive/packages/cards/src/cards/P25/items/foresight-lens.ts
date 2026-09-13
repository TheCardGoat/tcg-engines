import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const foresightLens: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "drnxdiltx3",
  slug: "foresight-lens",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "drnxdiltx3:face:default",
      catalogId: "drnxdiltx3",
      name: "Foresight Lens",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Foresight Lens: Glimpse 2. If your champion is distant, glimpse 4 instead. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
      abilities: [
        {
          id: "drnxdiltx3-a1",
          kind: "activated",
          text: "Banish Foresight Lens: Glimpse 2. If your champion is distant, glimpse 4 instead. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "object-state",
              subject: {
                kind: "champion",
                player: "controller",
              },
              state: "distant",
            },
            then: {
              kind: "keyword-action",
              action: "glimpse",
              amount: 4,
            },
            else: {
              kind: "keyword-action",
              action: "glimpse",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default foresightLens;
