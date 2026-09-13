import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/red-alert-boots.generated.ts";

export const redAlertBoots = defineCard(fabCardIdentitiesByCanonicalId["kcj8HPFjdMwbgFTNw7GmJ"], {
  keywords: [bladeBreak],
  abilities: {
    ifAttackReactionHasBeenPlayedActivatedChainLink: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "attack-reaction-played-or-activated-this-chain-link",
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  },
});
