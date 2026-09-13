import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const poweredSwordsman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "f8uqrptjej",
  slug: "powered-swordsman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "f8uqrptjej:face:default",
      catalogId: "f8uqrptjej",
      name: "Powered Swordsman",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "AUTOMATON"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 4,
      },
      rulesText:
        "[Class Bonus] On Death: Summon a Powercell token. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "f8uqrptjej-a1",
          kind: "triggered",
          text: "[Class Bonus] On Death: Summon a Powercell token. (Apply this effect only if your champion’s class matches this card’s class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
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
            kind: "summon",
            object: "Powercell",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default poweredSwordsman;
