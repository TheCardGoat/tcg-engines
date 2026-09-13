import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/sigil-of-voltaris.generated.ts";

export const sigilOfVoltaris = definePitchFamily(fabPitchFamilies["sigil-of-voltaris"], {
  abilities: () => ({
    whenEntersLeavesArenaDeal1ArcaneDamageTarget: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          kind: "any-of",
          patterns: [
            {
              name: "enter-arena",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
            },
            {
              name: "leave-arena",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
            },
          ],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 1,
          target: {
            selector: "any-hero",
          },
        },
      },
    },
    atBeginningActionPhaseDestroy: {
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
            selector: "self",
          },
        },
      },
    },
  }),
});

export const { blue: sigilOfVoltarisBlue } = sigilOfVoltaris.cards;
