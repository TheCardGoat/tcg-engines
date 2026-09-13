import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const drawnBlade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "eSAIP7mx9z",
  slug: "drawn-blade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "eSAIP7mx9z:face:default",
      catalogId: "eSAIP7mx9z",
      name: "Drawn Blade",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: Draw a card. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "eSAIP7mx9z-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Draw a card. (Apply this effect only if your champion's class matches this card's class.)",
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
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default drawnBlade;
