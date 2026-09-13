import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/meganetic-protocol.generated.ts";

export const meganeticProtocol = definePitchFamily(fabPitchFamilies["meganetic-protocol"], {
  abilities: () => ({
    defendingMustDefendXEquipment1DefenseCountersAbleWhereXNumberEvosEquipped: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "require",
        action: "defend",
        filter: {
          typeBox: {
            types: ["Equipment"],
          },
          hasCounter: "-1{d}",
        },
        limit: {
          count: {
            type: "count",
            what: "evos-equipped",
          },
        },
        duration: "this-combat-chain",
      },
      label: {
        name: "evo-upgrade",
      },
    },
  }),
});

export const { blue: meganeticProtocolBlue } = meganeticProtocol.cards;
