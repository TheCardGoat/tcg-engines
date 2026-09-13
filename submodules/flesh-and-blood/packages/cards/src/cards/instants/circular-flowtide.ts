import { ward } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/circular-flowtide.generated.ts";

export const circularFlowtide = definePitchFamily(fabPitchFamilies["circular-flowtide"], {
  keywords: [ward(2)],
  abilities: () => ({
    whenLeavesArenaCreateLightningFlowToken: {
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
          token: "lightning-flow",
          controller: "controller",
        },
      },
    },
  }),
});

export const { yellow: circularFlowtideYellow } = circularFlowtide.cards;
