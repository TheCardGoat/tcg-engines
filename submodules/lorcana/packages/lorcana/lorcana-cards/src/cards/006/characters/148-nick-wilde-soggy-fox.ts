import type { CharacterCard } from "@tcg/lorcana-types";
import { nickWildeSoggyFoxI18n } from "./148-nick-wilde-soggy-fox.i18n";

export const nickWildeSoggyFox: CharacterCard = {
  id: "ZEt",
  canonicalId: "ci_ZEt",
  reprints: ["set6-148"],
  cardType: "character",
  name: "Nick Wilde",
  version: "Soggy Fox",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "006",
  cardNumber: 148,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cbd38ca5b3b04da382b8aa2b3da66adb",
    tcgPlayer: 579927,
  },
  text: [
    {
      title: "NICE TO HAVE A PARTNER",
      description:
        "While you have another character with Support in play, this character gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "10j-1",
      name: "NICE TO HAVE A PARTNER",
      type: "static",
      condition: {
        type: "has-character-with-keyword",
        keyword: "Support",
        controller: "you",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      text: "NICE TO HAVE A PARTNER While you have another character with Support in play, this character gets +2 {S}.",
    },
  ],
  i18n: nickWildeSoggyFoxI18n,
};
