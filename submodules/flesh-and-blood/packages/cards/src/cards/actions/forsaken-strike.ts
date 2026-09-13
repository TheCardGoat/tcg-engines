import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { semanticModalAbility } from "../../authoring/card.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/forsaken-strike.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const forsakenStrike = definePitchFamily(fabPitchFamilies["forsaken-strike"], {
  abilities: () => ({
    zombies: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "effect",
              type: "destroy",
              count: { type: "up-to", amount: 3 },
              filter: { typeBox: { subtypes: ["Zombie"] } },
            },
            {
              class: "effect",
              type: "discard",
              count: { type: "up-to", amount: 3 },
              filter: { typeBox: { subtypes: ["Zombie"] } },
            },
          ],
        },
      },
    },
    rewards: semanticModalAbility({
      kind: "modal",
      modal: { choose: { type: "reference", binding: "objects-paid-for-cost" }, allowRepeat: true },
      modes: {
        gate: {
          kind: "resolution",
          effect: {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "forsakenStrikeWhenAttacksCreateGate",
                text: "",
                trigger: {
                  kind: "event",
                  event: {
                    name: "attack",
                    actor: { kind: "player", player: "ability-controller" },
                    observes: { kind: "source", selector: "attack" },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "create-token",
                    token: "gate-to-i-arathael",
                    controller: "controller",
                  },
                },
              },
            },
            target: { selector: "self" },
            duration: "this-combat-chain",
          },
        },
        power: {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: { selector: "self" },
            duration: "this-combat-chain",
          },
        },
        goAgain: {
          kind: "resolution",
          effect: {
            type: "grant-property",
            property: { kind: "keyword", keyword: goAgain },
            target: { selector: "self" },
            duration: "this-combat-chain",
          },
        },
      },
    }),
  }),
});
export const { yellow: forsakenStrikeYellow } = forsakenStrike.cards;
