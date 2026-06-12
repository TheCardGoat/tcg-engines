import type { CharacterCard } from "@tcg/lorcana-types";
import { madamMimCheatingSpellcasterI18n } from "./056-madam-mim-cheating-spellcaster.i18n";

export const madamMimCheatingSpellcaster: CharacterCard = {
  id: "UyZ",
  canonicalId: "ci_UyZ",
  reprints: ["set7-056"],
  cardType: "character",
  name: "Madam Mim",
  version: "Cheating Spellcaster",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "007",
  cardNumber: 56,
  rarity: "rare",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e1f18adb01e14dbd97be31ad052d642d",
    tcgPlayer: 619435,
  },
  text: [
    {
      title: "PLAY ROUGH",
      description: "Whenever this character quests, exert chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "exert",
      },
      id: "1rw-1",
      name: "PLAY ROUGH",
      text: "PLAY ROUGH Whenever this character quests, exert chosen opposing character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: madamMimCheatingSpellcasterI18n,
};
