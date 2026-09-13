import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/canopy-shelter.generated.ts";

export const canopyShelter = definePitchFamily(fabPitchFamilies["canopy-shelter"], {
  abilities: () => ({
    createMight: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "create-token", token: "might", controller: "controller" },
      },
    },
  }),
});

export const { blue: canopyShelterBlue } = canopyShelter.cards;
