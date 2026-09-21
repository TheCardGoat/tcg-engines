import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/frost-spike.generated.ts";

export const frostSpike = definePitchFamily(fabPitchFamilies["frost-spike"], {
  abilities: () => ({
    createFrostbiteTokenExposedHeadChestArmsLegsZone: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "frostbite",
        creator: "effect-controller",
        controller: "opponent",
        amongExposed: ["equipment-head", "equipment-chest", "equipment-arms", "equipment-legs"],
      },
    },
  }),
});

export const { blue: frostSpikeBlue } = frostSpike.cards;
