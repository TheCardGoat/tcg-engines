import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritBladeRetribution: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "HtExn3OxIN",
  slug: "spirit-blade-retribution",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "HtExn3OxIN:face:default",
      catalogId: "HtExn3OxIN",
      name: "Spirit Blade: Retribution",
      cost: {
        kind: "reserve",
        amount: 10,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ULTIMATE", "SWORD"],
      },
      elements: ["CRUX"],
      stats: {
        power: 3,
      },
      rulesText:
        "As long as you've activated a card named Spirit Blade: Retribution this game, this card costs 10 less to activate and you may activate it from your graveyard.\n\nCleave\n\n[Lorraine Bonus] Retribution gets +XPOWER, where X is the total power among ally, attack, and weapon cards in your banishment. ",
      abilities: [
        {
          id: "HtExn3OxIN-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you've activated a card named Spirit Blade: Retribution this game, this card costs 10 less to activate and you may activate it from your graveyard.",
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
              amount: 10,
              condition: {
                kind: "history",
                event: "card-activated",
                window: "game",
                actor: "controller",
                filter: {
                  kind: "name",
                  value: "Spirit Blade: Retribution",
                },
                minimum: 1,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "graveyard",
              condition: {
                kind: "history",
                event: "card-activated",
                window: "game",
                actor: "controller",
                filter: {
                  kind: "name",
                  value: "Spirit Blade: Retribution",
                },
                minimum: 1,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "HtExn3OxIN-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Cleave",
          keyword: {
            name: "cleave",
          },
        },
        {
          id: "HtExn3OxIN-a3",
          kind: "static",
          staticKind: "effects",
          text: "[Lorraine Bonus] Retribution gets +XPOWER, where X is the total power among ally, attack, and weapon cards in your banishment.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "aggregate-property",
                operation: "sum",
                collection: {
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
                property: "power",
                basis: "current",
                emptyValue: 0,
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Lorraine",
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
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default spiritBladeRetribution;
