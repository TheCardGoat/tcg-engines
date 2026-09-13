import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

const readyOnFirstWinEachTurn = AbilityBuilder.triggered()
  .text("The first time this Unit wins a fight each turn, ready it.")
  .onFightResolved({
    player: "friendly",
    result: "attackerWins",
    attacker: target.self(),
    defender: target.card({ controller: "rival", cardTypes: ["unit"] }),
  })
  .source(target.self())
  .effect(effect.ready({ target: target.self() }))
  .build();
readyOnFirstWinEachTurn.limits = ["firstTimeEachTurn"];

export const welcomeToNightCityRetailJohnnySilverhandNeverStopFighting = defineCyberpunkCard({
  id: "9a4002b0-0f0b-4c9a-a198-691d058b6dcc",
  canonicalId: "johnny-silverhand-never-stop-fighting",
  slug: "johnny-silverhand-never-stop-fighting",
  subname: "Never Stop Fighting",
  name: "Johnny Silverhand",
  displayName: "Johnny Silverhand: Never Stop Fighting",
  rulesText:
    "The first time this Unit wins a fight each turn, ready it.\nThis Unit wins all fights against CORPO Units.",
  color: "red",
  classifications: ["Merc", "Rocker", "Samurai"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "011",
  artist: "Łukasz Poller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/011.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  abilities: [
    {
      kind: "static",
      text: "This Unit wins all fights against CORPO Units.",
      effects: [
        {
          effect: "grantFightWinAgainst",
          target: {
            selector: "self",
          },
          classifications: ["Corpo"],
          duration: "continuous",
        },
      ],
    },
    readyOnFirstWinEachTurn,
  ],
  type: "unit",
  cost: 6,
  power: 8,
}) satisfies UnitCardDefinition;
