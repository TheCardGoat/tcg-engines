import { attackActionFilter, type FabEffect } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/memorial-ground.generated.ts";

export const memorialGround = definePitchFamily(fabPitchFamilies["memorial-ground"], {
  parameters: pitchMap({
    red: { maxCost: 2 },
    yellow: { maxCost: 1 },
    blue: { maxCost: 0 },
  }),
  abilities: ({ maxCost }): { putAttackOnDeck: FabEffect } => ({
    putAttackOnDeck: {
      type: "move-card",
      target: {
        selector: "object",
        declared: "on-stack",
        player: "controller",
        zones: ["graveyard"],
        filter: attackActionFilter({
          cost: { op: "lte", value: maxCost },
        }),
        count: 1,
      },
      to: {
        zone: "deck",
        position: "top",
      },
    },
  }),
});

export const {
  red: memorialGroundRed,
  yellow: memorialGroundYellow,
  blue: memorialGroundBlue,
} = memorialGround.cards;
