import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tome-of-the-arknight.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const tomeOfTheArknight = definePitchFamily(fabPitchFamilies["tome-of-the-arknight"], {
  keywords: [goAgain],
  abilities: () => ({
    revealTopNumber2DeckRevealAttackActionNonAttackActionWayPut: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 2,
            },
            // Stamp the revealed pair (CR 5.3.4b / HVY016 precedent): the
            // follow-up move-card resolves binding "them" against this cohort.
            outputBinding: "them",
          },
          {
            type: "conditional",
            condition: {
              type: "and",
              conditions: [
                {
                  type: "compare-amount",
                  amount: {
                    type: "count",
                    what: "revealed-this-way",
                    filter: attackActionFilter(),
                  },
                  comparison: { op: "gte", value: 1 },
                },
                {
                  type: "compare-amount",
                  amount: {
                    type: "count",
                    what: "revealed-this-way",
                    filter: { typeBox: { types: ["Action"], excludeSubtypes: ["Attack"] } },
                  },
                  comparison: { op: "gte", value: 1 },
                },
              ],
            },
            then: {
              type: "move-card",
              target: {
                selector: "binding",
                binding: "them",
              },
              to: {
                zone: "hand",
              },
            },
          },
        ],
      },
    },
  }),
});

export const { blue: tomeOfTheArknightBlue } = tomeOfTheArknight.cards;
