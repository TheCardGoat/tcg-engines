import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cleave.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const cleave = definePitchFamily(fabPitchFamilies["cleave"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAxeAttackTurnGains4WhenHitsHero: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 4,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Axe"],
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
                id: "whenHitsHeroAllyMayDealMuchDamageAnother",
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
                      kind: "any",
                    },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "optional",
                    effect: {
                      type: "deal-damage",
                      damageType: "generic",
                      amount: {
                        type: "trigger-event-damage",
                      },
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "any",
                        zones: ["permanent"],
                        relation: { kind: "other-ally-controlled-by-hit-target" },
                        count: 1,
                      },
                    },
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
                  subtypes: ["Axe"],
                },
              },
            },
          },
        ],
      },
    },
  }),
});
export const { red: cleaveRed } = cleave.cards;
