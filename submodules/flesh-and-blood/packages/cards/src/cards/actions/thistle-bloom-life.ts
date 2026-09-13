import { defineSplitLayout } from "../../authoring/layouts.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/thistle-bloom-life.generated.ts";

export const thistleBloomLife = definePitchFamily(fabPitchFamilies["thistle-bloom-life"], {
  layouts: {
    yellow: defineSplitLayout(fabCardIdentitiesByCanonicalId.MLzWh7MWcDdN8wnwQWwMN, {
      left: {
        name: "Thistle Bloom",
        typeText: "Runeblade Action",
        types: ["Runeblade", "Action"],
        traits: [],
        text: "",
        keywords: [
          {
            name: "meld",
          },
        ],
        abilities: [
          {
            id: "createRunechantsForLifeGained",
            text: "",
            kind: "resolution",
            effect: {
              type: "create-token",
              token: "runechant",
              controller: "controller",
              count: {
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
        types: ["Earth", "Instant"],
        traits: [],
        text: "",
        keywords: [],
        abilities: [
          {
            id: "gain1Life",
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

export const { yellow: thistleBloomLifeYellow } = thistleBloomLife.cards;
