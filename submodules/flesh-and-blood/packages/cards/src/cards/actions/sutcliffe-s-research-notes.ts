import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sutcliffe-s-research-notes.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const sutcliffeSResearchNotes = definePitchFamily(
  fabPitchFamilies["sutcliffe-s-research-notes"],
  {
    parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
    keywords: [goAgain],
    abilities: (count) => ({
      resolutionSequence: {
        kind: "resolution",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count,
              },
              outputBinding: "them",
            },
            {
              type: "create-token",
              token: "runechant",
              controller: "controller",
              count: {
                type: "count",
                what: "revealed-this-way",
                filter: {
                  and: [
                    {
                      typeBox: {
                        supertypes: ["Runeblade"],
                      },
                    },
                    {
                      typeBox: {
                        subtypes: ["Attack"],
                      },
                    },
                    {
                      typeBox: {},
                    },
                  ],
                },
              },
            },
            {
              type: "reorder-deck",
              target: {
                selector: "binding",
                binding: "them",
              },
              position: "top",
            },
          ],
        },
      },
    }),
  },
);

export const {
  red: sutcliffeSResearchNotesRed,
  yellow: sutcliffeSResearchNotesYellow,
  blue: sutcliffeSResearchNotesBlue,
} = sutcliffeSResearchNotes.cards;
