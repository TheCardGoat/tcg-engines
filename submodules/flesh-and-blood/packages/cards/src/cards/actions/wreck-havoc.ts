import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wreck-havoc.generated.ts";

export const wreckHavoc = definePitchFamily(fabPitchFamilies["wreck-havoc"], {
  abilities: () => ({
    resolutionRuleModification: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "play",
        filter: {
          typeBox: {
            types: ["Defense Reaction"],
          },
        },
        duration: "this-chain-link",
      },
    },
    triggeredStaticOnHitEffect: {
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
          type: "sequence",
          steps: [
            {
              type: "optional",
              effect: {
                type: "turn-face-up",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "attack-target",
                  zones: ["arsenal"],
                  count: 1,
                },
              },
            },
            {
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["arsenal"],
                filter: {
                  typeBox: {
                    types: ["Defense Reaction"],
                  },
                },
                count: 1,
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: wreckHavocRed,
  yellow: wreckHavocYellow,
  blue: wreckHavocBlue,
} = wreckHavoc.cards;
