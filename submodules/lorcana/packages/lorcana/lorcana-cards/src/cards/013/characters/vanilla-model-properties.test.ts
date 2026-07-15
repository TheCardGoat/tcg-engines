import { describe, expect, it } from "bun:test";
import type { CharacterCard } from "@tcg/lorcana-types";
import { isabelaMadrigalKindCultivator } from "./003-isabela-madrigal-kind-cultivator";
import { tylerNguyenbaker4townFan } from "./004-tyler-nguyen-baker-4town-fan";
import { maleficentExultantSpellcaster } from "./039-maleficent-exultant-spellcaster";
import { meekoLuckyRaccoon } from "./047-meeko-lucky-raccoon";
import { tinkerBellFindingAWay } from "./056-tinker-bell-finding-a-way";
import { minnieMouseCuriousAdventurer } from "./087-minnie-mouse-curious-adventurer";
import { copperCreativeStoryteller } from "./090-copper-creative-storyteller";
import { cetusMightySerpent } from "./096-cetus-mighty-serpent";
import { kuzcoPickyCustomer } from "./111-kuzco-picky-customer";
import { splodyheadExperiment619 } from "./117-splodyhead-experiment-619";
import { peterPanVineDuelist } from "./131-peter-pan-vine-duelist";
import { mrsHasagawaFruitVendor } from "./150-mrs-hasagawa-fruit-vendor";
import { pigletHunnyMageApprentice } from "./154-piglet-hunny-mage-apprentice";
import { mickeyMouseInquisitiveExplorer } from "./155-mickey-mouse-inquisitive-explorer";
import { stitchProtectorOfFrogs } from "./180-stitch-protector-of-frogs";
import { mataMeatHutWaitress } from "./182-mata-meat-hut-waitress";
import { theIrateChefMeatHutCook } from "./190-the-irate-chef-meat-hut-cook";

const vanillaCharacters: Array<{
  card: CharacterCard;
  cost: number;
  strength: number;
  willpower: number;
  lore: number;
}> = [
  { card: isabelaMadrigalKindCultivator, cost: 2, strength: 2, willpower: 4, lore: 1 },
  { card: tylerNguyenbaker4townFan, cost: 1, strength: 2, willpower: 2, lore: 1 },
  { card: maleficentExultantSpellcaster, cost: 1, strength: 2, willpower: 2, lore: 1 },
  { card: meekoLuckyRaccoon, cost: 1, strength: 1, willpower: 3, lore: 1 },
  { card: tinkerBellFindingAWay, cost: 2, strength: 2, willpower: 2, lore: 2 },
  { card: minnieMouseCuriousAdventurer, cost: 1, strength: 2, willpower: 2, lore: 1 },
  { card: copperCreativeStoryteller, cost: 2, strength: 2, willpower: 2, lore: 2 },
  { card: cetusMightySerpent, cost: 6, strength: 6, willpower: 7, lore: 2 },
  { card: kuzcoPickyCustomer, cost: 2, strength: 5, willpower: 1, lore: 1 },
  { card: splodyheadExperiment619, cost: 3, strength: 3, willpower: 3, lore: 2 },
  { card: peterPanVineDuelist, cost: 1, strength: 2, willpower: 2, lore: 1 },
  { card: mrsHasagawaFruitVendor, cost: 2, strength: 3, willpower: 3, lore: 1 },
  { card: pigletHunnyMageApprentice, cost: 1, strength: 2, willpower: 2, lore: 1 },
  { card: mickeyMouseInquisitiveExplorer, cost: 4, strength: 3, willpower: 5, lore: 2 },
  { card: stitchProtectorOfFrogs, cost: 1, strength: 1, willpower: 3, lore: 1 },
  { card: mataMeatHutWaitress, cost: 1, strength: 2, willpower: 2, lore: 1 },
  { card: theIrateChefMeatHutCook, cost: 4, strength: 5, willpower: 5, lore: 1 },
];

describe("Attack of the Vine! vanilla characters", () => {
  it.each(vanillaCharacters)(
    "$card.name - $card.version has printed vanilla stats",
    (entry: (typeof vanillaCharacters)[number]) => {
      expect(entry.card.vanilla).toBe(true);
      expect(entry.card.abilities).toBeUndefined();
      expect(entry.card.cost).toBe(entry.cost);
      expect(entry.card.strength).toBe(entry.strength);
      expect(entry.card.willpower).toBe(entry.willpower);
      expect(entry.card.lore).toBe(entry.lore);
    },
  );
});
