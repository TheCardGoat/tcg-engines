import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/unsheathed.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const unsheathed = definePitchFamily(fabPitchFamilies["unsheathed"], {
  keywords: [goAgain],
  abilities: () => ({
    nextSwordAttackTurnGetsNumber3PowerWhenAttacksPowerGreaterThan: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Sword"],
                },
              },
            },
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenAttacksPowerGreaterThanTwiceBaseGetsGoAgain",
                text: "",
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
                    type: "object-numeric-comparison",
                    property: "power",
                    left: "current",
                    op: "gt",
                    right: "base",
                    multiplier: 2,
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "grant-property",
                    property: {
                      kind: "keyword",
                      keyword: goAgain,
                    },
                    target: {
                      selector: "self",
                    },
                    duration: "this-turn",
                  },
                },
              },
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Sword"],
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const { red: unsheathedRed } = unsheathed.cards;
