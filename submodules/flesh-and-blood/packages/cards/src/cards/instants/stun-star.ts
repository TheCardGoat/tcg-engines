import { goAgain, legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/stun-star.generated.ts";

export const stunStar = definePitchFamily(fabPitchFamilies["stun-star"], {
  keywords: [legendary],
  abilities: () => ({
    actionDestroyWhenCombatChainClosesAttackGoAgain: {
      kind: "activated",
      abilityType: "attack",
      // Printed destroy is deferred ("destroy this when the combat chain
      // closes") — NOT a paid cost, which removed the Shuriken before the
      // attack could resolve. CIN002 shape: {r}, {t} cost + close-windowed
      // delayed-trigger destroy.
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
            type: "tap-self",
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "attack-with",
            target: {
              selector: "self",
            },
          },
          {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "combat-chain-close",
                actor: {
                  kind: "none",
                },
                observes: {
                  kind: "none",
                },
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
                target: {
                  selector: "self",
                },
              },
            },
          },
        ],
      },
    },
    whenHitsHeroThem: {
      kind: "static",
      staticKind: "triggered",
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
          type: "tap",
          target: {
            selector: "attack-target",
          },
        },
      },
    },
  }),
});

export const { blue: stunStarBlue } = stunStar.cards;
