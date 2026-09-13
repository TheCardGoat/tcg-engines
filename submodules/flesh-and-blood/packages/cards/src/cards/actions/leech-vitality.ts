import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/leech-vitality.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const leechVitality = definePitchFamily(fabPitchFamilies["leech-vitality"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackActionPlayTurnGets3PowerWheneverDealsDamageGain1Life: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: nextAttackActionLatch(),
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "wheneverDealsDamageGain1Life",
                text: "",
                trigger: {
                  kind: "event",
                  event: {
                    name: "dealt-damage",
                    actor: {
                      kind: "any",
                    },
                    observes: {
                      kind: "none",
                    },
                    target: {
                      kind: "hero",
                    },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "gain-life",
                    amount: 1,
                    target: {
                      selector: "controller",
                    },
                  },
                },
              },
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: nextAttackActionLatch(),
          },
        ],
      },
    },
  }),
});

export const { red: leechVitalityRed } = leechVitality.cards;
