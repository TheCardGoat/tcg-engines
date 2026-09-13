import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seaspriteDiver: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mxqsm4o98v",
  slug: "seasprite-diver",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mxqsm4o98v:face:default",
      catalogId: "mxqsm4o98v",
      name: "Seasprite Diver",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AUTOMATON"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "As long as an opponent has four or more cards in their graveyard, this card costs 1 less to activate. \n\nOn Enter: Banish target card in a graveyard.",
      abilities: [
        {
          id: "mxqsm4o98v-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as an opponent has four or more cards in their graveyard, this card costs 1 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "player-zone-count",
                players: "each-opponent",
                quantifier: "any",
                zone: "graveyard",
                operator: "gte",
                value: 4,
              },
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
          id: "mxqsm4o98v-a2",
          kind: "triggered",
          text: "On Enter: Banish target card in a graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
              },
            },
          ],
          effect: {
            kind: "banish-object",
            subject: {
              kind: "bound",
              binding: "target-card",
            },
          },
        },
      ],
    },
  },
};

export default seaspriteDiver;
