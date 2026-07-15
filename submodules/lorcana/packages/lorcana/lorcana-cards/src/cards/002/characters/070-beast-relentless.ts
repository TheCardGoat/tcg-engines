import type { CharacterCard } from "@tcg/lorcana-types";
import { beastRelentlessI18n } from "./070-beast-relentless.i18n";

export const beastRelentless: CharacterCard = {
  id: "p7b",
  canonicalId: "ci_oX9",
  slug: "lorcana-ci_oX9",
  printings: [
    {
      id: "set2-070",
      artId: "set2-070",
      setCode: "set2",
      collectorNumber: "70",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set2-070"],
  cardType: "character",
  name: "Beast",
  version: "Relentless",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 70,
  rarity: "legendary",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_458325805fc445799aabfe4c4046f89b",
    tcgPlayer: "527800",
  },
  text: [
    {
      title: "SECOND WIND",
      description: "Whenever an opposing character is damaged, you may ready this character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      id: "1iy-1",
      name: "SECOND WIND",
      text: "SECOND WIND Whenever an opposing character takes damage, you may ready this character.",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "SELF",
          type: "ready",
        },
        type: "optional",
      },
      trigger: {
        event: "damage",
        on: "OPPOSING_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: beastRelentlessI18n,
};
