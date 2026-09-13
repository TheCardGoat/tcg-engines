import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cyclone-roundhouse.generated.ts";

import { comboStatic } from "@tcg/flesh-and-blood-types";

import { combo } from "../shared/keywords.ts";

export const cycloneRoundhouse = definePitchFamily(fabPitchFamilies["cyclone-roundhouse"], {
  keywords: [combo],
  abilities: () => ({
    spinningWheelKickCombo: comboStatic({
      names: ["Spinning Wheel Kick"],
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "atBeginningReactionStepBanishRandomDefendingFromEach",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "reaction-step",
                actor: {
                  kind: "none",
                },
                observes: {
                  kind: "none",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "banish",
                random: true,
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "any",
                  zones: ["combat-chain"],
                  filter: {
                    defending: true,
                  },
                  count: {
                    type: "all",
                  },
                },
              },
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    }),
  }),
});
export const { yellow: cycloneRoundhouseYellow } = cycloneRoundhouse.cards;
