import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tales-of-adventure.generated.ts";

export const talesOfAdventure = definePitchFamily(fabPitchFamilies["tales-of-adventure"], {
  keywords: [
    {
      name: "specialization",
      hero: "Yorick",
    },
  ],
  abilities: () => ({
    eachOtherHeroChoosesCreatesTokenHasnTChosenAetherAshwingEmbodiment: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "choose-and-create-token",
            options: [
              "aether-ashwing",
              "embodiment-of-earth",
              "embodiment-of-lightning",
              "ponder",
              "quicken",
              "runechant",
              "seismic-surge",
              "soul-shackle",
              "spectral-shield",
              "zen-state",
            ],
            chooser: "opponent",
            controller: "opponent",
          },
          {
            type: "create-token",
            token: "copper",
            controller: "controller",
          },
          {
            type: "create-token",
            token: "silver",
            controller: "controller",
          },
          {
            type: "create-token",
            token: "gold",
            controller: "controller",
          },
        ],
      },
    },
  }),
});

export const { blue: talesOfAdventureBlue } = talesOfAdventure.cards;
