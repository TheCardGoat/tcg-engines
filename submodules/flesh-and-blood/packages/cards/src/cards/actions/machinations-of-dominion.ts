import { goAgain, overpower } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/machinations-of-dominion.generated.ts";

export const machinationsOfDominion = definePitchFamily(
  fabPitchFamilies["machinations-of-dominion"],
  {
    keywords: [goAgain],
    abilities: () => ({
      nextRunebladeAttackActionPlayTurnGetsOverpowerPlayedCreatedAuraTurnGetsGoAgain: {
        kind: "resolution",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: overpower,
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    supertypes: ["Runeblade"],
                    types: ["Action"],
                    subtypes: ["Attack"],
                  },
                },
              },
            },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  id: "playedCreatedAuraTurnGetsGoAgain",
                  text: "",
                  kind: "static",
                  staticKind: "continuous",
                  condition: {
                    type: "performed-this-turn",
                    event: "play-or-create-aura",
                    player: "controller",
                  },
                  effect: {
                    type: "grant-property",
                    property: {
                      kind: "keyword",
                      keyword: goAgain,
                    },
                    target: {
                      selector: "self",
                    },
                    duration: "this-turn",
                  },
                },
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    supertypes: ["Runeblade"],
                    types: ["Action"],
                    subtypes: ["Attack"],
                  },
                },
              },
            },
          ],
        },
      },
    }),
  },
);

export const { blue: machinationsOfDominionBlue } = machinationsOfDominion.cards;
