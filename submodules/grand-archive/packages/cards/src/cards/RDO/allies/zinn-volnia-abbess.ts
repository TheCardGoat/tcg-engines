import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zinnVolniaAbbess: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "N0GEBrywbW",
  slug: "zinn-volnia-abbess",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "N0GEBrywbW:face:default",
      catalogId: "N0GEBrywbW",
      name: "Zinn, Volnia Abbess",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "[Arisanna Bonus] If you would summon one or more Silvershine and/or Fraysia tokens, summon that many Volnia tokens instead.",
      abilities: [
        {
          id: "N0GEBrywbW-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Arisanna Bonus] If you would summon one or more Silvershine and/or Fraysia tokens, summon that many Volnia tokens instead.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Arisanna",
              },
            },
          ],
          effects: [
            {
              kind: "replacement",
              event: {
                name: "tokens-summoned",
                actor: "controller",
                subject: {
                  kind: "event-object",
                  filter: {
                    kind: "any",
                    filters: [
                      {
                        kind: "name",
                        value: "Silvershine",
                      },
                      {
                        kind: "name",
                        value: "Fraysia",
                      },
                    ],
                  },
                },
              },
              operation: {
                kind: "replace-with",
                effect: {
                  kind: "summon",
                  object: "Volnia",
                  controller: "controller",
                  amount: {
                    kind: "event-amount",
                  },
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

export default zinnVolniaAbbess;
