import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const assassinsRipper: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8yzADlgx4R",
  slug: "assassins-ripper",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8yzADlgx4R:face:default",
      catalogId: "8yzADlgx4R",
      name: "Assassin's Ripper",
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
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] REST, Remove a preparation counter from your champion: Assassin's Ripper gets +2 POWER until end of turn.",
      abilities: [
        {
          id: "8yzADlgx4R-a1",
          kind: "activated",
          text: "[Class Bonus] REST, Remove a preparation counter from your champion: Assassin's Ripper gets +2 POWER until end of turn.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: 1,
              },
            ],
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
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
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
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default assassinsRipper;
