import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const poisedRearguard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qso7cbzrky",
  slug: "poised-rearguard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qso7cbzrky:face:default",
      catalogId: "qso7cbzrky",
      name: "Poised Rearguard",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "Hindered (This ally enters the field rested.)\n\n[Class Bonus] Equestrian — On Enter: If you control a Horse ally, wake up Poised Rearguard.",
      abilities: [
        {
          id: "qso7cbzrky-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This ally enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "qso7cbzrky-a2",
          kind: "triggered",
          text: "[Class Bonus] Equestrian — On Enter: If you control a Horse ally, wake up Poised Rearguard.",
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
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["HORSE"],
                    },
                  ],
                },
              },
            },
            then: {
              kind: "wake",
              subject: {
                kind: "source",
              },
            },
          },
          label: {
            name: "Equestrian",
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
        },
      ],
    },
  },
};

export default poisedRearguard;
