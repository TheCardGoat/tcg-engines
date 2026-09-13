import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const coyBouclier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vo1qr9bkme",
  slug: "coy-bouclier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vo1qr9bkme:face:default",
      catalogId: "vo1qr9bkme",
      name: "Coy Bouclier",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 4,
      },
      rulesText:
        "[Level 2+] This card costs 2 less to activate. \n\n[Class Bonus] As long as you control another ally, Coy Bouclier has taunt. (While awake, this ally with taunt must be targeted before other objects you control during your opponents' attack declarations if able.)",
      abilities: [
        {
          id: "vo1qr9bkme-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 2+] This card costs 2 less to activate.",
          restrictions: [
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "vo1qr9bkme-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as you control another ally, Coy Bouclier has taunt. (While awake, this ally with taunt must be targeted before other objects you control during your opponents' attack declarations if able.)",
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
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
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
                  name: "taunt",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default coyBouclier;
