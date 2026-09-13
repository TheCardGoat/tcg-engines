import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lunar-mirage.generated.ts";

import { goAgain, mirage } from "../shared/keywords.ts";

export const lunarMirage = definePitchFamily(fabPitchFamilies["lunar-mirage"], {
  keywords: [goAgain, mirage],
  abilities: () => ({
    attackAction6MorePowerDefendsBecomesCopy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "opponent",
          },
          observes: {
            kind: "event-object",
            selector: "defender",
            relationship: {
              kind: "any",
            },
            filter: attackActionFilter({
              power: {
                op: "gte",
                value: 6,
              },
            }),
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "copy",
          target: {
            selector: "self",
          },
          source: {
            selector: "binding",
            binding: "it",
          },
          duration: "permanent",
        },
      },
    },
  }),
});

export const { red: lunarMirageRed } = lunarMirage.cards;
