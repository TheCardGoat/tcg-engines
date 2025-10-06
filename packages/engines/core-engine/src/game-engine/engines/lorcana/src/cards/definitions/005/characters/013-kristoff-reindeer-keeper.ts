import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kristoffReindeerKeeper: LorcanitoCharacterCardDefinition = {
  id: "g08",
  name: "Kristoff",
  title: "Reindeer Keeper",
  characteristics: ["dreamborn", "ally"],
  text: "**SONG OF THE HERD** For each song card in your discard, you pay 1 {I} less to play this character. **Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
  type: "character",
  abilities: [
    bodyguardAbility,
    whenYouPlayThisForEachYouPayLess({
      name: "Song of the Herd",
      text: "For each song card in your discard, you pay 1 {I} less to play this character.",
      amount: {
        dynamic: true,
        filters: [
          { filter: "owner", value: "self" },
          { filter: "type", value: "action" },
          { filter: "zone", value: "discard" },
          { filter: "characteristics", value: ["song"] },
        ],
      },
    }),
  ],
  colors: ["amber"],
  cost: 9,
  strength: 3,
  willpower: 7,
  lore: 3,
  illustrator: "Jochem van Gool",
  number: 13,
  set: "SSK",
  rarity: "rare",
};
