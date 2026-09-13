import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/deep-recesses-of-existence.generated.ts";

import { bloodDebt, runeGate } from "../shared/keywords.ts";

export const deepRecessesOfExistence = definePitchFamily(
  fabPitchFamilies["deep-recesses-of-existence"],
  {
    keywords: [runeGate, bloodDebt],
    abilities: () => ({
      whenCombatChainClosesMayBanishFaceDownIf: {
        kind: "static",
        staticKind: "triggered",
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
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "banish",
              target: {
                selector: "self",
              },
              faceDown: true,
            },
            then: {
              type: "for-each",
              target: {
                selector: "each-hero",
              },
              effect: {
                type: "conditional",
                condition: {
                  type: "performed-this-turn",
                  event: "lose-life",
                  player: "iteration-subject",
                },
                then: {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    zones: ["graveyard"],
                    count: 1,
                  },
                },
              },
            },
          },
        },
      },
    }),
  },
);
export const { blue: deepRecessesOfExistenceBlue } = deepRecessesOfExistence.cards;
