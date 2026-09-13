import { ward } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/stardust-spike.generated.ts";

export const stardustSpike = definePitchFamily(fabPitchFamilies["stardust-spike"], {
  keywords: [
    {
      name: "amp",
      value: 1,
    },
    ward(2),
  ],
  abilities: () => ({
    whenLeavesArenaGainAmp1: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "gain-resources",
              amount: 1,
            },
            {
              type: "amp",
              amount: 1,
            },
          ],
        },
      },
    },
  }),
});

export const { red: stardustSpikeRed } = stardustSpike.cards;
