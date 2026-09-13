import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { diaoChanEnchantress } from "../cards/HVN/champions/diao-chan-enchantress.ts";
import { hailstormGuard } from "../cards/P24/actions/hailstorm-guard.ts";
import { arimaGaiasWings } from "../cards/DOA/allies/arima-gaias-wings.ts";
import { namelessChampionAt } from "../cards/AMB/champions/nameless-champion-at.ts";
import { surgingBolt } from "../cards/MRC/actions/surging-bolt.ts";
import { veiledDash } from "../cards/ALC/actions/veiled-dash.ts";
import { takePoint } from "../cards/P24/actions/take-point.ts";
import { zhangHeCloakOfNight } from "../cards/HVN/allies/zhang-he-cloak-of-night.ts";
import { sheathOfFacetedLapis } from "../cards/AMB/phantasias/sheath-of-faceted-lapis.ts";
import { poisonedDagger } from "../cards/DOA/items/poisoned-dagger.ts";
import { servilePossessions } from "../cards/P25/masteries/servile-possessions.ts";
import { malignantAthame } from "../cards/P24/weapons/malignant-athame.ts";
import { crimsonPrescience } from "../cards/AMB/actions/crimson-prescience.ts";
import { corhaziArsonist } from "../cards/FTC/allies/corhazi-arsonist.ts";
import { moteSear } from "../cards/PTM/actions/mote-sear.ts";
import { babyGraySlime } from "../cards/PRD/allies/baby-gray-slime.ts";
import { kongmingEruditeStrategist } from "../cards/HVN/champions/kongming-erudite-strategist.ts";
import { provokingStand } from "../cards/PRD/actions/provoking-stand.ts";
import { vanishingShot } from "../cards/ALC/items/vanishing-shot.ts";
import { scorchingStrafe } from "../cards/AMB/actions/scorching-strafe.ts";
import { automataGenesis } from "../cards/RDO/actions/automata-genesis.ts";
import { wonderlandsReign } from "../cards/DTR/phantasias/wonderlands-reign.ts";
import { pangTongYoungPhoenix } from "../cards/SP4/allies/pang-tong-young-phoenix.ts";
import { bubbleMage } from "../cards/P22/allies/bubble-mage.ts";
import { censerOfRestfulPeace } from "../cards/HVN/items/censer-of-restful-peace.ts";
import { voltaicSphere } from "../cards/FTC/actions/voltaic-sphere.ts";
import { hiddenSecrets } from "../cards/RDO/actions/hidden-secrets.ts";
import { guanYuPrimeExemplar } from "../cards/AMB/allies/guan-yu-prime-exemplar.ts";
import { diablerie } from "../cards/PRD/actions/diablerie.ts";
import { foragingServant } from "../cards/P24/allies/foraging-servant.ts";
import { hydroguardRetainer } from "../cards/AMB/allies/hydroguard-retainer.ts";
import { evercurrentRaider } from "../cards/DTR/allies/evercurrent-raider.ts";
import { morriganLostSpirit } from "../cards/P23/champions/morrigan-lost-spirit.ts";
import { feuAwakening } from "../cards/PTM/actions/feu-awakening.ts";
import { floatingPeace } from "../cards/HVN/actions/floating-peace.ts";
import { rapidCombustion } from "../cards/DTR/actions/rapid-combustion.ts";
import { heirloomOfSpectra } from "../cards/RDO/items/heirloom-of-spectra.ts";
import { strengthenTheBonds } from "../cards/P25/actions/strengthen-the-bonds.ts";
import { unyieldingWraithguard } from "../cards/DTR/allies/unyielding-wraithguard.ts";
import { prudentNock } from "../cards/P25/actions/prudent-nock.ts";
import { lavaplumeFatestone } from "../cards/P25/items/lavaplume-fatestone.ts";
import { liminalGuide } from "../cards/SP4/allies/liminal-guide.ts";
import { windyLeap } from "../cards/RDO/actions/windy-leap.ts";
import { thunderclap } from "../cards/AMB/actions/thunderclap.ts";
import { spiritOfSlime } from "../cards/P24/champions/spirit-of-slime.ts";
import { emberslash } from "../cards/PRD/attacks/emberslash.ts";
import { studyTheFables } from "../cards/ALC/actions/study-the-fables.ts";
import { lunarConduit } from "../cards/MRC/items/lunar-conduit.ts";
import { illuminateSecrets } from "../cards/FTC/actions/illuminate-secrets.ts";
import { speedPotion } from "../cards/RDO/items/speed-potion.ts";
import { scaleOfSouls } from "../cards/P24/items/scale-of-souls.ts";
import { tenderheartGuard } from "../cards/PP1/allies/tenderheart-guard.ts";
import { shadowResonance } from "../cards/P24/actions/shadow-resonance.ts";
import { meteoricVolley } from "../cards/P25/actions/meteoric-volley.ts";
import { aeneanSwellingTides } from "../cards/PRD/actions/aenean-swelling-tides.ts";
import { vestalPriestess } from "../cards/PTM/allies/vestal-priestess.ts";
import { focusedFlames } from "../cards/DOA/actions/focused-flames.ts";
import { cracklingIncineration } from "../cards/PTM/actions/crackling-incineration.ts";
import { overpoweringDefense } from "../cards/P25/actions/overpowering-defense.ts";
import { condensedSupernova } from "../cards/ALC/items/condensed-supernova.ts";
import { invigoration } from "../cards/AMB/actions/invigoration.ts";
import { provokeObstinance } from "../cards/ALC/actions/provoke-obstinance.ts";
import { pureCytosynth } from "../cards/PRD/allies/pure-cytosynth.ts";
import { imperialRifleman } from "../cards/P24/allies/imperial-rifleman.ts";
import { intricateLongbow } from "../cards/AMB/weapons/intricate-longbow.ts";
import { nocturnesOblivion } from "../cards/P25/actions/nocturnes-oblivion.ts";
import { revitalizingCleanse } from "../cards/DOA/actions/revitalizing-cleanse.ts";
import { explosiveRune } from "../cards/FTC/items/explosive-rune.ts";
import { reverseAffliction } from "../cards/P25/actions/reverse-affliction.ts";
import { brackishLutist } from "../cards/HVN/allies/brackish-lutist.ts";
import { explosiveFractal } from "../cards/ALC/phantasias/explosive-fractal.ts";
import { threeOfHearts } from "../cards/SP4/allies/three-of-hearts.ts";
import { gatherSlimes } from "../cards/P24/actions/gather-slimes.ts";
import { winblessHurricaneFarm } from "../cards/MRC/domains/winbless-hurricane-farm.ts";
import { fractalOfDuplication } from "../cards/RDO/phantasias/fractal-of-duplication.ts";
import { exiaSight } from "../cards/AMB/actions/exia-sight.ts";
import { shiraLostSpirit } from "../cards/P24/champions/shira-lost-spirit.ts";
import { fanaticalDevotee } from "../cards/ALC/allies/fanatical-devotee.ts";
import { ionizerXUltra } from "../cards/PRD/items/ionizer-x-ultra.ts";
import { fleetfootFilly } from "../cards/HVN/allies/fleetfoot-filly.ts";
import { wulinLancer } from "../cards/HVN/allies/wulin-lancer.ts";
import { harbingerOfLightning } from "../cards/HVN/allies/harbinger-of-lightning.ts";
import { flamelashSubduer } from "../cards/DOA/allies/flamelash-subduer.ts";
import { sacrificePlay } from "../cards/PTM/attacks/sacrifice-play.ts";
import { shimmeringRefraction } from "../cards/HVN/actions/shimmering-refraction.ts";
import { devouringMalice } from "../cards/DTR/items/devouring-malice.ts";
import { reflectedBlight } from "../cards/PTM/actions/reflected-blight.ts";
import { fightForTheCrown } from "../cards/DTR/actions/fight-for-the-crown.ts";
import { protectiveFractal } from "../cards/FTC/phantasias/protective-fractal.ts";
import { waterHerbs } from "../cards/MRC/actions/water-herbs.ts";
import { razorgaleCalling } from "../cards/AMB/phantasias/razorgale-calling.ts";
import { aethercloakSentinel } from "../cards/DTR/allies/aethercloak-sentinel.ts";
import { evasiveManeuvers } from "../cards/P24/actions/evasive-maneuvers.ts";
import { blossomingDenial } from "../cards/P25/actions/blossoming-denial.ts";
import { windstreamMutt } from "../cards/DOA/allies/windstream-mutt.ts";
import { frozenDivinity } from "../cards/RDO/phantasias/frozen-divinity.ts";
import { imperialAccord } from "../cards/DTR/actions/imperial-accord.ts";
import { blueSlime } from "../cards/DOA/allies/blue-slime.ts";
import { lamentationsToll } from "../cards/SP4/attacks/lamentations-toll.ts";
import { fragmentedSpiritOfWind } from "../cards/MRC/champions/fragmented-spirit-of-wind.ts";
import { riptideSlash } from "../cards/FTC/attacks/riptide-slash.ts";
import { mantleOfTheAbyss } from "../cards/PRXY/items/mantle-of-the-abyss.ts";
import { hiddenEnclave } from "../cards/MRC/domains/hidden-enclave.ts";
import { covenantOfThorns } from "../cards/FTC/items/covenant-of-thorns.ts";
import { carterSyntheticReaper } from "../cards/ALC/allies/carter-synthetic-reaper.ts";
import { materializeTheSoul } from "../cards/P25/actions/materialize-the-soul.ts";
import { recruitmentOfficer } from "../cards/P24/allies/recruitment-officer.ts";
import { lifeEssenceAmulet } from "../cards/DEMO22/items/life-essence-amulet.ts";
import { breathsColoratura } from "../cards/PRD/actions/breaths-coloratura.ts";
import { gloweringConflagration } from "../cards/HVN/actions/glowering-conflagration.ts";
import { machinedMonstrosity } from "../cards/MRC/allies/machined-monstrosity.ts";
import { tetherInFlames } from "../cards/ALC/actions/tether-in-flames.ts";
import { necklaceOfHindsight } from "../cards/DTR/items/necklace-of-hindsight.ts";
import { condemnedTrinket } from "../cards/DTR/items/condemned-trinket.ts";
import { noviceMechanist } from "../cards/P24/allies/novice-mechanist.ts";
import { crowdguardsSlash } from "../cards/RDO/attacks/crowdguards-slash.ts";
import { veteranBlazebearer } from "../cards/ALC/allies/veteran-blazebearer.ts";
import { baubleOfScarcity } from "../cards/DTR/items/bauble-of-scarcity.ts";
import { maledictumVitae } from "../cards/SP4/actions/maledictum-vitae.ts";
import { igniteFate } from "../cards/AMB/actions/ignite-fate.ts";
import { incineratedTemplar } from "../cards/DTR/allies/incinerated-templar.ts";
import { glowForth } from "../cards/AMB/actions/glow-forth.ts";
import { potionInfusionGrowth } from "../cards/MRC/actions/potion-infusion-growth.ts";
import { straightFlare } from "../cards/DTR/actions/straight-flare.ts";
import { indolentLeisure } from "../cards/AMB/actions/indolent-leisure.ts";
import { nicoRapturesEmbrace } from "../cards/ALC/champions/nico-raptures-embrace.ts";
import { arondightAzureBlade } from "../cards/FTC/weapons/arondight-azure-blade.ts";
import { connivingPlans } from "../cards/P25/actions/conniving-plans.ts";
import { roseEternalParagon } from "../cards/ALC/allies/rose-eternal-paragon.ts";
import { surreptitiousScheme } from "../cards/HVN/actions/surreptitious-scheme.ts";
import { mapOfHiddenPassage } from "../cards/DOA/items/map-of-hidden-passage.ts";
import { corhaziLightblade } from "../cards/DOA/allies/corhazi-lightblade.ts";
import { dissonantFractal } from "../cards/HVN/phantasias/dissonant-fractal.ts";
import { drownedCut } from "../cards/DOA/attacks/drowned-cut.ts";
import { delusionalVapors } from "../cards/HVN/actions/delusional-vapors.ts";
import { imperiousGalebind } from "../cards/PTM/actions/imperious-galebind.ts";
import { grandCrusadersRing } from "../cards/DOA/items/grand-crusaders-ring.ts";
import { cloakOfStillwater } from "../cards/FTC/items/cloak-of-stillwater.ts";
import { stormbladeSquire } from "../cards/RDO/allies/stormblade-squire.ts";
import { elyanLustreLoyalty } from "../cards/EVP/allies/elyan-lustre-loyalty.ts";
import { smashWithObelisk } from "../cards/ALC/attacks/smash-with-obelisk.ts";
import { fleetingGuard } from "../cards/DTR/actions/fleeting-guard.ts";
import { lesserBoonOfViscosity } from "../cards/PP1/boons/lesser-boon-of-viscosity.ts";
import { strikingIlluminance } from "../cards/HVN/attacks/striking-illuminance.ts";
import { sealThePast } from "../cards/AMB/actions/seal-the-past.ts";
import { madHatterMoroseHeritor } from "../cards/DTR/allies/mad-hatter-morose-heritor.ts";
import { unstableFractal } from "../cards/P25/phantasias/unstable-fractal.ts";
import { teraSight } from "../cards/DOA/actions/tera-sight.ts";
import { crusaderOfAesa } from "../cards/DEMO22/allies/crusader-of-aesa.ts";
import { mendcallMercy } from "../cards/PP1/actions/mendcall-mercy.ts";
import { reconnaissanceField } from "../cards/ALC/phantasias/reconnaissance-field.ts";
import { inertSword } from "../cards/DTR/weapons/inert-sword.ts";
import { fatestoneOfProgress } from "../cards/HVN/items/fatestone-of-progress.ts";
import { umbralTithe } from "../cards/ALC/actions/umbral-tithe.ts";
import { merlinBrilliantVestige } from "../cards/PTM/champions/merlin-brilliant-vestige.ts";
import { alliedWarpriestess } from "../cards/ALC/allies/allied-warpriestess.ts";
import { takeCover } from "../cards/ALC/actions/take-cover.ts";
import { infernoSlime } from "../cards/RDO/allies/inferno-slime.ts";
import { veltechQaTester } from "../cards/PRD/allies/veltech-qa-tester.ts";
import { blightheartThaumaturge } from "../cards/PRD/allies/blightheart-thaumaturge.ts";
import { scepterOfAwakening } from "../cards/HVN/items/scepter-of-awakening.ts";
import { priscillaLostSpirit } from "../cards/P24/champions/priscilla-lost-spirit.ts";
import { ouraganSentinel } from "../cards/DTR/allies/ouragan-sentinel.ts";
import { potionInfusionClarity } from "../cards/ALC/actions/potion-infusion-clarity.ts";
import { stavesXUltra } from "../cards/PRD/items/staves-x-ultra.ts";
import { kongmingWaywardMaven } from "../cards/AMB/champions/kongming-wayward-maven.ts";
import { axisGaleScholar } from "../cards/AMB/allies/axis-gale-scholar.ts";
import { stormOfThorns } from "../cards/ALC/actions/storm-of-thorns.ts";
import { nocturnalBlossom } from "../cards/DTR/allies/nocturnal-blossom.ts";
import { naturesInsight } from "../cards/AMB/actions/natures-insight.ts";
import { combatTraining } from "../cards/AMB/actions/combat-training.ts";
import { cyclicalBreeze } from "../cards/AMB/actions/cyclical-breeze.ts";
import { elysianTestSubject } from "../cards/PRD/tokens/elysian-test-subject.ts";
import { veltechGearHoarder } from "../cards/PRD/allies/veltech-gear-hoarder.ts";
import { lumenBorealis } from "../cards/HVN/phantasias/lumen-borealis.ts";
import { savageAttack } from "../cards/AMB/attacks/savage-attack.ts";
import { absolvingFlames } from "../cards/AMB/actions/absolving-flames.ts";
import { nightmareCoil } from "../cards/DTR/actions/nightmare-coil.ts";
import { aeneanCyclicWinds } from "../cards/PRD/actions/aenean-cyclic-winds.ts";
import { broochXUltra } from "../cards/PRD/items/brooch-x-ultra.ts";
import { seekersRifle } from "../cards/ALC/weapons/seekers-rifle.ts";
import { fannedSynchron } from "../cards/PRD/items/fanned-synchron.ts";
import { fluvialFatestone } from "../cards/HVN/items/fluvial-fatestone.ts";
import { xiaoQiaoCinderkeeper } from "../cards/AMB/allies/xiao-qiao-cinderkeeper.ts";
import { ordainedCharisma } from "../cards/RDO/actions/ordained-charisma.ts";
import { cyclonicStrike } from "../cards/ALC/attacks/cyclonic-strike.ts";
import { sliceAndDice } from "../cards/P24/attacks/slice-and-dice.ts";
import { decompose } from "../cards/MRC/actions/decompose.ts";
import { wildgrowthFeline } from "../cards/AMB/allies/wildgrowth-feline.ts";
import { tidebreakerSentinel } from "../cards/HVN/allies/tidebreaker-sentinel.ts";
import { currentGroover } from "../cards/PRD/allies/current-groover.ts";
import { maidenOfShimmeringAir } from "../cards/HVN/phantasias/maiden-of-shimmering-air.ts";
import { aquamirageWhisper } from "../cards/P25/weapons/aquamirage-whisper.ts";
import { fastCure } from "../cards/P23/actions/fast-cure.ts";
import { carpsongCoda } from "../cards/HVN/actions/carpsong-coda.ts";
import { spiritShard } from "../cards/MRC/tokens/spirit-shard.ts";
import { krustallanArcher } from "../cards/ALC/allies/krustallan-archer.ts";
import { fountainBladehand } from "../cards/PRD/allies/fountain-bladehand.ts";
import { resonantAether } from "../cards/DTR/actions/resonant-aether.ts";
import { cellVanguard } from "../cards/MRC/allies/cell-vanguard.ts";
import { incendiaryShot } from "../cards/P24/items/incendiary-shot.ts";
import { assassinsMantle } from "../cards/P24/items/assassins-mantle.ts";
import { trainedHawk } from "../cards/DOA/allies/trained-hawk.ts";
import { galatineSwordOfSunlight } from "../cards/DOA/weapons/galatine-sword-of-sunlight.ts";
import { obelithEscort } from "../cards/P25/actions/obelith-escort.ts";
import { vanitasDominusRex } from "../cards/ALC/champions/vanitas-dominus-rex.ts";
import { waterloggedRanger } from "../cards/HVN/allies/waterlogged-ranger.ts";
import { rampantBladehand } from "../cards/PRD/allies/rampant-bladehand.ts";
import { hailfinch } from "../cards/AMB/allies/hailfinch.ts";
import { fractalOfRain } from "../cards/P24/phantasias/fractal-of-rain.ts";
import { clockworkAmalgam } from "../cards/ALC/phantasias/clockwork-amalgam.ts";
import { bloodseekerMagus } from "../cards/RDO/allies/bloodseeker-magus.ts";
import { luminousQuartz } from "../cards/P25/weapons/luminous-quartz.ts";
import { deflectingAdvantage } from "../cards/RDO/actions/deflecting-advantage.ts";
import { ghastlyCorrosion } from "../cards/DTR/actions/ghastly-corrosion.ts";
import { polarisTwinklingCauldron } from "../cards/PRXY/items/polaris-twinkling-cauldron.ts";
import { avalonCursedIsle } from "../cards/DOA/domains/avalon-cursed-isle.ts";
import { baidiOathswornPalace } from "../cards/HVN/domains/baidi-oathsworn-palace.ts";
import { surgingUndertow } from "../cards/ALC/actions/surging-undertow.ts";
import { feedNourishment } from "../cards/AMB/actions/feed-nourishment.ts";
import { battlefieldSpotter } from "../cards/ALC/allies/battlefield-spotter.ts";
import { imperialPanzer } from "../cards/ALC/allies/imperial-panzer.ts";
import { duxalProclamation } from "../cards/AMB/items/duxal-proclamation.ts";
import { falseStep } from "../cards/ALC/actions/false-step.ts";
import { scepterOfFascination } from "../cards/P25/items/scepter-of-fascination.ts";
import { savageSlash } from "../cards/P26/attacks/savage-slash.ts";
import { splashingSpearguard } from "../cards/HVN/allies/splashing-spearguard.ts";
import { extricatingTouch } from "../cards/HVN/actions/extricating-touch.ts";
import { quietusBlade } from "../cards/RDO/weapons/quietus-blade.ts";
import { dawnOfAshes } from "../cards/FTC/domains/dawn-of-ashes.ts";
import { cometfall } from "../cards/ALC/actions/cometfall.ts";
import { veiledOracle } from "../cards/DTR/allies/veiled-oracle.ts";
import { gemOfSorority } from "../cards/AMB/items/gem-of-sorority.ts";
import { corsairCaptain } from "../cards/P25/allies/corsair-captain.ts";
import { tempestDownfall } from "../cards/MRC/actions/tempest-downfall.ts";
import { ceasingEdict } from "../cards/HVN/actions/ceasing-edict.ts";
import { danteHemomancer } from "../cards/PRD/champions/dante-hemomancer.ts";
import { rictusTiding } from "../cards/SP4/actions/rictus-tiding.ts";
import { adornedStag } from "../cards/AMB/allies/adorned-stag.ts";
import { argusAllseeingGiant } from "../cards/RDO/allies/argus-allseeing-giant.ts";
import { songOfNurturing } from "../cards/DOA/actions/song-of-nurturing.ts";
import { rondoOfTheWind } from "../cards/PRD/actions/rondo-of-the-wind.ts";
import { featheryTune } from "../cards/HVN/actions/feathery-tune.ts";
import { grimForeboding } from "../cards/P24/actions/grim-foreboding.ts";
import { sunblessedGazelle } from "../cards/HVN/allies/sunblessed-gazelle.ts";
import { chillingTouch } from "../cards/DOA/actions/chilling-touch.ts";
import { eternalDreamer } from "../cards/MRC/allies/eternal-dreamer.ts";
import { ardentCloudstriker } from "../cards/P24/allies/ardent-cloudstriker.ts";
import { treasureOfTheDepths } from "../cards/PRD/items/treasure-of-the-depths.ts";
import { aqueousStallion } from "../cards/AMB/allies/aqueous-stallion.ts";
import { primordialRitual } from "../cards/MRC/actions/primordial-ritual.ts";
import { staffOfBlossomingWill } from "../cards/P25/items/staff-of-blossoming-will.ts";
import { jianyeDawnsKeep } from "../cards/HVN/domains/jianye-dawns-keep.ts";
import { oceansBlessing } from "../cards/FTC/phantasias/oceans-blessing.ts";
import { cordeliaAurousKaiser } from "../cards/MRC/allies/cordelia-aurous-kaiser.ts";
import { neosSight } from "../cards/ALC/actions/neos-sight.ts";
import { exorcism } from "../cards/DTR/actions/exorcism.ts";
import { carefulStudy } from "../cards/DOA/actions/careful-study.ts";
import { theElysianAstrolabe } from "../cards/ALC/items/the-elysian-astrolabe.ts";
import { breakApart } from "../cards/P26/actions/break-apart.ts";
import { veritaQueenOfHearts } from "../cards/DTR/allies/verita-queen-of-hearts.ts";
import { snowFairy } from "../cards/DOA/allies/snow-fairy.ts";
import { floodbloom } from "../cards/HVN/tokens/floodbloom.ts";
import { excaliburCursedSword } from "../cards/DOA/weapons/excalibur-cursed-sword.ts";
import { frostlornCaress } from "../cards/P25/actions/frostlorn-caress.ts";
import { tristanShadowreaver } from "../cards/MRC/champions/tristan-shadowreaver.ts";
import { hurricaneSweep } from "../cards/DOA/attacks/hurricane-sweep.ts";
import { vengefulParamour } from "../cards/DTR/allies/vengeful-paramour.ts";
import { quietRefraction } from "../cards/SP4/phantasias/quiet-refraction.ts";
import { pyroclasticFlow } from "../cards/MRC/actions/pyroclastic-flow.ts";
import { keySlimePudding } from "../cards/P24/items/key-slime-pudding.ts";
import { tasershot } from "../cards/P24/items/tasershot.ts";
import { repellingPalmblast } from "../cards/ALC/actions/repelling-palmblast.ts";
import { bandersnatchFrumiousFoe } from "../cards/PTM/allies/bandersnatch-frumious-foe.ts";
import { etherealAbsorption } from "../cards/PTM/actions/ethereal-absorption.ts";
import { uncoverThePlot } from "../cards/DOA/actions/uncover-the-plot.ts";
import { lesserBoonOfAstraeus } from "../cards/PP1/boons/lesser-boon-of-astraeus.ts";
import { aeneanScorchingComet } from "../cards/PRD/actions/aenean-scorching-comet.ts";
import { wildheartLyre } from "../cards/FTC/items/wildheart-lyre.ts";
import { royalBear } from "../cards/AMB/allies/royal-bear.ts";
import { claudeFatedVisionary } from "../cards/ALC/allies/claude-fated-visionary.ts";
import { insigniaOfTheCorhazi } from "../cards/PRXY/items/insignia-of-the-corhazi.ts";
import { peerBeyond } from "../cards/P26/actions/peer-beyond.ts";
import { zhouYuEnlightenedSage } from "../cards/EVP/allies/zhou-yu-enlightened-sage.ts";
import { immaterialDissolution } from "../cards/HVN/actions/immaterial-dissolution.ts";
import { skilledPlainsman } from "../cards/AMB/allies/skilled-plainsman.ts";
import { lesserBoonOfEnchantment } from "../cards/PP1/boons/lesser-boon-of-enchantment.ts";
import { kraalStonescaleTyrant } from "../cards/FTC/allies/kraal-stonescale-tyrant.ts";
import { tableStraight } from "../cards/RDO/actions/table-straight.ts";
import { skilledAerotheurge } from "../cards/DTR/allies/skilled-aerotheurge.ts";
import { vampiricSlime } from "../cards/MRC/allies/vampiric-slime.ts";
import { guoJiaBlessedScion } from "../cards/HVN/champions/guo-jia-blessed-scion.ts";
import { flamewingFowl } from "../cards/AMB/allies/flamewing-fowl.ts";
import { slimeSwarm } from "../cards/RDO/allies/slime-swarm.ts";
import { ventusStaffOfZephyrs } from "../cards/FTC/items/ventus-staff-of-zephyrs.ts";
import { nicoWhiplashAllure } from "../cards/ALC/champions/nico-whiplash-allure.ts";
import { mandateOfHonor } from "../cards/AMB/items/mandate-of-honor.ts";
import { redHareUnrivaledStallion } from "../cards/EVP/allies/red-hare-unrivaled-stallion.ts";
import { cureTheFlesh } from "../cards/AMB/actions/cure-the-flesh.ts";
import { fractalOfPolarDepths } from "../cards/AMB/phantasias/fractal-of-polar-depths.ts";
import { utherIllustriousKing } from "../cards/EVP/allies/uther-illustrious-king.ts";
import { hoarfrostSpine } from "../cards/AMB/weapons/hoarfrost-spine.ts";
import { exquisiteDessert } from "../cards/PRD/items/exquisite-dessert.ts";
import { tideholderClaymore } from "../cards/MRC/weapons/tideholder-claymore.ts";
import { shredToRibbons } from "../cards/MRC/attacks/shred-to-ribbons.ts";
import { luccaGatewayManager } from "../cards/PRD/allies/lucca-gateway-manager.ts";
import { manaroot } from "../cards/ALC/tokens/manaroot.ts";
import { blancheShelteringSaint } from "../cards/FTC/allies/blanche-sheltering-saint.ts";
import { amorphousStrike } from "../cards/ALC/attacks/amorphous-strike.ts";
import { fortifiedManaShield } from "../cards/P24/actions/fortified-mana-shield.ts";
import { breakwaterCadet } from "../cards/PRD/allies/breakwater-cadet.ts";
import { discordiaHarpOfMalice } from "../cards/DOA/items/discordia-harp-of-malice.ts";
import { savageSunder } from "../cards/HVN/attacks/savage-sunder.ts";
import { direwolfAlpha } from "../cards/HVN/allies/direwolf-alpha.ts";
import { fractalOfSparks } from "../cards/SP4/phantasias/fractal-of-sparks.ts";
import { coupDeGrace } from "../cards/DOA/attacks/coup-de-grace.ts";
import { seasideRangefinder } from "../cards/HVN/allies/seaside-rangefinder.ts";
import { jinZealousMaverick } from "../cards/AMB/champions/jin-zealous-maverick.ts";
import { gloriousPresence } from "../cards/HVN/phantasias/glorious-presence.ts";
import { underFire } from "../cards/MRC/actions/under-fire.ts";
import { whirlwindVizier } from "../cards/ALC/allies/whirlwind-vizier.ts";
import { summonSentinels } from "../cards/ALC/actions/summon-sentinels.ts";
import { suspiciousConcoction } from "../cards/DTR/items/suspicious-concoction.ts";
import { effluveGuard } from "../cards/DTR/allies/effluve-guard.ts";
import { butlersAugury } from "../cards/DTR/actions/butlers-augury.ts";
import { snowWhiteWeissQueen } from "../cards/DTR/allies/snow-white-weiss-queen.ts";
import { dusklightCommunion } from "../cards/PRD/phantasias/dusklight-communion.ts";
import { suzakusCommand } from "../cards/HVN/actions/suzakus-command.ts";
import { veltechArmiger } from "../cards/PRD/allies/veltech-armiger.ts";
import { shadowsTwin } from "../cards/P24/weapons/shadows-twin.ts";
import { maidenOfReverentGale } from "../cards/HVN/phantasias/maiden-of-reverent-gale.ts";
import { floodborneSwing } from "../cards/RDO/attacks/floodborne-swing.ts";
import { fullBloom } from "../cards/RDO/phantasias/full-bloom.ts";
import { plantedExplosive } from "../cards/P26/actions/planted-explosive.ts";
import { seethingIntercession } from "../cards/RDO/actions/seething-intercession.ts";
import { cardiacVessel } from "../cards/PRD/phantasias/cardiac-vessel.ts";
import { meteoricSlime } from "../cards/RDO/allies/meteoric-slime.ts";
import { flameboltArbalist } from "../cards/HVN/allies/flamebolt-arbalist.ts";
import { airshipCruiser } from "../cards/ALC/allies/airship-cruiser.ts";
import { babySilverSlime } from "../cards/ReC-SLM/allies/baby-silver-slime.ts";
import { twilightSlime } from "../cards/MRC/allies/twilight-slime.ts";
import { floodwardSergeant } from "../cards/AMB/allies/floodward-sergeant.ts";
import { imperiousHighlander } from "../cards/P23/allies/imperious-highlander.ts";
import { airshipEngineer } from "../cards/ALC/allies/airship-engineer.ts";
import { avatarOfGenbu } from "../cards/RDO/allies/avatar-of-genbu.ts";
import { reflectTheSkies } from "../cards/MRC/actions/reflect-the-skies.ts";
import { springleaf } from "../cards/ALC/tokens/springleaf.ts";
import { nascentBarrier } from "../cards/AMB/actions/nascent-barrier.ts";
import { fabledAzuriteFatestone } from "../cards/P25/items/fabled-azurite-fatestone.ts";
import { illuminatingCharge } from "../cards/AMB/actions/illuminating-charge.ts";
import { rainwovenCrysalis } from "../cards/PTM/actions/rainwoven-crysalis.ts";
import { hornOfBeastcalling } from "../cards/DOA/items/horn-of-beastcalling.ts";
import { treacleDrownedMouse } from "../cards/PTM/allies/treacle-drowned-mouse.ts";
import { surgedCoordinator } from "../cards/PRD/allies/surged-coordinator.ts";
import { destinedEncounter } from "../cards/PRD/actions/destined-encounter.ts";
import { refractingMissile } from "../cards/FTC/actions/refracting-missile.ts";
import { fortification } from "../cards/PRD/actions/fortification.ts";
import { iceboundSlam } from "../cards/P26/attacks/icebound-slam.ts";
import { trivariateDream } from "../cards/DTR/weapons/trivariate-dream.ts";
import { demonsAim } from "../cards/ALC/actions/demons-aim.ts";
import { weaponsmith } from "../cards/DEMO22/allies/weaponsmith.ts";
import { shrivelingVines } from "../cards/P25/phantasias/shriveling-vines.ts";
import { fatalTimepiece } from "../cards/ALC/items/fatal-timepiece.ts";
import { gloamspireSniper } from "../cards/MRC/allies/gloamspire-sniper.ts";
import { razeTheLand } from "../cards/ALC/actions/raze-the-land.ts";
import { grandeAiguille } from "../cards/P25/weapons/grande-aiguille.ts";
import { slipstreamVault } from "../cards/AMB/actions/slipstream-vault.ts";
import { raiManaWeaver } from "../cards/DOA/champions/rai-mana-weaver.ts";
import { glacialGuidance } from "../cards/DOA/actions/glacial-guidance.ts";
import { peerTheDepths } from "../cards/PRD/actions/peer-the-depths.ts";
import { teasingAerocharge } from "../cards/DTR/actions/teasing-aerocharge.ts";
import { portsidePirate } from "../cards/MRC/allies/portside-pirate.ts";
import { potionInfusionStarlight } from "../cards/ALC/actions/potion-infusion-starlight.ts";
import { merlinMemoriteVassal } from "../cards/PTM/champions/merlin-memorite-vassal.ts";
import { tempestuousConviction } from "../cards/PTM/actions/tempestuous-conviction.ts";
import { lacunarityGuide } from "../cards/PRD/allies/lacunarity-guide.ts";
import { rosewingedHollow } from "../cards/PTM/allies/rosewinged-hollow.ts";
import { aeneanFlurryOfFire } from "../cards/PRD/actions/aenean-flurry-of-fire.ts";
import { conduitOfTheMadMage } from "../cards/DOA/allies/conduit-of-the-mad-mage.ts";
import { cooktechKnife } from "../cards/PRD/items/cooktech-knife.ts";
import { slayTheKing } from "../cards/FTC/attacks/slay-the-king.ts";
import { chimeOfEndlessDreams } from "../cards/RDO/items/chime-of-endless-dreams.ts";
import { bloodshroudTemper } from "../cards/HVN/actions/bloodshroud-temper.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { stokedSlice } from "../cards/PRD/attacks/stoked-slice.ts";
import { soakedSlash } from "../cards/PRD/attacks/soaked-slash.ts";
import { channelTheWind } from "../cards/DOA/actions/channel-the-wind.ts";
import { rivetingWinds } from "../cards/PRD/actions/riveting-winds.ts";
import { accelerate } from "../cards/RDO/actions/accelerate.ts";
import { cleanCut } from "../cards/DOA/attacks/clean-cut.ts";
import { blightheartAdept } from "../cards/PRD/allies/blightheart-adept.ts";
import { vigilantSentry } from "../cards/MRC/allies/vigilant-sentry.ts";
import { windwalkerBoots } from "../cards/FTC/items/windwalker-boots.ts";
import { gwendolynSpiritOfWind } from "../cards/P23/champions/gwendolyn-spirit-of-wind.ts";
import { cavalierRescue } from "../cards/AMB/actions/cavalier-rescue.ts";
import { benevolentBattlePriest } from "../cards/DOA/allies/benevolent-battle-priest.ts";
import { amorphousMissile } from "../cards/AMB/items/amorphous-missile.ts";
import { acerbica } from "../cards/HVN/tokens/acerbica.ts";
import { fulguriteCoordinator } from "../cards/PRD/allies/fulgurite-coordinator.ts";
import { verdigrisDecree } from "../cards/MRC/actions/verdigris-decree.ts";
import { mercurialHeart } from "../cards/MRC/items/mercurial-heart.ts";
import { freydisMasterTactician } from "../cards/ALC/allies/freydis-master-tactician.ts";
import { incarnateMajesty } from "../cards/FTC/actions/incarnate-majesty.ts";
import { arisannaLucentArbiter } from "../cards/ALC/champions/arisanna-lucent-arbiter.ts";
import { soultraceTessellation } from "../cards/PTM/actions/soultrace-tessellation.ts";
import { concealedMarksman } from "../cards/MRC/allies/concealed-marksman.ts";
import { ministerOfCeremony } from "../cards/HVN/allies/minister-of-ceremony.ts";
import { profaneBindings } from "../cards/DTR/actions/profane-bindings.ts";
import { alacritousHuntress } from "../cards/DTR/allies/alacritous-huntress.ts";
import { demolition } from "../cards/HVN/actions/demolition.ts";
import { mireReparation } from "../cards/DTR/actions/mire-reparation.ts";
import { gencodeWomb } from "../cards/PRD/items/gencode-womb.ts";
import { polearmedSteed } from "../cards/AMB/allies/polearmed-steed.ts";
import { abnegation } from "../cards/PTM/actions/abnegation.ts";
import { lavastorm } from "../cards/RDO/actions/lavastorm.ts";
import { forgetfulConcoction } from "../cards/HVN/items/forgetful-concoction.ts";
import { aethericCalibration } from "../cards/P25/actions/aetheric-calibration.ts";
import { captivatingCutthroat } from "../cards/MRC/allies/captivating-cutthroat.ts";
import { forgedScalemail } from "../cards/HVN/items/forged-scalemail.ts";
import { seepIntoTheMind } from "../cards/P25/actions/seep-into-the-mind.ts";
import { bandOfBurningVerdict } from "../cards/P25/items/band-of-burning-verdict.ts";
import { etherealysPromise } from "../cards/AMB/items/etherealys-promise.ts";
import { syntheticStrike } from "../cards/MRC/attacks/synthetic-strike.ts";
import { refreshChamber } from "../cards/ALC/actions/refresh-chamber.ts";
import { heartOfTheFrost } from "../cards/PRD/items/heart-of-the-frost.ts";
import { ferventBeastmaster } from "../cards/DOA/allies/fervent-beastmaster.ts";
import { dianaDeadlyDuelist } from "../cards/ALC/champions/diana-deadly-duelist.ts";
import { moltenImpact } from "../cards/PRD/actions/molten-impact.ts";
import { summonRetinue } from "../cards/RDO/actions/summon-retinue.ts";
import { pairedMindsKindredSouls } from "../cards/AMB/actions/paired-minds-kindred-souls.ts";
import { sinfoniaOfHope } from "../cards/PRD/actions/sinfonia-of-hope.ts";
import { transfusiveAura } from "../cards/RDO/phantasias/transfusive-aura.ts";
import { spiritBladeDispersion } from "../cards/DOA/actions/spirit-blade-dispersion.ts";
import { thievingCut } from "../cards/SP4/attacks/thieving-cut.ts";
import { increasingDanger } from "../cards/PRD/actions/increasing-danger.ts";
import { fortifyingManashot } from "../cards/DTR/actions/fortifying-manashot.ts";
import { tactfulSergeant } from "../cards/DOA/allies/tactful-sergeant.ts";
import { juggleKnives } from "../cards/DOA/actions/juggle-knives.ts";
import { marchHareMottledHost } from "../cards/EVP/allies/march-hare-mottled-host.ts";
import { signaltechOne } from "../cards/PRD/items/signaltech-one.ts";
import { brissaSpiritOfWind } from "../cards/P24/champions/brissa-spirit-of-wind.ts";
import { verdantScepter } from "../cards/P24/items/verdant-scepter.ts";
import { lakereavingChill } from "../cards/P26/phantasias/lakereaving-chill.ts";
import { kongmingFelEidolon } from "../cards/AMB/champions/kongming-fel-eidolon.ts";
import { dahliaIdyllicDreamer } from "../cards/ALC/allies/dahlia-idyllic-dreamer.ts";
import { focusingRound } from "../cards/ALC/items/focusing-round.ts";
import { markOfFervor } from "../cards/FTC/phantasias/mark-of-fervor.ts";
import { atmosShield } from "../cards/MRC/tokens/atmos-shield.ts";
import { lorraineAscendantWings } from "../cards/P25/champions/lorraine-ascendant-wings.ts";
import { quadrillesGryphon } from "../cards/DTR/allies/quadrilles-gryphon.ts";
import { trainedBirdroid } from "../cards/PRD/allies/trained-birdroid.ts";
import { danteAeneanInitiate } from "../cards/PRD/champions/dante-aenean-initiate.ts";
import { sunderingMoon } from "../cards/AMB/weapons/sundering-moon.ts";
import { namelessChampionAc } from "../cards/AMB/champions/nameless-champion-ac.ts";
import { chibiBattleOfRedCliffs } from "../cards/HVN/domains/chibi-battle-of-red-cliffs.ts";
import { smashingForce } from "../cards/MRC/attacks/smashing-force.ts";
import { seekingShot } from "../cards/FTC/attacks/seeking-shot.ts";
import { lycoria } from "../cards/HVN/tokens/lycoria.ts";
import { beastsoulVisage } from "../cards/FTC/items/beastsoul-visage.ts";
import { potionInfusionBlaze } from "../cards/MRC/actions/potion-infusion-blaze.ts";
import { fertileGrounds } from "../cards/ALC/phantasias/fertile-grounds.ts";
import { fourOfSpades } from "../cards/DTR/allies/four-of-spades.ts";
import { shardwingSearchlight } from "../cards/P25/actions/shardwing-searchlight.ts";
import { prototypeStaff } from "../cards/P24/items/prototype-staff.ts";
import { lostWisdom } from "../cards/AMB/actions/lost-wisdom.ts";
import { polkhawkBoisterousRiot } from "../cards/ALC/champions/polkhawk-boisterous-riot.ts";
import { ironHaloForcefieldNode } from "../cards/RDO/domains/iron-halo-forcefield-node.ts";
import { galewindScout } from "../cards/HVN/allies/galewind-scout.ts";
import { coreFractal } from "../cards/PRD/tokens/core-fractal.ts";
import { spurredGallop } from "../cards/RDO/actions/spurred-gallop.ts";
import { contrabandRevolver } from "../cards/MRC/weapons/contraband-revolver.ts";
import { navigateTheStreets } from "../cards/ALC/actions/navigate-the-streets.ts";
import { bulwarkSword } from "../cards/P24/weapons/bulwark-sword.ts";
import { vaporjetShieldbearer } from "../cards/P24/allies/vaporjet-shieldbearer.ts";
import { vanitasConvergentRuin } from "../cards/ALC/champions/vanitas-convergent-ruin.ts";
import { spiritOfFortuitousFire } from "../cards/HVN/champions/spirit-of-fortuitous-fire.ts";
import { aquiferSeneschal } from "../cards/DTR/allies/aquifer-seneschal.ts";
import { sableRemnant } from "../cards/P24/allies/sable-remnant.ts";
import { conceal } from "../cards/DOA/actions/conceal.ts";
import { journeysBeginning } from "../cards/P25/actions/journeys-beginning.ts";
import { foundPower } from "../cards/RDO/actions/found-power.ts";
import { frozenDismissal } from "../cards/ALC/actions/frozen-dismissal.ts";
import { beseechTheWinds } from "../cards/DOA/actions/beseech-the-winds.ts";
import { krustallanPatrol } from "../cards/MRC/allies/krustallan-patrol.ts";
import { hireMercenaries } from "../cards/AMB/actions/hire-mercenaries.ts";
import { loadSoul } from "../cards/ALC/actions/load-soul.ts";
import { lurchingRogue } from "../cards/PRD/allies/lurching-rogue.ts";
import { gloamspireLance } from "../cards/ALC/weapons/gloamspire-lance.ts";
import { dynasticWhirlpool } from "../cards/RDO/actions/dynastic-whirlpool.ts";
import { assassinsRipper } from "../cards/DOA/weapons/assassins-ripper.ts";
import { evanescentWinds } from "../cards/HVN/actions/evanescent-winds.ts";
import { peerIntoMana } from "../cards/DOA/actions/peer-into-mana.ts";
import { infusionOfCrescentJade } from "../cards/AMB/actions/infusion-of-crescent-jade.ts";
import { angelAttendant } from "../cards/RDO/allies/angel-attendant.ts";
import { anotherRound } from "../cards/PRD/actions/another-round.ts";
import { lesserBoonOfFlock } from "../cards/PRD/boons/lesser-boon-of-flock.ts";
import { guanduTheaterOfWar } from "../cards/AMB/domains/guandu-theater-of-war.ts";
import { crimsonProtectiveTrinket } from "../cards/FTC/items/crimson-protective-trinket.ts";
import { unearthRevelations } from "../cards/ALC/actions/unearth-revelations.ts";
import { penetratorRound } from "../cards/P24/items/penetrator-round.ts";
import { namelessChampionTw } from "../cards/AMB/champions/nameless-champion-tw.ts";
import { exposeDarkness } from "../cards/DTR/actions/expose-darkness.ts";
import { halcyonPrism } from "../cards/AMB/items/halcyon-prism.ts";
import { spellshieldWind } from "../cards/ALC/actions/spellshield-wind.ts";
import { crystallineMirror } from "../cards/ALC/items/crystalline-mirror.ts";
import { brooksideScout } from "../cards/PTM/allies/brookside-scout.ts";
import { wujiOfLingeringFate } from "../cards/AMB/phantasias/wuji-of-lingering-fate.ts";
import { tabulaOfSalvage } from "../cards/P26/items/tabula-of-salvage.ts";
import { marksmanCaptain } from "../cards/AMB/allies/marksman-captain.ts";
import { reboundingGust } from "../cards/HVN/actions/rebounding-gust.ts";
import { arrestLightning } from "../cards/PRD/actions/arrest-lightning.ts";
import { swornWindhand } from "../cards/PTM/allies/sworn-windhand.ts";
import { apprenticeAeromancer } from "../cards/AMB/allies/apprentice-aeromancer.ts";
import { dragonsDawn } from "../cards/AMB/weapons/dragons-dawn.ts";
import { acheronExpressOfficer } from "../cards/PRD/allies/acheron-express-officer.ts";
import { queensCinderhog } from "../cards/PTM/allies/queens-cinderhog.ts";
import { empoweringTincture } from "../cards/ALC/items/empowering-tincture.ts";
import { babyBlueSlime } from "../cards/P24/allies/baby-blue-slime.ts";
import { limitlessDefiance } from "../cards/RDO/actions/limitless-defiance.ts";
import { backupCharger } from "../cards/P24/items/backup-charger.ts";
import { cramSession } from "../cards/DOA/actions/cram-session.ts";
import { lesserBoonOfApollo } from "../cards/PP1/boons/lesser-boon-of-apollo.ts";
import { mindbreakBullet } from "../cards/ALC/items/mindbreak-bullet.ts";
import { aliceWhimsMonarch } from "../cards/PTM/champions/alice-whims-monarch.ts";
import { slimecallCyclone } from "../cards/RDO/phantasias/slimecall-cyclone.ts";
import { keeperOfTheWild } from "../cards/HVN/allies/keeper-of-the-wild.ts";
import { mastermindScheme } from "../cards/P24/actions/mastermind-scheme.ts";
import { generalAtArms } from "../cards/HVN/allies/general-at-arms.ts";
import { pridesVanguard } from "../cards/DTR/allies/prides-vanguard.ts";
import { briarsSpindle } from "../cards/PTM/items/briars-spindle.ts";
import { varuckanSoulknife } from "../cards/FTC/weapons/varuckan-soulknife.ts";
import { bandageWound } from "../cards/MRC/actions/bandage-wound.ts";
import { crimsonTear } from "../cards/ALC/allies/crimson-tear.ts";
import { clashOfFates } from "../cards/HVN/actions/clash-of-fates.ts";
import { namelessChampionMr } from "../cards/AMB/champions/nameless-champion-mr.ts";
import { royalLineDefense } from "../cards/RDO/actions/royal-line-defense.ts";
import { prismaticSanctuary } from "../cards/FTC/domains/prismatic-sanctuary.ts";
import { incantationOfProsperity } from "../cards/AMB/actions/incantation-of-prosperity.ts";
import { expelTheDeparted } from "../cards/SP4/actions/expel-the-departed.ts";
import { mementoMori } from "../cards/MRC/items/memento-mori.ts";
import { portlyRaccoon } from "../cards/RDO/allies/portly-raccoon.ts";
import { kongmingAsceticVice } from "../cards/AMB/champions/kongming-ascetic-vice.ts";
import { covertManipulator } from "../cards/PP1/allies/covert-manipulator.ts";
import { blessedClergy } from "../cards/MRC/allies/blessed-clergy.ts";
import { sunglorySentinel } from "../cards/HVN/allies/sunglory-sentinel.ts";
import { cheapSword } from "../cards/PP1/tokens/cheap-sword.ts";
import { varuckanAcolyte } from "../cards/FTC/allies/varuckan-acolyte.ts";
import { liuBeiOathkeeper } from "../cards/AMB/allies/liu-bei-oathkeeper.ts";
import { labyrinthJeweledOpus } from "../cards/PTM/phantasias/labyrinth-jeweled-opus.ts";
import { spiritedFalconer } from "../cards/MRC/allies/spirited-falconer.ts";
import { perilousMend } from "../cards/PTM/actions/perilous-mend.ts";
import { resplendentKiteShield } from "../cards/ALC/items/resplendent-kite-shield.ts";
import { redirectFlow } from "../cards/P25/actions/redirect-flow.ts";
import { bloomSummersGlow } from "../cards/P25/actions/bloom-summers-glow.ts";
import { swordSaintOfEveswind } from "../cards/HVN/allies/sword-saint-of-eveswind.ts";
import { slateWhetstone } from "../cards/P24/items/slate-whetstone.ts";
import { sinkIntoOblivion } from "../cards/P22/actions/sink-into-oblivion.ts";
import { manaflareBarrage } from "../cards/DTR/actions/manaflare-barrage.ts";
import { exhilaratingPlume } from "../cards/PRD/phantasias/exhilarating-plume.ts";
import { flametechBladecore } from "../cards/PRD/items/flametech-bladecore.ts";
import { aegisOfDawn } from "../cards/MRC/items/aegis-of-dawn.ts";
import { judasClaretIntercessor } from "../cards/PRD/allies/judas-claret-intercessor.ts";
import { formidableYouxia } from "../cards/P24/allies/formidable-youxia.ts";
import { hubOfInnovation } from "../cards/MRC/domains/hub-of-innovation.ts";
import { overwhelmingSwing } from "../cards/ALC/attacks/overwhelming-swing.ts";
import { lawsurTheCarpenter } from "../cards/DTR/allies/lawsur-the-carpenter.ts";
import { orbOfHubris } from "../cards/P24/items/orb-of-hubris.ts";
import { rapidDeploymentNexus } from "../cards/RDO/domains/rapid-deployment-nexus.ts";
import { returnToTheArchive } from "../cards/P25/actions/return-to-the-archive.ts";
import { scientificDiscoveries } from "../cards/RDO/actions/scientific-discoveries.ts";
import { scorchingImperilment } from "../cards/HVN/phantasias/scorching-imperilment.ts";
import { slimeParty } from "../cards/RDO/actions/slime-party.ts";
import { jewelOfEnlightenment } from "../cards/DOA/items/jewel-of-enlightenment.ts";
import { effigyOfGaia } from "../cards/FTC/items/effigy-of-gaia.ts";
import { anotherBeginning } from "../cards/P25/actions/another-beginning.ts";
import { wildernessHarpist } from "../cards/DOA/allies/wilderness-harpist.ts";
import { angelicVanguard } from "../cards/RDO/allies/angelic-vanguard.ts";
import { grimPastiche } from "../cards/DTR/actions/grim-pastiche.ts";
import { scathingSeminary } from "../cards/MRC/allies/scathing-seminary.ts";
import { fatestoneOfHeaven } from "../cards/P25/items/fatestone-of-heaven.ts";
import { chargedMannequin } from "../cards/MRC/allies/charged-mannequin.ts";
import { flashfireHorse } from "../cards/AMB/allies/flashfire-horse.ts";
import { flourishingRestoration } from "../cards/RDO/actions/flourishing-restoration.ts";
import { strikeOfSingularity } from "../cards/RDO/attacks/strike-of-singularity.ts";
import { powerOverwhelming } from "../cards/DOA/actions/power-overwhelming.ts";
import { yunzhouCavalry } from "../cards/AMB/allies/yunzhou-cavalry.ts";
import { twistedVerdict } from "../cards/PTM/actions/twisted-verdict.ts";
import { standFast } from "../cards/HVN/actions/stand-fast.ts";
import { steelSlug } from "../cards/MRC/items/steel-slug.ts";
import { healingAura } from "../cards/ALC/phantasias/healing-aura.ts";
import { lesserBoonOfRevelry } from "../cards/PP1/boons/lesser-boon-of-revelry.ts";
import { stockedOutpost } from "../cards/RDO/domains/stocked-outpost.ts";
import { humptyDumptyFatesFall } from "../cards/DTR/items/humpty-dumpty-fates-fall.ts";
import { safeguardParagon } from "../cards/P26/allies/safeguard-paragon.ts";
import { danteProdigalSwain } from "../cards/PRD/champions/dante-prodigal-swain.ts";
import { sojournersHunt } from "../cards/AMB/weapons/sojourners-hunt.ts";
import { namelessChampionGm } from "../cards/AMB/champions/nameless-champion-gm.ts";
import { hectorPraetorianGuard } from "../cards/MRC/allies/hector-praetorian-guard.ts";
import { greaterBoonOfHorses } from "../cards/PP1/boons/greater-boon-of-horses.ts";
import { devastatingBlow } from "../cards/DOA/attacks/devastating-blow.ts";
import { suddenDeluge } from "../cards/AMB/attacks/sudden-deluge.ts";
import { ceremonialStormblade } from "../cards/MRC/weapons/ceremonial-stormblade.ts";
import { carnwennanShroudedEdge } from "../cards/DOA/weapons/carnwennan-shrouded-edge.ts";
import { productionCrawldroid } from "../cards/PRD/allies/production-crawldroid.ts";
import { aetherwingsWard } from "../cards/PTM/actions/aetherwings-ward.ts";
import { driftingRogue } from "../cards/AMB/allies/drifting-rogue.ts";
import { dormouseInformant } from "../cards/P25/allies/dormouse-informant.ts";
import { ferventLancer } from "../cards/AMB/allies/fervent-lancer.ts";
import { legendarySaddle } from "../cards/RDO/items/legendary-saddle.ts";
import { edelsteinQueenOfDiamonds } from "../cards/RDO/allies/edelstein-queen-of-diamonds.ts";
import { chargerXUltra } from "../cards/PRD/items/charger-x-ultra.ts";
import { epicureanInstitute } from "../cards/PRD/domains/epicurean-institute.ts";
import { spiritOfChess } from "../cards/RDO/champions/spirit-of-chess.ts";
import { primalWhip } from "../cards/AMB/weapons/primal-whip.ts";
import { biseBlade } from "../cards/RDO/weapons/bise-blade.ts";
import { guidedStarlight } from "../cards/P25/actions/guided-starlight.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { foragingFox } from "../cards/P25/allies/foraging-fox.ts";
import { goldenGambit } from "../cards/PTM/actions/golden-gambit.ts";
import { dematerialize } from "../cards/FTC/actions/dematerialize.ts";
import { convokingSlime } from "../cards/MRC/allies/convoking-slime.ts";
import { sunJianWolvesbane } from "../cards/HVN/allies/sun-jian-wolvesbane.ts";
import { cosmicAlignment } from "../cards/DTR/actions/cosmic-alignment.ts";
import { arisannaHerbalistProdigy } from "../cards/ALC/champions/arisanna-herbalist-prodigy.ts";
import { amelioratingMantra } from "../cards/HVN/actions/ameliorating-mantra.ts";
import { refurbish } from "../cards/DOA/actions/refurbish.ts";
import { bloomWintersChill } from "../cards/P25/actions/bloom-winters-chill.ts";
import { namelessChampionCr } from "../cards/AMB/champions/nameless-champion-cr.ts";
import { ashFilcher } from "../cards/AMB/allies/ash-filcher.ts";
import { liquidation } from "../cards/RDO/actions/liquidation.ts";
import { floodwardSteed } from "../cards/RDO/allies/floodward-steed.ts";
import { nurielSeraphicPaladin } from "../cards/RDO/allies/nuriel-seraphic-paladin.ts";
import { noviceHealer } from "../cards/MRC/allies/novice-healer.ts";
import { greaterBoonOfAstraeus } from "../cards/PP1/boons/greater-boon-of-astraeus.ts";
import { splashingPerch } from "../cards/RDO/actions/splashing-perch.ts";
import { ritaiStablemaster } from "../cards/HVN/allies/ritai-stablemaster.ts";
import { caliburnOfSilencing } from "../cards/DOA/weapons/caliburn-of-silencing.ts";
import { serumOfWisdom } from "../cards/ALC/items/serum-of-wisdom.ts";
import { weakenResistance } from "../cards/AMB/actions/weaken-resistance.ts";
import { mobVantage } from "../cards/RDO/actions/mob-vantage.ts";
import { subjugatingLash } from "../cards/ALC/attacks/subjugating-lash.ts";
import { silvershine } from "../cards/ALC/tokens/silvershine.ts";
import { frostbittenEtui } from "../cards/HVN/items/frostbitten-etui.ts";
import { babySlime } from "../cards/RDO/tokens/baby-slime.ts";
import { theDuchesssThornes } from "../cards/PRXY/items/the-duchesss-thornes.ts";
import { seekersAetherwing } from "../cards/P25/weapons/seekers-aetherwing.ts";
import { extortingBlackjack } from "../cards/DTR/attacks/extorting-blackjack.ts";
import { lesserBoonOfNotus } from "../cards/PP1/boons/lesser-boon-of-notus.ts";
import { plutusFortunesFavor } from "../cards/PRD/allies/plutus-fortunes-favor.ts";
import { rowlandSchwartzKnight } from "../cards/PTM/allies/rowland-schwartz-knight.ts";
import { windResonanceBauble } from "../cards/DOA/items/wind-resonance-bauble.ts";
import { trickyChimps } from "../cards/AMB/allies/tricky-chimps.ts";
import { lesserBoonOfProxia } from "../cards/PRD/boons/lesser-boon-of-proxia.ts";
import { tristanUnderhanded } from "../cards/MRC/champions/tristan-underhanded.ts";
import { deployGunshield } from "../cards/ALC/actions/deploy-gunshield.ts";
import { forestCake } from "../cards/PRD/items/forest-cake.ts";
import { jovialTinkerer } from "../cards/PRD/allies/jovial-tinkerer.ts";
import { arcaneDisposition } from "../cards/DOA/actions/arcane-disposition.ts";
import { stormSlime } from "../cards/P24/allies/storm-slime.ts";
import { bloodbondBladesworn } from "../cards/AMB/allies/bloodbond-bladesworn.ts";
import { firebloodedOath } from "../cards/ALC/actions/fireblooded-oath.ts";
import { empoweringEnlightenment } from "../cards/HVN/actions/empowering-enlightenment.ts";
import { foreseFervidCantor } from "../cards/PRD/allies/forese-fervid-cantor.ts";
import { goldenMeasurePatisserie } from "../cards/PRD/domains/golden-measure-patisserie.ts";
import { creativeShock } from "../cards/DOA/actions/creative-shock.ts";
import { cityProtector } from "../cards/MRC/allies/city-protector.ts";
import { displace } from "../cards/FTC/actions/displace.ts";
import { skirtingStep } from "../cards/MRC/actions/skirting-step.ts";
import { sharpenBlade } from "../cards/MRC/actions/sharpen-blade.ts";
import { siegeMauler } from "../cards/PTM/allies/siege-mauler.ts";
import { alchemistsCauldron } from "../cards/RDO/items/alchemists-cauldron.ts";
import { aeneanPointedFlare } from "../cards/PRD/actions/aenean-pointed-flare.ts";
import { stargazersPortent } from "../cards/MRC/actions/stargazers-portent.ts";
import { prideOfDemiourgos } from "../cards/PRD/items/pride-of-demiourgos.ts";
import { dissuadingAether } from "../cards/P25/actions/dissuading-aether.ts";
import { hiddenLongbowman } from "../cards/HVN/allies/hidden-longbowman.ts";
import { reliableCavalier } from "../cards/RDO/allies/reliable-cavalier.ts";
import { orbOfRegret } from "../cards/DOA/items/orb-of-regret.ts";
import { imperialSeal } from "../cards/AMB/items/imperial-seal.ts";
import { stiflingAethercharge } from "../cards/RDO/actions/stifling-aethercharge.ts";
import { topsyDecree } from "../cards/PTM/actions/topsy-decree.ts";
import { indiscriminateGyre } from "../cards/AMB/attacks/indiscriminate-gyre.ts";
import { liturgyOfCorruption } from "../cards/RDO/actions/liturgy-of-corruption.ts";
import { harnessLightning } from "../cards/HVN/actions/harness-lightning.ts";
import { seafaringMercenary } from "../cards/DOA/allies/seafaring-mercenary.ts";
import { krustallanDistiller } from "../cards/ALC/allies/krustallan-distiller.ts";
import { moonveilAndroid } from "../cards/MRC/allies/moonveil-android.ts";
import { silverSoldier } from "../cards/RDO/allies/silver-soldier.ts";
import { jueyingShadowmare } from "../cards/EVP/allies/jueying-shadowmare.ts";
import { everlongingThorns } from "../cards/RDO/actions/everlonging-thorns.ts";
import { tidalLock } from "../cards/AMB/actions/tidal-lock.ts";
import { stabilizingCapacitance } from "../cards/HVN/actions/stabilizing-capacitance.ts";
import { jinUndyingResolve } from "../cards/AMB/champions/jin-undying-resolve.ts";
import { adventOfTheShenju } from "../cards/P25/actions/advent-of-the-shenju.ts";
import { sunQuanSealbearer } from "../cards/AMB/allies/sun-quan-sealbearer.ts";
import { sylphsEnvelopment } from "../cards/HVN/actions/sylphs-envelopment.ts";
import { palatialConcourse } from "../cards/ALC/domains/palatial-concourse.ts";
import { mistboundCutthroat } from "../cards/DOA/allies/mistbound-cutthroat.ts";
import { aquatechShield } from "../cards/PRD/items/aquatech-shield.ts";
import { allianceGearshield } from "../cards/ALC/items/alliance-gearshield.ts";
import { flamewreathCall } from "../cards/P25/actions/flamewreath-call.ts";
import { determinedSpearman } from "../cards/AMB/allies/determined-spearman.ts";
import { awakenedDeacon } from "../cards/ALC/allies/awakened-deacon.ts";
import { unruledBereavement } from "../cards/PRD/actions/unruled-bereavement.ts";
import { coriolisWard } from "../cards/P24/actions/coriolis-ward.ts";
import { pridesSmith } from "../cards/DTR/allies/prides-smith.ts";
import { furnaceDrone } from "../cards/MRC/allies/furnace-drone.ts";
import { stabilizingBladecore } from "../cards/PRD/items/stabilizing-bladecore.ts";
import { inquisitiveMagician } from "../cards/HVN/allies/inquisitive-magician.ts";
import { ghostsightGlass } from "../cards/AMB/items/ghostsight-glass.ts";
import { driftingAbysshell } from "../cards/PTM/allies/drifting-abysshell.ts";
import { fulminatingStorm } from "../cards/RDO/actions/fulminating-storm.ts";
import { heftyHammering } from "../cards/PRD/attacks/hefty-hammering.ts";
import { lostSpirit } from "../cards/DEMO22/champions/lost-spirit.ts";
import { fractalOfIntrusion } from "../cards/FTC/phantasias/fractal-of-intrusion.ts";
import { sighingCrownwing } from "../cards/PTM/allies/sighing-crownwing.ts";
import { leranPastoralHymns } from "../cards/PRD/domains/leran-pastoral-hymns.ts";
import { spiritBladeInfusion } from "../cards/DOA/actions/spirit-blade-infusion.ts";
import { organizeTheAlliance } from "../cards/ALC/actions/organize-the-alliance.ts";
import { defendersMaul } from "../cards/AMB/weapons/defenders-maul.ts";
import { impactHammer } from "../cards/MRC/weapons/impact-hammer.ts";
import { shieldFragmentation } from "../cards/MRC/actions/shield-fragmentation.ts";
import { tuneUp } from "../cards/RDO/actions/tune-up.ts";
import { berserkerPlate } from "../cards/P24/items/berserker-plate.ts";
import { exsanguinatingWallop } from "../cards/DTR/attacks/exsanguinating-wallop.ts";
import { escharotomy } from "../cards/PRD/actions/escharotomy.ts";
import { buffetingHurricane } from "../cards/PTM/phantasias/buffeting-hurricane.ts";
import { volnia } from "../cards/RDO/tokens/volnia.ts";
import { counterInterference } from "../cards/MRC/actions/counter-interference.ts";
import { peacockOfProsperity } from "../cards/P25/allies/peacock-of-prosperity.ts";
import { bellonasRunestone } from "../cards/AMB/items/bellonas-runestone.ts";
import { rhongomiantGrovesSpire } from "../cards/P26/weapons/rhongomiant-groves-spire.ts";
import { aeneanSparkAlight } from "../cards/PRD/actions/aenean-spark-alight.ts";
import { gustmarkGauge } from "../cards/PTM/items/gustmark-gauge.ts";
import { votiveRuneblade } from "../cards/DTR/weapons/votive-runeblade.ts";
import { turboCharge } from "../cards/MRC/actions/turbo-charge.ts";
import { suffocatingMiasma } from "../cards/MRC/phantasias/suffocating-miasma.ts";
import { fracturize } from "../cards/FTC/actions/fracturize.ts";
import { spiritBladeEnsoul } from "../cards/DOA/actions/spirit-blade-ensoul.ts";
import { babyGreenSlime } from "../cards/P24/allies/baby-green-slime.ts";
import { spontaneousCombustion } from "../cards/DOA/actions/spontaneous-combustion.ts";
import { squallsnare } from "../cards/PTM/actions/squallsnare.ts";
import { refabrication } from "../cards/ALC/actions/refabrication.ts";
import { ombreuxChevalier } from "../cards/P25/allies/ombreux-chevalier.ts";
import { strappingConscript } from "../cards/DOA/allies/strapping-conscript.ts";
import { spellshieldExia } from "../cards/PRD/actions/spellshield-exia.ts";
import { glacialBinding } from "../cards/RDO/actions/glacial-binding.ts";
import { cheshireCatImpishGrin } from "../cards/P26/allies/cheshire-cat-impish-grin.ts";
import { meadowbloomDryad } from "../cards/DOA/allies/meadowbloom-dryad.ts";
import { patientRogue } from "../cards/DOA/allies/patient-rogue.ts";
import { piquantShieldbearer } from "../cards/RDO/allies/piquant-shieldbearer.ts";
import { lesserBoonOfNuwa } from "../cards/PP1/boons/lesser-boon-of-nuwa.ts";
import { honorableVanguard } from "../cards/DEMO22/allies/honorable-vanguard.ts";
import { whimsysWarden } from "../cards/P25/allies/whimsys-warden.ts";
import { flawlessSpiritOfMordred } from "../cards/P26/champions/flawless-spirit-of-mordred.ts";
import { fractalOfRefreshment } from "../cards/P25/phantasias/fractal-of-refreshment.ts";
import { krustallanLongsword } from "../cards/MRC/weapons/krustallan-longsword.ts";
import { quicksilverGrail } from "../cards/FTC/items/quicksilver-grail.ts";
import { cultivate } from "../cards/MRC/actions/cultivate.ts";
import { hypothermia } from "../cards/ALC/actions/hypothermia.ts";
import { chasingShadows } from "../cards/RDO/phantasias/chasing-shadows.ts";
import { prismaticCodex } from "../cards/AMB/items/prismatic-codex.ts";
import { dorumegianFoundry } from "../cards/MRC/domains/dorumegian-foundry.ts";
import { heartsongReclamation } from "../cards/RDO/actions/heartsong-reclamation.ts";
import { phantasmagoria } from "../cards/PTM/masteries/phantasmagoria.ts";
import { eightOfSpades } from "../cards/RDO/allies/eight-of-spades.ts";
import { setAblaze } from "../cards/AMB/actions/set-ablaze.ts";
import { airshipCannoneer } from "../cards/ALC/allies/airship-cannoneer.ts";
import { caoCaoAspirantOfChaos } from "../cards/AMB/allies/cao-cao-aspirant-of-chaos.ts";
import { beseechingFlourish } from "../cards/AMB/attacks/beseeching-flourish.ts";
import { obeliskOfProtection } from "../cards/ALC/tokens/obelisk-of-protection.ts";
import { suffocatingAsh } from "../cards/PTM/actions/suffocating-ash.ts";
import { bannerOfAres } from "../cards/PRD/items/banner-of-ares.ts";
import { polishingFlourish } from "../cards/P26/actions/polishing-flourish.ts";
import { diaoChanIdyllCorsage } from "../cards/HVN/champions/diao-chan-idyll-corsage.ts";
import { batheInLight } from "../cards/AMB/actions/bathe-in-light.ts";
import { spiritOfSereneFire } from "../cards/FTC/champions/spirit-of-serene-fire.ts";
import { aliceGoldenQueen } from "../cards/DTR/champions/alice-golden-queen.ts";
import { eruptingRhapsody } from "../cards/DOA/actions/erupting-rhapsody.ts";
import { shroudInMist } from "../cards/DOA/actions/shroud-in-mist.ts";
import { rearingRebound } from "../cards/HVN/actions/rearing-rebound.ts";
import { slimeCalling } from "../cards/RDO/actions/slime-calling.ts";
import { purifiedShot } from "../cards/MRC/items/purified-shot.ts";
import { kindlingFlare } from "../cards/MRC/actions/kindling-flare.ts";
import { aeneanReclaim } from "../cards/PRD/actions/aenean-reclaim.ts";
import { deathEssenceAmulet } from "../cards/DTR/items/death-essence-amulet.ts";
import { seasonsEnd } from "../cards/P25/actions/seasons-end.ts";
import { sleightOfHand } from "../cards/DTR/actions/sleight-of-hand.ts";
import { conductiveStrike } from "../cards/PRD/attacks/conductive-strike.ts";
import { evasivePositioning } from "../cards/DTR/actions/evasive-positioning.ts";
import { gentleRespite } from "../cards/PRD/actions/gentle-respite.ts";
import { offWithHerHead } from "../cards/PTM/attacks/off-with-her-head.ts";
import { apotheosisRite } from "../cards/P24/items/apotheosis-rite.ts";
import { essenceCrucible } from "../cards/RDO/items/essence-crucible.ts";
import { moltenCinder } from "../cards/MRC/items/molten-cinder.ts";
import { enhancePotency } from "../cards/ALC/actions/enhance-potency.ts";
import { ingressOfSanguineIre } from "../cards/AMB/actions/ingress-of-sanguine-ire.ts";
import { weissBishop } from "../cards/PTM/allies/weiss-bishop.ts";
import { sweetAmbrosia } from "../cards/P24/items/sweet-ambrosia.ts";
import { strikeFromTheMist } from "../cards/DOA/attacks/strike-from-the-mist.ts";
import { arcanistsPrism } from "../cards/DOA/items/arcanists-prism.ts";
import { devisedConspiracy } from "../cards/RDO/actions/devised-conspiracy.ts";
import { captainArcher } from "../cards/HVN/allies/captain-archer.ts";
import { goldenKnight } from "../cards/PTM/allies/golden-knight.ts";
import { chanceSevenOfSpades } from "../cards/PTM/allies/chance-seven-of-spades.ts";
import { besiegedSlash } from "../cards/RDO/attacks/besieged-slash.ts";
import { warMarshal } from "../cards/AMB/allies/war-marshal.ts";
import { atmosArmorTypeHermes } from "../cards/PRD/allies/atmos-armor-type-hermes.ts";
import { winblessForecaster } from "../cards/MRC/allies/winbless-forecaster.ts";
import { swordOfAvarice } from "../cards/DOA/weapons/sword-of-avarice.ts";
import { crystalOfEmpowerment } from "../cards/DOA/items/crystal-of-empowerment.ts";
import { lostProvidence } from "../cards/PTM/items/lost-providence.ts";
import { hoarfrostHold } from "../cards/RDO/phantasias/hoarfrost-hold.ts";
import { greaterBoonOfRosen } from "../cards/PRD/boons/greater-boon-of-rosen.ts";
import { dynastyChancellor } from "../cards/HVN/allies/dynasty-chancellor.ts";
import { fortifyingAroma } from "../cards/ALC/actions/fortifying-aroma.ts";
import { radiantOriginOfMage } from "../cards/RDO/phantasias/radiant-origin-of-mage.ts";
import { lorraineWanderingWarrior } from "../cards/DEMO22/champions/lorraine-wandering-warrior.ts";
import { merlinAmethystsGlow } from "../cards/PTM/champions/merlin-amethysts-glow.ts";
import { swordOfAdversity } from "../cards/DOA/weapons/sword-of-adversity.ts";
import { relicOfSunkenPast } from "../cards/AMB/phantasias/relic-of-sunken-past.ts";
import { erraticBolt } from "../cards/DOA/actions/erratic-bolt.ts";
import { heirloomOfNatura } from "../cards/RDO/items/heirloom-of-natura.ts";
import { foresightLens } from "../cards/P25/items/foresight-lens.ts";
import { favorableWinds } from "../cards/DOA/actions/favorable-winds.ts";
import { hastyMessenger } from "../cards/DOA/allies/hasty-messenger.ts";
import { waterResonanceBauble } from "../cards/DOA/items/water-resonance-bauble.ts";
import { floralArrangement } from "../cards/RDO/actions/floral-arrangement.ts";
import { spectralHaunting } from "../cards/PTM/actions/spectral-haunting.ts";
import { soutirerVortex } from "../cards/DTR/phantasias/soutirer-vortex.ts";
import { diluAuspiciousCharger } from "../cards/EVP/allies/dilu-auspicious-charger.ts";
import { gawainChivalrousThief } from "../cards/EVP/allies/gawain-chivalrous-thief.ts";
import { lostBeing } from "../cards/PTM/tokens/lost-being.ts";
import { sorrowcaller } from "../cards/MRC/weapons/sorrowcaller.ts";
import { bellOfTheChosen } from "../cards/HVN/items/bell-of-the-chosen.ts";
import { vernalTalisman } from "../cards/RDO/items/vernal-talisman.ts";
import { meteorStrike } from "../cards/MRC/actions/meteor-strike.ts";
import { cosmicFocus } from "../cards/PTM/actions/cosmic-focus.ts";
import { austerePriestess } from "../cards/HVN/allies/austere-priestess.ts";
import { brewingKit } from "../cards/ALC/items/brewing-kit.ts";
import { trineRecursion } from "../cards/RDO/actions/trine-recursion.ts";
import { suddenSnow } from "../cards/DOA/actions/sudden-snow.ts";
import { recklessResearcher } from "../cards/DOA/allies/reckless-researcher.ts";
import { glimmerEssenceAmulet } from "../cards/P25/items/glimmer-essence-amulet.ts";
import { springCleaning } from "../cards/RDO/actions/spring-cleaning.ts";
import { myopicLens } from "../cards/PTM/items/myopic-lens.ts";
import { tomeOfIgnorance } from "../cards/DTR/items/tome-of-ignorance.ts";
import { swordOfSeeking } from "../cards/P26/weapons/sword-of-seeking.ts";
import { vertusGaiasRoar } from "../cards/DOA/allies/vertus-gaias-roar.ts";
import { equanimitysAshes } from "../cards/AMB/actions/equanimitys-ashes.ts";
import { ticketToTheAfterlife } from "../cards/PTM/items/ticket-to-the-afterlife.ts";
import { edgeOfTomorrow } from "../cards/PRD/actions/edge-of-tomorrow.ts";
import { windfallCheck } from "../cards/PTM/attacks/windfall-check.ts";
import { sinistreStab } from "../cards/P25/attacks/sinistre-stab.ts";
import { astralSeal } from "../cards/P26/actions/astral-seal.ts";
import { poisonousBreezecap } from "../cards/DTR/items/poisonous-breezecap.ts";
import { dianaKeenHuntress } from "../cards/ALC/champions/diana-keen-huntress.ts";
import { blazingCindercharge } from "../cards/DTR/actions/blazing-cindercharge.ts";
import { scepterOfLumina } from "../cards/PRXY/items/scepter-of-lumina.ts";
import { reverentSeraphim } from "../cards/RDO/allies/reverent-seraphim.ts";
import { gunsmithsArsenal } from "../cards/RDO/actions/gunsmiths-arsenal.ts";
import { armedSquallguard } from "../cards/DTR/allies/armed-squallguard.ts";
import { restorativeSlash } from "../cards/DOA/attacks/restorative-slash.ts";
import { twoOfSpades } from "../cards/DTR/allies/two-of-spades.ts";
import { blastShield } from "../cards/MRC/items/blast-shield.ts";
import { loneGunslinger } from "../cards/ALC/allies/lone-gunslinger.ts";
import { gildedPyre } from "../cards/PTM/actions/gilded-pyre.ts";
import { madTeaParty } from "../cards/SP4/domains/mad-tea-party.ts";
import { aithneSpiritOfFire } from "../cards/P23/champions/aithne-spirit-of-fire.ts";
import { cellwardenDroid } from "../cards/PRD/allies/cellwarden-droid.ts";
import { channelingStone } from "../cards/DOA/items/channeling-stone.ts";
import { scorchingKnowledge } from "../cards/RDO/actions/scorching-knowledge.ts";
import { aeneanCyclone } from "../cards/PRD/actions/aenean-cyclone.ts";
import { voldaSmoldersSpite } from "../cards/MRC/allies/volda-smolders-spite.ts";
import { azraelArchangelOfMateria } from "../cards/RDO/allies/azrael-archangel-of-materia.ts";
import { enhanceHearing } from "../cards/ALC/actions/enhance-hearing.ts";
import { lightTheHunt } from "../cards/P25/actions/light-the-hunt.ts";
import { trainingDummy } from "../cards/P26/tokens/training-dummy.ts";
import { crumblingReign } from "../cards/PTM/actions/crumbling-reign.ts";
import { mirrordepthsBlade } from "../cards/P26/weapons/mirrordepths-blade.ts";
import { eventideLure } from "../cards/P25/phantasias/eventide-lure.ts";
import { lostInThought } from "../cards/P24/actions/lost-in-thought.ts";
import { stalwartShieldmate } from "../cards/FTC/allies/stalwart-shieldmate.ts";
import { senarisSixOfDiamonds } from "../cards/RDO/allies/senaris-six-of-diamonds.ts";
import { seasideRingleader } from "../cards/MRC/allies/seaside-ringleader.ts";
import { gearshiftBlock } from "../cards/MRC/actions/gearshift-block.ts";
import { lustrousSlime } from "../cards/P24/allies/lustrous-slime.ts";
import { boltOfDiamonds } from "../cards/SP4/actions/bolt-of-diamonds.ts";
import { direRequiem } from "../cards/HVN/actions/dire-requiem.ts";
import { restorativeFlame } from "../cards/HVN/actions/restorative-flame.ts";
import { ardusFloodborneDeacon } from "../cards/RDO/allies/ardus-floodborne-deacon.ts";
import { finalStroke } from "../cards/MRC/attacks/final-stroke.ts";
import { spiritedNeophyte } from "../cards/P24/allies/spirited-neophyte.ts";
import { zhangJiaoWayOfPeace } from "../cards/HVN/allies/zhang-jiao-way-of-peace.ts";
import { dungeonGuide } from "../cards/P26/allies/dungeon-guide.ts";
import { slimeNexus } from "../cards/P24/items/slime-nexus.ts";
import { alicePhantomMonarch } from "../cards/PTM/champions/alice-phantom-monarch.ts";
import { drenchingFinish } from "../cards/P26/attacks/drenching-finish.ts";
import { guoJiaHeavensFavored } from "../cards/HVN/champions/guo-jia-heavens-favored.ts";
import { galahadCourtKnight } from "../cards/DOA/allies/galahad-court-knight.ts";
import { astralShard } from "../cards/DTR/tokens/astral-shard.ts";
import { squallbindPounce } from "../cards/HVN/actions/squallbind-pounce.ts";
import { xukongShiftedFates } from "../cards/RDO/phantasias/xukong-shifted-fates.ts";
import { conduitOfBloodfire } from "../cards/PRD/allies/conduit-of-bloodfire.ts";
import { stardustOracle } from "../cards/PTM/allies/stardust-oracle.ts";
import { cellConverter } from "../cards/MRC/allies/cell-converter.ts";
import { stormTyrantsEye } from "../cards/DOA/items/storm-tyrants-eye.ts";
import { warriorOfTheFaeRealm } from "../cards/P26/allies/warrior-of-the-fae-realm.ts";
import { spurnToAsh } from "../cards/DOA/actions/spurn-to-ash.ts";
import { conjuringFluorescence } from "../cards/PTM/actions/conjuring-fluorescence.ts";
import { drawnBlade } from "../cards/P26/weapons/drawn-blade.ts";
import { cellSharpshooter } from "../cards/MRC/allies/cell-sharpshooter.ts";
import { strategicPlanning } from "../cards/DOA/actions/strategic-planning.ts";
import { unmooredCall } from "../cards/PTM/actions/unmoored-call.ts";
import { alchemistsKit } from "../cards/ALC/items/alchemists-kit.ts";
import { equipWithCourage } from "../cards/PRD/actions/equip-with-courage.ts";
import { tweedledeeContrarianPoet } from "../cards/EVP/allies/tweedledee-contrarian-poet.ts";
import { vacuousCall } from "../cards/PTM/phantasias/vacuous-call.ts";
import { deadlyOpportunist } from "../cards/DTR/allies/deadly-opportunist.ts";
import { allowanceRace } from "../cards/RDO/actions/allowance-race.ts";
import { galvanizingGale } from "../cards/AMB/actions/galvanizing-gale.ts";
import { wildheartHymn } from "../cards/HVN/actions/wildheart-hymn.ts";
import { astarteCelestialDawn } from "../cards/EVP/allies/astarte-celestial-dawn.ts";
import { mementoPocketwatch } from "../cards/DTR/items/memento-pocketwatch.ts";
import { slimeKing } from "../cards/EVP/allies/slime-king.ts";
import { umbraSight } from "../cards/ALC/actions/umbra-sight.ts";
import { fulminatorRisingStorm } from "../cards/PRD/weapons/fulminator-rising-storm.ts";
import { beastbondPaws } from "../cards/DOA/items/beastbond-paws.ts";
import { slySongstress } from "../cards/HVN/allies/sly-songstress.ts";
import { reclaim } from "../cards/DOA/actions/reclaim.ts";
import { namelessChampionCw } from "../cards/AMB/champions/nameless-champion-cw.ts";
import { servantsObligation } from "../cards/DTR/items/servants-obligation.ts";
import { oathbreakersJustice } from "../cards/AMB/weapons/oathbreakers-justice.ts";
import { spellwardScepter } from "../cards/DTR/items/spellward-scepter.ts";
import { poweredSwordsman } from "../cards/MRC/allies/powered-swordsman.ts";
import { turbulentBullet } from "../cards/ALC/items/turbulent-bullet.ts";
import { scryTheSkies } from "../cards/DOA/actions/scry-the-skies.ts";
import { primevalRitual } from "../cards/HVN/actions/primeval-ritual.ts";
import { rangerBoots } from "../cards/P25/items/ranger-boots.ts";
import { frogletFootman } from "../cards/DTR/allies/froglet-footman.ts";
import { zanderDeftExecutor } from "../cards/PRXY/champions/zander-deft-executor.ts";
import { trustySteed } from "../cards/DEMO22/allies/trusty-steed.ts";
import { memoriteObelith } from "../cards/PTM/tokens/memorite-obelith.ts";
import { scavengingRaccoon } from "../cards/P23/allies/scavenging-raccoon.ts";
import { musicAficionado } from "../cards/PRD/allies/music-aficionado.ts";
import { bannerRaccoon } from "../cards/RDO/allies/banner-raccoon.ts";
import { krustallanRuins } from "../cards/PRD/domains/krustallan-ruins.ts";
import { martialFlowstate } from "../cards/PRD/phantasias/martial-flowstate.ts";
import { obscuringThreads } from "../cards/P25/actions/obscuring-threads.ts";
import { chargedAssailant } from "../cards/MRC/allies/charged-assailant.ts";
import { freezingGambit } from "../cards/PTM/actions/freezing-gambit.ts";
import { flameSweep } from "../cards/DOA/attacks/flame-sweep.ts";
import { disintegrate } from "../cards/P26/actions/disintegrate.ts";
import { candlelightHourglass } from "../cards/DTR/items/candlelight-hourglass.ts";
import { luciaReclaimedBlight } from "../cards/PRD/allies/lucia-reclaimed-blight.ts";
import { lesserBoonOfRosen } from "../cards/PP1/boons/lesser-boon-of-rosen.ts";
import { capacitanceXPsycho } from "../cards/PRD/weapons/capacitance-x-psycho.ts";
import { artOfWar } from "../cards/HVN/items/art-of-war.ts";
import { ashenRiffle } from "../cards/DTR/actions/ashen-riffle.ts";
import { iridescentResurgence } from "../cards/RDO/actions/iridescent-resurgence.ts";
import { aeneanFrozenShunt } from "../cards/PRD/actions/aenean-frozen-shunt.ts";
import { galesMare } from "../cards/RDO/allies/gales-mare.ts";
import { theLookingGlass } from "../cards/DTR/items/the-looking-glass.ts";
import { moontideIllusionist } from "../cards/HVN/allies/moontide-illusionist.ts";
import { manxomeArmoire } from "../cards/P25/items/manxome-armoire.ts";
import { aqueousEnchanting } from "../cards/DOA/actions/aqueous-enchanting.ts";
import { returnToTheDepths } from "../cards/PTM/actions/return-to-the-depths.ts";
import { restoringEmbers } from "../cards/AMB/actions/restoring-embers.ts";
import { gloamspireMantle } from "../cards/MRC/items/gloamspire-mantle.ts";
import { namelessChampionRw } from "../cards/PRD/champions/nameless-champion-rw.ts";
import { auravoltCurrent } from "../cards/RDO/actions/auravolt-current.ts";
import { rustedWarshield } from "../cards/ALC/items/rusted-warshield.ts";
import { glimmeringRefusal } from "../cards/P25/actions/glimmering-refusal.ts";
import { inspiringAethercharge } from "../cards/RDO/actions/inspiring-aethercharge.ts";
import { poweredArmsmaster } from "../cards/MRC/allies/powered-armsmaster.ts";
import { hotCake } from "../cards/PRD/items/hot-cake.ts";
import { graveGateau } from "../cards/PTM/items/grave-gateau.ts";
import { arielArchangelOfNatura } from "../cards/RDO/allies/ariel-archangel-of-natura.ts";
import { sageProtection } from "../cards/HVN/actions/sage-protection.ts";
import { avatarOfGaia } from "../cards/FTC/allies/avatar-of-gaia.ts";
import { flickeringCinder } from "../cards/DTR/actions/flickering-cinder.ts";
import { prototypePistol } from "../cards/P24/weapons/prototype-pistol.ts";
import { signalGunner } from "../cards/PRD/allies/signal-gunner.ts";
import { veteranAerotheurge } from "../cards/DTR/allies/veteran-aerotheurge.ts";
import { spiritOfPurity } from "../cards/PTM/champions/spirit-of-purity.ts";
import { pendantOfApsisRestraint } from "../cards/RDO/items/pendant-of-apsis-restraint.ts";
import { raisedSlash } from "../cards/DTR/attacks/raised-slash.ts";
import { tidestoneSeeker } from "../cards/HVN/allies/tidestone-seeker.ts";
import { phantomVeil } from "../cards/AMB/items/phantom-veil.ts";
import { steelHalberd } from "../cards/P24/weapons/steel-halberd.ts";
import { seasonedArcher } from "../cards/AMB/allies/seasoned-archer.ts";
import { maChaoLupineHuntress } from "../cards/HVN/allies/ma-chao-lupine-huntress.ts";
import { cryogenicRitual } from "../cards/PRD/actions/cryogenic-ritual.ts";
import { sparkFairy } from "../cards/DOA/allies/spark-fairy.ts";
import { venerableSage } from "../cards/RDO/allies/venerable-sage.ts";
import { kazeSpiritOfWind } from "../cards/P25/champions/kaze-spirit-of-wind.ts";
import { performanceEnthusiast } from "../cards/PRD/allies/performance-enthusiast.ts";
import { dewdropHares } from "../cards/DOA/allies/dewdrop-hares.ts";
import { prismaticEdge } from "../cards/DOA/weapons/prismatic-edge.ts";
import { theEternalKingdom } from "../cards/ALC/domains/the-eternal-kingdom.ts";
import { magusInitiate } from "../cards/PRD/allies/magus-initiate.ts";
import { windmillEngineer } from "../cards/P24/allies/windmill-engineer.ts";
import { heatwaveGenerator } from "../cards/ALC/items/heatwave-generator.ts";
import { greaterBoonOfEnki } from "../cards/PP1/boons/greater-boon-of-enki.ts";
import { bloodDragonsPact } from "../cards/RDO/phantasias/blood-dragons-pact.ts";
import { harnessMana } from "../cards/DOA/actions/harness-mana.ts";
import { sigilOfBuddingEmbers } from "../cards/HVN/items/sigil-of-budding-embers.ts";
import { royalOathguard } from "../cards/PTM/allies/royal-oathguard.ts";
import { trainingSession } from "../cards/DOA/actions/training-session.ts";
import { artificersOpus } from "../cards/DOA/allies/artificers-opus.ts";
import { bottledForgelight } from "../cards/ALC/items/bottled-forgelight.ts";
import { collectJunk } from "../cards/PRD/actions/collect-junk.ts";
import { deflectingEdge } from "../cards/DOA/actions/deflecting-edge.ts";
import { aellaZephyrsHand } from "../cards/RDO/allies/aella-zephyrs-hand.ts";
import { consumptionRing } from "../cards/DTR/items/consumption-ring.ts";
import { raiStormSeer } from "../cards/DOA/champions/rai-storm-seer.ts";
import { gildasFaeswornMonarch } from "../cards/P26/allies/gildas-faesworn-monarch.ts";
import { aphoticRuin } from "../cards/HVN/actions/aphotic-ruin.ts";
import { vanishingEclipse } from "../cards/DTR/actions/vanishing-eclipse.ts";
import { renascentSharpshooter } from "../cards/DTR/allies/renascent-sharpshooter.ts";
import { xiaHouDunGloryseeker } from "../cards/AMB/allies/xia-hou-dun-gloryseeker.ts";
import { dodgeRoll } from "../cards/MRC/actions/dodge-roll.ts";
import { hydrocaskDroid } from "../cards/PRD/allies/hydrocask-droid.ts";
import { soothingDisillusion } from "../cards/AMB/actions/soothing-disillusion.ts";
import { noxFinalRelease } from "../cards/RDO/items/nox-final-release.ts";
import { eminentLethargy } from "../cards/PTM/actions/eminent-lethargy.ts";
import { lesserBoonOfVeilara } from "../cards/PP1/boons/lesser-boon-of-veilara.ts";
import { sinonBabeliasCompanion } from "../cards/PRD/allies/sinon-babelias-companion.ts";
import { aliceDistortedQueen } from "../cards/PTM/champions/alice-distorted-queen.ts";
import { recklessConversion } from "../cards/DOA/actions/reckless-conversion.ts";
import { keepOfTheGoldenSashes } from "../cards/AMB/domains/keep-of-the-golden-sashes.ts";
import { arthurYoungHeir } from "../cards/DOA/allies/arthur-young-heir.ts";
import { revitalizerXUltra } from "../cards/PRD/items/revitalizer-x-ultra.ts";
import { silvieLovedByAll } from "../cards/DOA/champions/silvie-loved-by-all.ts";
import { blazingDirewolf } from "../cards/DOA/allies/blazing-direwolf.ts";
import { lesserBoonOfIsis } from "../cards/PP1/boons/lesser-boon-of-isis.ts";
import { blastshotPump } from "../cards/P24/weapons/blastshot-pump.ts";
import { wornDiary } from "../cards/MRC/items/worn-diary.ts";
import { echoicGuard } from "../cards/MRC/actions/echoic-guard.ts";
import { lostPromises } from "../cards/PTM/actions/lost-promises.ts";
import { drownInAether } from "../cards/P25/actions/drown-in-aether.ts";
import { solarProvidence } from "../cards/HVN/actions/solar-providence.ts";
import { harmoniousMantra } from "../cards/P24/actions/harmonious-mantra.ts";
import { soothingPotion } from "../cards/RDO/items/soothing-potion.ts";
import { elucidatePlans } from "../cards/RDO/actions/elucidate-plans.ts";
import { dinahLostSpirit } from "../cards/P26/champions/dinah-lost-spirit.ts";
import { raiSpellcrafter } from "../cards/DOA/champions/rai-spellcrafter.ts";
import { crowdsFavor } from "../cards/PP1/statuses/crowds-favor.ts";
import { combustiblePotion } from "../cards/RDO/items/combustible-potion.ts";
import { lureTheAbyss } from "../cards/DTR/actions/lure-the-abyss.ts";
import { spiritOfFortuitousWind } from "../cards/HVN/champions/spirit-of-fortuitous-wind.ts";
import { aeneanWard } from "../cards/PRD/actions/aenean-ward.ts";
import { epochalConqueror } from "../cards/RDO/allies/epochal-conqueror.ts";
import { ignitedStab } from "../cards/DOA/attacks/ignited-stab.ts";
import { chainedCharge } from "../cards/DTR/actions/chained-charge.ts";
import { sashaPurifyingAcolyte } from "../cards/RDO/allies/sasha-purifying-acolyte.ts";
import { armedAndDangerous } from "../cards/MRC/actions/armed-and-dangerous.ts";
import { zanderCorhazisChosen } from "../cards/DOA/champions/zander-corhazis-chosen.ts";
import { fieryInterference } from "../cards/SP4/actions/fiery-interference.ts";
import { tristanHiredBlade } from "../cards/MRC/champions/tristan-hired-blade.ts";
import { tidalSweep } from "../cards/SP4/attacks/tidal-sweep.ts";
import { ominousShadow } from "../cards/EVP/tokens/ominous-shadow.ts";
import { shoutAtYourPets } from "../cards/DOA/actions/shout-at-your-pets.ts";
import { perfectRepulsion } from "../cards/ALC/actions/perfect-repulsion.ts";
import { lenaDorumegiasHerald } from "../cards/ALC/allies/lena-dorumegias-herald.ts";
import { starstrungReading } from "../cards/PTM/actions/starstrung-reading.ts";
import { rebelliousBull } from "../cards/DOA/allies/rebellious-bull.ts";
import { bedlamBorough } from "../cards/PRD/domains/bedlam-borough.ts";
import { gossamerStaff } from "../cards/AMB/items/gossamer-staff.ts";
import { bannerSlime } from "../cards/RDO/allies/banner-slime.ts";
import { seafletchedSerpent } from "../cards/AMB/allies/seafletched-serpent.ts";
import { surgingSearch } from "../cards/RDO/actions/surging-search.ts";
import { nefariousTimepiece } from "../cards/DTR/items/nefarious-timepiece.ts";
import { temporalSpectrometer } from "../cards/ALC/items/temporal-spectrometer.ts";
import { distilledAtrophy } from "../cards/ALC/items/distilled-atrophy.ts";
import { dianWeiValorantFury } from "../cards/HVN/allies/dian-wei-valorant-fury.ts";
import { promisingRecruit } from "../cards/AMB/allies/promising-recruit.ts";
import { rougeAceOfHearts } from "../cards/PRD/allies/rouge-ace-of-hearts.ts";
import { turbulentBountyHunter } from "../cards/PRD/allies/turbulent-bounty-hunter.ts";
import { crescentGlaive } from "../cards/AMB/weapons/crescent-glaive.ts";
import { craggyFatestone } from "../cards/P25/items/craggy-fatestone.ts";
import { spiritOfSereneWind } from "../cards/FTC/champions/spirit-of-serene-wind.ts";
import { torpidFractal } from "../cards/AMB/phantasias/torpid-fractal.ts";
import { alchemicalScripture } from "../cards/MRC/items/alchemical-scripture.ts";
import { overchargedDroid } from "../cards/PRD/allies/overcharged-droid.ts";
import { ischemicSoldier } from "../cards/PRD/allies/ischemic-soldier.ts";
import { blightedJewel } from "../cards/DTR/items/blighted-jewel.ts";
import { maidenOfPrimalVirtue } from "../cards/HVN/phantasias/maiden-of-primal-virtue.ts";
import { slimeshield } from "../cards/P24/actions/slimeshield.ts";
import { battlefieldBenediction } from "../cards/RDO/actions/battlefield-benediction.ts";
import { intensifiedPyre } from "../cards/DTR/actions/intensified-pyre.ts";
import { crystalAccretion } from "../cards/PTM/actions/crystal-accretion.ts";
import { cemeterySentry } from "../cards/DOA/allies/cemetery-sentry.ts";
import { searingRebuke } from "../cards/HVN/actions/searing-rebuke.ts";
import { tristanShadowdancer } from "../cards/P24/champions/tristan-shadowdancer.ts";
import { aesanProtector } from "../cards/DOA/allies/aesan-protector.ts";
import { loadedThoughts } from "../cards/MRC/weapons/loaded-thoughts.ts";
import { elysianAspirant } from "../cards/PRD/allies/elysian-aspirant.ts";
import { blackmarketBroker } from "../cards/DOA/allies/blackmarket-broker.ts";
import { unstableVoltage } from "../cards/RDO/actions/unstable-voltage.ts";
import { hideInBush } from "../cards/MRC/actions/hide-in-bush.ts";
import { grayWolf } from "../cards/DOA/allies/gray-wolf.ts";
import { deepSeaFractal } from "../cards/FTC/phantasias/deep-sea-fractal.ts";
import { aurousteelGreatsword } from "../cards/ALC/tokens/aurousteel-greatsword.ts";
import { foldedShadows } from "../cards/PTM/items/folded-shadows.ts";
import { pearledPrayer } from "../cards/RDO/actions/pearled-prayer.ts";
import { baubleOfMending } from "../cards/DOA/items/bauble-of-mending.ts";
import { shiftingMirage } from "../cards/P24/actions/shifting-mirage.ts";
import { dyadicFletcher } from "../cards/DTR/allies/dyadic-fletcher.ts";
import { scorchedConquest } from "../cards/PRD/actions/scorched-conquest.ts";
import { convergentBeam } from "../cards/PRD/actions/convergent-beam.ts";
import { windpiercer } from "../cards/MRC/items/windpiercer.ts";
import { imperialCountermeasure } from "../cards/RDO/actions/imperial-countermeasure.ts";
import { leechingBolt } from "../cards/SP4/actions/leeching-bolt.ts";
import { bestialFrenzy } from "../cards/DOA/actions/bestial-frenzy.ts";
import { meltdown } from "../cards/ALC/actions/meltdown.ts";
import { spiritBladeRetribution } from "../cards/RDO/attacks/spirit-blade-retribution.ts";
import { smolderingCook } from "../cards/PRD/allies/smoldering-cook.ts";
import { secondWind } from "../cards/DOA/actions/second-wind.ts";
import { windsOfRetribution } from "../cards/ALC/actions/winds-of-retribution.ts";
import { shadeStriker } from "../cards/RDO/allies/shade-striker.ts";
import { mistResonance } from "../cards/DOA/actions/mist-resonance.ts";
import { tempestSilverback } from "../cards/DOA/allies/tempest-silverback.ts";
import { breezyLooper } from "../cards/PRD/allies/breezy-looper.ts";
import { veiledGambit } from "../cards/PTM/actions/veiled-gambit.ts";
import { unbridledFlare } from "../cards/PRD/items/unbridled-flare.ts";
import { exploitVulnerability } from "../cards/P24/actions/exploit-vulnerability.ts";
import { sacredBarrier } from "../cards/RDO/actions/sacred-barrier.ts";
import { tempestuousSeraphim } from "../cards/RDO/allies/tempestuous-seraphim.ts";
import { diamondInTheRough } from "../cards/RDO/actions/diamond-in-the-rough.ts";
import { blightroot } from "../cards/ALC/tokens/blightroot.ts";
import { weightOfLookingUp } from "../cards/PRD/actions/weight-of-looking-up.ts";
import { strategicWarfare } from "../cards/ALC/actions/strategic-warfare.ts";
import { protectorsPlate } from "../cards/AMB/items/protectors-plate.ts";
import { brashDefender } from "../cards/AMB/allies/brash-defender.ts";
import { nimbleCourtAssassin } from "../cards/RDO/allies/nimble-court-assassin.ts";
import { towerOfDis } from "../cards/PRD/domains/tower-of-dis.ts";
import { baihua } from "../cards/HVN/tokens/baihua.ts";
import { automatonBeastkeeper } from "../cards/MRC/allies/automaton-beastkeeper.ts";
import { zephyrsEdge } from "../cards/FTC/weapons/zephyrs-edge.ts";
import { savageSmash } from "../cards/MRC/attacks/savage-smash.ts";
import { coneOfFrost } from "../cards/P24/actions/cone-of-frost.ts";
import { relicOfDancingEmbers } from "../cards/AMB/phantasias/relic-of-dancing-embers.ts";
import { fiveOfSpades } from "../cards/DTR/allies/five-of-spades.ts";
import { esteemedKnight } from "../cards/DEMO22/allies/esteemed-knight.ts";
import { bannerKnight } from "../cards/DEMO22/allies/banner-knight.ts";
import { weissKnight } from "../cards/PTM/allies/weiss-knight.ts";
import { lumberingSteed } from "../cards/AMB/allies/lumbering-steed.ts";
import { manaLimiter } from "../cards/DOA/items/mana-limiter.ts";
import { goldenRook } from "../cards/PTM/allies/golden-rook.ts";
import { unrelentingWarden } from "../cards/AMB/allies/unrelenting-warden.ts";
import { sinisterComposure } from "../cards/RDO/actions/sinister-composure.ts";
import { strategemOfMyriadIce } from "../cards/AMB/actions/strategem-of-myriad-ice.ts";
import { libraryWitch } from "../cards/DOA/allies/library-witch.ts";
import { zephyr } from "../cards/DOA/actions/zephyr.ts";
import { enfeebledDagger } from "../cards/DTR/items/enfeebled-dagger.ts";
import { fiveOfHearts } from "../cards/DTR/allies/five-of-hearts.ts";
import { fangOfDragonsBreath } from "../cards/AMB/phantasias/fang-of-dragons-breath.ts";
import { chargedHunter } from "../cards/MRC/allies/charged-hunter.ts";
import { safeguardPaladin } from "../cards/P24/allies/safeguard-paladin.ts";
import { attuneWithTheWinds } from "../cards/DOA/actions/attune-with-the-winds.ts";
import { incendiaryFractal } from "../cards/FTC/phantasias/incendiary-fractal.ts";
import { tomeOfAbyssalHeaven } from "../cards/RDO/items/tome-of-abyssal-heaven.ts";
import { gloamspireProwler } from "../cards/ALC/allies/gloamspire-prowler.ts";
import { anathemasEnd } from "../cards/ALC/items/anathemas-end.ts";
import { eyeOfArgus } from "../cards/DOA/items/eye-of-argus.ts";
import { fierySwing } from "../cards/AMB/attacks/fiery-swing.ts";
import { triskitGuidanceAngel } from "../cards/DOA/allies/triskit-guidance-angel.ts";
import { focalIntensity } from "../cards/RDO/actions/focal-intensity.ts";
import { excitableRaccoon } from "../cards/RDO/allies/excitable-raccoon.ts";
import { ninjaTabi } from "../cards/AMB/items/ninja-tabi.ts";
import { baguaOfVitalDemise } from "../cards/HVN/actions/bagua-of-vital-demise.ts";
import { alizarinLongbowman } from "../cards/PTM/allies/alizarin-longbowman.ts";
import { memoryInvocation } from "../cards/PRD/actions/memory-invocation.ts";
import { blazingThrow } from "../cards/DOA/actions/blazing-throw.ts";
import { sanctifiedPaladin } from "../cards/RDO/allies/sanctified-paladin.ts";
import { eminentCommander } from "../cards/P24/allies/eminent-commander.ts";
import { slimesBlessing } from "../cards/P24/actions/slimes-blessing.ts";
import { ceruleanDecree } from "../cards/MRC/actions/cerulean-decree.ts";
import { engulf } from "../cards/RDO/actions/engulf.ts";
import { fieryWarcry } from "../cards/ALC/actions/fiery-warcry.ts";
import { crystallineReality } from "../cards/P25/actions/crystalline-reality.ts";
import { dianaDuskstalker } from "../cards/ALC/champions/diana-duskstalker.ts";
import { frozenQuill } from "../cards/AMB/items/frozen-quill.ts";
import { bladeOfCreation } from "../cards/MRC/attacks/blade-of-creation.ts";
import { genuflectingExecution } from "../cards/PTM/actions/genuflecting-execution.ts";
import { pleaForPeace } from "../cards/ALC/actions/plea-for-peace.ts";
import { brusqueNeige } from "../cards/DTR/actions/brusque-neige.ts";
import { flashGrenade } from "../cards/P24/items/flash-grenade.ts";
import { felicitousFlock } from "../cards/HVN/allies/felicitous-flock.ts";
import { cloakedExecutioner } from "../cards/P24/allies/cloaked-executioner.ts";
import { legionsWingspan } from "../cards/DTR/weapons/legions-wingspan.ts";
import { nobleDissolution } from "../cards/PRD/actions/noble-dissolution.ts";
import { dauntlessAssault } from "../cards/P26/attacks/dauntless-assault.ts";
import { recurringInvocation } from "../cards/DTR/actions/recurring-invocation.ts";
import { varuckSmolderingSpire } from "../cards/DOA/domains/varuck-smoldering-spire.ts";
import { blazeAlight } from "../cards/RDO/actions/blaze-alight.ts";
import { frozenNova } from "../cards/DOA/actions/frozen-nova.ts";
import { threeOfDiamonds } from "../cards/RDO/allies/three-of-diamonds.ts";
import { companionFatestone } from "../cards/P25/items/companion-fatestone.ts";
import { menagerieBeastbonder } from "../cards/DOA/allies/menagerie-beastbonder.ts";
import { torchMarshal } from "../cards/P25/allies/torch-marshal.ts";
import { celestialCalling } from "../cards/ALC/actions/celestial-calling.ts";
import { siphoningStab } from "../cards/RDO/attacks/siphoning-stab.ts";
import { rollingChorus } from "../cards/PRD/actions/rolling-chorus.ts";
import { lesserBoonOfFractals } from "../cards/PRD/boons/lesser-boon-of-fractals.ts";
import { accursedStrength } from "../cards/MRC/actions/accursed-strength.ts";
import { mechanicalHare } from "../cards/MRC/allies/mechanical-hare.ts";
import { siphoningFractal } from "../cards/MRC/phantasias/siphoning-fractal.ts";
import { quickdrawPiercer } from "../cards/P24/weapons/quickdraw-piercer.ts";
import { firetongue } from "../cards/FTC/weapons/firetongue.ts";
import { opticalControl } from "../cards/RDO/phantasias/optical-control.ts";
import { crystalOfArgus } from "../cards/DOA/items/crystal-of-argus.ts";
import { sentinelFabricator } from "../cards/P24/items/sentinel-fabricator.ts";
import { guoJiaChosenDisciple } from "../cards/HVN/champions/guo-jia-chosen-disciple.ts";
import { flammeSorcel } from "../cards/P25/actions/flamme-sorcel.ts";
import { namelessChampionGw } from "../cards/AMB/champions/nameless-champion-gw.ts";
import { sleetyRetreat } from "../cards/HVN/actions/sleety-retreat.ts";
import { oppressivePresence } from "../cards/AMB/actions/oppressive-presence.ts";
import { gateOfAlterity } from "../cards/P23/items/gate-of-alterity.ts";
import { stellarCosmos } from "../cards/RDO/weapons/stellar-cosmos.ts";
import { faunaFriend } from "../cards/AMB/items/fauna-friend.ts";
import { gildasChroniclerOfAesa } from "../cards/DOA/allies/gildas-chronicler-of-aesa.ts";
import { ritaiGuard } from "../cards/AMB/allies/ritai-guard.ts";
import { lightveilAgent } from "../cards/RDO/allies/lightveil-agent.ts";
import { naiaDivinerOfFortunes } from "../cards/MRC/allies/naia-diviner-of-fortunes.ts";
import { thronekeeperBullfrog } from "../cards/SP4/allies/thronekeeper-bullfrog.ts";
import { windriderVanguard } from "../cards/DOA/allies/windrider-vanguard.ts";
import { rangerHealerAlly } from "../cards/PTM/allies/ranger-healer-ally.ts";
import { direwolf } from "../cards/HVN/tokens/direwolf.ts";
import { protectorRaccoon } from "../cards/RDO/allies/protector-raccoon.ts";
import { warriorsLongsword } from "../cards/DEMO22/weapons/warriors-longsword.ts";
import { stellarBloom } from "../cards/RDO/actions/stellar-bloom.ts";
import { aeneanGutteringFlames } from "../cards/PRD/phantasias/aenean-guttering-flames.ts";
import { baguaOfCardinalFate } from "../cards/AMB/actions/bagua-of-cardinal-fate.ts";
import { crystalveinAwakening } from "../cards/PTM/actions/crystalvein-awakening.ts";
import { sneakyRaccoon } from "../cards/PRD/allies/sneaky-raccoon.ts";
import { enervatingDecay } from "../cards/HVN/actions/enervating-decay.ts";
import { avatarOfSuzaku } from "../cards/RDO/allies/avatar-of-suzaku.ts";
import { genbusCommand } from "../cards/HVN/actions/genbus-command.ts";
import { manifestThreat } from "../cards/RDO/actions/manifest-threat.ts";
import { namelessChampionAr } from "../cards/AMB/champions/nameless-champion-ar.ts";
import { eagerPage } from "../cards/DOA/allies/eager-page.ts";
import { ravishingFinale } from "../cards/MRC/attacks/ravishing-finale.ts";
import { whereFuturesStir } from "../cards/PRD/phantasias/where-futures-stir.ts";
import { greaterBoonOfVritra } from "../cards/PP1/boons/greater-boon-of-vritra.ts";
import { longtailGrovesward } from "../cards/DTR/allies/longtail-grovesward.ts";
import { razorvine } from "../cards/ALC/tokens/razorvine.ts";
import { frostShard } from "../cards/MRC/actions/frost-shard.ts";
import { haloclineScout } from "../cards/AMB/allies/halocline-scout.ts";
import { scatteringGusts } from "../cards/DOA/actions/scattering-gusts.ts";
import { sinisterMindreaver } from "../cards/MRC/allies/sinister-mindreaver.ts";
import { beastbondEars } from "../cards/DOA/items/beastbond-ears.ts";
import { lesserBoonOfAwilix } from "../cards/PP1/boons/lesser-boon-of-awilix.ts";
import { embryonicHemosynth } from "../cards/PRD/allies/embryonic-hemosynth.ts";
import { shadedDoppelganger } from "../cards/RDO/allies/shaded-doppelganger.ts";
import { clandestineChart } from "../cards/AMB/items/clandestine-chart.ts";
import { findTheLost } from "../cards/P25/attacks/find-the-lost.ts";
import { galedErasure } from "../cards/DTR/actions/galed-erasure.ts";
import { mendFlesh } from "../cards/AMB/actions/mend-flesh.ts";
import { lesserBoonOfAllurement } from "../cards/PP1/boons/lesser-boon-of-allurement.ts";
import { slimeTotem } from "../cards/P24/items/slime-totem.ts";
import { lagomorphPiece } from "../cards/PTM/items/lagomorph-piece.ts";
import { neosElemental } from "../cards/ALC/allies/neos-elemental.ts";
import { guerrillaAdvantage } from "../cards/RDO/actions/guerrilla-advantage.ts";
import { chargedManaplate } from "../cards/P24/items/charged-manaplate.ts";
import { beguilingBandit } from "../cards/HVN/allies/beguiling-bandit.ts";
import { fabledEmeraldFatestone } from "../cards/HVN/items/fabled-emerald-fatestone.ts";
import { hulkingRearguard } from "../cards/PRD/allies/hulking-rearguard.ts";
import { kindBeastcaller } from "../cards/AMB/allies/kind-beastcaller.ts";
import { liquidAmnesia } from "../cards/MRC/items/liquid-amnesia.ts";
import { auspiciousFeast } from "../cards/P26/actions/auspicious-feast.ts";
import { mercenarysBlade } from "../cards/MRC/weapons/mercenarys-blade.ts";
import { teardropDiadem } from "../cards/PTM/items/teardrop-diadem.ts";
import { essenceOfBlizzards } from "../cards/P24/items/essence-of-blizzards.ts";
import { valiantProtector } from "../cards/RDO/allies/valiant-protector.ts";
import { frigidBash } from "../cards/ALC/attacks/frigid-bash.ts";
import { embercryptBurn } from "../cards/DTR/actions/embercrypt-burn.ts";
import { sanctumOfEsotericTruth } from "../cards/ALC/domains/sanctum-of-esoteric-truth.ts";
import { fountSeraphim } from "../cards/RDO/allies/fount-seraphim.ts";
import { washuru } from "../cards/HVN/tokens/washuru.ts";
import { bleuAceOfDiamonds } from "../cards/RDO/allies/bleu-ace-of-diamonds.ts";
import { tristanGrimStalker } from "../cards/DOA/champions/tristan-grim-stalker.ts";
import { droppedBand } from "../cards/PTM/items/dropped-band.ts";
import { updraftSlice } from "../cards/PRD/attacks/updraft-slice.ts";
import { protoKeyCrest } from "../cards/P25/items/proto-key-crest.ts";
import { horseArcher } from "../cards/HVN/allies/horse-archer.ts";
import { inspiringCall } from "../cards/P26/actions/inspiring-call.ts";
import { namelessChampionMt } from "../cards/PRD/champions/nameless-champion-mt.ts";
import { namelessChampionCg } from "../cards/AMB/champions/nameless-champion-cg.ts";
import { purification } from "../cards/MRC/actions/purification.ts";
import { palaceGuard } from "../cards/AMB/allies/palace-guard.ts";
import { fanOfSevenDebts } from "../cards/P24/items/fan-of-seven-debts.ts";
import { morganSoulGuide } from "../cards/FTC/allies/morgan-soul-guide.ts";
import { fragmentedSpiritOfWater } from "../cards/MRC/champions/fragmented-spirit-of-water.ts";
import { goldenCheckmate } from "../cards/RDO/attacks/golden-checkmate.ts";
import { empoweringHarmony } from "../cards/DOA/actions/empowering-harmony.ts";
import { creativeTinder } from "../cards/PRD/actions/creative-tinder.ts";
import { lungeOfEvokingWinds } from "../cards/AMB/attacks/lunge-of-evoking-winds.ts";
import { augustineVotaryOfYore } from "../cards/PRD/allies/augustine-votary-of-yore.ts";
import { tinderedSoldier } from "../cards/PRD/allies/tindered-soldier.ts";
import { rousingSlime } from "../cards/RDO/allies/rousing-slime.ts";
import { lesserBoonOfVritra } from "../cards/PP1/boons/lesser-boon-of-vritra.ts";
import { recursiveConfidant } from "../cards/PTM/allies/recursive-confidant.ts";
import { floodborneWarrior } from "../cards/RDO/allies/floodborne-warrior.ts";
import { rhesusEradication } from "../cards/PRD/actions/rhesus-eradication.ts";
import { torchingReach } from "../cards/AMB/actions/torching-reach.ts";
import { berthaSpryHowitzer } from "../cards/MRC/allies/bertha-spry-howitzer.ts";
import { clarentReimagined } from "../cards/PRXY/weapons/clarent-reimagined.ts";
import { packageCourier } from "../cards/PRD/allies/package-courier.ts";
import { apothecarysHarvest } from "../cards/RDO/actions/apothecarys-harvest.ts";
import { academyGuide } from "../cards/P24/allies/academy-guide.ts";
import { surveillanceStone } from "../cards/DOA/items/surveillance-stone.ts";
import { verdantSlime } from "../cards/P24/allies/verdant-slime.ts";
import { engineeredSlime } from "../cards/MRC/allies/engineered-slime.ts";
import { benedictionAngel } from "../cards/P26/allies/benediction-angel.ts";
import { greaterBoonOfLuxera } from "../cards/PP1/boons/greater-boon-of-luxera.ts";
import { deploymentBeacon } from "../cards/P24/items/deployment-beacon.ts";
import { elusiveHeadhunter } from "../cards/RDO/allies/elusive-headhunter.ts";
import { changbanHeroicImpasse } from "../cards/PRD/domains/changban-heroic-impasse.ts";
import { beltedTune } from "../cards/PRD/actions/belted-tune.ts";
import { veilingBreeze } from "../cards/DOA/actions/veiling-breeze.ts";
import { luminousSurge } from "../cards/RDO/actions/luminous-surge.ts";
import { mordredFatedLuminary } from "../cards/P26/champions/mordred-fated-luminary.ts";
import { lakesideSerpent } from "../cards/DOA/allies/lakeside-serpent.ts";
import { glassgaleFlock } from "../cards/PTM/phantasias/glassgale-flock.ts";
import { bushwhackBandit } from "../cards/DOA/allies/bushwhack-bandit.ts";
import { pristineScourge } from "../cards/DTR/actions/pristine-scourge.ts";
import { forgelightShieldmaiden } from "../cards/ALC/allies/forgelight-shieldmaiden.ts";
import { regalInquisition } from "../cards/DTR/actions/regal-inquisition.ts";
import { heavySwing } from "../cards/P24/attacks/heavy-swing.ts";
import { envelopingSoulmist } from "../cards/PTM/actions/enveloping-soulmist.ts";
import { tidalTirade } from "../cards/AMB/actions/tidal-tirade.ts";
import { protoArchiveScout } from "../cards/RDO/allies/proto-archive-scout.ts";
import { channelManifoldDesire } from "../cards/AMB/actions/channel-manifold-desire.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { taijiOfCrystalStrategems } from "../cards/P24/phantasias/taiji-of-crystal-strategems.ts";
import { protectiveHelm } from "../cards/HVN/items/protective-helm.ts";
import { chargedDirective } from "../cards/MRC/attacks/charged-directive.ts";
import { crystallizedDestiny } from "../cards/P25/actions/crystallized-destiny.ts";
import { byakkosCommand } from "../cards/HVN/actions/byakkos-command.ts";
import { nimueCursedTouch } from "../cards/DOA/allies/nimue-cursed-touch.ts";
import { seizeFate } from "../cards/AMB/actions/seize-fate.ts";
import { cyclonicFatestone } from "../cards/HVN/items/cyclonic-fatestone.ts";
import { prodigiousBurstmage } from "../cards/DOA/allies/prodigious-burstmage.ts";
import { musicalCurator } from "../cards/PRD/allies/musical-curator.ts";
import { vacuousServant } from "../cards/DTR/tokens/vacuous-servant.ts";
import { imperialSpy } from "../cards/MRC/allies/imperial-spy.ts";
import { platedBullet } from "../cards/P24/items/plated-bullet.ts";
import { revealingMesmer } from "../cards/HVN/phantasias/revealing-mesmer.ts";
import { lilyMarineCastellan } from "../cards/SP4/allies/lily-marine-castellan.ts";
import { convalescentTonic } from "../cards/ALC/items/convalescent-tonic.ts";
import { lesserBoonOfDistance } from "../cards/PP1/boons/lesser-boon-of-distance.ts";
import { yudiGossamerJade } from "../cards/AMB/phantasias/yudi-gossamer-jade.ts";
import { mindFreeze } from "../cards/DOA/actions/mind-freeze.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { shilowenPeacefulBeginnings } from "../cards/RDO/domains/shilowen-peaceful-beginnings.ts";
import { shieldOfParvati } from "../cards/AMB/items/shield-of-parvati.ts";
import { hydratingFractal } from "../cards/PRD/phantasias/hydrating-fractal.ts";
import { namelessChampion } from "../cards/PRD/champions/nameless-champion.ts";
import { spectralDiffusion } from "../cards/DTR/actions/spectral-diffusion.ts";
import { waterfallSage } from "../cards/PRD/allies/waterfall-sage.ts";
import { gearstrideGloves } from "../cards/P24/items/gearstride-gloves.ts";
import { woolBrook } from "../cards/PTM/domains/wool-brook.ts";
import { mistralRanger } from "../cards/PTM/allies/mistral-ranger.ts";
import { pepperedChef } from "../cards/SP4/allies/peppered-chef.ts";
import { scarsOfOld } from "../cards/PRD/actions/scars-of-old.ts";
import { goldenPawn } from "../cards/PTM/allies/golden-pawn.ts";
import { purifyingThurible } from "../cards/PTM/items/purifying-thurible.ts";
import { catalepticConstellation } from "../cards/DTR/phantasias/cataleptic-constellation.ts";
import { cinderbloomTender } from "../cards/SP4/allies/cinderbloom-tender.ts";
import { ghostHunter } from "../cards/DTR/allies/ghost-hunter.ts";
import { psychopompsGale } from "../cards/RDO/actions/psychopomps-gale.ts";
import { possessedRemnant } from "../cards/MRC/allies/possessed-remnant.ts";
import { supplyDrone } from "../cards/ALC/allies/supply-drone.ts";
import { orbOfChokingFumes } from "../cards/DOA/items/orb-of-choking-fumes.ts";
import { spiritOfFire } from "../cards/DOA/champions/spirit-of-fire.ts";
import { fraternalGarrison } from "../cards/AMB/allies/fraternal-garrison.ts";
import { foretoldBloom } from "../cards/MRC/actions/foretold-bloom.ts";
import { shiningMarchador } from "../cards/AMB/allies/shining-marchador.ts";
import { stillwaterPatrol } from "../cards/DOA/allies/stillwater-patrol.ts";
import { illusoryArmsmaster } from "../cards/PTM/allies/illusory-armsmaster.ts";
import { vyraSpiritOfFire } from "../cards/P24/champions/vyra-spirit-of-fire.ts";
import { chargeStatic } from "../cards/PRD/actions/charge-static.ts";
import { draughtOfStamina } from "../cards/PRD/items/draught-of-stamina.ts";
import { swordSaintOfEverflame } from "../cards/AMB/allies/sword-saint-of-everflame.ts";
import { necklaceOfForesight } from "../cards/P26/items/necklace-of-foresight.ts";
import { radiantOriginOfWarrior } from "../cards/RDO/phantasias/radiant-origin-of-warrior.ts";
import { dongZhouFalseLiege } from "../cards/AMB/allies/dong-zhou-false-liege.ts";
import { fireResonanceBauble } from "../cards/DOA/items/fire-resonance-bauble.ts";
import { markTheTarget } from "../cards/DOA/actions/mark-the-target.ts";
import { excoriate } from "../cards/ALC/actions/excoriate.ts";
import { bishopsCross } from "../cards/PTM/attacks/bishops-cross.ts";
import { silvergaleMonstrositysCall } from "../cards/RDO/actions/silvergale-monstrositys-call.ts";
import { arisannaMasterAlchemist } from "../cards/ALC/champions/arisanna-master-alchemist.ts";
import { reliableBlade } from "../cards/PRD/weapons/reliable-blade.ts";
import { fieryMomentum } from "../cards/PRD/attacks/fiery-momentum.ts";
import { businessCard } from "../cards/PRD/items/business-card.ts";
import { swordSaintOfEventide } from "../cards/AMB/allies/sword-saint-of-eventide.ts";
import { wisdomsReprise } from "../cards/AMB/actions/wisdoms-reprise.ts";
import { diamondRibbon } from "../cards/RDO/items/diamond-ribbon.ts";
import { sunCeWeaponsmaster } from "../cards/HVN/allies/sun-ce-weaponsmaster.ts";
import { calamityCannon } from "../cards/MRC/actions/calamity-cannon.ts";
import { reconnaissanceScout } from "../cards/ALC/allies/reconnaissance-scout.ts";
import { windriderInvoker } from "../cards/FTC/allies/windrider-invoker.ts";
import { memoriteShardwing } from "../cards/PTM/tokens/memorite-shardwing.ts";
import { gearstrideAcademy } from "../cards/MRC/domains/gearstride-academy.ts";
import { forgelightBlade } from "../cards/MRC/weapons/forgelight-blade.ts";
import { flameboundDraug } from "../cards/DTR/allies/flamebound-draug.ts";
import { clumsyApprentice } from "../cards/P22/allies/clumsy-apprentice.ts";
import { windspireCrest } from "../cards/HVN/items/windspire-crest.ts";
import { firetunedAutomaton } from "../cards/ALC/allies/firetuned-automaton.ts";
import { imperialRecruit } from "../cards/P24/allies/imperial-recruit.ts";
import { clarentSwordOfPeace } from "../cards/DOA/weapons/clarent-sword-of-peace.ts";
import { volatileFusilier } from "../cards/MRC/allies/volatile-fusilier.ts";
import { reckoningsWake } from "../cards/DTR/actions/reckonings-wake.ts";
import { azureProtectiveTrinket } from "../cards/FTC/items/azure-protective-trinket.ts";
import { slimeEruption } from "../cards/P24/actions/slime-eruption.ts";
import { academyAttendant } from "../cards/ALC/allies/academy-attendant.ts";
import { jinzhuoBandsOfVirtue } from "../cards/PRXY/items/jinzhuo-bands-of-virtue.ts";
import { winblessArbalest } from "../cards/ALC/allies/winbless-arbalest.ts";
import { blackIceSpellweaver } from "../cards/RDO/allies/black-ice-spellweaver.ts";
import { queenPiece } from "../cards/PTM/tokens/queen-piece.ts";
import { misteyeArcher } from "../cards/HVN/allies/misteye-archer.ts";
import { rococoExplosiveMaven } from "../cards/PRD/allies/rococo-explosive-maven.ts";
import { cellProduction } from "../cards/PRD/actions/cell-production.ts";
import { dianaAetherDilettante } from "../cards/DTR/champions/diana-aether-dilettante.ts";
import { discipleOfTheWaves } from "../cards/HVN/allies/disciple-of-the-waves.ts";
import { mistboundWatcher } from "../cards/DOA/allies/mistbound-watcher.ts";
import { obsequiousBlow } from "../cards/DTR/attacks/obsequious-blow.ts";
import { briskWindtrotter } from "../cards/SP4/allies/brisk-windtrotter.ts";
import { portentousTanggu } from "../cards/P25/items/portentous-tanggu.ts";
import { bidingEndroid } from "../cards/PRD/allies/biding-endroid.ts";
import { callThePack } from "../cards/DOA/actions/call-the-pack.ts";
import { nurtureCrops } from "../cards/MRC/actions/nurture-crops.ts";
import { sealedBladeDoa } from "../cards/DOA/weapons/sealed-blade-doa.ts";
import { flourishingQi } from "../cards/RDO/actions/flourishing-qi.ts";
import { silvieSlimeSovereign } from "../cards/P24/champions/silvie-slime-sovereign.ts";
import { refractedTwilight } from "../cards/MRC/items/refracted-twilight.ts";
import { impassionedTutor } from "../cards/DOA/allies/impassioned-tutor.ts";
import { orbOfSealing } from "../cards/PRD/items/orb-of-sealing.ts";
import { proofOfLife } from "../cards/AMB/actions/proof-of-life.ts";
import { backdash } from "../cards/DTR/actions/backdash.ts";
import { danteHematicOverdrive } from "../cards/PRD/champions/dante-hematic-overdrive.ts";
import { recurringAethercharge } from "../cards/RDO/actions/recurring-aethercharge.ts";
import { prismspireScepter } from "../cards/P25/items/prismspire-scepter.ts";
import { enthrallingChime } from "../cards/HVN/items/enthralling-chime.ts";
import { swiftRecruit } from "../cards/DOA/allies/swift-recruit.ts";
import { namelessChampionRt } from "../cards/AMB/champions/nameless-champion-rt.ts";
import { bifurcatingFractal } from "../cards/PRD/phantasias/bifurcating-fractal.ts";
import { poisedStrike } from "../cards/DOA/attacks/poised-strike.ts";
import { rootsOfTomorrow } from "../cards/RDO/actions/roots-of-tomorrow.ts";
import { thanatoticHemosynth } from "../cards/PRD/allies/thanatotic-hemosynth.ts";
import { astromechAttendant } from "../cards/MRC/allies/astromech-attendant.ts";
import { harrowTheSaved } from "../cards/PTM/actions/harrow-the-saved.ts";
import { enragedBoars } from "../cards/DOA/allies/enraged-boars.ts";
import { awakenedFrostguard } from "../cards/ALC/allies/awakened-frostguard.ts";
import { sanguineGoblet } from "../cards/AMB/items/sanguine-goblet.ts";
import { salamandersBreath } from "../cards/DTR/weapons/salamanders-breath.ts";
import { assembleTheAncients } from "../cards/ALC/actions/assemble-the-ancients.ts";
import { glacialEvocation } from "../cards/SP4/actions/glacial-evocation.ts";
import { heirloomOfLibra } from "../cards/RDO/items/heirloom-of-libra.ts";
import { stellarionShift } from "../cards/DTR/actions/stellarion-shift.ts";
import { samaritansReach } from "../cards/PP1/actions/samaritans-reach.ts";
import { reciprocityDorumegiasCall } from "../cards/PRXY/weapons/reciprocity-dorumegias-call.ts";
import { anointedPurifier } from "../cards/PRD/allies/anointed-purifier.ts";
import { maryAnnMaladroitMaid } from "../cards/EVP/allies/mary-ann-maladroit-maid.ts";
import { gusttechShield } from "../cards/PRD/items/gusttech-shield.ts";
import { redSlime } from "../cards/FTC/allies/red-slime.ts";
import { automatonDrone } from "../cards/ALC/tokens/automaton-drone.ts";
import { otherworldlyPossessions } from "../cards/RDO/actions/otherworldly-possessions.ts";
import { welcomeMerriment } from "../cards/PRD/actions/welcome-merriment.ts";
import { moltenArrow } from "../cards/AMB/items/molten-arrow.ts";
import { flamelashBeastmaster } from "../cards/HVN/allies/flamelash-beastmaster.ts";
import { imperialAssassin } from "../cards/AMB/allies/imperial-assassin.ts";
import { zhaoYunDragonsblood } from "../cards/AMB/allies/zhao-yun-dragonsblood.ts";
import { songOfReturn } from "../cards/DOA/actions/song-of-return.ts";
import { seaspriteDiver } from "../cards/SP4/allies/seasprite-diver.ts";
import { potionInfusionFrostbite } from "../cards/ALC/actions/potion-infusion-frostbite.ts";
import { tomeOfSacredLightning } from "../cards/DOA/items/tome-of-sacred-lightning.ts";
import { razorbladeExecution } from "../cards/HVN/attacks/razorblade-execution.ts";
import { burnishedObelith } from "../cards/PTM/allies/burnished-obelith.ts";
import { fabledRubyFatestone } from "../cards/HVN/items/fabled-ruby-fatestone.ts";
import { greaterBoonOfDetachment } from "../cards/PP1/boons/greater-boon-of-detachment.ts";
import { twoOfDiamonds } from "../cards/RDO/allies/two-of-diamonds.ts";
import { pupilOfSacredFlames } from "../cards/AMB/allies/pupil-of-sacred-flames.ts";
import { etherealSlime } from "../cards/P24/allies/ethereal-slime.ts";
import { bolsterRanks } from "../cards/MRC/actions/bolster-ranks.ts";
import { zinnVolniaAbbess } from "../cards/RDO/allies/zinn-volnia-abbess.ts";
import { spiritBladeAscension } from "../cards/DOA/actions/spirit-blade-ascension.ts";
import { wandOfFrost } from "../cards/FTC/items/wand-of-frost.ts";
import { viciousSlice } from "../cards/MRC/attacks/vicious-slice.ts";
import { shatterfallKeep } from "../cards/ALC/domains/shatterfall-keep.ts";
import { tonorisCreationsWill } from "../cards/ALC/champions/tonoris-creations-will.ts";
import { lorraineSpiritRuler } from "../cards/DOA/champions/lorraine-spirit-ruler.ts";
import { chronowarp } from "../cards/DTR/actions/chronowarp.ts";
import { nagasFang } from "../cards/AMB/weapons/nagas-fang.ts";
import { gearHaul } from "../cards/PRD/actions/gear-haul.ts";
import { fairyWhispers } from "../cards/DOA/actions/fairy-whispers.ts";
import { geldusTerrorOfDorumegia } from "../cards/MRC/allies/geldus-terror-of-dorumegia.ts";
import { recklessSlash } from "../cards/DEMO22/attacks/reckless-slash.ts";
import { numinousMonk } from "../cards/RDO/allies/numinous-monk.ts";
import { lesserBoonOfAgni } from "../cards/PP1/boons/lesser-boon-of-agni.ts";
import { poweredSentinel } from "../cards/MRC/allies/powered-sentinel.ts";
import { aeneanSwellingGusts } from "../cards/PRD/actions/aenean-swelling-gusts.ts";
import { lesserBoonOfEtherealys } from "../cards/PP1/boons/lesser-boon-of-etherealys.ts";
import { tidewallSentinel } from "../cards/PRD/allies/tidewall-sentinel.ts";
import { shadebloodCoating } from "../cards/P24/items/shadeblood-coating.ts";
import { potionInfusionVolatility } from "../cards/RDO/actions/potion-infusion-volatility.ts";
import { sevenOfHearts } from "../cards/PTM/allies/seven-of-hearts.ts";
import { potionInfusionAnimate } from "../cards/RDO/actions/potion-infusion-animate.ts";
import { tributeSinger } from "../cards/PRD/allies/tribute-singer.ts";
import { greaterBoonOfTheUnderdog } from "../cards/PP1/boons/greater-boon-of-the-underdog.ts";
import { lorraineCruxKnight } from "../cards/DOA/champions/lorraine-crux-knight.ts";
import { queensGambit } from "../cards/PTM/phantasias/queens-gambit.ts";
import { windsOfDestiny } from "../cards/HVN/actions/winds-of-destiny.ts";
import { aeneanCryosalvo } from "../cards/PRD/actions/aenean-cryosalvo.ts";
import { lesserBoonOfParvati } from "../cards/PP1/boons/lesser-boon-of-parvati.ts";
import { cryForHelp } from "../cards/DOA/actions/cry-for-help.ts";
import { lesserBoonOfScriveners } from "../cards/PP1/boons/lesser-boon-of-scriveners.ts";
import { perseRelentlessRaptor } from "../cards/EVP/allies/perse-relentless-raptor.ts";
import { perdition } from "../cards/ALC/actions/perdition.ts";
import { silvieWithThePack } from "../cards/DOA/champions/silvie-with-the-pack.ts";
import { confidantsOath } from "../cards/DTR/items/confidants-oath.ts";
import { wutheringSforzando } from "../cards/PRD/actions/wuthering-sforzando.ts";
import { conduitOfSeasons } from "../cards/AMB/allies/conduit-of-seasons.ts";
import { spellshieldAstra } from "../cards/ALC/actions/spellshield-astra.ts";
import { cielLoyalValet } from "../cards/DTR/champions/ciel-loyal-valet.ts";
import { catoMeadowsChanneler } from "../cards/EVP/allies/cato-meadows-channeler.ts";
import { skeweringAdvance } from "../cards/DTR/attacks/skewering-advance.ts";
import { namelessChampionGt } from "../cards/AMB/champions/nameless-champion-gt.ts";
import { uncannyRealization } from "../cards/PRD/attacks/uncanny-realization.ts";
import { photicBlade } from "../cards/RDO/weapons/photic-blade.ts";
import { imperialScout } from "../cards/MRC/allies/imperial-scout.ts";
import { demonsBargain } from "../cards/PRD/actions/demons-bargain.ts";
import { everflameStaff } from "../cards/AMB/items/everflame-staff.ts";
import { martialGuard } from "../cards/P24/actions/martial-guard.ts";
import { invigoratingConcoction } from "../cards/HVN/items/invigorating-concoction.ts";
import { fourOfDiamonds } from "../cards/RDO/allies/four-of-diamonds.ts";
import { dewySlime } from "../cards/RDO/allies/dewy-slime.ts";
import { acolyteOfCultivation } from "../cards/AMB/allies/acolyte-of-cultivation.ts";
import { penumbralWaltz } from "../cards/MRC/actions/penumbral-waltz.ts";
import { attuneWithFlames } from "../cards/ALC/actions/attune-with-flames.ts";
import { hazeDroid } from "../cards/PRD/allies/haze-droid.ts";
import { alphaPhilterbeast } from "../cards/RDO/allies/alpha-philterbeast.ts";
import { youngBeastbonder } from "../cards/DOA/allies/young-beastbonder.ts";
import { aeneanFrostlance } from "../cards/PRD/actions/aenean-frostlance.ts";
import { rousingRattleDrum } from "../cards/P25/items/rousing-rattle-drum.ts";
import { naturalOrder } from "../cards/HVN/actions/natural-order.ts";
import { findRecipe } from "../cards/RDO/actions/find-recipe.ts";
import { trivialTrinket } from "../cards/RDO/items/trivial-trinket.ts";
import { geminiStarbearer } from "../cards/PTM/allies/gemini-starbearer.ts";
import { constellationsBlessing } from "../cards/P25/actions/constellations-blessing.ts";
import { memoriteBlade } from "../cards/PTM/tokens/memorite-blade.ts";
import { claimedFromBeyond } from "../cards/PTM/actions/claimed-from-beyond.ts";
import { threeOfSpades } from "../cards/DTR/allies/three-of-spades.ts";
import { slashAndBurn } from "../cards/ALC/actions/slash-and-burn.ts";
import { dianaCursebreaker } from "../cards/ALC/champions/diana-cursebreaker.ts";
import { jadelightProtector } from "../cards/HVN/allies/jadelight-protector.ts";
import { shadowstrike } from "../cards/P24/attacks/shadowstrike.ts";
import { distilledWater } from "../cards/RDO/items/distilled-water.ts";
import { fatestoneOfUnrelenting } from "../cards/P25/items/fatestone-of-unrelenting.ts";
import { angelicChanneling } from "../cards/RDO/actions/angelic-channeling.ts";
import { scorchfireAssassin } from "../cards/AMB/allies/scorchfire-assassin.ts";
import { totalWhiteout } from "../cards/PRD/phantasias/total-whiteout.ts";
import { cielOmenbringer } from "../cards/DTR/champions/ciel-omenbringer.ts";
import { reprogram } from "../cards/P24/actions/reprogram.ts";
import { resoluteStand } from "../cards/FTC/actions/resolute-stand.ts";
import { courtsideBeastkeeper } from "../cards/HVN/allies/courtside-beastkeeper.ts";
import { lotorTrinket } from "../cards/RDO/items/lotor-trinket.ts";
import { diffusiveBlock } from "../cards/ALC/actions/diffusive-block.ts";
import { lavaheatedBrew } from "../cards/ALC/actions/lavaheated-brew.ts";
import { stiflingGyre } from "../cards/RDO/phantasias/stifling-gyre.ts";
import { aeneanFluxGenerator } from "../cards/PRD/items/aenean-flux-generator.ts";
import { radiantVega } from "../cards/DTR/weapons/radiant-vega.ts";
import { rotundSquirrel } from "../cards/HVN/allies/rotund-squirrel.ts";
import { falseTidings } from "../cards/RDO/actions/false-tidings.ts";
import { magebaneLash } from "../cards/ALC/weapons/magebane-lash.ts";
import { tailwindsBlessing } from "../cards/AMB/phantasias/tailwinds-blessing.ts";
import { overflowTheBarrow } from "../cards/PTM/actions/overflow-the-barrow.ts";
import { naturesAppeal } from "../cards/AMB/actions/natures-appeal.ts";
import { cooktechApron } from "../cards/PRD/items/cooktech-apron.ts";
import { tyrannicalDenigration } from "../cards/PTM/attacks/tyrannical-denigration.ts";
import { crestOfTheAlliance } from "../cards/P24/items/crest-of-the-alliance.ts";
import { hymnOfGaiasGrace } from "../cards/DOA/actions/hymn-of-gaias-grace.ts";
import { sparklingAdornment } from "../cards/RDO/actions/sparkling-adornment.ts";
import { refreshingSlice } from "../cards/PRD/attacks/refreshing-slice.ts";
import { advantageousPerch } from "../cards/PTM/actions/advantageous-perch.ts";
import { potionInfusionSeal } from "../cards/MRC/actions/potion-infusion-seal.ts";
import { wispsProtection } from "../cards/RDO/actions/wisps-protection.ts";
import { relentlessOutburst } from "../cards/AMB/actions/relentless-outburst.ts";
import { slipAway } from "../cards/PRD/actions/slip-away.ts";
import { poisonedCoatingOil } from "../cards/DOA/items/poisoned-coating-oil.ts";
import { piccardaNightRider } from "../cards/PRD/allies/piccarda-night-rider.ts";
import { staggeringStrike } from "../cards/P24/attacks/staggering-strike.ts";
import { resonatingFugue } from "../cards/HVN/actions/resonating-fugue.ts";
import { priestessOfFlame } from "../cards/MRC/allies/priestess-of-flame.ts";
import { winblessLookout } from "../cards/MRC/allies/winbless-lookout.ts";
import { possessedReaping } from "../cards/P25/attacks/possessed-reaping.ts";
import { batteryCoreX } from "../cards/PRD/items/battery-core-x.ts";
import { bombardFlarecannon } from "../cards/ALC/weapons/bombard-flarecannon.ts";
import { shadecursedHunter } from "../cards/ALC/allies/shadecursed-hunter.ts";
import { doubledPawns } from "../cards/PTM/actions/doubled-pawns.ts";
import { lesserBoonOfSwordSaint } from "../cards/PRD/boons/lesser-boon-of-sword-saint.ts";
import { fledgling } from "../cards/HVN/tokens/fledgling.ts";
import { inzaliUnshackledBlaze } from "../cards/ALC/allies/inzali-unshackled-blaze.ts";
import { tricastlesOfLucenia } from "../cards/PTM/domains/tricastles-of-lucenia.ts";
import { cheerfulSlime } from "../cards/PP1/allies/cheerful-slime.ts";
import { regalExpulsion } from "../cards/PRD/actions/regal-expulsion.ts";
import { awakenOmbre } from "../cards/PTM/actions/awaken-ombre.ts";
import { retoldFortune } from "../cards/MRC/actions/retold-fortune.ts";
import { corrosiveJuggler } from "../cards/PRD/allies/corrosive-juggler.ts";
import { mordredBurnishedAvenger } from "../cards/P26/champions/mordred-burnished-avenger.ts";
import { miasmicFog } from "../cards/RDO/phantasias/miasmic-fog.ts";
import { powerforgedBurst } from "../cards/PRD/actions/powerforged-burst.ts";
import { duplicitousReplication } from "../cards/DTR/actions/duplicitous-replication.ts";
import { flagrantGuide } from "../cards/RDO/allies/flagrant-guide.ts";
import { cunningBroker } from "../cards/FTC/allies/cunning-broker.ts";
import { balefulOblation } from "../cards/DTR/actions/baleful-oblation.ts";
import { pouvoirAbsolu } from "../cards/RDO/actions/pouvoir-absolu.ts";
import { desperateDive } from "../cards/MRC/actions/desperate-dive.ts";
import { scryTheStars } from "../cards/ALC/actions/scry-the-stars.ts";
import { greaterBoonOfInari } from "../cards/PP1/boons/greater-boon-of-inari.ts";
import { protectHerAtAllCosts } from "../cards/P25/actions/protect-her-at-all-costs.ts";
import { razielArchangelOfLibra } from "../cards/RDO/allies/raziel-archangel-of-libra.ts";
import { chillToTheBone } from "../cards/P25/actions/chill-to-the-bone.ts";
import { devotedMartyr } from "../cards/DTR/allies/devoted-martyr.ts";
import { spirelleSchwartzQueen } from "../cards/DTR/allies/spirelle-schwartz-queen.ts";
import { ordinaryBear } from "../cards/P23/allies/ordinary-bear.ts";
import { frameworkSidearm } from "../cards/MRC/weapons/framework-sidearm.ts";
import { exaltedDorumegianThrone } from "../cards/ALC/domains/exalted-dorumegian-throne.ts";
import { barterHerbs } from "../cards/ALC/actions/barter-herbs.ts";
import { modulatingCadence } from "../cards/HVN/actions/modulating-cadence.ts";
import { wanderingGlaivier } from "../cards/AMB/allies/wandering-glaivier.ts";
import { moltenEcho } from "../cards/PTM/actions/molten-echo.ts";
import { orbOfGlitter } from "../cards/DOA/items/orb-of-glitter.ts";
import { whirlwindThreads } from "../cards/HVN/actions/whirlwind-threads.ts";
import { merlinSurrealFigment } from "../cards/PTM/allies/merlin-surreal-figment.ts";
import { lesserBoonOfKanaloa } from "../cards/PP1/boons/lesser-boon-of-kanaloa.ts";
import { cruxSight } from "../cards/DOA/actions/crux-sight.ts";
import { intrepidSpearman } from "../cards/FTC/allies/intrepid-spearman.ts";
import { fellowshipsGale } from "../cards/PTM/actions/fellowships-gale.ts";
import { plasmatechBlaster } from "../cards/PRD/items/plasmatech-blaster.ts";
import { nightframeHoundsBike } from "../cards/PRD/items/nightframe-hounds-bike.ts";
import { chamberOfReflections } from "../cards/DTR/domains/chamber-of-reflections.ts";
import { viridescentAetherstreak } from "../cards/DTR/actions/viridescent-aetherstreak.ts";
import { vigilRempart } from "../cards/P25/allies/vigil-rempart.ts";
import { innervateKnowledge } from "../cards/PRD/actions/innervate-knowledge.ts";
import { innocuousDisposer } from "../cards/HVN/allies/innocuous-disposer.ts";
import { altruisticBlacksmith } from "../cards/PP1/allies/altruistic-blacksmith.ts";
import { schwartzCastler } from "../cards/RDO/allies/schwartz-castler.ts";
import { bloomAutumnsFall } from "../cards/HVN/actions/bloom-autumns-fall.ts";
import { templarOfTheEternal } from "../cards/RDO/allies/templar-of-the-eternal.ts";
import { languidToadtroll } from "../cards/DTR/allies/languid-toadtroll.ts";
import { searingTruth } from "../cards/HVN/actions/searing-truth.ts";
import { cellReactor } from "../cards/PRD/items/cell-reactor.ts";
import { unwelcomeFortune } from "../cards/DTR/actions/unwelcome-fortune.ts";
import { leporineMasque } from "../cards/P25/items/leporine-masque.ts";
import { distortReality } from "../cards/RDO/actions/distort-reality.ts";
import { surpriseReveal } from "../cards/PP1/actions/surprise-reveal.ts";
import { tsunamiOfNanyue } from "../cards/AMB/actions/tsunami-of-nanyue.ts";
import { vorpalSword } from "../cards/PTM/weapons/vorpal-sword.ts";
import { nightBarker } from "../cards/PTM/allies/night-barker.ts";
import { ravenousPyre } from "../cards/HVN/phantasias/ravenous-pyre.ts";
import { cellHandler } from "../cards/PRD/allies/cell-handler.ts";
import { diaoChanDreamingWish } from "../cards/HVN/champions/diao-chan-dreaming-wish.ts";
import { mirrorboundCovenant } from "../cards/PTM/phantasias/mirrorbound-covenant.ts";
import { invokeDominance } from "../cards/DOA/actions/invoke-dominance.ts";
import { imperialSentry } from "../cards/P24/allies/imperial-sentry.ts";
import { ruinousPillarsOfQidao } from "../cards/AMB/domains/ruinous-pillars-of-qidao.ts";
import { arcaneBlast } from "../cards/PRD/actions/arcane-blast.ts";
import { magusDisciple } from "../cards/DOA/allies/magus-disciple.ts";
import { shizunOfTheAsh } from "../cards/RDO/allies/shizun-of-the-ash.ts";
import { spiritOfWind } from "../cards/DOA/champions/spirit-of-wind.ts";
import { unbrokenDroid } from "../cards/PRD/allies/unbroken-droid.ts";
import { sabelaGossamerPenance } from "../cards/EVP/allies/sabela-gossamer-penance.ts";
import { nullifyingMirror } from "../cards/P26/items/nullifying-mirror.ts";
import { relentlessHexchaser } from "../cards/ALC/allies/relentless-hexchaser.ts";
import { wayfindersMap } from "../cards/ALC/items/wayfinders-map.ts";
import { emberwrathWitch } from "../cards/RDO/allies/emberwrath-witch.ts";
import { cremationRitual } from "../cards/DOA/actions/cremation-ritual.ts";
import { hemorrhagedIntimidation } from "../cards/RDO/actions/hemorrhaged-intimidation.ts";
import { firebloomFlourish } from "../cards/HVN/phantasias/firebloom-flourish.ts";
import { luridDreaming } from "../cards/DTR/actions/lurid-dreaming.ts";
import { rightOfRealm } from "../cards/FTC/items/right-of-realm.ts";
import { blazingDestrier } from "../cards/RDO/allies/blazing-destrier.ts";
import { cellForging } from "../cards/MRC/actions/cell-forging.ts";
import { waveriderProtector } from "../cards/ALC/allies/waverider-protector.ts";
import { sparkLink } from "../cards/PTM/actions/spark-link.ts";
import { conflagrantSentinel } from "../cards/P25/allies/conflagrant-sentinel.ts";
import { clericRobes } from "../cards/P24/items/cleric-robes.ts";
import { namelessChampionAm } from "../cards/AMB/champions/nameless-champion-am.ts";
import { flingFood } from "../cards/PRD/actions/fling-food.ts";
import { rangerStrides } from "../cards/DTR/items/ranger-strides.ts";
import { annihilation } from "../cards/HVN/actions/annihilation.ts";
import { embraceNoir } from "../cards/PTM/actions/embrace-noir.ts";
import { bedivereWoodlandOverseer } from "../cards/FTC/allies/bedivere-woodland-overseer.ts";
import { bolsteringTempest } from "../cards/RDO/actions/bolstering-tempest.ts";
import { entrenchedFortress } from "../cards/RDO/domains/entrenched-fortress.ts";
import { orchestratedSeizure } from "../cards/MRC/actions/orchestrated-seizure.ts";
import { fluffyShopkeep } from "../cards/P26/allies/fluffy-shopkeep.ts";
import { dormantSacrificialAltar } from "../cards/ALC/domains/dormant-sacrificial-altar.ts";
import { lesserBoonOfOdysseus } from "../cards/PP1/boons/lesser-boon-of-odysseus.ts";
import { oneiricKey } from "../cards/PTM/items/oneiric-key.ts";
import { overlappingVisages } from "../cards/P25/actions/overlapping-visages.ts";
import { archonBroadsword } from "../cards/P24/weapons/archon-broadsword.ts";
import { enPassant } from "../cards/PTM/attacks/en-passant.ts";
import { niaMistveiledScout } from "../cards/DOA/allies/nia-mistveiled-scout.ts";
import { solomonMasterOfElements } from "../cards/RDO/allies/solomon-master-of-elements.ts";
import { beguilingCoup } from "../cards/DTR/attacks/beguiling-coup.ts";
import { rallyThePeasants } from "../cards/FTC/actions/rally-the-peasants.ts";
import { energeticBeastbonder } from "../cards/DOA/allies/energetic-beastbonder.ts";
import { escapeTheWreckage } from "../cards/P26/actions/escape-the-wreckage.ts";
import { clockworkMusicbox } from "../cards/MRC/items/clockwork-musicbox.ts";
import { curvedDagger } from "../cards/DOA/weapons/curved-dagger.ts";
import { arisannaAstralZenith } from "../cards/ALC/champions/arisanna-astral-zenith.ts";
import { vengefulGust } from "../cards/AMB/actions/vengeful-gust.ts";
import { camilBaskedAbundance } from "../cards/PRD/allies/camil-basked-abundance.ts";
import { pyreticPrognosis } from "../cards/RDO/actions/pyretic-prognosis.ts";
import { spiritOfFortuitousWater } from "../cards/HVN/champions/spirit-of-fortuitous-water.ts";
import { titheProclamation } from "../cards/P23/items/tithe-proclamation.ts";
import { dissipation } from "../cards/RDO/actions/dissipation.ts";
import { maidenOfGlimmersDusk } from "../cards/HVN/phantasias/maiden-of-glimmers-dusk.ts";
import { spiritsBlessing } from "../cards/DOA/actions/spirits-blessing.ts";
import { resonantechModule } from "../cards/PRD/items/resonantech-module.ts";
import { celestialNavigation } from "../cards/RDO/actions/celestial-navigation.ts";
import { rainweaverMage } from "../cards/AMB/allies/rainweaver-mage.ts";
import { shieldroid } from "../cards/PRD/allies/shieldroid.ts";
import { dummyTrainer } from "../cards/P26/items/dummy-trainer.ts";
import { drownedExorcist } from "../cards/HVN/allies/drowned-exorcist.ts";
import { planarAbyss } from "../cards/AMB/actions/planar-abyss.ts";
import { crimsonRupture } from "../cards/RDO/actions/crimson-rupture.ts";
import { draughtDodge } from "../cards/PRD/actions/draught-dodge.ts";
import { ducalSeal } from "../cards/P26/items/ducal-seal.ts";
import { shiftingCurrents } from "../cards/P24/masteries/shifting-currents.ts";
import { supernovaDivination } from "../cards/RDO/phantasias/supernova-divination.ts";
import { surgeProtector } from "../cards/MRC/actions/surge-protector.ts";
import { idleFatestone } from "../cards/HVN/items/idle-fatestone.ts";
import { cosmicAstroscope } from "../cards/P24/items/cosmic-astroscope.ts";
import { thermalBreak } from "../cards/PRD/actions/thermal-break.ts";
import { lunarSeer } from "../cards/MRC/allies/lunar-seer.ts";
import { arcaneRenunciation } from "../cards/RDO/actions/arcane-renunciation.ts";
import { kaleidoscopeBarrette } from "../cards/P25/items/kaleidoscope-barrette.ts";
import { lesserBoonOfDux } from "../cards/PP1/boons/lesser-boon-of-dux.ts";
import { orbitingCosmos } from "../cards/PTM/items/orbiting-cosmos.ts";
import { beastbondClaws } from "../cards/DTR/items/beastbond-claws.ts";
import { flameblessedTrainee } from "../cards/ALC/allies/flameblessed-trainee.ts";
import { dianaHauntReminiscence } from "../cards/PTM/allies/diana-haunt-reminiscence.ts";
import { manaResonance } from "../cards/HVN/actions/mana-resonance.ts";
import { grayLupindroid } from "../cards/PRD/allies/gray-lupindroid.ts";
import { imbueInFrost } from "../cards/DOA/actions/imbue-in-frost.ts";
import { shardOfEmpowerment } from "../cards/P24/items/shard-of-empowerment.ts";
import { strikingTides } from "../cards/P26/attacks/striking-tides.ts";
import { blazingBowman } from "../cards/FTC/allies/blazing-bowman.ts";
import { mechanizedSmasher } from "../cards/MRC/weapons/mechanized-smasher.ts";
import { seasonedShieldmaster } from "../cards/PRD/allies/seasoned-shieldmaster.ts";
import { poisedRearguard } from "../cards/AMB/allies/poised-rearguard.ts";
import { saprotrophy } from "../cards/RDO/phantasias/saprotrophy.ts";
import { potionOfHealing } from "../cards/ALC/items/potion-of-healing.ts";
import { dualitysConvergence } from "../cards/P25/actions/dualitys-convergence.ts";
import { excaliburCleansingLight } from "../cards/DOA/actions/excalibur-cleansing-light.ts";
import { vaingloryRetribution } from "../cards/MRC/actions/vainglory-retribution.ts";
import { chargingGaleshot } from "../cards/DTR/actions/charging-galeshot.ts";
import { willToSave } from "../cards/P25/actions/will-to-save.ts";
import { gleamingCut } from "../cards/DOA/attacks/gleaming-cut.ts";
import { jianyuFatesPremonition } from "../cards/HVN/phantasias/jianyu-fates-premonition.ts";
import { equivalentExchange } from "../cards/PTM/actions/equivalent-exchange.ts";
import { sacredEngulfment } from "../cards/PTM/actions/sacred-engulfment.ts";
import { fractalOfWaves } from "../cards/RDO/phantasias/fractal-of-waves.ts";
import { crimsonVein } from "../cards/PRD/items/crimson-vein.ts";
import { acquiescingRejection } from "../cards/P25/actions/acquiescing-rejection.ts";
import { betrayingBlade } from "../cards/P24/attacks/betraying-blade.ts";
import { sift } from "../cards/PRD/actions/sift.ts";
import { seraphicLegionsDescent } from "../cards/RDO/phantasias/seraphic-legions-descent.ts";
import { deepSeaBeastbonder } from "../cards/DOA/allies/deep-sea-beastbonder.ts";
import { blitzCharger } from "../cards/HVN/allies/blitz-charger.ts";
import { decayingReproach } from "../cards/RDO/actions/decaying-reproach.ts";
import { zhangFeiSpiritedSteel } from "../cards/AMB/allies/zhang-fei-spirited-steel.ts";
import { starbirth } from "../cards/P25/actions/starbirth.ts";
import { kingdomsDivide } from "../cards/HVN/actions/kingdoms-divide.ts";
import { blindingOrb } from "../cards/DOA/items/blinding-orb.ts";
import { ornamentalGreatsword } from "../cards/DEMO22/weapons/ornamental-greatsword.ts";
import { freezeStiff } from "../cards/DOA/actions/freeze-stiff.ts";
import { aquatechShell } from "../cards/PRD/items/aquatech-shell.ts";
import { duchessSixOfHearts } from "../cards/DTR/allies/duchess-six-of-hearts.ts";
import { powercell } from "../cards/MRC/tokens/powercell.ts";
import { conjureDownpour } from "../cards/ALC/actions/conjure-downpour.ts";
import { wornGearblade } from "../cards/P24/weapons/worn-gearblade.ts";
import { briarSchwartzKing } from "../cards/DTR/allies/briar-schwartz-king.ts";
import { gloamspireHeadhunter } from "../cards/P24/allies/gloamspire-headhunter.ts";
import { fumantShieldmaiden } from "../cards/DTR/allies/fumant-shieldmaiden.ts";
import { crossroadsSpecter } from "../cards/DTR/allies/crossroads-specter.ts";
import { swordSaintsVow } from "../cards/HVN/weapons/sword-saints-vow.ts";
import { ovationGuide } from "../cards/PP1/allies/ovation-guide.ts";
import { revenantsScourge } from "../cards/MRC/attacks/revenants-scourge.ts";
import { caretakerHorse } from "../cards/HVN/allies/caretaker-horse.ts";
import { guardedDissipation } from "../cards/P26/actions/guarded-dissipation.ts";
import { expunge } from "../cards/MRC/actions/expunge.ts";
import { titanMkIi } from "../cards/RDO/tokens/titan-mk-ii.ts";
import { freezingRound } from "../cards/ALC/items/freezing-round.ts";
import { babyRedSlime } from "../cards/P24/allies/baby-red-slime.ts";
import { condemningEvisceration } from "../cards/PTM/attacks/condemning-evisceration.ts";
import { camelotImpenetrable } from "../cards/DOA/domains/camelot-impenetrable.ts";
import { chargeTheSoul } from "../cards/P25/actions/charge-the-soul.ts";
import { landscapeCorsair } from "../cards/AMB/allies/landscape-corsair.ts";
import { pipersLullaby } from "../cards/DOA/actions/pipers-lullaby.ts";
import { evaporationSynchron } from "../cards/PRD/items/evaporation-synchron.ts";
import { lesserBoonOfFauna } from "../cards/PP1/boons/lesser-boon-of-fauna.ts";
import { lightweaversInfiniteShaping } from "../cards/RDO/phantasias/lightweavers-infinite-shaping.ts";
import { veilarasPromise } from "../cards/AMB/items/veilaras-promise.ts";
import { stridetechW } from "../cards/PRD/items/stridetech-w.ts";
import { brokenPromises } from "../cards/P25/actions/broken-promises.ts";
import { tricksterOfTheFaeRealm } from "../cards/P26/allies/trickster-of-the-fae-realm.ts";
import { buriedGrief } from "../cards/MRC/actions/buried-grief.ts";
import { silvieWildsWhisperer } from "../cards/DOA/champions/silvie-wilds-whisperer.ts";
import { hexboundBlade } from "../cards/RDO/attacks/hexbound-blade.ts";
import { tendTheLand } from "../cards/SP4/actions/tend-the-land.ts";
import { messageInShadows } from "../cards/RDO/phantasias/message-in-shadows.ts";
import { atmosArmorTypeAres } from "../cards/MRC/allies/atmos-armor-type-ares.ts";
import { revealTheHidden } from "../cards/PTM/actions/reveal-the-hidden.ts";
import { rocketJump } from "../cards/ALC/actions/rocket-jump.ts";
import { ignitionDraw } from "../cards/PTM/actions/ignition-draw.ts";
import { devotionsPrice } from "../cards/P25/actions/devotions-price.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { swoopingTalons } from "../cards/P24/actions/swooping-talons.ts";
import { blindingLapse } from "../cards/AMB/actions/blinding-lapse.ts";
import { outriderOfWaves } from "../cards/HVN/allies/outrider-of-waves.ts";
import { arsenalKeeper } from "../cards/MRC/allies/arsenal-keeper.ts";
import { rafalesSlash } from "../cards/DTR/attacks/rafales-slash.ts";
import { elysianOrphan } from "../cards/PRD/allies/elysian-orphan.ts";
import { sharedFervor } from "../cards/PP1/actions/shared-fervor.ts";
import { radiantRepudiation } from "../cards/MRC/actions/radiant-repudiation.ts";
import { sordelleUnmooredException } from "../cards/PRD/allies/sordelle-unmoored-exception.ts";
import { infernalManastreak } from "../cards/DTR/actions/infernal-manastreak.ts";
import { throneSentinel } from "../cards/MRC/allies/throne-sentinel.ts";
import { fractalOfInsight } from "../cards/PRD/phantasias/fractal-of-insight.ts";
import { fabricatorSlime } from "../cards/RDO/allies/fabricator-slime.ts";
import { frostswornPaladin } from "../cards/DOA/allies/frostsworn-paladin.ts";
import { phalanxCaptain } from "../cards/DOA/allies/phalanx-captain.ts";
import { pawnPiece } from "../cards/PTM/tokens/pawn-piece.ts";
import { emeraldPistol } from "../cards/MRC/weapons/emerald-pistol.ts";
import { mistswornMagister } from "../cards/HVN/allies/mistsworn-magister.ts";
import { scavengeTheDistillery } from "../cards/ALC/actions/scavenge-the-distillery.ts";
import { channeltechCharmS } from "../cards/PRD/items/channeltech-charm-s.ts";
import { perfusiveEnvelopment } from "../cards/PRD/phantasias/perfusive-envelopment.ts";
import { powerchargedShield } from "../cards/P24/items/powercharged-shield.ts";
import { fishingAccident } from "../cards/DOA/actions/fishing-accident.ts";
import { classicalOpening } from "../cards/RDO/attacks/classical-opening.ts";
import { lesserBoonOfShou } from "../cards/PP1/boons/lesser-boon-of-shou.ts";
import { pleiadesCelestialGenesis } from "../cards/P25/weapons/pleiades-celestial-genesis.ts";
import { beckonAttention } from "../cards/PP1/actions/beckon-attention.ts";
import { furnaceLavabolt } from "../cards/DTR/actions/furnace-lavabolt.ts";
import { twoOfHearts } from "../cards/DTR/allies/two-of-hearts.ts";
import { spellshieldArcane } from "../cards/DOA/actions/spellshield-arcane.ts";
import { corhaziOutlook } from "../cards/FTC/allies/corhazi-outlook.ts";
import { idleThoughts } from "../cards/DOA/actions/idle-thoughts.ts";
import { lesserBoonOfVirelai } from "../cards/PRD/boons/lesser-boon-of-virelai.ts";
import { criticalRecovery } from "../cards/MRC/actions/critical-recovery.ts";
import { ignisDeus } from "../cards/DTR/actions/ignis-deus.ts";
import { igniteTheSoul } from "../cards/DOA/actions/ignite-the-soul.ts";
import { commandTheHunt } from "../cards/DOA/actions/command-the-hunt.ts";
import { polkhawkBombasticShot } from "../cards/ALC/champions/polkhawk-bombastic-shot.ts";
import { turmSchwartzRook } from "../cards/PTM/allies/turm-schwartz-rook.ts";
import { merlinKingslayer } from "../cards/FTC/champions/merlin-kingslayer.ts";
import { quickstepTreads } from "../cards/RDO/items/quickstep-treads.ts";
import { nightshade } from "../cards/HVN/tokens/nightshade.ts";
import { velocityPunch } from "../cards/PRD/items/velocity-punch.ts";
import { burstAsunder } from "../cards/AMB/actions/burst-asunder.ts";
import { crosswindCuts } from "../cards/PRD/attacks/crosswind-cuts.ts";
import { enchantedFete } from "../cards/GSC/actions/enchanted-fete.ts";
import { luxerasMap } from "../cards/DOA/items/luxeras-map.ts";
import { plageAuxHomards } from "../cards/PTM/domains/plage-aux-homards.ts";
import { shangxiangFiercePrincess } from "../cards/HVN/allies/shangxiang-fierce-princess.ts";
import { viridianProtectiveTrinket } from "../cards/PRXY/items/viridian-protective-trinket.ts";
import { tinderflarePivot } from "../cards/HVN/actions/tinderflare-pivot.ts";
import { obscuredOffering } from "../cards/PTM/actions/obscured-offering.ts";
import { grandeSonnerie } from "../cards/P25/weapons/grande-sonnerie.ts";
import { goldenBishop } from "../cards/PTM/allies/golden-bishop.ts";
import { limitlessSlime } from "../cards/P24/allies/limitless-slime.ts";
import { blazingCharge } from "../cards/ALC/attacks/blazing-charge.ts";
import { cutthroatOperative } from "../cards/PRD/allies/cutthroat-operative.ts";
import { sagesUrn } from "../cards/AMB/items/sages-urn.ts";
import { ebbingTide } from "../cards/AMB/items/ebbing-tide.ts";
import { veltechPresidentialCard } from "../cards/PRD/items/veltech-presidential-card.ts";
import { billChimneySweep } from "../cards/PTM/allies/bill-chimney-sweep.ts";
import { mysticPurifier } from "../cards/P26/allies/mystic-purifier.ts";
import { reduceToAsh } from "../cards/P24/actions/reduce-to-ash.ts";
import { steadyVerse } from "../cards/FTC/actions/steady-verse.ts";
import { smokeBombs } from "../cards/DOA/items/smoke-bombs.ts";
import { corhaziTrapper } from "../cards/FTC/allies/corhazi-trapper.ts";
import { backstep } from "../cards/P24/actions/backstep.ts";
import { apostleOfTheWoods } from "../cards/RDO/allies/apostle-of-the-woods.ts";
import { enduraScepterOfIgnition } from "../cards/DOA/items/endura-scepter-of-ignition.ts";
import { starlitApothecary } from "../cards/RDO/domains/starlit-apothecary.ts";
import { gaiasSongbird } from "../cards/DOA/allies/gaias-songbird.ts";
import { razorBroadhead } from "../cards/AMB/items/razor-broadhead.ts";
import { ghostsOfPendragon } from "../cards/DOA/allies/ghosts-of-pendragon.ts";
import { overlordMkIii } from "../cards/EVP/allies/overlord-mk-iii.ts";
import { calculatedForesight } from "../cards/ALC/actions/calculated-foresight.ts";
import { desperateCavalier } from "../cards/AMB/allies/desperate-cavalier.ts";
import { summonPawn } from "../cards/PTM/actions/summon-pawn.ts";
import { sunkenBattlePriest } from "../cards/DTR/allies/sunken-battle-priest.ts";
import { invectiveInstruction } from "../cards/AMB/actions/invective-instruction.ts";
import { manaboltConvergence } from "../cards/DTR/actions/manabolt-convergence.ts";
import { forgelightScepter } from "../cards/ALC/items/forgelight-scepter.ts";
import { tacticalRetreat } from "../cards/PRD/actions/tactical-retreat.ts";
import { hulaoGateSunsAscent } from "../cards/AMB/domains/hulao-gate-suns-ascent.ts";
import { facetTheForgotten } from "../cards/RDO/phantasias/facet-the-forgotten.ts";
import { rendingFlames } from "../cards/DOA/attacks/rending-flames.ts";
import { fraysia } from "../cards/ALC/tokens/fraysia.ts";
import { focusingGem } from "../cards/RDO/items/focusing-gem.ts";
import { ralliedAdvance } from "../cards/DOA/attacks/rallied-advance.ts";
import { stonescaleBand } from "../cards/PRXY/items/stonescale-band.ts";
import { innerCourtSchemer } from "../cards/AMB/allies/inner-court-schemer.ts";
import { tomeOfSorcery } from "../cards/AMB/items/tome-of-sorcery.ts";
import { bairuiResplendentBarrier } from "../cards/AMB/phantasias/bairui-resplendent-barrier.ts";
import { freezingHail } from "../cards/P26/actions/freezing-hail.ts";
import { ripplebackTerrapin } from "../cards/AMB/allies/rippleback-terrapin.ts";
import { lesserBoonOfElysianBlood } from "../cards/PRD/boons/lesser-boon-of-elysian-blood.ts";
import { tristanAscendantShadow } from "../cards/P26/champions/tristan-ascendant-shadow.ts";
import { suddenSteel } from "../cards/P26/attacks/sudden-steel.ts";
import { cinderGeyser } from "../cards/HVN/actions/cinder-geyser.ts";
import { beaconKnight } from "../cards/RDO/allies/beacon-knight.ts";
import { hanielArchangelOfSpectra } from "../cards/RDO/allies/haniel-archangel-of-spectra.ts";
import { eminenceInFury } from "../cards/PRD/actions/eminence-in-fury.ts";
import { fracturedCrown } from "../cards/FTC/items/fractured-crown.ts";
import { dominatingStrike } from "../cards/ALC/attacks/dominating-strike.ts";
import { chargedGunslinger } from "../cards/MRC/allies/charged-gunslinger.ts";
import { navigationCompass } from "../cards/ALC/items/navigation-compass.ts";
import { scarletTassel } from "../cards/AMB/items/scarlet-tassel.ts";
import { fireworksDisplay } from "../cards/P24/actions/fireworks-display.ts";
import { backstab } from "../cards/DOA/attacks/backstab.ts";
import { lesserBoonOfProvocation } from "../cards/PRD/boons/lesser-boon-of-provocation.ts";
import { fanOfInsight } from "../cards/AMB/items/fan-of-insight.ts";
import { fractalOfMana } from "../cards/AMB/phantasias/fractal-of-mana.ts";
import { incapacitate } from "../cards/PRD/actions/incapacitate.ts";
import { heirloomOfMateria } from "../cards/RDO/items/heirloom-of-materia.ts";
import { jovianHiltXUltra } from "../cards/PRD/items/jovian-hilt-x-ultra.ts";
import { rescueTheHeir } from "../cards/HVN/actions/rescue-the-heir.ts";
import { songOfFrost } from "../cards/FTC/actions/song-of-frost.ts";
import { cowlOfTheWild } from "../cards/AMB/items/cowl-of-the-wild.ts";
import { flaredIridescence } from "../cards/PTM/actions/flared-iridescence.ts";
import { zanderPreparedScout } from "../cards/DOA/champions/zander-prepared-scout.ts";
import { enfeeblingOrb } from "../cards/PTM/items/enfeebling-orb.ts";
import { aqueousArmor } from "../cards/ALC/phantasias/aqueous-armor.ts";
import { spallingCleanse } from "../cards/SP4/actions/spalling-cleanse.ts";
import { bombasticSprint } from "../cards/ALC/actions/bombastic-sprint.ts";
import { radiantOriginOfAssassin } from "../cards/RDO/phantasias/radiant-origin-of-assassin.ts";
import { siroccoOperative } from "../cards/P24/allies/sirocco-operative.ts";
import { aeneanRepudiation } from "../cards/PRD/actions/aenean-repudiation.ts";
import { airshipCaptain } from "../cards/MRC/allies/airship-captain.ts";
import { tonorisGenesisAegis } from "../cards/ALC/champions/tonoris-genesis-aegis.ts";
import { spiritOfWater } from "../cards/DOA/champions/spirit-of-water.ts";
import { transcendentalRite } from "../cards/P26/items/transcendental-rite.ts";
import { eternalMagistrate } from "../cards/MRC/allies/eternal-magistrate.ts";
import { convergeReflections } from "../cards/P25/actions/converge-reflections.ts";
import { infiniteScintillation } from "../cards/P26/actions/infinite-scintillation.ts";
import { deliciousPastry } from "../cards/PRD/tokens/delicious-pastry.ts";
import { heatedVengeance } from "../cards/AMB/attacks/heated-vengeance.ts";
import { stillshardStrike } from "../cards/PTM/attacks/stillshard-strike.ts";
import { sixOfSpades } from "../cards/PTM/allies/six-of-spades.ts";
import { shatterTheBrittle } from "../cards/P25/actions/shatter-the-brittle.ts";
import { lesserBoonOfNourishment } from "../cards/PRD/boons/lesser-boon-of-nourishment.ts";
import { umbilicalRitual } from "../cards/PRD/actions/umbilical-ritual.ts";
import { castling } from "../cards/PTM/actions/castling.ts";
import { windCutter } from "../cards/DOA/attacks/wind-cutter.ts";
import { namelessChampionMw } from "../cards/AMB/champions/nameless-champion-mw.ts";
import { gleamingSmolder } from "../cards/PTM/actions/gleaming-smolder.ts";
import { tidestoneBovine } from "../cards/AMB/allies/tidestone-bovine.ts";
import { singedEmotions } from "../cards/PRD/actions/singed-emotions.ts";
import { waterveilApostle } from "../cards/MRC/allies/waterveil-apostle.ts";
import { mintheSpiritOfWater } from "../cards/P24/champions/minthe-spirit-of-water.ts";
import { lustersShroud } from "../cards/PTM/actions/lusters-shroud.ts";
import { mistyWhispertail } from "../cards/PTM/allies/misty-whispertail.ts";
import { vermilionDecree } from "../cards/P26/actions/vermilion-decree.ts";
import { avatarOfByakko } from "../cards/RDO/allies/avatar-of-byakko.ts";
import { forgingHeat } from "../cards/PRD/actions/forging-heat.ts";
import { wildgrowthElixir } from "../cards/ALC/items/wildgrowth-elixir.ts";
import { lorraineBlademaster } from "../cards/DEMO22/champions/lorraine-blademaster.ts";
import { sabrinaSpiritOfWater } from "../cards/P23/champions/sabrina-spirit-of-water.ts";
import { heavenlyGuide } from "../cards/AMB/allies/heavenly-guide.ts";
import { sacramentalRite } from "../cards/P25/items/sacramental-rite.ts";
import { dichroicScorch } from "../cards/PTM/actions/dichroic-scorch.ts";
import { diviningStreams } from "../cards/RDO/actions/divining-streams.ts";
import { lesserBoonOfArtemis } from "../cards/PP1/boons/lesser-boon-of-artemis.ts";
import { nimbleLongbowman } from "../cards/RDO/allies/nimble-longbowman.ts";
import { flickeringAfterglow } from "../cards/PTM/attacks/flickering-afterglow.ts";
import { captivatingOpulence } from "../cards/HVN/phantasias/captivating-opulence.ts";
import { mnemonicCharm } from "../cards/AMB/items/mnemonic-charm.ts";
import { righteousRetribution } from "../cards/PTM/actions/righteous-retribution.ts";
import { zanderAlwaysWatching } from "../cards/DOA/champions/zander-always-watching.ts";
import { radiantOriginOfRanger } from "../cards/RDO/phantasias/radiant-origin-of-ranger.ts";
import { luneteFrostbinderPriest } from "../cards/DOA/allies/lunete-frostbinder-priest.ts";
import { pelagicFatestone } from "../cards/HVN/items/pelagic-fatestone.ts";
import { magnificentBanquet } from "../cards/AMB/actions/magnificent-banquet.ts";
import { triumphantMechanic } from "../cards/RDO/allies/triumphant-mechanic.ts";
import { favorableOmens } from "../cards/DTR/actions/favorable-omens.ts";
import { buoyantDriftguard } from "../cards/PP1/allies/buoyant-driftguard.ts";
import { reinforcingAir } from "../cards/PRD/actions/reinforcing-air.ts";
import { divineComedy } from "../cards/PRD/masteries/divine-comedy.ts";
import { aquaveilAmbusher } from "../cards/PRD/allies/aquaveil-ambusher.ts";
import { redirectOrbit } from "../cards/RDO/actions/redirect-orbit.ts";
import { theMajesticSpirit } from "../cards/FTC/allies/the-majestic-spirit.ts";
import { varicoseAmplification } from "../cards/PRD/phantasias/varicose-amplification.ts";
import { harvesterMkIi } from "../cards/MRC/allies/harvester-mk-ii.ts";
import { frigidEmbrittlement } from "../cards/PRD/actions/frigid-embrittlement.ts";
import { manicZealot } from "../cards/ALC/allies/manic-zealot.ts";
import { sablierGuard } from "../cards/P25/allies/sablier-guard.ts";
import { intoTheFray } from "../cards/P24/actions/into-the-fray.ts";
import { animalEncounter } from "../cards/PP1/actions/animal-encounter.ts";
import { huaXiongInsurgentsFang } from "../cards/AMB/allies/hua-xiong-insurgents-fang.ts";
import { rigForDetonation } from "../cards/PRD/actions/rig-for-detonation.ts";
import { majesticSpiritsCrest } from "../cards/DOA/items/majestic-spirits-crest.ts";
import { extinguishingSynchron } from "../cards/PRD/items/extinguishing-synchron.ts";
import { adeptSwordmaster } from "../cards/AMB/allies/adept-swordmaster.ts";
import { dreamyUnicorn } from "../cards/DTR/allies/dreamy-unicorn.ts";
import { shockTherapy } from "../cards/FTC/actions/shock-therapy.ts";
import { cauterizingSeraphim } from "../cards/RDO/allies/cauterizing-seraphim.ts";
import { visceralInversion } from "../cards/RDO/actions/visceral-inversion.ts";
import { aliceTriflesRoyalty } from "../cards/RDO/champions/alice-trifles-royalty.ts";
import { refreshingCharge } from "../cards/PTM/actions/refreshing-charge.ts";
import { returnStroke } from "../cards/PRD/attacks/return-stroke.ts";
import { ripplesOfAtrophy } from "../cards/P25/actions/ripples-of-atrophy.ts";
import { excaliburReflectedEdge } from "../cards/DTR/weapons/excalibur-reflected-edge.ts";
import { exorciseCurses } from "../cards/P24/actions/exorcise-curses.ts";
import { dusksoulStone } from "../cards/P24/items/dusksoul-stone.ts";
import { ionizedAsceticism } from "../cards/RDO/actions/ionized-asceticism.ts";
import { rumbleCoordinator } from "../cards/PRD/allies/rumble-coordinator.ts";
import { miaoSpiritOfWater } from "../cards/P25/champions/miao-spirit-of-water.ts";
import { scoutTheLand } from "../cards/P26/actions/scout-the-land.ts";
import { vantagePoint } from "../cards/RDO/actions/vantage-point.ts";
import { imperialApprentice } from "../cards/MRC/allies/imperial-apprentice.ts";
import { ingredientPouch } from "../cards/P24/items/ingredient-pouch.ts";
import { fanclubLeader } from "../cards/PRD/allies/fanclub-leader.ts";
import { flametechShield } from "../cards/PRD/items/flametech-shield.ts";
import { annulSpell } from "../cards/P25/actions/annul-spell.ts";
import { blightsRing } from "../cards/RDO/items/blights-ring.ts";
import { blitzMage } from "../cards/DOA/allies/blitz-mage.ts";
import { zanderBlindingSteel } from "../cards/DOA/champions/zander-blinding-steel.ts";
import { fracturedMemories } from "../cards/P25/masteries/fractured-memories.ts";
import { undeniableTruth } from "../cards/P25/actions/undeniable-truth.ts";
import { nippingKicker } from "../cards/RDO/actions/nipping-kicker.ts";
import { lesserBoonOfZerusa } from "../cards/PP1/boons/lesser-boon-of-zerusa.ts";
import { portSmuggler } from "../cards/DOA/allies/port-smuggler.ts";
import { aetherialProjection } from "../cards/PTM/phantasias/aetherial-projection.ts";
import { petalfallEmbrace } from "../cards/RDO/actions/petalfall-embrace.ts";
import { visagesStrike } from "../cards/PTM/attacks/visages-strike.ts";
import { equinoxHour } from "../cards/RDO/items/equinox-hour.ts";
import { poweredBishop } from "../cards/MRC/allies/powered-bishop.ts";
import { disorientingWinds } from "../cards/DOA/actions/disorienting-winds.ts";
import { accompanyingGuard } from "../cards/ALC/allies/accompanying-guard.ts";
import { daQiaoCinderbinder } from "../cards/HVN/allies/da-qiao-cinderbinder.ts";
import { sadiBloodHarvester } from "../cards/PRD/allies/sadi-blood-harvester.ts";
import { shuFrontliner } from "../cards/AMB/allies/shu-frontliner.ts";
import { trainedSharpshooter } from "../cards/ALC/allies/trained-sharpshooter.ts";
import { fractalOfSnow } from "../cards/ALC/phantasias/fractal-of-snow.ts";
import { lesserBoonOfBullets } from "../cards/PP1/boons/lesser-boon-of-bullets.ts";
import { cardinalOfDivineRite } from "../cards/RDO/allies/cardinal-of-divine-rite.ts";
import { chaliceOfBlood } from "../cards/DOA/items/chalice-of-blood.ts";
import { poisonousApple } from "../cards/DTR/items/poisonous-apple.ts";
import { triboelectricFortification } from "../cards/PRD/actions/triboelectric-fortification.ts";
import { coiledFatestone } from "../cards/HVN/items/coiled-fatestone.ts";
import { indissolubleFractal } from "../cards/PTM/phantasias/indissoluble-fractal.ts";
import { tombSweep } from "../cards/P26/actions/tomb-sweep.ts";
import { usurpTheWinds } from "../cards/HVN/actions/usurp-the-winds.ts";
import { merlinMemoryThief } from "../cards/DOA/champions/merlin-memory-thief.ts";
import { tweedledumRattledDancer } from "../cards/EVP/allies/tweedledum-rattled-dancer.ts";
import { royalOrdinance } from "../cards/DTR/actions/royal-ordinance.ts";
import { arrowTrap } from "../cards/DOA/actions/arrow-trap.ts";
import { winblessKiteshield } from "../cards/MRC/items/winbless-kiteshield.ts";
import { malevolentVow } from "../cards/DTR/actions/malevolent-vow.ts";
import { gustguardBastion } from "../cards/AMB/allies/gustguard-bastion.ts";
import { lurkingAssailant } from "../cards/FTC/allies/lurking-assailant.ts";
import { lesserBoonOfRegret } from "../cards/PP1/boons/lesser-boon-of-regret.ts";
import { bidingCinquedea } from "../cards/PTM/weapons/biding-cinquedea.ts";
import { tonicOfRemembrance } from "../cards/MRC/items/tonic-of-remembrance.ts";
import { caretakerDrone } from "../cards/ALC/allies/caretaker-drone.ts";
import { nullifyingLantern } from "../cards/DOA/items/nullifying-lantern.ts";
import { rimesoulBishop } from "../cards/ALC/allies/rimesoul-bishop.ts";
import { galestreamInsight } from "../cards/ALC/actions/galestream-insight.ts";
import { sharpeningStone } from "../cards/DEMO22/items/sharpening-stone.ts";
import { lorraineHonedOperative } from "../cards/PRD/champions/lorraine-honed-operative.ts";
import { purgeInFlames } from "../cards/DOA/actions/purge-in-flames.ts";
import { hauntingApparition } from "../cards/RDO/allies/haunting-apparition.ts";
import { shatteringDischarge } from "../cards/HVN/actions/shattering-discharge.ts";
import { savageArrow } from "../cards/AMB/items/savage-arrow.ts";
import { unitysGale } from "../cards/PP1/actions/unitys-gale.ts";
import { dreamFairy } from "../cards/SP4/allies/dream-fairy.ts";
import { coronalOfRejuvenation } from "../cards/P24/items/coronal-of-rejuvenation.ts";
import { halcyonAnimus } from "../cards/RDO/actions/halcyon-animus.ts";
import { unmakeDuality } from "../cards/PTM/actions/unmake-duality.ts";
import { luxemSight } from "../cards/DOA/actions/luxem-sight.ts";
import { suitedTrickery } from "../cards/DTR/actions/suited-trickery.ts";
import { immolationTrap } from "../cards/DOA/actions/immolation-trap.ts";
import { whisperwindCompass } from "../cards/PTM/items/whisperwind-compass.ts";
import { oasisTradingPost } from "../cards/ALC/domains/oasis-trading-post.ts";
import { winblessRangefinder } from "../cards/MRC/allies/winbless-rangefinder.ts";
import { acceptedContract } from "../cards/DOA/actions/accepted-contract.ts";
import { jubjubBirdMimsyGhast } from "../cards/PTM/allies/jubjub-bird-mimsy-ghast.ts";
import { hauntingDemise } from "../cards/P24/attacks/haunting-demise.ts";
import { lingeringBanshee } from "../cards/DTR/allies/lingering-banshee.ts";
import { castlingBoon } from "../cards/DTR/actions/castling-boon.ts";
import { capriciousLynx } from "../cards/FTC/allies/capricious-lynx.ts";
import { huajiOfHeavensRise } from "../cards/HVN/weapons/huaji-of-heavens-rise.ts";
import { gemOfSearingFlame } from "../cards/AMB/items/gem-of-searing-flame.ts";
import { collapsingTrap } from "../cards/MRC/actions/collapsing-trap.ts";
import { blightheartPenitent } from "../cards/PRD/allies/blightheart-penitent.ts";
import { dianaMoonpiercer } from "../cards/DTR/champions/diana-moonpiercer.ts";
import { innervateAgility } from "../cards/FTC/actions/innervate-agility.ts";
import { fatestoneOfBalance } from "../cards/HVN/items/fatestone-of-balance.ts";
import { chargedAlchemist } from "../cards/MRC/allies/charged-alchemist.ts";
import { rousingSlam } from "../cards/ALC/attacks/rousing-slam.ts";
import { nanyuePortsman } from "../cards/AMB/allies/nanyue-portsman.ts";
import { lesserBoonOfPulousa } from "../cards/PP1/boons/lesser-boon-of-pulousa.ts";
import { lesserBoonOfRakko } from "../cards/PP1/boons/lesser-boon-of-rakko.ts";
import { twingaleParry } from "../cards/RDO/actions/twingale-parry.ts";
import { seiryuusCommand } from "../cards/P26/actions/seiryuus-command.ts";
import { regenerate } from "../cards/AMB/actions/regenerate.ts";
import { standBeforeTheQueen } from "../cards/P25/actions/stand-before-the-queen.ts";
import { ashwoundShot } from "../cards/DTR/actions/ashwound-shot.ts";
import { drownInSorrow } from "../cards/PTM/actions/drown-in-sorrow.ts";
import { corhaziInfiltrator } from "../cards/DOA/allies/corhazi-infiltrator.ts";
import { nascentBlast } from "../cards/P24/actions/nascent-blast.ts";
import { openingCut } from "../cards/DEMO22/attacks/opening-cut.ts";
import { anthemOfVitality } from "../cards/FTC/actions/anthem-of-vitality.ts";
import { cellAssembler } from "../cards/P24/allies/cell-assembler.ts";
import { flowingOubli } from "../cards/DTR/actions/flowing-oubli.ts";
import { spiritBladeGhostStrike } from "../cards/DOA/attacks/spirit-blade-ghost-strike.ts";
import { violetHaze } from "../cards/ALC/actions/violet-haze.ts";
import { imperialAlchemist } from "../cards/ALC/allies/imperial-alchemist.ts";
import { veteranSoldier } from "../cards/DEMO22/allies/veteran-soldier.ts";
import { reposition } from "../cards/ALC/actions/reposition.ts";
import { glacierRemnants } from "../cards/RDO/domains/glacier-remnants.ts";
import { signaltechXUltra } from "../cards/PRD/items/signaltech-x-ultra.ts";
import { vanguardsReversal } from "../cards/MRC/attacks/vanguards-reversal.ts";
import { chamberlainToad } from "../cards/PTM/allies/chamberlain-toad.ts";
import { infernalVessel } from "../cards/PTM/items/infernal-vessel.ts";
import { fatedKeepsake } from "../cards/P25/items/fated-keepsake.ts";
import { swervingSpring } from "../cards/AMB/actions/swerving-spring.ts";
import { hornedKnight } from "../cards/DTR/allies/horned-knight.ts";
import { pyrolysisSage } from "../cards/PRD/allies/pyrolysis-sage.ts";
import { smokeOut } from "../cards/HVN/actions/smoke-out.ts";
import { savageSwing } from "../cards/P24/attacks/savage-swing.ts";
import { conflagrativeTrounce } from "../cards/DTR/attacks/conflagrative-trounce.ts";
import { charmOfAnticipation } from "../cards/PP1/items/charm-of-anticipation.ts";
import { shackledTheurgist } from "../cards/DTR/allies/shackled-theurgist.ts";
import { incineratorFelindroid } from "../cards/PRD/allies/incinerator-felindroid.ts";
import { oathOfTheSakura } from "../cards/AMB/actions/oath-of-the-sakura.ts";
import { shadowsClaw } from "../cards/MRC/weapons/shadows-claw.ts";
import { refluxalRibbon } from "../cards/P25/items/refluxal-ribbon.ts";
import { vanishFromSight } from "../cards/ALC/actions/vanish-from-sight.ts";
import { hardyVeteran } from "../cards/PRD/allies/hardy-veteran.ts";
import { intervention } from "../cards/AMB/actions/intervention.ts";
import { buddyRaccoon } from "../cards/RDO/allies/buddy-raccoon.ts";
import { aeneanTailwindBoost } from "../cards/PRD/actions/aenean-tailwind-boost.ts";
import { takeAim } from "../cards/ALC/actions/take-aim.ts";
import { hanabiSpiritOfFire } from "../cards/P25/champions/hanabi-spirit-of-fire.ts";
import { coyBouclier } from "../cards/P25/allies/coy-bouclier.ts";
import { piercingAetherfuel } from "../cards/DTR/actions/piercing-aetherfuel.ts";
import { greaterBoonOfDux } from "../cards/PP1/boons/greater-boon-of-dux.ts";
import { sidestep } from "../cards/ALC/actions/sidestep.ts";
import { greaterBoonOfFlock } from "../cards/PRD/boons/greater-boon-of-flock.ts";
import { surgingObstruction } from "../cards/RDO/actions/surging-obstruction.ts";
import { cosmicBolt } from "../cards/SP4/actions/cosmic-bolt.ts";
import { fracturingSlash } from "../cards/PTM/attacks/fracturing-slash.ts";
import { entrancingFiligree } from "../cards/P24/items/entrancing-filigree.ts";
import { burningAethercharge } from "../cards/PTM/actions/burning-aethercharge.ts";
import { primaMateria } from "../cards/MRC/items/prima-materia.ts";
import { tidefateBrooch } from "../cards/HVN/items/tidefate-brooch.ts";
import { ashfletchedBowman } from "../cards/RDO/allies/ashfletched-bowman.ts";
import { flameRuneSwordsman } from "../cards/DOA/allies/flame-rune-swordsman.ts";
import { horticounter } from "../cards/ALC/actions/horticounter.ts";
import { andronikaEternalHerald } from "../cards/MRC/allies/andronika-eternal-herald.ts";
import { torrentialBlast } from "../cards/ALC/actions/torrential-blast.ts";
import { perishingFlorets } from "../cards/RDO/phantasias/perishing-florets.ts";
import { silentFirebrand } from "../cards/HVN/allies/silent-firebrand.ts";
import { chateauDeCoeurs } from "../cards/DTR/domains/chateau-de-coeurs.ts";
import { breakTheLine } from "../cards/PRD/actions/break-the-line.ts";
import { zenaEchoWeaver } from "../cards/PRD/allies/zena-echo-weaver.ts";
import { temperedSteel } from "../cards/DOA/actions/tempered-steel.ts";
import { deviousWelcome } from "../cards/DTR/actions/devious-welcome.ts";
import { auspiciousManifestation } from "../cards/RDO/actions/auspicious-manifestation.ts";
import { fabledSapphireFatestone } from "../cards/HVN/items/fabled-sapphire-fatestone.ts";
import { fieldOfRanksAndFiles } from "../cards/PTM/domains/field-of-ranks-and-files.ts";
import { syntheticCore } from "../cards/ALC/items/synthetic-core.ts";
import { shademistPriestess } from "../cards/RDO/allies/shademist-priestess.ts";
import { invigoratedSlash } from "../cards/P26/attacks/invigorated-slash.ts";
import { embertailSquirrel } from "../cards/DOA/allies/embertail-squirrel.ts";
import { expeditiousOpening } from "../cards/DTR/actions/expeditious-opening.ts";
import { volcanicCrescendo } from "../cards/RDO/actions/volcanic-crescendo.ts";
import { prismaticSpirit } from "../cards/P23/champions/prismatic-spirit.ts";
import { flashFreeze } from "../cards/ALC/actions/flash-freeze.ts";
import { poisedOcclusion } from "../cards/SP4/actions/poised-occlusion.ts";
import { ordinaryHorse } from "../cards/AMB/allies/ordinary-horse.ts";
import { sovereignSanctuary } from "../cards/DTR/phantasias/sovereign-sanctuary.ts";
import { lacunasGrasp } from "../cards/DTR/weapons/lacunas-grasp.ts";
import { trumpSet } from "../cards/P26/actions/trump-set.ts";
import { threeVisits } from "../cards/AMB/actions/three-visits.ts";
import { zhangLiaoBloodmonger } from "../cards/HVN/allies/zhang-liao-bloodmonger.ts";
import { lancelotGoliathOfAesa } from "../cards/FTC/allies/lancelot-goliath-of-aesa.ts";
import { streamOfConsciousness } from "../cards/ALC/actions/stream-of-consciousness.ts";
import { plasmaVanguard } from "../cards/RDO/allies/plasma-vanguard.ts";
import { gloamspireBlackMarket } from "../cards/ALC/domains/gloamspire-black-market.ts";
import { melodiousFlute } from "../cards/DOA/items/melodious-flute.ts";
import { sablemereWardensGrip } from "../cards/PRXY/items/sablemere-wardens-grip.ts";
import { vascularCollapse } from "../cards/PRD/actions/vascular-collapse.ts";
import { discharger } from "../cards/PRD/items/discharger.ts";
import { noireAceOfSpades } from "../cards/PRD/allies/noire-ace-of-spades.ts";
import { debilitatingGrasp } from "../cards/MRC/attacks/debilitating-grasp.ts";
import { greaterBoonOfConnection } from "../cards/PRD/boons/greater-boon-of-connection.ts";
import { fieryDuelist } from "../cards/ALC/allies/fiery-duelist.ts";
import { verdureOfPreservation } from "../cards/RDO/phantasias/verdure-of-preservation.ts";
import { enrage } from "../cards/P24/actions/enrage.ts";
import { aethersEmbrace } from "../cards/DTR/actions/aethers-embrace.ts";
import { extortionScheme } from "../cards/DOA/actions/extortion-scheme.ts";
import { inundatingClash } from "../cards/AMB/attacks/inundating-clash.ts";
import { blazingLunge } from "../cards/AMB/attacks/blazing-lunge.ts";
import { arcaneElemental } from "../cards/DOA/allies/arcane-elemental.ts";
import { windstrikeSoldier } from "../cards/PRD/allies/windstrike-soldier.ts";
import { witheringGrasp } from "../cards/HVN/actions/withering-grasp.ts";
import { cellforgerDroid } from "../cards/PRD/allies/cellforger-droid.ts";
import { mordredFlawlessBlade } from "../cards/DOA/champions/mordred-flawless-blade.ts";
import { weavingManastream } from "../cards/DTR/actions/weaving-manastream.ts";
import { aquatechBladeX } from "../cards/PRD/weapons/aquatech-blade-x.ts";
import { dianaJudgmentsArrow } from "../cards/DTR/champions/diana-judgments-arrow.ts";
import { wrathfulSlime } from "../cards/HVN/allies/wrathful-slime.ts";
import { scorchingTrap } from "../cards/MRC/actions/scorching-trap.ts";
import { temperInFlames } from "../cards/AMB/actions/temper-in-flames.ts";
import { obeliskOfArmaments } from "../cards/ALC/tokens/obelisk-of-armaments.ts";
import { lesserBoonOfRefuge } from "../cards/PRD/boons/lesser-boon-of-refuge.ts";
import { greaterBoonOfProxia } from "../cards/PRD/boons/greater-boon-of-proxia.ts";
import { shimmercloakAssassin } from "../cards/ALC/allies/shimmercloak-assassin.ts";
import { poisedBowman } from "../cards/HVN/allies/poised-bowman.ts";
import { emergentDagger } from "../cards/AMB/weapons/emergent-dagger.ts";
import { lesserBoonOfKnox } from "../cards/PP1/boons/lesser-boon-of-knox.ts";
import { dredgingStreams } from "../cards/SP4/actions/dredging-streams.ts";
import { galewhisperRogue } from "../cards/AMB/allies/galewhisper-rogue.ts";
import { lesserBoonOfPermeation } from "../cards/PRD/boons/lesser-boon-of-permeation.ts";
import { angerTheSkies } from "../cards/DOA/actions/anger-the-skies.ts";
import { ghostsightMare } from "../cards/AMB/allies/ghostsight-mare.ts";
import { greaterBoonOfParvati } from "../cards/PP1/boons/greater-boon-of-parvati.ts";
import { wingpeakPatriarch } from "../cards/HVN/allies/wingpeak-patriarch.ts";
import { innervateFury } from "../cards/FTC/actions/innervate-fury.ts";
import { ensnaringFumes } from "../cards/DOA/actions/ensnaring-fumes.ts";
import { voidsCloak } from "../cards/RDO/items/voids-cloak.ts";
import { peacefulReunion } from "../cards/FTC/actions/peaceful-reunion.ts";
import { eternalDirective } from "../cards/MRC/attacks/eternal-directive.ts";
import { franCarmineSpark } from "../cards/EVP/allies/fran-carmine-spark.ts";
import { owlFamiliar } from "../cards/DOA/allies/owl-familiar.ts";
import { chrysalisHazyCaterpillar } from "../cards/DTR/allies/chrysalis-hazy-caterpillar.ts";
import { ravagingTempest } from "../cards/DOA/actions/ravaging-tempest.ts";
import { incandescentReliquary } from "../cards/P25/items/incandescent-reliquary.ts";
import { netherDodobird } from "../cards/PTM/allies/nether-dodobird.ts";
import { palvorSword } from "../cards/PTM/weapons/palvor-sword.ts";
import { intrepidHighwayman } from "../cards/DOA/allies/intrepid-highwayman.ts";
import { pendantOfAccrual } from "../cards/RDO/items/pendant-of-accrual.ts";
import { geniGiftedMechanist } from "../cards/EVP/allies/geni-gifted-mechanist.ts";
import { maidenOfShroudedFog } from "../cards/HVN/phantasias/maiden-of-shrouded-fog.ts";
import { birefringence } from "../cards/RDO/actions/birefringence.ts";
import { inductionStrike } from "../cards/PRD/attacks/induction-strike.ts";
import { stolenChance } from "../cards/PTM/actions/stolen-chance.ts";
import { temptationsFacade } from "../cards/ALC/items/temptations-facade.ts";
import { wavekeepersBond } from "../cards/PTM/items/wavekeepers-bond.ts";
import { leadingCharge } from "../cards/AMB/attacks/leading-charge.ts";
import { bygoneDays } from "../cards/PRD/phantasias/bygone-days.ts";
import { herdOfTheHearth } from "../cards/AMB/actions/herd-of-the-hearth.ts";
import { pantheonBarrier } from "../cards/PP1/tokens/pantheon-barrier.ts";
import { manufactureCell } from "../cards/MRC/actions/manufacture-cell.ts";
import { developMana } from "../cards/FTC/actions/develop-mana.ts";
import { flametechManual } from "../cards/PRD/items/flametech-manual.ts";
import { livelyChorale } from "../cards/HVN/actions/lively-chorale.ts";
import { wildgrowthFatestone } from "../cards/HVN/items/wildgrowth-fatestone.ts";
import { prismaticPerseverance } from "../cards/AMB/items/prismatic-perseverance.ts";
import { dawnsReversal } from "../cards/ALC/actions/dawns-reversal.ts";
import { invertedPyroslash } from "../cards/PTM/attacks/inverted-pyroslash.ts";
import { waterfallVeiler } from "../cards/HVN/allies/waterfall-veiler.ts";
import { frostnipPirouette } from "../cards/P25/actions/frostnip-pirouette.ts";
import { freezingSteel } from "../cards/MRC/actions/freezing-steel.ts";
import { fractalOfCreation } from "../cards/ALC/phantasias/fractal-of-creation.ts";
import { enduraReimagined } from "../cards/PRXY/items/endura-reimagined.ts";
import { beseechedFatestone } from "../cards/HVN/items/beseeched-fatestone.ts";
import { frostbinderApostle } from "../cards/FTC/allies/frostbinder-apostle.ts";
import { whirlwindReaper } from "../cards/HVN/allies/whirlwind-reaper.ts";
import { vanitasObliviateSchemer } from "../cards/ALC/champions/vanitas-obliviate-schemer.ts";
import { yuanShaoCrownGeneral } from "../cards/HVN/allies/yuan-shao-crown-general.ts";
import { lorraineArclightSaber } from "../cards/PRD/champions/lorraine-arclight-saber.ts";
import { curseAmplification } from "../cards/MRC/actions/curse-amplification.ts";
import { seedOfEmpowerment } from "../cards/PRD/items/seed-of-empowerment.ts";
import { fatestoneOfRevelations } from "../cards/P25/items/fatestone-of-revelations.ts";
import { virgilAlteredFuture } from "../cards/PRD/allies/virgil-altered-future.ts";
import { reapingLegacy } from "../cards/RDO/attacks/reaping-legacy.ts";
import { giveBath } from "../cards/DOA/actions/give-bath.ts";
import { waitedAccord } from "../cards/PTM/phantasias/waited-accord.ts";
import { crystallizedAnthem } from "../cards/PTM/actions/crystallized-anthem.ts";
import { reluctantBreath } from "../cards/PRD/items/reluctant-breath.ts";
import { alkahest } from "../cards/MRC/items/alkahest.ts";
import { ghastlySlime } from "../cards/PTM/allies/ghastly-slime.ts";
import { fourOfHearts } from "../cards/DTR/allies/four-of-hearts.ts";
import { plumingCrescendo } from "../cards/HVN/actions/pluming-crescendo.ts";
import { calmingBreeze } from "../cards/SP4/actions/calming-breeze.ts";
import { blisteringInsurgent } from "../cards/PRD/allies/blistering-insurgent.ts";
import { punishingCartridge } from "../cards/MRC/items/punishing-cartridge.ts";
import { embershieldKeeper } from "../cards/MRC/allies/embershield-keeper.ts";
import { enchainingGale } from "../cards/ALC/actions/enchaining-gale.ts";
import { materializeMunitions } from "../cards/P24/actions/materialize-munitions.ts";
import { hemorrhagingRend } from "../cards/AMB/attacks/hemorrhaging-rend.ts";
import { undercurrentVantage } from "../cards/P25/actions/undercurrent-vantage.ts";
import { huangZhongUnerringAim } from "../cards/AMB/allies/huang-zhong-unerring-aim.ts";
import { setTheTraps } from "../cards/DOA/actions/set-the-traps.ts";
import { eventideSpear } from "../cards/AMB/weapons/eventide-spear.ts";
import { beastbondBoots } from "../cards/DOA/items/beastbond-boots.ts";
import { remnantOfWill } from "../cards/PTM/actions/remnant-of-will.ts";
import { maidenOfWaningBloom } from "../cards/RDO/phantasias/maiden-of-waning-bloom.ts";
import { hairpinOfTransience } from "../cards/P25/items/hairpin-of-transience.ts";
import { thousandRefractions } from "../cards/DOA/attacks/thousand-refractions.ts";
import { luXunPyreStrategist } from "../cards/HVN/allies/lu-xun-pyre-strategist.ts";
import { arcaneSight } from "../cards/DOA/actions/arcane-sight.ts";
import { embersong } from "../cards/DOA/actions/embersong.ts";
import { facetTogether } from "../cards/PTM/actions/facet-together.ts";
import { stellariaShower } from "../cards/DTR/phantasias/stellaria-shower.ts";
import { tariffRing } from "../cards/P26/items/tariff-ring.ts";
import { shatteredHope } from "../cards/P25/actions/shattered-hope.ts";
import { automatonForgewarden } from "../cards/RDO/allies/automaton-forgewarden.ts";
import { tempusStalker } from "../cards/AMB/allies/tempus-stalker.ts";
import { xuchangFrozenCitadel } from "../cards/HVN/domains/xuchang-frozen-citadel.ts";
import { mordredAurelianRegent } from "../cards/P26/champions/mordred-aurelian-regent.ts";
import { cleansingReunion } from "../cards/MRC/actions/cleansing-reunion.ts";
import { greaterBoonOfKanaloa } from "../cards/PP1/boons/greater-boon-of-kanaloa.ts";
import { seersSword } from "../cards/DEMO22/weapons/seers-sword.ts";
import { automatedGardener } from "../cards/ALC/allies/automated-gardener.ts";
import { ritaiBerserker } from "../cards/HVN/allies/ritai-berserker.ts";
import { gloamspireWraith } from "../cards/ALC/allies/gloamspire-wraith.ts";
import { radiantOriginOfCleric } from "../cards/RDO/phantasias/radiant-origin-of-cleric.ts";
import { spiritBladeTerminus } from "../cards/P25/attacks/spirit-blade-terminus.ts";
import { surveilTheWinds } from "../cards/PRD/actions/surveil-the-winds.ts";
import { lesserBoonOfPoseidon } from "../cards/PP1/boons/lesser-boon-of-poseidon.ts";
import { barrierServant } from "../cards/DOA/allies/barrier-servant.ts";
import { thinkDeep } from "../cards/HVN/actions/think-deep.ts";
import { waterBarrier } from "../cards/DOA/actions/water-barrier.ts";
import { reactivateDrone } from "../cards/RDO/actions/reactivate-drone.ts";
import { ashwickCremator } from "../cards/HVN/allies/ashwick-cremator.ts";
import { siderealSpellshot } from "../cards/P25/actions/sidereal-spellshot.ts";
import { parcenetRoyalMaid } from "../cards/EVP/allies/parcenet-royal-maid.ts";
import { obeliskOfFabrication } from "../cards/ALC/tokens/obelisk-of-fabrication.ts";
import { hightail } from "../cards/PRD/actions/hightail.ts";
import { luBuIndomitableTitan } from "../cards/HVN/allies/lu-bu-indomitable-titan.ts";
import { manasCascade } from "../cards/DTR/weapons/manas-cascade.ts";
import { zephyrAssistant } from "../cards/DOA/allies/zephyr-assistant.ts";
import { clearPastures } from "../cards/HVN/actions/clear-pastures.ts";
import { shuangJiOfSacrifice } from "../cards/P24/weapons/shuang-ji-of-sacrifice.ts";
import { rilewindSentinel } from "../cards/HVN/allies/rilewind-sentinel.ts";
import { vaporjetShield } from "../cards/MRC/items/vaporjet-shield.ts";
import { shardforgedBlade } from "../cards/P25/weapons/shardforged-blade.ts";
import { meirenOfVerdancy } from "../cards/RDO/allies/meiren-of-verdancy.ts";
import { cometaryVantage } from "../cards/DTR/actions/cometary-vantage.ts";
import { coronationCeremony } from "../cards/PRD/actions/coronation-ceremony.ts";
import { rivuletAdjutant } from "../cards/DTR/allies/rivulet-adjutant.ts";
import { undyingDreams } from "../cards/DTR/actions/undying-dreams.ts";
import { aquaVitae } from "../cards/MRC/items/aqua-vitae.ts";
import { winblessGatekeeper } from "../cards/ALC/allies/winbless-gatekeeper.ts";
import { forceLoad } from "../cards/ALC/actions/force-load.ts";
import { huntWeissKing } from "../cards/PTM/allies/hunt-weiss-king.ts";
import { risingTides } from "../cards/AMB/actions/rising-tides.ts";
import { curtainOfShadows } from "../cards/RDO/actions/curtain-of-shadows.ts";
import { regulusBlitz } from "../cards/P26/attacks/regulus-blitz.ts";
import { dissuadingHalt } from "../cards/P25/actions/dissuading-halt.ts";
import { luminescentSlash } from "../cards/P26/attacks/luminescent-slash.ts";
import { fluteOfTaming } from "../cards/DOA/items/flute-of-taming.ts";
import { windSurgeEmitter } from "../cards/PRD/items/wind-surge-emitter.ts";
import { steadySharpshooter } from "../cards/HVN/allies/steady-sharpshooter.ts";
import { seedOfNature } from "../cards/DOA/items/seed-of-nature.ts";
import { bringDownTheMighty } from "../cards/AMB/actions/bring-down-the-mighty.ts";
import { twinstarTonic } from "../cards/RDO/items/twinstar-tonic.ts";
import { enthrallingVisage } from "../cards/GSC/actions/enthralling-visage.ts";
import { aethericReforging } from "../cards/DTR/actions/aetheric-reforging.ts";
import { theConstellatorySpire } from "../cards/ALC/domains/the-constellatory-spire.ts";
import { tomeOfKnowledge } from "../cards/DOA/items/tome-of-knowledge.ts";
import { aeneanCrystallization } from "../cards/PRD/actions/aenean-crystallization.ts";
import { rileTheAbyss } from "../cards/DTR/actions/rile-the-abyss.ts";
import { unbrokenMustang } from "../cards/AMB/allies/unbroken-mustang.ts";
import { tonorisMightOfHumanity } from "../cards/ALC/champions/tonoris-might-of-humanity.ts";
import { singeingLeap } from "../cards/PTM/actions/singeing-leap.ts";
import { wingedTalaria } from "../cards/AMB/items/winged-talaria.ts";
import { empoweringPrayer } from "../cards/P24/actions/empowering-prayer.ts";
import { revokerBell } from "../cards/PRD/items/revoker-bell.ts";
import { automatonBomber } from "../cards/ALC/allies/automaton-bomber.ts";
import { cloudstoneOrb } from "../cards/AMB/items/cloudstone-orb.ts";
import { pierceTheHeavens } from "../cards/P24/attacks/pierce-the-heavens.ts";
import { eightOfHearts } from "../cards/RDO/allies/eight-of-hearts.ts";
import { bloodSurge } from "../cards/PRD/actions/blood-surge.ts";
import { leadWithForce } from "../cards/AMB/actions/lead-with-force.ts";
import { jabberwockyCalamitysCall } from "../cards/PTM/allies/jabberwocky-calamitys-call.ts";
import { agnisSignet } from "../cards/PRD/items/agnis-signet.ts";
import { safeguardAmulet } from "../cards/P26/items/safeguard-amulet.ts";
import { unforgottenWill } from "../cards/RDO/actions/unforgotten-will.ts";
import { discoverTheDivine } from "../cards/RDO/actions/discover-the-divine.ts";
import { torRealmwalkerColossus } from "../cards/RDO/domains/tor-realmwalker-colossus.ts";
import { flamebreakChorus } from "../cards/FTC/actions/flamebreak-chorus.ts";
import { gaiasBlessing } from "../cards/DOA/items/gaias-blessing.ts";
import { mortalAmbition } from "../cards/AMB/actions/mortal-ambition.ts";
import { flowerbud } from "../cards/HVN/tokens/flowerbud.ts";
import { blissfulCalling } from "../cards/DOA/actions/blissful-calling.ts";
import { sturdyDroid } from "../cards/PRD/allies/sturdy-droid.ts";
import { explosiveConcoction } from "../cards/HVN/items/explosive-concoction.ts";
import { forbiddenTeachings } from "../cards/RDO/actions/forbidden-teachings.ts";
import { allenBeastBeckoner } from "../cards/DOA/champions/allen-beast-beckoner.ts";
import { rapidReload } from "../cards/ALC/actions/rapid-reload.ts";
import { devotedBloomweaver } from "../cards/P24/allies/devoted-bloomweaver.ts";
import { corhaziCourier } from "../cards/DOA/allies/corhazi-courier.ts";
import { stolidVanguard } from "../cards/AMB/allies/stolid-vanguard.ts";
import { lesserBoonOfOzymandias } from "../cards/PP1/boons/lesser-boon-of-ozymandias.ts";
import { sinkTheMind } from "../cards/AMB/actions/sink-the-mind.ts";
import { convalescingMare } from "../cards/HVN/allies/convalescing-mare.ts";
import { radiantOriginOfGuardian } from "../cards/RDO/phantasias/radiant-origin-of-guardian.ts";
import { venousCore } from "../cards/PRD/items/venous-core.ts";
import { banditGazeLeader } from "../cards/RDO/allies/bandit-gaze-leader.ts";
import { spellshieldTera } from "../cards/AMB/actions/spellshield-tera.ts";
import { purgingTempest } from "../cards/DTR/actions/purging-tempest.ts";
import { honeByFire } from "../cards/FTC/actions/hone-by-fire.ts";
import { fragmentedSpiritOfFire } from "../cards/MRC/champions/fragmented-spirit-of-fire.ts";
import { cascadingRound } from "../cards/ALC/items/cascading-round.ts";
import { spectralBeacon } from "../cards/AMB/items/spectral-beacon.ts";
import { cooktechMixer } from "../cards/PRD/items/cooktech-mixer.ts";
import { outfittedRavager } from "../cards/PRD/allies/outfitted-ravager.ts";
import { wickedGildbreaker } from "../cards/PRD/allies/wicked-gildbreaker.ts";
import { poweredDefender } from "../cards/MRC/allies/powered-defender.ts";
import { frostbind } from "../cards/P26/actions/frostbind.ts";
import { purlingFootman } from "../cards/DTR/allies/purling-footman.ts";
import { constellaryPredomination } from "../cards/RDO/actions/constellary-predomination.ts";
import { synthDisrupter } from "../cards/P24/items/synth-disrupter.ts";
import { reconstructiveSurgery } from "../cards/ALC/actions/reconstructive-surgery.ts";
import { youngPeacekeeper } from "../cards/ALC/allies/young-peacekeeper.ts";
import { stiflingTrap } from "../cards/PRD/actions/stifling-trap.ts";
import { baubleOfAbundance } from "../cards/DEMO22/items/bauble-of-abundance.ts";
import { prototypeShield } from "../cards/MRC/items/prototype-shield.ts";
import { harvestHerbs } from "../cards/ALC/actions/harvest-herbs.ts";
import { tonorisLoneMercenary } from "../cards/ALC/champions/tonoris-lone-mercenary.ts";
import { materializePolearm } from "../cards/AMB/actions/materialize-polearm.ts";
import { comboStrike } from "../cards/DOA/attacks/combo-strike.ts";
import { swordOfShadows } from "../cards/DTR/weapons/sword-of-shadows.ts";
import { disenchant } from "../cards/P25/actions/disenchant.ts";
import { jinFateDefiant } from "../cards/AMB/champions/jin-fate-defiant.ts";
import { raiArchmage } from "../cards/DOA/champions/rai-archmage.ts";
import { solarPinnacle } from "../cards/PRD/actions/solar-pinnacle.ts";
import { heightenSpellcraft } from "../cards/P24/actions/heighten-spellcraft.ts";
import { silvergaleObelithsCall } from "../cards/RDO/actions/silvergale-obeliths-call.ts";
import { submergedFatestone } from "../cards/HVN/items/submerged-fatestone.ts";
import { windriderMage } from "../cards/DOA/allies/windrider-mage.ts";
import { devilsLifeline } from "../cards/PRD/actions/devils-lifeline.ts";
import { summonGale } from "../cards/DOA/actions/summon-gale.ts";
import { greenSlime } from "../cards/FTC/allies/green-slime.ts";
import { frog } from "../cards/P26/allies/frog.ts";
import { mirroredConfrontation } from "../cards/PTM/actions/mirrored-confrontation.ts";
import { cielMiragesGrave } from "../cards/DTR/champions/ciel-mirages-grave.ts";
import { hemofluxDrain } from "../cards/PRD/actions/hemoflux-drain.ts";
import { scatterEssence } from "../cards/FTC/actions/scatter-essence.ts";
import { deliveryDroid } from "../cards/PRD/allies/delivery-droid.ts";
import { cellGenerator } from "../cards/MRC/allies/cell-generator.ts";
import { mercilessToss } from "../cards/PRD/actions/merciless-toss.ts";
import { armoredValkyrie } from "../cards/SP4/allies/armored-valkyrie.ts";
import { keenTidebinder } from "../cards/PRD/allies/keen-tidebinder.ts";
import { sempiternalSage } from "../cards/AMB/allies/sempiternal-sage.ts";
import { intwinedBangle } from "../cards/AMB/items/intwined-bangle.ts";
import { dazzlingCourtesan } from "../cards/SP4/allies/dazzling-courtesan.ts";
import { rampartDefender } from "../cards/PRD/allies/rampart-defender.ts";
import { kingdomInformant } from "../cards/P22/allies/kingdom-informant.ts";
import { smackWithFlute } from "../cards/DOA/attacks/smack-with-flute.ts";
import { lesserBoonOfTerritories } from "../cards/PP1/boons/lesser-boon-of-territories.ts";
import { lavasoulTiger } from "../cards/AMB/allies/lavasoul-tiger.ts";
import { fiveOfDiamonds } from "../cards/RDO/allies/five-of-diamonds.ts";
import { spiritOfSereneWater } from "../cards/FTC/champions/spirit-of-serene-water.ts";
import { marksmansCharm } from "../cards/AMB/items/marksmans-charm.ts";
import { silvieEarthsTune } from "../cards/DOA/champions/silvie-earths-tune.ts";
import { tideDiviner } from "../cards/DOA/allies/tide-diviner.ts";
import { tidalFractal } from "../cards/PRD/phantasias/tidal-fractal.ts";
import { lesserBoonOfTimesPassage } from "../cards/PP1/boons/lesser-boon-of-times-passage.ts";
import { creepingTorment } from "../cards/ALC/phantasias/creeping-torment.ts";
import { luceniasReign } from "../cards/DTR/phantasias/lucenias-reign.ts";
import { radiantOriginOfTamer } from "../cards/RDO/phantasias/radiant-origin-of-tamer.ts";
import { adventOfTheStormcaller } from "../cards/DOA/actions/advent-of-the-stormcaller.ts";
import { bladedRiftseer } from "../cards/PTM/allies/bladed-riftseer.ts";
import { extractionIncision } from "../cards/AMB/attacks/extraction-incision.ts";
import { namelessChampionCm } from "../cards/AMB/champions/nameless-champion-cm.ts";
import { intangibleGeist } from "../cards/DOA/allies/intangible-geist.ts";
import { marchOn } from "../cards/SP4/attacks/march-on.ts";
import { astraSight } from "../cards/ALC/actions/astra-sight.ts";
import { greaterBoonOfIsis } from "../cards/PP1/boons/greater-boon-of-isis.ts";
import { executionersSpear } from "../cards/P24/weapons/executioners-spear.ts";
import { reversalsPolarity } from "../cards/RDO/phantasias/reversals-polarity.ts";
import { dwarfStarsGlow } from "../cards/RDO/actions/dwarf-stars-glow.ts";
import { greaterBoonOfShou } from "../cards/PP1/boons/greater-boon-of-shou.ts";
import { simpleSlime } from "../cards/RDO/allies/simple-slime.ts";
import { lightweaversAssault } from "../cards/DOA/actions/lightweavers-assault.ts";
import { mourningVeilbound } from "../cards/PTM/allies/mourning-veilbound.ts";
import { inflamedBladehand } from "../cards/PRD/allies/inflamed-bladehand.ts";

