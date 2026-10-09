import type { CharacterCard } from "@tcg/lorcana-types";
import { ward } from "../../../helpers/abilities/ward";
import { bobbyZimuruskiSoundboardWhizI18n } from "./084-bobby-zimuruski-soundboard-whiz.i18n";

export const bobbyZimuruskiSoundboardWhiz: CharacterCard = {
  id: "SMo",
  canonicalId: "ci_SMo",
  slug: "lorcana-ci_SMo",
  printings: [
    {
      id: "set14-084",
      artId: "set14-084",
      setCode: "set14",
      collectorNumber: "84",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-084"],
  cardType: "character",
  name: "Bobby Zimuruski",
  version: "Soundboard Whiz",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 84,
  rarity: "super_rare",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Ward",
    },
    {
      title: "Scrumptious!",
      description:
        'Your items named Leaning Tower of Cheese-a gain "{E}, 1 {I} — Get 1 ink drop." (You may remove an ink drop to pay 1 {I}.)',
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    ward,
    {
      id: "SMo-2",
      name: "Scrumptious!",
      type: "static",
      text: 'Scrumptious! Your items named Leaning Tower of Cheese-a gain "{E}, 1 {I} — Get 1 ink drop." (You may remove an ink drop to pay 1 {I}.)',
      effect: {
        type: "grant-ability",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["item"],
          filters: [{ type: "has-name", name: "Leaning Tower of Cheese-a" }],
        },
        ability: {
          id: "SMo-2a",
          name: "Scrumptious!",
          type: "activated",
          text: "{E}, 1 {I} — Get 1 ink drop.",
          cost: {
            exert: true,
            ink: 1,
          },
          effect: {
            type: "gain-ink-drop",
            amount: 1,
            target: "CONTROLLER",
          },
        },
      },
    },
  ],
  i18n: bobbyZimuruskiSoundboardWhizI18n,
};
