import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/contest-the-mindfield.generated.ts";

export const contestTheMindfield = definePitchFamily(fabPitchFamilies["contest-the-mindfield"], {
  abilities: () => ({
    allHeroesGet1: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "intellect",
        op: "subtract",
        amount: 1,
        target: {
          selector: "each-hero",
        },
        duration: "this-turn",
      },
    },
    atStartTurnDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});
export const { blue: contestTheMindfieldBlue } = contestTheMindfield.cards;
