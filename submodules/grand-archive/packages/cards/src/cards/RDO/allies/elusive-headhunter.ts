import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const elusiveHeadhunter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "KmM2o1ozGr",
  slug: "elusive-headhunter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "KmM2o1ozGr:face:default",
      catalogId: "KmM2o1ozGr",
      name: "Elusive Headhunter",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 4,
        life: 3,
      },
      rulesText:
        "Elusive Headhunter's  attacks can't be retaliated.\n\n[Class Bonus] On Kill: You gain agility 3 for this turn. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)",
      abilities: [
        {
          id: "KmM2o1ozGr-a1",
          kind: "static",
          staticKind: "effects",
          text: "Elusive Headhunter's  attacks can't be retaliated.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "retaliate",
              subject: {
                kind: "attacks-by",
                attacker: {
                  kind: "source",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "KmM2o1ozGr-a2",
          kind: "triggered",
          text: "[Class Bonus] On Kill: You gain agility 3 for this turn. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "set-player-state",
            player: "controller",
            state: "agility",
            value: true,
            amount: 3,
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default elusiveHeadhunter;
