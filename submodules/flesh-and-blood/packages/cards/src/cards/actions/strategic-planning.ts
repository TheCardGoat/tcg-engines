import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/strategic-planning.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const strategicPlanning = definePitchFamily(fabPitchFamilies["strategic-planning"], {
  parameters: pitchMap({ red: { costLimit: 2 }, yellow: { costLimit: 1 }, blue: { costLimit: 0 } }),
  keywords: [goAgain],
  abilities: ({ costLimit }) => ({
    recycleAction: {
      kind: "resolution",
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["graveyard"],
          filter: { typeBox: { types: ["Action"] }, cost: { op: "lte", value: costLimit } },
          count: 1,
        },
        to: { zone: "deck", position: "bottom" },
      },
    },
    drawAtEndPhase: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: { name: "end-phase", actor: { kind: "any" }, observes: { kind: "none" } },
        },
        policy: { kind: "windowed", duration: "this-turn", matching: "first" },
        resolution: { kind: "effect", effect: { type: "draw", count: 1, player: "controller" } },
      },
    },
  }),
});

export const {
  red: strategicPlanningRed,
  yellow: strategicPlanningYellow,
  blue: strategicPlanningBlue,
} = strategicPlanning.cards;
