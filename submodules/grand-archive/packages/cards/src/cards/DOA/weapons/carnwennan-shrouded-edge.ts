import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const carnwennanShroudedEdge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Au8eN2Jtuu",
  slug: "carnwennan-shrouded-edge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Au8eN2Jtuu:face:default",
      catalogId: "Au8eN2Jtuu",
      name: "Carnwennan, Shrouded Edge",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SWORD"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 3,
        durability: 1,
      },
      rulesText:
        "[Class Bonus] Attacks using Carnwennan can't be retaliated. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "Au8eN2Jtuu-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Attacks using Carnwennan can't be retaliated. (Apply this effect only if your champion's class matches this card's class.)",
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
              kind: "rule-modification",
              mode: "forbid",
              action: "retaliate",
              using: {
                kind: "source",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default carnwennanShroudedEdge;
