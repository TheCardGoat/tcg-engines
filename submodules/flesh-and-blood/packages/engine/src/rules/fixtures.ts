/**
 * Shared real catalog card imports for CR chapter suites.
 * Paths resolve into packages/cards source modules (no dist catalog required).
 * Color-based slugs: pitch variants use -red/-yellow/-blue file suffixes.
 *
 * Public aliases keep pre-migration names used by suites (`heartOfFyendal`,
 * `sinkBelow`, `volticBolt`) so tests do not churn with the file rename.
 *
 * This module is also the ONE home for the shared named scenario factories
 * over {@link FabPlayerSetup} (task #6 clean break: the 20 per-set
 * `*-production-helpers.ts` start-factories were folded into
 * {@link bravoVsDash}).
 */
import { FabTestEngine, type FabPlayerSetup } from "../index.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { bravo } from "../../../cards/src/cards/heroes/bravo.ts";
import { nimblismBlue } from "../../../cards/src/cards/actions/nimblism.ts";
export { dash, bravo, nimblismBlue };
export { snatchRed } from "../../../cards/src/cards/actions/snatch.ts";
export { nimbleStrikeRed } from "../../../cards/src/cards/actions/nimble-strike.ts";
export { nimblismRed } from "../../../cards/src/cards/actions/nimblism.ts";
export { potionOfStrengthBlue } from "../../../cards/src/cards/actions/potion-of-strength.ts";
export { scourTheBattlescapeRed } from "../../../cards/src/cards/actions/scour-the-battlescape.ts";
export { regurgitatingSlogRed } from "../../../cards/src/cards/actions/regurgitating-slog.ts";
export { demolitionCrewRed } from "../../../cards/src/cards/actions/demolition-crew.ts";
export { unmovableRed } from "../../../cards/src/cards/defense-reactions/unmovable.ts";
export {
  sinkBelowRed as sinkBelow,
  sinkBelowRed,
} from "../../../cards/src/cards/defense-reactions/sink-below.ts";
export { scabskinLeathers } from "../../../cards/src/cards/equipment/scabskin-leathers.ts";
export { parryBlade } from "../../../cards/src/cards/equipment/parry-blade.ts";
export { aurumAegis } from "../../../cards/src/cards/equipment/aurum-aegis.ts";
export { tigerEyeReflexBlue } from "../../../cards/src/cards/blocks/tiger-eye-reflex.ts";
export {
  heartOfFyendalBlue as heartOfFyendal,
  heartOfFyendalBlue,
} from "../../../cards/src/cards/resources/heart-of-fyendal.ts";
export { crackedBaubleYellow } from "../../../cards/src/cards/resources/cracked-bauble.ts";
export { scarForAScarRed } from "../../../cards/src/cards/actions/scar-for-a-scar.ts";
export { frayingLifeforceRed } from "../../../cards/src/cards/actions/fraying-lifeforce.ts";
export { pummelRed } from "../../../cards/src/cards/attack-reactions/pummel.ts";
export { rattleBonesRed } from "../../../cards/src/cards/actions/rattle-bones.ts";
export { passOverBlue } from "../../../cards/src/cards/instants/pass-over.ts";
export { cintariSellsword } from "../../../cards/src/cards/tokens/cintari-sellsword.ts";
export { ironrotHelm } from "../../../cards/src/cards/equipment/ironrot-helm.ts";
export { packHuntYellow } from "../../../cards/src/cards/actions/pack-hunt.ts";
export { disableRed } from "../../../cards/src/cards/actions/disable.ts";
export { sigilOfSolaceRed } from "../../../cards/src/cards/instants/sigil-of-solace.ts";
export { commandAndConquerRed } from "../../../cards/src/cards/actions/command-and-conquer.ts";
export { runeragerSwarmYellow } from "../../../cards/src/cards/actions/runerager-swarm.ts";
export {
  volticBoltRed as volticBolt,
  volticBoltRed,
} from "../../../cards/src/cards/actions/voltic-bolt.ts";
export { throttleRed } from "../../../cards/src/cards/actions/throttle.ts";
export { takeAimRed } from "../../../cards/src/cards/actions/take-aim.ts";
export { whisperOfTheOracleBlue } from "../../../cards/src/cards/actions/whisper-of-the-oracle.ts";
export { nullruneHood } from "../../../cards/src/cards/equipment/nullrune-hood.ts";
export { cutNCarveRed } from "../../../cards/src/cards/actions/cut-n-carve.ts";
export { upOnAPedestalBlue } from "../../../cards/src/cards/instants/up-on-a-pedestal.ts";
export { helmOfTheAdored } from "../../../cards/src/cards/equipment/helm-of-the-adored.ts";
export { stonewallImpasse } from "../../../cards/src/cards/equipment/stonewall-impasse.ts";
export { dawnblade } from "../../../cards/src/cards/weapons/dawnblade.ts";
export { phantasmaclasmRed } from "../../../cards/src/cards/actions/phantasmaclasm.ts";
export { parableOfHumilityYellow } from "../../../cards/src/cards/instants/parable-of-humility.ts";
export { entwineLightningBlue } from "../../../cards/src/cards/actions/entwine-lightning.ts";
export { heavenSClawsRed } from "../../../cards/src/cards/actions/heaven-s-claws.ts";
export { thunderQuakeBlue } from "../../../cards/src/cards/actions/thunder-quake.ts";
export { writhingBeastHulkRed } from "../../../cards/src/cards/actions/writhing-beast-hulk.ts";
export { aetherizeBlue } from "../../../cards/src/cards/instants/aetherize.ts";
export { rottenOldBuckler } from "../../../cards/src/cards/equipment/rotten-old-buckler.ts";
export { channelMountIsenBlue } from "../../../cards/src/cards/actions/channel-mount-isen.ts";
export { drillShotRed } from "../../../cards/src/cards/actions/drill-shot.ts";
export { longShotRed } from "../../../cards/src/cards/actions/long-shot.ts";
export { immobilizingShotRed } from "../../../cards/src/cards/actions/immobilizing-shot.ts";
export { falconWingYellow } from "../../../cards/src/cards/actions/falcon-wing.ts";
export { deathDealer } from "../../../cards/src/cards/weapons/death-dealer.ts";
export { azalea } from "../../../cards/src/cards/heroes/azalea.ts";
export { boundingDemigonRed } from "../../../cards/src/cards/actions/bounding-demigon.ts";
export { craneDanceRed } from "../../../cards/src/cards/actions/crane-dance.ts";
export { soulbeadStrikeRed } from "../../../cards/src/cards/actions/soulbead-strike.ts";
export { creepRed } from "../../../cards/src/cards/actions/creep.ts";
export { crouchingTiger } from "../../../cards/src/cards/actions/crouching-tiger.ts";
export { eyeOfOphidiaBlue } from "../../../cards/src/cards/resources/eye-of-ophidia.ts";
export { healingBalmYellow } from "../../../cards/src/cards/actions/healing-balm.ts";
export { tomeOfFyendalYellow } from "../../../cards/src/cards/actions/tome-of-fyendal.ts";
export { forceSightRed as forceSight } from "../../../cards/src/cards/actions/force-sight.ts";
export { cosmicFlareRed } from "../../../cards/src/cards/instants/cosmic-flare.ts";
export { arcticIncarcerationBlue } from "../../../cards/src/cards/actions/arctic-incarceration.ts";
export { callToTheGraveBlue } from "../../../cards/src/cards/actions/call-to-the-grave.ts";
export { badBreathRed } from "../../../cards/src/cards/actions/bad-breath.ts";
export { blinkBlue } from "../../../cards/src/cards/instants/blink.ts";
export { stirThePotBlue } from "../../../cards/src/cards/instants/stir-the-pot.ts";
export { villainousPoseRed } from "../../../cards/src/cards/actions/villainous-pose.ts";
export { heroicPoseBlue } from "../../../cards/src/cards/actions/heroic-pose.ts";
export { tomeOfPandemoniumYellow } from "../../../cards/src/cards/actions/tome-of-pandemonium.ts";
export { superstarBlue } from "../../../cards/src/cards/instants/superstar.ts";
export { shimmersOfSilverBlue } from "../../../cards/src/cards/actions/shimmers-of-silver.ts";
export { stickyFingers } from "../../../cards/src/cards/companions/sticky-fingers.ts";
export { hypothermiaBlue } from "../../../cards/src/cards/actions/hypothermia.ts";
export { searingShotRed as searingShot } from "../../../cards/src/cards/actions/searing-shot.ts";
export { gleamOfTheBladeRed } from "../../../cards/src/cards/attack-reactions/gleam-of-the-blade.ts";
export { deadEyeYellow as deadEye } from "../../../cards/src/cards/actions/dead-eye.ts";
export { flashRed as flash } from "../../../cards/src/cards/actions/flash.ts";

