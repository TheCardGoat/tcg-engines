import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/viral-diffusion.generated.ts";
import { specialization } from "../shared/keywords.ts";

export const viralDiffusion = definePitchFamily(fabPitchFamilies["viral-diffusion"], {
  keywords: [specialization("Mortimer")],
  abilities: () => ({
    defend: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            { type: "create-token", token: "frailty", controller: "opponent" },
            { type: "create-token", token: "inertia", controller: "opponent" },
            { type: "create-token", token: "bloodrot-pox", controller: "opponent" },
          ],
        },
      },
    },
  }),
});
export const { red: viralDiffusionRed } = viralDiffusion.cards;
