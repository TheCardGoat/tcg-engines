import type { CharacterCard } from "@tcg/lorcana-types";
import { magicaDeSpellConnivingSorceressI18n } from "./054-magica-de-spell-conniving-sorceress.i18n";

export const magicaDeSpellConnivingSorceress: CharacterCard = {
  id: "dD1",
  canonicalId: "ci_dD1",
  reprints: ["set10-054"],
  cardType: "character",
  name: "Magica De Spell",
  version: "Conniving Sorceress",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 54,
  rarity: "common",
  cost: 7,
  strength: 7,
  willpower: 7,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_c8b3b3f1c90f441ca2eab63ef98d79cf",
    tcgPlayer: 659427,
  },
  text: [
    {
      title: "Shift 7 {I}",
    },
    {
      title: "SHADOW'S GRASP",
      description:
        "When you play this character, if you used Shift to play her, you may draw 4 cards.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
  abilities: [
    {
      cost: {
        ink: 7,
      },
      id: "x7f-1",
      keyword: "Shift",
      text: "Shift 7 {I}",
      type: "keyword",
    },
    {
      condition: {
        type: "used-shift",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 4,
          target: "CONTROLLER",
        },
      },
      id: "x7f-2",
      name: "SHADOW'S GRASP",
      text: "SHADOW'S GRASP When you play this character, if you used Shift to play her, you may draw 4 cards.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: magicaDeSpellConnivingSorceressI18n,
};
