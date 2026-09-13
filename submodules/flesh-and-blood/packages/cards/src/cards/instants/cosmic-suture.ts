import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/cosmic-suture.generated.ts";

export const cosmicSuture = definePitchFamily(fabPitchFamilies["cosmic-suture"], {
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
  abilities: (preventionAmount) => ({
    prevention: {
      kind: "resolution",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: preventionAmount,
        shielded: { selector: "controller" },
        duration: "this-turn",
      },
    },
    starfall: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "graveyard",
        player: "controller",
        filter: { typeBox: { types: ["Instant"] } },
        comparison: { op: "gte", value: 1 },
        per: "turn",
      },
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 1,
        target: {
          selector: "object",
          declared: "on-stack",
          player: "any",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
      label: { name: "starfall" },
    },
  }),
});

export const {
  red: cosmicSutureRed,
  yellow: cosmicSutureYellow,
  blue: cosmicSutureBlue,
} = cosmicSuture.cards;