type GeneratedGrandArchiveCard = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;

const grandArchiveCardChunk0: readonly GeneratedGrandArchiveCard[] = [
  diaoChanEnchantress,
  hailstormGuard,
  arimaGaiasWings,
  namelessChampionAt,
  surgingBolt,
  veiledDash,
  takePoint,
  zhangHeCloakOfNight,
  sheathOfFacetedLapis,
  poisonedDagger,
  servilePossessions,
  malignantAthame,
  crimsonPrescience,
  corhaziArsonist,
  moteSear,
  babyGraySlime,
  kongmingEruditeStrategist,
  provokingStand,
  vanishingShot,
  scorchingStrafe,
  automataGenesis,
  wonderlandsReign,
  pangTongYoungPhoenix,
  bubbleMage,
  censerOfRestfulPeace,
  voltaicSphere,
  hiddenSecrets,
  guanYuPrimeExemplar,
  diablerie,
  foragingServant,
  hydroguardRetainer,
  evercurrentRaider,
  morriganLostSpirit,
  feuAwakening,
  floatingPeace,
  rapidCombustion,
  heirloomOfSpectra,
  strengthenTheBonds,
  unyieldingWraithguard,
  prudentNock,
  lavaplumeFatestone,
  liminalGuide,
  windyLeap,
  thunderclap,
  spiritOfSlime,
  emberslash,
  studyTheFables,
  lunarConduit,
  illuminateSecrets,
  speedPotion,
  scaleOfSouls,
  tenderheartGuard,
  shadowResonance,
  meteoricVolley,
  aeneanSwellingTides,
  vestalPriestess,
  focusedFlames,
  cracklingIncineration,
  overpoweringDefense,
  condensedSupernova,
  invigoration,
  provokeObstinance,
  pureCytosynth,
  imperialRifleman,
  intricateLongbow,
  nocturnesOblivion,
  revitalizingCleanse,
  explosiveRune,
  reverseAffliction,
  brackishLutist,
  explosiveFractal,
  threeOfHearts,
  gatherSlimes,
  winblessHurricaneFarm,
  fractalOfDuplication,
  exiaSight,
  shiraLostSpirit,
  fanaticalDevotee,
  ionizerXUltra,
  fleetfootFilly,
  wulinLancer,
  harbingerOfLightning,
  flamelashSubduer,
  sacrificePlay,
  shimmeringRefraction,
  devouringMalice,
  reflectedBlight,
  fightForTheCrown,
  protectiveFractal,
  waterHerbs,
  razorgaleCalling,
  aethercloakSentinel,
  evasiveManeuvers,
  blossomingDenial,
  windstreamMutt,
  frozenDivinity,
  imperialAccord,
  blueSlime,
  lamentationsToll,
  fragmentedSpiritOfWind,
];

