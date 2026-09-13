import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/constella-flowslide.generated.ts";

export const constellaFlowslide = definePitchFamily(fabPitchFamilies["constella-flowslide"], {
  abilities: () => ({
    createLightningFlowToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "lightning-flow",
        controller: "controller",
      },
    },
    ifInstantHasBeenPutIntoGraveyardTurnDeal: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "graveyard",
        player: "controller",
        filter: {
          typeBox: {
            types: ["Instant"],
          },
        },
        comparison: {
          op: "gte",
          value: 1,
        },
        per: "turn",
      },
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 1,
        target: {
          selector: "any-hero",
        },
      },
      label: {
        name: "starfall",
      },
    },
  }),
});

export const { yellow: constellaFlowslideYellow } = constellaFlowslide.cards;
