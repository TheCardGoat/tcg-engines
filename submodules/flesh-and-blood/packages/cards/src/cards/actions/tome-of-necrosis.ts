import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tome-of-necrosis.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const tomeOfNecrosis = definePitchFamily(fabPitchFamilies["tome-of-necrosis"], {
  keywords: [goAgain],
  abilities: () => ({
    additionalCostDestroyAllyOrDiscardAlly: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "mixed",
          type: "alternative",
          costs: [
            {
              class: "effect",
              type: "destroy",
              filter: { typeBox: { subtypes: ["Ally"] } },
              count: 1,
            },
            {
              class: "effect",
              type: "discard",
              filter: { typeBox: { subtypes: ["Ally"] } },
              count: 1,
            },
          ],
        },
      },
    },
    drawAndUntapHero: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          { type: "draw", count: 1, player: "controller" },
          {
            type: "untap",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hero"],
              count: 1,
            },
          },
        ],
      },
    },
  }),
});
export const { red: tomeOfNecrosisRed } = tomeOfNecrosis.cards;
