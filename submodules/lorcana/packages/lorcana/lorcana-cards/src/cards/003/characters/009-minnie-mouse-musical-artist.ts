import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseMusicalArtistI18n } from "./009-minnie-mouse-musical-artist.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const minnieMouseMusicalArtist: CharacterCard = {
  id: "8V8",
  canonicalId: "ci_8V8",
  reprints: ["set3-009"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Musical Artist",
  inkType: ["amber"],
  set: "003",
  cardNumber: 9,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a6d0aaef05744b279192132d481af4be",
    tcgPlayer: 539062,
  },
  text: [
    {
      title: "Singer 3",
    },
    {
      title: "ENTOURAGE",
      description:
        "Whenever you play a character with Bodyguard, you may remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    singer(3),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 2 },
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "egy-2",
      name: "ENTOURAGE",
      text: "ENTOURAGE Whenever you play a character with Bodyguard, you may remove up to 2 damage from chosen character.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
          hasKeyword: "Bodyguard",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: minnieMouseMusicalArtistI18n,
};
