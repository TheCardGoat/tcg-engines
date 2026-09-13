import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/talk-a-big-game.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const talkABigGame = definePitchFamily(fabPitchFamilies["talk-a-big-game"], {
  supertypeSets: [["Brute"], ["Guardian"]],
  keywords: [goAgain],
  abilities: () => ({
    chooseNumberNextTimeDealMuchMorePowerDamageHeroTurnCreate: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "choose-number",
            min: 1,
            max: 20,
          },
          {
            type: "delayed-trigger",
            trigger: {
              kind: "event-and-state",
              event: {
                name: "deal-damage",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "none",
                },
                target: {
                  kind: "hero",
                },
                damageType: "physical",
              },
              state: {
                type: "compare-amount",
                amount: { type: "trigger-event-damage" },
                comparison: {
                  op: "gte",
                  value: { type: "reference", binding: "chosen-number" },
                },
              },
            },
            policy: {
              kind: "windowed",
              duration: "this-turn",
              matching: "first",
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "create-token",
                token: "might",
                controller: "controller",
                count: {
                  type: "reference",
                  binding: "chosen-number",
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const { blue: talkABigGameBlue } = talkABigGame.cards;
