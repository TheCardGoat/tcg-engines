import { goAgain, legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pulse-of-candlehold.generated.ts";

export const pulseOfCandlehold = definePitchFamily(fabPitchFamilies["pulse-of-candlehold"], {
  keywords: [legendary, goAgain],
  abilities: () => ({
    putUp2TargetEarthLightningElementalActionGraveyardTopDeckBanishPulseCandlehold: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                or: [
                  { typeBox: { types: ["Action"], supertypes: ["Earth"] } },
                  { typeBox: { types: ["Action"], supertypes: ["Lightning"] } },
                  { typeBox: { types: ["Action"], supertypes: ["Elemental"] } },
                ],
              },
              count: { type: "up-to", amount: 2 },
            },
            to: {
              zone: "deck",
              position: "top",
            },
          },
          {
            type: "banish",
            target: {
              selector: "self",
            },
          },
        ],
      },
    },
  }),
});

export const { yellow: pulseOfCandleholdYellow } = pulseOfCandlehold.cards;
