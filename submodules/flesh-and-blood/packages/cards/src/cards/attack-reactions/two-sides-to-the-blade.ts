import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/two-sides-to-the-blade.generated.ts";

export const twoSidesToTheBlade = definePitchFamily(fabPitchFamilies["two-sides-to-the-blade"], {
  abilities: () => ({
    chooseDaggerOrStealthMode: modalAbility({
      kind: "modal",
      modal: {
        choose: 1,
      },
      modes: {
        boostDagger: {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
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
        boostStealthAndMarkOnHit: {
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
                  selector: "object",
                  declared: "on-stack",
                  zones: ["combat-chain"],
                  filter: attackActionFilter({ hasKeyword: "stealth" }),
                  count: 1,
                },
                duration: "this-turn",
                outputBinding: "it",
              },
              {
                type: "grant-property",
                property: {
                  kind: "ability",
                  ability: {
                    kind: "static",
                    staticKind: "triggered",
                    id: "markHeroOnHit",
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
                        type: "mark",
                        target: {
                          selector: "attack-target",
                        },
                      },
                    },
                  },
                },
                target: { selector: "binding", binding: "it" },
                duration: "this-turn",
              },
            ],
            outputBinding: "it",
          },
        },
      },
    }),
  }),
});

export const { red: twoSidesToTheBladeRed } = twoSidesToTheBlade.cards;
