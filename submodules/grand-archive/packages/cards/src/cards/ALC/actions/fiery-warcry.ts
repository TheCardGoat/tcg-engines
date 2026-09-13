import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fieryWarcry: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ippor7ch2b",
  slug: "fiery-warcry",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ippor7ch2b:face:default",
      catalogId: "ippor7ch2b",
      name: "Fiery Warcry",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Draw a card, then discard a card.\n\n[Class Bonus] You may banish a fire element card from your graveyard. When you do, target ally loses taunt and intercept until end of turn.",
      abilities: [
        {
          id: "ippor7ch2b-a1",
          kind: "card-resolution",
          text: "Draw a card, then discard a card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "discarded-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                bindResultAs: "discarded-card",
              },
            ],
          },
        },
        {
          id: "ippor7ch2b-a2",
          kind: "card-resolution",
          text: "[Class Bonus] You may banish a fire element card from your graveyard. When you do, target ally loses taunt and intercept until end of turn.",
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
            kind: "reflexive",
            action: {
              kind: "banish",
              player: "controller",
              selection: {
                id: "fire-card",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "up-to",
                  amount: 1,
                },
                candidates: {
                  kind: "card",
                  zones: ["graveyard"],
                  relationship: "zone-of",
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["FIRE"],
                  },
                },
              },
            },
            targets: [
              {
                id: "target-ally",
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
            consequence: {
              kind: "sequence",
              effects: [
                {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-ally",
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
                    kind: "remove-keyword",
                    keyword: {
                      name: "taunt",
                    },
                  },
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-ally",
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
                    kind: "remove-keyword",
                    keyword: {
                      name: "intercept",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default fieryWarcry;
