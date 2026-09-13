import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/settle-the-bill.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const settleTheBill = definePitchFamily(fabPitchFamilies["settle-the-bill"], {
  keywords: [goAgain],
  abilities: () => ({
    putArrowFromHandFaceUpIntoArsenalDoUntilEndTurn: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            filter: {
              typeBox: {
                subtypes: ["Arrow"],
              },
            },
            count: 1,
          },
          to: {
            zone: "arsenal",
            visibility: "face-up",
          },
          outputBinding: "it",
        },
        then: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 3,
              target: {
                selector: "binding",
                binding: "it",
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
                  id: "whenHitsHeroDestroyInTheirArsenal",
                  text: "",
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
                      type: "destroy",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "opponent",
                        zones: ["arsenal"],
                        filter: {},
                        count: 1,
                      },
                    },
                  },
                },
              },
              target: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  }),
});

export const { red: settleTheBillRed } = settleTheBill.cards;
