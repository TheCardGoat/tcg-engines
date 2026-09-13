import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/territorial-domain.generated.ts";

export const territorialDomain = definePitchFamily(fabPitchFamilies["territorial-domain"], {
  abilities: () => ({
    gainDefenseAfterCrouchingTiger: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "defending",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "performed-this-turn",
          event: "create-crouching-tiger",
          player: "controller",
        },
        then: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 3,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const { blue: territorialDomainBlue } = territorialDomain.cards;
