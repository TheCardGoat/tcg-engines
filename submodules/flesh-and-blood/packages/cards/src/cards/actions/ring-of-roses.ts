import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ring-of-roses.generated.ts";

export const ringOfRoses = definePitchFamily(fabPitchFamilies["ring-of-roses"], {
  keywords: [
    legendary,
    {
      name: "specialization",
      hero: "Verdance",
    },
  ],
  abilities: () => ({
    firstTimeDealArcaneDamageTurnGain1Life: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "deal-damage",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
          damageType: "arcane",
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
      limit: {
        count: 1,
        per: "turn",
        ordinals: [1],
      },
    },
  }),
});

export const { yellow: ringOfRosesYellow } = ringOfRoses.cards;
