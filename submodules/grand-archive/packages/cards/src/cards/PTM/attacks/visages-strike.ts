import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const visagesStrike: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UdYcJGrJt5",
  slug: "visages-strike",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "UdYcJGrJt5:face:default",
      catalogId: "UdYcJGrJt5",
      name: "Visage's Strike",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Ciel Bonus] On Hit:  If you have two or less omens, banish Visage's Strike and put an omen counter on it.",
      abilities: [
        {
          id: "UdYcJGrJt5-a1",
          kind: "triggered",
          text: "[Ciel Bonus] On Hit:  If you have two or less omens, banish Visage's Strike and put an omen counter on it.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "player-property-compare",
              players: "controller",
              quantifier: "all",
              property: "omens",
              operator: "lte",
              value: 2,
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish-object",
                  subject: {
                    kind: "source",
                  },
                },
                {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "omen",
                  amount: 1,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default visagesStrike;
