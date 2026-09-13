import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rawhide-rumble.generated.ts";
import { beatChest } from "../shared/keywords.ts";

export const rawhideRumble = definePitchFamily(fabPitchFamilies["rawhide-rumble"], {
  keywords: [beatChest],
  abilities: () => ({
    triggeredAttackPerformedThisTurnBeatChestIntimidate: {
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
          target: {
            kind: "hero",
          },
        },
        state: { type: "performed-this-turn", event: "beat-chest", player: "controller" },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "intimidate",
          target: "attack-target",
        },
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});

export const {
  red: rawhideRumbleRed,
  yellow: rawhideRumbleYellow,
  blue: rawhideRumbleBlue,
} = rawhideRumble.cards;
