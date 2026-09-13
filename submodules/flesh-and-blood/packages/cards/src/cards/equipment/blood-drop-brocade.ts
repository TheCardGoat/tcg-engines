import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/blood-drop-brocade.generated.ts";

export const bloodDropBrocade = defineCard(
  fabCardIdentitiesByCanonicalId["JfBCWJdFBcrnhdkjRj6tz"],
  {
    abilities: {
      instantDestroyBloodDropBrocadeGainActivateAbilityOnly: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        condition: { type: "performed-this-turn", event: "physical-damage", player: "controller" },
        effect: {
          type: "gain-resources",
          amount: 1,
        },
      },
    },
  },
);
