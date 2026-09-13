import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hauntingDemise: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v0buu5y0ub",
  slug: "haunting-demise",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "v0buu5y0ub:face:default",
      catalogId: "v0buu5y0ub",
      name: "Haunting Demise",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER", "CURSE"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 3,
      },
      rulesText:
        "[Class Bonus] On Champion Hit: Put Haunting Demise on the bottom of the hit champion's lineage.\n\nInherited Effect: At the beginning of your recollection phase, deal 1 unpreventable damage to this object.",
      abilities: [
        {
          id: "v0buu5y0ub-a1",
          kind: "triggered",
          text: "[Class Bonus] On Champion Hit: Put Haunting Demise on the bottom of the hit champion's lineage.",
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
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "inner-lineage",
              host: {
                kind: "event-recipient",
              },
              placement: {
                kind: "bottom",
              },
            },
          },
        },
        {
          id: "v0buu5y0ub-a2",
          kind: "triggered",
          text: "Inherited Effect: At the beginning of your recollection phase, deal 1 unpreventable damage to this object.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "ability-bearer",
            },
            amount: 1,
            preventable: false,
          },
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
        },
      ],
    },
  },
};

export default hauntingDemise;
