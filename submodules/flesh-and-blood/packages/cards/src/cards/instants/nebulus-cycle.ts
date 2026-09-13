import { ward } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/nebulus-cycle.generated.ts";

export const nebulusCycle = definePitchFamily(fabPitchFamilies["nebulus-cycle"], {
  keywords: [ward(2)],
  abilities: () => ({
    whenLeavesArenaCreatePonderToken: {
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
          type: "create-token",
          token: "ponder",
          controller: "controller",
        },
      },
    },
  }),
});

export const { yellow: nebulusCycleYellow } = nebulusCycle.cards;
