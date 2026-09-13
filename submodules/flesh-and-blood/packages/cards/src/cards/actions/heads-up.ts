import { grantKeyword, plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/heads-up.generated.ts";
import { dominate, goAgain } from "../shared/keywords.ts";

export const headsUp = definePitchFamily(fabPitchFamilies["heads-up"], {
  keywords: [goAgain],
  abilities: () => ({
    sequenceGrantPropertyTriggeredAttackCompareAmountCountThisChainLinkThisTurn: {
      type: "sequence",
      steps: [
        plusPower(3, {
          appliesTo: { next: { typeBox: { subtypes: ["Sword"] } }, events: ["attack", "activate"] },
        }),
        {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "triggeredAttackCompareAmountCountThisChainLink",
              text: "",
              trigger: {
                kind: "event-and-state",
                event: {
                  name: "attack",
                  actor: { kind: "player", player: "ability-controller" },
                  observes: { kind: "source", selector: "attack" },
                },
                state: {
                  type: "compare-amount",
                  amount: { type: "count", what: "times-it-has-wagered" },
                  comparison: { op: "gte", value: 1 },
                },
              },
              resolution: {
                kind: "effect",
                effect: grantKeyword(dominate, {
                  target: { selector: "self" },
                  duration: "this-chain-link",
                }),
              },
            },
          },
          duration: "this-turn",
          appliesTo: { next: { typeBox: { subtypes: ["Sword"] } }, events: ["attack", "activate"] },
        },
      ],
    },
  }),
});

export const { red: headsUpRed } = headsUp.cards;
