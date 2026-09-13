import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const excaliburCleansingLight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qtRBz9azeZ",
  slug: "excalibur-cleansing-light",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qtRBz9azeZ:face:default",
      catalogId: "qtRBz9azeZ",
      name: "Excalibur, Cleansing Light",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["LUXEM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Destroy target non-champion object.\n\n[Class Bonus] Choose up to two non-norm elements. Players can't materialize or activate cards of those elements until the beginning of your next turn. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "qtRBz9azeZ-a1",
          kind: "card-resolution",
          text: "Destroy target non-champion object.",
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
                  kind: "not",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "destroy",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            bindResultAs: "destroyed-object",
          },
        },
        {
          id: "qtRBz9azeZ-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Choose up to two non-norm elements. Players can't materialize or activate cards of those elements until the beginning of your next turn. (Apply this effect only if your champion's class matches this card's class.)",
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
            kind: "sequence",
            effects: [
              {
                kind: "choose-value",
                selection: {
                  id: "chosen-elements",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 2,
                  },
                  unique: true,
                  candidates: {
                    kind: "option",
                    options: [
                      "FIRE",
                      "WATER",
                      "WIND",
                      "ARCANE",
                      "ASTRA",
                      "CRUX",
                      "EXALTED",
                      "EXIA",
                      "LUXEM",
                      "NEOS",
                      "TERA",
                      "UMBRA",
                    ],
                  },
                },
                trackAs: "chosen-elements",
              },
              {
                kind: "rule-modification",
                mode: "forbid",
                action: "activate",
                subject: {
                  kind: "player",
                  player: "each-player",
                },
                filter: {
                  kind: "matches-tracked-characteristic",
                  key: "chosen-elements",
                  characteristic: "element",
                },
                duration: {
                  kind: "until-start-of-turn",
                  whose: "controller",
                },
              },
              {
                kind: "rule-modification",
                mode: "forbid",
                action: "materialize",
                subject: {
                  kind: "player",
                  player: "each-player",
                },
                filter: {
                  kind: "matches-tracked-characteristic",
                  key: "chosen-elements",
                  characteristic: "element",
                },
                duration: {
                  kind: "until-start-of-turn",
                  whose: "controller",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default excaliburCleansingLight;
