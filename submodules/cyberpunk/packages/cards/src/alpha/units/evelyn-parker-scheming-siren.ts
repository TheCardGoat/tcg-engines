import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaEvelynParkerSchemingSiren = defineCyberpunkCard({
  id: "ce9e2d5d-5bd4-4ff8-96a3-5767e9969357",
  slug: "evelyn-parker-scheming-siren",
  rulesText: "When a rival steals one or more friendly gigs, if this unit is spent, draw a card.",
  subname: "Scheming Siren",
  name: "Evelyn Parker",
  displayName: "Evelyn Parker - Scheming Siren",
  canonicalId: "evelyn-parker-scheming-siren",
  color: "blue",
  classifications: ["Doll"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α011",
  artist: "Olgierd Ciszak",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a011.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 1,
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
}) satisfies UnitCardDefinition;
