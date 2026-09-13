import { grantKeyword } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/dr-mortimer.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const drMortimer = defineCard(fabCardIdentitiesByCanonicalId["KRkW9KqmRwRPQW8LGTKRK"], {
  abilities: {
    instantTapCureDiseaseOpponentControlsCreateSilverToken: {
      kind: "activated",
      abilityType: "instant",
      cost: { class: "effect", type: "tap-self" },
      effect: {
        type: "if-you-do",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["permanent"],
            filter: { typeBox: { subtypes: ["Disease"] } },
            count: 1,
          },
        },
        then: { type: "create-token", token: "silver", controller: "controller" },
      },
    },
    attackReactionTapDestroy2SilverTargetAssassinAttackGetsGoAgain: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          { class: "effect", type: "tap-self" },
          {
            class: "effect",
            type: "destroy",
            filter: { name: "Silver", typeBox: { metatypes: ["Token"] } },
            count: 2,
          },
        ],
      },
      effect: grantKeyword(goAgain, {
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["combat-chain"],
          filter: { typeBox: { supertypes: ["Assassin"] }, hasStatus: "attacking" },
          count: 1,
        },
        duration: "this-chain-link",
      }),
    },
  },
});
