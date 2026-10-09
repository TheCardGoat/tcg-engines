import type { CharacterCard } from "@tcg/lorcana-types";
import { berliozTinyRascalI18n } from "./186-berlioz-tiny-rascal.i18n";

export const berliozTinyRascal: CharacterCard = {
  id: "4NQ",
  canonicalId: "ci_4NQ",
  slug: "lorcana-ci_4NQ",
  printings: [
    {
      id: "set14-186",
      artId: "set14-186",
      setCode: "set14",
      collectorNumber: "186",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-186"],
  cardType: "character",
  name: "Berlioz",
  version: "Tiny Rascal",
  inkType: ["steel"],
  franchise: "Aristocats",
  set: "014",
  cardNumber: 186,
  rarity: "rare",
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1d6f817a9ccd4cdcbd1cc89918f1c1c1",
  },
  text: [
    {
      title: "SHARP LITTLE CLAWS",
      description: "When you play this character, you may deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "4NQ-1",
      name: "SHARP LITTLE CLAWS",
      type: "triggered",
      text: "SHARP LITTLE CLAWS When you play this character, you may deal 1 damage to chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
    },
  ],
  i18n: berliozTinyRascalI18n,
};
