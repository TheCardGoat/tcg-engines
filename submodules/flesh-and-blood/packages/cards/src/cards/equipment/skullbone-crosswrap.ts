import { arcaneBarrier, bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/skullbone-crosswrap.generated.ts";

export const skullboneCrosswrap = defineCard(
  fabCardIdentitiesByCanonicalId["pLT6mqkb86GG9jHh8kFRp"],
  {
    keywords: [arcaneBarrier(1), bladeBreak],
    abilities: {
      oncePerTurnActionTurnFaceDownArsenalFace: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "action",
        cost: {
          class: "effect",
          type: "turn-face-up",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["arsenal"],
            filter: {
              hasStatus: "face-down",
            },
            count: 1,
          },
          outputBinding: "it",
        },
        layerKeywords: [goAgain],
        effect: {
          type: "opt",
          count: 1,
        },
      },
    },
  },
);
