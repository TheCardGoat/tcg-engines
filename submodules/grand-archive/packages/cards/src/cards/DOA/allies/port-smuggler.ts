import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const portSmuggler: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uCIEMgGjWe",
  slug: "port-smuggler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uCIEMgGjWe:face:default",
      catalogId: "uCIEMgGjWe",
      name: "Port Smuggler",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Port Smuggler's attacks can't be intercepted. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "uCIEMgGjWe-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Port Smuggler's attacks can't be intercepted. (Apply this effect only if your champion's class matches this card's class.)",
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
              action: "intercept",
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
      ],
    },
  },
};

export default portSmuggler;
