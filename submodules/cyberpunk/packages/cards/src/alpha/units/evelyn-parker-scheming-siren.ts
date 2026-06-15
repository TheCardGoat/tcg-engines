import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaEvelynParkerSchemingSiren = {
  id: "ce9e2d5d-5bd4-4ff8-96a3-5767e9969357",
  externalId: "cyberpunk:evelyn-parker-scheming-siren",
  slug: "evelyn-parker-scheming-siren",
  name: "Evelyn Parker",
  subname: "Scheming Siren",
  displayName: "Evelyn Parker - Scheming Siren",
  rulesText: "When a rival steals one or more friendly gigs, if this unit is spent, draw a card.",
  color: "blue",
  classifications: ["Doll"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α011",
  printings: [
    {
      id: "9a857228-1b5f-4b95-9296-d95a596de2e6",
      collectorNumber: "α011",
      setCode: "alpha",
      rarity: null,
    },
  ],
  selectedPrintingId: "9a857228-1b5f-4b95-9296-d95a596de2e6",
  artist: "Olgierd Ciszak",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a011.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 2,
  power: 1,
  abilities: [
    AbilityBuilder.triggered()
      .text("When a rival steals one or more friendly gigs, if this unit is spent, draw a card.")
      .onGigStolen({
        player: "rival",
        target: target.gig({ controller: "friendly" }),
        minAmount: 1,
      })
      .source(target.self())
      .effect(
        effect.draw({
          player: "friendly",
          amount: 1,
          conditions: [condition.cardState({ target: target.self(), state: "spent" })],
        }),
      )
      .build(),
  ],
  reminderText: [],
} satisfies AlphaCardDefinition;
