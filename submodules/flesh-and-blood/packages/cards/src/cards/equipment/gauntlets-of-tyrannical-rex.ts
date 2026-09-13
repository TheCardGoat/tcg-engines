import { goAgain, temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/gauntlets-of-tyrannical-rex.generated.ts";

export const gauntletsOfTyrannicalRex = defineCard(
  fabCardIdentitiesByCanonicalId["pFdwP78gRGn89wqbB9prr"],
  {
    keywords: [temper],
    abilities: {
      actionNextAttackTurnGets1ActivateOnlyIf: {
        kind: "activated",
        abilityType: "action",
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
          ],
        },
        condition: {
          type: "pitch-zone-has",
          filter: {
            power: {
              op: "gte",
              value: 6,
            },
          },
        },
        layerKeywords: [goAgain],
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
          },
        },
      },
    },
  },
);
