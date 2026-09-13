import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-steel.generated.ts";

export const blessingOfSteel = definePitchFamily(fabPitchFamilies["blessing-of-steel"], {
  abilities: (_parameter, { pitch }) => ({
    onStartPhaseDestroyModifyNumericPower: {
      kind: "static",
      staticKind: "triggered",

      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
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
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 4 - Number(pitch),
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    types: ["Weapon"],
                  },
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: blessingOfSteelRed,
  yellow: blessingOfSteelYellow,
  blue: blessingOfSteelBlue,
} = blessingOfSteel.cards;