// ── Shared scenario factories (task #6 clean break) ────────────────────────

/** `n` copies of Nimblism Blue — the canonical pitch-3 filler. */
export function blues(n: number): (typeof nimblismBlue)[] {
  return Array.from({ length: n }, () => nimblismBlue);
}

/** Pitch blues until the card's printed cost is covered (printed pitch 3 each). */
export function pitchFor(card: { cost?: number | string }): (typeof nimblismBlue)[] {
  const cost = Number(card.cost ?? 0);
  if (cost <= 0) return [];
  return blues(Math.ceil(cost / 3));
}

/**
 * Named two-player scenario factory: Bravo vs Dash with legacy manual-flow
 * semantics. Consolidates the deleted per-set `startSet` / `startOmn` /
 * `startPen` / `startSup` factories — they differed only in which optional
 * fixture zones their loose `any` types listed; {@link FabPlayerSetup} covers
 * the superset.
 *
 * Defaults: hero bravo/dash, life 20, deck 6, resource points 0 (explicit —
 * legacy suites were authored against RP 0; pass `resourcePoints` to
 * override). The smart harness assists stay OFF for these suites: they walk
 * combat priority by hand and assert mid-combat state, so the manual
 * pass/block sequencing stays explicit and rules-visible (intentional opt-out
 * per the 2026-08-05 registry — do not "clean up").
 */
