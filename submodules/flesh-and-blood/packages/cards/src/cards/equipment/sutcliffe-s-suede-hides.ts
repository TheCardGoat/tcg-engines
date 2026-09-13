import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/sutcliffe-s-suede-hides.generated.ts";

export const sutcliffeSSuedeHides = defineCard(
  fabCardIdentitiesByCanonicalId["nMfgFcrcDq7KRfmMzrrh8"],
  {
    abilities: {
      attackReactionDestroyTargetAttackActionGetsGoAgain: {
        kind: "activated",
        abilityType: "attack-reaction",
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
              type: "destroy-self",
            },
          ],
        },
        condition: {
          type: "performed-this-turn",
          event: "play-non-attack-action",
          player: "controller",
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: attackActionFilter(),
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
      },
    },
  },
);
