import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shatteringDischarge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uutqo9hm33",
  slug: "shattering-discharge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uutqo9hm33:face:default",
      catalogId: "uutqo9hm33",
      name: "Shattering Discharge",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL", "REACTION"],
      },
      elements: ["ARCANE"],
      speed: "fast",
      stats: {},
      rulesText:
        "You may activate this card from your banishment as long as there's a charge counter on it.\n\n[Class Bonus] Whenever this card is banished from your memory, put a charge counter on it. \n\nDeal 2 unpreventable damage to target champion. Banish Shattering Discharge.",
      abilities: [
        {
          id: "uutqo9hm33-a1",
          kind: "static",
          staticKind: "effects",
          text: "You may activate this card from your banishment as long as there's a charge counter on it.",
          functionalZones: ["banishment"],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "charge",
                },
              },
              fromZone: "banishment",
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "uutqo9hm33-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever this card is banished from your memory, put a charge counter on it.",
          trigger: {
            kind: "event",
            event: {
              name: "card-banished",
              actor: "controller",
              subject: {
                kind: "source",
              },
              from: "memory",
            },
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
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "event-subject",
            },
            counter: {
              named: "charge",
            },
            amount: 1,
          },
        },
        {
          id: "uutqo9hm33-a3",
          kind: "card-resolution",
          text: "Deal 2 unpreventable damage to target champion. Banish Shattering Discharge.",
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
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: 2,
                preventable: false,
              },
              {
                kind: "banish-object",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default shatteringDischarge;
