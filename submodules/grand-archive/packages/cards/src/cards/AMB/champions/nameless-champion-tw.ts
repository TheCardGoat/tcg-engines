import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const namelessChampionTw: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "98i5ak5nwo",
  slug: "nameless-champion-tw",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "98i5ak5nwo:face:default",
      catalogId: "98i5ak5nwo",
      name: "Nameless Champion",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["TAMER", "WARRIOR"],
        subtypes: ["TAMER", "WARRIOR", "HUMAN"],
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
          id: "98i5ak5nwo-a1",
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
          id: "98i5ak5nwo-a2",
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

export default namelessChampionTw;
