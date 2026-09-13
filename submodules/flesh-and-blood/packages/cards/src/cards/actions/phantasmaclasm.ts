import { phantasm } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/phantasmaclasm.generated.ts";

export const phantasmaclasm = definePitchFamily(fabPitchFamilies["phantasmaclasm"], {
  keywords: [phantasm],
  abilities: () => ({
    lookDefendingHerosHandChoosePutBottomDeckThenDraw: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "sequence",
            steps: [
              {
                type: "look",
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
                type: "choose-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  chooser: "controller",
                  zones: ["hand"],
                  count: 1,
                },
                outputBinding: "it",
              },
            ],
          },
          {
            type: "move-card",
            target: {
              selector: "binding",
              binding: "it",
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
          {
            type: "draw",
            count: 1,
            player: "opponent",
          },
        ],
      },
    },
  }),
});

export const { red: phantasmaclasmRed } = phantasmaclasm.cards;
