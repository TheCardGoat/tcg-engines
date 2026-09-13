import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/attack-reactions/slither.generated.ts";
import { ephemeral, goAgain } from "../shared/keywords.ts";

export const slither = defineCard(fabCardIdentitiesByCanonicalId.zBDwTqgQTKrNRwjQmMr9g, {
  keywords: [ephemeral],
  abilities: {
    grantGoAgain: {
      kind: "resolution",
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
});
