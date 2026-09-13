import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/brain-freeze.generated.ts";

export const brainFreeze = definePitchFamily(fabPitchFamilies["brain-freeze"], {
  keywords: [fusion("Ice")],
  abilities: (_parameter, { pitch }) => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["hand"],
              count: {
                type: "all",
              },
            },
          },
          {
            type: "conditional",
            condition: {
              type: "has-status",
              status: "fused",
            },
            then: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["hand"],
                filter: {
                  typeBox: {
                    types: ["Action"],
                  },
                  cost: {
                    op: "lte",
                    value: 3 - Number(pitch),
                  },
                },
                count: 1,
              },
              to: {
                zone: "deck",
                position: "top",
              },
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: brainFreezeRed,
  yellow: brainFreezeYellow,
  blue: brainFreezeBlue,
} = brainFreeze.cards;
