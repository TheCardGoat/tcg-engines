import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/kayo-underhanded-cheat.generated.ts";

export const kayoUnderhandedCheat = defineCard(
  fabCardIdentitiesByCanonicalId["fMDbBJHTPL7dcMMFNkCCm"],
  {
    abilities: {
      startGame1WeaponZone: {
        kind: "static",
        staticKind: "meta",
        effect: {
          type: "start-game",
          setup: "zone-counts",
          zoneCounts: [
            {
              zone: "weapon",
              count: 1,
            },
          ],
        },
      },
      instantResourceResourceResourceResourceTapTargetAttackAction6BasePower: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 4,
            },
            {
              class: "effect",
              type: "tap-self",
            },
          ],
        },
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "set-base",
          amount: 6,
          target: {
            selector: "object",
            declared: "on-stack",
            player: "controller",
            zones: ["combat-chain"],
            filter: attackActionFilter(),
            count: 1,
          },
          duration: "this-turn",
        },
      },
      wheneverCrowdBoosCreateVigorToken: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "crowd-boos",
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
            type: "create-token",
            token: "vigor",
            controller: "controller",
          },
        },
      },
    },
  },
);
