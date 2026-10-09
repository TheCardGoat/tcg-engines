import type { CharacterCard } from "@tcg/lorcana-types";
import { priscillaEfficientClerkI18n } from "./148-priscilla-efficient-clerk.i18n";

export const priscillaEfficientClerk: CharacterCard = {
  id: "3j6",
  canonicalId: "ci_3j6",
  slug: "lorcana-ci_3j6",
  printings: [
    {
      id: "set14-148",
      artId: "set14-148",
      setCode: "set14",
      collectorNumber: "148",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-148"],
  cardType: "character",
  name: "Priscilla",
  version: "Efficient Clerk",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 148,
  rarity: "rare",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Not-So-Secret Crush",
      description: "This character enters play exerted.",
    },
    {
      title: "Filing System",
      description:
        "Whenever this character quests, you may look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "priscilla-1",
      name: "Not-So-Secret Crush",
      type: "static",
      text: "Not-So-Secret Crush This character enters play exerted.",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
    },
    {
      id: "priscilla-2",
      name: "Filing System",
      type: "triggered",
      text: "Filing System Whenever this character quests, you may look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "scry",
          amount: 2,
          target: "CONTROLLER",
          destinations: [
            {
              zone: "hand",
              min: 1,
              requiresLookedAtLeast: 1,
              max: 1,
            },
            {
              zone: "inkwell",
              min: 1,
              requiresLookedAtLeast: 2,
              max: 1,
              exerted: true,
              facedown: true,
            },
          ],
        },
      },
    },
  ],
  i18n: priscillaEfficientClerkI18n,
};
