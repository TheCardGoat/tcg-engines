import { attackActionFilter, nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/leech-memory.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const leechMemory = definePitchFamily(fabPitchFamilies["leech-memory"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackActionPlayTurnGets3PowerWheneverDealsDamagePutAttackActionGraveyardBottomDeck: {
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
                id: "wheneverDealsDamagePutAttackActionGraveyardBottomDeck",
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
                    type: "optional",
                    effect: {
                      type: "move-card",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "controller",
                        zones: ["graveyard"],
                        filter: attackActionFilter(),
                        count: 1,
                      },
                      to: {
                        zone: "deck",
                        position: "bottom",
                      },
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

export const { red: leechMemoryRed } = leechMemory.cards;