const grandArchiveCardChunk1: readonly GeneratedGrandArchiveCard[] = [
  riptideSlash,
  mantleOfTheAbyss,
  hiddenEnclave,
  covenantOfThorns,
  carterSyntheticReaper,
  materializeTheSoul,
  recruitmentOfficer,
  lifeEssenceAmulet,
  breathsColoratura,
  gloweringConflagration,
  machinedMonstrosity,
  tetherInFlames,
  necklaceOfHindsight,
  condemnedTrinket,
  noviceMechanist,
  crowdguardsSlash,
  veteranBlazebearer,
  baubleOfScarcity,
  maledictumVitae,
  igniteFate,
  incineratedTemplar,
  glowForth,
  potionInfusionGrowth,
  straightFlare,
  indolentLeisure,
  nicoRapturesEmbrace,
  arondightAzureBlade,
  connivingPlans,
  roseEternalParagon,
  surreptitiousScheme,
  mapOfHiddenPassage,
  corhaziLightblade,
  dissonantFractal,
  drownedCut,
  delusionalVapors,
  imperiousGalebind,
  grandCrusadersRing,
  cloakOfStillwater,
  stormbladeSquire,
  elyanLustreLoyalty,
  smashWithObelisk,
  fleetingGuard,
  lesserBoonOfViscosity,
  strikingIlluminance,
  sealThePast,
  madHatterMoroseHeritor,
  unstableFractal,
  teraSight,
  crusaderOfAesa,
  mendcallMercy,
  reconnaissanceField,
  inertSword,
  fatestoneOfProgress,
  umbralTithe,
  merlinBrilliantVestige,
  alliedWarpriestess,
  takeCover,
  infernoSlime,
  veltechQaTester,
  blightheartThaumaturge,
  scepterOfAwakening,
  priscillaLostSpirit,
  ouraganSentinel,
  potionInfusionClarity,
  stavesXUltra,
  kongmingWaywardMaven,
  axisGaleScholar,
  stormOfThorns,
  nocturnalBlossom,
  naturesInsight,
  combatTraining,
  cyclicalBreeze,
  elysianTestSubject,
  veltechGearHoarder,
  lumenBorealis,
  savageAttack,
  absolvingFlames,
  nightmareCoil,
  aeneanCyclicWinds,
  broochXUltra,
  seekersRifle,
  fannedSynchron,
  fluvialFatestone,
  xiaoQiaoCinderkeeper,
  ordainedCharisma,
  cyclonicStrike,
  sliceAndDice,
  decompose,
  wildgrowthFeline,
  tidebreakerSentinel,
  currentGroover,
  maidenOfShimmeringAir,
  aquamirageWhisper,
  fastCure,
  carpsongCoda,
  spiritShard,
  krustallanArcher,
  fountainBladehand,
  resonantAether,
  cellVanguard,
];

