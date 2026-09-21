import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { expandSemanticAbilities } from "../../authoring/card.ts";
import { defineSplitLayout } from "../../authoring/layouts.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/regrowth-shock.generated.ts";

import { goAgain } from "../shared/keywords.ts";

const regrowthShockIdentity = fabPitchFamilies["regrowth-shock"].variants.blue;
const regrowthAbilities = expandSemanticAbilities(regrowthShockIdentity.canonicalId, {
  recoverAttackAction: {
    kind: "resolution",
    layerKeywords: [goAgain],
    effect: {
      type: "move-card",
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones: ["graveyard"],
        filter: attackActionFilter({
          numeric: [
            {
              property: "cost",
              basis: "base",
              comparison: {
                op: "lt",
                value: {
                  type: "count",
                  what: "damage-dealt",
                  recipient: "opposing-heroes",
                  damageType: "arcane",
                  per: "turn",
                },
              },
            },
          ],
        }),
        count: 1,
      },
      to: { zone: "hand" },
    },
  },
});
const shockAbilities = expandSemanticAbilities(regrowthShockIdentity.canonicalId, {
  dealArcaneDamage: {
    kind: "resolution",
    effect: {
      type: "deal-damage",
      damageType: "arcane",
      amount: 1,
      target: {
        selector: "object",
        declared: "on-stack",
        player: "any",
        zones: ["hero", "permanent"],
        count: 1,
      },
    },
  },
});

export const regrowthShock = definePitchFamily(fabPitchFamilies["regrowth-shock"], {
  layouts: {
    blue: defineSplitLayout(regrowthShockIdentity, {
      left: {
        name: "Regrowth",
        typeText: "Earth Runeblade Action",
        types: ["Earth", "Runeblade", "Action"],
        traits: [],
        text: "",
        keywords: [
          {
            name: "meld",
          },
        ],
        abilities: regrowthAbilities,
      },
      right: {
        name: "Shock",
        typeText: "Lightning Instant",
        types: ["Lightning", "Instant"],
        traits: [],
        text: "",
        keywords: [],
        abilities: shockAbilities,
      },
    }),
  },
});

export const { blue: regrowthShockBlue } = regrowthShock.cards;
