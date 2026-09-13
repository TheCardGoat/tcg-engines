import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/depths-of-despair.generated.ts";
export const depthsOfDespair = definePitchFamily(fabPitchFamilies["depths-of-despair"], {
  keywords: [bloodDebt],
  abilities: () => ({
    staticTriggeredDefendBanish: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "banish",
          target: {
            selector: "self",
          },
          until: "this-combat-chain",
        },
      },
    },
  }),
});
export const {
  red: depthsOfDespairRed,
  yellow: depthsOfDespairYellow,
  blue: depthsOfDespairBlue,
} = depthsOfDespair.cards;
