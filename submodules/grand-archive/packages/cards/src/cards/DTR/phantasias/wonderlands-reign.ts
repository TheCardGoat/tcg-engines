import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wonderlandsReign: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0mf1ug6yfi",
  slug: "wonderlands-reign",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0mf1ug6yfi:face:default",
      catalogId: "0mf1ug6yfi",
      name: "Wonderland's Reign",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SUITED", "SPELL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Cardistry — (10): Draw a card. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
      abilities: [
        {
          id: "0mf1ug6yfi-a1",
          kind: "activated",
          text: "Cardistry — (10): Draw a card. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
          label: {
            name: "Cardistry",
          },
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: {
              kind: "calculate",
              operator: "maximum",
              operands: [
                {
                  kind: "calculate",
                  operator: "subtract",
                  operands: [
                    10,
                    {
                      kind: "count",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "subtype",
                          oneOf: ["SUITED"],
                        },
                      },
                      distinctBy: "reserve-cost",
                    },
                  ],
                },
                0,
              ],
            },
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default wonderlandsReign;
