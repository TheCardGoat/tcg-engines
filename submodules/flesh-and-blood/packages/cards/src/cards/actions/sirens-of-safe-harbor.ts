import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sirens-of-safe-harbor.generated.ts";

export const sirensOfSafeHarbor = definePitchFamily(fabPitchFamilies["sirens-of-safe-harbor"], {
  abilities: () => ({
    triggeredStaticOnPutIntoGraveyardEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "put-into-graveyard",
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
          type: "gain-life",
          amount: 1,
          target: {
            selector: "controller",
          },
        },
      },
    },
  }),
});

export const {
  red: sirensOfSafeHarborRed,
  yellow: sirensOfSafeHarborYellow,
  blue: sirensOfSafeHarborBlue,
} = sirensOfSafeHarbor.cards;
