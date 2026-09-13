import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/crowd-roars-fight.generated.ts";

export const crowdRoarsFight = defineCard(fabCardIdentitiesByCanonicalId.Fj6DCwFDczkFfd7dtnd9J, {
  abilities: {
    empowerNextAttack: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "sequence",
        steps: [
          {
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
          {
            type: "rule-modification",
            mode: "allow",
            action: "attack-target",
            target: "any-opposing-hero",
            duration: "this-turn",
          },
        ],
      },
    },
  },
});
