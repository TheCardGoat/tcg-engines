import { bladeBreak, spellvoid } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/third-eye-of-the-sphinx.generated.ts";

export const thirdEyeOfTheSphinx = defineCard(
  fabCardIdentitiesByCanonicalId["Cqk6dND8KnJ6gBjQNQjCq"],
  {
    keywords: [spellvoid(1), bladeBreak],
    abilities: {
      instantDestroyPonderTokenControlDraw: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            {
              class: "effect",
              type: "tap-self",
            },
            {
              class: "effect",
              type: "destroy",
              // Printed "a Ponder token you control" — catalog name is "Ponder"
              // (not "Ponder Token"); cost scans controller permanent zone.
              filter: {
                name: "Ponder",
              },
              count: 1,
            },
          ],
        },
        effect: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
  },
);
