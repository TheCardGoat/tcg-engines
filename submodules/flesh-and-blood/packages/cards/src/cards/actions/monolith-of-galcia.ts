import { semanticModalAbility } from "../../authoring/card.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/monolith-of-galcia.generated.ts";

export const monolithOfGalcia = definePitchFamily(fabPitchFamilies["monolith-of-galcia"], {
  abilities: () => ({
    choose1MoreDestroyTargetFrozenAllyDestroyTargetFrozenAuraDestroyTargetFrozenEquipmentDestroyTargetFrozenItem:
      semanticModalAbility({
        kind: "modal",
        modal: {
          // Printed "Choose 1 or more": any non-empty subset of the four modes.
          choose: {
            type: "one-or-more",
          },
        },
        modes: {
          destroyTargetFrozenAlly: {
            kind: "resolution",
            effect: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "on-stack",
                zones: ["permanent"],
                filter: {
                  hasStatus: "frozen",
                  typeBox: {
                    subtypes: ["Ally"],
                  },
                },
                count: 1,
              },
            },
          },
          destroyTargetFrozenAura: {
            kind: "resolution",
            effect: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "on-stack",
                zones: ["permanent"],
                filter: {
                  hasStatus: "frozen",
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                },
                count: 1,
              },
            },
          },
          destroyTargetFrozenEquipment: {
            kind: "resolution",
            effect: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "on-stack",
                zones: ["permanent"],
                filter: {
                  hasStatus: "frozen",
                  typeBox: {
                    types: ["Equipment"],
                  },
                },
                count: 1,
              },
            },
          },
          destroyTargetFrozenItem: {
            kind: "resolution",
            effect: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "on-stack",
                zones: ["permanent"],
                filter: {
                  hasStatus: "frozen",
                  typeBox: {
                    subtypes: ["Item"],
                  },
                },
                count: 1,
              },
            },
          },
        },
      }),
  }),
});

export const { blue: monolithOfGalciaBlue } = monolithOfGalcia.cards;
