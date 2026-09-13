import { semanticTriggeredModalResolution } from "../../authoring/card.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/coax-a-commotion.generated.ts";

export const coaxACommotion = definePitchFamily(fabPitchFamilies["coax-a-commotion"], {
  abilities: () => ({
    whenHitsChooseAnyNumberEachHeroCreatesQuicken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
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
      resolution: semanticTriggeredModalResolution({
        kind: "modal",
        choose: {
          type: "any-number",
        },
        modes: {
          eachHeroCreatesQuickenToken: {
            kind: "resolution",
            effect: {
              type: "create-token",
              token: "quicken",
              controller: "each",
            },
          },
          eachHeroDraws: {
            kind: "resolution",
            effect: {
              type: "draw",
              count: 1,
              player: "each",
            },
          },
          eachHeroGains1: {
            kind: "resolution",
            effect: {
              type: "gain-life",
              amount: 1,
              target: {
                selector: "each-hero",
              },
            },
          },
        },
      }),
    },
  }),
});
export const { red: coaxACommotionRed } = coaxACommotion.cards;
