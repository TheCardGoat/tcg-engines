import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/kavdaen-trader-of-skins.generated.ts";

export const kavdaenTraderOfSkins = defineCard(
  fabCardIdentitiesByCanonicalId["rgq8FqBMdhn9khbwjDK6Q"],
  {
    abilities: {
      oncePerTurnActionResourceResourceResourceMoreLifeThanAllOtherHerosLose1LifeCreateCopperTokenThenLessLifeThanAllOtherHerosGain1LifeGoAgain:
        {
          kind: "activated",
          limit: {
            count: 1,
            per: "turn",
          },
          abilityType: "action",
          cost: {
            class: "asset",
            type: "resources",
            amount: 3,
          },
          layerKeywords: [goAgain],
          effect: {
            type: "sequence",
            steps: [
              // Bind the unique highest hero once, then both effects use controller.
              // Ties → empty for-each → no-op.
              {
                type: "for-each",
                target: { selector: "highest-life-hero" },
                effect: {
                  type: "sequence",
                  steps: [
                    {
                      type: "lose-life",
                      amount: 1,
                      target: { selector: "iteration-subject" },
                    },
                    {
                      type: "create-token",
                      token: "copper",
                      controller: "iteration-subject",
                    },
                  ],
                },
              },
              // Then re-resolve unique lowest after the highest clause (sequence preview).
              {
                type: "for-each",
                target: { selector: "lowest-life-hero" },
                effect: {
                  type: "gain-life",
                  amount: 1,
                  target: { selector: "iteration-subject" },
                },
              },
            ],
          },
        },
    },
  },
);
