import type { BoxToppersRetailCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { blockerAbility, goSoloAbility } from "@tcg/cyberpunk-types";

export const boxTopperRetailGoroTakemuraHandsUnclean = defineCyberpunkCard({
  id: "72358c7d-9f29-4ef6-a682-f5bfc72c7714",
  slug: "goro-takemura-hands-unclean",
  canonicalId: "goro-takemura-hands-unclean",
  name: "Goro Takemura — Hands Unclean",
  displayName: "Goro Takemura — Hands Unclean",
  rulesText:
    "[GO SOLO] (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)\n[BLOCKER] (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "boxtoppersretail",
    name: "Box Toppers — Retail",
  },
  printNumber: "003",
  artist: "Bad Moon Studios",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/boxtoppersretail/003.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["goSolo", "blocker"],
  type: "legend",
  cost: 5,
  power: 7,
  abilities: [
    goSoloAbility({
      text: "GO SOLO (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)",
    }),
    blockerAbility({
      text: "BLOCKER (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
    }),
  ],
}) satisfies BoxToppersRetailCardDefinition;
