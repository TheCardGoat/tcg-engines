import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const artOfWar: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fjne9ri261",
  slug: "art-of-war",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fjne9ri261:face:default",
      catalogId: "fjne9ri261",
      name: "Art of War",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SCRIPTURE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Divine Relic\n\nPlayers can't declare attacks with allies that entered the field this turn.\n\nWhile paying for a memory cost, you may banish Art of War to pay for 1 of that cost.",
      abilities: [
        {
          id: "fjne9ri261-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Divine Relic",
          keyword: {
            name: "divine-relic",
          },
        },
        {
          id: "fjne9ri261-a2",
          kind: "static",
          staticKind: "effects",
          text: "Players can't declare attacks with allies that entered the field this turn.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "attack",
              subject: {
                kind: "player",
                player: "each-player",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                  {
                    kind: "entered-field-this-turn",
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "fjne9ri261-a3",
          kind: "static",
          staticKind: "effects",
          text: "While paying for a memory cost, you may banish Art of War to pay for 1 of that cost.",
          effects: [
            {
              kind: "rule-modification",
              mode: "payment-contribution",
              action: "pay-cost",
              subject: {
                kind: "player",
                player: "controller",
              },
              costKind: "memory",
              cost: {
                kind: "banish-self",
              },
              amount: 1,
              contributionBasis: "total",
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default artOfWar;
