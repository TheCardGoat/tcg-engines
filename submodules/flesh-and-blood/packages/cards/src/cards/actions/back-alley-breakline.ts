import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/back-alley-breakline.generated.ts";

export const backAlleyBreakline = definePitchFamily(fabPitchFamilies["back-alley-breakline"], {
  abilities: () => ({
    deckDeparture: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "move-zone",
          actor: { kind: "any" },
          observes: { kind: "source", selector: "moved-object" },
          from: ["deck"],
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "gain-action-points", amount: 1 },
      },
    },
  }),
});

export const {
  red: backAlleyBreaklineRed,
  yellow: backAlleyBreaklineYellow,
  blue: backAlleyBreaklineBlue,
} = backAlleyBreakline.cards;
