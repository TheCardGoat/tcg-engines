/**
 * Token definition registry for the test harness.
 *
 * The engine is cards-package-free: it never imports card definitions
 * directly. Instead, the harness pre-registers definitions onto match state.
 * This module bridges that gap for tokens: it imports each catalog token
 * module directly (avoiding the heavy full-catalog index), and registers
 * their full definitions (abilities, keywords, numeric stats) into
 * `state.cardDefinitions` under the `token:${slug}` keys the engine uses for
 * token creation.
 *
 * This lets created tokens carry their CR 8.6.x abilities (Gold "draw a card",
 * Ponder "end phase draw", Runechant "deal 1 arcane", Hyper Driver steam
 * counters, etc.) instead of the ability-less synthetic shells produced by
 * {@link syntheticTokenBaseProperties}.
 */

import type { FabCardDefinitionInput } from "../cards.ts";
import { toFabCardDefinition } from "../cards.ts";

// Import token modules directly from the sibling cards package. Each module
// is small and self-contained (abilities + types + stats), so importing them
// individually avoids pulling in the entire multi-thousand-card catalog index
// (which is too heavy for the test framework's module initialization).
import { flurry } from "../../../cards/src/cards/tokens/flurry.ts";
import { confidence } from "../../../cards/src/cards/tokens/confidence.ts";
import { toughness } from "../../../cards/src/cards/tokens/toughness.ts";
import { bloodrotPox } from "../../../cards/src/cards/tokens/bloodrot-pox.ts";
import { frailty } from "../../../cards/src/cards/tokens/frailty.ts";
import { inertia } from "../../../cards/src/cards/tokens/inertia.ts";
import { runechant } from "../../../cards/src/cards/tokens/runechant.ts";
import { soulShackle } from "../../../cards/src/cards/tokens/soul-shackle.ts";
import { fealty } from "../../../cards/src/cards/tokens/fealty.ts";
import { zenState } from "../../../cards/src/cards/tokens/zen-state.ts";
import { copper } from "../../../cards/src/cards/tokens/copper.ts";
import { ash } from "../../../cards/src/cards/tokens/ash.ts";
import { aetherAshwing } from "../../../cards/src/cards/tokens/aether-ashwing.ts";
import { nasrethTheSoulHarrower } from "../../../cards/src/cards/tokens/nasreth-the-soul-harrower.ts";
import { courage } from "../../../cards/src/cards/tokens/courage.ts";
import { eloquence } from "../../../cards/src/cards/tokens/eloquence.ts";
import { crouchingTiger } from "../../../cards/src/cards/actions/crouching-tiger.ts";
import { corruptedCorpse } from "../../../cards/src/cards/actions/corrupted-corpse.ts";
import { fangStrike } from "../../../cards/src/cards/attack-reactions/fang-strike.ts";
import { slither } from "../../../cards/src/cards/attack-reactions/slither.ts";
import { gold } from "../../../cards/src/cards/tokens/gold.ts";
import { ponder } from "../../../cards/src/cards/tokens/ponder.ts";
import { spellbaneAegis } from "../../../cards/src/cards/tokens/spellbane-aegis.ts";
import { embodimentOfEarth } from "../../../cards/src/cards/tokens/embodiment-of-earth.ts";
import { embodimentOfLightning } from "../../../cards/src/cards/tokens/embodiment-of-lightning.ts";
import { frostbite } from "../../../cards/src/cards/tokens/frostbite.ts";
import { hyperDriver } from "../../../cards/src/cards/tokens/hyper-driver.ts";
import { silver } from "../../../cards/src/cards/tokens/silver.ts";
import { diamond } from "../../../cards/src/cards/tokens/diamond.ts";
import { grapheneChelicera } from "../../../cards/src/cards/weapons/graphene-chelicera.ts";
import { cintariSellsword } from "../../../cards/src/cards/tokens/cintari-sellsword.ts";
import { agility } from "../../../cards/src/cards/tokens/agility.ts";
import { blasmophetTheInsatiableHunger } from "../../../cards/src/cards/tokens/blasmophet-the-insatiable-hunger.ts";
import { gateToIArathael } from "../../../cards/src/cards/tokens/gate-to-i-arathael.ts";
import { spectralShield } from "../../../cards/src/cards/tokens/spectral-shield.ts";
import { blasmophetTheSoulHarvester } from "../../../cards/src/cards/tokens/blasmophet-the-soul-harvester.ts";
import { ursurTheSoulReaper } from "../../../cards/src/cards/tokens/ursur-the-soul-reaper.ts";
import { lightningFlow } from "../../../cards/src/cards/tokens/lightning-flow.ts";
import { sigilOfFate } from "../../../cards/src/cards/tokens/sigil-of-fate.ts";
import { quicken } from "../../../cards/src/cards/tokens/quicken.ts";
import { goldenCog } from "../../../cards/src/cards/tokens/golden-cog.ts";
import { goldkissRum } from "../../../cards/src/cards/tokens/goldkiss-rum.ts";
import { bait } from "../../../cards/src/cards/tokens/bait.ts";
import { might } from "../../../cards/src/cards/tokens/might.ts";
import { vigor } from "../../../cards/src/cards/tokens/vigor.ts";
import { seismicSurge } from "../../../cards/src/cards/tokens/seismic-surge.ts";
import { bladeDance } from "../../../cards/src/cards/tokens/blade-dance.ts";
import { goldfinHarpoonYellow } from "../../../cards/src/cards/actions/goldfin-harpoon.ts";
import { crackedBaubleYellow } from "../../../cards/src/cards/resources/cracked-bauble.ts";

