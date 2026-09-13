import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spring-load.generated.ts";

export const springLoad = definePitchFamily(fabPitchFamilies["spring-load"], {
  parameters: pitchMap({ red: { bonus: 3 }, yellow: { bonus: 2 }, blue: { bonus: 1 } }),
  abilities: ({ bonus }) => ({
    triggeredStaticOnAttackEffect: {
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
        state: {
          type: "zone-count",
          zone: "hand",
          player: "controller",
          comparison: {
            op: "eq",
            value: 0,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: bonus,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
      },
    },
  }),
});

export const {
  red: springLoadRed,
  yellow: springLoadYellow,
  blue: springLoadBlue,
} = springLoad.cards;
