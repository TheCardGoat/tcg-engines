import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentMonstrousDragonI18n } from "./108-maleficent-monstrous-dragon.i18n";

export const maleficentMonstrousDragon: CharacterCard = {
  id: "wO7",
  canonicalId: "ci_C6t",
  slug: "lorcana-ci_C6t",
  printings: [
    {
      id: "set9-108",
      artId: "set9-108",
      setCode: "set9",
      collectorNumber: "108",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set1-113", "set9-108"],
  cardType: "character",
  name: "Maleficent",
  version: "Monstrous Dragon",
  inkType: ["ruby"],
  franchise: "Sleeping Beauty",
  set: "009",
  cardNumber: 108,
  rarity: "legendary",
  cost: 9,
  strength: 7,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_331c3ce2f2a74490acc4b2bec16a0ad9",
    tcgPlayer: "650046",
  },
  text: [
    {
      title: "DRAGON FIRE",
      description: "When you play this character, you may banish chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Dragon"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "19f-1",
      name: "DRAGON FIRE",
      text: "DRAGON FIRE When you play this character, you may banish chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: maleficentMonstrousDragonI18n,
};
