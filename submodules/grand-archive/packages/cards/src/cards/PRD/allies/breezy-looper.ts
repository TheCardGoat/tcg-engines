import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const breezyLooper: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hWgb4jDmEg",
  slug: "breezy-looper",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hWgb4jDmEg:face:default",
      catalogId: "hWgb4jDmEg",
      name: "Breezy Looper",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "WARRIOR"],
        subtypes: ["CLERIC", "WARRIOR", "RESONATOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Level 1+] On Enter: Return target Harmony or Melody card from your graveyard to your memory.",
      abilities: [
        {
          id: "hWgb4jDmEg-a1",
          kind: "triggered",
          text: "[Level 1+] On Enter: Return target Harmony or Melody card from your graveyard to your memory.",
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
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["HARMONY", "MELODY"],
                },
              },
            },
          ],
          restrictions: [
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
                  right: 1,
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-card",
            },
            from: "graveyard",
            destination: {
              zone: "memory",
            },
          },
        },
      ],
    },
  },
};

export default breezyLooper;
