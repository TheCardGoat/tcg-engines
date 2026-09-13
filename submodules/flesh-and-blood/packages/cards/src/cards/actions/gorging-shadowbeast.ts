import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/gorging-shadowbeast.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const gorgingShadowbeast = definePitchFamily(fabPitchFamilies["gorging-shadowbeast"], {
  keywords: [bloodDebt],
  abilities: () => ({
    onAttackBanish: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
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
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          outputBinding: "it",
        },
      },
    },
  }),
});

export const {
  red: gorgingShadowbeastRed,
  yellow: gorgingShadowbeastYellow,
  blue: gorgingShadowbeastBlue,
} = gorgingShadowbeast.cards;