export function bravoVsDash(
  p1: Partial<FabPlayerSetup> = {},
  p2: Partial<FabPlayerSetup> = {},
): FabTestEngine {
  const playerA: FabPlayerSetup = {
    ...p1,
    hero: p1.hero ?? bravo,
    life: p1.life ?? 20,
    deck: p1.deck ?? 6,
    resourcePoints: p1.resourcePoints ?? 0,
  };
  const playerB: FabPlayerSetup = {
    ...p2,
    hero: p2.hero ?? dash,
    life: p2.life ?? 20,
    deck: p2.deck ?? 6,
    resourcePoints: p2.resourcePoints ?? 0,
  };
  return FabTestEngine.start(playerA, playerB, {
    autoPassPriority: false,
    autoPitch: false,
    pitchStack: "manual",
  });
}
export { crazyBrewBlue } from "../../../cards/src/cards/actions/crazy-brew.ts";
export { optekalMonocleBlue as optekalMonocle } from "../../../cards/src/cards/actions/optekal-monocle.ts";
export { garlandOfSpring } from "../../../cards/src/cards/equipment/garland-of-spring.ts";
export { heartbeatOfCandleholdBlue } from "../../../cards/src/cards/actions/heartbeat-of-candlehold.ts";
export { concealedObjectBlue } from "../../../cards/src/cards/instants/concealed-object.ts";
export { fyendalSFightingSpiritRed } from "../../../cards/src/cards/actions/fyendal-s-fighting-spirit.ts";
export { sigilOfShelterBlue } from "../../../cards/src/cards/instants/sigil-of-shelter.ts";
export { blessingOfSerenityRed } from "../../../cards/src/cards/instants/blessing-of-serenity.ts";
export { madcapMuscleRed } from "../../../cards/src/cards/actions/madcap-muscle.ts";
export { threadbareTunic } from "../../../cards/src/cards/equipment/threadbare-tunic.ts";
export { enchantingMelodyRed } from "../../../cards/src/cards/actions/enchanting-melody.ts";
export { aquaSeeingShell } from "../../../cards/src/cards/equipment/aqua-seeing-shell.ts";
export { willOfArcanaBlue } from "../../../cards/src/cards/resources/will-of-arcana.ts";
export { swingBigRed } from "../../../cards/src/cards/actions/swing-big.ts";
export { endlessArrowRed } from "../../../cards/src/cards/actions/endless-arrow.ts";
export { vestOfTheFirstFist } from "../../../cards/src/cards/equipment/vest-of-the-first-fist.ts";
export { timesnapPotionBlue } from "../../../cards/src/cards/actions/timesnap-potion.ts";
export { songOfSweetNectarBlue } from "../../../cards/src/cards/actions/song-of-sweet-nectar.ts";
export { embermawCenipaiRed } from "../../../cards/src/cards/actions/embermaw-cenipai.ts";
export { cashInYellow } from "../../../cards/src/cards/actions/cash-in.ts";
export { forebodingBoltBlue } from "../../../cards/src/cards/actions/foreboding-bolt.ts";
export { cerebellumProcessorBlue } from "../../../cards/src/cards/actions/cerebellum-processor.ts";
export { heartThrob } from "../../../cards/src/cards/equipment/heart-throb.ts";
export { blueSeaTricorn } from "../../../cards/src/cards/equipment/blue-sea-tricorn.ts";
export { coatOfFrost } from "../../../cards/src/cards/equipment/coat-of-frost.ts";
export { healingBalmRed } from "../../../cards/src/cards/actions/healing-balm.ts";
export { leadWithHeartBlue } from "../../../cards/src/cards/actions/lead-with-heart.ts";
export { faultLineRed } from "../../../cards/src/cards/actions/fault-line.ts";
export { woundedBullBlue } from "../../../cards/src/cards/actions/wounded-bull.ts";
