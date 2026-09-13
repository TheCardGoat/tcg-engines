import { plusPower } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/demi-heroes/arakni-orb-weaver.generated.ts";

export const arakniOrbWeaver = defineCard(fabCardIdentitiesByCanonicalId.hJDM6fWpRRf6jLqrW8KRr, {
  abilities: {
    reduceGrapheneCheliceraeCost: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-activation-cost",
        op: "subtract",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["weapon"],
          filter: {
            name: "Graphene Chelicera",
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
    equipCheliceraAndEmpowerStealth: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard",
        count: 1,
        filter: {
          typeBox: {
            supertypes: ["Assassin"],
          },
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "graphene-chelicera",
            controller: "controller",
            outputBinding: "created-chelicera",
          },
          {
            type: "equip",
            target: {
              selector: "binding",
              binding: "created-chelicera",
            },
          },
          plusPower(3, {
            appliesTo: {
              next: { hasKeyword: "stealth" },
              events: ["play", "attack"],
            },
          }),
        ],
      },
    },
    returnToBrood: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "return-to-brood" },
      },
    },
  },
});
