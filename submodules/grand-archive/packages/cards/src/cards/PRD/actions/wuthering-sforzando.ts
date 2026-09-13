import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wutheringSforzando: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Nlw3ZpjSxw",
  slug: "wuthering-sforzando",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Nlw3ZpjSxw:face:default",
      catalogId: "Nlw3ZpjSxw",
      name: "Wuthering Sforzando",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "TAMER"],
        subtypes: ["CLERIC", "TAMER", "SKILL", "HARMONY"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] As long as you've activated a Melody card this turn, this card costs 3 less to activate.\n\nTarget ally's next attack this turn gets +6POWER.",
      abilities: [
        {
          id: "Nlw3ZpjSxw-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as you've activated a Melody card this turn, this card costs 3 less to activate.",
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
                  oneOf: ["MELODY"],
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
        {
          id: "Nlw3ZpjSxw-a2",
          kind: "card-resolution",
          text: "Target ally's next attack this turn gets +6POWER.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "attack-declared",
                subject: {
                  kind: "bound-object",
                  binding: "target-1",
                },
              },
            },
            limit: 1,
            expires: {
              kind: "this-turn",
            },
            effect: {
              kind: "continuous",
              subjects: {
                kind: "current-attack",
              },
              affectedSet: "locked",
              duration: {
                kind: "this-attack",
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
                amount: 6,
              },
            },
          },
        },
      ],
    },
  },
};

export default wutheringSforzando;
