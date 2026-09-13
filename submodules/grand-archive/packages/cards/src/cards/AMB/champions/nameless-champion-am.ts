import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const namelessChampionAm: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pv6ichyxj0",
  slug: "nameless-champion-am",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pv6ichyxj0:face:default",
      catalogId: "pv6ichyxj0",
      name: "Nameless Champion",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN", "MAGE"],
        subtypes: ["ASSASSIN", "MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 20,
      },
      rulesText:
        "This champion can't level up.\n\n(6): Draw a card and put a level counter on Nameless Champion. Activate this ability only once. (Champions get +1 level for each level counter on them.)",
      abilities: [
        {
          id: "pv6ichyxj0-a1",
          kind: "static",
          staticKind: "effects",
          text: "This champion can't level up.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "level-up",
              subject: {
                kind: "source",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "pv6ichyxj0-a2",
          kind: "activated",
          text: "(6): Draw a card and put a level counter on Nameless Champion. Activate this ability only once. (Champions get +1 level for each level counter on them.)",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 6,
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "level",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default namelessChampionAm;
