import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/overload.generated.ts";
import { dominate, goAgain } from "../shared/keywords.ts";

export const overload = definePitchFamily(fabPitchFamilies["overload"], {
  keywords: [dominate, goAgain],
  abilities: () => ({
    triggeredHitGrantPropertyPermanent: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
      },
    },
  }),
});

export const { red: overloadRed, yellow: overloadYellow, blue: overloadBlue } = overload.cards;
