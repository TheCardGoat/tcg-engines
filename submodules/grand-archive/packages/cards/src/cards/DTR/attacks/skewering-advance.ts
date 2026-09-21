import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const skeweringAdvance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "no5tu5412v",
  slug: "skewering-advance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "no5tu5412v:face:default",
      catalogId: "no5tu5412v",
      name: "Skewering Advance",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "CHESSMAN", "COMMAND"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
      },
      rulesText:
        "Command Chessman (A Chessman ally you control performs this attack.)\n\nOn Kill: If the killed unit had an even life stat, draw a card.\n",
      abilities: [
        {
          id: "no5tu5412v-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Command Chessman (A Chessman ally you control performs this attack.)",
          keyword: {
            name: "command",
            subtype: "Chessman",
          },
        },
        {
          id: "no5tu5412v-a2",
          kind: "triggered",
          text: "On Kill: If the killed unit had an even life stat, draw a card.",
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
              kind: "all",
              conditions: [
                {
                  kind: "subject-matches",
                  subject: {
                    kind: "event-recipient",
                  },
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                },
                {
                  kind: "numeric-property-parity",
                  subject: {
                    kind: "event-recipient",
                  },
                  property: "life",
                  basis: "last-known",
                  value: "even",
                },
              ],
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

export default skeweringAdvance;
