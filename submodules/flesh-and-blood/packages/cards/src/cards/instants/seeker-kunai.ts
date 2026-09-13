import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/seeker-kunai.generated.ts";

export const seekerKunai = definePitchFamily(fabPitchFamilies["seeker-kunai"], {
  abilities: () => ({
    attackReactionDestroyTargetAssassinAttackActionGets1: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              supertypes: ["Assassin"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
    atStartTurnMayDestroy2SilverControlIf: {
      kind: "static",
      staticKind: "triggered",
      functionalZones: ["graveyard"],
      trigger: {
        kind: "event-and-state",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "has-status",
          status: "in-your-graveyard",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                name: "Silver",
              },
              count: 2,
            },
          },
          then: {
            type: "move-card",
            target: {
              selector: "self",
            },
            to: {
              zone: "permanent",
            },
          },
        },
      },
    },
  }),
});

export const { red: seekerKunaiRed } = seekerKunai.cards;
