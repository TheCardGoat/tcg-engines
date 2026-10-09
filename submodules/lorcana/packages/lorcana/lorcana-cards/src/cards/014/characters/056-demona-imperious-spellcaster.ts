import type { CharacterCard } from "@tcg/lorcana-types";
import { demonaImperiousSpellcasterI18n } from "./056-demona-imperious-spellcaster.i18n";
import { stoneByDay } from "../../../helpers/abilities/stoneByDay";

export const demonaImperiousSpellcaster: CharacterCard = {
  id: "GzL",
  canonicalId: "ci_GzL",
  slug: "lorcana-ci_GzL",
  printings: [
    {
      id: "set14-056",
      artId: "set14-056",
      setCode: "set14",
      collectorNumber: "56",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-056"],
  cardType: "character",
  name: "Demona",
  version: "Imperious Spellcaster",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "014",
  cardNumber: 56,
  rarity: "super_rare",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Impetus Improvisus",
      description:
        "Choose and discard a card — Chosen Gargoyle character gains Rush and Evasive until the start of your next turn. (They can challenge the turn they're played. Only characters with Evasive can challenge them.)",
    },
    {
      title: "Stone by Day",
      description: "If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Gargoyle", "Sorcerer"],
  abilities: [
    {
      id: "GzL-1",
      name: "Impetus Improvisus",
      type: "activated",
      cost: {
        discardCards: 1,
        discardChosen: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Rush",
            duration: "until-start-of-next-turn",
            target: {
              cardTypes: ["character"],
              count: 1,
              selector: "chosen",
              zones: ["play"],
              filter: [
                {
                  type: "has-classification",
                  classification: "Gargoyle",
                },
              ],
            },
          },
          {
            type: "gain-keyword",
            keyword: "Evasive",
            duration: "until-start-of-next-turn",
            target: { ref: "previous-target" },
          },
        ],
      },
      text: "Impetus Improvisus Choose and discard a card — Chosen Gargoyle character gains Rush and Evasive until the start of your next turn. (They can challenge the turn they're played. Only characters with Evasive can challenge them.)",
    },
    stoneByDay,
  ],
  i18n: demonaImperiousSpellcasterI18n,
};
