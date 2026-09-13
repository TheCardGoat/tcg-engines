import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/leech-renown.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const leechRenown = definePitchFamily(fabPitchFamilies["leech-renown"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackActionPlayTurnGets3PowerWheneverDealsDamageDestroyAuraToken: {
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
                id: "wheneverDealsDamageDestroyAuraToken",
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
                    type: "destroy",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["permanent"],
                      filter: {
                        typeBox: {
                          metatypes: ["Token"],
                          subtypes: ["Aura"],
                        },
                      },
                      count: 1,
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

export const { red: leechRenownRed } = leechRenown.cards;
