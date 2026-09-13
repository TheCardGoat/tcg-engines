import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const coronalOfRejuvenation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uvgflagxbb",
  slug: "coronal-of-rejuvenation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uvgflagxbb:face:default",
      catalogId: "uvgflagxbb",
      name: "Coronal of Rejuvenation",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ACCESSORY"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "As an additional cost to materialize this card, banish a preserved card from your material deck.\n\nOn Enter: Banish any amount of Spell cards from your graveyard.\n\nREST: You may play a card banished by Coronal of Rejuvenation. Activate this ability only at slow speed.",
      abilities: [
        {
          id: "uvgflagxbb-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to materialize this card, banish a preserved card from your material deck.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "materialize",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "material-deck",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "object-state",
                  state: "preserved",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "uvgflagxbb-a2",
          kind: "triggered",
          text: "On Enter: Banish any amount of Spell cards from your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "banish",
            player: "controller",
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["SPELL"],
                },
              },
            },
          },
        },
        {
          id: "uvgflagxbb-a3",
          kind: "activated",
          text: "REST: You may play a card banished by Coronal of Rejuvenation. Activate this ability only at slow speed.",
          activation: "ability",
          speed: "slow",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-banished-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["banishment"],
                relationship: "banished-by",
                host: {
                  kind: "source",
                },
              },
            },
            effect: {
              kind: "play-card",
              subject: {
                kind: "bound",
                binding: "chosen-banished-card",
              },
              payCosts: true,
            },
          },
        },
      ],
    },
  },
};

export default coronalOfRejuvenation;
