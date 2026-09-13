import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/steam-canister.generated.ts";

export const steamCanister = definePitchFamily(fabPitchFamilies["steam-canister"], {
  abilities: () => ({
    instantPutOnBottomOwnerSDeckPutSteamCounterOnItem: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "move-to-deck",
        from: "self",
        position: "bottom",
        count: 1,
      },
      effect: {
        type: "add-counter",
        counter: {
          kind: "named",
          name: "steam",
        },
        count: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Item"],
            },
            hasKeyword: "crank",
          },
          count: 1,
        },
      },
    },
  }),
});

export const { blue: steamCanisterBlue } = steamCanister.cards;