const grandArchiveCardChunk2: readonly GeneratedGrandArchiveCard[] = [
  incendiaryShot,
  assassinsMantle,
  trainedHawk,
  galatineSwordOfSunlight,
  obelithEscort,
  vanitasDominusRex,
  waterloggedRanger,
  rampantBladehand,
  hailfinch,
  fractalOfRain,
  clockworkAmalgam,
  bloodseekerMagus,
  luminousQuartz,
  deflectingAdvantage,
  ghastlyCorrosion,
  polarisTwinklingCauldron,
  avalonCursedIsle,
  baidiOathswornPalace,
  surgingUndertow,
  feedNourishment,
  battlefieldSpotter,
  imperialPanzer,
  duxalProclamation,
  falseStep,
  scepterOfFascination,
  savageSlash,
  splashingSpearguard,
  extricatingTouch,
  quietusBlade,
  dawnOfAshes,
  cometfall,
  veiledOracle,
  gemOfSorority,
  corsairCaptain,
  tempestDownfall,
  ceasingEdict,
  danteHemomancer,
  rictusTiding,
  adornedStag,
  argusAllseeingGiant,
  songOfNurturing,
  rondoOfTheWind,
  featheryTune,
  grimForeboding,
  sunblessedGazelle,
  chillingTouch,
  eternalDreamer,
  ardentCloudstriker,
  treasureOfTheDepths,
  aqueousStallion,
  primordialRitual,
  staffOfBlossomingWill,
  jianyeDawnsKeep,
  oceansBlessing,
  cordeliaAurousKaiser,
  neosSight,
  exorcism,
  carefulStudy,
  theElysianAstrolabe,
  breakApart,
  veritaQueenOfHearts,
  snowFairy,
  floodbloom,
  excaliburCursedSword,
  frostlornCaress,
  tristanShadowreaver,
  hurricaneSweep,
  vengefulParamour,
  quietRefraction,
  pyroclasticFlow,
  keySlimePudding,
  tasershot,
  repellingPalmblast,
  bandersnatchFrumiousFoe,
  etherealAbsorption,
  uncoverThePlot,
  lesserBoonOfAstraeus,
  aeneanScorchingComet,
  wildheartLyre,
  royalBear,
  claudeFatedVisionary,
  insigniaOfTheCorhazi,
  peerBeyond,
  zhouYuEnlightenedSage,
  immaterialDissolution,
  skilledPlainsman,
  lesserBoonOfEnchantment,
  kraalStonescaleTyrant,
  tableStraight,
  skilledAerotheurge,
  vampiricSlime,
  guoJiaBlessedScion,
  flamewingFowl,
  slimeSwarm,
  ventusStaffOfZephyrs,
  nicoWhiplashAllure,
  mandateOfHonor,
  redHareUnrivaledStallion,
  cureTheFlesh,
  fractalOfPolarDepths,
];

