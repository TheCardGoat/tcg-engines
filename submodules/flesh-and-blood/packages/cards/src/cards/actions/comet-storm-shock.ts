import { defineSplitLayout } from "../../authoring/layouts.ts";
import { expandSemanticAbilities } from "../../authoring/card.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/comet-storm-shock.generated.ts";

export const cometStormShock = definePitchFamily(fabPitchFamilies["comet-storm-shock"], {
  layouts: {
    red: defineSplitLayout(fabCardIdentitiesByCanonicalId["hNtpt77b8dGgTbkCqzCLB"], {
      left: {
        name: "Comet Storm",
        typeText: "Wizard Action",
        types: ["Wizard", "Action"],
        traits: [],
        text: "",
        keywords: [
          {
            name: "meld",
          },
        ],
        abilities: expandSemanticAbilities(
          fabCardIdentitiesByCanonicalId["hNtpt77b8dGgTbkCqzCLB"].canonicalId,
          {
            dealFiveArcaneDamage: {
              kind: "resolution",
              effect: {
                type: "deal-damage",
                damageType: "arcane",
                amount: 5,
                target: {
                  selector: "object",
                  declared: "on-stack",
                  player: "any",
                  zones: ["hero", "permanent"],
                  count: 1,
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
          fabCardIdentitiesByCanonicalId["hNtpt77b8dGgTbkCqzCLB"].canonicalId,
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
                  player: "any",
                  zones: ["hero", "permanent"],
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
export const { red: cometStormShockRed } = cometStormShock.cards;
