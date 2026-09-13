import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hornOfBeastcalling: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6e7lRnczfL",
  slug: "horn-of-beastcalling",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6e7lRnczfL:face:default",
      catalogId: "6e7lRnczfL",
      name: "Horn of Beastcalling",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "INSTRUMENT"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "Banish Horn of Beastcalling: The next Beast ally card you activate this turn costs 3 less to activate. Class Bonus: Draw a card. (Apply the additional effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "6e7lRnczfL-a1",
          kind: "activated",
          text: "Banish Horn of Beastcalling: The next Beast ally card you activate this turn costs 3 less to activate. Class Bonus: Draw a card. (Apply the additional effect only if your champion's class matches this card's class.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "rule-modification",
                mode: "modify-cost",
                action: "activate",
                subject: {
                  kind: "player",
                  player: "controller",
                },
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["BEAST"],
                    },
                  ],
                },
                costKind: "reserve",
                costOperation: "subtract",
                amount: 3,
                duration: {
                  kind: "for-next-event",
                  event: "card-activated",
                  expires: {
                    kind: "this-turn",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "champion-matches-source",
                  characteristic: "class",
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default hornOfBeastcalling;
