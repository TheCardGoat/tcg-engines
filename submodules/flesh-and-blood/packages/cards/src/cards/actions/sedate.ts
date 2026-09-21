import { stealth } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sedate.generated.ts";

export const sedate = definePitchFamily(fabPitchFamilies["sedate"], {
  keywords: [stealth],

  abilities: () => ({
    createPonderOnHit: {
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
          token: "inertia",
          creator: "effect-controller",
          controller: "attack-target",
        },
      },
    },
  }),
});
export const { red: sedateRed, yellow: sedateYellow, blue: sedateBlue } = sedate.cards;
