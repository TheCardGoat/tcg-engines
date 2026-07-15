import type { CharacterCard } from "@tcg/lorcana-types";
import { dashParrVioletParrSuperSiblings } from "./133-dash-parr-violet-parr-super-siblings";
import { dashParrVioletParrSuperSiblingsEnchantedI18n } from "./241-dash-parr-violet-parr-super-siblings-enchanted.i18n";

export const dashParrVioletParrSuperSiblingsEnchanted: CharacterCard = {
  id: "6a4",
  canonicalId: "ci_d3T",
  slug: "lorcana-ci_d3T",
  printings: [
    {
      id: "set13-241-enchanted",
      artId: "ci_d3T-enchanted",
      setCode: "set13",
      collectorNumber: "241",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set13-133"],
  cardType: "character",
  name: "Dash Parr & Violet Parr",
  version: "Super Siblings",
  inkType: ["ruby", "steel"],
  franchise: "Incredibles",
  set: "013",
  cardNumber: 241,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 8,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Combo Shift 6 {I}",
    },
    {
      title: "Evasive, Resist +1",
    },
    {
      title: "Incredible Tactics",
      description:
        "Whenever this character quests or challenges, draw a card for each card under them.",
    },
  ],
  classifications: ["Storyborn", "Team", "Super", "Hero"],
  abilities: dashParrVioletParrSuperSiblings.abilities,
  i18n: dashParrVioletParrSuperSiblingsEnchantedI18n,
};
