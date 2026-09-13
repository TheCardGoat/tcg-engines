import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/belittle.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const belittle = definePitchFamily(fabPitchFamilies["belittle"], {
  keywords: [goAgain],
  abilities: () => ({
    searchMinnowism: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "reveal",
          from: "hand",
          filter: {
            and: [attackActionFilter(), { power: { op: "lte", value: 3 } }],
          },
        },
        optional: true,
        then: {
          type: "sequence",
          steps: [
            {
              type: "search",
              zones: ["deck"],
              filter: { name: "Minnowism" },
              mayFail: true,
              to: { zone: "hand" },
            },
            { type: "shuffle", zone: "deck" },
          ],
        },
      },
    },
  }),
});

export const { red: belittleRed, yellow: belittleYellow, blue: belittleBlue } = belittle.cards;
