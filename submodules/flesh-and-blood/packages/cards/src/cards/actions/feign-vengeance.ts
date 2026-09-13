import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/feign-vengeance.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const feignVengeance = definePitchFamily(fabPitchFamilies["feign-vengeance"], {
  keywords: [goAgain],
  abilities: () => ({
    whenChainLinkResolvesIfThereIsDefendingDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "chain-link-resolve",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "has-status",
          status: "card-defending-this",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
  }),
});
export const { blue: feignVengeanceBlue } = feignVengeance.cards;
