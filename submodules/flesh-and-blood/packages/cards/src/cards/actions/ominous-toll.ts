import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ominous-toll.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const ominousToll = definePitchFamily(fabPitchFamilies["ominous-toll"], {
  keywords: [goAgain],
  abilities: () => ({
    discard: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: { typeBox: { subtypes: ["Zombie"] } },
              count: 1,
            },
          },
          then: { type: "create-token", token: "gate-to-i-arathael", controller: "controller" },
        },
      },
    },
  }),
});
export const {
  red: ominousTollRed,
  yellow: ominousTollYellow,
  blue: ominousTollBlue,
} = ominousToll.cards;
