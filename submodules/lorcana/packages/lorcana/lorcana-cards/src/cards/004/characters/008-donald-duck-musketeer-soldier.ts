import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckMusketeerSoldierI18n } from "./008-donald-duck-musketeer-soldier.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const donaldDuckMusketeerSoldier: CharacterCard = {
  id: "1Pa",
  canonicalId: "ci_1Pa",
  reprints: ["set4-008"],
  cardType: "character",
  name: "Donald Duck",
  version: "Musketeer Soldier",
  inkType: ["amber"],
  set: "004",
  cardNumber: 8,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_dd1edbb4a44c4017a3aabb30184c0888",
    tcgPlayer: 550556,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "WAIT FOR ME!",
      description: "When you play this character, chosen character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
  abilities: [
    bodyguard,
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "1hr-2",
      name: "WAIT FOR ME!",
      text: "WAIT FOR ME! When you play this character, chosen character gets +1 {L} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: donaldDuckMusketeerSoldierI18n,
};
