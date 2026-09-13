import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/cognition-field.generated.ts";

export const cognitionField = definePitchFamily(fabPitchFamilies["cognition-field"], {
  parameters: pitchMap({
    red: { value1: 1, value2: 2 },
    yellow: { value1: 1, value2: 2 },
    blue: { value1: 1, value2: 2 },
  }),
  abilities: ({ value1, value2 }) => ({
    destroyItemToPreventDamage: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Item"],
                },
              },
              count: value1,
            },
          },
          then: {
            type: "modify-numeric",
            property: "defense",
            op: "add",
            amount: value2,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        },
      },
      label: {
        name: "galvanize",
      },
    },
  }),
});

export const {
  red: cognitionFieldRed,
  yellow: cognitionFieldYellow,
  blue: cognitionFieldBlue,
} = cognitionField.cards;
