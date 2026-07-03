import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { blockerAbility, goSoloAbility } from "@tcg/cyberpunk-types";

export const embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean = defineCyberpunkCard({
  id: "72358c7d-9f29-4ef6-a682-f5bfc72c7714",
  canonicalId: "goro-takemura-hands-unclean",
  slug: "goro-takemura-hands-unclean",
  rulesText:
    "{Go Solo} (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)\n{Blocker} (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
  name: "Goro Takemura — Hands Unclean",
  displayName: "Goro Takemura — Hands Unclean",
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "embracingpowerretailstarterdeck",
    name: "Embracing Power — Retail Starter Deck",
  },
  printNumber: "012",
  artist: "Bad Moon Studio",
  imageUrl:
    "https://cdn.tcg.online/public/cyberpunk/cards/embracingpowerretailstarterdeck/012.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["goSolo", "blocker"],
  abilities: [
    goSoloAbility({
      text: "Go Solo (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)",
    }),
    blockerAbility({
      text: "Blocker (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
    }),
  ],
  type: "legend",
  cost: 5,
  power: 7,
}) satisfies LegendCardDefinition;
