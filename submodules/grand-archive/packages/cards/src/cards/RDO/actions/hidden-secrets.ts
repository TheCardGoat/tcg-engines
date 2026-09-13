import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hiddenSecrets: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0op51dZYc6",
  slug: "hidden-secrets",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0op51dZYc6:face:default",
      catalogId: "0op51dZYc6",
      name: "Hidden Secrets",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Choose one. If you control one or more domains, choose up to two instead—\n• Up to one target ally gains stealth until end of turn.\n• Draw a card into your memory.",
      abilities: [
        {
          id: "0op51dZYc6-a1",
          kind: "card-resolution",
          text: "Choose one. If you control one or more domains, choose up to two instead—\n• Up to one target ally gains stealth until end of turn.\n• Draw a card into your memory.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: {
                kind: "conditional",
                condition: {
                  kind: "collection-exists",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["DOMAIN"],
                    },
                  },
                },
                then: 2,
                else: 1,
              },
            },
            modes: [
              {
                id: "mode-1",
                text: "Up to one target ally gains stealth until end of turn.",
                targets: [
                  {
                    id: "target-1",
                    kind: "target",
                    declared: "announcement",
                    chooser: "controller",
                    count: {
                      kind: "up-to",
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
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-keyword",
                    keyword: {
                      name: "stealth",
                    },
                  },
                },
              },
              {
                id: "mode-2",
                text: "Draw a card into your memory",
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
      ],
    },
  },
};

export default hiddenSecrets;
