import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pound-town.generated.ts";
import { beatChest } from "../shared/keywords.ts";

export const poundTown = definePitchFamily(fabPitchFamilies["pound-town"], {
  keywords: [beatChest],
  abilities: () => ({
    triggeredAttackPerformedThisTurnBeatChestCreateTokenMight: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: { type: "performed-this-turn", event: "beat-chest", player: "controller" },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "might",
          controller: "controller",
        },
      },
    },
  }),
});

export const { red: poundTownRed, yellow: poundTownYellow, blue: poundTownBlue } = poundTown.cards;