const grandArchiveCardChunk3: readonly GeneratedGrandArchiveCard[] = [
  utherIllustriousKing,
  hoarfrostSpine,
  exquisiteDessert,
  tideholderClaymore,
  shredToRibbons,
  luccaGatewayManager,
  manaroot,
  blancheShelteringSaint,
  amorphousStrike,
  fortifiedManaShield,
  breakwaterCadet,
  discordiaHarpOfMalice,
  savageSunder,
  direwolfAlpha,
  fractalOfSparks,
  coupDeGrace,
  seasideRangefinder,
  jinZealousMaverick,
  gloriousPresence,
  underFire,
  whirlwindVizier,
  summonSentinels,
  suspiciousConcoction,
  effluveGuard,
  butlersAugury,
  snowWhiteWeissQueen,
  dusklightCommunion,
  suzakusCommand,
  veltechArmiger,
  shadowsTwin,
  maidenOfReverentGale,
  floodborneSwing,
  fullBloom,
  plantedExplosive,
  seethingIntercession,
  cardiacVessel,
  meteoricSlime,
  flameboltArbalist,
  airshipCruiser,
  babySilverSlime,
  twilightSlime,
  floodwardSergeant,
  imperiousHighlander,
  airshipEngineer,
  avatarOfGenbu,
  reflectTheSkies,
  springleaf,
  nascentBarrier,
  fabledAzuriteFatestone,
  illuminatingCharge,
  rainwovenCrysalis,
  hornOfBeastcalling,
  treacleDrownedMouse,
  surgedCoordinator,
  destinedEncounter,
  refractingMissile,
  fortification,
  iceboundSlam,
  trivariateDream,
  demonsAim,
  weaponsmith,
  shrivelingVines,
  fatalTimepiece,
  gloamspireSniper,
  razeTheLand,
  grandeAiguille,
  slipstreamVault,
  raiManaWeaver,
  glacialGuidance,
  peerTheDepths,
  teasingAerocharge,
  portsidePirate,
  potionInfusionStarlight,
  merlinMemoriteVassal,
  tempestuousConviction,
  lacunarityGuide,
  rosewingedHollow,
  aeneanFlurryOfFire,
  conduitOfTheMadMage,
  cooktechKnife,
  slayTheKing,
  chimeOfEndlessDreams,
  bloodshroudTemper,
  woodlandSquirrels,
  stokedSlice,
  soakedSlash,
  channelTheWind,
  rivetingWinds,
  accelerate,
  cleanCut,
  blightheartAdept,
  vigilantSentry,
  windwalkerBoots,
  gwendolynSpiritOfWind,
  cavalierRescue,
  benevolentBattlePriest,
  amorphousMissile,
  acerbica,
  fulguriteCoordinator,
  verdigrisDecree,
];

