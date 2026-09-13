import { defineSplitLayout } from "../../authoring/layouts.ts";
import { expandSemanticAbilities } from "../../authoring/card.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/everbloom-life.generated.ts";

export const everbloomLife = definePitchFamily(fabPitchFamilies["everbloom-life"], {
  layouts: {
    blue: defineSplitLayout(fabCardIdentitiesByCanonicalId["nnQpNFFKqfMwJbRQ6brJ6"], {
      left: {
        name: "Everbloom",
        typeText: "Earth Action",
        types: ["Earth", "Action"],
        traits: [],
        text: "",
        keywords: [
          {
            name: "go-again",
          },
          {
            name: "meld",
          },
        ],
        abilities: expandSemanticAbilities(
          fabCardIdentitiesByCanonicalId["nnQpNFFKqfMwJbRQ6brJ6"].canonicalId,
          {
            returnAffordableActionToDeck: {
              kind: "resolution",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "choose-card",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      zones: ["graveyard"],
                      filter: {
                        typeBox: {
                          types: ["Action"],
                        },
                        numeric: [
                          {
                            property: "cost",
                            basis: "base",
                            comparison: {
                              op: "lt",
                              value: {
                                type: "count",
                                what: "life-gained-this-turn",
                              },
                            },
                          },
                        ],
                      },
                      count: 1,
                    },
                    outputBinding: "it",
                  },
                  {
                    type: "move-card",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    to: {
                      zone: "deck",
                      position: "bottom",
                    },
                  },
                ],
              },
            },
          },
        ),
      },
      right: {
        name: "Life",
        typeText: "Instant",
        types: ["Instant"],
        traits: [],
        text: "",
        keywords: [],
        abilities: expandSemanticAbilities(
          fabCardIdentitiesByCanonicalId["nnQpNFFKqfMwJbRQ6brJ6"].canonicalId,
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
export const { blue: everbloomLifeBlue } = everbloomLife.cards;
