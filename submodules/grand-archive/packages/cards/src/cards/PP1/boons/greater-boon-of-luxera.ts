import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfLuxera: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Klb4tguLek",
  slug: "greater-boon-of-luxera",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "Klb4tguLek:face:default",
      catalogId: "Klb4tguLek",
      name: "Greater Boon of Luxera",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "First Boon (Bestow this boon at the beginning of the game, before Spirits enter.)\n\nAs you gain this boon, choose a non-champion non-regalia card name. The next time you activate a card with the same name this game, draw two cards and recover 3.\n\nYou can't generate cards with the chosen name.",
      abilities: [
        {
          id: "Klb4tguLek-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "First Boon (Bestow this boon at the beginning of the game, before Spirits enter.)",
          keyword: {
            name: "first-boon",
          },
        },
        {
          id: "Klb4tguLek-a2",
          kind: "triggered",
          text: "As you gain this boon, choose a non-champion non-regalia card name. The next time you activate a card with the same name this game, draw two cards and recover 3.",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose-value",
                selection: {
                  id: "chosen-card-name",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "characteristic",
                    characteristic: "card-name",
                    optionsFrom: {
                      kind: "all",
                      filters: [
                        {
                          kind: "not",
                          filter: {
                            kind: "type",
                            oneOf: ["CHAMPION"],
                          },
                        },
                        {
                          kind: "not",
                          filter: {
                            kind: "supertype",
                            oneOf: ["REGALIA"],
                          },
                        },
                      ],
                    },
                  },
                },
                trackAs: "chosen-card-name",
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "card-activated",
                    actor: "controller",
                    subject: {
                      kind: "event-object",
                      filter: {
                        kind: "matches-tracked-characteristic",
                        key: "chosen-card-name",
                        characteristic: "card-name",
                      },
                    },
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "draw",
                      player: "controller",
                      amount: 2,
                    },
                    {
                      kind: "recover",
                      player: "controller",
                      amount: 3,
                    },
                  ],
                },
                limit: 1,
              },
            ],
          },
        },
        {
          id: "Klb4tguLek-a3",
          kind: "static",
          staticKind: "effects",
          text: "You can't generate cards with the chosen name.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "generate",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "matches-tracked-characteristic",
                key: "chosen-card-name",
                characteristic: "card-name",
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

export default greaterBoonOfLuxera;
