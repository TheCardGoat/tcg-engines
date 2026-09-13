import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/leave-a-dent.generated.ts";

export const leaveADent = definePitchFamily(fabPitchFamilies["leave-a-dent"], {
  abilities: () => ({
    nextGuardianAttackTurnGetsCrushDeals4MoreDamageDestroyTop4Deck: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: crushAbility({
            id: "deals4MoreDamageDestroyTop4Deck",
            effect: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["deck"],
                position: "top",
                count: 4,
              },
            },
          }),
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Guardian"],
            },
          },
        },
      },
    },
  }),
});

export const { blue: leaveADentBlue } = leaveADent.cards;
