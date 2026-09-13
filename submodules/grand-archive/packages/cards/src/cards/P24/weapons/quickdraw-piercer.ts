import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const quickdrawPiercer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "j4f15joh30",
  slug: "quickdraw-piercer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "j4f15joh30:face:default",
      catalogId: "j4f15joh30",
      name: "Quickdraw Piercer",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "GUN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "(Gun — Must be loaded to use for an attack and can't be used with an attack card.)\n\n[Class Bonus] On Banish: Draw a card. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "j4f15joh30-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Gun — Must be loaded to use for an attack and can't be used with an attack card.)",
          keyword: {
            name: "gun",
          },
        },
        {
          id: "j4f15joh30-a2",
          kind: "triggered",
          text: "[Class Bonus] On Banish: Draw a card. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "card-banished",
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

export default quickdrawPiercer;
