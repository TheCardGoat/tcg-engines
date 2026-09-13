import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tomeOfSorcery: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sq0ou8vas3",
  slug: "tome-of-sorcery",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sq0ou8vas3:face:default",
      catalogId: "sq0ou8vas3",
      name: "Tome of Sorcery",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "BOOK"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Class Bonus] [Level 2+] On Enter: Draw a card into your memory. (Apply this effect only if your champion's class matches this card's class.)\n\nREST: Empower 1. (The next Spell card you activate this turn activates and resolves as if your champion got +1 level.)",
      abilities: [
        {
          id: "sq0ou8vas3-a1",
          kind: "triggered",
          text: "[Class Bonus] [Level 2+] On Enter: Draw a card into your memory. (Apply this effect only if your champion's class matches this card's class.)",
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
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "sq0ou8vas3-a2",
          kind: "activated",
          text: "REST: Empower 1. (The next Spell card you activate this turn activates and resolves as if your champion got +1 level.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "keyword-action",
            action: "empower",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default tomeOfSorcery;
