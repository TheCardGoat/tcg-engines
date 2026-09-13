import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rowlandSchwartzKnight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bGmutHfgMl",
  slug: "rowland-schwartz-knight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bGmutHfgMl:face:default",
      catalogId: "bGmutHfgMl",
      name: "Rowland, Schwartz Knight",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "CHESSMAN", "KNIGHT", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Commanded Will 1 (As long as this unit is attacking using a Command card, it gets +1 POWER.)\n\n[Alice Bonus] On Ally Kill: If the killed unit had intercept or taunt, wake up Rowland. Trigger this ability only once per turn.",
      abilities: [
        {
          id: "bGmutHfgMl-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Commanded Will 1 (As long as this unit is attacking using a Command card, it gets +1 POWER.)",
          keyword: {
            name: "commanded-will",
            value: 1,
          },
        },
        {
          id: "bGmutHfgMl-a2",
          kind: "triggered",
          text: "[Alice Bonus] On Ally Kill: If the killed unit had intercept or taunt, wake up Rowland. Trigger this ability only once per turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          limit: {
            count: 1,
            per: "turn",
          },
          interveningCondition: {
            kind: "subject-matches",
            subject: {
              kind: "event-recipient",
            },
            filter: {
              kind: "any",
              filters: [
                {
                  kind: "has-keyword",
                  keyword: "intercept",
                },
                {
                  kind: "has-keyword",
                  keyword: "taunt",
                },
              ],
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
          effect: {
            kind: "wake",
            subject: {
              kind: "source",
            },
          },
        },
      ],
    },
  },
};

export default rowlandSchwartzKnight;
