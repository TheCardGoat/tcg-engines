import { arcaneBarrier, bloodDebt } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/grimoire-of-the-haunt.generated.ts";

export const grimoireOfTheHaunt = defineCard(
  fabCardIdentitiesByCanonicalId["bpcWc9DJf9pzfBczMWczJ"],
  {
    keywords: [bloodDebt, arcaneBarrier(1)],
    abilities: {
      instantBanishCreateEloquenceToken: {
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
              type: "banish",
              from: "arena",
              count: 1,
            },
          ],
        },
        effect: {
          type: "create-token",
          token: "eloquence",
          controller: "controller",
        },
      },
    },
  },
);
