import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/convulsions-from-the-bellows-of-hell.generated.ts";
import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { dominate, goAgain } from "../shared/keywords.ts";
export const convulsionsFromTheBellowsOfHell = definePitchFamily(
  fabPitchFamilies["convulsions-from-the-bellows-of-hell"],
  {
    parameters: pitchMap({
      red: { powerBonus: 3 },
      yellow: { powerBonus: 2 },
      blue: { powerBonus: 1 },
    }),
    keywords: [goAgain],
    abilities: ({ powerBonus }) => ({
      staticPlay: {
        kind: "static",
        staticKind: "play",
        playEffect: {
          role: "additional-cost",
          cost: {
            class: "effect",
            type: "banish",
            from: "graveyard",
            count: 3,
            random: true,
          },
        },
      },
      resolutionCompareAmountSequence: {
        kind: "resolution",
        condition: {
          type: "compare-amount",
          amount: {
            type: "count",
            what: "banished-this-way",
            filter: { power: { op: "gte", value: 6 } },
          },
          comparison: { op: "gte", value: 1 },
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: powerBonus,
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: nextAttackActionLatch(),
            },
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: dominate,
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: nextAttackActionLatch(),
            },
          ],
        },
      },
    }),
  },
);
export const {
  red: convulsionsFromTheBellowsOfHellRed,
  yellow: convulsionsFromTheBellowsOfHellYellow,
  blue: convulsionsFromTheBellowsOfHellBlue,
} = convulsionsFromTheBellowsOfHell.cards;
