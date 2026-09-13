import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const strikingIlluminance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2lukkhisu5",
  slug: "striking-illuminance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2lukkhisu5:face:default",
      catalogId: "2lukkhisu5",
      name: "Striking Illuminance",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 4,
      },
      rulesText:
        "Prepare 2\n\nWhenever you reveal a luxem element card from your memory, Striking Illuminance gets +1 POWER. (This ability triggers and resolves while this card is in an intent.)\n\nOn Attack: If Striking Illuminance was prepared, reveal all cards in your memory.",
      abilities: [
        {
          id: "2lukkhisu5-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 2",
          keyword: {
            name: "prepare",
            value: 2,
          },
        },
        {
          id: "2lukkhisu5-a2",
          kind: "triggered",
          text: "Whenever you reveal a luxem element card from your memory, Striking Illuminance gets +1 POWER. (This ability triggers and resolves while this card is in an intent.)",
          trigger: {
            kind: "event",
            event: {
              name: "card-revealed",
              actor: "controller",
              from: "memory",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "element",
                  oneOf: ["LUXEM"],
                },
              },
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "permanent",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "power",
              operation: "add",
              amount: 1,
            },
          },
        },
        {
          id: "2lukkhisu5-a3",
          kind: "triggered",
          text: "On Attack: If Striking Illuminance was prepared, reveal all cards in your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "prepared",
            },
            then: {
              kind: "reveal",
              player: "controller",
              selection: {
                id: "revealed-memory",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "all",
                },
                candidates: {
                  kind: "card",
                  zones: ["memory"],
                  relationship: "zone-of",
                  player: "controller",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default strikingIlluminance;
