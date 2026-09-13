import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/stacked-in-your-favor.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const stackedInYourFavor = definePitchFamily(fabPitchFamilies["stacked-in-your-favor"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    continuousStaticModifyNumeric: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: amount,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["stack", "combat-chain"],
          filter: attackActionFilter({ defending: true }),
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
    triggeredStaticOnStartPhaseEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "draw",
              count: 1,
              player: "controller",
            },
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                filter: {},
                count: 1,
              },
              to: {
                zone: "deck",
                position: "top",
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: stackedInYourFavorRed,
  yellow: stackedInYourFavorYellow,
  blue: stackedInYourFavorBlue,
} = stackedInYourFavor.cards;
