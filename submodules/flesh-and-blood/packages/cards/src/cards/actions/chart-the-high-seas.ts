import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/chart-the-high-seas.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const chartTheHighSeas = definePitchFamily(fabPitchFamilies["chart-the-high-seas"], {
  keywords: [goAgain],
  abilities: () => ({
    lookAtTop2DeckMayPitchBlueFrom: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 2,
            },
            outputBinding: "them",
          },
          {
            type: "optional",
            effect: {
              type: "move-card",
              target: {
                selector: "binding",
                binding: "them",
                filter: {
                  color: ["blue"],
                },
              },
              to: {
                zone: "pitch",
              },
              outputBinding: "it",
            },
          },
          {
            type: "move-card",
            target: {
              selector: "binding",
              binding: "them",
              exclude: "it",
            },
            to: {
              zone: "graveyard",
            },
          },
          {
            type: "create-token",
            token: "gold",
            controller: "controller",
            count: {
              type: "count",
              what: "put-into-graveyard-this-way",
              filter: {
                color: ["yellow"],
              },
            },
          },
        ],
      },
    },
  }),
});
export const { blue: chartTheHighSeasBlue } = chartTheHighSeas.cards;
