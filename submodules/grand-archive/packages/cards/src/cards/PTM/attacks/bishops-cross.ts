import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bishopsCross: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lsKJCCuFJV",
  slug: "bishops-cross",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lsKJCCuFJV:face:default",
      catalogId: "lsKJCCuFJV",
      name: "Bishop's Cross",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "COMMAND"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
      },
      rulesText:
        "Command Chessman (A Chessman ally you control performs this attack.)\n\nOn Kill: If the killed unit had an odd life stat, draw a card.",
      abilities: [
        {
          id: "lsKJCCuFJV-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Command Chessman (A Chessman ally you control performs this attack.)",
          keyword: {
            name: "command",
            subtype: "Chessman",
          },
        },
        {
          id: "lsKJCCuFJV-a2",
          kind: "triggered",
          text: "On Kill: If the killed unit had an odd life stat, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "subject-matches",
              subject: {
                kind: "event-recipient",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                  {
                    kind: "parity",
                    property: "life",
                    value: "odd",
                  },
                ],
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default bishopsCross;
