import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/enchanting-melody.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const enchantingMelody = definePitchFamily(fabPitchFamilies["enchanting-melody"], {
  parameters: pitchMap({
    red: { preventionAmount: 4 },
    yellow: { preventionAmount: 3 },
    blue: { preventionAmount: 2 },
  }),
  keywords: [goAgain],
  abilities: ({ preventionAmount }) => ({
    preventDamage: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: preventionAmount,
        shielded: { selector: "controller" },
        duration: "while-in-arena",
        additionalModification: { type: "destroy", target: { selector: "self" } },
      },
    },
    destroyUnlessNonAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "none" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "conditional",
          condition: {
            type: "not",
            condition: {
              type: "performed-this-turn",
              event: "play-non-attack-action",
              player: "controller",
            },
          },
          then: { type: "destroy", target: { selector: "self" } },
        },
      },
    },
  }),
});

export const {
  red: enchantingMelodyRed,
  yellow: enchantingMelodyYellow,
  blue: enchantingMelodyBlue,
} = enchantingMelody.cards;