const grandArchiveCardChunk4: readonly GeneratedGrandArchiveCard[] = [
  mercurialHeart,
  freydisMasterTactician,
  incarnateMajesty,
  arisannaLucentArbiter,
  soultraceTessellation,
  concealedMarksman,
  ministerOfCeremony,
  profaneBindings,
  alacritousHuntress,
  demolition,
  mireReparation,
  gencodeWomb,
  polearmedSteed,
  abnegation,
  lavastorm,
  forgetfulConcoction,
  aethericCalibration,
  captivatingCutthroat,
  forgedScalemail,
  seepIntoTheMind,
  bandOfBurningVerdict,
  etherealysPromise,
  syntheticStrike,
  refreshChamber,
  heartOfTheFrost,
  ferventBeastmaster,
  dianaDeadlyDuelist,
  moltenImpact,
  summonRetinue,
  pairedMindsKindredSouls,
  sinfoniaOfHope,
  transfusiveAura,
  spiritBladeDispersion,
  thievingCut,
  increasingDanger,
  fortifyingManashot,
  tactfulSergeant,
  juggleKnives,
  marchHareMottledHost,
  signaltechOne,
  brissaSpiritOfWind,
  verdantScepter,
  lakereavingChill,
  kongmingFelEidolon,
  dahliaIdyllicDreamer,
  focusingRound,
  markOfFervor,
  atmosShield,
  lorraineAscendantWings,
  quadrillesGryphon,
  trainedBirdroid,
  danteAeneanInitiate,
  sunderingMoon,
  namelessChampionAc,
  chibiBattleOfRedCliffs,
  smashingForce,
  seekingShot,
  lycoria,
  beastsoulVisage,
  potionInfusionBlaze,
  fertileGrounds,
  fourOfSpades,
  shardwingSearchlight,
  prototypeStaff,
  lostWisdom,
  polkhawkBoisterousRiot,
  ironHaloForcefieldNode,
  galewindScout,
  coreFractal,
  spurredGallop,
  contrabandRevolver,
  navigateTheStreets,
  bulwarkSword,
  vaporjetShieldbearer,
  vanitasConvergentRuin,
  spiritOfFortuitousFire,
  aquiferSeneschal,
  sableRemnant,
  conceal,
  journeysBeginning,
  foundPower,
  frozenDismissal,
  beseechTheWinds,
  krustallanPatrol,
  hireMercenaries,
  loadSoul,
  lurchingRogue,
  gloamspireLance,
  dynasticWhirlpool,
  assassinsRipper,
  evanescentWinds,
  peerIntoMana,
  infusionOfCrescentJade,
  angelAttendant,
  anotherRound,
  lesserBoonOfFlock,
  guanduTheaterOfWar,
  crimsonProtectiveTrinket,
  unearthRevelations,
  penetratorRound,
];

