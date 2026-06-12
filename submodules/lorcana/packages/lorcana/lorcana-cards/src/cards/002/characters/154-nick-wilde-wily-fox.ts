import type { CharacterCard } from "@tcg/lorcana-types";
import { nickWildeWilyFoxI18n } from "./154-nick-wilde-wily-fox.i18n";

export const nickWildeWilyFox: CharacterCard = {
  id: "0FC",
  canonicalId: "ci_0FC",
  reprints: ["set2-154"],
  cardType: "character",
  name: "Nick Wilde",
  version: "Wily Fox",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "002",
  cardNumber: 154,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e9c693252fcc405988a7aab7ec8d7a19",
    tcgPlayer: 527534,
  },
  text: [
    {
      title: "IT'S CALLED A HUSTLE",
      description:
        "When you play this character, you may return an item card named Pawpsicle from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "item",
          cardName: "Pawpsicle",
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      id: "1uh-1",
      name: "IT'S CALLED A HUSTLE",
      text: "IT'S CALLED A HUSTLE When you play this character, you may return an item card named Pawpsicle from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: nickWildeWilyFoxI18n,
};
