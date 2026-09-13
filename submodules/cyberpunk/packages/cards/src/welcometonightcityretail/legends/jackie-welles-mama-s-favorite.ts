import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { goSoloAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailJackieWellesMamaSFavorite = defineCyberpunkCard({
  id: "04a82ebf-eba1-4888-a95d-f01b9bbd0167",
  canonicalId: "jackie-welles-mama-s-favorite",
  slug: "jackie-welles-mama-s-favorite",
  subname: "Mama's Favorite",
  name: "Jackie Welles",
  displayName: "Jackie Welles: Mama's Favorite",
  rulesText:
    "{Go Solo} (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)\nIf a friendly Unit would be defeated, you may spend 1 €$ to defeat this Legend instead. (Remove it from the game.)",
  color: "green",
  classifications: ["Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "073",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/073.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["goSolo"],
  abilities: [
    goSoloAbility({
      text: "Go Solo (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)",
    }),
    // Replacement-effect ("if a friendly Unit would be defeated…") is printed in
    // rulesText; engine support for optional defeat redirection lands separately.
  ],
  type: "legend",
  cost: 6,
  power: 8,
}) satisfies LegendCardDefinition;
