import { stealth } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wither.generated.ts";

export const wither = definePitchFamily(fabPitchFamilies["wither"], {
  keywords: [stealth],

  abilities: () => ({
    createFrailtyOnHit: {
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
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "frailty",
          controller: "attack-target",
        },
      },
    },
  }),
});
export const { red: witherRed, yellow: witherYellow, blue: witherBlue } = wither.cards;
