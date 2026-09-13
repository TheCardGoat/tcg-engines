import { defineSplitLayout } from "../../authoring/layouts.ts";
import { expandSemanticAbilities } from "../../authoring/card.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/arcane-seeds-life.generated.ts";

export const arcaneSeedsLife = definePitchFamily(fabPitchFamilies["arcane-seeds-life"], {
  layouts: {
    red: defineSplitLayout(fabCardIdentitiesByCanonicalId["f8bDMcqJ78QTCBznWpwwN"], {
      left: {
        name: "Arcane Seeds",
        typeText: "Runeblade Action",
        types: ["Runeblade", "Action"],
        traits: [],
        text: "",
        keywords: [
          {
            name: "meld",
          },
          {
            name: "go-again",
          },
        ],
        abilities: expandSemanticAbilities(
          fabCardIdentitiesByCanonicalId["f8bDMcqJ78QTCBznWpwwN"].canonicalId,
          {
            createTwoRunechantTokens: {
              kind: "resolution",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "create-token",
                    token: "runechant",
                    controller: "controller",
                  },
                  {
                    type: "create-token",
                    token: "runechant",
                    controller: "controller",
                  },
                ],
              },
            },
          },
        ),
      },
      right: {
        name: "Life",
        typeText: "Earth Instant",
        types: ["Earth", "Instant"],
        traits: [],
        text: "",
        keywords: [],
        abilities: expandSemanticAbilities(
          fabCardIdentitiesByCanonicalId["f8bDMcqJ78QTCBznWpwwN"].canonicalId,
          {
            gainOneLife: {
              kind: "resolution",
              effect: {
                type: "gain-life",
                amount: 1,
                target: {
                  selector: "controller",
                },
              },
            },
          },
        ),
      },
    }),
  },
});
export const { red: arcaneSeedsLifeRed } = arcaneSeedsLife.cards;
