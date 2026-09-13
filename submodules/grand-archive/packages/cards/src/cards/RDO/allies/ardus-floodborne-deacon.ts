import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ardusFloodborneDeacon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "EKiMJfgvSI",
  slug: "ardus-floodborne-deacon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "EKiMJfgvSI:face:default",
      catalogId: "EKiMJfgvSI",
      name: "Ardus, Floodborne Deacon",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["EXALTED", "WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "On Enter: Put the top three cards of your deck into your graveyard.\n\nCards you activate, objects you control, and intents you control have an additional instance of each deluge ability and effect they have.",
      abilities: [
        {
          id: "EKiMJfgvSI-a1",
          kind: "triggered",
          text: "On Enter: Put the top three cards of your deck into your graveyard.",
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
            kind: "mill",
            player: "controller",
            amount: 3,
          },
        },
        {
          id: "EKiMJfgvSI-a2",
          kind: "static",
          staticKind: "effects",
          text: "Cards you activate, objects you control, and intents you control have an additional instance of each deluge ability and effect they have.",
          effects: [
            {
              kind: "ability-multiplier",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["effects-stack", "field", "intent"],
                  player: "controller",
                },
              },
              abilityFilter: {
                label: "deluge",
              },
              scope: "abilities-and-effects",
              additionalInstances: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default ardusFloodborneDeacon;