import { flurryI18n } from "../../../cards/src/cards/tokens/flurry.i18n.ts";
import { confidenceI18n } from "../../../cards/src/cards/tokens/confidence.i18n.ts";
import { toughnessI18n } from "../../../cards/src/cards/tokens/toughness.i18n.ts";
import { bloodrotPoxI18n } from "../../../cards/src/cards/tokens/bloodrot-pox.i18n.ts";
import { frailtyI18n } from "../../../cards/src/cards/tokens/frailty.i18n.ts";
import { inertiaI18n } from "../../../cards/src/cards/tokens/inertia.i18n.ts";
import { runechantI18n } from "../../../cards/src/cards/tokens/runechant.i18n.ts";
import { soulShackleI18n } from "../../../cards/src/cards/tokens/soul-shackle.i18n.ts";
import { fealtyI18n } from "../../../cards/src/cards/tokens/fealty.i18n.ts";
import { zenStateI18n } from "../../../cards/src/cards/tokens/zen-state.i18n.ts";
import { copperI18n } from "../../../cards/src/cards/tokens/copper.i18n.ts";
import { ashI18n } from "../../../cards/src/cards/tokens/ash.i18n.ts";
import { aetherAshwingI18n } from "../../../cards/src/cards/tokens/aether-ashwing.i18n.ts";
import { nasrethTheSoulHarrowerI18n } from "../../../cards/src/cards/tokens/nasreth-the-soul-harrower.i18n.ts";
import { courageI18n } from "../../../cards/src/cards/tokens/courage.i18n.ts";
import { eloquenceI18n } from "../../../cards/src/cards/tokens/eloquence.i18n.ts";
import { crouchingTigerI18n } from "../../../cards/src/cards/actions/crouching-tiger.i18n.ts";
import { corruptedCorpseI18n } from "../../../cards/src/cards/actions/corrupted-corpse.i18n.ts";
import { fangStrikeI18n } from "../../../cards/src/cards/attack-reactions/fang-strike.i18n.ts";
import { slitherI18n } from "../../../cards/src/cards/attack-reactions/slither.i18n.ts";
import { goldI18n } from "../../../cards/src/cards/tokens/gold.i18n.ts";
import { ponderI18n } from "../../../cards/src/cards/tokens/ponder.i18n.ts";
import { spellbaneAegisI18n } from "../../../cards/src/cards/tokens/spellbane-aegis.i18n.ts";
import { embodimentOfEarthI18n } from "../../../cards/src/cards/tokens/embodiment-of-earth.i18n.ts";
import { embodimentOfLightningI18n } from "../../../cards/src/cards/tokens/embodiment-of-lightning.i18n.ts";
import { frostbiteI18n } from "../../../cards/src/cards/tokens/frostbite.i18n.ts";
import { hyperDriverI18n } from "../../../cards/src/cards/tokens/hyper-driver.i18n.ts";
import { silverI18n } from "../../../cards/src/cards/tokens/silver.i18n.ts";
import { diamondI18n } from "../../../cards/src/cards/tokens/diamond.i18n.ts";
import { grapheneCheliceraI18n } from "../../../cards/src/cards/weapons/graphene-chelicera.i18n.ts";
import { cintariSellswordI18n } from "../../../cards/src/cards/tokens/cintari-sellsword.i18n.ts";
import { agilityI18n } from "../../../cards/src/cards/tokens/agility.i18n.ts";
import { blasmophetTheInsatiableHungerI18n } from "../../../cards/src/cards/tokens/blasmophet-the-insatiable-hunger.i18n.ts";
import { gateToIArathaelI18n } from "../../../cards/src/cards/tokens/gate-to-i-arathael.i18n.ts";
import { spectralShieldI18n } from "../../../cards/src/cards/tokens/spectral-shield.i18n.ts";
import { blasmophetTheSoulHarvesterI18n } from "../../../cards/src/cards/tokens/blasmophet-the-soul-harvester.i18n.ts";
import { ursurTheSoulReaperI18n } from "../../../cards/src/cards/tokens/ursur-the-soul-reaper.i18n.ts";
import { lightningFlowI18n } from "../../../cards/src/cards/tokens/lightning-flow.i18n.ts";
import { sigilOfFateI18n } from "../../../cards/src/cards/tokens/sigil-of-fate.i18n.ts";
import { quickenI18n } from "../../../cards/src/cards/tokens/quicken.i18n.ts";
import { goldenCogI18n } from "../../../cards/src/cards/tokens/golden-cog.i18n.ts";
import { goldkissRumI18n } from "../../../cards/src/cards/tokens/goldkiss-rum.i18n.ts";
import { baitI18n } from "../../../cards/src/cards/tokens/bait.i18n.ts";
import { mightI18n } from "../../../cards/src/cards/tokens/might.i18n.ts";
import { vigorI18n } from "../../../cards/src/cards/tokens/vigor.i18n.ts";
import { seismicSurgeI18n } from "../../../cards/src/cards/tokens/seismic-surge.i18n.ts";
import { bladeDanceI18n } from "../../../cards/src/cards/tokens/blade-dance.i18n.ts";
import { goldfinHarpoonYellowI18n } from "../../../cards/src/cards/actions/goldfin-harpoon.i18n.ts";
import { crackedBaubleYellowI18n } from "../../../cards/src/cards/resources/cracked-bauble.i18n.ts";

