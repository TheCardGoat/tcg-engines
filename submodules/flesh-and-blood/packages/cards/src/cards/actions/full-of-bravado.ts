import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/full-of-bravado.generated.ts";

export const fullOfBravado = definePitchFamily(fabPitchFamilies["full-of-bravado"], {
  abilities: () => ({
    onAttackCreateTokenConfidence: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
        state: {
          type: "control-object",
          filter: {
            typeBox: {
              subtypes: ["Aura"],
            },
            hasKeyword: "suspense",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "confidence",
          controller: "controller",
        },
      },
    },
    onDefendCreateTokenConfidence: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
        state: {
          type: "control-object",
          filter: {
            typeBox: {
              subtypes: ["Aura"],
            },
            hasKeyword: "suspense",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "confidence",
          controller: "controller",
        },
      },
    },
  }),
});
export const {
  red: fullOfBravadoRed,
  yellow: fullOfBravadoYellow,
  blue: fullOfBravadoBlue,
} = fullOfBravado.cards;
