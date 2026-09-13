import { goAgain, legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/wind-slicer.generated.ts";

export const windSlicer = definePitchFamily(fabPitchFamilies["wind-slicer"], {
  keywords: [legendary],
  abilities: () => ({
    actionDestroyWhenCombatChainClosesAttackGoAgain: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          { class: "asset", type: "resources", amount: 1 },
          { class: "effect", type: "tap-self" },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "attack-with",
            target: { selector: "self" },
          },
          {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "combat-chain-close",
                actor: { kind: "none" },
                observes: { kind: "none" },
              },
            },
            policy: {
              kind: "windowed",
              duration: "this-combat-chain",
              matching: "first",
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "destroy",
                target: { selector: "self" },
              },
            },
          },
        ],
      },
    },
    whenHitsHeroTheyLoseHeroAbilities: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
          target: { kind: "hero" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "rule-modification",
          mode: "restrict",
          action: "lose-abilities",
          filter: { typeBox: { types: ["Hero"] } },
          subject: { selector: "attack-target" },
          duration: "during-their-next-action-phase",
        },
      },
    },
  }),
});

export const { blue: windSlicerBlue } = windSlicer.cards;
