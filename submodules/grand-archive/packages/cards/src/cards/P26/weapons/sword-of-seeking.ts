import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const swordOfSeeking: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Dz8I0eJzaf",
  slug: "sword-of-seeking",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Dz8I0eJzaf:face:default",
      catalogId: "Dz8I0eJzaf",
      name: "Sword of Seeking",
      cost: {
        kind: "memory",
        amount: 0,
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
        durability: 2,
      },
      rulesText:
        "[Class Bonus] True Sight (Attacks using this weapon can target units with stealth. Apply this effect only if your champion's class matches this card's class.) ",
      abilities: [
        {
          id: "Dz8I0eJzaf-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] True Sight (Attacks using this weapon can target units with stealth. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "true-sight",
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
        },
      ],
    },
  },
};

export default swordOfSeeking;
