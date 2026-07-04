import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const alphaTBugAmateurPhilosopher = defineCyberpunkCard({
  id: "07d0d80a-6a86-40b7-9dd5-8401700667ec",
  slug: "t-bug-amateur-philosopher",
  subname: "Amateur Philosopher",
  name: "T-Bug",
  displayName: "T-Bug - Amateur Philosopher",
  canonicalId: "t-bug-amateur-philosopher",
  color: "yellow",
  classifications: ["Netrunner", "Merc"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α015",
  artist: "CD PROJEKT RED",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a015.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  type: "unit",
  cost: 3,
  power: 5,
}) satisfies UnitCardDefinition;
