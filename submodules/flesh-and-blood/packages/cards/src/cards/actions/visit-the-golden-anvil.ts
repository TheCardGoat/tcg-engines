import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/visit-the-golden-anvil.generated.ts";

export const visitTheGoldenAnvil = definePitchFamily(fabPitchFamilies["visit-the-golden-anvil"], {
  keywords: [
    {
      name: "specialization",
      hero: "Olympia",
    },
  ],
  abilities: () => ({
    asAdditionalCostPlayDestroyXGoldControl: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "destroy",
          count: {
            type: "x",
          },
          filter: {
            name: "Gold",
          },
        },
      },
    },
    equipXWeaponsEquipmentFromInventory: {
      kind: "resolution",
      effect: {
        type: "equip",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["inventory"],
          filter: {
            or: [{ typeBox: { types: ["Weapon"] } }, { typeBox: { types: ["Equipment"] } }],
          },
          count: {
            type: "x",
          },
        },
      },
    },
  }),
});

export const { blue: visitTheGoldenAnvilBlue } = visitTheGoldenAnvil.cards;
