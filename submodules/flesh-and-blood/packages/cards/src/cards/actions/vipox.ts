import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/vipox.generated.ts";

export const vipox = definePitchFamily(fabPitchFamilies["vipox"], {
  abilities: () => ({
    whenVipoxHitsHeroTheyLoseLifeEqualNumberInTheirHand: {
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
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "lose-life",
          amount: {
            type: "count",
            what: "cards-in-zone",
            zone: "hand",
            player: "attack-target",
          },
          target: {
            selector: "attack-target",
          },
        },
      },
    },
  }),
});

export const { red: vipoxRed } = vipox.cards;
