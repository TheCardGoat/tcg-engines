import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pierceTheHeavens: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yguf3aw2ct",
  slug: "pierce-the-heavens",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yguf3aw2ct:face:default",
      catalogId: "yguf3aw2ct",
      name: "Pierce the Heavens",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
      },
      rulesText:
        "[Jin Bonus] As long as your champion has leveled up this turn, this attack gets +2 POWER and has unblockable. (An attack with unblockable can't be intercepted and ignores taunt. Apply this effect only if your champion is Jin.)",
      abilities: [
        {
          id: "yguf3aw2ct-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Jin Bonus] As long as your champion has leveled up this turn, this attack gets +2 POWER and has unblockable. (An attack with unblockable can't be intercepted and ignores taunt. Apply this effect only if your champion is Jin.)",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Jin",
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
                kind: "history",
                event: "champion-leveled-up",
                window: "this-turn",
                actor: "controller",
                minimum: 1,
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
                amount: 2,
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "history",
                event: "champion-leveled-up",
                window: "this-turn",
                actor: "controller",
                minimum: 1,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "unblockable",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default pierceTheHeavens;
