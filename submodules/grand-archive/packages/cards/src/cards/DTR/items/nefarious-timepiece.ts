import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nefariousTimepiece: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "h1njd7z5j3",
  slug: "nefarious-timepiece",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "h1njd7z5j3:face:default",
      catalogId: "h1njd7z5j3",
      name: "Nefarious Timepiece",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "As Nefarious Timepiece enters the field, choose a regalia card name.\n\nCards with the chosen name cost 1 more to play.\n\n(5), Banish Nefarious Timepiece: Draw a card into your memory.",
      abilities: [
        {
          id: "h1njd7z5j3-a1",
          kind: "static",
          staticKind: "effects",
          text: "As Nefarious Timepiece enters the field, choose a regalia card name.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "perform-before-commit",
                effect: {
                  kind: "choose-value",
                  selection: {
                    id: "entry-choice",
                    kind: "choice",
                    declared: "event-processing",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "characteristic",
                      characteristic: "card-name",
                      optionsFrom: {
                        kind: "supertype",
                        oneOf: ["REGALIA"],
                      },
                    },
                  },
                  trackAs: "chosen-card-name",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "h1njd7z5j3-a2",
          kind: "static",
          staticKind: "effects",
          text: "Cards with the chosen name cost 1 more to play.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "play",
              filter: {
                kind: "matches-tracked-characteristic",
                key: "chosen-card-name",
                characteristic: "card-name",
              },
              costOperation: "add",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "h1njd7z5j3-a3",
          kind: "activated",
          text: "(5), Banish Nefarious Timepiece: Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 5,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default nefariousTimepiece;
