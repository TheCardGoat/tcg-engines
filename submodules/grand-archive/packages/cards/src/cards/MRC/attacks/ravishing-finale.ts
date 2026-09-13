import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ravishingFinale: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jlgx72rfgv",
  slug: "ravishing-finale",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jlgx72rfgv:face:default",
      catalogId: "jlgx72rfgv",
      name: "Ravishing Finale",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "LASH"],
      },
      elements: ["WATER"],
      stats: {
        power: 6,
      },
      rulesText:
        "As an additional cost to activate this card, banish two cards with floating memory from your graveyard.\n\n[Nico Bonus] On Champion Hit: For each damage counter on the hit champion, their controller puts the top two cards from their deck into their graveyard.",
      abilities: [
        {
          id: "jlgx72rfgv-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, banish two cards with floating memory from your graveyard.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 2,
                },
                filter: {
                  kind: "has-keyword",
                  keyword: "floating-memory",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "jlgx72rfgv-a2",
          kind: "triggered",
          text: "[Nico Bonus] On Champion Hit: For each damage counter on the hit champion, their controller puts the top two cards from their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Nico",
              },
            },
          ],
          effect: {
            kind: "mill",
            player: "event-recipient-controller",
            amount: {
              kind: "calculate",
              operator: "multiply",
              operands: [
                {
                  kind: "counter-count",
                  subject: {
                    kind: "event-recipient",
                  },
                  counter: "damage",
                },
                2,
              ],
            },
          },
        },
      ],
    },
  },
};

export default ravishingFinale;
