import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/the-librarian-magister-of-history.generated.ts";

export const theLibrarianMagisterOfHistory = defineCard(
  fabCardIdentitiesByCanonicalId["MkgbKjT77G7hCnBdpdqKH"],
  {
    keywords: [goAgain],
    abilities: {
      tomeNameAnyClassTalentDeck: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "allow",
          action: "have-in-deck",
          filter: {
            hasStatus: "deckbuilding-exception",
          },
          duration: "permanent",
        },
      },
      actionTapRevealTomeNameInventoryPutHandAnotherTargetGets1IntellectEndNextTurnGoAgain: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "effect",
              type: "tap-self",
            },
            {
              class: "effect",
              type: "reveal",
              from: "inventory",
              filter: {
                moniker: "Tome",
              },
              count: 1,
            },
          ],
        },
        layerKeywords: [goAgain],
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "binding",
                binding: "revealed-this-way",
              },
              to: {
                zone: "hand",
              },
            },
            {
              type: "modify-numeric",
              property: "intellect",
              op: "add",
              amount: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "any",
                zones: ["hero"],
                filter: {
                  hasStatus: "another",
                },
                count: 1,
              },
              duration: "until-end-of-next-turn",
            },
          ],
        },
      },
    },
  },
);
