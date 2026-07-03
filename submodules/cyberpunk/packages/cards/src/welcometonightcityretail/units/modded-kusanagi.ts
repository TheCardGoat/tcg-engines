import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { adrenalineAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailModdedKusanagi = defineCyberpunkCard({
  id: "920cabc9-f350-4f61-96c6-69e649271456",
  slug: "modded-kusanagi",
  rulesText:
    "{Adrenaline} (This Unit can attack the turn it's played.)\nAt the end of your turn, return this Unit to its owner's hand.",
  name: "Modded Kusanagi",
  displayName: "Modded Kusanagi",
  canonicalId: "modded-kusanagi",
  color: "blue",
  classifications: ["Tyger Claws", "Vehicle"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "120",
  artist: "Łukasz Poller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/120.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  keywords: ["adrenaline"],
  type: "unit",
  cost: 6,
  power: 8,
  abilities: [
    adrenalineAbility(),
    {
      kind: "triggered",
      text: "At the end of your turn, return this Unit to its owner's hand.",
      trigger: {
        trigger: "event",
        event: {
          event: "turnEnded",
          player: "friendly",
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "returnToHand",
          target: {
            selector: "self",
          },
          destinationOwner: "owner",
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
