import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const retoldFortune: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ow8iopvc8s",
  slug: "retold-fortune",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ow8iopvc8s:face:default",
      catalogId: "ow8iopvc8s",
      name: "Retold Fortune",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Discard up to one Spell card. If you do, draw a card.\n\n[Class Bonus] [Level 2+] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "ow8iopvc8s-a1",
          kind: "card-resolution",
          text: "Discard up to one Spell card. If you do, draw a card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "discard",
                  player: "controller",
                  selection: {
                    id: "discarded-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "up-to",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["hand"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "subtype",
                        oneOf: ["SPELL"],
                      },
                    },
                  },
                },
                bindSucceededAs: "prior-effect-succeeded",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "prior-effect-succeeded",
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
            ],
          },
        },
        {
          id: "ow8iopvc8s-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] [Level 2+] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
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
        },
      ],
    },
  },
};

export default retoldFortune;
