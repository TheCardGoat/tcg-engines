import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/off-beat.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const offBeat = definePitchFamily(fabPitchFamilies["off-beat"], {
  keywords: [{ name: "sharpen" }, goAgain],
  abilities: () => ({
    sequenceDestroyBladeDanceUpToDestroyFlurryUpToSharpenCount: {
      type: "sequence",
      steps: [
        {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: { name: "Blade Dance" },
            count: { type: "up-to", amount: 1 },
          },
        },
        {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: { name: "Flurry" },
            count: { type: "up-to", amount: 1 },
          },
        },
        {
          type: "sharpen",
          times: { type: "count", what: "destroyed-this-way" },
          target: {
            selector: "object",
            declared: "on-stack",
            player: "controller",
            zones: ["weapon", "permanent"],
            filter: { typeBox: { subtypes: ["Sword"] } },
            count: 1,
          },
        },
      ],
    },
  }),
});

export const { blue: offBeatBlue } = offBeat.cards;
