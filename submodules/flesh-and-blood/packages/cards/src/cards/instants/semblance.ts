import { phantasm } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/semblance.generated.ts";

export const semblance = definePitchFamily(fabPitchFamilies["semblance"], {
  abilities: () => ({
    negateAllPhantasmTriggeredEffectsTargetIllusionistAttackControl: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "negate",
            triggeredKeyword: "phantasm",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["combat-chain"],
              filter: {
                and: [
                  {
                    typeBox: {
                      supertypes: ["Illusionist"],
                    },
                  },
                  {
                    typeBox: {
                      subtypes: ["Attack"],
                    },
                  },
                ],
              },
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "remove-property",
            property: {
              kind: "keyword",
              keyword: phantasm,
            },
            target: {
              selector: "binding",
              binding: "it",
            },
            duration: "this-turn",
          },
          {
            type: "rule-modification",
            mode: "restrict",
            action: "gain-keyword",
            keyword: "phantasm",
            subject: {
              selector: "binding",
              binding: "it",
            },
            duration: "this-turn",
          },
        ],
      },
    },
  }),
});

export const { blue: semblanceBlue } = semblance.cards;
