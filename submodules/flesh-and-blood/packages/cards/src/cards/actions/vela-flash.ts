import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/vela-flash.generated.ts";

export const velaFlash = definePitchFamily(fabPitchFamilies["vela-flash"], {
  keywords: [fusion("Lightning")],
  abilities: () => ({
    resolutionOptional: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          fromZones: ["hand"],
          source: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            count: 1,
            filter: {
              typeBox: {
                types: ["Action"],
                excludeSubtypes: ["Attack"],
              },
            },
          },
          appliesTo: {
            next: {
              typeBox: {
                types: ["Action"],
                excludeSubtypes: ["Attack"],
              },
            },
          },
          duration: "this-turn",
          asType: "instant",
        },
      },
    },
  }),
});

export const { red: velaFlashRed, yellow: velaFlashYellow, blue: velaFlashBlue } = velaFlash.cards;
