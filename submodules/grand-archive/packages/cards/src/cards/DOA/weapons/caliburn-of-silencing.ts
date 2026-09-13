import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const caliburnOfSilencing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bA3tRrJr2T",
  slug: "caliburn-of-silencing",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bA3tRrJr2T:face:default",
      catalogId: "bA3tRrJr2T",
      name: "Caliburn of Silencing",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText:
        "[Class Bonus] On Champion Hit: The hit champion loses all abilities until the beginning of your next turn. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "bA3tRrJr2T-a1",
          kind: "triggered",
          text: "[Class Bonus] On Champion Hit: The hit champion loses all abilities until the beginning of your next turn. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
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
            kind: "continuous",
            subjects: {
              kind: "event-recipient",
            },
            affectedSet: "locked",
            duration: {
              kind: "until-start-of-turn",
              whose: "controller",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "remove-abilities",
            },
          },
        },
      ],
    },
  },
};

export default caliburnOfSilencing;
