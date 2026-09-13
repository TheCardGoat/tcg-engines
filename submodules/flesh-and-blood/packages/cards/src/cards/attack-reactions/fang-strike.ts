import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/attack-reactions/fang-strike.generated.ts";
import { ephemeral } from "../shared/keywords.ts";

export const fangStrike = defineCard(fabCardIdentitiesByCanonicalId.QqDQKkgCz9TM6HDgFkqcL, {
  keywords: [ephemeral],
  abilities: {
    boostAttackAction: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
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
});
