import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/anthem-of-spring.generated.ts";

import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const anthemOfSpring = definePitchFamily(fabPitchFamilies["anthem-of-spring"], {
  keywords: [
    {
      name: "specialization",
      hero: "Briar",
    },
    goAgain,
  ],
  abilities: () => ({
    nextAttackActionPlayTurnGets1GoAgain: {
      kind: "resolution",
      layerKeywords: [goAgain],
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch(),
      },
    },
    whenDefendsTogetherFromHandCreateEmbodimentEarthToken: {
      kind: "static",
      staticKind: "triggered",
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
          cohort: {
            kind: "together-with",
            filter: {
              playedFromZones: ["hand"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "embodiment-of-earth",
          creator: "effect-controller",
          controller: "any",
        },
      },
      label: {
        name: "unity",
      },
    },
  }),
});
export const { blue: anthemOfSpringBlue } = anthemOfSpring.cards;
