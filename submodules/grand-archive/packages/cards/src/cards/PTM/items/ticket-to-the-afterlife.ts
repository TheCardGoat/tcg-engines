import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ticketToTheAfterlife: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "E09lX95cb9",
  slug: "ticket-to-the-afterlife",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "E09lX95cb9:face:default",
      catalogId: "E09lX95cb9",
      name: "Ticket to the Afterlife",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "ARTIFACT"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "Activated abilities of Specter cards in your graveyard cost (1) less to activate.\n\nSpecter cards you activate from your graveyard cost (1) less to activate.\n\n[Alice Bonus](2), REST, Banish a Specter card from your graveyard: Recover 2.",
      abilities: [
        {
          id: "E09lX95cb9-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activated abilities of Specter cards in your graveyard cost (1) less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              activationKind: "ability",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "subtype",
                oneOf: ["SPECTER"],
              },
              fromZone: "graveyard",
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "E09lX95cb9-a2",
          kind: "static",
          staticKind: "effects",
          text: "Specter cards you activate from your graveyard cost (1) less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "subtype",
                oneOf: ["SPECTER"],
              },
              fromZone: "graveyard",
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "E09lX95cb9-a3",
          kind: "activated",
          text: "[Alice Bonus](2), REST, Banish a Specter card from your graveyard: Recover 2.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "subtype",
                  oneOf: ["SPECTER"],
                },
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
          effect: {
            kind: "recover",
            player: "controller",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default ticketToTheAfterlife;
