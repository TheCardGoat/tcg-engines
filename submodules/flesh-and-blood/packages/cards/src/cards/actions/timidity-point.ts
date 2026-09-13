import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/timidity-point.generated.ts";
import { dominate } from "../shared/keywords.ts";

export const timidityPoint = definePitchFamily(fabPitchFamilies["timidity-point"], {
  parameters: pitchMap({ red: {}, yellow: {}, blue: {} }),
  abilities: () => ({
    triggeredStaticOnHitEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
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
              type: "remove-property",
              property: {
                kind: "keyword",
                keyword: dominate,
              },
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["combat-chain"],
                filter: {
                  typeBox: {
                    subtypes: ["Attack"],
                  },
                },
                count: {
                  type: "all",
                },
              },
              duration: "until-end-of-next-turn",
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "gain-keyword",
              filter: {
                hasKeyword: "dominate",
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
              duration: "until-end-of-next-turn",
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: timidityPointRed,
  yellow: timidityPointYellow,
  blue: timidityPointBlue,
} = timidityPoint.cards;
