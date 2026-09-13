import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const acolyteOfCultivation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nsowyyn6jt",
  slug: "acolyte-of-cultivation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nsowyyn6jt:face:default",
      catalogId: "nsowyyn6jt",
      name: "Acolyte of Cultivation",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] As long as you've activated a Spell card this turn, this card costs 3 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "nsowyyn6jt-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as you've activated a Spell card this turn, this card costs 3 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
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
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "history",
                event: "card-activated",
                window: "this-turn",
                actor: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["SPELL"],
                },
                minimum: 1,
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 3,
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

export default acolyteOfCultivation;