const grandArchiveCardChunk5: readonly GeneratedGrandArchiveCard[] = [
  namelessChampionTw,
  exposeDarkness,
  halcyonPrism,
  spellshieldWind,
  crystallineMirror,
  brooksideScout,
  wujiOfLingeringFate,
  tabulaOfSalvage,
  marksmanCaptain,
  reboundingGust,
  arrestLightning,
  swornWindhand,
  apprenticeAeromancer,
  dragonsDawn,
  acheronExpressOfficer,
  queensCinderhog,
  empoweringTincture,
  babyBlueSlime,
  limitlessDefiance,
  backupCharger,
  cramSession,
  lesserBoonOfApollo,
  mindbreakBullet,
  aliceWhimsMonarch,
  slimecallCyclone,
  keeperOfTheWild,
  mastermindScheme,
  generalAtArms,
  pridesVanguard,
  briarsSpindle,
  varuckanSoulknife,
  bandageWound,
  crimsonTear,
  clashOfFates,
  namelessChampionMr,
  royalLineDefense,
  prismaticSanctuary,
  incantationOfProsperity,
  expelTheDeparted,
  mementoMori,
  portlyRaccoon,
  kongmingAsceticVice,
  covertManipulator,
  blessedClergy,
  sunglorySentinel,
  cheapSword,
  varuckanAcolyte,
  liuBeiOathkeeper,
  labyrinthJeweledOpus,
  spiritedFalconer,
  perilousMend,
  resplendentKiteShield,
  redirectFlow,
  bloomSummersGlow,
  swordSaintOfEveswind,
  slateWhetstone,
  sinkIntoOblivion,
  manaflareBarrage,
  exhilaratingPlume,
  flametechBladecore,
  aegisOfDawn,
  judasClaretIntercessor,
  formidableYouxia,
  hubOfInnovation,
  overwhelmingSwing,
  lawsurTheCarpenter,
  orbOfHubris,
  rapidDeploymentNexus,
  returnToTheArchive,
  scientificDiscoveries,
  scorchingImperilment,
  slimeParty,
  jewelOfEnlightenment,
  effigyOfGaia,
  anotherBeginning,
  wildernessHarpist,
  angelicVanguard,
  grimPastiche,
  scathingSeminary,
  fatestoneOfHeaven,
  chargedMannequin,
  flashfireHorse,
  flourishingRestoration,
  strikeOfSingularity,
  powerOverwhelming,
  yunzhouCavalry,
  twistedVerdict,
  standFast,
  steelSlug,
  healingAura,
  lesserBoonOfRevelry,
  stockedOutpost,
  humptyDumptyFatesFall,
  safeguardParagon,
  danteProdigalSwain,
  sojournersHunt,
  namelessChampionGm,
  hectorPraetorianGuard,
  greaterBoonOfHorses,
  devastatingBlow,
];

const grandArchiveCardChunk6: readonly GeneratedGrandArchiveCard[] = [
  suddenDeluge,
  ceremonialStormblade,
  carnwennanShroudedEdge,
  productionCrawldroid,
  aetherwingsWard,
  driftingRogue,
  dormouseInformant,
  ferventLancer,
  legendarySaddle,
  edelsteinQueenOfDiamonds,
  chargerXUltra,
  epicureanInstitute,
  spiritOfChess,
  primalWhip,
  biseBlade,
  guidedStarlight,
  trainingSword,
  foragingFox,
  goldenGambit,
  dematerialize,
  convokingSlime,
  sunJianWolvesbane,
  cosmicAlignment,
  arisannaHerbalistProdigy,
  amelioratingMantra,
  refurbish,
  bloomWintersChill,
  namelessChampionCr,
  ashFilcher,
  liquidation,
  floodwardSteed,
  nurielSeraphicPaladin,
  noviceHealer,
  greaterBoonOfAstraeus,
  splashingPerch,
  ritaiStablemaster,
  caliburnOfSilencing,
  serumOfWisdom,
  weakenResistance,
  mobVantage,
  subjugatingLash,
  silvershine,
  frostbittenEtui,
  babySlime,
  theDuchesssThornes,
  seekersAetherwing,
  extortingBlackjack,
  lesserBoonOfNotus,
  plutusFortunesFavor,
  rowlandSchwartzKnight,
  windResonanceBauble,
  trickyChimps,
  lesserBoonOfProxia,
  tristanUnderhanded,
  deployGunshield,
  forestCake,
  jovialTinkerer,
  arcaneDisposition,
  stormSlime,
  bloodbondBladesworn,
  firebloodedOath,
  empoweringEnlightenment,
  foreseFervidCantor,
  goldenMeasurePatisserie,
  creativeShock,
  cityProtector,
  displace,
  skirtingStep,
  sharpenBlade,
  siegeMauler,
  alchemistsCauldron,
  aeneanPointedFlare,
  stargazersPortent,
  prideOfDemiourgos,
  dissuadingAether,
  hiddenLongbowman,
  reliableCavalier,
  orbOfRegret,
  imperialSeal,
  stiflingAethercharge,
  topsyDecree,
  indiscriminateGyre,
  liturgyOfCorruption,
  harnessLightning,
  seafaringMercenary,
  krustallanDistiller,
  moonveilAndroid,
  silverSoldier,
  jueyingShadowmare,
  everlongingThorns,
  tidalLock,
  stabilizingCapacitance,
  jinUndyingResolve,
  adventOfTheShenju,
  sunQuanSealbearer,
  sylphsEnvelopment,
  palatialConcourse,
  mistboundCutthroat,
  aquatechShield,
  allianceGearshield,
];

const grandArchiveCardChunk7: readonly GeneratedGrandArchiveCard[] = [
  flamewreathCall,
  determinedSpearman,
  awakenedDeacon,
  unruledBereavement,
  coriolisWard,
  pridesSmith,
  furnaceDrone,
  stabilizingBladecore,
  inquisitiveMagician,
  ghostsightGlass,
  driftingAbysshell,
  fulminatingStorm,
  heftyHammering,
  lostSpirit,
  fractalOfIntrusion,
  sighingCrownwing,
  leranPastoralHymns,
  spiritBladeInfusion,
  organizeTheAlliance,
  defendersMaul,
  impactHammer,
  shieldFragmentation,
  tuneUp,
  berserkerPlate,
  exsanguinatingWallop,
  escharotomy,
  buffetingHurricane,
  volnia,
  counterInterference,
  peacockOfProsperity,
  bellonasRunestone,
  rhongomiantGrovesSpire,
  aeneanSparkAlight,
  gustmarkGauge,
  votiveRuneblade,
  turboCharge,
  suffocatingMiasma,
  fracturize,
  spiritBladeEnsoul,
  babyGreenSlime,
  spontaneousCombustion,
  squallsnare,
  refabrication,
  ombreuxChevalier,
  strappingConscript,
  spellshieldExia,
  glacialBinding,
  cheshireCatImpishGrin,
  meadowbloomDryad,
  patientRogue,
  piquantShieldbearer,
  lesserBoonOfNuwa,
  honorableVanguard,
  whimsysWarden,
  flawlessSpiritOfMordred,
  fractalOfRefreshment,
  krustallanLongsword,
  quicksilverGrail,
  cultivate,
  hypothermia,
  chasingShadows,
  prismaticCodex,
  dorumegianFoundry,
  heartsongReclamation,
  phantasmagoria,
  eightOfSpades,
  setAblaze,
  airshipCannoneer,
  caoCaoAspirantOfChaos,
  beseechingFlourish,
  obeliskOfProtection,
  suffocatingAsh,
  bannerOfAres,
  polishingFlourish,
  diaoChanIdyllCorsage,
  batheInLight,
  spiritOfSereneFire,
  aliceGoldenQueen,
  eruptingRhapsody,
  shroudInMist,
  rearingRebound,
  slimeCalling,
  purifiedShot,
  kindlingFlare,
  aeneanReclaim,
  deathEssenceAmulet,
  seasonsEnd,
  sleightOfHand,
  conductiveStrike,
  evasivePositioning,
  gentleRespite,
  offWithHerHead,
  apotheosisRite,
  essenceCrucible,
  moltenCinder,
  enhancePotency,
  ingressOfSanguineIre,
  weissBishop,
  sweetAmbrosia,
  strikeFromTheMist,
];

const grandArchiveCardChunk8: readonly GeneratedGrandArchiveCard[] = [
  arcanistsPrism,
  devisedConspiracy,
  captainArcher,
  goldenKnight,
  chanceSevenOfSpades,
  besiegedSlash,
  warMarshal,
  atmosArmorTypeHermes,
  winblessForecaster,
  swordOfAvarice,
  crystalOfEmpowerment,
  lostProvidence,
  hoarfrostHold,
  greaterBoonOfRosen,
  dynastyChancellor,
  fortifyingAroma,
  radiantOriginOfMage,
  lorraineWanderingWarrior,
  merlinAmethystsGlow,
  swordOfAdversity,
  relicOfSunkenPast,
  erraticBolt,
  heirloomOfNatura,
  foresightLens,
  favorableWinds,
  hastyMessenger,
  waterResonanceBauble,
  floralArrangement,
  spectralHaunting,
  soutirerVortex,
  diluAuspiciousCharger,
  gawainChivalrousThief,
  lostBeing,
  sorrowcaller,
  bellOfTheChosen,
  vernalTalisman,
  meteorStrike,
  cosmicFocus,
  austerePriestess,
  brewingKit,
  trineRecursion,
  suddenSnow,
  recklessResearcher,
  glimmerEssenceAmulet,
  springCleaning,
  myopicLens,
  tomeOfIgnorance,
  swordOfSeeking,
  vertusGaiasRoar,
  equanimitysAshes,
  ticketToTheAfterlife,
  edgeOfTomorrow,
  windfallCheck,
  sinistreStab,
  astralSeal,
  poisonousBreezecap,
  dianaKeenHuntress,
  blazingCindercharge,
  scepterOfLumina,
  reverentSeraphim,
  gunsmithsArsenal,
  armedSquallguard,
  restorativeSlash,
  twoOfSpades,
  blastShield,
  loneGunslinger,
  gildedPyre,
  madTeaParty,
  aithneSpiritOfFire,
  cellwardenDroid,
  channelingStone,
  scorchingKnowledge,
  aeneanCyclone,
  voldaSmoldersSpite,
  azraelArchangelOfMateria,
  enhanceHearing,
  lightTheHunt,
  trainingDummy,
  crumblingReign,
  mirrordepthsBlade,
  eventideLure,
  lostInThought,
  stalwartShieldmate,
  senarisSixOfDiamonds,
  seasideRingleader,
  gearshiftBlock,
  lustrousSlime,
  boltOfDiamonds,
  direRequiem,
  restorativeFlame,
  ardusFloodborneDeacon,
  finalStroke,
  spiritedNeophyte,
  zhangJiaoWayOfPeace,
  dungeonGuide,
  slimeNexus,
  alicePhantomMonarch,
  drenchingFinish,
  guoJiaHeavensFavored,
  galahadCourtKnight,
];

const grandArchiveCardChunk9: readonly GeneratedGrandArchiveCard[] = [
  astralShard,
  squallbindPounce,
  xukongShiftedFates,
  conduitOfBloodfire,
  stardustOracle,
  cellConverter,
  stormTyrantsEye,
  warriorOfTheFaeRealm,
  spurnToAsh,
  conjuringFluorescence,
  drawnBlade,
  cellSharpshooter,
  strategicPlanning,
  unmooredCall,
  alchemistsKit,
  equipWithCourage,
  tweedledeeContrarianPoet,
  vacuousCall,
  deadlyOpportunist,
  allowanceRace,
  galvanizingGale,
  wildheartHymn,
  astarteCelestialDawn,
  mementoPocketwatch,
  slimeKing,
  umbraSight,
  fulminatorRisingStorm,
  beastbondPaws,
  slySongstress,
  reclaim,
  namelessChampionCw,
  servantsObligation,
  oathbreakersJustice,
  spellwardScepter,
  poweredSwordsman,
  turbulentBullet,
  scryTheSkies,
  primevalRitual,
  rangerBoots,
  frogletFootman,
  zanderDeftExecutor,
  trustySteed,
  memoriteObelith,
  scavengingRaccoon,
  musicAficionado,
  bannerRaccoon,
  krustallanRuins,
  martialFlowstate,
  obscuringThreads,
  chargedAssailant,
  freezingGambit,
  flameSweep,
  disintegrate,
  candlelightHourglass,
  luciaReclaimedBlight,
  lesserBoonOfRosen,
  capacitanceXPsycho,
  artOfWar,
  ashenRiffle,
  iridescentResurgence,
  aeneanFrozenShunt,
  galesMare,
  theLookingGlass,
  moontideIllusionist,
  manxomeArmoire,
  aqueousEnchanting,
  returnToTheDepths,
  restoringEmbers,
  gloamspireMantle,
  namelessChampionRw,
  auravoltCurrent,
  rustedWarshield,
  glimmeringRefusal,
  inspiringAethercharge,
  poweredArmsmaster,
  hotCake,
  graveGateau,
  arielArchangelOfNatura,
  sageProtection,
  avatarOfGaia,
  flickeringCinder,
  prototypePistol,
  signalGunner,
  veteranAerotheurge,
  spiritOfPurity,
  pendantOfApsisRestraint,
  raisedSlash,
  tidestoneSeeker,
  phantomVeil,
  steelHalberd,
  seasonedArcher,
  maChaoLupineHuntress,
  cryogenicRitual,
  sparkFairy,
  venerableSage,
  kazeSpiritOfWind,
  performanceEnthusiast,
  dewdropHares,
  prismaticEdge,
  theEternalKingdom,
];

const grandArchiveCardChunk10: readonly GeneratedGrandArchiveCard[] = [
  magusInitiate,
  windmillEngineer,
  heatwaveGenerator,
  greaterBoonOfEnki,
  bloodDragonsPact,
  harnessMana,
  sigilOfBuddingEmbers,
  royalOathguard,
  trainingSession,
  artificersOpus,
  bottledForgelight,
  collectJunk,
  deflectingEdge,
  aellaZephyrsHand,
  consumptionRing,
  raiStormSeer,
  gildasFaeswornMonarch,
  aphoticRuin,
  vanishingEclipse,
  renascentSharpshooter,
  xiaHouDunGloryseeker,
  dodgeRoll,
  hydrocaskDroid,
  soothingDisillusion,
  noxFinalRelease,
  eminentLethargy,
  lesserBoonOfVeilara,
  sinonBabeliasCompanion,
  aliceDistortedQueen,
  recklessConversion,
  keepOfTheGoldenSashes,
  arthurYoungHeir,
  revitalizerXUltra,
  silvieLovedByAll,
  blazingDirewolf,
  lesserBoonOfIsis,
  blastshotPump,
  wornDiary,
  echoicGuard,
  lostPromises,
  drownInAether,
  solarProvidence,
  harmoniousMantra,
  soothingPotion,
  elucidatePlans,
  dinahLostSpirit,
  raiSpellcrafter,
  crowdsFavor,
  combustiblePotion,
  lureTheAbyss,
  spiritOfFortuitousWind,
  aeneanWard,
  epochalConqueror,
  ignitedStab,
  chainedCharge,
  sashaPurifyingAcolyte,
  armedAndDangerous,
  zanderCorhazisChosen,
  fieryInterference,
  tristanHiredBlade,
  tidalSweep,
  ominousShadow,
  shoutAtYourPets,
  perfectRepulsion,
  lenaDorumegiasHerald,
  starstrungReading,
  rebelliousBull,
  bedlamBorough,
  gossamerStaff,
  bannerSlime,
  seafletchedSerpent,
  surgingSearch,
  nefariousTimepiece,
  temporalSpectrometer,
  distilledAtrophy,
  dianWeiValorantFury,
  promisingRecruit,
  rougeAceOfHearts,
  turbulentBountyHunter,
  crescentGlaive,
  craggyFatestone,
  spiritOfSereneWind,
  torpidFractal,
  alchemicalScripture,
  overchargedDroid,
  ischemicSoldier,
  blightedJewel,
  maidenOfPrimalVirtue,
  slimeshield,
  battlefieldBenediction,
  intensifiedPyre,
  crystalAccretion,
  cemeterySentry,
  searingRebuke,
  tristanShadowdancer,
  aesanProtector,
  loadedThoughts,
  elysianAspirant,
  blackmarketBroker,
  unstableVoltage,
];

const grandArchiveCardChunk11: readonly GeneratedGrandArchiveCard[] = [
  hideInBush,
  grayWolf,
  deepSeaFractal,
  aurousteelGreatsword,
  foldedShadows,
  pearledPrayer,
  baubleOfMending,
  shiftingMirage,
  dyadicFletcher,
  scorchedConquest,
  convergentBeam,
  windpiercer,
  imperialCountermeasure,
  leechingBolt,
  bestialFrenzy,
  meltdown,
  spiritBladeRetribution,
  smolderingCook,
  secondWind,
  windsOfRetribution,
  shadeStriker,
  mistResonance,
  tempestSilverback,
  breezyLooper,
  veiledGambit,
  unbridledFlare,
  exploitVulnerability,
  sacredBarrier,
  tempestuousSeraphim,
  diamondInTheRough,
  blightroot,
  weightOfLookingUp,
  strategicWarfare,
  protectorsPlate,
  brashDefender,
  nimbleCourtAssassin,
  towerOfDis,
  baihua,
  automatonBeastkeeper,
  zephyrsEdge,
  savageSmash,
  coneOfFrost,
  relicOfDancingEmbers,
  fiveOfSpades,
  esteemedKnight,
  bannerKnight,
  weissKnight,
  lumberingSteed,
  manaLimiter,
  goldenRook,
  unrelentingWarden,
  sinisterComposure,
  strategemOfMyriadIce,
  libraryWitch,
  zephyr,
  enfeebledDagger,
  fiveOfHearts,
  fangOfDragonsBreath,
  chargedHunter,
  safeguardPaladin,
  attuneWithTheWinds,
  incendiaryFractal,
  tomeOfAbyssalHeaven,
  gloamspireProwler,
  anathemasEnd,
  eyeOfArgus,
  fierySwing,
  triskitGuidanceAngel,
  focalIntensity,
  excitableRaccoon,
  ninjaTabi,
  baguaOfVitalDemise,
  alizarinLongbowman,
  memoryInvocation,
  blazingThrow,
  sanctifiedPaladin,
  eminentCommander,
  slimesBlessing,
  ceruleanDecree,
  engulf,
  fieryWarcry,
  crystallineReality,
  dianaDuskstalker,
  frozenQuill,
  bladeOfCreation,
  genuflectingExecution,
  pleaForPeace,
  brusqueNeige,
  flashGrenade,
  felicitousFlock,
  cloakedExecutioner,
  legionsWingspan,
  nobleDissolution,
  dauntlessAssault,
  recurringInvocation,
  varuckSmolderingSpire,
  blazeAlight,
  frozenNova,
  threeOfDiamonds,
  companionFatestone,
];

