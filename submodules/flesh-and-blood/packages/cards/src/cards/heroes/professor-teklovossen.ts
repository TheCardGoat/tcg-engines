import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/professor-teklovossen.generated.ts";

export const professorTeklovossen = defineCard(
  fabCardIdentitiesByCanonicalId["BLCMLHnwnbRKbdhPJ9DQp"],
  {
    abilities: {
      evosCostResourceLessPlayOpposing: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "modify-numeric",
          property: "cost",
          op: "subtract",
          amount: {
            type: "count",
            what: "heroes",
            player: "opponent",
          },
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            // Printed "Evos cost {r} less to play" is unqualified: it covers
            // hand/arsenal plays and the banished-zone plays this same hero permits.
            zones: ["hand", "arsenal", "banished"],
            filter: {
              typeBox: {
                subtypes: ["Evo"],
              },
            },
            count: {
              type: "all",
            },
          },
          duration: "while-in-arena",
        },
      },
      playEvosBanishedZone: {
        kind: "static",
        staticKind: "play",
        playEffect: {
          role: "permission",
          fromZones: ["banished"],
          filter: {
            typeBox: {
              subtypes: ["Evo"],
            },
          },
        },
      },
    },
  },
);
