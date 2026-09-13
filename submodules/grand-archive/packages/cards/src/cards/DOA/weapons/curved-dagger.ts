import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const curvedDagger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Q2ugqVm04E",
  slug: "curved-dagger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Q2ugqVm04E:face:default",
      catalogId: "Q2ugqVm04E",
      name: "Curved Dagger",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText:
        "[Class Bonus] As long as your champion is attacking an ally, Curved Dagger gets +1 POWER. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "Q2ugqVm04E-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as your champion is attacking an ally, Curved Dagger gets +1 POWER. (Apply this effect only if your champion's class matches this card's class.)",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "combat-relation",
                relation: "attacking",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                otherFilter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default curvedDagger;
