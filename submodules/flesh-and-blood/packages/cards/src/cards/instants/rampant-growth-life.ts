import { defineSplitLayout } from "../../authoring/layouts.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/instants/rampant-growth-life.generated.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/rampant-growth-life.generated.ts";

export const rampantGrowthLife = definePitchFamily(fabPitchFamilies["rampant-growth-life"], {
  layouts: {
    yellow: defineSplitLayout(fabCardIdentitiesByCanonicalId["8CTr7nqzhbgDkPtb8WpCN"], {
      left: {
        name: "Rampant Growth",
        typeText: "Wizard Instant",
        types: ["Wizard", "Instant"],
        traits: [],
        text: "",
        keywords: [
          {
            name: "meld",
          },
        ],
        abilities: [
          {
            id: "ampXWhereXIsTotalVeGainedTurn",
            text: "",
            kind: "resolution",
            effect: {
              type: "amp",
              amount: {
                type: "count",
                what: "life-gained-this-turn",
              },
            },
          },
        ],
      },
      right: {
        name: "Life",
        typeText: "Earth Instant",
        types: ["Instant", "Earth"],
        traits: [],
        text: "",
        keywords: [],
        abilities: [
          {
            id: "gain1",
            text: "",
            kind: "resolution",
            effect: {
              type: "gain-life",
              amount: 1,
              target: {
                selector: "controller",
              },
            },
          },
        ],
      },
    }),
  },
});

export const { yellow: rampantGrowthLifeYellow } = rampantGrowthLife.cards;
