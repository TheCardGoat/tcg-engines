import { attackActionFilter, nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/premeditate.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const premeditate = definePitchFamily(fabPitchFamilies["premeditate"], {
  keywords: [goAgain],
  abilities: () => ({
    nextTimeAttackActionHitsTurnCreatePonderToken: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: attackActionFilter(),
            },
            target: {
              kind: "hero",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "ponder",
            controller: "controller",
          },
        },
      },
    },
    nextAttackActionPlayArsenalTurnGains3Power: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch({ playedFromZones: ["arsenal"] }),
      },
    },
  }),
});

export const { red: premeditateRed } = premeditate.cards;
