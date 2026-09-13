import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/fabricate.generated.ts";

export const fabricate = definePitchFamily(fabPitchFamilies["fabricate"], {
  abilities: () => ({
    chooseModes: modalAbility({
      kind: "modal",
      modal: {
        choose: 2,
      },
      modes: {
        equipBaseEquipmentProtoNameFromInventory: {
          kind: "resolution",
          effect: {
            type: "equip",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["inventory"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                  subtypes: ["Base"],
                },
                nameContains: "Proto",
              },
              count: 1,
            },
          },
        },
        evoPermanentsControlGet1Turn: {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "defense",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent", "combat-chain"],
              filter: {
                typeBox: {
                  subtypes: ["Evo"],
                },
              },
              count: {
                type: "all",
              },
            },
            duration: "this-turn",
          },
        },
        putUnderEvoPermanentControl: {
          kind: "resolution",
          effect: {
            type: "move-card",
            target: {
              selector: "self",
            },
            to: {
              zone: "under",
            },
          },
        },
        mayBanishEvoFromHandIfDoDraw: {
          kind: "resolution",
          effect: {
            type: "optional",
            effect: {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                filter: {
                  typeBox: {
                    subtypes: ["Evo"],
                  },
                },
                count: 1,
              },
            },
            then: {
              type: "draw",
              count: 1,
              player: "controller",
            },
          },
        },
      },
    }),
  }),
});

export const { red: fabricateRed } = fabricate.cards;
