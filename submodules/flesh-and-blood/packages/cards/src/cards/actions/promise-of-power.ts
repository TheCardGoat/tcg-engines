import { attackActionFilter, createToken } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/promise-of-power.generated.ts";

export const promiseOfPower = definePitchFamily(fabPitchFamilies["promise-of-power"], {
  keywords: [goAgain],
  abilities: () => ({
    nextBanishedAttackCreatesRunechants: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "play",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "played-card",
              relationship: {
                kind: "any",
              },
              filter: attackActionFilter({ playedFromZones: ["banished"] }),
            },
          },
        },
        policy: { kind: "windowed", duration: "this-turn", matching: "first" },
        resolution: {
          kind: "effect",
          effect: createToken("runechant", 2),
        },
      },
    },
  }),
});

export const { yellow: promiseOfPowerYellow } = promiseOfPower.cards;
