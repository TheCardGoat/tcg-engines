import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/restless-outlaw.generated.ts";
import { decay } from "../shared/keywords.ts";

export const restlessOutlaw = definePitchFamily(fabPitchFamilies["restless-outlaw"], {
  keywords: [decay],
  abilities: () => ({
    corpse: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "destroy",
          actor: { kind: "any" },
          observes: { kind: "source", selector: "moved-object" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-card",
          name: "Corrupted Corpse",
          to: { zone: "banished" },
          controller: "controller",
        },
      },
    },
  }),
});
export const { red: restlessOutlawRed } = restlessOutlaw.cards;
