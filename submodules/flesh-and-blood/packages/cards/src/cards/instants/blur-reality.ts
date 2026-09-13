import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/blur-reality.generated.ts";

export const blurReality = definePitchFamily(fabPitchFamilies["blur-reality"], {
  abilities: () => ({
    banishLightningAuraPermanentControlNoHoloCountersThen: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  supertypes: ["Lightning"],
                  subtypes: ["Aura"],
                },
                lacksCounter: "holo",
              },
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "sequence",
            steps: [
              {
                type: "move-card",
                target: {
                  selector: "binding",
                  binding: "it",
                },
                to: {
                  zone: "permanent",
                },
              },
              {
                type: "add-counter",
                counter: {
                  kind: "named",
                  name: "holo",
                },
                count: 1,
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
            ],
          },
        ],
      },
    },
  }),
});

export const { blue: blurRealityBlue } = blurReality.cards;
