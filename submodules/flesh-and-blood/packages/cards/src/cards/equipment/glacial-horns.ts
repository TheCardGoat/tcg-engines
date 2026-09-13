import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/glacial-horns.generated.ts";

export const glacialHorns = defineCard(fabCardIdentitiesByCanonicalId["CmLHBGBBhfKTP7ghq8kTL"], {
  abilities: {
    actionDestroyGlacialHornsChooseHeroFreezeUp1: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      // Printed "Choose a hero" then freeze their arsenal/ally. 1v1 product:
      // sole opposing seat is the freeze subject (no multi-hero chooser UI).
      // Multiplayer hero choice is out of scope. Targets are at-resolution
      // (was on-stack + target-controller, which never resolved).
      effect: {
        type: "sequence",
        steps: [
          {
            type: "freeze",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["arsenal"],
              count: { type: "up-to", amount: 1 },
            },
            duration: "until-start-of-own-next-turn",
          },
          {
            type: "freeze",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
              count: { type: "up-to", amount: 1 },
            },
            duration: "until-start-of-own-next-turn",
          },
        ],
      },
    },
  },
});
