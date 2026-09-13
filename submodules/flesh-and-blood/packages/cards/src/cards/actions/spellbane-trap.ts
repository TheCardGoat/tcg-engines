import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spellbane-trap.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const spellbaneTrap = definePitchFamily(fabPitchFamilies["spellbane-trap"], {
  parameters: pitchMap({
    red: { value1: 3, value2: 1, textValue1: 3 },
    yellow: { value1: 2, value2: 1, textValue1: 2 },
    blue: { value1: 1, value2: 1, textValue1: 1 },
  }),
  keywords: [goAgain],
  abilities: ({ value1, value2, textValue1: _textValue1 }) => ({
    resolutionModifyNumeric: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: value1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Arrow"],
            },
          },
        },
      },
    },
    triggeredStaticOnDefendEffect: {
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
          type: "damage-dealt",
          damageType: "arcane",
          player: "opponent",
          per: "turn",
          comparison: {
            op: "gte",
            value: value2,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "spellbane-aegis",
          controller: "controller",
        },
      },
    },
  }),
});

export const {
  red: spellbaneTrapRed,
  yellow: spellbaneTrapYellow,
  blue: spellbaneTrapBlue,
} = spellbaneTrap.cards;
