import type { CharacterCard } from "@tcg/lorcana-types";
import { magicaDeSpellTheMidasTouchI18n } from "./049-magica-de-spell-the-midas-touch.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const magicaDeSpellTheMidasTouch: CharacterCard = {
  id: "XJy",
  canonicalId: "ci_XJy",
  reprints: ["set3-049"],
  cardType: "character",
  name: "Magica De Spell",
  version: "The Midas Touch",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 49,
  rarity: "common",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_fc52c08c7f254d8cb1e54150de516407",
    tcgPlayer: 538254,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "ALL MINE",
      description:
        "Whenever this character quests, gain lore equal to the cost of one of your items in play.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
  abilities: [
    shift(5),
    {
      id: "XJy-1",
      name: "ALL MINE",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "select-target",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["item"],
            },
          },
          {
            type: "gain-lore",
            amount: "TARGET_COST",
          },
        ],
      },
      text: "ALL MINE Whenever this character quests, gain lore equal to the cost of one of your items in play.",
    },
  ],
  i18n: magicaDeSpellTheMidasTouchI18n,
};
