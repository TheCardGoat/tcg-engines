import { wateryGrave } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/oysten-heart-of-gold.generated.ts";

export const oystenHeartOfGold = definePitchFamily(fabPitchFamilies["oysten-heart-of-gold"], {
  keywords: [wateryGrave],
  abilities: () => ({
    actionTapAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "effect",
        type: "tap-self",
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    diesCreateGoldToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dies",
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
          token: "gold",
          controller: "controller",
        },
      },
    },
  }),
});

export const { yellow: oystenHeartOfGoldYellow } = oystenHeartOfGold.cards;
