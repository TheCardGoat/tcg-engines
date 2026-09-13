import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spirit-of-war.generated.ts";

export const spiritOfWar = definePitchFamily(fabPitchFamilies["spirit-of-war"], {
  abilities: () => ({
    asAdditionalCostPlayChargeHeroSSoul: {
      kind: "static",
      staticKind: "play",
      // CR 8.5.29 charge: optional additional cost declared with the play
      // command (procedures/play-card/charge.ts); the charge event's
      // chargedCard binding reaches this card's resolution conditions through
      // the play event's connectedPlayBindings merge.
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "charge",
        },
        optional: true,
      },
      label: {
        name: "charge",
      },
    },
    yellowChargedWayWheneverAttackActionHitsCombatChainCreateCourageToken: {
      kind: "resolution",
      // The ability-level condition reads the play-cost charge's chargedCard
      // binding (has-status yellow-charged-this-way fallback). The printed
      // "whenever … this combat chain" window is multi-fire for the combat
      // chain (AIO004 windowed/every pattern).
      condition: { type: "binding-matches", binding: "chargedCard", filter: { color: ["yellow"] } },
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: attackActionFilter(),
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-combat-chain",
          matching: "every",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "courage",
            controller: "controller",
          },
        },
      },
    },
  }),
});

export const { red: spiritOfWarRed } = spiritOfWar.cards;