const grandArchiveCardChunk12: readonly GeneratedGrandArchiveCard[] = [
  menagerieBeastbonder,
  torchMarshal,
  celestialCalling,
  siphoningStab,
  rollingChorus,
  lesserBoonOfFractals,
  accursedStrength,
  mechanicalHare,
  siphoningFractal,
  quickdrawPiercer,
  firetongue,
  opticalControl,
  crystalOfArgus,
  sentinelFabricator,
  guoJiaChosenDisciple,
  flammeSorcel,
  namelessChampionGw,
  sleetyRetreat,
  oppressivePresence,
  gateOfAlterity,
  stellarCosmos,
  faunaFriend,
  gildasChroniclerOfAesa,
  ritaiGuard,
  lightveilAgent,
  naiaDivinerOfFortunes,
  thronekeeperBullfrog,
  windriderVanguard,
  rangerHealerAlly,
  direwolf,
  protectorRaccoon,
  warriorsLongsword,
  stellarBloom,
  aeneanGutteringFlames,
  baguaOfCardinalFate,
  crystalveinAwakening,
  sneakyRaccoon,
  enervatingDecay,
  avatarOfSuzaku,
  genbusCommand,
  manifestThreat,
  namelessChampionAr,
  eagerPage,
  ravishingFinale,
  whereFuturesStir,
  greaterBoonOfVritra,
  longtailGrovesward,
  razorvine,
  frostShard,
  haloclineScout,
  scatteringGusts,
  sinisterMindreaver,
  beastbondEars,
  lesserBoonOfAwilix,
  embryonicHemosynth,
  shadedDoppelganger,
  clandestineChart,
  findTheLost,
  galedErasure,
  mendFlesh,
  lesserBoonOfAllurement,
  slimeTotem,
  lagomorphPiece,
  neosElemental,
  guerrillaAdvantage,
  chargedManaplate,
  beguilingBandit,
  fabledEmeraldFatestone,
  hulkingRearguard,
  kindBeastcaller,
  liquidAmnesia,
  auspiciousFeast,
  mercenarysBlade,
  teardropDiadem,
  essenceOfBlizzards,
  valiantProtector,
  frigidBash,
  embercryptBurn,
  sanctumOfEsotericTruth,
  fountSeraphim,
  washuru,
  bleuAceOfDiamonds,
  tristanGrimStalker,
  droppedBand,
  updraftSlice,
  protoKeyCrest,
  horseArcher,
  inspiringCall,
  namelessChampionMt,
  namelessChampionCg,
  purification,
  palaceGuard,
  fanOfSevenDebts,
  morganSoulGuide,
  fragmentedSpiritOfWater,
  goldenCheckmate,
  empoweringHarmony,
  creativeTinder,
  lungeOfEvokingWinds,
  augustineVotaryOfYore,
];

const grandArchiveCardChunk13: readonly GeneratedGrandArchiveCard[] = [
  tinderedSoldier,
  rousingSlime,
  lesserBoonOfVritra,
  recursiveConfidant,
  floodborneWarrior,
  rhesusEradication,
  torchingReach,
  berthaSpryHowitzer,
  clarentReimagined,
  packageCourier,
  apothecarysHarvest,
  academyGuide,
  surveillanceStone,
  verdantSlime,
  engineeredSlime,
  benedictionAngel,
  greaterBoonOfLuxera,
  deploymentBeacon,
  elusiveHeadhunter,
  changbanHeroicImpasse,
  beltedTune,
  veilingBreeze,
  luminousSurge,
  mordredFatedLuminary,
  lakesideSerpent,
  glassgaleFlock,
  bushwhackBandit,
  pristineScourge,
  forgelightShieldmaiden,
  regalInquisition,
  heavySwing,
  envelopingSoulmist,
  tidalTirade,
  protoArchiveScout,
  channelManifoldDesire,
  giantTortoise,
  taijiOfCrystalStrategems,
  protectiveHelm,
  chargedDirective,
  crystallizedDestiny,
  byakkosCommand,
  nimueCursedTouch,
  seizeFate,
  cyclonicFatestone,
  prodigiousBurstmage,
  musicalCurator,
  vacuousServant,
  imperialSpy,
  platedBullet,
  revealingMesmer,
  lilyMarineCastellan,
  convalescentTonic,
  lesserBoonOfDistance,
  yudiGossamerJade,
  mindFreeze,
  sparkAlight,
  shilowenPeacefulBeginnings,
  shieldOfParvati,
  hydratingFractal,
  namelessChampion,
  spectralDiffusion,
  waterfallSage,
  gearstrideGloves,
  woolBrook,
  mistralRanger,
  pepperedChef,
  scarsOfOld,
  goldenPawn,
  purifyingThurible,
  catalepticConstellation,
  cinderbloomTender,
  ghostHunter,
  psychopompsGale,
  possessedRemnant,
  supplyDrone,
  orbOfChokingFumes,
  spiritOfFire,
  fraternalGarrison,
  foretoldBloom,
  shiningMarchador,
  stillwaterPatrol,
  illusoryArmsmaster,
  vyraSpiritOfFire,
  chargeStatic,
  draughtOfStamina,
  swordSaintOfEverflame,
  necklaceOfForesight,
  radiantOriginOfWarrior,
  dongZhouFalseLiege,
  fireResonanceBauble,
  markTheTarget,
  excoriate,
  bishopsCross,
  silvergaleMonstrositysCall,
  arisannaMasterAlchemist,
  reliableBlade,
  fieryMomentum,
  businessCard,
  swordSaintOfEventide,
  wisdomsReprise,
];

const grandArchiveCardChunk14: readonly GeneratedGrandArchiveCard[] = [
  diamondRibbon,
  sunCeWeaponsmaster,
  calamityCannon,
  reconnaissanceScout,
  windriderInvoker,
  memoriteShardwing,
  gearstrideAcademy,
  forgelightBlade,
  flameboundDraug,
  clumsyApprentice,
  windspireCrest,
  firetunedAutomaton,
  imperialRecruit,
  clarentSwordOfPeace,
  volatileFusilier,
  reckoningsWake,
  azureProtectiveTrinket,
  slimeEruption,
  academyAttendant,
  jinzhuoBandsOfVirtue,
  winblessArbalest,
  blackIceSpellweaver,
  queenPiece,
  misteyeArcher,
  rococoExplosiveMaven,
  cellProduction,
  dianaAetherDilettante,
  discipleOfTheWaves,
  mistboundWatcher,
  obsequiousBlow,
  briskWindtrotter,
  portentousTanggu,
  bidingEndroid,
  callThePack,
  nurtureCrops,
  sealedBladeDoa,
  flourishingQi,
  silvieSlimeSovereign,
  refractedTwilight,
  impassionedTutor,
  orbOfSealing,
  proofOfLife,
  backdash,
  danteHematicOverdrive,
  recurringAethercharge,
  prismspireScepter,
  enthrallingChime,
  swiftRecruit,
  namelessChampionRt,
  bifurcatingFractal,
  poisedStrike,
  rootsOfTomorrow,
  thanatoticHemosynth,
  astromechAttendant,
  harrowTheSaved,
  enragedBoars,
  awakenedFrostguard,
  sanguineGoblet,
  salamandersBreath,
  assembleTheAncients,
  glacialEvocation,
  heirloomOfLibra,
  stellarionShift,
  samaritansReach,
  reciprocityDorumegiasCall,
  anointedPurifier,
  maryAnnMaladroitMaid,
  gusttechShield,
  redSlime,
  automatonDrone,
  otherworldlyPossessions,
  welcomeMerriment,
  moltenArrow,
  flamelashBeastmaster,
  imperialAssassin,
  zhaoYunDragonsblood,
  songOfReturn,
  seaspriteDiver,
  potionInfusionFrostbite,
  tomeOfSacredLightning,
  razorbladeExecution,
  burnishedObelith,
  fabledRubyFatestone,
  greaterBoonOfDetachment,
  twoOfDiamonds,
  pupilOfSacredFlames,
  etherealSlime,
  bolsterRanks,
  zinnVolniaAbbess,
  spiritBladeAscension,
  wandOfFrost,
  viciousSlice,
  shatterfallKeep,
  tonorisCreationsWill,
  lorraineSpiritRuler,
  chronowarp,
  nagasFang,
  gearHaul,
  fairyWhispers,
  geldusTerrorOfDorumegia,
];

const grandArchiveCardChunk15: readonly GeneratedGrandArchiveCard[] = [
  recklessSlash,
  numinousMonk,
  lesserBoonOfAgni,
  poweredSentinel,
  aeneanSwellingGusts,
  lesserBoonOfEtherealys,
  tidewallSentinel,
  shadebloodCoating,
  potionInfusionVolatility,
  sevenOfHearts,
  potionInfusionAnimate,
  tributeSinger,
  greaterBoonOfTheUnderdog,
  lorraineCruxKnight,
  queensGambit,
  windsOfDestiny,
  aeneanCryosalvo,
  lesserBoonOfParvati,
  cryForHelp,
  lesserBoonOfScriveners,
  perseRelentlessRaptor,
  perdition,
  silvieWithThePack,
  confidantsOath,
  wutheringSforzando,
  conduitOfSeasons,
  spellshieldAstra,
  cielLoyalValet,
  catoMeadowsChanneler,
  skeweringAdvance,
  namelessChampionGt,
  uncannyRealization,
  photicBlade,
  imperialScout,
  demonsBargain,
  everflameStaff,
  martialGuard,
  invigoratingConcoction,
  fourOfDiamonds,
  dewySlime,
  acolyteOfCultivation,
  penumbralWaltz,
  attuneWithFlames,
  hazeDroid,
  alphaPhilterbeast,
  youngBeastbonder,
  aeneanFrostlance,
  rousingRattleDrum,
  naturalOrder,
  findRecipe,
  trivialTrinket,
  geminiStarbearer,
  constellationsBlessing,
  memoriteBlade,
  claimedFromBeyond,
  threeOfSpades,
  slashAndBurn,
  dianaCursebreaker,
  jadelightProtector,
  shadowstrike,
  distilledWater,
  fatestoneOfUnrelenting,
  angelicChanneling,
  scorchfireAssassin,
  totalWhiteout,
  cielOmenbringer,
  reprogram,
  resoluteStand,
  courtsideBeastkeeper,
  lotorTrinket,
  diffusiveBlock,
  lavaheatedBrew,
  stiflingGyre,
  aeneanFluxGenerator,
  radiantVega,
  rotundSquirrel,
  falseTidings,
  magebaneLash,
  tailwindsBlessing,
  overflowTheBarrow,
  naturesAppeal,
  cooktechApron,
  tyrannicalDenigration,
  crestOfTheAlliance,
  hymnOfGaiasGrace,
  sparklingAdornment,
  refreshingSlice,
  advantageousPerch,
  potionInfusionSeal,
  wispsProtection,
  relentlessOutburst,
  slipAway,
  poisonedCoatingOil,
  piccardaNightRider,
  staggeringStrike,
  resonatingFugue,
  priestessOfFlame,
  winblessLookout,
  possessedReaping,
  batteryCoreX,
];

const grandArchiveCardChunk16: readonly GeneratedGrandArchiveCard[] = [
  bombardFlarecannon,
  shadecursedHunter,
  doubledPawns,
  lesserBoonOfSwordSaint,
  fledgling,
  inzaliUnshackledBlaze,
  tricastlesOfLucenia,
  cheerfulSlime,
  regalExpulsion,
  awakenOmbre,
  retoldFortune,
  corrosiveJuggler,
  mordredBurnishedAvenger,
  miasmicFog,
  powerforgedBurst,
  duplicitousReplication,
  flagrantGuide,
  cunningBroker,
  balefulOblation,
  pouvoirAbsolu,
  desperateDive,
  scryTheStars,
  greaterBoonOfInari,
  protectHerAtAllCosts,
  razielArchangelOfLibra,
  chillToTheBone,
  devotedMartyr,
  spirelleSchwartzQueen,
  ordinaryBear,
  frameworkSidearm,
  exaltedDorumegianThrone,
  barterHerbs,
  modulatingCadence,
  wanderingGlaivier,
  moltenEcho,
  orbOfGlitter,
  whirlwindThreads,
  merlinSurrealFigment,
  lesserBoonOfKanaloa,
  cruxSight,
  intrepidSpearman,
  fellowshipsGale,
  plasmatechBlaster,
  nightframeHoundsBike,
  chamberOfReflections,
  viridescentAetherstreak,
  vigilRempart,
  innervateKnowledge,
  innocuousDisposer,
  altruisticBlacksmith,
  schwartzCastler,
  bloomAutumnsFall,
  templarOfTheEternal,
  languidToadtroll,
  searingTruth,
  cellReactor,
  unwelcomeFortune,
  leporineMasque,
  distortReality,
  surpriseReveal,
  tsunamiOfNanyue,
  vorpalSword,
  nightBarker,
  ravenousPyre,
  cellHandler,
  diaoChanDreamingWish,
  mirrorboundCovenant,
  invokeDominance,
  imperialSentry,
  ruinousPillarsOfQidao,
  arcaneBlast,
  magusDisciple,
  shizunOfTheAsh,
  spiritOfWind,
  unbrokenDroid,
  sabelaGossamerPenance,
  nullifyingMirror,
  relentlessHexchaser,
  wayfindersMap,
  emberwrathWitch,
  cremationRitual,
  hemorrhagedIntimidation,
  firebloomFlourish,
  luridDreaming,
  rightOfRealm,
  blazingDestrier,
  cellForging,
  waveriderProtector,
  sparkLink,
  conflagrantSentinel,
  clericRobes,
  namelessChampionAm,
  flingFood,
  rangerStrides,
  annihilation,
  embraceNoir,
  bedivereWoodlandOverseer,
  bolsteringTempest,
  entrenchedFortress,
  orchestratedSeizure,
];

const grandArchiveCardChunk17: readonly GeneratedGrandArchiveCard[] = [
  fluffyShopkeep,
  dormantSacrificialAltar,
  lesserBoonOfOdysseus,
  oneiricKey,
  overlappingVisages,
  archonBroadsword,
  enPassant,
  niaMistveiledScout,
  solomonMasterOfElements,
  beguilingCoup,
  rallyThePeasants,
  energeticBeastbonder,
  escapeTheWreckage,
  clockworkMusicbox,
  curvedDagger,
  arisannaAstralZenith,
  vengefulGust,
  camilBaskedAbundance,
  pyreticPrognosis,
  spiritOfFortuitousWater,
  titheProclamation,
  dissipation,
  maidenOfGlimmersDusk,
  spiritsBlessing,
  resonantechModule,
  celestialNavigation,
  rainweaverMage,
  shieldroid,
  dummyTrainer,
  drownedExorcist,
  planarAbyss,
  crimsonRupture,
  draughtDodge,
  ducalSeal,
  shiftingCurrents,
  supernovaDivination,
  surgeProtector,
  idleFatestone,
  cosmicAstroscope,
  thermalBreak,
  lunarSeer,
  arcaneRenunciation,
  kaleidoscopeBarrette,
  lesserBoonOfDux,
  orbitingCosmos,
  beastbondClaws,
  flameblessedTrainee,
  dianaHauntReminiscence,
  manaResonance,
  grayLupindroid,
  imbueInFrost,
  shardOfEmpowerment,
  strikingTides,
  blazingBowman,
  mechanizedSmasher,
  seasonedShieldmaster,
  poisedRearguard,
  saprotrophy,
  potionOfHealing,
  dualitysConvergence,
  excaliburCleansingLight,
  vaingloryRetribution,
  chargingGaleshot,
  willToSave,
  gleamingCut,
  jianyuFatesPremonition,
  equivalentExchange,
  sacredEngulfment,
  fractalOfWaves,
  crimsonVein,
  acquiescingRejection,
  betrayingBlade,
  sift,
  seraphicLegionsDescent,
  deepSeaBeastbonder,
  blitzCharger,
  decayingReproach,
  zhangFeiSpiritedSteel,
  starbirth,
  kingdomsDivide,
  blindingOrb,
  ornamentalGreatsword,
  freezeStiff,
  aquatechShell,
  duchessSixOfHearts,
  powercell,
  conjureDownpour,
  wornGearblade,
  briarSchwartzKing,
  gloamspireHeadhunter,
  fumantShieldmaiden,
  crossroadsSpecter,
  swordSaintsVow,
  ovationGuide,
  revenantsScourge,
  caretakerHorse,
  guardedDissipation,
  expunge,
  titanMkIi,
  freezingRound,
];

const grandArchiveCardChunk18: readonly GeneratedGrandArchiveCard[] = [
  babyRedSlime,
  condemningEvisceration,
  camelotImpenetrable,
  chargeTheSoul,
  landscapeCorsair,
  pipersLullaby,
  evaporationSynchron,
  lesserBoonOfFauna,
  lightweaversInfiniteShaping,
  veilarasPromise,
  stridetechW,
  brokenPromises,
  tricksterOfTheFaeRealm,
  buriedGrief,
  silvieWildsWhisperer,
  hexboundBlade,
  tendTheLand,
  messageInShadows,
  atmosArmorTypeAres,
  revealTheHidden,
  rocketJump,
  ignitionDraw,
  devotionsPrice,
  fireball,
  swoopingTalons,
  blindingLapse,
  outriderOfWaves,
  arsenalKeeper,
  rafalesSlash,
  elysianOrphan,
  sharedFervor,
  radiantRepudiation,
  sordelleUnmooredException,
  infernalManastreak,
  throneSentinel,
  fractalOfInsight,
  fabricatorSlime,
  frostswornPaladin,
  phalanxCaptain,
  pawnPiece,
  emeraldPistol,
  mistswornMagister,
  scavengeTheDistillery,
  channeltechCharmS,
  perfusiveEnvelopment,
  powerchargedShield,
  fishingAccident,
  classicalOpening,
  lesserBoonOfShou,
  pleiadesCelestialGenesis,
  beckonAttention,
  furnaceLavabolt,
  twoOfHearts,
  spellshieldArcane,
  corhaziOutlook,
  idleThoughts,
  lesserBoonOfVirelai,
  criticalRecovery,
  ignisDeus,
  igniteTheSoul,
  commandTheHunt,
  polkhawkBombasticShot,
  turmSchwartzRook,
  merlinKingslayer,
  quickstepTreads,
  nightshade,
  velocityPunch,
  burstAsunder,
  crosswindCuts,
  enchantedFete,
  luxerasMap,
  plageAuxHomards,
  shangxiangFiercePrincess,
  viridianProtectiveTrinket,
  tinderflarePivot,
  obscuredOffering,
  grandeSonnerie,
  goldenBishop,
  limitlessSlime,
  blazingCharge,
  cutthroatOperative,
  sagesUrn,
  ebbingTide,
  veltechPresidentialCard,
  billChimneySweep,
  mysticPurifier,
  reduceToAsh,
  steadyVerse,
  smokeBombs,
  corhaziTrapper,
  backstep,
  apostleOfTheWoods,
  enduraScepterOfIgnition,
  starlitApothecary,
  gaiasSongbird,
  razorBroadhead,
  ghostsOfPendragon,
  overlordMkIii,
  calculatedForesight,
  desperateCavalier,
];

const grandArchiveCardChunk19: readonly GeneratedGrandArchiveCard[] = [
  summonPawn,
  sunkenBattlePriest,
  invectiveInstruction,
  manaboltConvergence,
  forgelightScepter,
  tacticalRetreat,
  hulaoGateSunsAscent,
  facetTheForgotten,
  rendingFlames,
  fraysia,
  focusingGem,
  ralliedAdvance,
  stonescaleBand,
  innerCourtSchemer,
  tomeOfSorcery,
  bairuiResplendentBarrier,
  freezingHail,
  ripplebackTerrapin,
  lesserBoonOfElysianBlood,
  tristanAscendantShadow,
  suddenSteel,
  cinderGeyser,
  beaconKnight,
  hanielArchangelOfSpectra,
  eminenceInFury,
  fracturedCrown,
  dominatingStrike,
  chargedGunslinger,
  navigationCompass,
  scarletTassel,
  fireworksDisplay,
  backstab,
  lesserBoonOfProvocation,
  fanOfInsight,
  fractalOfMana,
  incapacitate,
  heirloomOfMateria,
  jovianHiltXUltra,
  rescueTheHeir,
  songOfFrost,
  cowlOfTheWild,
  flaredIridescence,
  zanderPreparedScout,
  enfeeblingOrb,
  aqueousArmor,
  spallingCleanse,
  bombasticSprint,
  radiantOriginOfAssassin,
  siroccoOperative,
  aeneanRepudiation,
  airshipCaptain,
  tonorisGenesisAegis,
  spiritOfWater,
  transcendentalRite,
  eternalMagistrate,
  convergeReflections,
  infiniteScintillation,
  deliciousPastry,
  heatedVengeance,
  stillshardStrike,
  sixOfSpades,
  shatterTheBrittle,
  lesserBoonOfNourishment,
  umbilicalRitual,
  castling,
  windCutter,
  namelessChampionMw,
  gleamingSmolder,
  tidestoneBovine,
  singedEmotions,
  waterveilApostle,
  mintheSpiritOfWater,
  lustersShroud,
  mistyWhispertail,
  vermilionDecree,
  avatarOfByakko,
  forgingHeat,
  wildgrowthElixir,
  lorraineBlademaster,
  sabrinaSpiritOfWater,
  heavenlyGuide,
  sacramentalRite,
  dichroicScorch,
  diviningStreams,
  lesserBoonOfArtemis,
  nimbleLongbowman,
  flickeringAfterglow,
  captivatingOpulence,
  mnemonicCharm,
  righteousRetribution,
  zanderAlwaysWatching,
  radiantOriginOfRanger,
  luneteFrostbinderPriest,
  pelagicFatestone,
  magnificentBanquet,
  triumphantMechanic,
  favorableOmens,
  buoyantDriftguard,
  reinforcingAir,
  divineComedy,
];

const grandArchiveCardChunk20: readonly GeneratedGrandArchiveCard[] = [
  aquaveilAmbusher,
  redirectOrbit,
  theMajesticSpirit,
  varicoseAmplification,
  harvesterMkIi,
  frigidEmbrittlement,
  manicZealot,
  sablierGuard,
  intoTheFray,
  animalEncounter,
  huaXiongInsurgentsFang,
  rigForDetonation,
  majesticSpiritsCrest,
  extinguishingSynchron,
  adeptSwordmaster,
  dreamyUnicorn,
  shockTherapy,
  cauterizingSeraphim,
  visceralInversion,
  aliceTriflesRoyalty,
  refreshingCharge,
  returnStroke,
  ripplesOfAtrophy,
  excaliburReflectedEdge,
  exorciseCurses,
  dusksoulStone,
  ionizedAsceticism,
  rumbleCoordinator,
  miaoSpiritOfWater,
  scoutTheLand,
  vantagePoint,
  imperialApprentice,
  ingredientPouch,
  fanclubLeader,
  flametechShield,
  annulSpell,
  blightsRing,
  blitzMage,
  zanderBlindingSteel,
  fracturedMemories,
  undeniableTruth,
  nippingKicker,
  lesserBoonOfZerusa,
  portSmuggler,
  aetherialProjection,
  petalfallEmbrace,
  visagesStrike,
  equinoxHour,
  poweredBishop,
  disorientingWinds,
  accompanyingGuard,
  daQiaoCinderbinder,
  sadiBloodHarvester,
  shuFrontliner,
  trainedSharpshooter,
  fractalOfSnow,
  lesserBoonOfBullets,
  cardinalOfDivineRite,
  chaliceOfBlood,
  poisonousApple,
  triboelectricFortification,
  coiledFatestone,
  indissolubleFractal,
  tombSweep,
  usurpTheWinds,
  merlinMemoryThief,
  tweedledumRattledDancer,
  royalOrdinance,
  arrowTrap,
  winblessKiteshield,
  malevolentVow,
  gustguardBastion,
  lurkingAssailant,
  lesserBoonOfRegret,
  bidingCinquedea,
  tonicOfRemembrance,
  caretakerDrone,
  nullifyingLantern,
  rimesoulBishop,
  galestreamInsight,
  sharpeningStone,
  lorraineHonedOperative,
  purgeInFlames,
  hauntingApparition,
  shatteringDischarge,
  savageArrow,
  unitysGale,
  dreamFairy,
  coronalOfRejuvenation,
  halcyonAnimus,
  unmakeDuality,
  luxemSight,
  suitedTrickery,
  immolationTrap,
  whisperwindCompass,
  oasisTradingPost,
  winblessRangefinder,
  acceptedContract,
  jubjubBirdMimsyGhast,
  hauntingDemise,
];

const grandArchiveCardChunk21: readonly GeneratedGrandArchiveCard[] = [
  lingeringBanshee,
  castlingBoon,
  capriciousLynx,
  huajiOfHeavensRise,
  gemOfSearingFlame,
  collapsingTrap,
  blightheartPenitent,
  dianaMoonpiercer,
  innervateAgility,
  fatestoneOfBalance,
  chargedAlchemist,
  rousingSlam,
  nanyuePortsman,
  lesserBoonOfPulousa,
  lesserBoonOfRakko,
  twingaleParry,
  seiryuusCommand,
  regenerate,
  standBeforeTheQueen,
  ashwoundShot,
  drownInSorrow,
  corhaziInfiltrator,
  nascentBlast,
  openingCut,
  anthemOfVitality,
  cellAssembler,
  flowingOubli,
  spiritBladeGhostStrike,
  violetHaze,
  imperialAlchemist,
  veteranSoldier,
  reposition,
  glacierRemnants,
  signaltechXUltra,
  vanguardsReversal,
  chamberlainToad,
  infernalVessel,
  fatedKeepsake,
  swervingSpring,
  hornedKnight,
  pyrolysisSage,
  smokeOut,
  savageSwing,
  conflagrativeTrounce,
  charmOfAnticipation,
  shackledTheurgist,
  incineratorFelindroid,
  oathOfTheSakura,
  shadowsClaw,
  refluxalRibbon,
  vanishFromSight,
  hardyVeteran,
  intervention,
  buddyRaccoon,
  aeneanTailwindBoost,
  takeAim,
  hanabiSpiritOfFire,
  coyBouclier,
  piercingAetherfuel,
  greaterBoonOfDux,
  sidestep,
  greaterBoonOfFlock,
  surgingObstruction,
  cosmicBolt,
  fracturingSlash,
  entrancingFiligree,
  burningAethercharge,
  primaMateria,
  tidefateBrooch,
  ashfletchedBowman,
  flameRuneSwordsman,
  horticounter,
  andronikaEternalHerald,
  torrentialBlast,
  perishingFlorets,
  silentFirebrand,
  chateauDeCoeurs,
  breakTheLine,
  zenaEchoWeaver,
  temperedSteel,
  deviousWelcome,
  auspiciousManifestation,
  fabledSapphireFatestone,
  fieldOfRanksAndFiles,
  syntheticCore,
  shademistPriestess,
  invigoratedSlash,
  embertailSquirrel,
  expeditiousOpening,
  volcanicCrescendo,
  prismaticSpirit,
  flashFreeze,
  poisedOcclusion,
  ordinaryHorse,
  sovereignSanctuary,
  lacunasGrasp,
  trumpSet,
  threeVisits,
  zhangLiaoBloodmonger,
  lancelotGoliathOfAesa,
];

const grandArchiveCardChunk22: readonly GeneratedGrandArchiveCard[] = [
  streamOfConsciousness,
  plasmaVanguard,
  gloamspireBlackMarket,
  melodiousFlute,
  sablemereWardensGrip,
  vascularCollapse,
  discharger,
  noireAceOfSpades,
  debilitatingGrasp,
  greaterBoonOfConnection,
  fieryDuelist,
  verdureOfPreservation,
  enrage,
  aethersEmbrace,
  extortionScheme,
  inundatingClash,
  blazingLunge,
  arcaneElemental,
  windstrikeSoldier,
  witheringGrasp,
  cellforgerDroid,
  mordredFlawlessBlade,
  weavingManastream,
  aquatechBladeX,
  dianaJudgmentsArrow,
  wrathfulSlime,
  scorchingTrap,
  temperInFlames,
  obeliskOfArmaments,
  lesserBoonOfRefuge,
  greaterBoonOfProxia,
  shimmercloakAssassin,
  poisedBowman,
  emergentDagger,
  lesserBoonOfKnox,
  dredgingStreams,
  galewhisperRogue,
  lesserBoonOfPermeation,
  angerTheSkies,
  ghostsightMare,
  greaterBoonOfParvati,
  wingpeakPatriarch,
  innervateFury,
  ensnaringFumes,
  voidsCloak,
  peacefulReunion,
  eternalDirective,
  franCarmineSpark,
  owlFamiliar,
  chrysalisHazyCaterpillar,
  ravagingTempest,
  incandescentReliquary,
  netherDodobird,
  palvorSword,
  intrepidHighwayman,
  pendantOfAccrual,
  geniGiftedMechanist,
  maidenOfShroudedFog,
  birefringence,
  inductionStrike,
  stolenChance,
  temptationsFacade,
  wavekeepersBond,
  leadingCharge,
  bygoneDays,
  herdOfTheHearth,
  pantheonBarrier,
  manufactureCell,
  developMana,
  flametechManual,
  livelyChorale,
  wildgrowthFatestone,
  prismaticPerseverance,
  dawnsReversal,
  invertedPyroslash,
  waterfallVeiler,
  frostnipPirouette,
  freezingSteel,
  fractalOfCreation,
  enduraReimagined,
  beseechedFatestone,
  frostbinderApostle,
  whirlwindReaper,
  vanitasObliviateSchemer,
  yuanShaoCrownGeneral,
  lorraineArclightSaber,
  curseAmplification,
  seedOfEmpowerment,
  fatestoneOfRevelations,
  virgilAlteredFuture,
  reapingLegacy,
  giveBath,
  waitedAccord,
  crystallizedAnthem,
  reluctantBreath,
  alkahest,
  ghastlySlime,
  fourOfHearts,
  plumingCrescendo,
  calmingBreeze,
];

const grandArchiveCardChunk23: readonly GeneratedGrandArchiveCard[] = [
  blisteringInsurgent,
  punishingCartridge,
  embershieldKeeper,
  enchainingGale,
  materializeMunitions,
  hemorrhagingRend,
  undercurrentVantage,
  huangZhongUnerringAim,
  setTheTraps,
  eventideSpear,
  beastbondBoots,
  remnantOfWill,
  maidenOfWaningBloom,
  hairpinOfTransience,
  thousandRefractions,
  luXunPyreStrategist,
  arcaneSight,
  embersong,
  facetTogether,
  stellariaShower,
  tariffRing,
  shatteredHope,
  automatonForgewarden,
  tempusStalker,
  xuchangFrozenCitadel,
  mordredAurelianRegent,
  cleansingReunion,
  greaterBoonOfKanaloa,
  seersSword,
  automatedGardener,
  ritaiBerserker,
  gloamspireWraith,
  radiantOriginOfCleric,
  spiritBladeTerminus,
  surveilTheWinds,
  lesserBoonOfPoseidon,
  barrierServant,
  thinkDeep,
  waterBarrier,
  reactivateDrone,
  ashwickCremator,
  siderealSpellshot,
  parcenetRoyalMaid,
  obeliskOfFabrication,
  hightail,
  luBuIndomitableTitan,
  manasCascade,
  zephyrAssistant,
  clearPastures,
  shuangJiOfSacrifice,
  rilewindSentinel,
  vaporjetShield,
  shardforgedBlade,
  meirenOfVerdancy,
  cometaryVantage,
  coronationCeremony,
  rivuletAdjutant,
  undyingDreams,
  aquaVitae,
  winblessGatekeeper,
  forceLoad,
  huntWeissKing,
  risingTides,
  curtainOfShadows,
  regulusBlitz,
  dissuadingHalt,
  luminescentSlash,
  fluteOfTaming,
  windSurgeEmitter,
  steadySharpshooter,
  seedOfNature,
  bringDownTheMighty,
  twinstarTonic,
  enthrallingVisage,
  aethericReforging,
  theConstellatorySpire,
  tomeOfKnowledge,
  aeneanCrystallization,
  rileTheAbyss,
  unbrokenMustang,
  tonorisMightOfHumanity,
  singeingLeap,
  wingedTalaria,
  empoweringPrayer,
  revokerBell,
  automatonBomber,
  cloudstoneOrb,
  pierceTheHeavens,
  eightOfHearts,
  bloodSurge,
  leadWithForce,
  jabberwockyCalamitysCall,
  agnisSignet,
  safeguardAmulet,
  unforgottenWill,
  discoverTheDivine,
  torRealmwalkerColossus,
  flamebreakChorus,
  gaiasBlessing,
  mortalAmbition,
];

const grandArchiveCardChunk24: readonly GeneratedGrandArchiveCard[] = [
  flowerbud,
  blissfulCalling,
  sturdyDroid,
  explosiveConcoction,
  forbiddenTeachings,
  allenBeastBeckoner,
  rapidReload,
  devotedBloomweaver,
  corhaziCourier,
  stolidVanguard,
  lesserBoonOfOzymandias,
  sinkTheMind,
  convalescingMare,
  radiantOriginOfGuardian,
  venousCore,
  banditGazeLeader,
  spellshieldTera,
  purgingTempest,
  honeByFire,
  fragmentedSpiritOfFire,
  cascadingRound,
  spectralBeacon,
  cooktechMixer,
  outfittedRavager,
  wickedGildbreaker,
  poweredDefender,
  frostbind,
  purlingFootman,
  constellaryPredomination,
  synthDisrupter,
  reconstructiveSurgery,
  youngPeacekeeper,
  stiflingTrap,
  baubleOfAbundance,
  prototypeShield,
  harvestHerbs,
  tonorisLoneMercenary,
  materializePolearm,
  comboStrike,
  swordOfShadows,
  disenchant,
  jinFateDefiant,
  raiArchmage,
  solarPinnacle,
  heightenSpellcraft,
  silvergaleObelithsCall,
  submergedFatestone,
  windriderMage,
  devilsLifeline,
  summonGale,
  greenSlime,
  frog,
  mirroredConfrontation,
  cielMiragesGrave,
  hemofluxDrain,
  scatterEssence,
  deliveryDroid,
  cellGenerator,
  mercilessToss,
  armoredValkyrie,
  keenTidebinder,
  sempiternalSage,
  intwinedBangle,
  dazzlingCourtesan,
  rampartDefender,
  kingdomInformant,
  smackWithFlute,
  lesserBoonOfTerritories,
  lavasoulTiger,
  fiveOfDiamonds,
  spiritOfSereneWater,
  marksmansCharm,
  silvieEarthsTune,
  tideDiviner,
  tidalFractal,
  lesserBoonOfTimesPassage,
  creepingTorment,
  luceniasReign,
  radiantOriginOfTamer,
  adventOfTheStormcaller,
  bladedRiftseer,
  extractionIncision,
  namelessChampionCm,
  intangibleGeist,
  marchOn,
  astraSight,
  greaterBoonOfIsis,
  executionersSpear,
  reversalsPolarity,
  dwarfStarsGlow,
  greaterBoonOfShou,
  simpleSlime,
  lightweaversAssault,
  mourningVeilbound,
  inflamedBladehand,
];

export const grandArchiveCards: readonly GeneratedGrandArchiveCard[] = [
  ...grandArchiveCardChunk0,
  ...grandArchiveCardChunk1,
  ...grandArchiveCardChunk2,
  ...grandArchiveCardChunk3,
  ...grandArchiveCardChunk4,
  ...grandArchiveCardChunk5,
  ...grandArchiveCardChunk6,
  ...grandArchiveCardChunk7,
  ...grandArchiveCardChunk8,
  ...grandArchiveCardChunk9,
  ...grandArchiveCardChunk10,
  ...grandArchiveCardChunk11,
  ...grandArchiveCardChunk12,
  ...grandArchiveCardChunk13,
  ...grandArchiveCardChunk14,
  ...grandArchiveCardChunk15,
  ...grandArchiveCardChunk16,
  ...grandArchiveCardChunk17,
  ...grandArchiveCardChunk18,
  ...grandArchiveCardChunk19,
  ...grandArchiveCardChunk20,
  ...grandArchiveCardChunk21,
  ...grandArchiveCardChunk22,
  ...grandArchiveCardChunk23,
  ...grandArchiveCardChunk24,
];

export const grandArchiveCardsByCanonicalId: ReadonlyMap<string, GeneratedGrandArchiveCard> =
  new Map(grandArchiveCards.map((card) => [card.canonicalId, card] as const));

if (grandArchiveCardsByCanonicalId.size !== grandArchiveCards.length)
  throw new Error("Generated Grand Archive card objects contain duplicate canonical IDs.");
