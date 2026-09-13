import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/assault-and-battery.generated.ts";

import { beatChest } from "../shared/keywords.ts";

export const assaultAndBattery = definePitchFamily(fabPitchFamilies["assault-and-battery"], {
  keywords: [beatChest],
  abilities: () => ({
    staticTriggeredAttackAttackCreateTokenAgility: {
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
          token: "agility",
          controller: "controller",
        },
      },
    },
  }),
});

export const {
  red: assaultAndBatteryRed,
  yellow: assaultAndBatteryYellow,
  blue: assaultAndBatteryBlue,
} = assaultAndBattery.cards;
