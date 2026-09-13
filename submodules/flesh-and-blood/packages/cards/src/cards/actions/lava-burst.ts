import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lava-burst.generated.ts";

/** Model notes (hand-authored): Rupture +3{p} as chain link 4+; status marker is engine-backed. */
export const lavaBurst = definePitchFamily(fabPitchFamilies["lava-burst"], {
  abilities: () => ({
    lavaBurstPlayedChainLink4Higher3Power: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "played-at-chain-link-4-or-higher",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
      label: {
        name: "rupture",
      },
    },
  }),
});

export const { red: lavaBurstRed } = lavaBurst.cards;
