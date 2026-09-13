import { boost, opt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/data-link.generated.ts";

export const dataLink = definePitchFamily(fabPitchFamilies["data-link"], {
  keywords: [boost, opt(1)],
  abilities: () => ({
    onHitOpt: {
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
          type: "opt",
          count: 1,
        },
      },
    },
  }),
});

export const { red: dataLinkRed, yellow: dataLinkYellow, blue: dataLinkBlue } = dataLink.cards;
