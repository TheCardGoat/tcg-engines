import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/timekeeper-s-whim.generated.ts";

export const timekeeperSWhim = definePitchFamily(fabPitchFamilies["timekeeper-s-whim"], {
  parameters: pitchMap({ red: { damage: 5 }, yellow: { damage: 4 }, blue: { damage: 3 } }),
  abilities: ({ damage }) => ({
    resolutionDealDamage: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: damage,
        target: {
          selector: "any-hero",
        },
      },
    },
    resolutionMove: {
      kind: "resolution",
      condition: {
        type: "turn-player",
        who: "opponent",
      },
      effect: {
        type: "move-card",
        target: {
          selector: "self",
        },
        to: {
          zone: "deck",
          position: "bottom",
        },
      },
    },
  }),
});

export const {
  red: timekeeperSWhimRed,
  yellow: timekeeperSWhimYellow,
  blue: timekeeperSWhimBlue,
} = timekeeperSWhim.cards;
