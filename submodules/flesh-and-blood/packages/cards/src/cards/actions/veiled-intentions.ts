import { attackActionFilter, nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain, phantasm } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/veiled-intentions.generated.ts";

export const veiledIntentions = definePitchFamily(fabPitchFamilies["veiled-intentions"], {
  parameters: pitchMap({ red: { value1: 4 }, yellow: { value1: 3 }, blue: { value1: 2 } }),
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-property",
            property: {
              kind: "supertype",
              value: "Illusionist",
            },
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["stack", "combat-chain"],
              filter: attackActionFilter(),
              count: 1,
            },
            duration: "this-turn",
            appliesTo: nextAttackActionLatch(),
          },
          {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: value1,
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["stack", "combat-chain"],
                  filter: attackActionFilter(),
                  count: 1,
                },
                duration: "this-turn",
              },
              {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: phantasm,
                },
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["stack", "combat-chain"],
                  filter: attackActionFilter(),
                  count: 1,
                },
                duration: "this-turn",
              },
              {
                type: "grant-property",
                property: {
                  kind: "ability",
                  ability: {
                    kind: "static",
                    staticKind: "triggered",
                    id: "triggeredStaticOnDestroyEffect",
                    text: "",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "destroy",
                        actor: {
                          kind: "any",
                        },
                        observes: {
                          kind: "source",
                          selector: "moved-object",
                        },
                      },
                    },
                    resolution: {
                      kind: "effect",
                      effect: {
                        type: "draw",
                        count: 1,
                        player: "controller",
                      },
                    },
                  },
                },
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["stack", "combat-chain"],
                  filter: attackActionFilter(),
                  count: 1,
                },
                duration: "this-turn",
              },
            ],
            appliesTo: nextAttackActionLatch(),
          },
        ],
      },
    },
  }),
});

export const {
  red: veiledIntentionsRed,
  yellow: veiledIntentionsYellow,
  blue: veiledIntentionsBlue,
} = veiledIntentions.cards;
