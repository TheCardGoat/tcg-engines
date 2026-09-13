import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { STRUCTURED_CARDS_BY_CANONICAL_ID } from "../src/generated/card-registry.generated.ts";

import { ravenousRabbleRed } from "../src/cards/actions/ravenous-rabble.ts";
import { zeroToSixtyRed } from "../src/cards/actions/zero-to-sixty.ts";
import { skullboneCrosswrap } from "../src/cards/equipment/skullbone-crosswrap.ts";
import { talismanicLens } from "../src/cards/equipment/talismanic-lens.ts";
import { optekalMonocleBlue } from "../src/cards/actions/optekal-monocle.ts";
import { whisperOfTheOracleRed } from "../src/cards/actions/whisper-of-the-oracle.ts";
import { dash } from "../src/cards/heroes/dash.ts";
import { cosmicDualityBlue } from "../src/cards/actions/cosmic-duality.ts";
import { zyggyStarlight } from "../src/cards/heroes/zyggy-starlight.ts";
import { poisonTheWellBlue } from "../src/cards/instants/poison-the-well.ts";
import { mightyWindupRed } from "../src/cards/actions/mighty-windup.ts";
import { agileWindupRed } from "../src/cards/actions/agile-windup.ts";
import { vigorousWindupRed } from "../src/cards/actions/vigorous-windup.ts";
import { startingStakeYellow } from "../src/cards/actions/starting-stake.ts";
import { bonebreakerBellowRed } from "../src/cards/actions/bonebreaker-bellow.ts";
import { wageMightBlue } from "../src/cards/actions/wage-might.ts";
import { headJabBlue } from "../src/cards/actions/head-jab.ts";
import { ravenousMeataxe } from "../src/cards/weapons/ravenous-meataxe.ts";
import { flashBoltRed } from "../src/cards/instants/flash-bolt.ts";
import { pilferTheTombBlue } from "../src/cards/instants/pilfer-the-tomb.ts";
import { ripOffTheTopYellow } from "../src/cards/actions/rip-off-the-top.ts";
import { toughAsARokBlue } from "../src/cards/actions/tough-as-a-rok.ts";
import { rockyardRodeoBlue } from "../src/cards/actions/rockyard-rodeo.ts";
import { wreckerRompBlue } from "../src/cards/actions/wrecker-romp.ts";
import { rok } from "../src/cards/weapons/rok.ts";
import { spectralProcessionRed } from "../src/cards/actions/spectral-procession.ts";
import { mutatedMassBlue } from "../src/cards/actions/mutated-mass.ts";
import { spectralShield } from "../src/cards/tokens/spectral-shield.ts";
import { splatterSkullRed as splatterSkull } from "../src/cards/actions/splatter-skull.ts";
import { everbloomLifeBlue } from "../src/cards/actions/everbloom-life.ts";
import { invokeYenduraiRed } from "../src/cards/actions/invoke-yendurai.ts";
import { sigilOfSolaceRed } from "../src/cards/instants/sigil-of-solace.ts";
import { crackedBaubleYellow } from "../src/cards/resources/cracked-bauble.ts";
import { alphaRampageRed } from "../src/cards/actions/alpha-rampage.ts";
import { snatchRed } from "../src/cards/actions/snatch.ts";
import { nimblismYellow } from "../src/cards/actions/nimblism.ts";
import { braveforgeBracers } from "../src/cards/equipment/braveforge-bracers.ts";
import { icebindRed } from "../src/cards/actions/icebind.ts";
import { blizzardBlue } from "../src/cards/instants/blizzard.ts";
import { entwineIceRed } from "../src/cards/actions/entwine-ice.ts";
import { spearsOfSurrealityRed } from "../src/cards/actions/spears-of-surreality.ts";
import { holoShieldRed } from "../src/cards/instants/holo-shield.ts";
import { leaveNoWitnessesRed } from "../src/cards/actions/leave-no-witnesses.ts";
import { plunderThePoorRed } from "../src/cards/actions/plunder-the-poor.ts";
import { alphaInstinctBlue } from "../src/cards/actions/alpha-instinct.ts";
import { hulkUpBlue } from "../src/cards/actions/hulk-up.ts";
import { windUpTheCrowdBlue } from "../src/cards/actions/wind-up-the-crowd.ts";
import { silverstrideDodgers } from "../src/cards/equipment/silverstride-dodgers.ts";
import { hadronColliderRed } from "../src/cards/actions/hadron-collider.ts";
import { dawnblade } from "../src/cards/weapons/dawnblade.ts";
import { theSuspenseIsKillingMeBlue } from "../src/cards/instants/the-suspense-is-killing-me.ts";
import { indefensiblyHonedBlue } from "../src/cards/actions/indefensibly-honed.ts";
import { songOfSinewYellow } from "../src/cards/actions/song-of-sinew.ts";
import { brutalAssaultBlue } from "../src/cards/actions/brutal-assault.ts";
import { digInYellow } from "../src/cards/actions/dig-in.ts";
import { noHeroStandsAloneYellow } from "../src/cards/actions/no-hero-stands-alone.ts";
import { tuffnut } from "../src/cards/heroes/tuffnut.ts";
import { toughness } from "../src/cards/tokens/toughness.ts";
import { boltyn } from "../src/cards/heroes/boltyn.ts";
import { boltOfCourageRed } from "../src/cards/actions/bolt-of-courage.ts";
import { beamingBravadoYellow } from "../src/cards/actions/beaming-bravado.ts";
import { battlefieldBlitzYellow } from "../src/cards/actions/battlefield-blitz.ts";
import { battlefieldBeaconYellow } from "../src/cards/actions/battlefield-beacon.ts";
import { expressLightningYellow } from "../src/cards/actions/express-lightning.ts";
import { illuminateYellow } from "../src/cards/actions/illuminate.ts";
import { takeFlightYellow } from "../src/cards/actions/take-flight.ts";
import { courageOfBladehold } from "../src/cards/equipment/courage-of-bladehold.ts";
import { courageousSteelhandRed } from "../src/cards/attack-reactions/courageous-steelhand.ts";
import { cintariSaber } from "../src/cards/weapons/cintari-saber.ts";
import { engulfingLightRed, engulfingLightYellow } from "../src/cards/actions/engulfing-light.ts";
import { luminaAscensionYellow } from "../src/cards/actions/lumina-ascension.ts";
import { serBoltynBreakerOfDawn } from "../src/cards/heroes/ser-boltyn-breaker-of-dawn.ts";
import { snapdragonScalers } from "../src/cards/equipment/snapdragon-scalers.ts";
import { nimblismBlue } from "../src/cards/actions/nimblism.ts";
import { spireSnipingRed } from "../src/cards/actions/spire-sniping.ts";
import { barbedCastaway } from "../src/cards/weapons/barbed-castaway.ts";
import { sutcliffeSResearchNotesRed } from "../src/cards/actions/sutcliffe-s-research-notes.ts";
import { coerciveTendencyBlue } from "../src/cards/attack-reactions/coercive-tendency.ts";
import { arakni } from "../src/cards/heroes/arakni.ts";
import { malignRed } from "../src/cards/actions/malign.ts";
import { azaleaAceInTheHole } from "../src/cards/heroes/azalea-ace-in-the-hole.ts";
import { becomeTheBottleRed } from "../src/cards/actions/become-the-bottle.ts";
import { crouchingTiger } from "../src/cards/actions/crouching-tiger.ts";
import { surgingStrikeRed } from "../src/cards/actions/surging-strike.ts";
import { gustwaveOfTheSecondWindRed } from "../src/cards/actions/gustwave-of-the-second-wind.ts";
import { retraceThePastBlue } from "../src/cards/actions/retrace-the-past.ts";
import { tigrineReflexRed } from "../src/cards/actions/tigrine-reflex.ts";
import { whelmingGustwaveRed } from "../src/cards/actions/whelming-gustwave.ts";
import { iraCrimsonHaze } from "../src/cards/heroes/ira-crimson-haze.ts";
import { katsu } from "../src/cards/heroes/katsu.ts";
import { blessingOfThemisYellow } from "../src/cards/actions/blessing-of-themis.ts";
import { censorRed } from "../src/cards/actions/censor.ts";
import { chainsOfEminenceRed } from "../src/cards/actions/chains-of-eminence.ts";
import { headLeadsTheTailRed } from "../src/cards/actions/head-leads-the-tail.ts";
import { imperialEdictRed } from "../src/cards/actions/imperial-edict.ts";
import { leaveEmSpeechlessBlue } from "../src/cards/actions/leave-em-speechless.ts";
import { nullTimeZoneBlue } from "../src/cards/actions/null-time-zone.ts";
import { phantasmalSymbiosisYellow } from "../src/cards/actions/phantasmal-symbiosis.ts";
import { pickACardAnyCardRed } from "../src/cards/actions/pick-a-card-any-card.ts";
import { shapelessFormBlue } from "../src/cards/actions/shapeless-form.ts";
import { shiftingWindsOfTheMysticBeastBlue } from "../src/cards/actions/shifting-winds-of-the-mystic-beast.ts";
import { talismanOfCremationBlue } from "../src/cards/actions/talisman-of-cremation.ts";
import { hunterOrHuntedBlue } from "../src/cards/defense-reactions/hunter-or-hunted.ts";
import { maskOfManyFaces } from "../src/cards/equipment/mask-of-many-faces.ts";
import { embodyGreatnessYellow } from "../src/cards/instants/embody-greatness.ts";
import { benjiThePiercingWind } from "../src/cards/heroes/benji-the-piercing-wind.ts";
import { bravoShowstopper } from "../src/cards/heroes/bravo-showstopper.ts";
import { emperorDracaiOfAesir } from "../src/cards/heroes/emperor-dracai-of-aesir.ts";
import { prism } from "../src/cards/heroes/prism.ts";
import { shiyanaDiamondGemini } from "../src/cards/heroes/shiyana-diamond-gemini.ts";
import { teklovossen } from "../src/cards/heroes/teklovossen.ts";
import { zen } from "../src/cards/heroes/zen.ts";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(packageRoot, "src/simulator-scenario-cards.generated.ts");
const definitions = {
  ravenousRabbleRed,
  dash,
  cosmicDualityBlue,
  zyggyStarlight,
  poisonTheWellBlue,
  mightyWindupRed,
  agileWindupRed,
  vigorousWindupRed,
  startingStakeYellow,
  headJabBlue,
  ravenousMeataxe,
  flashBoltRed,
  pilferTheTombBlue,
  ripOffTheTopYellow,
  toughAsARokBlue,
  rockyardRodeoBlue,
  wreckerRompBlue,
  rok,
  spectralProcessionRed,
  mutatedMassBlue,
  spectralShield,
  splatterSkull,
  everbloomLifeBlue,
  invokeYenduraiRed,
  sigilOfSolaceRed,
  crackedBaubleYellow,
  zeroToSixtyRed,
  skullboneCrosswrap,
  talismanicLens,
  optekalMonocleBlue,
  whisperOfTheOracleRed,
  bonebreakerBellowRed,
  wageMightBlue,
  alphaRampageRed,
  snatchRed,
  nimblismYellow,
  braveforgeBracers,
  icebindRed,
  blizzardBlue,
  entwineIceRed,
  spearsOfSurrealityRed,
  holoShieldRed,
  leaveNoWitnessesRed,
  plunderThePoorRed,
  alphaInstinctBlue,
  hulkUpBlue,
  windUpTheCrowdBlue,
  silverstrideDodgers,
  hadronColliderRed,
  dawnblade,
  theSuspenseIsKillingMeBlue,
  indefensiblyHonedBlue,
  songOfSinewYellow,
  brutalAssaultBlue,
  digInYellow,
  noHeroStandsAloneYellow,
  tuffnut,
  toughness,
  boltyn,
  boltOfCourageRed,
  beamingBravadoYellow,
  battlefieldBlitzYellow,
  battlefieldBeaconYellow,
  expressLightningYellow,
  illuminateYellow,
  takeFlightYellow,
  courageOfBladehold,
  courageousSteelhandRed,
  cintariSaber,
  engulfingLightRed,
  engulfingLightYellow,
  luminaAscensionYellow,
  serBoltynBreakerOfDawn,
  snapdragonScalers,
  nimblismBlue,
  spireSnipingRed,
  barbedCastaway,
  sutcliffeSResearchNotesRed,
  coerciveTendencyBlue,
  arakni,
  malignRed,
  azaleaAceInTheHole,
  becomeTheBottleRed,
  crouchingTiger,
  surgingStrikeRed,
  gustwaveOfTheSecondWindRed,
  retraceThePastBlue,
  tigrineReflexRed,
  whelmingGustwaveRed,
  iraCrimsonHaze,
  katsu,
  blessingOfThemisYellow,
  censorRed,
  chainsOfEminenceRed,
  headLeadsTheTailRed,
  imperialEdictRed,
  leaveEmSpeechlessBlue,
  nullTimeZoneBlue,
  phantasmalSymbiosisYellow,
  pickACardAnyCardRed,
  shapelessFormBlue,
  shiftingWindsOfTheMysticBeastBlue,
  talismanOfCremationBlue,
  hunterOrHuntedBlue,
  maskOfManyFaces,
  embodyGreatnessYellow,
  benjiThePiercingWind,
  bravoShowstopper,
  emperorDracaiOfAesir,
  prism,
  shiyanaDiamondGemini,
  teklovossen,
  zen,
};

const exports = Object.entries(definitions)
  .map(([name, definition]) => {
    const localized = STRUCTURED_CARDS_BY_CANONICAL_ID.get(definition.canonicalId);
    if (!localized) throw new Error(`Missing localized simulator card ${definition.canonicalId}`);
    return `export const ${name} = ${JSON.stringify(localized, null, 2)} as const satisfies FleshAndBloodCard;`;
  })
  .join("\n\n");

await writeFile(
  outputPath,
  `import type { FleshAndBloodCard } from "@tcg/flesh-and-blood-types";\n\n/** Generated bounded authored definitions for simulator fixtures. */\n${exports}\n`,
);

console.log(`Generated ${Object.keys(definitions).length} bounded simulator scenario cards.`);
