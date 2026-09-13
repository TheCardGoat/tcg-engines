import { boost, dominate } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/high-speed-impact.generated.ts";

export const highSpeedImpact = definePitchFamily(fabPitchFamilies["high-speed-impact"], {
  keywords: [boost],
  abilities: () => ({
    triggeredHitGrantPropertyThisCombatChain: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: dominate,
          },
          target: {
            selector: "this-attack",
          },
          duration: "this-combat-chain",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
              hasStatus: "boosted",
            },
          },
        },
      },
    },
  }),
});

export const {
  red: highSpeedImpactRed,
  yellow: highSpeedImpactYellow,
  blue: highSpeedImpactBlue,
} = highSpeedImpact.cards;
