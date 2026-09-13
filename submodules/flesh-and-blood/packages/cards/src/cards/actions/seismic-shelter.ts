import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/seismic-shelter.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const seismicShelter = definePitchFamily(fabPitchFamilies["seismic-shelter"], {
  keywords: [goAgain],
  abilities: () => ({
    attackActionControlGetXDefenseWhileDefendingWhereXNumberSeismic: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: {
          type: "count",
          what: "cards-in-zone",
          zone: "permanent",
          player: "controller",
          filter: {
            name: "Seismic Surge",
            typeBox: {
              metatypes: ["Token"],
            },
          },
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["stack", "combat-chain"],
          filter: attackActionFilter({ defending: true }),
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
    atStartTurnDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});

export const { blue: seismicShelterBlue } = seismicShelter.cards;
