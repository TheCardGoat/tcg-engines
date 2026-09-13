import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/celebrant-broadsword.generated.ts";

export const celebrantBroadsword = defineCard(
  fabCardIdentitiesByCanonicalId["qbdbnBmCBpqbT7pQtG868"],
  {
    abilities: {
      oncePerTurnActionResourceAttack: {
        kind: "activated",
        limit: { count: 1, per: "turn" },
        abilityType: "attack",
        cost: { class: "asset", type: "resources", amount: 1 },
        effect: { type: "attack-with", target: { selector: "self" } },
      },
      cheeredTurnAttacksGetGoAgain: {
        kind: "static",
        staticKind: "continuous",
        condition: { type: "performed-this-turn", event: "cheered", player: "controller" },
        effect: {
          type: "grant-property",
          property: { kind: "keyword", keyword: goAgain },
          target: { selector: "self" },
          duration: "while-in-arena",
        },
      },
    },
  },
);
