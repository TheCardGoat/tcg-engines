import type { CharacterCard } from "@tcg/lorcana-types";
import { mrLitwakArcadeOwnerI18n } from "./024-mr-litwak-arcade-owner.i18n";

export const mrLitwakArcadeOwner: CharacterCard = {
  id: "WCV",
  canonicalId: "ci_WCV",
  reprints: ["set6-024"],
  cardType: "character",
  name: "Mr. Litwak",
  version: "Arcade Owner",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "006",
  cardNumber: 24,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_19217586b3924276aa8996d318f83139",
    tcgPlayer: 593030,
  },
  text: [
    {
      title: "THE GANG'S ALL HERE",
      description:
        "Once during your turn, whenever you play another character, you may ready this character. He can't quest or challenge for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "SELF",
          type: "ready",
          restriction: "cant-quest-or-challenge",
        },
        type: "optional",
      },
      id: "byt-1",
      name: "THE GANG’S ALL HERE",
      text: "THE GANG’S ALL HERE Once during your turn, whenever you play another character, you may ready this character. He can’t quest or challenge for the rest of this turn.",
      trigger: {
        event: "play",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
        restrictions: [{ type: "once-per-turn" }, { type: "during-turn", whose: "your" }],
      },
      type: "triggered",
    },
  ],
  i18n: mrLitwakArcadeOwnerI18n,
};
