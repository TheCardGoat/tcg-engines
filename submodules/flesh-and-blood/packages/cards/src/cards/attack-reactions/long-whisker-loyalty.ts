import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/long-whisker-loyalty.generated.ts";

export const longWhiskerLoyalty = definePitchFamily(fabPitchFamilies["long-whisker-loyalty"], {
  abilities: () => ({
    chooseForEachDraconicLink: modalAbility({
      kind: "modal",
      modal: {
        choose: {
          type: "count",
          what: "chain-links",
          player: "controller",
          filter: {
            typeBox: {
              supertypes: ["Draconic"],
            },
          },
        },
      },
      modes: {
        boostDagger: {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  subtypes: ["Dagger"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
        },
        additionalDaggerAttack: {
          kind: "resolution",
          effect: {
            type: "optional",
            effect: {
              type: "modify-activation-limit",
              target: {
                selector: "this-attack",
              },
              operation: "additional",
              count: 1,
              duration: "this-turn",
            },
          },
        },
        markOnNextHit: {
          kind: "resolution",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "choose-card",
                target: {
                  selector: "object",
                  declared: "on-stack",
                  player: "controller",
                  zones: ["weapon", "permanent", "combat-chain"],
                  filter: {
                    typeBox: {
                      subtypes: ["Dagger"],
                    },
                  },
                  count: 1,
                },
                outputBinding: "it",
              },
              {
                type: "delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "hit",
                    actor: {
                      kind: "any",
                    },
                    observes: {
                      kind: "bound-object",
                      selector: "attack",
                      binding: "it",
                    },
                    target: {
                      kind: "hero",
                    },
                  },
                },
                policy: {
                  kind: "windowed",
                  duration: "this-turn",
                  matching: "first",
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "mark",
                    target: { selector: "attack-target" },
                  },
                },
              },
            ],
          },
        },
      },
    }),
  }),
});

export const { red: longWhiskerLoyaltyRed } = longWhiskerLoyalty.cards;
