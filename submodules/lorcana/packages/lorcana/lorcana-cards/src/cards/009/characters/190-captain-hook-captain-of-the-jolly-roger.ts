import type { CharacterCard } from "@tcg/lorcana-types";
import { captainHookCaptainOfTheJollyRogerI18n } from "./190-captain-hook-captain-of-the-jolly-roger.i18n";

export const captainHookCaptainOfTheJollyRoger: CharacterCard = {
  id: "RmQ",
  canonicalId: "ci_0AT",
  slug: "lorcana-ci_0AT",
  printings: [
    {
      id: "set9-190",
      artId: "set9-190",
      setCode: "set9",
      collectorNumber: "190",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set1-173", "set9-190"],
  cardType: "character",
  name: "Captain Hook",
  version: "Captain of the Jolly Roger",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "009",
  cardNumber: 190,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_79c990fe5bf14f4bbd075b6f80ad4290",
    tcgPlayer: "650123",
  },
  text: [
    {
      title: "DOUBLE THE POWDER!",
      description:
        "When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Pirate", "Captain"],
  abilities: [
    {
      id: "1d2-1",
      text: "DOUBLE THE POWDER! When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
      name: "DOUBLE THE POWDER!",
      effect: {
        effect: {
          cardName: "Fire the Cannons!",
          cardType: "action",
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: captainHookCaptainOfTheJollyRogerI18n,
};
