import {
  GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES,
  type GrandArchiveTextDeckInput,
} from "@tcg/grand-archive-engine/automation";

// Official Print & Play 1.4 starter lists. Card identities resolve against the current catalog.
// https://www.gatcg.com/lorraine-pnp.pdf
// https://www.gatcg.com/rai-pnp.pdf
export const grandArchivePracticeDecks = [
  {
    id: "lorraine-pnp-1-4",
    name: "Lorraine — Print & Play 1.4",
    deck: {
      startingChampion: "Spirit of Wind",
      materialDeck: `1x Spirit of Wind
1x Lorraine, Wandering Warrior
1x Lorraine, Blademaster
1x Lorraine, Crux Knight
1x Clarent, Sword of Peace
1x Fire Resonance Bauble
1x Warrior's Longsword
1x Ornamental Greatsword
1x Sword of Seeking
1x Life Essence Amulet
1x Prismatic Edge
1x Seer's Sword`,
      mainDeck: `3x Banner Knight
4x Crusader of Aesa
3x Dream Fairy
2x Dungeon Guide
4x Esteemed Knight
4x Honorable Vanguard
4x Weaponsmith
3x Crux Sight
2x Disorienting Winds
3x Favorable Winds
2x Inspiring Call
4x Scry the Skies
2x Spirit Blade: Ascension
1x Spirit Blade: Dispersion
2x Spirit Blade: Infusion
3x Spirit's Blessing
2x Hurricane Sweep
4x Spirit Blade: Ghost Strike
3x Savage Slash
2x Sudden Steel
3x Wind Cutter`,
    },
  },
  {
    id: "rai-pnp-1-4",
    name: "Rai — Print & Play 1.4",
    deck: {
      startingChampion: "Spirit of Fire",
      materialDeck: `1x Spirit of Fire
1x Rai, Spellcrafter
1x Rai, Archmage
1x Rai, Storm Seer
1x Endura, Scepter of Ignition
1x Wind Resonance Bauble
1x Tome of Knowledge
1x Surveillance Stone
1x Mana Limiter
1x Life Essence Amulet
1x Crystal of Empowerment
1x Arcanist's Prism`,
      mainDeck: `2x Blitz Mage
2x Dungeon Guide
3x Impassioned Tutor
4x Library Witch
3x Magus Disciple
3x Barrier Servant
4x Ignite the Soul
2x Anger the Skies
4x Arcane Blast
4x Arcane Disposition
4x Arcane Sight
2x Careful Study
4x Creative Shock
4x Fireball
2x Focused Flames
4x Peer into Mana
1x Power Overwhelming
2x Purge in Flames
4x Scry the Skies
2x Spellshield: Arcane`,
    },
  },
] as const satisfies readonly { id: string; name: string; deck: GrandArchiveTextDeckInput }[];

export function getGrandArchivePracticeCatalog() {
  return {
    decks: grandArchivePracticeDecks.map(({ id, name }) => ({ id, name })),
    strategies: GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES.filter(
      (option) => !("testOnly" in option && option.testOnly),
    ).map(({ id }) => ({ id })),
  };
}
