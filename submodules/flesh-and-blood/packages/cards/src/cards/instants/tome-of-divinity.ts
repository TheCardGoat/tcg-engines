import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/tome-of-divinity.generated.ts";

export const tomeOfDivinity = definePitchFamily(fabPitchFamilies["tome-of-divinity"], {
  abilities: () => ({
    draw2IfHasBeenPutIntoHeroS: {
      kind: "resolution",
      // CR 6.4.7: a genuine self-replacement — the second step replaces the
      // draw-2 events of the preceding step (they never commit) when the
      // condition holds at generation time, rather than a pre-chosen branch.
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            count: 2,
            player: "controller",
          },
          {
            type: "self-replacement",
            condition: {
              type: "performed-this-turn",
              event: "put-card-into-soul",
              player: "controller",
            },
            modification: {
              type: "draw",
              count: 3,
              player: "controller",
            },
          },
        ],
      },
    },
  }),
});

export const { yellow: tomeOfDivinityYellow } = tomeOfDivinity.cards;
