import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/visit-the-prize-room.generated.ts";
import { goAgain, specialization } from "../shared/keywords.ts";

export const visitThePrizeRoom = definePitchFamily(fabPitchFamilies["visit-the-prize-room"], {
  keywords: [specialization("Olympia"), goAgain],
  abilities: () => ({
    sequence: {
      type: "sequence",
      steps: [
        {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: { name: "Gold" },
              count: 1,
            },
          },
          then: {
            type: "equip",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["inventory"],
              filter: { name: "Prized Galea" },
              count: 1,
            },
          },
        },
        { type: "create-token", token: "vigor", controller: "controller" },
        { type: "create-token", token: "courage", controller: "controller" },
      ],
    },
  }),
});

export const { blue: visitThePrizeRoomBlue } = visitThePrizeRoom.cards;