/** Token rules paired with their authored printed names. */
const tokenModules = [
  { card: flurry, i18n: flurryI18n },
  { card: confidence, i18n: confidenceI18n },
  { card: toughness, i18n: toughnessI18n },
  { card: bloodrotPox, i18n: bloodrotPoxI18n },
  { card: frailty, i18n: frailtyI18n },
  { card: inertia, i18n: inertiaI18n },
  { card: runechant, i18n: runechantI18n },
  { card: soulShackle, i18n: soulShackleI18n },
  { card: fealty, i18n: fealtyI18n },
  { card: zenState, i18n: zenStateI18n },
  { card: copper, i18n: copperI18n },
  { card: ash, i18n: ashI18n },
  { card: aetherAshwing, i18n: aetherAshwingI18n },
  { card: nasrethTheSoulHarrower, i18n: nasrethTheSoulHarrowerI18n },
  { card: courage, i18n: courageI18n },
  { card: eloquence, i18n: eloquenceI18n },
  // Crouching Tiger is a non-Token Action created via create-token (Zen, etc.).
  // Register under token:crouching-tiger so created instances keep Attack /
  // ephemeral / go-again from the catalog card rather than a bare Token shell.
  { card: crouchingTiger, i18n: crouchingTigerI18n },
  // Corrupted Corpse is a non-Token Action/Zombie/Ally created via create-token
  // into banished (Malice death trigger).
  { card: corruptedCorpse, i18n: corruptedCorpseI18n },
  // Fang Strike is a non-Token Attack Reaction created via create-token
  // (Arousing Wave AR, etc.) into hand. Register under token:fang-strike so
  // the shell keeps MST023 resolution (+1{p} to target AAC) + ephemeral.
  { card: fangStrike, i18n: fangStrikeI18n },
  { card: slither, i18n: slitherI18n },
  { card: gold, i18n: goldI18n },
  { card: ponder, i18n: ponderI18n },
  { card: spellbaneAegis, i18n: spellbaneAegisI18n },
  { card: embodimentOfEarth, i18n: embodimentOfEarthI18n },
  { card: embodimentOfLightning, i18n: embodimentOfLightningI18n },
  { card: frostbite, i18n: frostbiteI18n },
  { card: hyperDriver, i18n: hyperDriverI18n },
  { card: silver, i18n: silverI18n },
  { card: diamond, i18n: diamondI18n },
  { card: grapheneChelicera, i18n: grapheneCheliceraI18n },
  { card: cintariSellsword, i18n: cintariSellswordI18n },
  { card: agility, i18n: agilityI18n },
  { card: blasmophetTheInsatiableHunger, i18n: blasmophetTheInsatiableHungerI18n },
  { card: gateToIArathael, i18n: gateToIArathaelI18n },
  { card: spectralShield, i18n: spectralShieldI18n },
  { card: blasmophetTheSoulHarvester, i18n: blasmophetTheSoulHarvesterI18n },
  { card: ursurTheSoulReaper, i18n: ursurTheSoulReaperI18n },
  { card: lightningFlow, i18n: lightningFlowI18n },
  { card: sigilOfFate, i18n: sigilOfFateI18n },
  { card: quicken, i18n: quickenI18n },
  { card: goldenCog, i18n: goldenCogI18n },
  { card: goldkissRum, i18n: goldkissRumI18n },
  { card: bait, i18n: baitI18n },
  { card: might, i18n: mightI18n },
  { card: vigor, i18n: vigorI18n },
  { card: seismicSurge, i18n: seismicSurgeI18n },
  // Blade Dance is a Token Aura created by Jive/Gutshot wagers: its printed
  // "next weapon attack destroys this and gets go again" behavior must ride on
  // created instances, not a bare shell.
  { card: bladeDance, i18n: bladeDanceI18n },
] as const;

