import { semanticModalAbility } from "../../authoring/card.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/life-of-the-party.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const lifeOfTheParty = definePitchFamily(fabPitchFamilies["life-of-the-party"], {
  abilities: () => ({
    playAlternativeDiscardCrazyBrewDestroyCrazyBrew: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "alternative-cost",
        cost: {
          class: "mixed",
          type: "alternative",
          costs: [
            {
              class: "effect",
              type: "discard",
              count: 1,
              filter: {
                name: "Crazy Brew",
              },
            },
            {
              class: "effect",
              type: "destroy",
              filter: {
                name: "Crazy Brew",
              },
              count: 1,
            },
          ],
        },
        optional: true,
      },
    },
    conditionalHasStatusAlternativeCostPaidAllGrantPropertyTriggeredHitGainLifePermanentModifyNumericPowerThisTurnGrant:
      semanticModalAbility({
        kind: "modal",
        modal: {
          choose: {
            type: "conditional",
            condition: {
              type: "has-status",
              status: "alternative-cost-paid",
            },
            then: {
              type: "all",
            },
            else: 1,
          },
          random: true,
        },
        modes: {
          grantPropertyTriggeredHitGainLifePermanent: {
            kind: "resolution",
            effect: {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "triggeredHitGainLife",
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
                    },
                  },
                  resolution: {
                    kind: "effect",
                    effect: {
                      type: "gain-life",
                      amount: 2,
                      target: {
                        selector: "controller",
                      },
                    },
                  },
                },
              },
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          },
          modifyNumericPowerThisTurn: {
            kind: "resolution",
            effect: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 2,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          },
          grantPropertyThisTurn: {
            kind: "resolution",
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
      }),
  }),
});

export const {
  red: lifeOfThePartyRed,
  yellow: lifeOfThePartyYellow,
  blue: lifeOfThePartyBlue,
} = lifeOfTheParty.cards;
