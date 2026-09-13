import { plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/embrace-sin.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const embraceSin = definePitchFamily(fabPitchFamilies["embrace-sin"], {
  keywords: [goAgain],
  abilities: () => ({
    power: plusPower(2, { appliesTo: { next: { typeBox: { subtypes: ["Attack"] } } } }),
    // The eligible aura is chosen when the player exercises the permission,
    // not when Embrace Sin resolves. This also permits an eligible aura that
    // enters banished later in the turn.
    permission: {
      kind: "resolution",
      effect: {
        type: "play-card",
        fromZones: ["banished"],
        source: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["banished"],
          count: { type: "all" },
        },
        appliesTo: {
          next: {
            nameContains: "Runechant",
            typeBox: { subtypes: ["Aura"] },
          },
          count: { type: "all" },
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { yellow: embraceSinYellow } = embraceSin.cards;
