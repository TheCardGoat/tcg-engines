import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/arcanic-reproach.generated.ts";

export const arcanicReproach = definePitchFamily(fabPitchFamilies["arcanic-reproach"], {
  abilities: () => ({
    firstTimeOpposingHeroDealsDamageEachTurnMay: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dealt-damage",
          actor: {
            kind: "player",
            player: "opponent",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {
                typeBox: {
                  supertypes: ["Lightning"],
                },
              },
              count: 1,
            },
          },
          then: {
            type: "deal-damage",
            damageType: "arcane",
            amount: 1,
            target: {
              selector: "attack-target",
            },
          },
        },
      },
      limit: {
        count: 1,
        per: "turn",
        ordinals: [1],
      },
    },
    atStartActionPhaseDestroyAuraControl: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
            count: 1,
          },
        },
      },
    },
  }),
});

export const { blue: arcanicReproachBlue } = arcanicReproach.cards;
