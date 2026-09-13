import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/oath-of-loyalty.generated.ts";

export const oathOfLoyalty = definePitchFamily(fabPitchFamilies["oath-of-loyalty"], {
  keywords: [goAgain],
  abilities: () => ({
    onlyPlayedFirstActionTurn: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "has-status",
        status: "first-action-of-your-turn",
      },
      playEffect: {
        role: "condition",
      },
    },
    playedEndTurnOnlyPlayDraconic: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "played-card",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "rule-modification",
          mode: "require",
          action: "play",
          filter: {
            typeBox: {
              supertypes: ["Draconic"],
            },
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const { red: oathOfLoyaltyRed } = oathOfLoyalty.cards;
