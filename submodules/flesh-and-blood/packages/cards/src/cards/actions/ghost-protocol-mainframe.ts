import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/ghost-protocol-mainframe.generated.ts";

export const ghostProtocolMainframe = definePitchFamily(
  fabPitchFamilies["ghost-protocol-mainframe"],
  {
    abilities: () => ({
      ifWasBanishedFromBoostingTurnMayPlayFrom: {
        kind: "static",
        staticKind: "play",
        condition: {
          type: "performed-this-turn",
          event: "banish-from-boost",
          player: "controller",
        },
        playEffect: {
          role: "permission",
          fromZones: ["banished"],
          optional: true,
        },
      },
      gets1EachEvoHaveEquipped: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: {
            type: "count",
            what: "equipped-objects",
            player: "controller",
            filter: {
              typeBox: {
                subtypes: ["Evo"],
              },
            },
          },
          target: {
            selector: "self",
          },
          duration: "while-in-arena",
        },
        label: {
          name: "evo-upgrade",
        },
      },
    }),
  },
);
export const { blue: ghostProtocolMainframeBlue } = ghostProtocolMainframe.cards;
