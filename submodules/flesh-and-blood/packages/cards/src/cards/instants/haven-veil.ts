import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/haven-veil.generated.ts";

export const havenVeil = definePitchFamily(fabPitchFamilies["haven-veil"], {
  parameters: pitchMap({
    red: { amount: 3 },
    yellow: { amount: 2 },
    blue: { amount: 1 },
  }),
  abilities: ({ amount }) => ({
    preventArcane: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: { kind: "any" },
          observes: { kind: "source", selector: "moved-object" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "prevention",
          preventionKind: "fixed",
          amount,
          damageType: "arcane",
          shielded: { selector: "controller" },
          duration: "this-turn",
        },
      },
    },
    destroyAtActionPhase: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "none" },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "destroy", target: { selector: "self" } },
      },
    },
  }),
});

export const { red: havenVeilRed, yellow: havenVeilYellow, blue: havenVeilBlue } = havenVeil.cards;