/**
 * Map of token slug → {@link FabCardDefinitionInput}, built once from the catalog.
 * Covers all CR 8.6.x token keywords (Gold, Copper, Silver, Runechant,
 * Quicken, Seismic Surge, Ponder, Hyper Driver, Might, Vigor, Frostbite,
 * Soul Shackle, Spectral Shield, Ash, Cintari Sellsword, etc.).
 */
export const tokenDefinitionsBySlug: ReadonlyMap<string, FabCardDefinitionInput> = (() => {
  const map = new Map<string, FabCardDefinitionInput>();
  for (const { card, i18n } of tokenModules) {
    const slug = card.slug;
    if (!slug) continue;
    // Register under `token:${slug}` — the key the engine's `create-token`
    // effect and `create` reducer use for canonical ids.
    const printedName = i18n.locales.en.name;
    const definition = toFabCardDefinition({ ...card, name: printedName });
    // Paired layouts resolve their base from the raw front face; use the
    // authored name for the created face as well as the definition label.
    map.set(slug, { ...definition, base: { ...definition.base, names: [printedName] } });
  }
  const goldfin = toFabCardDefinition({
    ...goldfinHarpoonYellow,
    name: goldfinHarpoonYellowI18n.locales.en.name,
  });
  map.set("goldfin-harpoon", goldfin);
  const crackedBauble = toFabCardDefinition({
    ...crackedBaubleYellow,
    name: crackedBaubleYellowI18n.locales.en.name,
  });
  map.set("cracked-bauble", crackedBauble);
  return map;
})();

/**
 * Pre-register all catalog token definitions into a `cardDefinitions` record
 * under `token:${slug}` keys. Called during match setup so tokens created at
 * runtime resolve to their real catalog abilities via
 * `state.cardDefinitions[canonicalId].base`.
 *
 * Uses `??=` so explicit per-test overrides are preserved.
 */
export function registerTokenDefinitions(
  cardDefinitions: Record<string, FabCardDefinitionInput>,
): void {
  for (const [slug, definition] of tokenDefinitionsBySlug) {
    const key = `token:${slug}`;
    cardDefinitions[key] ??= definition;
    // Created cards (Corrupted Corpse, Crouching Tiger, …) are also looked up
    // by their printed catalog identity when a create-card effect names them.
    if (definition.canonicalId) cardDefinitions[definition.canonicalId] ??= definition;
  }
}
