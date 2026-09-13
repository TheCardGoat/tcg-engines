import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/constella-uplift.generated.ts";

export const constellaUplift = definePitchFamily(fabPitchFamilies["constella-uplift"], {
  abilities: () => ({
    staffControl: {
      kind: "resolution",
      effect: {
        type: "untap",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Staff"],
            },
          },
          count: 1,
        },
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

export const { yellow: constellaUpliftYellow } = constellaUplift.cards;
