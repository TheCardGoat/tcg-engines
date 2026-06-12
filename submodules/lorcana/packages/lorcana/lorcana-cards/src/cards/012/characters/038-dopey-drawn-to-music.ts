import type { CharacterCard } from "@tcg/lorcana-types";
import { dopeyDrawnToMusicI18n } from "./038-dopey-drawn-to-music.i18n";

export const dopeyDrawnToMusic: CharacterCard = {
  id: "A36",
  canonicalId: "ci_A36",
  reprints: ["set12-038"],
  cardType: "character",
  name: "Dopey",
  version: "Drawn to Music",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "012",
  cardNumber: 38,
  rarity: "uncommon",
  cost: 6,
  strength: 3,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a0369f5ac4404d72aeebd384f99c92fe",
  },
  text: [
    {
      title: "TONGUE-TIED",
      description: "This character can't {E} to sing songs.",
    },
    {
      title: "DISTANT MELODY",
      description:
        "Once during your turn, whenever you play a song, this character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  abilities: [
    {
      id: "A36-1",
      name: "Tongue-Tied",
      type: "static",
      text: "Tongue-Tied This character can't {E} to sing songs.",
      effect: {
        restriction: "cant-sing",
        target: "SELF",
        type: "restriction",
      },
    },
    {
      id: "A36-2",
      name: "Distant Melody",
      type: "triggered",
      text: "Distant Melody Once during your turn, whenever you play a song, this character gets +1 {L} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
        timing: "whenever",
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
        duration: "this-turn",
      },
    },
  ],
  i18n: dopeyDrawnToMusicI18n,
};
