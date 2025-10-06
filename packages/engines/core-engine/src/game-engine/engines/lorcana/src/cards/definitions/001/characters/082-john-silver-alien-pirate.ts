import { whenPlayAndWheneverQuests } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const johnSilverAlienPirate: LorcanitoCharacterCardDefinition = {
  id: "a8j",
  reprints: ["hsz"],

  name: "John Silver",
  title: "Alien Pirate",
  characteristics: ["alien", "storyborn", "villain", "pirate", "captain"],
  text: "**PICK YOUR FIGHTS** When you play this character and whenever he quests, chosen opposing character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
  type: "character",
  abilities: whenPlayAndWheneverQuests({
    name: "Pick Your Fights",
    text: "When you play this character and whenever he quests, chosen opposing character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
    effects: [
      {
        type: "ability",
        ability: "reckless",
        modifier: "add",
        duration: "next_turn",
        target: {
          type: "card",
          value: 1,
          filters: [
            { filter: "zone", value: "play" },
            { filter: "owner", value: "opponent" },
            { filter: "type", value: "character" },
          ],
        },
      },
    ],
  }),
  flavour: "Don't be too put off by this . . . hunk of hardware.",
  inkwell: true,
  colors: ["emerald"],
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  illustrator: "Jared Nickerl",
  number: 82,
  set: "TFC",
  rarity: "legendary",
};
