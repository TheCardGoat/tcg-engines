import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const possessedReaping: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oqDz2jIBZI",
  slug: "possessed-reaping",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oqDz2jIBZI:face:default",
      catalogId: "oqDz2jIBZI",
      name: "Possessed Reaping",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["MAGE", "WARRIOR"],
        subtypes: ["MAGE", "WARRIOR", "SWORD"],
      },
      elements: ["CRUX"],
      stats: {
        power: 4,
      },
      rulesText:
        "On Ally Kill: Return the killed ally from its owner's graveyard to the field under your control rested. It becomes a Spirit in addition to its other types.",
      abilities: [
        {
          id: "oqDz2jIBZI-a1",
          kind: "triggered",
          text: "On Ally Kill: Return the killed ally from its owner's graveyard to the field under your control rested. It becomes a Spirit in addition to its other types.",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "event-recipient",
                },
                from: "graveyard",
                destination: {
                  zone: "field",
                  controller: "controller",
                },
              },
              {
                kind: "rest",
                subject: {
                  kind: "event-recipient",
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "event-recipient",
                },
                affectedSet: "locked",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "B",
                  modifies: "type",
                },
                change: {
                  kind: "add-characteristic",
                  characteristic: {
                    kind: "subtype",
                    value: "SPIRIT",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default possessedReaping;
