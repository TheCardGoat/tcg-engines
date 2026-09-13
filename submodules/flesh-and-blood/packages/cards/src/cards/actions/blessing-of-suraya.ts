import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-suraya.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const blessingOfSuraya = definePitchFamily(fabPitchFamilies["blessing-of-suraya"], {
  keywords: [goAgain],
  abilities: () => ({
    cardPutIntoSoulCreatesPonder: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "move-zone",
          actor: { kind: "any" },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: { kind: "zone-owner", player: "ability-controller" },
          },
          to: "soul",
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "create-token", token: "ponder", controller: "controller" },
      },
    },
    startOfTurnPutsSelfIntoSoul: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "none" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "move-card",
          target: { selector: "self" },
          to: { zone: "soul" },
        },
      },
    },
  }),
});

export const { yellow: blessingOfSurayaYellow } = blessingOfSuraya.cards;
