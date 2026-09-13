import { defineSplitLayout } from "../../authoring/layouts.ts";
import { expandSemanticAbilities } from "../../authoring/card.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/consign-to-cosmos-shock.generated.ts";

export const consignToCosmosShock = definePitchFamily(fabPitchFamilies["consign-to-cosmos-shock"], {
  layouts: {
    yellow: defineSplitLayout(fabCardIdentitiesByCanonicalId["LpGthTWGTT6KK6mg8dqrH"], {
      left: {
        name: "Consign to Cosmos",
        typeText: "Lightning Wizard Action",
        types: ["Lightning", "Wizard", "Action"],
        traits: [],
        text: "",
        keywords: [
          {
            name: "meld",
          },
        ],
        abilities: expandSemanticAbilities(
          fabCardIdentitiesByCanonicalId["LpGthTWGTT6KK6mg8dqrH"].canonicalId,
          {
            banishInstantsOrAurasFromGraveyards: {
              kind: "resolution",
              effect: {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  zones: ["graveyard"],
                  player: "any",
                  filter: {
                    or: [
                      {
                        typeBox: {
                          types: ["Instant"],
                        },
                      },
                      {
                        typeBox: {
                          subtypes: ["Aura"],
                        },
                      },
                    ],
                  },
                  count: {
                    type: "count",
                    what: "damage-dealt",
                    damageType: "arcane",
                    player: "controller",
                    per: "turn",
                  },
                },
              },
            },
          },
        ),
      },
      right: {
        name: "Shock",
        typeText: "Lightning Instant",
        types: ["Lightning", "Instant"],
        traits: [],
        text: "",
        keywords: [],
        abilities: expandSemanticAbilities(
          fabCardIdentitiesByCanonicalId["LpGthTWGTT6KK6mg8dqrH"].canonicalId,
          {
            dealOneArcaneDamage: {
              kind: "resolution",
              effect: {
                type: "deal-damage",
                damageType: "arcane",
                amount: 1,
                target: {
                  selector: "object",
                  declared: "on-stack",
                  zones: ["hero", "permanent"],
                  player: "any",
                  count: 1,
                },
              },
            },
          },
        ),
      },
    }),
  },
});
export const { yellow: consignToCosmosShockYellow } = consignToCosmosShock.cards;
