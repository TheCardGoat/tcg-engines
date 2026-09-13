import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/daily-grind.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

export const dailyGrind = definePitchFamily(fabPitchFamilies["daily-grind"], {
  abilities: () => ({
    attackActionControlGetWhenDefendsClashAttackingHero: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenDefendsClashAttackingHeroWinnerDestroysTopOther",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "defend",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "source",
                  selector: "defender",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "clash",
                with: {
                  selector: "attacking-hero",
                },
                prize: {
                  type: "destroy",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "opponent",
                    zones: ["deck"],
                    position: "top",
                    count: 1,
                  },
                },
              },
            },
          },
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["stack", "combat-chain"],
          filter: attackActionFilter(),
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
    atStartTurnDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
  }),
});
export const { blue: dailyGrindBlue } = dailyGrind.cards;
