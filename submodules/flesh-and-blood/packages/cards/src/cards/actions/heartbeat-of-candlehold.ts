import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/heartbeat-of-candlehold.generated.ts";

export const heartbeatOfCandlehold = definePitchFamily(
  fabPitchFamilies["heartbeat-of-candlehold"],
  {
    keywords: [
      {
        name: "specialization",
        hero: "Verdance",
      },
      goAgain,
    ],
    abilities: () => ({
      gain1LifeGain1LifeGain1Life: {
        kind: "resolution",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "gain-life",
              amount: 1,
              target: {
                selector: "controller",
              },
            },
            {
              type: "gain-life",
              amount: 1,
              target: {
                selector: "controller",
              },
            },
            {
              type: "gain-life",
              amount: 1,
              target: {
                selector: "controller",
              },
            },
          ],
        },
      },
    }),
  },
);

export const { blue: heartbeatOfCandleholdBlue } = heartbeatOfCandlehold.cards;
