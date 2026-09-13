import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stabilizingCapacitance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "c4sy8u49sk",
  slug: "stabilizing-capacitance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "c4sy8u49sk:face:default",
      catalogId: "c4sy8u49sk",
      name: "Stabilizing Capacitance",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put any amount of cards from your memory on the bottom of your deck in any order. Then draw that many cards into your memory.\n\n[Class Bonus] [Level 7+] Draw a card.",
      abilities: [
        {
          id: "c4sy8u49sk-a1",
          kind: "card-resolution",
          text: "Put any amount of cards from your memory on the bottom of your deck in any order. Then draw that many cards into your memory.",
          effect: {
            kind: "choose",
            selection: {
              id: "returned-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              candidates: {
                kind: "card",
                zones: ["memory"],
                relationship: "zone-of",
                player: "controller",
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "returned-cards",
                  },
                  from: "memory",
                  destination: {
                    zone: "main-deck",
                    placement: {
                      kind: "bottom",
                      orderChosenBy: "controller",
                    },
                  },
                  bindResultAs: "returned-card-count",
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: {
                    kind: "binding-count",
                    binding: "returned-card-count",
                  },
                  to: "memory",
                },
              ],
            },
          },
        },
        {
          id: "c4sy8u49sk-a2",
          kind: "card-resolution",
          text: "[Class Bonus] [Level 7+] Draw a card.",
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
                  right: 7,
                },
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default stabilizingCapacitance;
