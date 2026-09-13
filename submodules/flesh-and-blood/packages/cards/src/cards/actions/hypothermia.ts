import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hypothermia.generated.ts";

export const hypothermia = definePitchFamily(fabPitchFamilies["hypothermia"], {
  abilities: () => ({
    attacksCantGainGoAgain: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "gain-keyword",
        keyword: "go-again",
        subject: {
          typeBox: {
            subtypes: ["Attack"],
          },
          hasStatus: "attacking",
        },
        filter: {
          typeBox: {
            subtypes: ["Attack"],
          },
        },
        duration: "while-in-arena",
      },
    },
    beginningEndPhaseDestroyHypothermia: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});

export const { blue: hypothermiaBlue } = hypothermia.cards;
