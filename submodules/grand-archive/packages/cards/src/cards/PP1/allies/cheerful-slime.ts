import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cheerfulSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OUqX2BBcGv",
  slug: "cheerful-slime",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "OUqX2BBcGv:face:default",
      catalogId: "OUqX2BBcGv",
      name: "Cheerful Slime",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "SLIME"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: You gain the Crowd's Favor status. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "OUqX2BBcGv-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You gain the Crowd's Favor status. (Apply this effect only if your champion’s class matches this card’s class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
            state: {
              named: "Crowd's Favor",
            },
            value: true,
          },
        },
      ],
    },
  },
};

export default cheerfulSlime;
