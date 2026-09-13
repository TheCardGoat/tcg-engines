import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/clip-flexor.generated.ts";

export const clipFlexor = defineCard(fabCardIdentitiesByCanonicalId["j8dKbzJP7kqP96rpMMLMJ"], {
  abilities: {
    defenseReactionDestroyMayAddAttackReactionFromHand: {
      kind: "activated",
      abilityType: "defense-reaction",
      cost: { class: "effect", type: "destroy-self" },
      effect: {
        type: "optional",
        effect: {
          type: "add-defending",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            filter: { typeBox: { types: ["Attack Reaction"] } },
            count: 1,
          },
        },
      },
    },
  },
});
