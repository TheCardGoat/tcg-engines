import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const eminenceInFury: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "suk5c6SJls",
  slug: "eminence-in-fury",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "suk5c6SJls:face:default",
      catalogId: "suk5c6SJls",
      name: "Eminence in Fury",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only if an Elysian ally you controlled died this turn.\n\n[Dante Bonus] You may banish a card at random from your memory. If you do, level up your champion and deal 4 unpreventable damage to them. (Your champion levels up into a compatible champion card from your material deck, ignoring materialization costs.)",
      abilities: [
        {
          id: "suk5c6SJls-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only if an Elysian ally you controlled died this turn.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "history",
                event: "object-died",
                window: "this-turn",
                actor: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["ELYSIAN"],
                    },
                  ],
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
          id: "suk5c6SJls-a2",
          kind: "card-resolution",
          text: "[Dante Bonus] You may banish a card at random from your memory. If you do, level up your champion and deal 4 unpreventable damage to them. (Your champion levels up into a compatible champion card from your material deck, ignoring materialization costs.)",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Dante",
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "random-memory-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    method: "random",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "card",
                      zones: ["memory"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                },
                {
                  kind: "level-up",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  ignoreCosts: true,
                },
                {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "champion",
                    player: "controller",
                  },
                  amount: 4,
                  preventable: false,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default eminenceInFury;
