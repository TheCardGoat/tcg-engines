import type { CharacterCard } from "@tcg/lorcana-types";
import { hamishHubertHarrisMakingMischiefI18n } from "./050-hamish-hubert-harris-making-mischief.i18n";

export const hamishHubertHarrisMakingMischief: CharacterCard = {
  id: "WiE",
  canonicalId: "ci_WiE",
  reprints: ["set12-050"],
  cardType: "character",
  name: "Hamish, Hubert & Harris",
  version: "Making Mischief",
  inkType: ["amethyst"],
  franchise: "Brave",
  set: "012",
  cardNumber: 50,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  text: [
    {
      title: "Stay Quiet",
      description: "This character may enter play exerted.",
    },
    {
      title: "Clever Trap",
      description:
        "At the end of your turn, if this character is exerted, chosen opposing character can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Prince"],
  abilities: [
    {
      id: "WiE-1",
      name: "STAY QUIET",
      type: "static",
      text: "STAY QUIET This character may enter play exerted.",
      effect: {
        type: "restriction",
        restriction: "may-enter-play-exerted",
        target: "SELF",
      },
    },
    {
      id: "WiE-2",
      name: "CLEVER TRAP",
      type: "triggered",
      text: "CLEVER TRAP At the end of your turn, if this character is exerted, chosen opposing character can't ready at the start of their next turn.",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "is-exerted",
      },
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        duration: "their-next-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: hamishHubertHarrisMakingMischiefI18n,
};
