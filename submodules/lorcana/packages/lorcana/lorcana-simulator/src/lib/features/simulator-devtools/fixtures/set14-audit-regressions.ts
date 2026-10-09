import { hansSchemingPrince } from "@tcg/lorcana-cards/cards/001";
import { improvise } from "@tcg/lorcana-cards/cards/002";
import { freeze } from "@tcg/lorcana-cards/cards/001";
import { reflection } from "@tcg/lorcana-cards/cards/001";
import { underTheSea } from "@tcg/lorcana-cards/cards/004";
import { sebastianCourtComposer } from "@tcg/lorcana-cards/cards/001";
import { kronkJuniorChipmunk, cogsworthGrandfatherClock } from "@tcg/lorcana-cards/cards/002";
import { perditaDevotedMother } from "@tcg/lorcana-cards/cards/003";
import { youCameBack } from "@tcg/lorcana-cards/cards/006";
import type { ActionCard, ItemCard, CharacterCard } from "@tcg/lorcana-types";
import { auroraDreamingGuardian } from "@tcg/lorcana-cards/cards/001";
import { graveyardOfChristmasFutureLonelyRestingPlace } from "@tcg/lorcana-cards/cards/011";
import { mickeyMouseMinnieMouseAdventuringDuo } from "@tcg/lorcana-cards/cards/013";
import { quickShot } from "@tcg/lorcana-cards/cards/008";
import { aVeryMerryUnbirthday } from "@tcg/lorcana-cards/cards/006";
import { mosquitoBite } from "@tcg/lorcana-cards/cards/006";
import { justInTime } from "@tcg/lorcana-cards/cards/001";
import { tianaCelebratingPrincess } from "@tcg/lorcana-cards/cards/002";
import { mouseArmor } from "@tcg/lorcana-cards/cards/002";
import {
  abuelitaLovingGrandmother,
  merlinInkDropTinkerer,
  brooklynFullThrottle,
  foxXanatosCharismaticOutlaw,
  peterPansShadowElusivePrankster,
  clawhauserSafetyOfficer,
  elisaMazaHardworkingDetective,
  judyHoppsAlwaysVigilant,
  lionheartIncumbentMayor,
  miguelRiveraStreetMusician,
  miguelRiveraAccomplishedMusician,
  shedYourWearyLoad,
  nickWildeToyDriveOfficer,
  mrManchasServiceWithASmile,
  pjPeteDevotedFan,
  nickWildeInquisitiveHarbormaster,
  nickWildeProvidingBackup,
  miriamMendelsohnFrontrowFan,
  peteSuaveShowoff,
  maxGoofMusicLover,
  edgarBalthazarLongsufferingButler,
  kitCloudkickerUnpredictableCourier,
  kitCloudkickerSureShot,
  ticktockCanalCroc,
  tianaRestauranteur,
  tianaPartyHostess,
  peopleGonnaComeHere,
  hyperiaCityExpress,
  piratePlane,
  mickeyMouseBestInTownIconic,
  centralStationTransportationHub,
  khanIndustriesGreenwayLandmark,
  rayaDeterminedExplorer,
  woolterJesseBellwethersHenchmen,
  napoleonPatientWatchdog,
  wildcatUnconventionalMechanic,
  sirKayDeterminedToWin,
  toulouseRoughAndTumble,
  chiefBogoPoliceCommissioner,
  sirPellinoreTougherThanHeLooks,
  arthurNoviceBlacksmith,
  arthurJoustingKnight,
  mrBigDistributionMagnate,
  berliozTinyRascal,
  marieCaughtInTheAct,
  balooDeliveryPilot,
  balooFreightPilot,
  koslovImposingEnforcer,
  sirEctorBlusteryKnight,
  yaxConcertGoer,
} from "@tcg/lorcana-cards/cards/014";
import { arielSpectacularSinger, cinderellaGentleAndKind } from "@tcg/lorcana-cards/cards/001";
import { peterPanNeverLanding } from "@tcg/lorcana-cards/cards/001";
import { hakunaMatata } from "@tcg/lorcana-cards/cards/001";
import { letItGo } from "@tcg/lorcana-cards/cards/001";
import { jafarTyrannicalHypnotist } from "@tcg/lorcana-cards/cards/005";
import { rcRemotecontrolledCar } from "@tcg/lorcana-cards/cards/012";
import { smash } from "@tcg/lorcana-cards/cards/001";
import { arthurMerlinsAssistant } from "@tcg/lorcana-cards/cards/014";
import { mushusRocket } from "@tcg/lorcana-cards/cards/010";
import { mauiHeroToAll, mauiDemigod } from "@tcg/lorcana-cards/cards/001";
import { bePrepared } from "@tcg/lorcana-cards/cards/001";
import { motherKnowsBest } from "@tcg/lorcana-cards/cards/001";
import { nothingWeWontDo } from "@tcg/lorcana-cards/cards/008";
import {
  oneJumpAhead,
  friendsOnTheOtherSide,
  mickeyMouseTrueFriend,
  minnieMouseBelovedPrincess,
} from "@tcg/lorcana-cards/cards/001";
import { fireTheCannons } from "@tcg/lorcana-cards/cards/001";
import { fanTheFlames } from "@tcg/lorcana-cards/cards/001";
import { dragonFire } from "@tcg/lorcana-cards/cards/001";
import { breakCard } from "@tcg/lorcana-cards/cards/001";
import { doItAgain } from "@tcg/lorcana-cards/cards/001";
import { healingGlow } from "@tcg/lorcana-cards/cards/001";
import { befuddle } from "@tcg/lorcana-cards/cards/001";
import { aladdinPrinceAli } from "@tcg/lorcana-cards/cards/001";
import {
  bellesHouseMauricesWorkshop,
  mauisPlaceOfExileHiddenIsland,
  riseOfTheTitans,
} from "@tcg/lorcana-cards/cards/003";
import { eeyoreOverstuffedDonkey } from "@tcg/lorcana-cards/cards/003";
import { distract } from "@tcg/lorcana-cards/cards/003";
import { grabYourSword } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "./fixture-factory";
import {
  ifSheDoesntScareYou,
  khanStadiumStateOfTheArt,
  cinderellaHomespunDressmaker,
  cinderellaUnintentionalIcon,
  cinderellaUnintentionalIconIconic,
  wasabiFutureThinker,
  honeyLemonIngeniousResearcher,
  madamMimNosyNeighbor,
  lionheartCleaningUpTheCity,
  priscillaEfficientClerk,
  daisyDuckSavvyInvestor,
  hiroHamadaPioneeringInventor,
  honeyLemonEndlesslyCurious,
  thomasOmalleySavvyVagabond,
  duchessCosmopolitanCat,
  judyHoppsDayCampInstructor,
  minnieMouseUrbanVisionary,
  arielCollectorOfOddities,
  bellwetherHighlyQualified,
  clarabelleOutForAStroll,
  dougLyingInWait,
  aDarkAgeNoMore,
  everythingElseIsObsolete,
  intenseResearch,
  scram,
  blindingChemBall,
  prototypeChemBall,
  spyglassHat,
  upgradedChemPurse,
  instituteOfTechnologyHoneyLemonsLab,
  carlFredricksenWildernessGuide,
  pushingBoundaries,
  intimidationTactics,
  mulanMartialArtsMaster,
  wasabiCalledIntoBattle,
  shereKhanKhanIndustriesCeo,
  roxanneConcertLover,
  meilinLeeEcstaticFan,
  trampQuickOnHisFeet,
  hctorRiveraGoneToPieces,
  hctorRiveraGoneToPiecesD23,
  ernestoDeLaCruzRuthlessMusician,
  neverTooFarApart,
  pepitaImeldasRightHand,
  ernestoDeLaCruzIdolOfMillions,
  cruellaDeVilDodgingTraffic,
  jasperDodgyBoater,
  tadashiHamadaMakingWaves,
  goofyEnthusiasticTourist,
  donaldDuckTaxiDriver,
  abigailCallaghanSeasonedTestPilot,
  pepitaSweetKitty,
  staceyPowerlineSuperfan,
  yamaNotoriousCriminal,
  hctorRiveraWorldwideSensation,
  goofyKnowsTheBand,
  hctorRiveraStreetMusician,
  abbyParkIntenseFan,
  heiheiAtTheCrosswalk,
  mickeyMouseBestInTown,
  neverGonnaLetYouCry,
  rememberMe,
  ancestralGuitar,
  speakerStack,
  mamImeldasBlessing,
  owenBurnettXanatossAssistant,
  scuttleDirectingTraffic,
  davidXanatosArcaneIndustrialist,
  russellFindingAdventure,
  ladyTremaineScornfulSnob,
  gazellePopDiva,
  pegLatenightVocalist,
  fruFruVipGuest,
  theTornCorner,
  riveraFamilyPhoto,
  khanTransportDelivery,
  madamMimResourcefulTrickster,
  joustingMatch,
  inkExplosion,
  kingLouieIceCreamVirtuoso,
  auroraDelightfulMusician,
  powerlineMegastar,
  goofyDancingSuperstar,
  priyaMangalImmovableFan,
  judyHoppsHelpfulOfficer,
  miguelRiveraPromisingMusician,
  thoughIHaveToSayGoodbye,
  lafayetteAllEars,
  abigailAmeliaGossipingGeese,
  goGoTomagoWorkingLate,
  archimedesHasHadEnough,
  magnificentMarvelous,
  baymaxAmpedUp,
  higitusFigitus,
  taVictoriaDisapprovingAncestor,
  mamCocoVisitingThePark,
  jukebox,
  landOfTheDeadMarigoldBridge,
  mamImeldaNononsenseAncestor,
  rapunzelOutgoingArtist,
  merlinProfoundlyCurious,
  archimedesMessengerOwl,
  goliathTransformedWarrior,
  danteLoyalAlebrije,
  danteEnthusiasticStray,
  everyoneKnowsJuanita,
  mimsMalice,
  creativeInspiration,
  merlinsWand,
  inkcasterSkates,
  merlinsShopAndSmithyMagicalMarket,
  unPocoLoco,
  demonaImperiousSpellcaster,
  lexingtonFearlessFlier,
  merlinBaubleExpert,
  madamMimBaubleChaser,
  pepitaWatchfulAlebrije,
  hiroHamadaVersatileInventor,
  mollyCunninghamRemembersToShare,
  kitCloudkickerIrrepressibleBear,
  rebeccaCunninghamSavvyManager,
  shereKhanOpportunisticTycoon,
  horaceClumsyClod,
  bobbyZimuruskiSoundboardWhiz,
  baymaxLabAssistant,
  fredAwesomeBoss,
  fredBigStomper,
  minnieMouseBusyGogetter,
  honeyLemonTestingTheLimits,
  airDrop,
  aboveTheCrowd,
  anotherTaleToSpin,
  thisIsBusiness,
  chemicalReaction,
  flippantTaunt,
  baymaxQualifiedPhysician,
  portAuthorityCenterHub,
  theBeanstalkOnwardAndUpward,
  lesterThePossumParkMascot,
  donKarnageDebonairPirate,
  donKarnageKhansCourier,
  flashEfficientClerk,
  maxGoofKaraokeStar,
  leaningTowerOfCheesea,
  shereKhanRuthlessEntrepreneur,
  ladyRelaxedAndRested,
  captainHookConcernedCaptain,
  jockEnjoyingTheSights,
  fredAssemblingTheTeam,
  belleReflectiveWriter,
  belleExceptionalWriter,
  bellesCityGuide,
  goGoTomagoExtremeTester,
  tinkerBellCuriousFairy,
  danteStrangeAndEndearing,
} from "@tcg/lorcana-cards/cards/014";

const deck = [
  fruFruVipGuest,
  fruFruVipGuest,
  fruFruVipGuest,
  fruFruVipGuest,
  fruFruVipGuest,
  fruFruVipGuest,
];

export const set14AuditImeldaFixture = createFixture({
  id: "set14-audit-imelda",
  name: "Hyperia audit: Imelda's required three-card return",
  description:
    "Play Imelda with only two own discard cards. The three-card return must be unavailable; banish her instead. Opposing discard cards do not count.",
  skipPreGame: true,
  seed: "set14-audit-imelda",
  playerOne: {
    hand: [mamImeldaNononsenseAncestor],
    discard: [fruFruVipGuest, priyaMangalImmovableFan],
    deck,
    inkwell: 10,
  },
  playerTwo: { discard: [fruFruVipGuest, fruFruVipGuest, fruFruVipGuest], deck, inkwell: 10 },
});

export const set14AuditBaymaxFixture = createFixture({
  id: "set14-audit-baymax",
  name: "Hyperia audit: Baymax's optional Supercharge",
  description:
    "Play Khan Delivery to draw, then choose whether to replace its incoming drop. Play Higitus Figitus to choose separately for each of its three drops. Replaced drops become facedown, exerted ink; kept drops remain available.",
  skipPreGame: true,
  seed: "set14-audit-baymax",
  playerOne: {
    play: [baymaxAmpedUp],
    hand: [khanTransportDelivery, higitusFigitus],
    deck,
    inkwell: 12,
  },
  playerTwo: { deck, inkwell: 10 },
});

export const set14AuditBaymaxShiftPlayerTwoFixture = createFixture({
  id: "set14-audit-baymax-shift-player-two",
  name: "Hyperia audit: Baymax drop Shift and Player Two",
  skipPreGame: true,
  seed: "baymax-shift-player-two",
  description:
    "Pass to Player Two. One drop cannot pay Shift even with eight ink. Play Khan Delivery for two ink to draw Jukebox and gain the second drop. Shift Amped Up onto only own damaged Baymax by removing both drops; no ink is spent. Quest the dry shifted Baymax for two lore, with no inherited healing trigger. Play Higitus for six ink. Replace the first drop with the last Photo facedown exerted; the two remaining drops are gained normally with no stuck prompt. Opposing and wrong-name characters are excluded. Inspect private/public logs.",
  playerOne: { play: [baymaxQualifiedPhysician], inkwell: 1, deck },
  playerTwo: {
    play: [{ card: baymaxQualifiedPhysician, isDrying: false, damage: 2 }, fruFruVipGuest],
    hand: [baymaxAmpedUp, khanTransportDelivery, higitusFigitus],
    inkwell: 8,
    inkDrops: 1,
    deck: [riveraFamilyPhoto, jukebox, fruFruVipGuest],
  },
});
export const set14AuditBaymaxShiftStatesFixture = createFixture({
  id: "set14-audit-baymax-shift-states",
  name: "Hyperia audit: Baymax drop Shift inherited states",
  skipPreGame: true,
  seed: "baymax-shift-states",
  description:
    "Shift both Amped Up copies onto separate own Baymax bases using two drops each. Ready ink stays seven throughout. One base is exerted and dry, the other drying; both retain two damage and cannot quest. Wrong-name and opposing bases are excluded. Inspect both logs for named Shift and exact drop removal.",
  playerOne: {
    play: [
      { card: baymaxQualifiedPhysician, isDrying: false, exerted: true, damage: 2 },
      { card: baymaxQualifiedPhysician, isDrying: true, damage: 2 },
      fruFruVipGuest,
    ],
    hand: [baymaxAmpedUp, baymaxAmpedUp],
    inkwell: 7,
    inkDrops: 4,
    deck,
  },
  playerTwo: { play: [baymaxQualifiedPhysician], deck },
});
export const set14AuditBaymaxTwoSourcesFixture = createFixture({
  id: "set14-audit-baymax-two-sources",
  name: "Hyperia audit: two Baymax replacement sources",
  skipPreGame: true,
  seed: "baymax-two-sources",
  description:
    "Play Khan Delivery with two Amped Up copies. Draw Jukebox and replace the incoming drop with exactly one Photo in facedown exerted ink. There is no second replacement or extra ink card. Inspect owner and public logs; reload to keep the drop and leave Photo in deck.",
  playerOne: {
    play: [baymaxAmpedUp, baymaxAmpedUp],
    hand: [khanTransportDelivery],
    inkwell: 2,
    deck: [riveraFamilyPhoto, jukebox],
  },
  playerTwo: { deck },
});

export const set14AuditEntryDamageFixture = createFixture({
  id: "set14-audit-entry-damage",
  name: "Hyperia audit: Singer entry damage",
  description:
    "Pass to player two and play Gazelle. Lady Tremaine adds 1 entry damage. Both decks have cards so turn changes remain playable.",
  skipPreGame: true,
  seed: "set14-audit-entry-damage",
  playerOne: { play: [ladyTremaineScornfulSnob], deck, inkwell: 5 },
  playerTwo: { hand: [gazellePopDiva, pegLatenightVocalist, fruFruVipGuest], deck, inkwell: 10 },
});
export const set14AuditTornCornerFixture = createFixture({
  id: "set14-audit-torn-corner",
  name: "Hyperia audit: The Torn Corner",
  description:
    "Activate Rivera Family Photo's first mode to mill The Torn Corner. Accept or decline its free play. An older copy is already in discard to check exact identity.",
  skipPreGame: true,
  seed: "set14-audit-torn-corner",
  playerOne: {
    play: [riveraFamilyPhoto],
    deck: [...deck, theTornCorner],
    discard: [theTornCorner],
    inkwell: 10,
  },
  playerTwo: { deck, inkwell: 10 },
});
export const set14AuditPaymentFixture = createFixture({
  id: "set14-audit-payment",
  name: "Hyperia audit: chosen ink-drop payment",
  description:
    "Arm ink-drop payment and play Madam Mim while ready inkwell ink remains. Upper Hand draws two cards. Khan Delivery gains a new drop. Later Jousting Match paid with that drop deals five damage and Bauble Game draws once.",
  skipPreGame: true,
  seed: "set14-audit-payment",
  playerOne: {
    hand: [madamMimResourcefulTrickster, joustingMatch, khanTransportDelivery],
    deck,
    inkwell: 20,
    inkDrops: 3,
  },
  playerTwo: { play: [{ card: archimedesHasHadEnough, exerted: true }], deck, inkwell: 10 },
});
export const set14AuditSupportAlertFixture = createFixture({
  id: "set14-audit-support-alert",
  name: "Hyperia audit: Support and Alert",
  description:
    "Quest with King Louie and give Lafayette Support. Lafayette can challenge an exerted Evasive Archimedes. Pass turns to check that the Support bonus expires.",
  skipPreGame: true,
  seed: "set14-audit-support-alert",
  playerOne: {
    play: [
      { card: kingLouieIceCreamVirtuoso, isDrying: false },
      { card: lafayetteAllEars, isDrying: false },
    ],
    hand: [magnificentMarvelous],
    deck,
    inkwell: 10,
  },
  playerTwo: { play: [{ card: archimedesHasHadEnough, exerted: true }], deck, inkwell: 10 },
});

export const set14AuditLouiePlayerTwoFixture = createFixture({
  id: "set14-audit-louie-player-two",
  name: "Hyperia audit: King Louie Player Two Support",
  skipPreGame: true,
  seed: "set14-audit-louie-player-two",
  description:
    "Pass to Player Two. Quest one Stadium Louie (Strength three) to Support your Ward Aladdin (two to five). Quest a plain Louie and decline. Quest the other plain Louie and Support opposing Fru Fru (one to two). Quest the second Stadium Louie to stack Aladdin to eight. Challenge opposing exerted Mickey with Aladdin for eight damage. Pass: opposing Fru Fru returns to one before its owner's turn. Inspect both logs and picker exclusions.",
  playerOne: {
    play: [
      fruFruVipGuest,
      aladdinPrinceAli,
      { card: mickeyMouseTrueFriend, exerted: true, isDrying: false },
    ],
    deck,
  },
  playerTwo: {
    hand: [fruFruVipGuest],
    discard: [fruFruVipGuest],
    play: [
      khanStadiumStateOfTheArt,
      { card: kingLouieIceCreamVirtuoso, isDrying: false, atLocation: khanStadiumStateOfTheArt },
      { card: kingLouieIceCreamVirtuoso, isDrying: false, atLocation: khanStadiumStateOfTheArt },
      { card: kingLouieIceCreamVirtuoso, isDrying: false },
      { card: kingLouieIceCreamVirtuoso, isDrying: false },
      { card: aladdinPrinceAli, isDrying: false },
    ],
    inkwell: 1,
    deck,
  },
});

const louieBanishedObserver: ItemCard = {
  ...riveraFamilyPhoto,
  id: "louie-banished-observer",
  canonicalId: "louie-banished-observer",
  slug: "louie-banished-observer",
  printings: [],
  reprints: [],
  name: "Audit Support Banished Observer",
  text: "Synthetic test only: Whenever your character quests, banish chosen character.",
  i18n: {
    en: { name: "Audit Support Banished Observer" },
    de: { name: "Audit Support Banished Observer" },
    es: { name: "Audit Support Banished Observer" },
    fr: { name: "Audit Support Banished Observer" },
    it: { name: "Audit Support Banished Observer" },
  },
  abilities: [
    {
      type: "triggered",
      name: "TEST SOURCE DEPARTURE",
      trigger: { event: "quest", on: "YOUR_CHARACTERS", timing: "whenever" },
      effect: { type: "banish", target: "CHOSEN_CHARACTER" },
    },
  ],
};
export const set14AuditLouieBanishedFixture = createFixture({
  id: "set14-audit-louie-banished",
  name: "Hyperia audit: Support synthetic source banished",
  skipPreGame: true,
  seed: "set14-audit-louie-banished",
  description:
    "Synthetic ordering probe. Quest boosted King Louie at Stadium (Strength three). Resolve TEST SOURCE DEPARTURE first, choosing Louie. Then accept retained Support on Fru Fru: one to four using last-known Strength three. Pass to remove the bonus. Inspect both logs.",
  playerOne: {
    play: [
      khanStadiumStateOfTheArt,
      { card: kingLouieIceCreamVirtuoso, isDrying: false, atLocation: khanStadiumStateOfTheArt },
      louieBanishedObserver,
      fruFruVipGuest,
    ],
    deck,
  },
  playerTwo: { deck },
});

const louieReturnedObserver: ItemCard = {
  ...riveraFamilyPhoto,
  id: "louie-returned-observer",
  canonicalId: "louie-returned-observer",
  slug: "louie-returned-observer",
  printings: [],
  reprints: [],
  name: "Audit Support Returned Observer",
  text: "Synthetic test only: Whenever your character quests, return-to-hand chosen character.",
  i18n: {
    en: { name: "Audit Support Returned Observer" },
    de: { name: "Audit Support Returned Observer" },
    es: { name: "Audit Support Returned Observer" },
    fr: { name: "Audit Support Returned Observer" },
    it: { name: "Audit Support Returned Observer" },
  },
  abilities: [
    {
      type: "triggered",
      name: "TEST SOURCE DEPARTURE",
      trigger: { event: "quest", on: "YOUR_CHARACTERS", timing: "whenever" },
      effect: { type: "return-to-hand", target: "CHOSEN_CHARACTER" },
    },
  ],
};
export const set14AuditLouieReturnedFixture = createFixture({
  id: "set14-audit-louie-returned",
  name: "Hyperia audit: Support synthetic source returned",
  skipPreGame: true,
  seed: "set14-audit-louie-returned",
  description:
    "Synthetic ordering probe. Quest boosted King Louie at Stadium (Strength three). Resolve TEST SOURCE DEPARTURE first, choosing Louie. Then accept retained Support on Fru Fru: one to four using last-known Strength three. Pass to remove the bonus. Inspect both logs.",
  playerOne: {
    play: [
      khanStadiumStateOfTheArt,
      { card: kingLouieIceCreamVirtuoso, isDrying: false, atLocation: khanStadiumStateOfTheArt },
      louieReturnedObserver,
      fruFruVipGuest,
    ],
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditEarlyAmberFixture = createFixture({
  id: "set14-audit-early-amber",
  name: "Hyperia audit: Priya, Judy and Miguel",
  description:
    "Play Priya and reduce the opposing character's strength. Play Judy and choose a healing amount. Sing Though I Have to Say Goodbye with Miguel to gain lore. Pass both turns to check Priya's duration.",
  skipPreGame: true,
  seed: "set14-audit-early-amber",
  playerOne: {
    play: [{ card: miguelRiveraPromisingMusician, isDrying: false }],
    hand: [
      auroraDelightfulMusician,
      powerlineMegastar,
      goofyDancingSuperstar,
      priyaMangalImmovableFan,
      judyHoppsHelpfulOfficer,
      thoughIHaveToSayGoodbye,
    ],
    deck: [...deck, ...deck],
    inkwell: 10,
  },
  playerTwo: {
    play: [{ card: archimedesHasHadEnough, damage: 3, exerted: true }],
    deck,
    inkwell: 10,
  },
});

export const set14AuditAuroraFixture = createFixture({
  id: "set14-audit-aurora",
  name: "Hyperia audit: Aurora's current-turn song return",
  description:
    "Play Though I Have to Say Goodbye, then Aurora. Only the song played this turn can return; the older copy and cost-four song in discard must stay. Pass the turn to check her one-lore trigger.",
  skipPreGame: true,
  seed: "set14-audit-aurora",
  playerOne: {
    play: [priyaMangalImmovableFan],
    hand: [thoughIHaveToSayGoodbye, auroraDelightfulMusician],
    discard: [thoughIHaveToSayGoodbye, magnificentMarvelous, fruFruVipGuest],
    deck: [...deck, ...deck],
    inkwell: 12,
  },
  playerTwo: { deck, inkwell: 10 },
});

export const set14AuditPowerlineFixture = createFixture({
  id: "set14-audit-powerline",
  name: "Hyperia audit: Powerline's discard-only Singer return",
  description:
    "Play or sing Though I Have to Say Goodbye. Backup Singers can return Goofy from discard, but must not offer the in-play Powerline or Gazelle. Quest Powerline to verify Perfect Harmony's lore bonus.",
  skipPreGame: true,
  seed: "set14-audit-powerline",
  playerOne: {
    play: [powerlineMegastar, gazellePopDiva],
    hand: [thoughIHaveToSayGoodbye],
    discard: [goofyDancingSuperstar, fruFruVipGuest],
    deck: [...deck, ...deck],
    inkwell: 12,
  },
  playerTwo: { deck, inkwell: 10 },
});

export const set14AuditRussellFixture = createFixture({
  id: "set14-audit-russell",
  name: "Hyperia audit: Russell's mandatory public reveal",
  description:
    "Activate Russell to reveal one character and one action. The character must enter hand; only the action can go to the deck bottom.",
  skipPreGame: true,
  seed: "set14-audit-russell",
  playerOne: {
    play: [{ card: russellFindingAdventure, isDrying: false }],
    deck: [...deck, fruFruVipGuest, magnificentMarvelous],
    inkwell: 10,
  },
  playerTwo: { deck, inkwell: 10 },
});

export const set14AuditMickeyReturnSongFixture = createFixture({
  id: "set14-audit-mickey-return-song",
  name: "Hyperia audit: Mickey and optional character return",
  description:
    "Mickey must quest before the turn can end. Sing Never Gonna Let You Cry with Powerline; return zero, one or two eligible characters from discard. Aurora and the action cannot return. End the turn after Mickey quests to give each player one drop.",
  skipPreGame: true,
  seed: "set14-audit-mickey-return-song",
  playerOne: {
    play: [
      { card: mickeyMouseBestInTown, isDrying: false },
      { card: powerlineMegastar, isDrying: false },
    ],
    hand: [neverGonnaLetYouCry],
    discard: [
      fruFruVipGuest,
      priyaMangalImmovableFan,
      auroraDelightfulMusician,
      magnificentMarvelous,
    ],
    deck,
    inkwell: 10,
  },
  playerTwo: { deck, inkwell: 10 },
});

export const set14AuditRememberMeFixture = createFixture({
  id: "set14-audit-remember-me",
  name: "Hyperia audit: Remember Me discard permission",
  description:
    "Play Remember Me, then play Fru Fru and Priya from discard. They enter exerted and cost ink. The Fru Fru in hand must become unavailable after the discard copy enters. The action and opposing discard are excluded.",
  skipPreGame: true,
  seed: "set14-audit-remember-me",
  playerOne: {
    hand: [rememberMe, fruFruVipGuest],
    play: [aladdinPrinceAli, koslovImposingEnforcer],
    discard: [fruFruVipGuest, priyaMangalImmovableFan, magnificentMarvelous],
    deck,
    inkwell: 10,
  },
  playerTwo: { discard: [fruFruVipGuest], deck, inkwell: 10 },
});

export const set14AuditAmberItemsFixture = createFixture({
  id: "set14-audit-amber-items",
  name: "Hyperia audit: Singer items",
  description:
    "Give Archimedes Singer with Ancestral Guitar. Speaker Stack must grant +1 strength/willpower. Archimedes can then sing Never Gonna Let You Cry. Use Mamá Imelda's Blessing on Powerline: -1 strength and no singing throughout the next player's turn.",
  skipPreGame: true,
  seed: "set14-audit-amber-items",
  playerOne: {
    play: [
      ancestralGuitar,
      speakerStack,
      mamImeldasBlessing,
      { card: archimedesHasHadEnough, isDrying: false },
    ],
    hand: [neverGonnaLetYouCry, speakerStack, breakCard, breakCard],
    deck,
    inkwell: 10,
  },
  playerTwo: {
    play: [{ card: powerlineMegastar, isDrying: false }],
    hand: [neverGonnaLetYouCry],
    deck,
    inkwell: 10,
  },
});

export const set14AuditNextReadyFixture = createFixture({
  id: "set14-audit-next-ready",
  name: "Hyperia audit: next-start ready and mill batches",
  description:
    "Mill with Rivera Family Photo to raise Mamá Coco's lore. Play Tía Victoria and choose Powerline. At the next turn, Powerline stays exerted while Archimedes readies. Play Never Gonna Let You Cry to trigger Jukebox and ready Powerline during the main phase.",
  skipPreGame: true,
  seed: "set14-audit-next-ready",
  playerOne: {
    play: [{ card: mamCocoVisitingThePark, isDrying: false }, riveraFamilyPhoto],
    hand: [taVictoriaDisapprovingAncestor],
    deck: [...deck, ...deck],
    inkwell: 10,
  },
  playerTwo: {
    play: [
      { card: powerlineMegastar, exerted: true },
      { card: archimedesHasHadEnough, exerted: true },
      jukebox,
    ],
    hand: [neverGonnaLetYouCry],
    discard: [neverGonnaLetYouCry],
    deck,
    inkwell: 10,
  },
});

export const set14AuditRapunzelFixture = createFixture({
  id: "set14-audit-rapunzel",
  name: "Hyperia audit: Rapunzel hand reveal and matching name",
  description:
    "Quest with Rapunzel, choose opposing Fru Fru and reveal your Fru Fru from hand. Draw one card only when the names match. Priya is a nonmatching reveal; the item is excluded.",
  skipPreGame: true,
  seed: "set14-audit-rapunzel",
  playerOne: {
    play: [{ card: rapunzelOutgoingArtist, isDrying: false }],
    hand: [fruFruVipGuest, priyaMangalImmovableFan, ancestralGuitar],
    deck,
    inkwell: 10,
  },
  playerTwo: { play: [fruFruVipGuest], deck, inkwell: 10 },
});

export const set14AuditRapunzelMissingRevealFixture = createFixture({
  id: "set14-audit-rapunzel-missing-reveal",
  name: "Hyperia audit: Rapunzel missing reveal card",
  description:
    "Quest with the first Rapunzel and choose another character while only an item is in hand: no reveal or draw. Ink the item, then quest with the second Rapunzel and choose another character with an empty hand: finish without a reveal or draw.",
  skipPreGame: true,
  seed: "set14-audit-rapunzel-missing-reveal",
  playerOne: {
    play: [rapunzelOutgoingArtist, rapunzelOutgoingArtist, fruFruVipGuest],
    hand: [ancestralGuitar],
    deck,
  },
  playerTwo: { play: [fruFruVipGuest], deck },
});

export const set14AuditRapunzelPlayerTwoFixture = createFixture({
  id: "set14-audit-rapunzel-player-two",
  name: "Hyperia audit: Rapunzel player-two reveal",
  description:
    "Pass to player two. Quest with one Rapunzel, choose friendly Fru Fru and reveal a Fru Fru from your hand: draw exactly one and return the revealed card to private hand. Quest with the second Rapunzel and decline. Inspect both views and logs.",
  skipPreGame: true,
  seed: "set14-audit-rapunzel-player-two",
  playerOne: { play: [fruFruVipGuest], deck },
  playerTwo: {
    play: [rapunzelOutgoingArtist, rapunzelOutgoingArtist, fruFruVipGuest],
    hand: [fruFruVipGuest, ancestralGuitar],
    deck,
  },
});

export const set14AuditMerlinOwlFixture = createFixture({
  id: "set14-audit-merlin-owl",
  name: "Hyperia audit: Merlin quest draw and Owl challenge drop",
  description:
    "Quest with Merlin to draw one. Play Archimedes, then use Rush to challenge exerted Goliath. Archimedes is banished and gives you one drop. Play the Merlin in hand to gain one more drop. Check that the log names both sources and the counter rises separately.",
  skipPreGame: true,
  seed: "set14-audit-merlin-owl",
  playerOne: {
    play: [{ card: merlinProfoundlyCurious, isDrying: false }],
    hand: [merlinProfoundlyCurious, archimedesMessengerOwl],
    deck,
    inkwell: 10,
  },
  playerTwo: { play: [{ card: goliathTransformedWarrior, exerted: true }], deck, inkwell: 10 },
});

export const set14AuditGoliathDemonaFixture = createFixture({
  id: "set14-audit-goliath-demona",
  name: "Hyperia audit: Goliath damage and Demona keywords",
  description:
    "Discard with Goliath to move up to two damage to an opposing character. Play Lexington, then discard with Demona to grant Rush and Evasive. Challenge exerted Powerline with Lexington.",
  skipPreGame: true,
  seed: "set14-audit-goliath-demona",
  playerOne: {
    play: [
      { card: goliathTransformedWarrior, damage: 3, isDrying: false },
      { card: demonaImperiousSpellcaster, exerted: true, isDrying: false },
    ],
    hand: [fruFruVipGuest, priyaMangalImmovableFan, lexingtonFearlessFlier],
    deck,
    inkwell: 10,
  },
  playerTwo: {
    play: [{ card: powerlineMegastar, exerted: true }, archimedesHasHadEnough],
    deck,
    inkwell: 10,
  },
});

export const set14AuditDanteJuanitaFixture = createFixture({
  id: "set14-audit-dante-juanita",
  name: "Hyperia audit: Dante Shift and Juanita discard threshold",
  description:
    "Shift Loyal Alebrije onto ready Dante for four ink. With nine existing discard cards, Juanita draws two. After the song enters discard, Dante quests for four lore.",
  skipPreGame: true,
  seed: "set14-audit-dante-juanita",
  playerOne: {
    play: [{ card: danteEnthusiasticStray, isDrying: false }],
    hand: [danteLoyalAlebrije, everyoneKnowsJuanita],
    discard: [
      fruFruVipGuest,
      fruFruVipGuest,
      fruFruVipGuest,
      fruFruVipGuest,
      fruFruVipGuest,
      fruFruVipGuest,
      fruFruVipGuest,
      fruFruVipGuest,
      fruFruVipGuest,
    ],
    deck,
    inkwell: 10,
  },
  playerTwo: { play: [{ card: powerlineMegastar, exerted: true }], deck, inkwell: 10 },
});

export const set14AuditMaliceFigitusFixture = createFixture({
  id: "set14-audit-malice-figitus",
  name: "Hyperia audit: Mim damage and Figitus drop payment",
  description:
    "Sing Higitus Figitus with ready Dante to gain three drops. Arm drop payment, use two drops to play Mim's Malice and move two damage from Goliath to Powerline, then use the last drop to play Fru Fru. No ready ink is available.",
  skipPreGame: true,
  seed: "set14-audit-malice-figitus",
  playerOne: {
    play: [
      { card: goliathTransformedWarrior, damage: 3, isDrying: false },
      { card: danteLoyalAlebrije, isDrying: false },
    ],
    hand: [mimsMalice, higitusFigitus, fruFruVipGuest],
    deck,
    inkwell: 0,
  },
  playerTwo: { play: [{ card: powerlineMegastar, exerted: true }], deck, inkwell: 10 },
});

export const set14AuditPocoLocoFixture = createFixture({
  id: "set14-audit-poco-loco",
  name: "Hyperia audit: Un Poco Loco chosen pair",
  description:
    "Sing Together with Fru Fru and Dante, then return those two singers. Play the second song choosing Goliath and Merlin; both cost more than three and must remain in play. Opposing Powerline is not a valid choice.",
  skipPreGame: true,
  seed: "set14-audit-poco-loco",
  playerOne: {
    hand: [unPocoLoco, unPocoLoco],
    play: [fruFruVipGuest, danteLoyalAlebrije, goliathTransformedWarrior, merlinProfoundlyCurious],
    deck,
    inkwell: 3,
  },
  playerTwo: { play: [powerlineMegastar], deck, inkwell: 3 },
});

export const set14AuditMagnificentFixture = createFixture({
  id: "set14-audit-magnificent",
  name: "Hyperia audit: Magnificent lore and draw",
  description:
    "Play one song using four ink. Sing the second using ready Goliath. Each must gain two lore, draw one card and log both outcomes.",
  skipPreGame: true,
  seed: "set14-audit-magnificent",
  playerOne: {
    hand: [magnificentMarvelous, magnificentMarvelous],
    play: [goliathTransformedWarrior],
    deck,
    inkwell: 4,
  },
  playerTwo: { deck, inkwell: 4 },
});

export const set14AuditCreativeFixture = createFixture({
  id: "set14-audit-creative",
  name: "Hyperia audit: Creative Inspiration exact draw",
  description:
    "Play Creative Inspiration for seven ink. Draw exactly four cards, leave two in the deck, and show the draw outcome in the log.",
  skipPreGame: true,
  seed: "set14-audit-creative",
  playerOne: { hand: [creativeInspiration], deck, inkwell: 7 },
  playerTwo: { deck, inkwell: 7 },
});

export const set14AuditWandFixture = createFixture({
  id: "set14-audit-wand",
  name: "Hyperia audit: Merlin's Wand reveal cost",
  description:
    "Activate Magic Touch by revealing both Demona cards. Fru Fru is not a valid pair choice. Play one Demona for two ink; the second must cost three and be unavailable with only two ink left.",
  skipPreGame: true,
  seed: "set14-audit-wand",
  playerOne: {
    play: [merlinsWand],
    hand: [demonaImperiousSpellcaster, demonaImperiousSpellcaster, fruFruVipGuest],
    deck,
    inkwell: 4,
  },
  playerTwo: { deck, inkwell: 4 },
});

export const set14AuditSkatesPlayerTwoFixture = createFixture({
  id: "set14-audit-skates-player-two",
  name: "Hyperia audit: Inkcaster Skates Player Two",
  skipPreGame: true,
  seed: "set14-audit-skates-player-two",
  description:
    "Opposing quest history does not qualify. Activate one copy before questing, the second after two quests, spend the drop on Fru Fru, then verify next-own-turn reset and another reward.",
  playerOne: { play: [inkcasterSkates, koslovImposingEnforcer], inkDrops: 3, deck },
  playerTwo: {
    play: [inkcasterSkates, inkcasterSkates, koslovImposingEnforcer, koslovImposingEnforcer],
    hand: [fruFruVipGuest],
    deck,
  },
});

export const set14AuditMarketPlayerTwoFixture = createFixture({
  id: "set14-audit-market-player-two",
  name: "Hyperia audit: Magical Market Player Two",
  description:
    "Pass to Player Two. Move Koslov between the two exact Markets four times: each copy rewards once, then neither repeats. Pass both turns and move twice more: each copy rewards again. Only Player Two draws and gains lore.",
  skipPreGame: true,
  seed: "set14-audit-market-player-two",
  playerOne: { play: [merlinsShopAndSmithyMagicalMarket], lore: 4, deck },
  playerTwo: {
    play: [
      merlinsShopAndSmithyMagicalMarket,
      merlinsShopAndSmithyMagicalMarket,
      koslovImposingEnforcer,
    ],
    inkwell: 8,
    deck: [...deck, ...deck],
  },
});

// Test-only action isolates movement outside the Market controller's turn.
export const set14AuditMarketOpposingMoveFixture = createFixture({
  id: "set14-audit-market-opposing-move",
  name: "Hyperia audit: Magical Market opposing-turn diagnostic",
  description:
    "Play Audit Market Transport. Player Two's Koslov moves to their Market on Player One's turn without a draw or lore reward. This is a synthetic harness action, not a printed card.",
  skipPreGame: true,
  seed: "set14-audit-market-opposing-move",
  playerOne: {
    hand: [
      {
        ...dragonFire,
        id: "audit-market-transport",
        canonicalId: "audit-market-transport",
        slug: "audit-market-transport",
        printings: [],
        reprints: [],
        name: "Audit Market Transport",
        i18n: {
          en: { name: "Audit Market Transport" },
          de: { name: "Audit Market Transport" },
          es: { name: "Audit Market Transport" },
          fr: { name: "Audit Market Transport" },
          it: { name: "Audit Market Transport" },
        },
        cost: 1,
        text: "Test only: Move each opposing character to their location for free.",
        abilities: [
          {
            type: "action",
            effect: {
              type: "move-to-location",
              cost: "free",
              character: {
                selector: "all",
                count: "all",
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["character"],
              },
              location: {
                selector: "all",
                count: "all",
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["location"],
              },
            },
          },
        ],
      },
    ],
    inkwell: 1,
    deck,
  },
  playerTwo: { play: [merlinsShopAndSmithyMagicalMarket, koslovImposingEnforcer], deck },
});

export const set14AuditMarketEmptyDeckFixture = createFixture({
  id: "set14-audit-market-empty-deck",
  name: "Hyperia audit: Magical Market empty deck",
  description:
    "Move Koslov to the Market with an empty deck. No card is drawn, but the following gain of one lore must resolve. Pass to reach the empty-deck loss boundary and inspect the log.",
  skipPreGame: true,
  seed: "set14-audit-market-empty-deck",
  playerOne: {
    play: [merlinsShopAndSmithyMagicalMarket, koslovImposingEnforcer],
    inkwell: 2,
    deck: [],
  },
  playerTwo: { deck },
});

export const set14AuditSkatesMarketFixture = createFixture({
  id: "set14-audit-skates-market",
  name: "Hyperia audit: Skates drops and Market movement",
  description:
    "Quest with both characters, activate Skates once to gain one drop, then arm payment and play Fru Fru with that drop. Move both questers to the Market for two ink each; only the first move draws one card and gains one lore.",
  skipPreGame: true,
  seed: "set14-audit-skates-market",
  playerOne: {
    play: [
      inkcasterSkates,
      merlinsShopAndSmithyMagicalMarket,
      goliathTransformedWarrior,
      danteLoyalAlebrije,
    ],
    hand: [fruFruVipGuest],
    deck,
    inkwell: 4,
  },
  playerTwo: { deck, inkwell: 4 },
});

export const set14AuditHiroVersatilePlayerTwoFixture = createFixture({
  id: "set14-audit-hiro-versatile-player-two",
  name: "Hyperia audit: Hiro Versatile Player Two",
  description:
    "Pass to Player Two. First Hiro pays one extra ink to give own Ward Koslov Evasive; second declines; third pays to choose himself. Quest Koslov now, then quest all three Hiros after they dry on the next own turn. During the opposing turn plain Koslov cannot challenge the boosted Koslov, while Evasive Hiro can. After the grant expires, re-exert Koslov and verify the ordinary attacker can challenge him. Self-targeted Hiro keeps printed Evasive.",
  skipPreGame: true,
  seed: "set14-audit-hiro-versatile-player-two",
  playerOne: { play: [koslovImposingEnforcer, hiroHamadaVersatileInventor], deck },
  playerTwo: {
    play: [auroraDreamingGuardian, koslovImposingEnforcer, inkcasterSkates],
    hand: [hiroHamadaVersatileInventor, hiroHamadaVersatileInventor, hiroHamadaVersatileInventor],
    inkwell: 8,
    deck: [...deck, ...deck],
  },
});

export const set14AuditHiroVersatileNoInkFixture = createFixture({
  id: "set14-audit-hiro-versatile-no-ink",
  name: "Hyperia audit: Hiro Versatile no extra ink",
  description:
    "Pass to Player Two. Play Hiro with exactly two ink. Turbo Thrusters cannot be paid: no target choice or Evasive grant should block play. Quest Koslov and pass. Check the automatic choosing-no outcome and actual quest logs; Hiro retains printed Evasive.",
  skipPreGame: true,
  seed: "set14-audit-hiro-versatile-no-ink",
  playerOne: { deck },
  playerTwo: {
    play: [koslovImposingEnforcer],
    hand: [hiroHamadaVersatileInventor],
    inkwell: 2,
    deck,
  },
});

export const set14AuditGoGoExtremePlayerTwoFixture = createFixture({
  id: "set14-audit-go-go-extreme-player-two",
  name: "Hyperia audit: Go Go Extreme Player Two",
  description:
    "The ready Go Go cannot be challenged or earn a drop. Challenge the exerted copy with ready Tinker Bell, Dante, then Fru Fru: zero, zero, lethal challenges each earn one defending drop. Pass to Player Two, spend a saved drop on Fru Fru, and challenge the exerted opposing Tinker Bell with the surviving Go Go: no offensive reward. On the next opposing turn, challenge that now-exerted copy with Fru Fru for its own lethal reward. Check exact drops, both logs and discard consistency.",
  skipPreGame: true,
  seed: "set14-audit-go-go-extreme-player-two",
  playerOne: {
    play: [
      tinkerBellCuriousFairy,
      danteStrangeAndEndearing,
      fruFruVipGuest,
      { card: tinkerBellCuriousFairy, exerted: true },
    ],
    inkDrops: 4,
    deck,
  },
  playerTwo: {
    play: [{ card: goGoTomagoExtremeTester, exerted: true }, goGoTomagoExtremeTester],
    hand: [fruFruVipGuest],
    inkDrops: 2,
    deck,
  },
});

export const set14AuditHiroGoGoFixture = createFixture({
  id: "set14-audit-hiro-gogo",
  name: "Hyperia audit: Hiro Evasive and Go Go challenge drops",
  description:
    "Play Hiro and pay one extra ink to give Goliath Evasive. Pass, then challenge exerted Go Go with Tinker Bell and Dante for zero damage, then Fru Fru for lethal damage. Each challenge gives Go Go's controller one drop, including the fatal challenge.",
  skipPreGame: true,
  seed: "set14-audit-hiro-gogo",
  playerOne: {
    play: [{ card: goGoTomagoExtremeTester, exerted: true }, goliathTransformedWarrior],
    hand: [hiroHamadaVersatileInventor],
    deck,
    inkwell: 3,
  },
  playerTwo: {
    play: [tinkerBellCuriousFairy, danteStrangeAndEndearing, fruFruVipGuest],
    deck,
    inkwell: 4,
  },
});

export const set14AuditMollyKitPlayerTwoFixture = createFixture({
  id: "set14-audit-molly-kit-player-two",
  name: "Hyperia audit: Molly and Kit Player Two shared drops",
  description:
    "Pass to Player Two. Play two exact Mollys and two exact Kits, choosing only Player One each time. Opposing view cannot resolve the choice. Each entry adds one to each existing pool: Player One four to eight, Player Two two to six. Spend one drop on Fru Fru at zero ink. Pass and spend one of Player One's saved shared drops on their Fru Fru. Check both source/reward/payment logs and private draws.",
  skipPreGame: true,
  seed: "set14-audit-molly-kit-player-two",
  playerOne: { hand: [fruFruVipGuest], inkDrops: 4, deck },
  playerTwo: {
    hand: [
      mollyCunninghamRemembersToShare,
      mollyCunninghamRemembersToShare,
      kitCloudkickerIrrepressibleBear,
      kitCloudkickerIrrepressibleBear,
      fruFruVipGuest,
    ],
    inkwell: 10,
    inkDrops: 2,
    deck,
  },
});

export const set14AuditMollyKitFixture = createFixture({
  id: "set14-audit-molly-kit",
  name: "Hyperia audit: Molly and Kit other-player drops",
  description:
    "Play Molly and Kit. Each grants one drop to you and one to the other chosen player. The controller must not be offered as the other player.",
  skipPreGame: true,
  seed: "set14-audit-molly-kit",
  playerOne: {
    hand: [mollyCunninghamRemembersToShare, kitCloudkickerIrrepressibleBear],
    deck,
    inkwell: 5,
  },
  playerTwo: { deck, inkwell: 4 },
});

export const set14AuditBelleFixture = createFixture({
  id: "set14-audit-belle",
  name: "Hyperia audit: Belle reveal and named item",
  description:
    "Play Belle: reveal the City Guide and take it. Play the second Belle: reveal Skates and put it on the bottom. Both cards must be publicly revealed.",
  skipPreGame: true,
  seed: "set14-audit-belle",
  playerOne: {
    hand: [belleReflectiveWriter, belleReflectiveWriter],
    deck: [fruFruVipGuest, inkcasterSkates, bellesCityGuide],
    inkwell: 4,
  },
  playerTwo: { deck, inkwell: 4 },
});

export const set14AuditBelleSongFixture = createFixture({
  id: "set14-audit-belle-song",
  name: "Hyperia audit: Belle song reveal and decline",
  description:
    "Play Belle and take the revealed song. Play the second Belle and decline the next song, placing it below Fru Fru.",
  skipPreGame: true,
  seed: "set14-audit-belle-song",
  playerOne: {
    hand: [belleReflectiveWriter, belleReflectiveWriter],
    deck: [fruFruVipGuest, everyoneKnowsJuanita, magnificentMarvelous],
    inkwell: 4,
  },
  playerTwo: { deck, inkwell: 4 },
});

export const set14AuditFredFixture = createFixture({
  id: "set14-audit-fred",
  name: "Hyperia audit: Fred's team selection",
  description:
    "Play Fred, take Hiro or Skates, and order the rest below the untouched card. Fru Fru cannot go to hand.",
  skipPreGame: true,
  seed: "set14-audit-fred",
  playerOne: {
    hand: [fredAssemblingTheTeam],
    inkwell: 3,
    deck: [
      bellesCityGuide,
      fruFruVipGuest,
      hiroHamadaVersatileInventor,
      inkcasterSkates,
      belleReflectiveWriter,
    ],
  },
  playerTwo: { deck, inkwell: 3 },
});

export const set14AuditHookJockFixture = createFixture({
  id: "set14-audit-hook-jock",
  name: "Hyperia audit: Hook and Jock",
  description:
    "Play Hook and quest with Jock. Opposing Fru Fru cannot challenge Jock, while Hiro can. On the next turn Hook cannot challenge the opposing Jock but can quest for three lore.",
  skipPreGame: true,
  seed: "set14-audit-hook-jock",
  playerOne: {
    hand: [captainHookConcernedCaptain],
    inkwell: 8,
    deck,
    play: [{ card: jockEnjoyingTheSights, isDrying: false }],
  },
  playerTwo: {
    deck,
    inkwell: 3,
    play: [
      { card: fruFruVipGuest, isDrying: false },
      { card: hiroHamadaVersatileInventor, isDrying: false },
      { card: jockEnjoyingTheSights, exerted: true, isDrying: false },
    ],
  },
});

export const set14AuditLadyFixture = createFixture({
  id: "set14-audit-lady",
  name: "Hyperia audit: Lady Ward",
  description:
    "Use your Distract on Lady, quest, then switch to the opponent. Opposing Distract cannot choose either Lady; Fru Fru can challenge one. Grab Your Sword affects the remaining Lady despite Ward.",
  skipPreGame: true,
  seed: "set14-audit-lady",
  playerOne: {
    hand: [distract, ladyRelaxedAndRested],
    inkwell: 2,
    deck,
    play: [
      { card: ladyRelaxedAndRested, isDrying: false },
      { card: ladyRelaxedAndRested, isDrying: false },
      { card: captainHookConcernedCaptain, isDrying: false },
    ],
  },
  playerTwo: {
    hand: [distract, grabYourSword],
    deck,
    inkwell: 7,
    play: [{ card: fruFruVipGuest, isDrying: false }],
  },
});

export const set14AuditRebeccaFixture = createFixture({
  id: "set14-audit-rebecca",
  name: "Hyperia audit: Rebecca draw and discard",
  description:
    "Play three copies. Accept the first draw and discard Skates, accept the second and discard the new Belle, then decline the third. Opponent logs must hide retained draw identities.",
  skipPreGame: true,
  seed: "set14-audit-rebecca",
  playerOne: {
    hand: [
      rebeccaCunninghamSavvyManager,
      rebeccaCunninghamSavvyManager,
      rebeccaCunninghamSavvyManager,
      inkcasterSkates,
    ],
    inkwell: 9,
    deck: [fruFruVipGuest, fruFruVipGuest, belleReflectiveWriter, goGoTomagoExtremeTester],
  },
  playerTwo: { deck, inkwell: 3 },
});

export const set14AuditShereKhanFixture = createFixture({
  id: "set14-audit-shere-khan",
  name: "Hyperia audit: Shere Khan discard or drop",
  description:
    "Play two copies. The opponent declines the first and discards Skates for the second. Spend the one saved drop to play Fru Fru with no bank ink.",
  skipPreGame: true,
  seed: "set14-audit-shere-khan",
  playerOne: {
    hand: [shereKhanOpportunisticTycoon, shereKhanOpportunisticTycoon, fruFruVipGuest],
    inkwell: 8,
    deck,
  },
  playerTwo: { hand: [inkcasterSkates], deck },
});

export const set14AuditHoraceFixture = createFixture({
  id: "set14-audit-horace",
  name: "Hyperia audit: Horace damaged opponents",
  description:
    "Play Horace twice: choose damaged Jock, then damaged Fru Fru. Healthy Hiro, damaged Ward Aladdin and your own damaged Hook must not be selectable.",
  skipPreGame: true,
  seed: "set14-audit-horace",
  playerOne: {
    hand: [horaceClumsyClod, horaceClumsyClod],
    inkwell: 6,
    play: [{ card: captainHookConcernedCaptain, damage: 1, isDrying: false }],
    deck,
  },
  playerTwo: {
    play: [
      { card: jockEnjoyingTheSights, damage: 1, isDrying: false },
      { card: fruFruVipGuest, damage: 2, isDrying: false },
      { card: aladdinPrinceAli, damage: 1, isDrying: false },
      { card: hiroHamadaVersatileInventor, isDrying: false },
    ],
    deck,
  },
});

export const set14AuditRuthlessFixture = createFixture({
  id: "set14-audit-ruthless",
  name: "Hyperia audit: Shere Khan current strength",
  description:
    "Distract opposing Jock, then play Shere Khan and put Jock below the opponent's existing deck. Own Fru Fru, Ward Aladdin and high-strength Hook must not be selectable.",
  skipPreGame: true,
  seed: "set14-audit-ruthless",
  playerOne: {
    hand: [distract, shereKhanRuthlessEntrepreneur],
    inkwell: 9,
    play: [{ card: fruFruVipGuest, isDrying: false }],
    deck,
  },
  playerTwo: {
    play: [
      { card: jockEnjoyingTheSights, isDrying: false },
      { card: fruFruVipGuest, isDrying: false },
      { card: aladdinPrinceAli, isDrying: false },
      { card: captainHookConcernedCaptain, isDrying: false },
    ],
    deck,
  },
});

export const set14AuditBobbyFixture = createFixture({
  id: "set14-audit-bobby",
  name: "Hyperia audit: Bobby granted drop ability",
  description:
    "Activate one Cheese-a with bank ink, the second with its earned drop, then Befuddle Bobby. The third ready Cheese-a loses Scrumptious; Skates and the opposing Cheese-a never gain it.",
  skipPreGame: true,
  seed: "set14-audit-bobby",
  playerOne: {
    hand: [befuddle],
    inkwell: 2,
    play: [
      { card: bobbyZimuruskiSoundboardWhiz, isDrying: false },
      leaningTowerOfCheesea,
      leaningTowerOfCheesea,
      leaningTowerOfCheesea,
      inkcasterSkates,
    ],
    deck,
  },
  playerTwo: { play: [leaningTowerOfCheesea], deck },
});

export const set14AuditBobbyDropOnlyFixture = createFixture({
  id: "set14-audit-bobby-drop-only",
  name: "Hyperia audit: Bobby drop-only activation",
  description:
    "With no bank ink and one saved drop, activate the ready Cheese-a and verify drop payment, reward and exertion.",
  skipPreGame: true,
  seed: "set14-audit-bobby-drop-only",
  playerOne: { inkDrops: 1, play: [bobbyZimuruskiSoundboardWhiz, leaningTowerOfCheesea], deck },
  playerTwo: { deck },
});

export const set14AuditBaymaxLabPlayerTwoFixture = createFixture({
  id: "set14-audit-baymax-lab-player-two",
  name: "Hyperia audit: Baymax Lab Player Two timing",
  description:
    "Pass to Player Two. Play Baymax with zero own items: opposing items and own hand/discard items do not qualify. Play both Mouse Armors: no retroactive reward. Play the second Baymax with two items for exactly two drops. Quest the original dry Baymax: no reward. Spend a drop on Fru Fru at zero ink. Pass both turns and quest all three Baymax copies with two items: no quest reward. Verify both logs and unchanged opposing pool.",
  skipPreGame: true,
  seed: "set14-audit-baymax-lab-player-two",
  playerOne: { play: [inkcasterSkates, merlinsWand], inkDrops: 4, deck },
  playerTwo: {
    play: [baymaxLabAssistant],
    hand: [baymaxLabAssistant, baymaxLabAssistant, mouseArmor, mouseArmor, fruFruVipGuest],
    discard: [mouseArmor],
    inkwell: 12,
    inkDrops: 3,
    deck: [...deck, ...deck],
  },
});

export const set14AuditBaymaxLabFixture = createFixture({
  id: "set14-audit-baymax-lab",
  name: "Hyperia audit: Baymax item threshold",
  description:
    "Play Baymax with two items for two drops. Befuddle your Cheese-a, play the next Baymax with only Skates (opponent items do not count), then spend one saved drop to play Fru Fru at bank zero.",
  skipPreGame: true,
  seed: "set14-audit-baymax-lab",
  playerOne: {
    hand: [baymaxLabAssistant, baymaxLabAssistant, befuddle, fruFruVipGuest],
    inkwell: 9,
    play: [leaningTowerOfCheesea, inkcasterSkates],
    deck,
  },
  playerTwo: { play: [leaningTowerOfCheesea, inkcasterSkates], deck },
});

export const set14AuditFredBossPlayerTwoRemovalFixture = createFixture({
  id: "set14-audit-fred-boss-player-two-removal",
  name: "Hyperia audit: Fred Boss Player Two source removal",
  description:
    "Pass to Player Two and quest the damaged Fred. Shift onto that own damaged/exerted Fred only: opposing Fred and own Fru are invalid bases. Normal-play the second Boss, then Skates, Fru and Baymax. Two active copies reward only Super characters. Spend one drop on the drawn Fru at zero ink, then pass: Player One removes the shifted source with Dragon Fire and plays opposing Hiro without rewarding the bosses. Next Baymax earns one drop. Remove the final Boss, then play the last Baymax: no Radical Resources reward. Remaining drops persist. Baymax has only one item and cannot reward Resupply.",
  skipPreGame: true,
  seed: "set14-audit-fred-boss-player-two-removal",
  playerOne: {
    play: [fredAssemblingTheTeam],
    hand: [dragonFire, dragonFire, hiroHamadaVersatileInventor],
    inkwell: 7,
    inkDrops: 4,
    deck,
  },
  playerTwo: {
    play: [{ card: fredAssemblingTheTeam, exerted: true, damage: 1 }, fruFruVipGuest],
    hand: [
      fredAwesomeBoss,
      fredAwesomeBoss,
      inkcasterSkates,
      fruFruVipGuest,
      baymaxLabAssistant,
      baymaxLabAssistant,
      baymaxLabAssistant,
    ],
    inkwell: 18,
    inkDrops: 1,
    deck: [...deck, ...deck],
  },
});

export const set14AuditFredBossFixture = createFixture({
  id: "set14-audit-fred-boss",
  name: "Hyperia audit: Fred Super play rewards and Shift",
  description:
    "Shift onto Fred, play another Fred for two rewards, play Super Skates for none, then spend saved drops on Super Hiro for two new rewards. Opponent Super plays must not reward your Freds.",
  skipPreGame: true,
  seed: "set14-audit-fred-boss",
  playerOne: {
    hand: [fredAwesomeBoss, fredAwesomeBoss, inkcasterSkates, hiroHamadaVersatileInventor],
    play: [fredAssemblingTheTeam],
    inkwell: 16,
    deck,
  },
  playerTwo: { hand: [hiroHamadaVersatileInventor], inkwell: 4, deck },
});

export const set14AuditLesterFixture = createFixture({
  id: "set14-audit-lester",
  name: "Hyperia audit: Lester Reckless and defender banish",
  description:
    "Grant Reckless to opposing Fru Fru with bank ink and Hook with six saved drops. Quest Lester; weak Fru Fru damage must not lose lore, then Hook banishes Lester and loses two lore. Ward Aladdin and own characters are excluded.",
  skipPreGame: true,
  seed: "set14-audit-lester",
  playerOne: {
    play: [lesterThePossumParkMascot, fruFruVipGuest],
    inkwell: 6,
    inkDrops: 6,
    lore: 5,
    deck,
  },
  playerTwo: {
    play: [fruFruVipGuest, captainHookConcernedCaptain, aladdinPrinceAli],
    lore: 5,
    deck,
  },
});
export const set14AuditLesterAttackingFixture = createFixture({
  id: "set14-audit-lester-attacking",
  name: "Hyperia audit: Lester attacking banish exclusion",
  description:
    "Challenge exerted opposing Hook with Lester. Lester is banished as the attacker; no opponent lore is lost.",
  skipPreGame: true,
  seed: "set14-audit-lester-attacking",
  playerOne: { play: [lesterThePossumParkMascot], lore: 5, deck },
  playerTwo: { play: [{ card: captainHookConcernedCaptain, exerted: true }], lore: 5, deck },
});

export const set14AuditDonKarnagePlayerTwoRemovalFixture = createFixture({
  id: "set14-audit-don-karnage-player-two-removal",
  name: "Hyperia audit: Don Karnage independent source removal",
  description:
    "Pass to Player Two and quest both Don copies. Their own damaged Fru keeps one lore. Pass back: quest one damaged Hook for one lore and the undamaged Hook for three. Banish one exact Don with Dragon Fire, then quest the second damaged Hook for two. Banish the last Don, then quest the third damaged Hook for three. Both logs must show the actual one/three/two/three outcomes and named banishments.",
  skipPreGame: true,
  seed: "set14-audit-don-karnage-player-two-removal",
  playerOne: {
    play: [
      { card: captainHookConcernedCaptain, damage: 1 },
      { card: captainHookConcernedCaptain, damage: 1 },
      { card: captainHookConcernedCaptain, damage: 1 },
      captainHookConcernedCaptain,
    ],
    hand: [dragonFire, dragonFire],
    inkwell: 10,
    deck,
  },
  playerTwo: {
    play: [donKarnageDebonairPirate, donKarnageDebonairPirate, { card: fruFruVipGuest, damage: 1 }],
    deck,
  },
});

export const set14AuditDonKarnageFixture = createFixture({
  id: "set14-audit-don-karnage",
  name: "Hyperia audit: Don Karnage damage and lore",
  description:
    "Shift onto damaged Don for four ink; damage Ward/Resist characters and banish damaged Fru Fru. Quest Don to reduce damaged opposing lore. Heal Flash and quest restored/reduced characters; Don's ready step ends the reduction.",
  skipPreGame: true,
  seed: "set14-audit-don-karnage",
  playerOne: {
    hand: [donKarnageDebonairPirate],
    play: [{ card: donKarnageKhansCourier, damage: 1 }, fruFruVipGuest],
    inkwell: 4,
    deck,
  },
  playerTwo: {
    hand: [healingGlow],
    play: [
      aladdinPrinceAli,
      flashEfficientClerk,
      { card: fruFruVipGuest, damage: 2 },
      captainHookConcernedCaptain,
    ],
    inkwell: 1,
    lore: 5,
    deck,
  },
});

export const set14AuditMaxKaraokeFixture = createFixture({
  id: "set14-audit-max-karaoke",
  name: "Hyperia audit: Max song discard and live lore",
  description:
    "First Max discards Magnificent to draw two and reach five songs; second declines. Return that song with Do It Again to lose the bonus; third discards it again to restore all bonuses. Non-songs are excluded and draws stay private.",
  skipPreGame: true,
  seed: "set14-audit-max-karaoke",
  playerOne: {
    hand: [
      maxGoofKaraokeStar,
      maxGoofKaraokeStar,
      maxGoofKaraokeStar,
      magnificentMarvelous,
      doItAgain,
    ],
    discard: [rememberMe, rememberMe, rememberMe, rememberMe],
    inkwell: 12,
    deck: [baymaxLabAssistant, hiroHamadaVersatileInventor, ...deck],
  },
  playerTwo: { deck },
});

export const set14AuditBelleWriterOpponentExertFixture = createFixture({
  id: "set14-audit-belle-writer-opponent-exert",
  name: "Hyperia audit: Belle opponent-turn exertion",
  description:
    "Player One plays three Freezes: first Belle, the already-exerted same Belle, then the second exact Belle. Player Two gets no Tips discount or Secrets lore. Pass: Player Two pays one for Healing Glow, leaving three; Magnificent still costs four and cannot be played. Quest one Belle, then pay two for Magnificent. Play the second Healing Glow as the third own action: each Belle rewards three lore, for ten total including the quest/song. Both logs must show no opposing-turn Tips/Secrets reward and the actual own-turn outcomes.",
  skipPreGame: true,
  seed: "set14-audit-belle-writer-opponent-exert",
  playerOne: { play: [fruFruVipGuest], hand: [freeze, freeze, freeze], inkwell: 6, deck },
  playerTwo: {
    play: [belleExceptionalWriter, belleExceptionalWriter],
    hand: [healingGlow, magnificentMarvelous, healingGlow],
    inkwell: 4,
    deck,
  },
});

export const set14AuditBelleWriterFixture = createFixture({
  id: "set14-audit-belle-writer",
  name: "Hyperia audit: Belle discounts and third action",
  description:
    "Shift for three, quest to discount Magnificent by two. Play Distract, Healing Glow and Befuddle; only the third action awards three lore.",
  skipPreGame: true,
  seed: "set14-audit-belle-writer",
  playerOne: {
    hand: [belleExceptionalWriter, magnificentMarvelous, distract, healingGlow, befuddle],
    play: [{ card: belleReflectiveWriter, damage: 1 }],
    inkwell: 9,
    deck,
  },
  playerTwo: { play: [fruFruVipGuest], deck },
});

export const set14AuditFredStomperOccupiedFixture = createFixture({
  id: "set14-audit-fred-stomper-occupied",
  name: "Hyperia audit: Fred occupied-location banishment",
  description:
    "Pass to Player Two. First Fred banishes the opposing occupied Market; both Fru copies survive with damage unchanged and no location. Own occupied Port Authority and its Fru copies remain. Second Fred declines: the occupied Port remains. Third Fred banishes own Port: both own Fru copies survive with damage unchanged and no location. Wrong viewer cannot resolve. Target picker contains locations only; both logs name banishment/decline without false character banishment.",
  skipPreGame: true,
  seed: "set14-audit-fred-stomper-occupied",
  playerOne: {
    play: [
      merlinsShopAndSmithyMagicalMarket,
      { card: fruFruVipGuest, atLocation: merlinsShopAndSmithyMagicalMarket },
      { card: fruFruVipGuest, damage: 1, atLocation: merlinsShopAndSmithyMagicalMarket },
      inkcasterSkates,
    ],
    deck,
  },
  playerTwo: {
    play: [
      portAuthorityCenterHub,
      { card: fruFruVipGuest, atLocation: portAuthorityCenterHub },
      { card: fruFruVipGuest, damage: 1, atLocation: portAuthorityCenterHub },
      inkcasterSkates,
    ],
    hand: [fredBigStomper, fredBigStomper, fredBigStomper],
    inkwell: 15,
    deck,
  },
});

export const set14AuditFredStomperFixture = createFixture({
  id: "set14-audit-fred-stomper",
  name: "Hyperia audit: Fred location banishment",
  description:
    "Play three Fred copies: banish the opposing Market, decline the second, and banish the own Port Authority with the third. Characters and items are excluded.",
  skipPreGame: true,
  seed: "set14-audit-fred-stomper",
  playerOne: {
    hand: [fredBigStomper, fredBigStomper, fredBigStomper],
    play: [portAuthorityCenterHub, fruFruVipGuest, inkcasterSkates, theTornCorner],
    inkwell: 15,
    deck,
  },
  playerTwo: { play: [merlinsShopAndSmithyMagicalMarket, fruFruVipGuest], deck },
});

export const set14AuditMinnieResistFixture = createFixture({
  id: "set14-audit-minnie-resist",
  name: "Hyperia audit: Minnie opponent-turn Resist",
  description:
    "Quest Minnie, then challenge her during the opposing turn with Fru Fru and Hiro. Resist prevents Fru Fru damage and reduces Hiro to one. Quest Russell; on the next own turn Minnie challenges Russell with no Resist.",
  skipPreGame: true,
  seed: "set14-audit-minnie-resist",
  playerOne: { play: [minnieMouseBusyGogetter], deck },
  playerTwo: { play: [fruFruVipGuest, hiroHamadaVersatileInventor, russellFindingAdventure], deck },
});

export const set14AuditHoneyRepeatedPlayerTwoFixture = createFixture({
  id: "set14-audit-honey-repeated-player-two",
  name: "Hyperia audit: Honey repeated Player Two rewards",
  description:
    "Pass to Player Two. Quest the same Honey on two own turns, banishing Skates then Tower. Only own in-play items can be chosen. Rewards add to two saved drops; Player One keeps four. After Player One banishes Honey with Dragon Fire, pass back and spend one saved drop on Fru Fru at zero bank. Inspect both logs and consistency checks.",
  skipPreGame: true,
  seed: "set14-audit-honey-repeated-player-two",
  playerOne: { hand: [dragonFire], play: [inkcasterSkates], inkwell: 5, inkDrops: 4, deck },
  playerTwo: {
    hand: [fruFruVipGuest, inkcasterSkates],
    play: [
      { card: honeyLemonTestingTheLimits, isDrying: false },
      inkcasterSkates,
      leaningTowerOfCheesea,
      portAuthorityCenterHub,
    ],
    discard: [inkcasterSkates],
    inkDrops: 2,
    deck,
  },
});

export const set14AuditHoneyLemonFixture = createFixture({
  id: "set14-audit-honey-lemon",
  name: "Hyperia audit: Honey Lemon item rewards",
  description:
    "Play Honey and banish Skates; quest the dry Honey and banish Tower. Each draws one and awards one drop. A second play declines; spend a saved drop on Fru Fru at bank zero.",
  skipPreGame: true,
  seed: "set14-audit-honey-lemon",
  playerOne: {
    hand: [honeyLemonTestingTheLimits, honeyLemonTestingTheLimits, fruFruVipGuest],
    play: [
      honeyLemonTestingTheLimits,
      inkcasterSkates,
      leaningTowerOfCheesea,
      portAuthorityCenterHub,
    ],
    inkwell: 6,
    deck,
  },
  playerTwo: { play: [inkcasterSkates], deck },
});

export const set14AuditAirDropResistedPlayerTwoFixture = createFixture({
  id: "set14-audit-air-drop-resisted-player-two",
  name: "Hyperia audit: Air Drop fully resisted repeats",
  description:
    "Pass to Player Two. Arm drop payment and play Wasabi with five drops, granting own Edgar Resist3 and Ward. First Air Drop spends four remaining drops; second spends four bank ink. Target own Edgar for both: each prevents three damage; Edgar stays undamaged/Resist3, opposing Edgar stays untouched. Player Two drops9->4->0 and bank4->0, Player One2 unchanged. Inspect both logs.",
  skipPreGame: true,
  seed: "set14-audit-air-drop-resisted-player-two",
  playerOne: { play: [edgarBalthazarLongsufferingButler], inkDrops: 2, deck },
  playerTwo: {
    hand: [wasabiFutureThinker, airDrop, airDrop],
    play: [edgarBalthazarLongsufferingButler],
    inkwell: 4,
    inkDrops: 9,
    deck,
  },
});
export const set14AuditAirDropNoTargetPlayerTwoFixture = createFixture({
  id: "set14-audit-air-drop-no-target-player-two",
  name: "Hyperia audit: Air Drop no legal character",
  description:
    "Pass to Player Two. Pay four saved drops for Air Drop. Opposing Aladdin has Ward; own Skates and Port are not characters. No legal target exists, no damage/banishment occurs, no pending choice remains. Player One keeps two drops. Inspect both logs.",
  skipPreGame: true,
  seed: "set14-audit-air-drop-no-target-player-two",
  playerOne: { play: [aladdinPrinceAli], inkDrops: 2, deck },
  playerTwo: {
    hand: [airDrop],
    play: [inkcasterSkates, portAuthorityCenterHub],
    inkDrops: 4,
    deck,
  },
});

export const set14AuditCrowdBoostedPlayerTwoFixture = createFixture({
  id: "set14-audit-crowd-boosted-player-two",
  name: "Hyperia audit: Above the Crowd current Strength",
  description:
    "Pass to Player Two. Improvise the opposing Hans (3->4). Above the Crowd selector must exclude that Hans, own Hans, Ward Aladdin, Skates and Port; only opposing Fru Fru remains. Close the picker and Undo to restore the song and five drops while preserving the boost. Disarm drop payment, then Distract opposing Hans (4->2), then spend five saved drops at zero bank to bottom that exact copy. Opposing deck6->7, own Hans stays. Both logs show current-Strength effects and bottom destination; Player One keeps2drops.",
  skipPreGame: true,
  seed: "set14-audit-crowd-boosted-player-two",
  playerOne: {
    play: [
      hansSchemingPrince,
      fruFruVipGuest,
      aladdinPrinceAli,
      inkcasterSkates,
      portAuthorityCenterHub,
    ],
    inkDrops: 2,
    deck,
  },
  playerTwo: {
    hand: [improvise, distract, aboveTheCrowd],
    play: [hansSchemingPrince],
    inkwell: 3,
    inkDrops: 5,
    deck,
  },
});

export const set14AuditBusinessPlayerTwoPersistenceFixture = createFixture({
  id: "set14-audit-business-player-two-persistence",
  name: "Hyperia audit: Business reversed choices and persistence",
  description:
    "Pass to Player Two. Arm drops and pay first Business with three saved drops; only Player One chooses the mode. Choose reveal/discard: only Player Two can choose an opposing revealed card, no Skip. Discard Skates; Player One4->6drops. Play second Business with three bank ink and choose draw as Player One: Player Two draws one and gains2drops. Pass to Player One, spend one saved drop on Fru Fru (6->5), pass back and spend one Player Two drop on Fru Fru (2->1). Inspect both logs/privacy and separate pools across turns.",
  skipPreGame: true,
  seed: "set14-audit-business-player-two-persistence",
  playerOne: { hand: [inkcasterSkates, fruFruVipGuest], inkDrops: 4, deck },
  playerTwo: {
    hand: [thisIsBusiness, thisIsBusiness, fruFruVipGuest],
    inkwell: 3,
    inkDrops: 3,
    deck,
  },
});

export const set14AuditAirDropFixture = createFixture({
  id: "set14-audit-air-drop",
  name: "Hyperia audit: Air Drop conditional damage",
  description:
    "Hit fresh Goliath for three, then five to banish. Damaged Powerline takes five. Opposing Ward is excluded; own Ward can be chosen. Minnie reduces damage during your turn.",
  skipPreGame: true,
  seed: "set14-audit-air-drop",
  playerOne: {
    hand: [airDrop, airDrop, airDrop, airDrop, airDrop],
    play: [aladdinPrinceAli, inkcasterSkates, portAuthorityCenterHub],
    inkwell: 20,
    deck,
  },
  playerTwo: {
    play: [
      goliathTransformedWarrior,
      { card: powerlineMegastar, damage: 1 },
      aladdinPrinceAli,
      minnieMouseBusyGogetter,
    ],
    deck,
  },
});

export const set14AuditAboveCrowdFixture = createFixture({
  id: "set14-audit-above-crowd",
  name: "Hyperia audit: Above the Crowd current strength",
  description:
    "Distract Jock from four to two, then pay five to put him on the deck bottom. At zero ready ink, sing the second song with Powerline and bottom Fru Fru. Exclude own characters, opposing Ward, high strength, items and locations.",
  skipPreGame: true,
  seed: "set14-audit-above-crowd",
  playerOne: {
    hand: [distract, aboveTheCrowd, aboveTheCrowd],
    play: [powerlineMegastar, fruFruVipGuest],
    inkwell: 7,
    deck,
  },
  playerTwo: {
    play: [
      jockEnjoyingTheSights,
      fruFruVipGuest,
      aladdinPrinceAli,
      captainHookConcernedCaptain,
      inkcasterSkates,
      portAuthorityCenterHub,
    ],
    deck,
  },
});

export const set14AuditTaleFixture = createFixture({
  id: "set14-audit-another-tale",
  name: "Hyperia audit: Another Tale to Spin shared drops",
  description:
    "Pay two for the first song and sing the second with Minnie at zero bank. Choose only the other player; each draw grants both players a drop. Spend a saved drop on Fru Fru.",
  skipPreGame: true,
  seed: "set14-audit-another-tale",
  playerOne: {
    hand: [anotherTaleToSpin, anotherTaleToSpin, fruFruVipGuest],
    play: [minnieMouseBusyGogetter],
    inkwell: 2,
    deck,
  },
  playerTwo: { hand: [fruFruVipGuest], deck },
});

export const set14AuditBusinessEmptyHandFixture = createFixture({
  id: "set14-audit-business-empty-hand",
  name: "Hyperia audit: This Is Business empty opposing hand",
  description: "The opponent chooses reveal with an empty hand and still gains two ink drops.",
  seed: "set14-audit-business-empty-hand",
  skipPreGame: true,
  playerOne: { hand: [thisIsBusiness], inkwell: 3, deck },
  playerTwo: { hand: [], deck },
});

export const set14AuditBusinessEmptyDeckFixture = createFixture({
  id: "set14-audit-business-empty-deck",
  name: "Hyperia audit: This Is Business empty deck",
  description:
    "The opponent chooses draw with an empty caster deck. Two drops are awarded before turn-end defeat.",
  seed: "set14-audit-business-empty-deck",
  skipPreGame: true,
  playerOne: { hand: [thisIsBusiness], inkwell: 3, deck: [] },
  playerTwo: { deck },
});

export const set14AuditBusinessFixture = createFixture({
  id: "set14-audit-this-is-business",
  name: "Hyperia audit: This Is Business opponent choices",
  description:
    "Play two copies. Opponent chooses reveal first; caster discards Skates. Opponent chooses draw next; caster gets a private draw and two drops, then spends one on Fru Fru.",
  skipPreGame: true,
  seed: "set14-audit-this-is-business",
  playerOne: { hand: [thisIsBusiness, thisIsBusiness, fruFruVipGuest], inkwell: 6, deck },
  playerTwo: { hand: [inkcasterSkates, powerlineMegastar, fruFruVipGuest], deck },
});

export const set14AuditTauntNoTargetFixture = createFixture({
  id: "set14-audit-taunt-no-target",
  name: "Hyperia audit: Flippant Taunt no legal target",
  description: "Resolve Taunt against only Ward, an item and a location without granting Reckless.",
  skipPreGame: true,
  seed: "set14-audit-taunt-no-target",
  playerOne: { hand: [flippantTaunt], inkwell: 1, deck },
  playerTwo: { play: [aladdinPrinceAli, inkcasterSkates, portAuthorityCenterHub], deck },
});

export const set14AuditTauntDropsFixture = createFixture({
  id: "set14-audit-taunt-drops",
  name: "Hyperia audit: Flippant Taunt saved-drop payment",
  description: "Pay one saved drop with no bank ink and grant opposing Jock Reckless.",
  skipPreGame: true,
  seed: "set14-audit-taunt-drops",
  playerOne: { hand: [flippantTaunt], inkDrops: 2, deck },
  playerTwo: { play: [jockEnjoyingTheSights], deck },
});

export const set14AuditTauntFixture = createFixture({
  id: "set14-audit-flippant-taunt",
  name: "Hyperia audit: Flippant Taunt Reckless duration",
  description:
    "Taunt Jock. Opponent cannot quest or pass while able to challenge. Challenge Powerline, then pass; Reckless expires on caster's next turn.",
  skipPreGame: true,
  seed: "set14-audit-flippant-taunt",
  playerOne: {
    hand: [flippantTaunt],
    inkwell: 1,
    deck,
    play: [{ card: powerlineMegastar, exerted: true, isDrying: false }, fruFruVipGuest],
  },
  playerTwo: {
    play: [jockEnjoyingTheSights, aladdinPrinceAli, inkcasterSkates, portAuthorityCenterHub],
    deck,
  },
});

export const set14AuditTauntExpiryFixture = createFixture({
  id: "set14-audit-flippant-taunt-expiry",
  name: "Hyperia audit: Flippant Taunt expiry after surviving challenge",
  description:
    "Taunt Jock, challenge exerted Baymax for four damage and take two, pass, then check Reckless ends on caster's next turn.",
  skipPreGame: true,
  seed: "set14-audit-flippant-taunt-expiry",
  playerOne: {
    hand: [flippantTaunt],
    inkwell: 1,
    deck,
    play: [{ card: baymaxQualifiedPhysician, exerted: true, isDrying: false }],
  },
  playerTwo: { play: [jockEnjoyingTheSights], deck },
});

export const set14AuditChemicalEmptyHandFixture = createFixture({
  id: "set14-audit-chemical-empty-hand",
  name: "Hyperia audit: Chemical Reaction empty opposing hand",
  description: "Draw, banish your Skates and choose an opponent with no cards to discard.",
  skipPreGame: true,
  seed: "set14-audit-chemical-empty-hand",
  playerOne: { hand: [chemicalReaction], play: [inkcasterSkates], inkwell: 2, deck },
  playerTwo: { hand: [], deck },
});

export const set14AuditChemicalFixture = createFixture({
  id: "set14-audit-chemical-reaction",
  name: "Hyperia audit: Chemical Reaction optional chain",
  description:
    "Play four copies. Decline first, banish own items on later copies, choose the opponent, let them discard. Last copy resolves against an empty opposing hand. Check private draws and public banish/discard logs.",
  skipPreGame: true,
  seed: "set14-audit-chemical-reaction",
  playerOne: {
    hand: [chemicalReaction, chemicalReaction, chemicalReaction, chemicalReaction],
    inkwell: 8,
    deck,
    play: [inkcasterSkates, ancestralGuitar, bellesCityGuide, fruFruVipGuest],
  },
  playerTwo: {
    hand: [powerlineMegastar, inkcasterSkates],
    play: [inkcasterSkates, portAuthorityCenterHub],
    deck,
  },
});

export const set14AuditCityGuideWinFixture = createFixture({
  id: "set14-audit-city-guide-win",
  name: "Hyperia audit: Belle's City Guide victory",
  description: "Play Distract at nineteen lore, then activate Guide to reach twenty.",
  skipPreGame: true,
  seed: "set14-audit-city-guide-win",
  playerOne: { hand: [distract], play: [bellesCityGuide], inkwell: 2, deck, lore: 19 },
  playerTwo: { deck },
});

export const set14AuditCityGuideFixture = createFixture({
  id: "set14-audit-city-guide",
  name: "Hyperia audit: Belle’s City Guide action condition",
  description:
    "Activate before an action for no lore. Play Distract, activate another copy for one lore, play a third Guide and use it immediately. Pass both turns and verify the condition resets.",
  skipPreGame: true,
  seed: "set14-audit-city-guide",
  playerOne: {
    hand: [distract, bellesCityGuide],
    inkwell: 4,
    deck,
    play: [bellesCityGuide, bellesCityGuide, fruFruVipGuest],
  },
  playerTwo: { deck, play: [jockEnjoyingTheSights] },
});

export const set14AuditHeiheiExertedFixture = createFixture({
  id: "set14-audit-heihei-exerted",
  name: "Hyperia audit: Heihei exerted free movement",
  description:
    "Move exerted Heihei from Beanstalk to Port Authority without ink, preserving exertion and gaining one lore.",
  skipPreGame: true,
  seed: "set14-audit-heihei-exerted",
  playerOne: {
    play: [
      theBeanstalkOnwardAndUpward,
      portAuthorityCenterHub,
      {
        card: heiheiAtTheCrosswalk,
        atLocation: theBeanstalkOnwardAndUpward,
        exerted: true,
        isDrying: false,
      },
    ],
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditBeanstalkDropsFixture = createFixture({
  id: "set14-audit-beanstalk-drops",
  name: "Hyperia audit: Beanstalk saved-drop movement",
  description: "Move Fru Fru onto Beanstalk using one saved drop at zero bank ink.",
  skipPreGame: true,
  seed: "set14-audit-beanstalk-drops",
  playerOne: { play: [theBeanstalkOnwardAndUpward, fruFruVipGuest], inkDrops: 2, deck },
  playerTwo: { deck },
});

export const set14AuditCheeseEmptyDeckFixture = createFixture({
  id: "set14-audit-cheese-empty-deck",
  name: "Hyperia audit: Cheese empty-deck trade",
  description:
    "Accept Fair Trade with an empty deck and discard the existing Fru Fru before turn-end defeat.",
  skipPreGame: true,
  seed: "set14-audit-cheese-empty-deck",
  playerOne: { hand: [leaningTowerOfCheesea, fruFruVipGuest], inkwell: 1, deck: [] },
  playerTwo: { deck },
});

export const set14AuditCheeseFixture = createFixture({
  id: "set14-audit-cheese",
  name: "Hyperia audit: Leaning Tower of Cheese-a",
  description:
    "Play third Tower and accept the trade. Play fourth and decline. Check item Ward and opposing Break selector. On next own turn banish a Tower with own Break; Ward disappears and opposing Break can target your Skates.",
  skipPreGame: true,
  seed: "set14-audit-cheese",
  playerOne: {
    hand: [leaningTowerOfCheesea, leaningTowerOfCheesea, breakCard],
    inkwell: 4,
    deck,
    play: [leaningTowerOfCheesea, leaningTowerOfCheesea, inkcasterSkates, fruFruVipGuest],
  },
  playerTwo: { hand: [breakCard], inkwell: 2, deck, play: [inkcasterSkates] },
});

export const set14AuditBeanstalkFixture = createFixture({
  id: "set14-audit-beanstalk",
  name: "Hyperia audit: The Beanstalk",
  description:
    "Move Baymax into Beanstalk, away to Port Authority, and back. Quest and pass. Opposing Jock challenges Baymax with Evasive; Hook destroys the location. Check increased damage and loss of Strength/Evasive with character survival.",
  skipPreGame: true,
  seed: "set14-audit-beanstalk",
  playerOne: {
    inkwell: 6,
    deck,
    play: [
      theBeanstalkOnwardAndUpward,
      portAuthorityCenterHub,
      baymaxQualifiedPhysician,
      fruFruVipGuest,
    ],
  },
  playerTwo: { deck, play: [jockEnjoyingTheSights, captainHookConcernedCaptain, fruFruVipGuest] },
});

export const set14AuditHeiheiFixture = createFixture({
  id: "set14-audit-heihei",
  name: "Hyperia audit: Heihei",
  description:
    "Activate Heihei at Port Authority. Only your Beanstalk is a legal destination. Move for free, gain one lore, and check the once-per-turn limit. Pass twice and use the ability again. Opposing locations must be excluded.",
  skipPreGame: true,
  seed: "set14-audit-heihei",
  playerOne: {
    deck,
    play: [
      portAuthorityCenterHub,
      theBeanstalkOnwardAndUpward,
      { card: heiheiAtTheCrosswalk, atLocation: portAuthorityCenterHub },
    ],
  },
  playerTwo: { deck, play: [portAuthorityCenterHub] },
});

export const set14AuditAbbyEmptyDeckFixture = createFixture({
  id: "set14-audit-abby-empty-deck",
  name: "Hyperia audit: Abby Park empty deck",
  description:
    "Play Abby with an empty deck. No reveal or routing choice should appear. Pass and check empty-deck defeat.",
  skipPreGame: true,
  seed: "set14-audit-abby-empty-deck",
  playerOne: { hand: [abbyParkIntenseFan], inkwell: 4, deck: [] },
  playerTwo: { deck },
});

export const set14AuditAbbyFixture = createFixture({
  id: "set14-audit-abby",
  name: "Hyperia audit: Abby Park",
  description:
    "Play Abby three times. Jukebox must go to the bottom. Take the revealed song into hand, then decline Singer Goofy and put him on the bottom. Check public reveal and destination logs in both views.",
  skipPreGame: true,
  seed: "set14-audit-abby",
  playerOne: {
    hand: [abbyParkIntenseFan, abbyParkIntenseFan, abbyParkIntenseFan],
    inkwell: 12,
    deck: [fruFruVipGuest, goofyDancingSuperstar, neverGonnaLetYouCry, jukebox],
  },
  playerTwo: { deck },
});

export const set14AuditAbbySingerFixture = createFixture({
  id: "set14-audit-abby-singer",
  name: "Hyperia audit: Abby Park Singer",
  description:
    "Play Abby and take Singer Goofy into hand. Play the second Abby and decline the song, putting it on the bottom. Check exact destinations and public logs.",
  skipPreGame: true,
  seed: "set14-audit-abby-singer",
  playerOne: {
    hand: [abbyParkIntenseFan, abbyParkIntenseFan],
    inkwell: 8,
    deck: [fruFruVipGuest, neverGonnaLetYouCry, goofyDancingSuperstar],
  },
  playerTwo: { deck },
});

export const set14AuditGoofyDryingFixture = createFixture({
  id: "set14-audit-goofy-drying",
  name: "Hyperia audit: Goofy drying Shift",
  description:
    "Play base Goofy for four ink, then Shift Dancing Superstar for three. Quest and singing must stay blocked by drying; Hector receives no bonus.",
  skipPreGame: true,
  seed: "set14-audit-goofy-drying",
  playerOne: {
    hand: [goofyKnowsTheBand, goofyDancingSuperstar, higitusFigitus],
    inkwell: 7,
    deck,
    play: [hctorRiveraStreetMusician],
  },
  playerTwo: { deck },
});

export const set14AuditGoofyFixture = createFixture({
  id: "set14-audit-goofy",
  name: "Hyperia audit: Goofy Dancing Superstar",
  description:
    "Shift Goofy for three ink onto dry Goofy. Quest to give only your other Singer +1 lore, then quest Hector and plain Fru Fru. Pass twice and sing cost-six Higitus Figitus without spending bank ink. Hector must have base lore again and singing must not grant the quest bonus.",
  skipPreGame: true,
  seed: "set14-audit-goofy",
  playerOne: {
    hand: [goofyDancingSuperstar, higitusFigitus],
    inkwell: 3,
    deck,
    play: [goofyKnowsTheBand, hctorRiveraStreetMusician, fruFruVipGuest],
  },
  playerTwo: { deck, play: [hctorRiveraStreetMusician] },
});

export const set14AuditGoofyCopiesFixture = createFixture({
  id: "set14-audit-goofy-copies",
  name: "Hyperia audit: Goofy copies",
  description:
    "Quest the first Goofy for two lore, then the second for three. Quest Hector for three. Both Goofys and Hector have received bonuses only from other Goofys. Opposing Hector stays at one. Pass to check expiry.",
  skipPreGame: true,
  seed: "set14-audit-goofy-copies",
  playerOne: {
    deck,
    play: [goofyDancingSuperstar, goofyDancingSuperstar, hctorRiveraStreetMusician],
  },
  playerTwo: { deck, play: [hctorRiveraStreetMusician] },
});

export const set14AuditHectorEmptyDeckFixture = createFixture({
  id: "set14-audit-hector-empty-deck",
  name: "Hyperia audit: Hector empty deck",
  description:
    "Quest Hector for two lore with an empty deck. Big Hit must complete without a look choice. Pass to check empty-deck defeat.",
  skipPreGame: true,
  seed: "set14-audit-hector-empty-deck",
  playerOne: { play: [hctorRiveraWorldwideSensation], deck: [] },
  playerTwo: { deck },
});

export const set14AuditHectorWorldwideFixture = createFixture({
  id: "set14-audit-hector-worldwide",
  name: "Hyperia audit: Hector Worldwide Sensation",
  description:
    "Shift onto dry Hector for four ink. Quest and take the revealed song; plain character/item cannot enter hand. Ready with Fan the Flames, sing Higitus, decline the next song and discard all three. Ready again and sing a second time; the lower deck must stay unchanged and no Big Hit prompt appears. Check private look and public reveal/discard logs in both views.",
  skipPreGame: true,
  seed: "set14-audit-hector-worldwide",
  playerOne: {
    hand: [hctorRiveraWorldwideSensation, higitusFigitus, fanTheFlames, fanTheFlames],
    inkwell: 6,
    play: [hctorRiveraStreetMusician],
    deck: [
      fruFruVipGuest,
      fruFruVipGuest,
      fruFruVipGuest,
      neverGonnaLetYouCry,
      abbyParkIntenseFan,
      fruFruVipGuest,
      higitusFigitus,
      jukebox,
      goofyDancingSuperstar,
    ],
  },
  playerTwo: { deck },
});

export const set14AuditHectorTogetherPlayerTwoFixture = createFixture({
  id: "set14-audit-hector-together-player-two",
  name: "Hyperia audit: Hector two singers",
  description:
    "Player Two sings Nothing We Won't Do with both Hectors. Resolve two private top-three looks; accept one song and decline the other. Both are readied by the song. Each later sings Higitus without another look. On the next own turn, singing triggers again with cards still in deck; the other copy can quest independently.",
  skipPreGame: true,
  seed: "set14-audit-hector-together-player-two",
  playerOne: { play: [fruFruVipGuest], inkDrops: 4, lore: 5, deck },
  playerTwo: {
    play: [hctorRiveraWorldwideSensation, hctorRiveraWorldwideSensation],
    hand: [nothingWeWontDo, higitusFigitus, higitusFigitus, higitusFigitus],
    inkDrops: 3,
    deck: [
      fruFruVipGuest,
      jukebox,
      higitusFigitus,
      fruFruVipGuest,
      fruFruVipGuest,
      fruFruVipGuest,
      jukebox,
      neverGonnaLetYouCry,
      fruFruVipGuest,
      goofyDancingSuperstar,
      creativeInspiration,
      higitusFigitus,
      fruFruVipGuest,
    ],
  },
});

export const set14AuditHectorDryingShortPlayerTwoFixture = createFixture({
  id: "set14-audit-hector-drying-short-player-two",
  name: "Hyperia audit: Hector drying and short deck",
  description:
    "Player Two plays Street Musician, declines Strike a Chord, then Shifts with three bank ink and one selected drop. Shift stays drying, offers only the friendly base and cannot quest or sing. After a turn cycle, quest the remaining two cards, accept the song and discard the item. Ready and quest again on an empty deck without a choice or false look log.",
  skipPreGame: true,
  seed: "set14-audit-hector-drying-short-player-two",
  playerOne: { play: [hctorRiveraStreetMusician], inkDrops: 4, lore: 5, deck },
  playerTwo: {
    play: [fruFruVipGuest],
    hand: [hctorRiveraStreetMusician, hctorRiveraWorldwideSensation, higitusFigitus, youCameBack],
    inkwell: 4,
    inkDrops: 1,
    deck: [jukebox, higitusFigitus, fruFruVipGuest, fruFruVipGuest],
  },
});

export const set14AuditYamaExertedFixture = createFixture({
  id: "set14-audit-yama-exerted",
  name: "Hyperia audit: Yama exerted activation",
  description:
    "Activate drying and exerted Yama for six ink. Challenge Hook with Jock to gain one drop. Yama must remain exerted.",
  skipPreGame: true,
  seed: "set14-audit-yama-exerted",
  playerOne: {
    play: [{ card: yamaNotoriousCriminal, exerted: true, isDrying: true }, jockEnjoyingTheSights],
    inkwell: 6,
    deck,
  },
  playerTwo: { play: [{ card: captainHookConcernedCaptain, exerted: true }], deck },
});

export const set14AuditYamaFixture = createFixture({
  id: "set14-audit-yama",
  name: "Hyperia audit: Yama",
  skipPreGame: true,
  seed: "set14-audit-yama",
  description:
    "Activate twice for twelve ink without exerting. Challenge a location with Jock: no drops. Challenge lethal Hook with Yama: Yama is banished but both floating triggers award drops. Challenge Hook with a second Hook: two more drops. Pass turns and verify no later rewards; drops persist.",
  playerOne: {
    inkwell: 12,
    deck,
    play: [yamaNotoriousCriminal, jockEnjoyingTheSights, captainHookConcernedCaptain],
  },
  playerTwo: {
    deck,
    play: [{ card: captainHookConcernedCaptain, exerted: true }, theBeanstalkOnwardAndUpward],
  },
});

export const set14AuditYamaCopiesPlayerTwoFixture = createFixture({
  id: "set14-audit-yama-copies-player-two",
  name: "Hyperia audit: Yama copies and saved drops",
  description:
    "Player One quests two Yamas, leaving the third ready. Player Two activates one source for six, quests the other without gaining a drop, checks five-bank unarmed rejection, then selects one drop to pay five bank plus one drop. The ready source challenges and is banished: both floating rewards still grant two drops. Baloo challenges the other exerted Yama for two more drops; the ready opponent is excluded. Spend one earned drop on Fru, then cycle turns and challenge the final Yama: the three saved drops persist but both rewards have expired.",
  skipPreGame: true,
  seed: "set14-audit-yama-copies-player-two",
  playerOne: {
    play: [yamaNotoriousCriminal, yamaNotoriousCriminal, yamaNotoriousCriminal],
    lore: 5,
    inkDrops: 4,
    deck,
  },
  playerTwo: {
    play: [yamaNotoriousCriminal, yamaNotoriousCriminal, balooFreightPilot],
    hand: [fruFruVipGuest],
    inkwell: 11,
    inkDrops: 1,
    deck,
  },
});

export const set14AuditRubyVanillaFixture = createFixture({
  id: "set14-audit-ruby-vanilla",
  name: "Hyperia audit: Ruby vanilla characters",
  skipPreGame: true,
  seed: "set14-audit-ruby-vanilla",
  description:
    "Play Abigail, Pepita and Stacey for five, one and three ink. They have no trigger and cannot quest while drying. Pass both turns and quest for one, one and three lore. On another turn challenge Hook and verify printed damage and banishment. Check both logs.",
  playerOne: {
    hand: [abigailCallaghanSeasonedTestPilot, pepitaSweetKitty, staceyPowerlineSuperfan],
    inkwell: 9,
    deck,
  },
  playerTwo: { deck, play: [{ card: captainHookConcernedCaptain, exerted: true }] },
});

export const set14AuditDonaldTaxiFixture = createFixture({
  id: "set14-audit-donald-taxi",
  name: "Hyperia audit: Donald Taxi Driver",
  skipPreGame: true,
  seed: "set14-audit-donald-taxi",
  description:
    "Play Pepita and Donald. Grant Pepita Rush, confirm she cannot quest, then challenge exerted Hook for one damage. Donald can also choose himself or an opponent. Rush ends when the turn ends. Check both public logs.",
  playerOne: { hand: [pepitaSweetKitty, donaldDuckTaxiDriver], inkwell: 4, deck },
  playerTwo: {
    deck,
    play: [{ card: captainHookConcernedCaptain, exerted: true }, staceyPowerlineSuperfan],
  },
});

export const set14AuditGoofyTouristFixture = createFixture({
  id: "set14-audit-goofy-tourist",
  name: "Hyperia audit: Goofy Enthusiastic Tourist",
  skipPreGame: true,
  seed: "set14-audit-goofy-tourist",
  description:
    "Goofy starts at zero strength despite the opposing Singer. Play Peg to gain three strength immediately, then Goofy Dancing Superstar: the bonus remains three. Challenge Hook for three damage. Reload, play both Singers, pass both turns, and challenge Hook with each Singer. The bonus remains after the first banishment and disappears after the last. Check both logs.",
  playerOne: {
    play: [{ card: goofyEnthusiasticTourist, isDrying: false }],
    hand: [pegLatenightVocalist, goofyDancingSuperstar],
    inkwell: 8,
    deck,
  },
  playerTwo: {
    deck,
    play: [{ card: captainHookConcernedCaptain, exerted: true }, pegLatenightVocalist],
  },
});

export const set14AuditTadashiFixture = createFixture({
  id: "set14-audit-tadashi",
  name: "Hyperia audit: Tadashi Making Waves",
  skipPreGame: true,
  seed: "set14-audit-tadashi",
  description:
    "Challenge Hook with Tadashi: four damage, nine returned, banishment and two ink drops. Spend five bank ink on Dragon Fire to banish opposing Tadashi; resolve the opposing reward. Spend the first player's two drops on Peg. Check both public logs and reward ownership.",
  playerOne: {
    play: [{ card: tadashiHamadaMakingWaves, isDrying: false }],
    hand: [dragonFire, pegLatenightVocalist],
    inkwell: 5,
    deck,
  },
  playerTwo: {
    deck,
    play: [tadashiHamadaMakingWaves, { card: captainHookConcernedCaptain, exerted: true }],
  },
});

export const set14AuditCruellaFixture = createFixture({
  id: "set14-audit-cruella",
  name: "Hyperia audit: Cruella Dodging Traffic",
  skipPreGame: true,
  seed: "set14-audit-cruella",
  description:
    "Play Cruella for six ink. Rush allows a challenge while drying but no quest. Ready Abigail and Evasive Jasper are illegal defenders; exerted Pepita is legal. Cruella deals five and takes one, then cannot challenge again while exerted. Pass both turns: Rush remains and Cruella can quest for two. Check both logs.",
  playerOne: { hand: [cruellaDeVilDodgingTraffic], inkwell: 6, deck },
  playerTwo: {
    deck,
    play: [
      abigailCallaghanSeasonedTestPilot,
      { card: jasperDodgyBoater, exerted: true },
      { card: pepitaSweetKitty, exerted: true },
    ],
  },
});

export const set14AuditJasperFixture = createFixture({
  id: "set14-audit-jasper",
  name: "Hyperia audit: Jasper Dodgy Boater",
  skipPreGame: true,
  seed: "set14-audit-jasper",
  description:
    "Play Jasper for five ink; Evasive does not permit a quest or challenge while drying. Pass both turns and quest for two. Pass to the opponent: Pepita cannot challenge Evasive Jasper, while opposing Jasper can. The two Jaspers deal five each and are both banished. Check both public logs.",
  playerOne: { hand: [jasperDodgyBoater], inkwell: 5, deck },
  playerTwo: { deck, play: [jasperDodgyBoater, { card: pepitaSweetKitty, exerted: true }] },
});

export const set14AuditPegFixture = createFixture({
  id: "set14-audit-peg",
  name: "Hyperia audit: Peg Late-Night Vocalist",
  skipPreGame: true,
  seed: "set14-audit-peg",
  description:
    "Play Peg for two ink. While drying she cannot sing. Pass both turns: Singer 4 cannot sing cost-five Juanita, but can sing cost-four Magnificent without spending ink, gaining two lore and drawing one card. An exerted Peg cannot sing again. Check both public logs.",
  playerOne: {
    hand: [pegLatenightVocalist, magnificentMarvelous, magnificentMarvelous, everyoneKnowsJuanita],
    inkwell: 7,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditHectorStreetFixture = createFixture({
  id: "set14-audit-hector-street",
  name: "Hyperia audit: Hector Street Musician",
  skipPreGame: true,
  seed: "set14-audit-hector-street",
  description:
    "Play two Hectors: accept the first top-deck discard and decline the second. Check independent choices and deck order. Opponent plays Hector and discards only their own top card. On the next own turn, quest one Hector for one lore. The remaining Singer 2 cannot pay Sing Together 3 for Un Poco Loco but sings One Jump Ahead without bank ink. Check both logs.",
  playerOne: {
    hand: [hctorRiveraStreetMusician, hctorRiveraStreetMusician, oneJumpAhead, unPocoLoco],
    inkwell: 5,
    deck: [...deck, abigailCallaghanSeasonedTestPilot, pepitaSweetKitty],
  },
  playerTwo: {
    hand: [hctorRiveraStreetMusician],
    inkwell: 1,
    deck: [...deck, pegLatenightVocalist, pepitaSweetKitty],
  },
});

export const set14AuditErnestoIdolFixture = createFixture({
  id: "set14-audit-ernesto-idol",
  name: "Hyperia audit: Ernesto Idol of Millions",
  skipPreGame: true,
  seed: "set14-audit-ernesto-idol",
  description:
    "Play Ernesto for three ink; drying blocks singing. Opponent plays Magnificent: Ernesto gains one lore immediately. Quest for two on the next own turn. Opponent returns their last discarded song with Do It Again: the bonus ends. Singer 5 rejects Higitus Figitus but sings Juanita without bank payment. Own song discard does not restore the bonus; later quest gains one. Check both logs.",
  playerOne: {
    hand: [ernestoDeLaCruzIdolOfMillions, everyoneKnowsJuanita, higitusFigitus],
    inkwell: 3,
    deck,
  },
  playerTwo: { hand: [magnificentMarvelous, doItAgain], inkwell: 7, deck },
});

export const set14AuditPepitaWisdomFixture = createFixture({
  id: "set14-audit-pepita-wisdom",
  name: "Hyperia audit: Pepita Imeldas Right Hand",
  skipPreGame: true,
  seed: "set14-audit-pepita-wisdom",
  description:
    "Shift onto dry Pepita for three ink, retaining one damage. At nine own discard cards and twelve opposing cards, strength/lore remain four/one. Healing Glow removes the damage and becomes the tenth discard: strength/lore become six/three. Quest three. Next own turn challenge Donald for six, taking four, then play Never Gonna Let You Cry and return two characters: discard falls to nine and stats return to four/one. Later quest one. Check both logs.",
  playerOne: {
    play: [{ card: pepitaSweetKitty, damage: 1 }],
    hand: [pepitaImeldasRightHand, healingGlow, neverGonnaLetYouCry],
    inkwell: 9,
    discard: Array(9).fill(fruFruVipGuest),
    deck,
  },
  playerTwo: {
    play: [{ card: donaldDuckTaxiDriver, exerted: true }],
    discard: Array(12).fill(fruFruVipGuest),
    deck,
  },
});

export const set14AuditErnestoRuthlessFixture = createFixture({
  id: "set14-audit-ernesto-ruthless",
  name: "Hyperia audit: Ernesto Ruthless Musician",
  skipPreGame: true,
  seed: "set14-audit-ernesto-ruthless",
  description:
    "Play Ernesto for six. Accept to banish opposing Goofy, or reload to decline or banish self/own Peg. Drying blocks singing. Next own turn quest Peg, leaving only Ernesto ready: Singer 8 cannot sing Never Too Far Apart (nine). Sing Nothing We Won't Do (eight) without ink; it readies both and prevents quests. Pass; opponent quests Donald and passes. Challenge Donald for six, taking four after the song protection expires. Later quest Ernesto for one lore. Check both logs.",
  playerOne: {
    play: [pegLatenightVocalist],
    hand: [ernestoDeLaCruzRuthlessMusician, nothingWeWontDo, neverTooFarApart],
    inkwell: 15,
    deck,
  },
  playerTwo: { play: [goofyDancingSuperstar, { card: donaldDuckTaxiDriver, exerted: true }], deck },
});

export const set14AuditHectorPiecesPlayerTwoFixture = createFixture({
  id: "set14-audit-hector-pieces-player-two",
  name: "Hyperia audit: Hector Gone to Pieces Player Two",
  skipPreGame: true,
  seed: "set14-audit-hector-pieces-player-two",
  description:
    "Pass to Player Two. Opposing Hector has an own discarded song but four own base/promo copies start at1 lore without Evasive. Sing One Jump Ahead2 with one base copy and Reflection1 with one promo copy, keeping the three looked-at cards on top. All own copies gain Evasive and only one lore bonus. Quest the unused base/promo copies for2 each. Do It Again returns One Jump Ahead: all bonuses stay with the other song remaining. Second Do It Again returns Reflection: all own copies immediately return to1 lore without Evasive, while opposing Hector stays boosted. On next own turn quest all four for1 each, total8 lore. Check exact printings, singers, song recovery and both private/public logs.",
  playerOne: {
    play: [hctorRiveraGoneToPieces, koslovImposingEnforcer],
    discard: [oneJumpAhead],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [
      hctorRiveraGoneToPieces,
      hctorRiveraGoneToPieces,
      hctorRiveraGoneToPiecesD23,
      hctorRiveraGoneToPiecesD23,
    ],
    hand: [oneJumpAhead, reflection, doItAgain, doItAgain],
    inkwell: 6,
    deck: [...deck, ...deck],
  },
});

export const set14AuditHectorPiecesFixture = createFixture({
  id: "set14-audit-hector-pieces",
  name: "Hyperia audit: Hector Gone to Pieces",
  skipPreGame: true,
  seed: "set14-audit-hector-pieces",
  description:
    "Play base Hector for four. Fresh ink blocks singing. Dry D23 cannot sing Be Prepared (seven), but sings Higitus Figitus (six) without bank ink, gaining three drops; both gain lore two and Evasive. Opposing Donald cannot challenge the exerted D23, but Archimedes can; it deals two and takes five, banishing Archimedes. Quest both for four total, then Do It Again removes the last song and both bonuses end. Opponent Donald can now challenge exerted base Hector, dealing four and taking five; both banish. Later D23 quests one for total five. Check both public logs.",
  playerOne: {
    play: [hctorRiveraGoneToPiecesD23],
    hand: [hctorRiveraGoneToPieces, higitusFigitus, bePrepared, doItAgain],
    inkwell: 10,
    deck,
  },
  playerTwo: { play: [donaldDuckTaxiDriver, archimedesHasHadEnough], deck },
});

export const set14AuditTrampFixture = createFixture({
  id: "set14-audit-tramp",
  name: "Hyperia audit: Tramp Quick on His Feet",
  skipPreGame: true,
  seed: "set14-audit-tramp",
  description:
    "Play first Tramp for two and exert opposing Fru Fru. The picker includes strength zero and one characters, but excludes Tramp and Donald. First Tramp cannot quest or challenge while drying. Play second Tramp for two, choose Rush and challenge damaged Fru Fru: deal two, take one and banish Fru Fru. Rush does not allow a quest. Pass both turns: Rush expires and both Tramps can quest one each. Check both public logs.",
  playerOne: {
    play: [fruFruVipGuest],
    hand: [trampQuickOnHisFeet, trampQuickOnHisFeet],
    inkwell: 4,
    deck,
  },
  playerTwo: {
    play: [{ card: fruFruVipGuest, damage: 1 }, goofyEnthusiasticTourist, donaldDuckTaxiDriver],
    deck,
  },
});

export const set14AuditTrampStrengthPlayerTwoFixture = createFixture({
  id: "set14-audit-tramp-strength-player-two",
  name: "Hyperia audit: Tramp Ward and current strength for player two",
  skipPreGame: true,
  seed: "set14-audit-tramp-strength-player-two",
  description:
    "Pass to player two. Play three Distracts on own Aladdin, Fru Fru and Mickey: their current strengths become zero, minus one and one. Play three Tramps and choose exert each time. The picker must exclude opposing Fru Fru with Aurora's Ward, opposing strength-four Donald and strength-two Tramp, but include own Ward Aladdin and both reduced characters. Cancel and reopen the first picker before selecting. Each chosen target becomes exerted; the fresh sources gain no Rush. Check both public logs.",
  playerOne: {
    play: [auroraDreamingGuardian, fruFruVipGuest, donaldDuckTaxiDriver],
    deck,
  },
  playerTwo: {
    play: [aladdinPrinceAli, fruFruVipGuest, mickeyMouseTrueFriend],
    hand: [
      distract,
      distract,
      distract,
      trampQuickOnHisFeet,
      trampQuickOnHisFeet,
      trampQuickOnHisFeet,
    ],
    inkwell: 12,
    deck: [...deck, ...deck],
  },
});

// Synthetic boundary fixture: this is the static reducer from Tramp's unit test,
// not a printed Lorcana card. It makes the source eligible for its own ability.
const trampAuditStrengthReducer: CharacterCard = {
  ...fruFruVipGuest,
  id: "tramp-audit-strength-reducer",
  canonicalId: "tramp-audit-strength-reducer",
  slug: "tramp-audit-strength-reducer",
  printings: [],
  reprints: [],
  name: "Audit Strength Reducer",
  version: "Synthetic Test Card",
  i18n: {
    en: { name: "Audit Strength Reducer", version: "Synthetic Test Card" },
    de: { name: "Audit Strength Reducer", version: "Synthetic Test Card" },
    es: { name: "Audit Strength Reducer", version: "Synthetic Test Card" },
    fr: { name: "Audit Strength Reducer", version: "Synthetic Test Card" },
    it: { name: "Audit Strength Reducer", version: "Synthetic Test Card" },
  },
  text: "Test only: Your characters get -2 strength.",
  abilities: [
    {
      type: "static",
      effect: { type: "modify-stat", stat: "strength", modifier: -2, target: "YOUR_CHARACTERS" },
    },
  ],
};

export const set14AuditTrampSelfFixture = createFixture({
  id: "set14-audit-tramp-self",
  name: "Hyperia audit: Tramp self-target synthetic boundary",
  skipPreGame: true,
  seed: "set14-audit-tramp-self",
  description:
    "Synthetic test-only strength reducer matches the unit-test boundary; it is not a printed card. Play Tramp for two. Its current strength becomes zero. Choose exert, select Tramp itself, and verify the fresh source becomes exerted without gaining Rush. Check both public logs.",
  playerOne: { play: [trampAuditStrengthReducer], hand: [trampQuickOnHisFeet], inkwell: 2, deck },
  playerTwo: { play: [donaldDuckTaxiDriver], deck },
});

export const set14AuditMeilinFixture = createFixture({
  id: "set14-audit-meilin",
  name: "Hyperia audit: Meilin Ecstatic Fan",
  skipPreGame: true,
  seed: "set14-audit-meilin",
  description:
    "Play the second Meilin for three; drying blocks singing. Dry Singer 5 rejects Higitus (six), but sings Juanita (five) without ink and both copies grant one drop. Pay Magnificent with two drops: neither replenishes them this turn. Pay Mother Knows Best to return the fresh copy, then replay it; One Jump Ahead now grants one drop from that copy only. Opponent's Magnificent grants only their own Meilin's drop. Next own turn sing Magnificent with each copy: the first grants two drops, the second grants none. Check both logs and payment counters.",
  playerOne: {
    play: [meilinLeeEcstaticFan],
    hand: [
      meilinLeeEcstaticFan,
      everyoneKnowsJuanita,
      higitusFigitus,
      magnificentMarvelous,
      magnificentMarvelous,
      magnificentMarvelous,
      motherKnowsBest,
      oneJumpAhead,
    ],
    inkwell: 15,
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [meilinLeeEcstaticFan],
    hand: [magnificentMarvelous],
    inkwell: 4,
    deck: [...deck, ...deck],
  },
});

export const set14AuditMeilinSingerBoundsPlayerTwoFixture = createFixture({
  id: "set14-audit-meilin-singer-bounds-player-two",
  name: "Hyperia audit: Meilin lower Singer costs and non-song exclusion for player two",
  skipPreGame: true,
  seed: "set14-audit-meilin-singer-bounds-player-two",
  description:
    "Pass to player two. Pay one bank ink for Befuddle to return own Fru Fru: no Super Stoked reward. With bank zero and one held drop, ordinary Magnificent payment is unavailable. Sing Magnificent (four) with one Meilin: four in-play copies each grant one drop, total five. Copies in hand, discard, deck and inkwell must not trigger, nor does opposing Meilin. Sing Friends (three), One Jump Ahead (two) and Unbirthday (one) with the other copies: no further drops. Pay the second Unbirthday with one selected drop: total four, no replenishment. All four singers exert and singing preserves bank zero. Check both public logs and hidden draw identities.",
  playerOne: { play: [meilinLeeEcstaticFan], inkwell: 2, inkDrops: 3, deck: [...deck, ...deck] },
  playerTwo: {
    play: [
      meilinLeeEcstaticFan,
      meilinLeeEcstaticFan,
      meilinLeeEcstaticFan,
      meilinLeeEcstaticFan,
      fruFruVipGuest,
    ],
    hand: [
      befuddle,
      magnificentMarvelous,
      friendsOnTheOtherSide,
      oneJumpAhead,
      aVeryMerryUnbirthday,
      aVeryMerryUnbirthday,
      meilinLeeEcstaticFan,
    ],
    discard: [meilinLeeEcstaticFan],
    inkwell: [meilinLeeEcstaticFan],
    inkDrops: 1,
    deck: [meilinLeeEcstaticFan, ...deck, ...deck],
  },
});

export const set14AuditMeilinTogetherPlayerTwoFixture = createFixture({
  id: "set14-audit-meilin-together-player-two",
  name: "Hyperia audit: Meilin exact-eight Singer contribution for player two",
  skipPreGame: true,
  seed: "set14-audit-meilin-together-player-two",
  description:
    "Pass to player two. Sing Nothing We Won't Do together: Meilin alone counts five and with Fru Fru counts six, so neither selection can confirm. Cancel and retry. Meilin plus Mickey counts exactly eight despite their printed costs totaling six. Opposing Meilin is excluded. Confirm: no ink is paid, both singers ready from the song, all own characters cannot quest, and Super Stoked grants exactly one drop. Sing Magnificent with ready Meilin afterward: no extra drop. Verify both logs and opposing bank2/drop3 stay unchanged.",
  playerOne: { play: [meilinLeeEcstaticFan], inkwell: 2, inkDrops: 3, deck },
  playerTwo: {
    play: [meilinLeeEcstaticFan, mickeyMouseTrueFriend, fruFruVipGuest],
    hand: [nothingWeWontDo, magnificentMarvelous],
    deck: [...deck, ...deck],
  },
});

export const set14AuditRoxanneFixture = createFixture({
  id: "set14-audit-roxanne",
  name: "Hyperia audit: Roxanne Concert Lover",
  skipPreGame: true,
  seed: "set14-audit-roxanne",
  description:
    "Play Roxanne for two and move her with damaged Fru Fru to Belle's House for free. Own Aladdin is also eligible despite Ward; opposing characters and locations are excluded. Play the second Roxanne and decline. Both fresh copies cannot quest. Fru Fru quests two this turn, retaining one damage. Pass both turns: the location persists, Fru Fru quests one and each Roxanne quests one, for five total. Check both public movement, decline and quest logs. Reload to choose Maui's Place instead.",
  playerOne: {
    play: [
      { card: fruFruVipGuest, damage: 1 },
      aladdinPrinceAli,
      bellesHouseMauricesWorkshop,
      mauisPlaceOfExileHiddenIsland,
    ],
    hand: [roxanneConcertLover, roxanneConcertLover],
    inkwell: 4,
    deck,
  },
  playerTwo: { play: [fruFruVipGuest, bellesHouseMauricesWorkshop], deck },
});

export const set14AuditRoxanneStatesPlayerTwoFixture = createFixture({
  id: "set14-audit-roxanne-states-player-two",
  name: "Hyperia audit: Roxanne transfers and movement events for player two",
  skipPreGame: true,
  seed: "set14-audit-roxanne-states-player-two",
  description:
    "Pass to player two. Quest damaged Fru Fru at Belle's House, then play Aladdin for two and Graveyard for four. Play three Roxannes for two each: move exerted Fru Fru, fresh Ward Aladdin, and ready damaged Mickey to Graveyard with one source each. First try Fru Fru plus its current Belle destination: reject without movement, lore bonus or arrival event; retry Graveyard. Picker must exclude opposing cards, own items, hand/discard cards, and source. Each valid pair creates two New Arrival triggers: Graveyard holds six cards and deck ends six. Transfers preserve damage/exerted/fresh state; only other characters gain one lore (Fru2, Aladdin2, Mickey3); source lore stays one. Quest Mickey for three (own total four), then pass: all bonuses expire while positions remain. Bank12 pays only entry costs and both drop pools remain unchanged. Check both public logs and hidden cards-under privacy.",
  playerOne: { play: [fruFruVipGuest, bellesHouseMauricesWorkshop], inkwell: 2, inkDrops: 3, deck },
  playerTwo: {
    play: [
      bellesHouseMauricesWorkshop,
      mauisPlaceOfExileHiddenIsland,
      ancestralGuitar,
      { card: fruFruVipGuest, damage: 1, atLocation: bellesHouseMauricesWorkshop },
      { card: mickeyMouseTrueFriend, damage: 1, atLocation: bellesHouseMauricesWorkshop },
    ],
    hand: [
      aladdinPrinceAli,
      graveyardOfChristmasFutureLonelyRestingPlace,
      roxanneConcertLover,
      roxanneConcertLover,
      roxanneConcertLover,
      fruFruVipGuest,
    ],
    discard: [mickeyMouseTrueFriend],
    inkwell: 12,
    inkDrops: 2,
    deck: [roxanneConcertLover, ...deck, ...deck],
  },
});

export const set14AuditRoxanneStackDeparturePlayerTwoFixture = createFixture({
  id: "set14-audit-roxanne-stack-departure-player-two",
  name: "Hyperia audit: Roxanne stacked lore survives source departure for player two",
  skipPreGame: true,
  seed: "set14-audit-roxanne-stack-departure-player-two",
  description:
    "Pass to player two. Move damaged ready Mickey from Belle to Graveyard with first Roxanne, then from Graveyard to Maui's Place with second Roxanne. Each transfer adds one lore: Mickey reaches four and keeps one damage/readiness. First pair creates exactly two New Arrivals. Play two Befuddles to return both Roxannes to hand. Mickey keeps both bonuses with neither source in play, quests for four, then passing expires both bonuses while Maui's location/Resist remain. Bank6 pays only two Roxannes and two Befuddles; held drops remain two, opposing bank2/drop3 unchanged. Check both logs and stacked card details.",
  playerOne: { play: [fruFruVipGuest], inkwell: 2, inkDrops: 3, deck },
  playerTwo: {
    play: [
      bellesHouseMauricesWorkshop,
      graveyardOfChristmasFutureLonelyRestingPlace,
      mauisPlaceOfExileHiddenIsland,
      { card: mickeyMouseTrueFriend, damage: 1, atLocation: bellesHouseMauricesWorkshop },
    ],
    hand: [roxanneConcertLover, roxanneConcertLover, befuddle, befuddle],
    inkwell: 6,
    inkDrops: 2,
    deck: [...deck, ...deck],
  },
});

export const set14AuditWasabiFixture = createFixture({
  id: "set14-audit-wasabi",
  name: "Hyperia audit: Wasabi Called into Battle",
  skipPreGame: true,
  seed: "set14-audit-wasabi",
  description:
    "Challenge Fru Fru with dry Wasabi: deal four and take one. Resolve Shere Khan's drop first, then Twin Blades for six to Yama. The mandatory picker excludes self, opposing Ward and locations. Pay Magnificent with one drop and three ink: Strength returns to four. Play a fresh Wasabi for five; drying blocks actions and the card is uninkable. Ready the first copy with Fan the Flames, challenge Donald for four and take four: both banish. Twin Blades still deals four to Archimedes. Next own turn quest the surviving copy for two, for four total lore. Reload and challenge Belle's House to verify no Twin Blades trigger from location damage. Check both public logs.",
  playerOne: {
    play: [wasabiCalledIntoBattle, shereKhanKhanIndustriesCeo],
    hand: [wasabiCalledIntoBattle, magnificentMarvelous, fanTheFlames],
    inkwell: 10,
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [
      { card: fruFruVipGuest, exerted: true },
      { card: donaldDuckTaxiDriver, exerted: true },
      yamaNotoriousCriminal,
      archimedesMessengerOwl,
      aladdinPrinceAli,
      bellesHouseMauricesWorkshop,
    ],
    deck: [...deck, ...deck],
  },
});

export const set14AuditMulanFixture = createFixture({
  id: "set14-audit-mulan",
  name: "Hyperia audit: Mulan Martial Arts Master",
  skipPreGame: true,
  seed: "set14-audit-mulan",
  description:
    "Play Mulan for four and grant dry Wasabi +2 Strength plus character-challenge draw. Challenge Fru Fru for six and draw one before combat. Return Wasabi with Mother Knows Best and replay for five: Strength is four and the old draw grant is gone. Quest the dry Mulan for two and grant replayed Wasabi Rush; it can challenge Yama for four without drawing, but cannot quest. End the turn to remove Rush and temporary grants. Reload and grant dry Wasabi the entry ability, then challenge Belle’s House for six with no draw. Check both public logs and target filters.",
  playerOne: {
    play: [mulanMartialArtsMaster, wasabiCalledIntoBattle, aladdinPrinceAli],
    hand: [mulanMartialArtsMaster, motherKnowsBest, fanTheFlames],
    inkwell: 20,
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [
      { card: fruFruVipGuest, exerted: true },
      { card: yamaNotoriousCriminal, exerted: true },
      archimedesMessengerOwl,
      aladdinPrinceAli,
      bellesHouseMauricesWorkshop,
    ],
    deck: [...deck, ...deck],
  },
});

export const set14AuditIntimidationFixture = createFixture({
  id: "set14-audit-intimidation",
  name: "Hyperia audit: Intimidation Tactics",
  skipPreGame: true,
  seed: "set14-audit-intimidation",
  description:
    "Play Intimidation for two and banish opposing Mulan (Strength two). Picker excludes Wasabi (four), opposing Ward, and locations. Play Distract on Wasabi: current Strength becomes two, then Intimidation can banish it. Play another Intimidation and choose your own Ward Aladdin. Inspect each payment and banishment in both public logs. Reload, play Mulan and grant +2 to opposing Mulan: Strength four excludes that target. No legal targets must not block playing the action.",
  playerOne: {
    play: [aladdinPrinceAli],
    hand: [
      intimidationTactics,
      intimidationTactics,
      intimidationTactics,
      distract,
      mulanMartialArtsMaster,
    ],
    inkwell: 12,
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [
      mulanMartialArtsMaster,
      wasabiCalledIntoBattle,
      aladdinPrinceAli,
      bellesHouseMauricesWorkshop,
    ],
    deck: [...deck, ...deck],
  },
});

export const set14AuditBoundariesFixture = createFixture({
  id: "set14-audit-boundaries",
  name: "Hyperia audit: Pushing Boundaries",
  skipPreGame: true,
  seed: "set14-audit-boundaries",
  description:
    "Pay two for Pushing Boundaries on own Ward Aladdin: one ink drop, existing damage remains. Challenge exerted Yama for two and take zero. Ready Aladdin with Fan the Flames, challenge Yama again and take zero; only one drop was generated. Fire the Cannons on Aladdin outside the challenge deals two and banishes him despite the grant. Inspect both logs. Reload, grant Aladdin protection, quest and pass: opponent Donald can challenge and banish him after protection expires.",
  playerOne: {
    play: [{ card: aladdinPrinceAli, damage: 1 }, fruFruVipGuest],
    hand: [pushingBoundaries, fanTheFlames, fireTheCannons, pushingBoundaries],
    inkwell: 7,
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [
      { card: yamaNotoriousCriminal, exerted: true },
      donaldDuckTaxiDriver,
      bellesHouseMauricesWorkshop,
    ],
    deck: [...deck, ...deck],
  },
});

export const set14AuditScareFixture = createFixture({
  id: "set14-audit-scare",
  name: "Hyperia audit: If She Doesn't Scare You",
  skipPreGame: true,
  seed: "set14-audit-scare",
  description:
    "Pay four for the song: first choose your own Ward Aladdin, then opposing Wasabi. Each prompt must respect its owner and zone; opposing Ward and locations are excluded. Sing the second song with dry cost-four Mulan without ink payment; choose Mulan herself for the first banishment and your own Fru Fru for the second. Play the last song for four with no own characters: opposing Ward and location remain untouched. Inspect all payments, singing and banishments in both public logs.",
  playerOne: {
    play: [aladdinPrinceAli, mulanMartialArtsMaster, fruFruVipGuest],
    hand: [ifSheDoesntScareYou, ifSheDoesntScareYou, ifSheDoesntScareYou],
    inkwell: 8,
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [wasabiCalledIntoBattle, aladdinPrinceAli, bellesHouseMauricesWorkshop],
    deck: [...deck, ...deck],
  },
});

export const set14AuditGoodbyeFixture = createFixture({
  id: "set14-audit-goodbye",
  name: "Hyperia audit: Though I Have to Say Goodbye",
  skipPreGame: true,
  seed: "set14-audit-goodbye",
  description:
    "Pay two and boost own Ward Aladdin: one old song plus two milled songs gives +3 Strength (five total). The resolving song does not count. Sing the second copy with dry Mulan for free; three non-songs are milled and four songs already in discard give another +4 (nine total). Opposing discard songs do not count. Check target owners, opposing Ward and location exclusion, mill identities, payment and both public logs. Pass the turn: Aladdin returns to Strength two.",
  playerOne: {
    play: [aladdinPrinceAli, mulanMartialArtsMaster],
    hand: [thoughIHaveToSayGoodbye, thoughIHaveToSayGoodbye],
    inkwell: 2,
    discard: [rememberMe],
    deck: [
      healingGlow,
      breakCard,
      dragonFire,
      fanTheFlames,
      magnificentMarvelous,
      fruFruVipGuest,
      everyoneKnowsJuanita,
    ],
  },
  playerTwo: {
    play: [wasabiCalledIntoBattle, aladdinPrinceAli, bellesHouseMauricesWorkshop],
    discard: [rememberMe, rememberMe, rememberMe],
    deck,
  },
});

export const set14AuditPhotoFixture = createFixture({
  id: "set14-audit-photo",
  name: "Hyperia audit: Rivera Family Photo",
  skipPreGame: true,
  seed: "set14-audit-photo",
  description:
    "Choose lore with nine own discard cards: pay one and exert, but gain no lore despite eleven opposing discard cards. Use the second Photo to mill two and reach eleven: pay one, exert and do not gain lore. Play the third Photo for one and immediately choose lore for one: gain exactly one lore and do not mill. With zero ink, no Photo can activate. Pass both turns: Photos ready and ink refreshes, allowing another lore activation. Inspect printed mode labels and both public logs.",
  playerOne: {
    play: [riveraFamilyPhoto, riveraFamilyPhoto],
    hand: [riveraFamilyPhoto],
    inkwell: 4,
    discard: [
      motherKnowsBest,
      fanTheFlames,
      dragonFire,
      breakCard,
      healingGlow,
      befuddle,
      fireTheCannons,
      fruFruVipGuest,
      aladdinPrinceAli,
    ],
    deck: [...deck, fruFruVipGuest, healingGlow],
  },
  playerTwo: {
    play: [riveraFamilyPhoto],
    discard: [
      motherKnowsBest,
      fanTheFlames,
      dragonFire,
      breakCard,
      healingGlow,
      befuddle,
      fireTheCannons,
      fruFruVipGuest,
      aladdinPrinceAli,
      magnificentMarvelous,
      everyoneKnowsJuanita,
    ],
    deck,
  },
});

export const set14AuditTornMemoriesFixture = createFixture({
  id: "set14-audit-torn-memories",
  name: "Hyperia audit: The Torn Corner Fond Memories",
  skipPreGame: true,
  seed: "set14-audit-torn-memories",
  description:
    "Activate the existing Corner at nine discard cards: pay one and exert without drawing, despite eleven opposing discard cards. Activate Photo's mill mode for one: Corner and Fru Fru enter discard, raising nine to eleven. Accept Mend the Photo: only the new Corner enters play free and ready, reducing discard to exactly ten; the older discarded copy stays. Activate the new Corner immediately for one to draw Stacey, leaving zero ink. Inspect threshold, source identity, private draw visibility, both printed abilities and both public logs. Reload and decline Mend the Photo: discard stays eleven and only the original exerted Corner remains in play.",
  playerOne: {
    play: [riveraFamilyPhoto, theTornCorner],
    inkwell: 3,
    discard: [
      motherKnowsBest,
      fanTheFlames,
      dragonFire,
      breakCard,
      healingGlow,
      befuddle,
      fireTheCannons,
      aladdinPrinceAli,
      theTornCorner,
    ],
    deck: [...deck, staceyPowerlineSuperfan, fruFruVipGuest, theTornCorner],
  },
  playerTwo: {
    discard: [
      motherKnowsBest,
      fanTheFlames,
      dragonFire,
      breakCard,
      healingGlow,
      befuddle,
      fireTheCannons,
      aladdinPrinceAli,
      theTornCorner,
      magnificentMarvelous,
      everyoneKnowsJuanita,
    ],
    deck,
  },
});

export const set14AuditJukeboxFixture = createFixture({
  id: "set14-audit-jukebox",
  name: "Hyperia audit: Jukebox",
  skipPreGame: true,
  seed: "set14-audit-jukebox",
  description:
    "Play Magnificent, Marvelous! for four ink with a matching discarded copy. Accept Jukebox and ready your exerted Ward Aladdin: he cannot quest. Opposing Ward Aladdin is not a legal target; opposing Wasabi is legal. Sing the second copy with dry Mulan for free: Jukebox cannot resolve a second time. Pass both turns, then sing the third copy and ready Mulan: the use refreshes but quest is blocked again. Reload and decline the first optional prompt; Aladdin stays exerted. Inspect printed text and both public logs.",
  playerOne: {
    hand: [magnificentMarvelous, magnificentMarvelous, magnificentMarvelous],
    play: [
      jukebox,
      { card: aladdinPrinceAli, exerted: true, isDrying: false },
      { card: mulanMartialArtsMaster, isDrying: false },
    ],
    inkwell: 4,
    discard: [magnificentMarvelous],
    deck,
  },
  playerTwo: {
    play: [
      { card: aladdinPrinceAli, exerted: true, isDrying: false },
      { card: wasabiCalledIntoBattle, exerted: true, isDrying: false },
      bellesHouseMauricesWorkshop,
    ],
    deck,
  },
});

export const set14AuditArielFixture = createFixture({
  id: "set14-audit-ariel",
  name: "Hyperia audit: Ariel Collector of Oddities",
  skipPreGame: true,
  seed: "set14-audit-ariel",
  description:
    "Your Ariel begins at one lore despite the opposing Jukebox. Play Photo for one ink to draw one and gain one lore. Play Jukebox for two ink to draw one and reach three lore. A second Jukebox costs two but gives no draw or extra lore. Break Photo for two ink: Ariel immediately returns to two lore. Inspect draw privacy and both public logs.",
  playerOne: {
    play: [{ card: arielCollectorOfOddities, isDrying: false }],
    hand: [riveraFamilyPhoto, jukebox, jukebox, breakCard],
    inkwell: 7,
    deck,
  },
  playerTwo: { play: [jukebox], deck },
});

export const set14AuditArielPlayerTwoFixture = createFixture({
  id: "set14-audit-ariel-player-two",
  name: "Hyperia audit: Ariel Player Two collections",
  skipPreGame: true,
  seed: "ariel-player-two",
  description:
    "Pass to Player Two. Two Ariels each draw for Photo and the first Jukebox despite the opposing Jukebox. The second own Jukebox adds no draw or lore. Break one Jukebox: each Ariel stays at three lore. Quest one Ariel, then Break the last Jukebox: the other quests for two. Inspect both logs for four private draws and five collection lore.",
  playerOne: { play: [jukebox], deck },
  playerTwo: {
    play: [
      { card: arielCollectorOfOddities, isDrying: false },
      { card: arielCollectorOfOddities, isDrying: false },
    ],
    hand: [riveraFamilyPhoto, jukebox, jukebox, breakCard, breakCard],
    inkwell: 9,
    deck: [...deck, ...deck],
  },
});

export const set14AuditArielEmptyFixture = createFixture({
  id: "set14-audit-ariel-empty",
  name: "Hyperia audit: Ariel empty deck",
  skipPreGame: true,
  seed: "ariel-empty",
  description:
    "Play Photo with two Ariels and an empty deck. Both draw triggers complete without a fabricated hand card. Each Ariel gains one collection lore. Quest both for four total lore, then pass: the empty-draw loss occurs at your turn end. Inspect both logs.",
  playerOne: {
    play: [
      { card: arielCollectorOfOddities, isDrying: false },
      { card: arielCollectorOfOddities, isDrying: false },
    ],
    hand: [riveraFamilyPhoto],
    inkwell: 1,
    deck: [],
  },
  playerTwo: { deck },
});

// Synthetic entry effects isolate CR 6.2.4; Ariel is the actual printed card.
const arielAuditMatchingItem: ItemCard = {
  ...riveraFamilyPhoto,
  id: "ariel-audit-matching-item",
  canonicalId: "ariel-audit-matching-item",
  slug: "ariel-audit-matching-item",
  printings: [],
  reprints: [],
  name: "Audit Matching Item",
  cost: 0,
  i18n: {
    en: { name: "Audit Matching Item" },
    de: { name: "Audit Matching Item" },
    es: { name: "Audit Matching Item" },
    fr: { name: "Audit Matching Item" },
    it: { name: "Audit Matching Item" },
  },
  text: "Test only: matching item name.",
  abilities: [],
};
const arielAuditRemover: ItemCard = {
  ...arielAuditMatchingItem,
  id: "ariel-audit-remover",
  canonicalId: "ariel-audit-remover",
  slug: "ariel-audit-remover",
  text: "Test only: When played, banish chosen own item.",
  abilities: [
    {
      type: "triggered",
      name: "REMOVE MATCH",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["item"],
        },
      },
    },
  ],
};
const arielAuditSummoner: ItemCard = {
  ...arielAuditMatchingItem,
  id: "ariel-audit-summoner",
  canonicalId: "ariel-audit-summoner",
  slug: "ariel-audit-summoner",
  text: "Test only: When played, play an item free from your discard.",
  abilities: [
    {
      type: "triggered",
      name: "ADD MATCH",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: { type: "play-card", from: "discard", cardType: "item", cost: "free" },
    },
  ],
};
export const set14AuditArielNameRemovalFixture = createFixture({
  id: "set14-audit-ariel-name-removal",
  name: "Hyperia audit: Ariel name becomes unique",
  skipPreGame: true,
  seed: "ariel-name-removal",
  description:
    "Synthetic timing test. Play Audit Matching Item, then resolve its REMOVE MATCH entry trigger before Ariel. Banish the old matching item. Ariel must draw because the name becomes unique at resolution. Inspect owner and public draw logs.",
  playerOne: {
    play: [arielCollectorOfOddities, arielAuditMatchingItem],
    hand: [arielAuditRemover],
    deck,
  },
  playerTwo: { deck },
});
export const set14AuditArielNameAddedFixture = createFixture({
  id: "set14-audit-ariel-name-added",
  name: "Hyperia audit: Ariel name stops being unique",
  skipPreGame: true,
  seed: "ariel-name-added",
  description:
    "Synthetic timing test. Play Audit Matching Item, then resolve its ADD MATCH entry trigger before Ariel. Play the matching item free from discard. Both Ariel triggers must complete without drawing because the name is no longer unique. Inspect both logs.",
  playerOne: {
    play: [arielCollectorOfOddities],
    hand: [arielAuditSummoner],
    discard: [arielAuditMatchingItem],
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditMinniePlayerTwoFixture = createFixture({
  id: "set14-audit-minnie-player-two",
  name: "Hyperia audit: Minnie Player Two choices",
  skipPreGame: true,
  seed: "set14-audit-minnie-player-two",
  description:
    "Pass to Player Two and quest both Minnie copies. Pass to queue two separate All by Design abilities. First decline both choices: three ink stays ready. Second decline the look and return one exact Photo: remaining ink exerts. Reload for first look-and-return then second look-only. Opposing ink stays ready; private identities remain hidden in opposing/spectator views and both logs.",
  playerOne: { inkwell: [riveraFamilyPhoto, jukebox], deck },
  playerTwo: {
    play: [
      { card: minnieMouseUrbanVisionary, isDrying: false },
      { card: minnieMouseUrbanVisionary, isDrying: false },
    ],
    inkwell: [riveraFamilyPhoto, riveraFamilyPhoto, jukebox],
    deck,
  },
});

export const set14AuditMinnieWardTimingFixture = createFixture({
  id: "set14-audit-minnie-ward-timing",
  name: "Hyperia audit: Minnie Ward and timing",
  skipPreGame: true,
  seed: "set14-audit-minnie-ward-timing",
  description:
    "Player One Dragon Fire picker excludes both opposing Ward Minnies and includes only own Fru Fru. Cancel without payment and pass: opposing exerted Minnie does not trigger. Player Two Dragon Fire can banish their own Minnie. Leave the other ready and pass: no All by Design trigger. Inspect both logs for banishment and absence of false end-turn effects.",
  playerOne: { hand: [dragonFire], play: [fruFruVipGuest], inkwell: 5, deck },
  playerTwo: {
    hand: [dragonFire],
    play: [
      { card: minnieMouseUrbanVisionary, isDrying: false, exerted: true },
      { card: minnieMouseUrbanVisionary, isDrying: false },
    ],
    inkwell: 5,
    deck,
  },
});

export const set14AuditMinnieEmptyFixture = createFixture({
  id: "set14-audit-minnie-empty",
  name: "Hyperia audit: Minnie empty inkwell",
  skipPreGame: true,
  seed: "set14-audit-minnie-empty",
  description:
    "Pass with exerted Minnie and an empty inkwell. Accept the private look and return steps where offered. The ability completes with no hand card, ink or pending choice. Inspect both logs.",
  playerOne: { play: [{ card: minnieMouseUrbanVisionary, isDrying: false, exerted: true }], deck },
  playerTwo: { deck },
});

export const set14AuditMinnieFixture = createFixture({
  id: "set14-audit-minnie",
  name: "Hyperia audit: Minnie Mouse Urban Visionary",
  skipPreGame: true,
  seed: "set14-audit-minnie",
  description:
    "Quest Minnie for three lore, then pass. Decide separately whether to look at your three ink cards and whether to return one. Accept either choice to exert the remaining own ink; decline both to keep it ready. The opponent's two ink must remain ready. Inspect both logs and views for private ink identities. Reload for all four combinations.",
  playerOne: {
    play: [{ card: minnieMouseUrbanVisionary, isDrying: false }],
    inkwell: [riveraFamilyPhoto, jukebox, carlFredricksenWildernessGuide],
    deck,
  },
  playerTwo: { inkwell: 2, deck },
});

export const set14AuditJudyDayCampPlayerTwoFixture = createFixture({
  id: "set14-audit-judy-daycamp-player-two",
  name: "Hyperia audit: Judy Day Camp Player Two",
  skipPreGame: true,
  seed: "set14-audit-judy-daycamp-player-two",
  description:
    "Pass to Player Two. Distract one plain Judy to zero Strength. Quest Stadium Judy to Support your Ward Aladdin from two to six; opposing Ward and the source are excluded. Quest zero-strength Judy to Support opposing Fru Fru without increasing Strength. Quest the remaining plain Judy and decline. Play the first hand Judy: no Lend a Paw. Banish that new Judy with Dragon Fire. Play the next Judy and accept: non-inkable Jukebox becomes facedown exerted ink. Play the last Judy and decline, preserving Photo. Pass to verify Support expires, and inspect both logs for private ink identity.",
  playerOne: { play: [aladdinPrinceAli, fruFruVipGuest], deck },
  playerTwo: {
    hand: [
      distract,
      judyHoppsDayCampInstructor,
      judyHoppsDayCampInstructor,
      judyHoppsDayCampInstructor,
      dragonFire,
    ],
    play: [
      khanStadiumStateOfTheArt,
      { card: judyHoppsDayCampInstructor, isDrying: false, atLocation: khanStadiumStateOfTheArt },
      { card: judyHoppsDayCampInstructor, isDrying: false },
      { card: judyHoppsDayCampInstructor, isDrying: false },
      { card: aladdinPrinceAli, isDrying: false },
    ],
    inkwell: 13,
    deck: [riveraFamilyPhoto, jukebox, jukebox, fruFruVipGuest],
  },
});

export const set14AuditJudyDayCampEmptyFixture = createFixture({
  id: "set14-audit-judy-daycamp-empty",
  name: "Hyperia audit: Judy Day Camp empty deck",
  skipPreGame: true,
  seed: "set14-audit-judy-daycamp-empty",
  description:
    "Play Photo then the first Judy: the existing character and item play do not qualify Lend a Paw. Play Fru Fru then the second Judy and accept Lend a Paw. With an empty deck it resolves without adding ink or leaving a pending effect. Inspect both logs.",
  playerOne: {
    hand: [
      riveraFamilyPhoto,
      judyHoppsDayCampInstructor,
      fruFruVipGuest,
      judyHoppsDayCampInstructor,
    ],
    play: [fruFruVipGuest],
    inkwell: 6,
    deck: [],
  },
  playerTwo: { deck },
});

export const set14AuditJudyDayCampFixture = createFixture({
  id: "set14-audit-judy-daycamp",
  name: "Hyperia audit: Judy Hopps Day Camp Instructor",
  skipPreGame: true,
  seed: "set14-audit-judy-daycamp",
  description:
    "Play Fru Fru for one ink, then Judy for two. Accept Lend a Paw: Photo moves from deck top into facedown exerted ink, leaving two ready ink. Reload and play Judy first to verify no trigger. Quest the dry Judy for one lore and accept Support for your Carl or the opposing Duchess: add two Strength until turn end. Inspect private ink identity and both public logs.",
  playerOne: {
    hand: [fruFruVipGuest, judyHoppsDayCampInstructor],
    play: [
      { card: judyHoppsDayCampInstructor, isDrying: false },
      { card: carlFredricksenWildernessGuide, isDrying: false },
    ],
    inkwell: 5,
    deck: [...deck, riveraFamilyPhoto],
  },
  playerTwo: {
    play: [{ card: duchessCosmopolitanCat, isDrying: false }],
    deck,
  },
});

export const set14AuditDuchessFixture = createFixture({
  id: "set14-audit-duchess",
  name: "Hyperia audit: Duchess Cosmopolitan Cat",
  skipPreGame: true,
  seed: "set14-audit-duchess",
  description:
    "Duchess starts at two lore because your Carl costs six and the opposing Aladdin costs two. Quest Duchess and choose top or bottom for the privately viewed Photo. Reload, use Dragon Fire to banish your Carl for five ink, and verify Duchess immediately returns to one lore. Quest her again and inspect both player logs for the correct lore and private deck choice.",
  playerOne: {
    hand: [dragonFire],
    play: [
      { card: duchessCosmopolitanCat, isDrying: false },
      { card: carlFredricksenWildernessGuide, isDrying: false },
    ],
    inkwell: 5,
    deck: [...deck, riveraFamilyPhoto],
  },
  playerTwo: {
    play: [{ card: aladdinPrinceAli, isDrying: false }, jukebox],
    deck,
  },
});

export const set14AuditOmalleyFixture = createFixture({
  id: "set14-audit-omalley",
  name: "Hyperia audit: Thomas O'Malley Savvy Vagabond",
  skipPreGame: true,
  seed: "set14-audit-omalley",
  description:
    "Quest O'Malley for two lore. Your Photo costs one and the opposing Carl costs six. Carl goes to the opponent's hand, while Photo moves to your deck bottom. Inspect both public logs for revealed names and the result. Pass to observe the opponent draw and confirm Carl remains in their hand.",
  playerOne: {
    play: [{ card: thomasOmalleySavvyVagabond, isDrying: false }],
    deck: [...deck, riveraFamilyPhoto],
  },
  playerTwo: { deck: [...deck, carlFredricksenWildernessGuide] },
});

export const set14AuditHoneyCuriousFixture = createFixture({
  id: "set14-audit-honey-curious",
  name: "Hyperia audit: Honey Lemon Endlessly Curious",
  skipPreGame: true,
  seed: "set14-audit-honey-curious",
  description:
    "Quest Honey Lemon for one lore. Play Fru Fru for one ink; it must not consume the item discount. Play Jukebox for one ink instead of two. The second Jukebox then costs two ink, using the remaining ink. Inspect payment totals and both public logs. Reload and pass both turns without using the discount to verify expiry.",
  playerOne: {
    hand: [fruFruVipGuest, jukebox, jukebox],
    play: [{ card: honeyLemonEndlesslyCurious, isDrying: false }],
    inkwell: 4,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditHiroFixture = createFixture({
  id: "set14-audit-hiro",
  name: "Hyperia audit: Hiro Hamada Pioneering Inventor",
  skipPreGame: true,
  seed: "set14-audit-hiro",
  description:
    "With only the opposing item in play, Hiro quests for one lore. Reload, play your Photo for one ink and observe Hiro's lore change to two. Banish Photo with Break for two ink; Hiro returns immediately to one lore and quests for one. Inspect the board badges and both quest logs.",
  playerOne: {
    hand: [riveraFamilyPhoto, breakCard],
    play: [{ card: hiroHamadaPioneeringInventor, isDrying: false }],
    inkwell: 3,
    deck,
  },
  playerTwo: { play: [jukebox], deck },
});

export const set14AuditDaisyFixture = createFixture({
  id: "set14-audit-daisy",
  name: "Hyperia audit: Daisy Duck Savvy Investor",
  skipPreGame: true,
  seed: "set14-audit-daisy",
  description:
    "Play Daisy for three ink. Accept Save for the Future and choose the second non-inkable Daisy from hand: she becomes facedown exerted ink and available ink stays zero. Check own and opposing public logs for hidden card names. Reload and decline to keep the second Daisy and Jukebox in hand.",
  playerOne: { hand: [daisyDuckSavvyInvestor, daisyDuckSavvyInvestor, jukebox], inkwell: 3, deck },
  playerTwo: { deck },
});

export const set14AuditDuchessPlayerTwoFixture = createFixture({
  id: "set14-audit-duchess-player-two",
  name: "Hyperia audit: Duchess Player Two",
  skipPreGame: true,
  seed: "set14-audit-duchess-player-two",
  description:
    "Pass to Player Two. Both players' Carl costs six, so every Duchess has two lore. Quest the first Duchess, inspect only the top Photo from two identical deck copies and keep it on top. Opposing/spectator views must not see or arrange it. Cancel and reopen the mandatory look if needed. Dragon Fire your Carl: all Duchess lore immediately drops to one despite Researcher seven in hand. Quest the second and keep its Photo on top. Play the hand Carl for six: all lore returns to two, then quest the third and put its Photo on bottom. Total lore five; both logs must hide private inspected names and show exact quests and banishment.",
  playerOne: { play: [carlFredricksenWildernessGuide], deck },
  playerTwo: {
    play: [
      { card: duchessCosmopolitanCat, isDrying: false },
      { card: duchessCosmopolitanCat, isDrying: false },
      { card: duchessCosmopolitanCat, isDrying: false },
      carlFredricksenWildernessGuide,
    ],
    hand: [dragonFire, carlFredricksenWildernessGuide, honeyLemonIngeniousResearcher],
    inkwell: 11,
    deck: [riveraFamilyPhoto, riveraFamilyPhoto, fruFruVipGuest],
  },
});

export const set14AuditDuchessEmptyFixture = createFixture({
  id: "set14-audit-duchess-empty",
  name: "Hyperia audit: Duchess empty deck",
  skipPreGame: true,
  seed: "set14-audit-duchess-empty",
  description:
    "Quest Duchess with an empty deck. She herself is the highest-cost character, so quest gains two. Proper Etiquette must finish automatically without inspected cards, deck movement or stuck choices. Inspect both logs.",
  playerOne: { play: [{ card: duchessCosmopolitanCat, isDrying: false }], deck: [] },
  playerTwo: { deck },
});

export const set14AuditThomasTiesEmptyFixture = createFixture({
  id: "set14-audit-thomas-ties-empty",
  name: "Hyperia audit: Thomas ties and empty decks",
  skipPreGame: true,
  seed: "set14-audit-thomas-ties-empty",
  description:
    "Pass to Player Two. Quest four distinct Thomas copies. First reveal ties Photo and Fru Fru at one: both enter their own hands. Second ties Jukebox and Thomas at two: both enter their own hands. Third reveals only Player Two's Photo, which enters that hand. Fourth has both decks empty and completes with no moved cards. Total lore eight, Player One hand two, Player Two hand four including the turn draw. Inspect public reveal and routing logs in both views.",
  playerOne: { deck: [jukebox, riveraFamilyPhoto] },
  playerTwo: {
    play: Array.from({ length: 4 }, () => ({ card: thomasOmalleySavvyVagabond, isDrying: false })),
    deck: [riveraFamilyPhoto, thomasOmalleySavvyVagabond, fruFruVipGuest, fruFruVipGuest],
  },
});

export const set14AuditThomasPlayerTwoOrderFixture = createFixture({
  id: "set14-audit-thomas-player-two-order",
  name: "Hyperia audit: Thomas Player Two bottom order",
  skipPreGame: true,
  seed: "set14-audit-thomas-player-two-order",
  description:
    "Pass to Player Two. First Thomas quest compares own Photo one with opposing Lionheart four: Lionheart goes to Player One hand and own Photo goes below untouched Researcher. Second Thomas quest must reveal Researcher seven, give it to Player Two hand and put opposing Photo one on its owner's bottom. Inspect exact ownership and bottom routing in both logs; no hidden untouched card is revealed by the first quest.",
  playerOne: { deck: [riveraFamilyPhoto, lionheartCleaningUpTheCity] },
  playerTwo: {
    play: [
      { card: thomasOmalleySavvyVagabond, isDrying: false },
      { card: thomasOmalleySavvyVagabond, isDrying: false },
    ],
    deck: [honeyLemonIngeniousResearcher, riveraFamilyPhoto, fruFruVipGuest],
  },
});

export const set14AuditHoneyCuriousPlayerTwoFixture = createFixture({
  id: "set14-audit-honey-curious-player-two",
  name: "Hyperia audit: Curious Honey Player Two",
  skipPreGame: true,
  seed: "set14-audit-honey-curious-player-two",
  description:
    "Pass to Player Two. Quest two Honeys for two stacked item discounts. Play Fru Fru for one without consuming them. Play Photo for zero: both discounts are consumed, ink stays four. Both Jukeboxes then cost two each, ink reaches zero. Quest the third Honey and play the remaining Photo for zero with no new ink. Both logs must show exact quests, grants and item plays.",
  playerOne: { hand: [jukebox], inkwell: 1, deck },
  playerTwo: {
    play: [
      { card: honeyLemonEndlesslyCurious, isDrying: false },
      { card: honeyLemonEndlesslyCurious, isDrying: false },
      { card: honeyLemonEndlesslyCurious, isDrying: false },
    ],
    hand: [fruFruVipGuest, riveraFamilyPhoto, riveraFamilyPhoto, jukebox, jukebox],
    inkwell: 5,
    deck,
  },
});

export const set14AuditHoneyCuriousExpiryFixture = createFixture({
  id: "set14-audit-honey-curious-expiry",
  name: "Hyperia audit: Curious Honey discount expiry",
  skipPreGame: true,
  seed: "set14-audit-honey-curious-expiry",
  description:
    "Pass to Player Two and quest Honey to gain an item discount. Pass without using it. Player One cannot play Jukebox with one ink. Pass back: Player Two also cannot play Jukebox with one ink until Honey quests again. The new reduction allows it for exactly one. Verify marker expiry, ownership, payment and both logs.",
  playerOne: { hand: [jukebox], inkwell: 1, deck },
  playerTwo: {
    play: [{ card: honeyLemonEndlesslyCurious, isDrying: false }],
    hand: [jukebox],
    inkwell: 1,
    deck,
  },
});

export const set14AuditHiroPlayerTwoFixture = createFixture({
  id: "set14-audit-hiro-player-two",
  name: "Hyperia audit: Hiro Player Two",
  skipPreGame: true,
  seed: "set14-audit-hiro-player-two",
  description:
    "Pass to Player Two. Both Hiros quest for two with two own items; the bonus does not stack. Break own Jukebox: both values stay two. Quest one Hiro for two. Break the last own Photo: both values immediately become one despite opposing Photo and items in hand/discard. Quest the other Hiro for one, total three. Play the hand Photo: both regain two. Pass both turns, then quest both for four, total seven. Verify the exact quest and item banishment logs in both views.",
  playerOne: { play: [riveraFamilyPhoto], deck },
  playerTwo: {
    play: [
      { card: hiroHamadaPioneeringInventor, isDrying: false },
      { card: hiroHamadaPioneeringInventor, isDrying: false },
      riveraFamilyPhoto,
      jukebox,
    ],
    hand: [breakCard, breakCard, riveraFamilyPhoto],
    discard: [jukebox],
    inkwell: 7,
    deck,
  },
});

export const set14AuditDaisyPlayerTwoFixture = createFixture({
  id: "set14-audit-daisy-player-two",
  name: "Hyperia audit: Daisy Player Two",
  skipPreGame: true,
  seed: "set14-audit-daisy-player-two",
  description:
    "Pass to Player Two. Play one Daisy and decline; hand and ink stay unchanged by the effect. Play another Daisy and accept: only remaining own hand cards are offered, including non-inkable Daisy and Jukebox. Opposing and spectator views cannot see or choose them. Put the remaining Daisy into facedown exerted ink: four available of eleven total ink. Play Fru Fru with remaining ink; no new Save for the Future trigger. Inspect both logs.",
  playerOne: {
    hand: [daisyDuckSavvyInvestor],
    play: [riveraFamilyPhoto],
    discard: [jukebox],
    deck,
  },
  playerTwo: {
    hand: [daisyDuckSavvyInvestor, daisyDuckSavvyInvestor, daisyDuckSavvyInvestor, jukebox],
    play: [riveraFamilyPhoto],
    discard: [fruFruVipGuest],
    inkwell: 10,
    deck: [...deck, fruFruVipGuest],
  },
});

export const set14AuditDaisyEmptyHandFixture = createFixture({
  id: "set14-audit-daisy-empty-hand",
  name: "Hyperia audit: Daisy empty hand",
  skipPreGame: true,
  seed: "set14-audit-daisy-empty-hand",
  description:
    "Play the only hand card, Daisy. Save for the Future must finish without adding ink or leaving an unresolved choice. Ink remains three total and zero available. Inspect both public logs.",
  playerOne: { hand: [daisyDuckSavvyInvestor], inkwell: 3, deck },
  playerTwo: { deck },
});

export const set14AuditPriscillaFixture = createFixture({
  id: "set14-audit-priscilla",
  name: "Hyperia audit: Priscilla Efficient Clerk",
  skipPreGame: true,
  seed: "set14-audit-priscilla",
  description:
    "Quest the dry Priscilla for two lore. Accept Filing System, put Jukebox into hand and Photo into the inkwell. New ink must be facedown and exerted, leaving three available ink. Inspect both public logs for private card-name leaks. Play the second Priscilla for three ink: she enters exerted and does not trigger Filing System. Reload and decline the quest trigger to keep the deck and inkwell unchanged.",
  playerOne: {
    hand: [priscillaEfficientClerk],
    play: [{ card: priscillaEfficientClerk, isDrying: false }],
    inkwell: 3,
    deck: [...deck, riveraFamilyPhoto, jukebox],
  },
  playerTwo: { deck },
});

export const set14AuditPriscillaPlayerTwoFixture = createFixture({
  id: "set14-audit-priscilla-player-two",
  name: "Hyperia audit: Priscilla Player Two",
  skipPreGame: true,
  seed: "set14-audit-priscilla-player-two",
  description:
    "Pass to Player Two. Quest Priscilla and accept Filing System. Only Player Two can see and assign Photo and non-inkable Jukebox. Put Photo into hand and Jukebox into facedown exerted ink. Check the opposing and spectator views during selection and both logs afterward. Quest Fru Fru: it must not trigger Filing System.",
  playerOne: { deck },
  playerTwo: {
    play: [
      { card: priscillaEfficientClerk, isDrying: false },
      { card: fruFruVipGuest, isDrying: false },
    ],
    inkwell: 2,
    deck: [...deck, jukebox, riveraFamilyPhoto, fruFruVipGuest],
  },
});

export const set14AuditPriscillaShortDeckFixture = createFixture({
  id: "set14-audit-priscilla-short-deck",
  name: "Hyperia audit: Priscilla short deck",
  skipPreGame: true,
  seed: "set14-audit-priscilla-short-deck",
  description:
    "Quest the first Priscilla with one Jukebox in deck. The card must go into hand, with no ink-only completion. Quest the second with the now empty deck and accept: the effect must finish without adding hand or ink cards. Available ink stays two. Inspect both public logs.",
  playerOne: {
    play: [
      { card: priscillaEfficientClerk, isDrying: false },
      { card: priscillaEfficientClerk, isDrying: false },
    ],
    inkwell: 2,
    deck: [jukebox],
  },
  playerTwo: { deck },
});

export const set14AuditLionheartPlayerTwoFixture = createFixture({
  id: "set14-audit-lionheart-player-two",
  name: "Hyperia audit: Lionheart Player Two",
  skipPreGame: true,
  seed: "set14-audit-lionheart-player-two",
  description:
    "Pass to Player Two. Pay five ink plus one drop to heal Lionheart's four damage. Alert can challenge exerted Evasive Archimedes but not ready Evasive Lexington. After that challenge, activate Civic Duty while exerted: heal your Bridge's seven damage, opposing Carl's three damage, then choose undamaged own Ward Aladdin. Each costs six; the zero target has no fabricated heal. Picker excludes opposing Ward, items, hidden and discard cards; wrong view cannot resolve it. At zero ink further activation is disabled. Pass to Player One: plain Fru Fru can challenge Lionheart, proving Alert does not grant defensive Evasive. Inspect both logs.",
  playerOne: {
    play: [
      { card: archimedesHasHadEnough, exerted: true },
      { card: lexingtonFearlessFlier, isDrying: false },
      { card: carlFredricksenWildernessGuide, damage: 3 },
      { card: fruFruVipGuest, isDrying: false },
      { card: aladdinPrinceAli, damage: 1 },
    ],
    deck,
  },
  playerTwo: {
    play: [
      { card: lionheartCleaningUpTheCity, isDrying: false, damage: 4 },
      { card: landOfTheDeadMarigoldBridge, damage: 7 },
      { card: aladdinPrinceAli, isDrying: false },
      riveraFamilyPhoto,
    ],
    hand: [carlFredricksenWildernessGuide],
    discard: [carlFredricksenWildernessGuide],
    inkwell: 23,
    inkDrops: 1,
    deck,
  },
});

export const set14AuditLionheartFreshFixture = createFixture({
  id: "set14-audit-lionheart-fresh",
  name: "Hyperia audit: Lionheart fresh and exerted activation",
  skipPreGame: true,
  seed: "set14-audit-lionheart-fresh",
  description:
    "Activate the drying and exerted Lionheart for six ink to heal himself from four damage. Activate again to heal your Ward Aladdin's one damage. Fresh Ink and exerted state remain; neither prevents this non-exert ability. With zero ink, further activation is disabled. Inspect exact damage and both logs.",
  playerOne: {
    play: [
      { card: lionheartCleaningUpTheCity, isDrying: true, exerted: true, damage: 4 },
      { card: aladdinPrinceAli, damage: 1 },
    ],
    inkwell: 12,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditLionheartFixture = createFixture({
  id: "set14-audit-lionheart",
  name: "Hyperia audit: Lionheart Cleaning Up the City",
  skipPreGame: true,
  seed: "set14-audit-lionheart",
  description:
    "Activate Civic Duty for six ink to heal the opposing damaged Khan Stadium. Lionheart stays ready. Activate again to heal your damaged Carl, using the remaining six ink. Check damage badges and both public logs. Opposing Ward Aladdin must not be offered as a target.",
  playerOne: {
    play: [
      { card: lionheartCleaningUpTheCity, isDrying: false },
      { card: carlFredricksenWildernessGuide, damage: 3, isDrying: false },
    ],
    inkwell: 12,
    deck,
  },
  playerTwo: {
    play: [
      { card: khanStadiumStateOfTheArt, damage: 3 },
      { card: aladdinPrinceAli, damage: 1, isDrying: false },
    ],
    deck,
  },
});

export const set14AuditMimNosyFixture = createFixture({
  id: "set14-audit-mim-nosy",
  name: "Hyperia audit: Madam Mim Nosy Neighbor",
  skipPreGame: true,
  seed: "set14-audit-mim-nosy",
  description:
    "Play Mim for five ink and inspect the opponent's Photo, Jukebox and Carl. Cards remain in hand. Switch to spectator view: all three opposing cards must remain hidden. Return to player one and pass; the opponent draws a fourth card which was not part of the look. Inspect both player logs and spectator visibility. Reload and ink Mim instead: the opponent's hand stays hidden.",
  playerOne: { hand: [madamMimNosyNeighbor], inkwell: 5, deck },
  playerTwo: { hand: [riveraFamilyPhoto, jukebox, carlFredricksenWildernessGuide], deck },
});

export const set14AuditHoneyResearcherPlayerTwoFixture = createFixture({
  id: "set14-audit-honey-researcher-player-two",
  name: "Hyperia audit: Honey Lemon Player Two",
  skipPreGame: true,
  seed: "set14-audit-honey-researcher-player-two",
  description:
    "Pass to Player Two. Use one drop plus four ink to Shift onto the dry damaged Honey Lemon at Bridge. Retain one damage and location; quest immediately. Only the two own discarded items are selectable, not opposing items, characters, actions, hidden or in-play items. Return Photo for one drop and spend it on Fru Fru at zero ready ink. Next own quest decline with Jukebox still discarded; the next quest returns Jukebox for one drop. A fourth own quest has no eligible item and grants nothing. Inspect both logs, chooser ownership and hidden return privacy.",
  playerOne: { play: [honeyLemonTestingTheLimits], discard: [riveraFamilyPhoto], deck },
  playerTwo: {
    hand: [honeyLemonIngeniousResearcher, fruFruVipGuest, riveraFamilyPhoto],
    play: [
      landOfTheDeadMarigoldBridge,
      {
        card: honeyLemonTestingTheLimits,
        isDrying: false,
        damage: 1,
        atLocation: landOfTheDeadMarigoldBridge,
      },
      riveraFamilyPhoto,
    ],
    discard: [riveraFamilyPhoto, jukebox, aladdinPrinceAli, fireTheCannons],
    inkwell: 4,
    inkDrops: 1,
    deck,
  },
});

export const set14AuditHoneyResearcherShiftStatesFixture = createFixture({
  id: "set14-audit-honey-researcher-shift-states",
  name: "Hyperia audit: Honey Lemon Shift states",
  skipPreGame: true,
  seed: "set14-audit-honey-researcher-shift-states",
  description:
    "Shift one copy onto the exerted dry base and another onto the ready drying base, five ink each. Retain one damage and each base's exerted/drying state; neither can quest now. Opposing Honey Lemon and own Aladdin cannot be Shift targets. Play the third Researcher normally for seven: no item return or drop on entry, and she is drying. After both turns pass, quest each ready Researcher; opposing discarded Photo does not enable a return or drop. Inspect both logs.",
  playerOne: {
    hand: [
      honeyLemonIngeniousResearcher,
      honeyLemonIngeniousResearcher,
      honeyLemonIngeniousResearcher,
    ],
    play: [
      { card: honeyLemonTestingTheLimits, isDrying: false, exerted: true, damage: 1 },
      { card: honeyLemonTestingTheLimits, isDrying: true, damage: 1 },
      aladdinPrinceAli,
    ],
    inkwell: 17,
    discard: [fruFruVipGuest],
    deck,
  },
  playerTwo: { play: [honeyLemonTestingTheLimits], discard: [riveraFamilyPhoto], deck },
});

export const set14AuditHoneyResearcherFixture = createFixture({
  id: "set14-audit-honey-researcher",
  name: "Hyperia audit: Honey Lemon Ingenious Researcher",
  skipPreGame: true,
  seed: "set14-audit-honey-researcher",
  description:
    "Shift Honey Lemon onto the dry damaged Honey Lemon for five ink. She keeps one damage and can quest immediately for two lore. Accept Synthesize and return your discarded Photo to hand; get one ink drop. The opposing Photo and your discarded character are not legal targets. Pay the ink drop to play Fru Fru, retaining two available ink. Pass both turns and quest again; return Jukebox and get another ink drop. Reload to decline the return and verify no drop. Inspect Shift, item return, payment and both public logs.",
  playerOne: {
    hand: [honeyLemonIngeniousResearcher, fruFruVipGuest],
    play: [{ card: honeyLemonTestingTheLimits, isDrying: false, damage: 1 }],
    inkwell: 7,
    discard: [riveraFamilyPhoto, jukebox, aladdinPrinceAli],
    deck,
  },
  playerTwo: { discard: [riveraFamilyPhoto], deck },
});

export const set14AuditBaymaxPhysicianFixture = createFixture({
  id: "set14-audit-baymax-physician",
  name: "Hyperia audit: Baymax Qualified Physician",
  skipPreGame: true,
  seed: "set14-audit-baymax-physician",
  description:
    "Quest with dry Baymax for one lore. Choose Carl and remove one of his three damage. Pass both turns and quest Baymax again; choose himself and remove two damage. Reload to choose zero healing or to heal the opposing Carl. Friendly Ward Aladdin is legal; opposing Ward Aladdin is excluded. Play the second Baymax for three ink: playing does not heal, and Fresh Ink blocks questing. Inspect damage badges, amount choices and both public logs.",
  playerOne: {
    hand: [baymaxQualifiedPhysician],
    play: [
      { card: baymaxQualifiedPhysician, isDrying: false, damage: 3 },
      { card: carlFredricksenWildernessGuide, isDrying: false, damage: 3 },
      { card: aladdinPrinceAli, isDrying: false, damage: 1 },
    ],
    inkwell: 3,
    deck,
  },
  playerTwo: {
    play: [
      { card: carlFredricksenWildernessGuide, isDrying: false, damage: 3 },
      { card: aladdinPrinceAli, isDrying: false, damage: 1 },
    ],
    deck,
  },
});

export const set14AuditBaymaxPhysicianPlayerTwoFixture = createFixture({
  id: "set14-audit-baymax-physician-player-two",
  name: "Hyperia audit: Baymax Physician Player Two healing boundaries",
  skipPreGame: true,
  seed: "set14-audit-baymax-physician-player-two",
  description:
    "Pass to Player Two. Quest separate Baymax copies: choose two damage on opposing Carl (three to one), own Fru Fru (one to zero) and undamaged own Mickey (stays zero). Each quest gains one lore before healing. Picker includes friendly Ward Aladdin but excludes opposing Ward, locations, hand and discard characters. Close and reopen a target dialog for a valid retry. Switch to the other view during a choice to verify it cannot resolve. Inspect both logs for actual removed amounts and no false heal at zero.",
  playerOne: {
    play: [
      { card: carlFredricksenWildernessGuide, damage: 3 },
      { card: aladdinPrinceAli, damage: 1 },
      landOfTheDeadMarigoldBridge,
    ],
    deck,
  },
  playerTwo: {
    hand: [baymaxQualifiedPhysician, fruFruVipGuest],
    discard: [carlFredricksenWildernessGuide],
    play: [
      { card: baymaxQualifiedPhysician, isDrying: false },
      { card: baymaxQualifiedPhysician, isDrying: false },
      { card: baymaxQualifiedPhysician, isDrying: false },
      { card: fruFruVipGuest, damage: 1 },
      mickeyMouseTrueFriend,
      { card: aladdinPrinceAli, damage: 1 },
    ],
    deck,
  },
});

export const set14AuditWasabiFutureFixture = createFixture({
  id: "set14-audit-wasabi-future",
  name: "Hyperia audit: Wasabi Future Thinker",
  skipPreGame: true,
  seed: "set14-audit-wasabi-future",
  description:
    "Play Wasabi using one ink drop and four ink. Fru Fru gains Ward and Resist +1; Wasabi does not. Use your Fire the Cannons on Fru Fru: two damage becomes one. Pass and inspect the opposing Fire the Cannons targets: Fru Fru is excluded by Ward. Opposing Stacey can still challenge her for one damage after Resist. Use Dragon Fire on unprotected Wasabi: Fru Fru keeps both keywords after he leaves play. Pass to your next turn: both granted keywords expire. Reload and play Wasabi without an ink drop to verify that no protection is granted.",
  playerOne: {
    hand: [wasabiFutureThinker, fireTheCannons],
    play: [{ card: fruFruVipGuest, exerted: true, isDrying: false }],
    inkwell: 5,
    inkDrops: 1,
    deck,
  },
  playerTwo: {
    hand: [fireTheCannons, dragonFire],
    play: [{ card: staceyPowerlineSuperfan, isDrying: false }],
    inkwell: 6,
    deck,
  },
});

export const set14AuditWasabiFuturePlayerTwoFixture = createFixture({
  id: "set14-audit-wasabi-future-player-two",
  name: "Hyperia audit: Wasabi Future Thinker Player Two copies",
  skipPreGame: true,
  seed: "set14-audit-wasabi-future-player-two",
  description:
    "Pass to Player Two. Use both saved drops for first Wasabi; Fru Fru gains Resist one and Ward, source does not. Play Stacey: no grant. Play Higitus Figitus to get three drops, then use all three for second Wasabi: Fru Fru Resist two, earlier Wasabi and Stacey Resist one; new source gets none. Play Mickey: no grant. Fire the Cannons on Fru Fru deals zero; on Stacey deals one. Return earlier Wasabi with Mother Knows Best; Fru Fru retains both grants. Pass both turns to expire all granted keywords. Inspect both logs and opposing Fru Fru, which stays unprotected.",
  playerOne: { play: [{ card: fruFruVipGuest, isDrying: false }], deck },
  playerTwo: {
    hand: [
      wasabiFutureThinker,
      wasabiFutureThinker,
      staceyPowerlineSuperfan,
      mickeyMouseTrueFriend,
      fireTheCannons,
      fireTheCannons,
      motherKnowsBest,
      higitusFigitus,
    ],
    play: [{ card: fruFruVipGuest, isDrying: false }],
    inkwell: 24,
    inkDrops: 2,
    deck,
  },
});

export const set14AuditCinderellaDressmakerFixture = createFixture({
  id: "set14-audit-cinderella-dressmaker",
  name: "Hyperia audit: Cinderella Homespun Dressmaker",
  skipPreGame: true,
  seed: "set14-audit-cinderella-dressmaker",
  description:
    "Play Cinderella for two ink and put the privately viewed Carl Fredricksen on the bottom. Play the second Cinderella and keep Magnificent, Marvelous! on top. Pass both turns to draw that song. Inspect both public logs: looking must not reveal either card to the opponent. Reload to test the opposite destinations. Your dry Carl can quest for three lore without an ability prompt.",
  playerOne: {
    hand: [cinderellaHomespunDressmaker, cinderellaHomespunDressmaker],
    play: [{ card: carlFredricksenWildernessGuide, isDrying: false }],
    inkwell: 4,
    deck: [...deck, magnificentMarvelous, carlFredricksenWildernessGuide],
  },
  playerTwo: { deck },
});

export const set14AuditDressmakerSinglePlayerTwoFixture = createFixture({
  id: "set14-audit-dressmaker-single-player-two",
  name: "Hyperia audit: Dressmaker Player Two single deck",
  skipPreGame: true,
  seed: "set14-audit-dressmaker-single-player-two",
  description:
    "Pass to Player Two and switch view. The turn draw leaves exactly Photo in deck. Play first Cinderella and put Photo on bottom; second puts the same Photo on top. Inspect both private look choices and both logs, then pass both turns to draw Photo. Close and reopen the mandatory choice to verify a safe retry without losing it.",
  playerOne: { deck },
  playerTwo: {
    hand: [cinderellaHomespunDressmaker, cinderellaHomespunDressmaker],
    inkwell: 4,
    deck: [riveraFamilyPhoto, fruFruVipGuest],
  },
});

export const set14AuditDressmakerEmptyPlayerTwoFixture = createFixture({
  id: "set14-audit-dressmaker-empty-player-two",
  name: "Hyperia audit: Dressmaker Player Two empty deck",
  skipPreGame: true,
  seed: "set14-audit-dressmaker-empty-player-two",
  description:
    "Pass to Player Two and switch view. Turn draw leaves empty deck. Play both Cinderellas; each ability must complete without a choice, reveal, draw or immediate defeat. Inspect both logs, then pass to confirm normal turn-end empty-deck loss.",
  playerOne: { deck },
  playerTwo: {
    hand: [cinderellaHomespunDressmaker, cinderellaHomespunDressmaker],
    inkwell: 4,
    deck: [fruFruVipGuest],
  },
});

export const set14AuditKhanStadiumFixture = createFixture({
  id: "set14-audit-khan-stadium",
  name: "Hyperia audit: Khan Stadium",
  skipPreGame: true,
  seed: "set14-audit-khan-stadium",
  description:
    "Play Stadium for one ink. Move Fru Fru to Stadium, to Bridge, then back: Strength changes from one to three to one to three, paying one each time. Stacey at Bridge stays at two. Challenge opposing exerted Fru Fru: three damage banishes her. Pass, then use opposing Ward Aladdin at his own Stadium to challenge and banish your Stadium. Your surviving Fru Fru immediately returns to one Strength. Inspect both public movement, combat and location lore logs.",
  playerOne: {
    hand: [khanStadiumStateOfTheArt],
    play: [
      landOfTheDeadMarigoldBridge,
      { card: fruFruVipGuest, isDrying: false },
      { card: staceyPowerlineSuperfan, isDrying: false, atLocation: landOfTheDeadMarigoldBridge },
    ],
    inkwell: 4,
    deck,
  },
  playerTwo: {
    play: [
      khanStadiumStateOfTheArt,
      { card: aladdinPrinceAli, isDrying: false, atLocation: khanStadiumStateOfTheArt },
      { card: fruFruVipGuest, exerted: true, isDrying: false },
    ],
    deck,
  },
});

export const set14AuditKhanStadiumPlayerTwoFixture = createFixture({
  id: "set14-audit-khan-stadium-player-two",
  name: "Hyperia audit: Khan Stadium Player Two copies",
  skipPreGame: true,
  seed: "set14-audit-khan-stadium-player-two",
  description:
    "Challenge Player Two's damaged Stadium with your dry Aladdin, then pass. Switch to Player Two: old Fru Fru loses the bonus while Stacey at Bridge stays at two. Play a replacement Stadium: Fru Fru stays at one until moved. Play new Fru Fru, then move the fresh copy between both owned Stadiums and Bridge: three, three, one Strength without readying or drying. Quest Stacey, then move the exerted Stacey to Stadium: Strength four while still exerted. Opposing Stadium must be excluded. Inspect both logs.",
  playerOne: {
    play: [khanStadiumStateOfTheArt, { card: aladdinPrinceAli, isDrying: false }],
    deck,
  },
  playerTwo: {
    hand: [khanStadiumStateOfTheArt, fruFruVipGuest],
    play: [
      { card: khanStadiumStateOfTheArt, damage: 2 },
      { card: fruFruVipGuest, isDrying: false, atLocation: khanStadiumStateOfTheArt },
      khanStadiumStateOfTheArt,
      landOfTheDeadMarigoldBridge,
      { card: staceyPowerlineSuperfan, isDrying: false, atLocation: landOfTheDeadMarigoldBridge },
    ],
    inkwell: 8,
    deck,
  },
});

export const set14AuditMarigoldBridgeFixture = createFixture({
  id: "set14-audit-marigold-bridge",
  name: "Hyperia audit: Land of the Dead Marigold Bridge",
  skipPreGame: true,
  seed: "set14-audit-marigold-bridge",
  description:
    "Your Bridge starts at one lore with nine discarded cards; the opposing Bridge has three lore with eleven discarded cards. Activate Photo's mill mode for one ink: your discard rises to eleven and your Bridge immediately shows three lore without gaining any lore yet. Pass both turns to gain three at your own turn start. Sing Remember Me together with dry Mulan and Aladdin; it raises discard to twelve. Play Fru Fru, Stacey and Aladdin from discard for one, three and two ink: discard falls to nine and Bridge lore returns to one. Pass both turns to gain only one more lore. Inspect both location badges and both public logs; empty locations still gain lore.",
  playerOne: {
    hand: [rememberMe],
    play: [
      landOfTheDeadMarigoldBridge,
      riveraFamilyPhoto,
      { card: mulanMartialArtsMaster, isDrying: false },
      { card: aladdinPrinceAli, isDrying: false },
    ],
    inkwell: 6,
    discard: [
      fruFruVipGuest,
      staceyPowerlineSuperfan,
      aladdinPrinceAli,
      motherKnowsBest,
      fanTheFlames,
      dragonFire,
      breakCard,
      healingGlow,
      befuddle,
    ],
    deck: [...deck, magnificentMarvelous, everyoneKnowsJuanita],
  },
  playerTwo: {
    play: [landOfTheDeadMarigoldBridge],
    discard: [
      motherKnowsBest,
      fanTheFlames,
      dragonFire,
      breakCard,
      healingGlow,
      befuddle,
      fireTheCannons,
      aladdinPrinceAli,
      fruFruVipGuest,
      staceyPowerlineSuperfan,
      magnificentMarvelous,
    ],
    deck,
  },
});

export const set14AuditMarigoldCopiesFixture = createFixture({
  id: "set14-audit-marigold-copies",
  name: "Hyperia audit: Marigold Bridge copies",
  skipPreGame: true,
  seed: "set14-audit-marigold-copies",
  description:
    "Pass to Player Two. Both damaged Bridges must independently grant three lore, winning at twenty. The opposing nine-card discard grants no bonus. Inspect the winning state and both public logs.",
  playerOne: {
    play: [landOfTheDeadMarigoldBridge, { card: fruFruVipGuest, isDrying: false }],
    discard: [
      motherKnowsBest,
      fanTheFlames,
      dragonFire,
      breakCard,
      healingGlow,
      befuddle,
      fireTheCannons,
      aladdinPrinceAli,
      fruFruVipGuest,
    ],
    deck,
  },
  playerTwo: {
    lore: 14,
    play: [
      { card: landOfTheDeadMarigoldBridge, damage: 7 },
      { card: landOfTheDeadMarigoldBridge, damage: 6 },
    ],
    discard: [
      motherKnowsBest,
      fanTheFlames,
      dragonFire,
      breakCard,
      healingGlow,
      befuddle,
      fireTheCannons,
      aladdinPrinceAli,
      fruFruVipGuest,
      riveraFamilyPhoto,
    ],
    deck,
  },
});

export const set14AuditMarigoldRemovedFixture = createFixture({
  id: "set14-audit-marigold-removed",
  name: "Hyperia audit: Marigold Bridge removed",
  skipPreGame: true,
  seed: "set14-audit-marigold-removed",
  description:
    "Challenge the seven-damage opposing Bridge with your dry Fru Fru, then pass. Only the surviving six-damage Bridge grants three lore and wins at twenty; the banished Bridge grants none. Inspect both public logs.",
  playerOne: {
    play: [landOfTheDeadMarigoldBridge, { card: fruFruVipGuest, isDrying: false }],
    discard: [
      motherKnowsBest,
      fanTheFlames,
      dragonFire,
      breakCard,
      healingGlow,
      befuddle,
      fireTheCannons,
      aladdinPrinceAli,
      fruFruVipGuest,
    ],
    deck,
  },
  playerTwo: {
    lore: 17,
    play: [
      { card: landOfTheDeadMarigoldBridge, damage: 7 },
      { card: landOfTheDeadMarigoldBridge, damage: 6 },
    ],
    discard: [
      motherKnowsBest,
      fanTheFlames,
      dragonFire,
      breakCard,
      healingGlow,
      befuddle,
      fireTheCannons,
      aladdinPrinceAli,
      fruFruVipGuest,
      riveraFamilyPhoto,
    ],
    deck,
  },
});

export const set14AuditCinderellaPlayerTwoFixture = createFixture({
  id: "set14-audit-cinderella-player-two",
  name: "Hyperia audit: Cinderella Player Two Shift and choices",
  skipPreGame: true,
  seed: "cinderella-player-two",
  description:
    "Pass to Player Two. Shift each hand Icon onto a separate own damaged Homespun for five ink each. Opposing Cinderella and wrong-name Fru Fru are excluded. Quest each dry shifted copy for three lore, then pass. Decline the first Bespoke Design and accept the second; keep Photo on bottom and put noninkable Jukebox into facedown exerted ink. Inspect both logs and hidden opponent/spectator views. Reload to accept both copies and confirm the second looks at the newly arranged top cards.",
  playerOne: { play: [cinderellaHomespunDressmaker, fruFruVipGuest], inkwell: 1, deck },
  playerTwo: {
    play: [
      { card: cinderellaHomespunDressmaker, isDrying: false, damage: 1 },
      { card: cinderellaHomespunDressmaker, isDrying: false, damage: 2 },
      fruFruVipGuest,
    ],
    hand: [cinderellaUnintentionalIcon, cinderellaUnintentionalIcon],
    inkwell: 10,
    deck: [...deck, jukebox, riveraFamilyPhoto, fruFruVipGuest],
  },
});
export const set14AuditCinderellaShiftStatesFixture = createFixture({
  id: "set14-audit-cinderella-shift-states",
  name: "Hyperia audit: Cinderella inherited Shift states",
  skipPreGame: true,
  seed: "cinderella-shift-states",
  description:
    "Shift each Icon for five ink onto the exerted damaged Homespun and the drying damaged Homespun. Both retain one damage; quest remains blocked by the inherited states. Opposing and wrong-name characters are excluded. Inspect both public Shift logs.",
  playerOne: {
    play: [
      { card: cinderellaHomespunDressmaker, isDrying: false, exerted: true, damage: 1 },
      { card: cinderellaHomespunDressmaker, isDrying: true, damage: 1 },
      fruFruVipGuest,
    ],
    hand: [cinderellaUnintentionalIcon, cinderellaUnintentionalIcon],
    inkwell: 10,
    deck,
  },
  playerTwo: { play: [cinderellaHomespunDressmaker], deck },
});
export const set14AuditCinderellaShiftPaymentFixture = createFixture({
  id: "set14-audit-cinderella-shift-payment",
  name: "Hyperia audit: Cinderella Shift payment boundary",
  skipPreGame: true,
  seed: "cinderella-shift-payment",
  description:
    "Four ink blocks Shift. Ink one Icon to reach five and Shift the other onto drying exerted damaged Homespun. All inherited states remain, quest stays unavailable, and both logs show the five-ink Shift with exact base.",
  playerOne: {
    play: [{ card: cinderellaHomespunDressmaker, isDrying: true, exerted: true, damage: 1 }],
    hand: [cinderellaUnintentionalIcon, cinderellaUnintentionalIcon],
    inkwell: 4,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditCinderellaShortFixture = createFixture({
  id: "set14-audit-cinderella-short",
  name: "Hyperia audit: Cinderella short deck",
  skipPreGame: true,
  seed: "set14-audit-cinderella-short",
  description:
    "Pass to accept Bespoke Design with one deck card. Keep Photo on top or bottom. No card can enter ink. Check the opponent log hides its identity.",
  playerOne: {
    play: [{ card: cinderellaUnintentionalIcon, isDrying: false }],
    inkwell: 2,
    deck: [riveraFamilyPhoto],
  },
  playerTwo: { deck },
});

export const set14AuditCinderellaPairFixture = createFixture({
  id: "set14-audit-cinderella-pair",
  name: "Hyperia audit: Cinderella two-card split",
  skipPreGame: true,
  seed: "set14-audit-cinderella-pair",
  description:
    "Pass and accept Bespoke Design. Put Photo on deck top or bottom and Jukebox into facedown exerted ink. Ready ink stays two; total ink increases to three. Check private opponent logs.",
  playerOne: {
    play: [{ card: cinderellaUnintentionalIcon, isDrying: false }],
    inkwell: 2,
    deck: [...deck, jukebox, riveraFamilyPhoto],
  },
  playerTwo: { deck },
});

export const set14AuditBellwetherFixture = createFixture({
  id: "set14-audit-bellwether",
  name: "Hyperia audit: Bellwether Highly Qualified",
  skipPreGame: true,
  seed: "set14-audit-bellwether",
  description:
    "Play Bellwether for four ink. Clever Plan can select opposing Fru Fru or Duchess; friendly Fru Fru, opposing Ariel and Jukebox are excluded. Accept to place one opponent character facedown and exerted in their ink, with no ready-ink gain. Reload to decline. Inspect both public logs.",
  playerOne: { hand: [bellwetherHighlyQualified], play: [fruFruVipGuest], inkwell: 4, deck },
  playerTwo: {
    play: [fruFruVipGuest, duchessCosmopolitanCat, arielCollectorOfOddities, jukebox],
    inkwell: 2,
    deck,
  },
});

export const set14AuditBellwetherPlayerTwoFixture = createFixture({
  id: "set14-audit-bellwether-player-two",
  name: "Hyperia audit: Bellwether Player Two duplicate targets",
  skipPreGame: true,
  seed: "bellwether-player-two",
  description:
    "Pass to Player Two and play three Bellwethers. First accept Clever Plan and choose one exact opposing Fru Fru duplicate. Opposing Ward Aladdin, cost-three Baymax, Jukebox and friendly Fru Fru are excluded. Second decline: the remaining duplicate stays in play and opposing ink stays two ready of three. Third accept the final duplicate: opposing ink becomes two ready of four, with no extra trigger from earlier Bellwethers. Opponent cannot choose. Inspect both logs for exact target, exertion and independent choices.",
  playerOne: {
    play: [fruFruVipGuest, fruFruVipGuest, aladdinPrinceAli, baymaxQualifiedPhysician, jukebox],
    inkwell: 2,
    deck,
  },
  playerTwo: {
    play: [fruFruVipGuest],
    hand: [bellwetherHighlyQualified, bellwetherHighlyQualified, bellwetherHighlyQualified],
    inkwell: 12,
    deck,
  },
});
export const set14AuditBellwetherNoTargetFixture = createFixture({
  id: "set14-audit-bellwether-no-target",
  name: "Hyperia audit: Bellwether no legal target",
  skipPreGame: true,
  seed: "bellwether-no-target",
  description:
    "Play Bellwether with only opposing cost-two Ward Aladdin, cost-three Baymax and Jukebox. Clever Plan completes without a target or stuck choice; opposing board and two ready ink remain unchanged. Inspect both logs for no fabricated ink outcome.",
  playerOne: { play: [fruFruVipGuest], hand: [bellwetherHighlyQualified], inkwell: 4, deck },
  playerTwo: { play: [aladdinPrinceAli, baymaxQualifiedPhysician, jukebox], inkwell: 2, deck },
});

export const set14AuditClarabelleFixture = createFixture({
  id: "set14-audit-clarabelle",
  name: "Hyperia audit: Clarabelle Out for a Stroll",
  skipPreGame: true,
  seed: "set14-audit-clarabelle",
  description:
    "Play Clarabelle for six ink. Banish opposing Jukebox to ink its player's top Photo facedown and exerted. Reload to banish your own Photo and ink your own top Carl, or decline. Check item discard, unchanged ready ink, private top-card identities and both logs.",
  playerOne: {
    hand: [clarabelleOutForAStroll],
    play: [riveraFamilyPhoto],
    inkwell: 6,
    deck: [...deck, carlFredricksenWildernessGuide],
  },
  playerTwo: { play: [jukebox], inkwell: 2, deck: [...deck, riveraFamilyPhoto] },
});

export const set14AuditDougFixture = createFixture({
  id: "set14-audit-doug",
  name: "Hyperia audit: Doug Lying in Wait",
  skipPreGame: true,
  seed: "set14-audit-doug",
  description:
    "Dragon Fire must exclude opposing Doug with Ward while allowing opposing Carl and your own Doug. Your dry Carl can challenge exerted Doug despite Ward. Reload for target and challenge branches; inspect Ward text, damage and public logs.",
  playerOne: {
    hand: [dragonFire],
    play: [
      { card: dougLyingInWait, isDrying: false },
      { card: carlFredricksenWildernessGuide, isDrying: false },
    ],
    inkwell: 5,
    deck,
  },
  playerTwo: {
    play: [
      { card: dougLyingInWait, isDrying: false, exerted: true },
      { card: carlFredricksenWildernessGuide, isDrying: false },
    ],
    deck,
  },
});

export const set14AuditDougPlayerTwoFixture = createFixture({
  id: "set14-audit-doug-player-two",
  name: "Hyperia audit: Doug player-two Ward boundaries",
  skipPreGame: true,
  seed: "doug-player-two-ward",
  description:
    "Pass to Player Two. Dragon Fire excludes opposing Doug while permitting own Doug and both Carls; banish own Doug. Grab Your Sword deals two damage to both opposing Dougs and Carl without a target choice. Both opposing Dougs retain Ward. Inspect both logs and unchanged friendly Carl.",
  playerOne: {
    play: [dougLyingInWait, dougLyingInWait, carlFredricksenWildernessGuide],
    deck,
  },
  playerTwo: {
    hand: [dragonFire, grabYourSword],
    play: [dougLyingInWait, carlFredricksenWildernessGuide],
    inkwell: 10,
    deck,
  },
});

export const set14AuditDarkAgeFixture = createFixture({
  id: "set14-audit-dark-age",
  name: "Hyperia audit: A Dark Age No More",
  skipPreGame: true,
  seed: "set14-audit-dark-age",
  description:
    "Play A Dark Age No More for three ink. Top Photo enters facedown exerted ink; available ink remains zero and total becomes four. Gain one ink drop and spend it to play Fru Fru for one. Inspect the ink owner and opponent logs for private Photo identity and public drop gain and payment.",
  playerOne: {
    hand: [aDarkAgeNoMore, fruFruVipGuest],
    inkwell: 3,
    deck: [...deck, riveraFamilyPhoto],
  },
  playerTwo: { deck },
});

export const set14AuditDarkAgePlayerTwoFixture = createFixture({
  id: "set14-audit-dark-age-player-two",
  name: "Hyperia audit: A Dark Age No More player two",
  skipPreGame: true,
  seed: "dark-age-player-two",
  description:
    "Pass to Player Two, drawing Jukebox. Play A Dark Age No More: unseen top Photo enters own facedown exerted ink, zero ready of four total, and only Player Two gains one drop. Logs must hide Photo from both viewers. Spend the drop on Fru Fru. Opposing ink and deck stay unchanged.",
  playerOne: { inkwell: 2, deck },
  playerTwo: {
    hand: [aDarkAgeNoMore, fruFruVipGuest],
    inkwell: 3,
    deck: [...deck, riveraFamilyPhoto, jukebox],
  },
});

export const set14AuditDarkAgeEmptyFixture = createFixture({
  id: "set14-audit-dark-age-empty",
  name: "Hyperia audit: A Dark Age No More empty deck",
  skipPreGame: true,
  seed: "dark-age-empty",
  description:
    "Play A Dark Age No More with an empty deck. No ink card is created; zero ready of three total remains. Gain one drop and spend it on Fru Fru. No stuck choice or immediate loss; both logs show drop outcomes without fabricated ink.",
  playerOne: { hand: [aDarkAgeNoMore, fruFruVipGuest], inkwell: 3, deck: [] },
  playerTwo: { inkwell: 2, deck },
});

export const set14AuditObsoleteFixture = createFixture({
  id: "set14-audit-obsolete",
  name: "Hyperia audit: Everything Else Is Obsolete",
  skipPreGame: true,
  seed: "set14-audit-obsolete",
  description:
    "Pay three ink or sing with dry Carl. Assign Photo, Jukebox and Duchess: one facedown exerted ink, one deck top and one deck bottom. The other deck cards stay untouched. Check the opponent log masks all private card names.",
  playerOne: {
    hand: [everythingElseIsObsolete],
    play: [{ card: carlFredricksenWildernessGuide, isDrying: false }],
    inkwell: 3,
    deck: [...deck, duchessCosmopolitanCat, jukebox, riveraFamilyPhoto],
  },
  playerTwo: { deck },
});

export const set14AuditObsoleteShortFixture = createFixture({
  id: "set14-audit-obsolete-short",
  name: "Hyperia audit: Obsolete one-card deck",
  skipPreGame: true,
  seed: "set14-audit-obsolete-short",
  description:
    "Play or sing Obsolete with one deck card. Photo must enter facedown exerted ink. Deck top and bottom have zero capacity. Check private identity and public ink placement logs.",
  playerOne: {
    hand: [everythingElseIsObsolete],
    play: [{ card: carlFredricksenWildernessGuide, isDrying: false }],
    inkwell: 3,
    deck: [riveraFamilyPhoto],
  },
  playerTwo: { deck },
});

export const set14AuditObsoletePairFixture = createFixture({
  id: "set14-audit-obsolete-pair",
  name: "Hyperia audit: Obsolete two-card deck",
  skipPreGame: true,
  seed: "set14-audit-obsolete-pair",
  description:
    "Play Obsolete with Photo and Jukebox in the deck. One must enter facedown exerted ink and one must stay on top. Deck bottom has zero capacity. Check opponent privacy and unchanged ready ink after the effect.",
  playerOne: {
    hand: [everythingElseIsObsolete],
    inkwell: 3,
    deck: [jukebox, riveraFamilyPhoto],
  },
  playerTwo: { deck },
});

export const set14AuditResearchFixture = createFixture({
  id: "set14-audit-research",
  name: "Hyperia audit: Intense Research",
  skipPreGame: true,
  seed: "set14-audit-research",
  description:
    "Pay two ink without selecting a drop: look only at Jukebox and Photo, take exactly one and bottom the other. Reload and select one ink drop before playing: look at five, take one and order four on the bottom. Holding an unused drop must not upgrade the look. Inspect both logs for private card names.",
  playerOne: {
    hand: [intenseResearch],
    inkwell: 2,
    inkDrops: 1,
    deck: [
      ...deck,
      carlFredricksenWildernessGuide,
      arielCollectorOfOddities,
      duchessCosmopolitanCat,
      jukebox,
      riveraFamilyPhoto,
    ],
  },
  playerTwo: { deck },
});

export const set14AuditScramPlayerTwoFixture = createFixture({
  id: "set14-audit-scram-player-two",
  name: "Hyperia audit: Scram player-two boundaries",
  skipPreGame: true,
  seed: "scram-player-two-boundaries",
  description:
    "Pass to Player Two. Scram offers only two opposing cost-two Priya copies, excluding opposing Ward Aladdin, cost-three Baymax, Jukebox and own Priya. Select the second copy, then the remaining copy. Opposing ready ink stays two while total grows to four. Play the third Scram with no legal target: pay one, no new ink or stuck choice. Inspect both logs.",
  playerOne: {
    play: [
      priyaMangalImmovableFan,
      priyaMangalImmovableFan,
      aladdinPrinceAli,
      baymaxQualifiedPhysician,
      jukebox,
    ],
    inkwell: 2,
    deck,
  },
  playerTwo: { hand: [scram, scram, scram], play: [priyaMangalImmovableFan], inkwell: 3, deck },
});

export const set14AuditScramFixture = createFixture({
  id: "set14-audit-scram",
  name: "Hyperia audit: Scram!",
  skipPreGame: true,
  seed: "set14-audit-scram",
  description:
    "Play Scram for one ink. Only opposing Fru Fru or Duchess can be chosen; friendly Fru Fru, Ariel and Jukebox are excluded. The chosen character enters the opponent's ink facedown and exerted. Their ready ink stays two and total becomes three. Check both public logs.",
  playerOne: { hand: [scram], play: [fruFruVipGuest], inkwell: 1, deck },
  playerTwo: {
    play: [fruFruVipGuest, duchessCosmopolitanCat, arielCollectorOfOddities, jukebox],
    inkwell: 2,
    deck,
  },
});

export const set14AuditChemBallPlayerTwoFixture = createFixture({
  id: "set14-audit-chem-ball-player-two",
  name: "Hyperia audit: Blinding Chem Ball player two",
  skipPreGame: true,
  seed: "chem-ball-player-two",
  description:
    "Pass to Player Two. Activate one Chem Ball for two ink. Accept Brilliant Burst, choose the second opposing Carl and gain one drop. Opposing Ward Doug is excluded, friendly Ward Doug is legal. Break the remaining own Chem Ball for two ink, accept its separate Burst on own Doug and gain a second drop. Spend one drop on Fru Fru; pass to expire both penalties while retaining the other drop. Only Player Two can choose. Inspect both logs.",
  playerOne: {
    play: [dougLyingInWait, carlFredricksenWildernessGuide, carlFredricksenWildernessGuide],
    deck,
  },
  playerTwo: {
    play: [blindingChemBall, blindingChemBall, dougLyingInWait],
    hand: [breakCard, fruFruVipGuest],
    inkwell: 4,
    deck,
  },
});

export const set14AuditChemBallOpposingTurnFixture = createFixture({
  id: "set14-audit-chem-ball-opposing-turn",
  name: "Hyperia audit: Chem Ball opposing-turn banishment",
  skipPreGame: true,
  seed: "chem-ball-opposing-turn",
  description:
    "Player One uses Break to banish Player Two's Chem Ball. Because it is not the owner's turn, no Brilliant Burst, ink drop or strength penalty occurs. Inspect both logs and both views for no choice.",
  playerOne: { hand: [breakCard], inkwell: 2, deck },
  playerTwo: { play: [blindingChemBall, carlFredricksenWildernessGuide], deck },
});

export const set14AuditChemBallNoCharactersFixture = createFixture({
  id: "set14-audit-chem-ball-no-characters",
  name: "Hyperia audit: Chem Ball no characters",
  skipPreGame: true,
  seed: "chem-ball-no-characters",
  description:
    "Activate Destabilize for two ink with no characters in play. Accept Brilliant Burst: gain one drop and complete without a character choice or false strength result. Spend the drop on Fru Fru. Inspect both logs.",
  playerOne: { play: [blindingChemBall], hand: [fruFruVipGuest], inkwell: 2, deck },
  playerTwo: { deck },
});

export const set14AuditChemBallFixture = createFixture({
  id: "set14-audit-chem-ball",
  name: "Hyperia audit: Blinding Chem Ball",
  skipPreGame: true,
  seed: "set14-audit-chem-ball",
  description:
    "Activate Destabilize for two ink and banish the item. Accept Brilliant Burst to gain one drop and give a chosen character minus two strength this turn. Opposing Doug with Ward is excluded; friendly Doug and opposing Carl are legal. Reload to decline. Pass to verify penalty expiration and persistent drop. Inspect ability names and both public logs.",
  playerOne: {
    play: [blindingChemBall, { card: dougLyingInWait, isDrying: false }],
    inkwell: 3,
    deck,
  },
  playerTwo: {
    play: [
      { card: dougLyingInWait, isDrying: false },
      { card: carlFredricksenWildernessGuide, isDrying: false },
    ],
    deck,
  },
});

export const set14AuditPrototypePlayerTwoFixture = createFixture({
  id: "set14-audit-prototype-player-two",
  name: "Hyperia audit: Prototype player-two boundaries",
  skipPreGame: true,
  seed: "prototype-player-two-boundaries",
  description:
    "Pass to Player Two. Self-banish first Prototype and accept Enigma Burst on one exact own Carl. Break a second Prototype for two ink and accept on the same Carl to stack Resist two. Self-banish third and decline. Only own two Carls and Ward Doug are targetable; opponent cannot choose. Spend one of two drops on Fru Fru, quest the resistant Carl and pass. Opposing Doug challenges for one damage; Resist expires at next Player Two start while other drop remains. Inspect both logs.",
  playerOne: { play: [dougLyingInWait, carlFredricksenWildernessGuide], deck },
  playerTwo: {
    play: [
      prototypeChemBall,
      prototypeChemBall,
      prototypeChemBall,
      carlFredricksenWildernessGuide,
      carlFredricksenWildernessGuide,
      dougLyingInWait,
    ],
    hand: [breakCard, fruFruVipGuest],
    inkwell: 6,
    deck,
  },
});

export const set14AuditPrototypeOpposingTurnFixture = createFixture({
  id: "set14-audit-prototype-opposing-turn",
  name: "Hyperia audit: Prototype opposing-turn banishment",
  skipPreGame: true,
  seed: "prototype-opposing-turn",
  description:
    "Player One Break banishes Player Two's Prototype during the opposing turn. No Enigma Burst, drop or Resist; no pending choice. Check both logs.",
  playerOne: { hand: [breakCard], inkwell: 2, deck },
  playerTwo: { play: [prototypeChemBall, carlFredricksenWildernessGuide], deck },
});

export const set14AuditPrototypeNoFriendlyFixture = createFixture({
  id: "set14-audit-prototype-no-friendly",
  name: "Hyperia audit: Prototype no friendly character",
  skipPreGame: true,
  seed: "prototype-no-friendly",
  description:
    "Self-banish Prototype for two ink with only an opposing Carl in play. Accept Enigma Burst, gain one drop, complete without a target and do not grant opposing Resist. Spend the drop on Fru Fru. Both logs show completed drop gain with no false Resist or cancellation.",
  playerOne: { play: [prototypeChemBall], hand: [fruFruVipGuest], inkwell: 2, deck },
  playerTwo: { play: [carlFredricksenWildernessGuide], deck },
});

export const set14AuditPrototypeFixture = createFixture({
  id: "set14-audit-prototype",
  name: "Hyperia audit: Prototype Chem Ball",
  skipPreGame: true,
  seed: "set14-audit-prototype",
  description:
    "Activate Destabilize for two ink. Accept Enigma Burst to gain one drop and grant friendly Carl Resist +1; opposing characters are excluded. Pass and challenge exerted Carl with opposing Doug to verify reduced damage. Pass back to verify Resist expires at the start of your next turn. Reload to decline; inspect prompts and logs.",
  playerOne: {
    play: [
      prototypeChemBall,
      { card: carlFredricksenWildernessGuide, isDrying: false, exerted: true },
    ],
    inkwell: 3,
    deck,
  },
  playerTwo: { play: [{ card: dougLyingInWait, isDrying: false }], deck },
});

export const set14AuditSpyglassFixture = createFixture({
  id: "set14-audit-spyglass",
  name: "Hyperia audit: Spyglass Hat",
  skipPreGame: true,
  seed: "set14-audit-spyglass",
  description:
    "Play Hat for three ink and accept Hat Couture to ink noninkable A Dark Age No More facedown and exerted. Reload to decline, or play Jukebox first then Hat to test another name. Check the hand choice and private ink identity in both logs.",
  playerOne: { hand: [spyglassHat, aDarkAgeNoMore, jukebox], inkwell: 5, deck },
  playerTwo: { hand: [spyglassHat, aDarkAgeNoMore, jukebox], inkwell: 5, deck },
});

export const set14AuditSpyglassEmptyFixture = createFixture({
  id: "set14-audit-spyglass-empty",
  name: "Hyperia audit: Spyglass empty hand",
  skipPreGame: true,
  seed: "set14-audit-spyglass-empty",
  description:
    "Play the only hand card, Spyglass Hat. No hand target should remain; ink stays at three and turn passing must work.",
  playerOne: { hand: [spyglassHat], inkwell: 3, deck },
  playerTwo: { deck },
});

export const set14AuditSpyglassPairFixture = createFixture({
  id: "set14-audit-spyglass-pair",
  name: "Hyperia audit: two Spyglass Hats",
  skipPreGame: true,
  seed: "set14-audit-spyglass-pair",
  description:
    "Play Jukebox with two Hats in play. Each Hat offers its own optional hand ink. Accept both to ink two separate cards exerted; total ink increases from two to four with no ready ink.",
  playerOne: {
    play: [spyglassHat, spyglassHat],
    hand: [jukebox, aDarkAgeNoMore, intenseResearch],
    inkwell: 2,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditChemPurseFixture = createFixture({
  id: "set14-audit-chem-purse",
  name: "Hyperia audit: Upgraded Chem Purse",
  skipPreGame: true,
  seed: "set14-audit-chem-purse",
  description:
    "Activate for one ink and banish another own item as cost. Reveal an item from the top four into hand or decline; order the remainder at the bottom. Check public cost logs, revealed hand identity and private remainder in both views.",
  playerOne: {
    play: [upgradedChemPurse, jukebox, spyglassHat],
    inkwell: 2,
    deck: [...deck, duchessCosmopolitanCat, arielCollectorOfOddities, jukebox, riveraFamilyPhoto],
  },
  playerTwo: { play: [riveraFamilyPhoto], deck },
});

export const set14AuditLabFixture = createFixture({
  id: "set14-audit-lab",
  name: "Hyperia audit: Honey Lemon's Lab",
  skipPreGame: true,
  seed: "set14-audit-lab",
  description:
    "Quest Fru Fru at the Lab first: no return. Quest a Super here and return one own discarded item; opponent and nonitem discards are illegal. Second Super quest must not return another item this turn. Pass both turns and repeat to check reset, location lore and public return logs.",
  playerOne: {
    play: [
      instituteOfTechnologyHoneyLemonsLab,
      { card: fruFruVipGuest, isDrying: false, atLocation: instituteOfTechnologyHoneyLemonsLab },
      {
        card: honeyLemonEndlesslyCurious,
        isDrying: false,
        atLocation: instituteOfTechnologyHoneyLemonsLab,
      },
      {
        card: honeyLemonTestingTheLimits,
        isDrying: false,
        atLocation: instituteOfTechnologyHoneyLemonsLab,
      },
    ],
    discard: [jukebox, riveraFamilyPhoto, arielCollectorOfOddities],
    deck,
  },
  playerTwo: { discard: [spyglassHat], deck },
});

export const set14AuditFlashFixture = createFixture({
  id: "set14-audit-flash",
  name: "Hyperia audit: Flash",
  skipPreGame: true,
  seed: "set14-audit-flash",
  description:
    "Rocket's Rush grant to drying Fru Fru is blocked by Flash and stays blocked after bouncing Flash. Activate Rocket after Flash leaves to grant Rush normally. Reload to play Maui, then remove Flash to restore printed Rush; Fire the Cannons verifies Resist damage.",
  playerOne: {
    play: [flashEfficientClerk, { card: fruFruVipGuest, isDrying: true }],
    hand: [mushusRocket, motherKnowsBest, mauiHeroToAll, fireTheCannons],
    inkwell: 12,
    deck,
  },
  playerTwo: { play: [{ card: captainHookConcernedCaptain, exerted: true }], deck },
});

export const set14AuditArthurFixture = createFixture({
  id: "set14-audit-arthur",
  name: "Hyperia audit: Arthur",
  skipPreGame: true,
  seed: "set14-audit-arthur",
  description:
    "Play Arthur for three, accept Magical Travel to own Belle's House for free and earn one drop. Opposing duplicate House is excluded. Move to Maui's Place for one: no second drop. Pass both turns and move back to verify reset. Reload to decline entry and then pay normal move cost.",
  playerOne: {
    hand: [arthurMerlinsAssistant],
    play: [bellesHouseMauricesWorkshop, mauisPlaceOfExileHiddenIsland],
    inkwell: 5,
    deck,
  },
  playerTwo: { play: [bellesHouseMauricesWorkshop], deck },
});

export const set14AuditEdgarFixture = createFixture({
  id: "set14-audit-edgar",
  name: "Hyperia audit: Edgar Balthazar",
  skipPreGame: true,
  seed: "set14-audit-edgar",
  description:
    "Fire the Cannons deals zero to undamaged Edgar. Smash deals one and removes conditional Resist. Healing Glow removes the remaining damage and restores Resist +2. Check damaged opposing Edgar and both public logs.",
  playerOne: {
    play: [{ card: edgarBalthazarLongsufferingButler, isDrying: false }],
    hand: [fireTheCannons, smash, healingGlow, fireTheCannons, healingGlow],
    inkwell: 8,
    deck,
  },
  playerTwo: {
    play: [{ card: edgarBalthazarLongsufferingButler, damage: 3, exerted: true }],
    deck,
  },
});

export const set14AuditKitCourierFixture = createFixture({
  id: "set14-audit-kit-courier",
  name: "Hyperia audit: Kit Cloudkicker Courier",
  skipPreGame: true,
  seed: "set14-audit-kit-courier",
  description:
    "Play Kit for one ink, check drying, quest for one lore next turn, ink another copy, and challenge the exerted opposing Kit for two simultaneous damage each.",
  playerOne: {
    hand: [kitCloudkickerUnpredictableCourier, kitCloudkickerUnpredictableCourier],
    inkwell: 1,
    deck,
  },
  playerTwo: {
    play: [{ card: kitCloudkickerUnpredictableCourier, exerted: true }],
    deck,
  },
});

export const set14AuditTickTockFixture = createFixture({
  id: "set14-audit-tick-tock",
  name: "Hyperia audit: Tick-Tock",
  skipPreGame: true,
  seed: "set14-audit-tick-tock",
  description:
    "Play Tick-Tock for eight ink, verify drying, quest for three lore, ink another copy, and challenge an opposing Tick-Tock for nine damage each.",
  playerOne: {
    hand: [ticktockCanalCroc, ticktockCanalCroc],
    inkwell: 8,
    deck,
  },
  playerTwo: {
    play: [{ card: ticktockCanalCroc, exerted: true }],
    deck,
  },
});

export const set14AuditTianaFixture = createFixture({
  id: "set14-audit-tiana",
  name: "Hyperia audit: Tiana Restauranteur",
  skipPreGame: true,
  seed: "set14-audit-tiana",
  description:
    "Play Tiana and accept Handpicked. Keep the private drawn Kit by discarding the existing Tick-Tock. Decline the second Tiana and check both players' logs.",
  playerOne: {
    hand: [tianaRestauranteur, tianaRestauranteur, ticktockCanalCroc],
    inkwell: 4,
    deck: [ticktockCanalCroc, kitCloudkickerUnpredictableCourier],
  },
  playerTwo: {
    hand: [tianaRestauranteur],
    inkwell: 2,
    deck: [ticktockCanalCroc, kitCloudkickerUnpredictableCourier, ticktockCanalCroc],
  },
});

export const set14AuditTianaEmptyFixture = createFixture({
  id: "set14-audit-tiana-empty",
  name: "Hyperia audit: Tiana empty deck",
  skipPreGame: true,
  seed: "set14-audit-tiana-empty",
  description:
    "Accept Handpicked with an empty deck and discard the existing Tick-Tock. No card is drawn. Finish the choice and pass to verify the empty-deck turn boundary.",
  playerOne: {
    hand: [tianaRestauranteur, ticktockCanalCroc],
    inkwell: 2,
    deck: [],
  },
  playerTwo: { deck },
});

export const set14AuditRayaFixture = createFixture({
  id: "set14-audit-raya",
  name: "Hyperia audit: Raya Determined Explorer",
  skipPreGame: true,
  seed: "set14-audit-raya",
  description:
    "Raya starts with two lore for one friendly location. Play another location to reach three, banish it with Rise of the Titans to return to two, then quest. Opposing locations do not count.",
  playerOne: {
    play: [{ card: rayaDeterminedExplorer, isDrying: false }, bellesHouseMauricesWorkshop],
    hand: [mauisPlaceOfExileHiddenIsland, riseOfTheTitans, rayaDeterminedExplorer],
    inkwell: 8,
    deck,
  },
  playerTwo: {
    play: [
      { card: rayaDeterminedExplorer, isDrying: false },
      bellesHouseMauricesWorkshop,
      bellesHouseMauricesWorkshop,
    ],
    deck,
  },
});

export const set14AuditWoolterPlayerTwoFixture = createFixture({
  id: "set14-audit-woolter-player-two",
  name: "Hyperia audit: Woolter player-two multiple Bodyguards",
  skipPreGame: true,
  seed: "woolter-player-two-bodyguards",
  description:
    "Pass to Player Two. One Woolter challenges exerted Tiana for six outgoing and one incoming damage, then returns to strength four. Quest the other Woolter and Kit so both Bodyguards protect an otherwise legal exerted ally. Pass. Player One Tick-Tocks can select either guard but cannot challenge Kit. Challenge each exact guard: guards deal base four, Tick-Tocks deal nine and banish them. After both guards leave, Fru Fru can challenge Kit. Inspect both logs.",
  playerOne: {
    play: [
      { card: tianaRestauranteur, exerted: true },
      ticktockCanalCroc,
      ticktockCanalCroc,
      fruFruVipGuest,
    ],
    deck,
  },
  playerTwo: {
    play: [
      woolterJesseBellwethersHenchmen,
      woolterJesseBellwethersHenchmen,
      kitCloudkickerUnpredictableCourier,
    ],
    deck,
  },
});

export const set14AuditWoolterFixture = createFixture({
  id: "set14-audit-woolter",
  name: "Hyperia audit: Woolter & Jesse",
  skipPreGame: true,
  seed: "set14-audit-woolter",
  description: "Bodyguard ready or exerted entry, drying and Challenger damage.",
  playerOne: {
    hand: [woolterJesseBellwethersHenchmen, woolterJesseBellwethersHenchmen],
    play: [
      { card: kitCloudkickerUnpredictableCourier, exerted: true, isDrying: false },
      { card: woolterJesseBellwethersHenchmen, isDrying: false },
    ],
    inkwell: 6,
    deck,
  },
  playerTwo: {
    play: [
      { card: ticktockCanalCroc, isDrying: false },
      { card: tianaRestauranteur, exerted: true, isDrying: false },
    ],
    deck,
  },
});

export const set14AuditNapoleonFixture = createFixture({
  id: "set14-audit-napoleon",
  name: "Hyperia audit: Napoleon",
  skipPreGame: true,
  seed: "set14-audit-napoleon",
  description: "Alert challenges Evasive but provides no defensive Evasive protection.",
  playerOne: {
    play: [
      { card: napoleonPatientWatchdog, isDrying: false },
      { card: kitCloudkickerUnpredictableCourier, isDrying: false },
    ],
    hand: [napoleonPatientWatchdog, napoleonPatientWatchdog],
    inkwell: 3,
    deck,
  },
  playerTwo: {
    play: [
      { card: peterPanNeverLanding, exerted: true, isDrying: false },
      { card: kitCloudkickerUnpredictableCourier, isDrying: false },
    ],
    deck,
  },
});

export const set14AuditWildcatFixture = createFixture({
  id: "set14-audit-wildcat",
  name: "Hyperia audit: Wildcat",
  skipPreGame: true,
  seed: "set14-audit-wildcat",
  description: "Optional entry banishes chosen friendly or opposing item.",
  playerOne: {
    hand: [
      wildcatUnconventionalMechanic,
      wildcatUnconventionalMechanic,
      wildcatUnconventionalMechanic,
    ],
    play: [spyglassHat],
    inkwell: 9,
    deck,
  },
  playerTwo: { play: [jukebox], hand: [wildcatUnconventionalMechanic], inkwell: 3, deck },
});

export const set14AuditWildcatEmptyFixture = createFixture({
  id: "set14-audit-wildcat-empty",
  name: "Hyperia audit: Wildcat without items",
  skipPreGame: true,
  seed: "set14-audit-wildcat-empty",
  description: "Entry finishes without a choice when no legal item exists.",
  playerOne: {
    hand: [wildcatUnconventionalMechanic, wildcatUnconventionalMechanic],
    inkwell: 3,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditSirKayFixture = createFixture({
  id: "set14-audit-sir-kay",
  name: "Hyperia audit: Sir Kay",
  skipPreGame: true,
  seed: "set14-audit-sir-kay",
  description: "Conditional Challenger damage and spending the last ink drop.",
  playerOne: {
    play: [{ card: sirKayDeterminedToWin, isDrying: false }, bellesHouseMauricesWorkshop],
    hand: [sirKayDeterminedToWin, sirKayDeterminedToWin],
    inkwell: 5,
    inkDrops: 1,
    deck,
  },
  playerTwo: {
    play: [
      { card: ticktockCanalCroc, exerted: true, isDrying: false },
      { card: sirKayDeterminedToWin, isDrying: false },
    ],
    inkDrops: 1,
    deck,
  },
});

export const set14AuditToulouseFixture = createFixture({
  id: "set14-audit-toulouse",
  name: "Hyperia audit: Toulouse",
  skipPreGame: true,
  seed: "set14-audit-toulouse",
  description: "Opponent action and song restriction until next controller turn.",
  playerOne: {
    hand: [toulouseRoughAndTumble, toulouseRoughAndTumble, dragonFire],
    inkwell: 9,
    deck,
  },
  playerTwo: {
    hand: [
      smash,
      oneJumpAhead,
      kitCloudkickerUnpredictableCourier,
      jukebox,
      bellesHouseMauricesWorkshop,
    ],
    play: [{ card: wildcatUnconventionalMechanic, isDrying: false }],
    inkwell: 9,
    deck,
  },
});

export const set14AuditChiefBogoFixture = createFixture({
  id: "set14-audit-chief-bogo",
  name: "Hyperia audit: Chief Bogo",
  skipPreGame: true,
  seed: "set14-audit-chief-bogo",
  description: "Friendly Hyperia City quest movement and opposing challenge restriction.",
  playerOne: {
    hand: [chiefBogoPoliceCommissioner, chiefBogoPoliceCommissioner],
    play: [
      { card: chiefBogoPoliceCommissioner, isDrying: false },
      portAuthorityCenterHub,
      bellesHouseMauricesWorkshop,
    ],
    inkwell: 13,
    deck,
  },
  playerTwo: {
    play: [
      { card: chiefBogoPoliceCommissioner, isDrying: false },
      { card: kitCloudkickerUnpredictableCourier, isDrying: false },
      { card: wildcatUnconventionalMechanic, isDrying: false },
      portAuthorityCenterHub,
    ],
    inkwell: 6,
    deck,
  },
});

export const set14AuditSirPellinorePlayerTwoFixture = createFixture({
  id: "set14-audit-sir-pellinore-player-two",
  name: "Hyperia audit: Sir Pellinore player-two rewards and negatives",
  skipPreGame: true,
  seed: "pellinore-player-two",
  description:
    "Player One wounded Fru Fru challenges exerted Pellinore: defense one banishes Fru with no reward. Pass. Player Two: Smash one opposing Fru and Tick-Tock challenges the other, neither rewards Pellinore. One Pellinore challenges Carl who survives three damage, no reward. Another banishes damaged Belle's House, no reward; Fan the Flames readies it. Exact Pellinore victories over each Wildcat grant one drop each, including mutual banishment. At zero ink spend one drop on hand Fru. Compare both logs.",
  playerOne: {
    play: [
      { card: fruFruVipGuest, damage: 2 },
      { card: fruFruVipGuest, exerted: true },
      { card: fruFruVipGuest, exerted: true },
      { card: carlFredricksenWildernessGuide, exerted: true },
      { card: wildcatUnconventionalMechanic, exerted: true },
      { card: wildcatUnconventionalMechanic, exerted: true },
      { card: bellesHouseMauricesWorkshop, damage: 3 },
    ],
    deck,
  },
  playerTwo: {
    play: [
      { card: sirPellinoreTougherThanHeLooks, exerted: true },
      sirPellinoreTougherThanHeLooks,
      sirPellinoreTougherThanHeLooks,
      ticktockCanalCroc,
    ],
    hand: [smash, fanTheFlames, fruFruVipGuest],
    inkwell: 4,
    deck,
  },
});

export const set14AuditSirPellinoreFixture = createFixture({
  id: "set14-audit-sir-pellinore",
  name: "Hyperia audit: Sir Pellinore",
  skipPreGame: true,
  seed: "set14-audit-sir-pellinore",
  description: "Challenger damage and repeated character victory ink-drop rewards.",
  playerOne: {
    hand: [sirPellinoreTougherThanHeLooks, sirPellinoreTougherThanHeLooks, fanTheFlames],
    play: [{ card: sirPellinoreTougherThanHeLooks, isDrying: false }],
    inkwell: 7,
    deck,
  },
  playerTwo: {
    play: [
      { card: wildcatUnconventionalMechanic, isDrying: false, exerted: true },
      { card: wildcatUnconventionalMechanic, isDrying: false, exerted: true },
      bellesHouseMauricesWorkshop,
    ],
    inkwell: 3,
    deck,
  },
});

export const set14AuditArthurNoviceFixture = createFixture({
  id: "set14-audit-arthur-novice",
  name: "Hyperia audit: Arthur Novice Blacksmith",
  skipPreGame: true,
  seed: "set14-audit-arthur-novice",
  description: "Optional crafting payment and controller ownership.",
  playerOne: {
    hand: [arthurNoviceBlacksmith, arthurNoviceBlacksmith, arthurNoviceBlacksmith],
    inkwell: 8,
    deck,
  },
  playerTwo: { hand: [arthurNoviceBlacksmith], inkwell: 3, deck },
});

export const set14AuditArthurNoviceNoInkFixture = createFixture({
  id: "set14-audit-arthur-novice-no-ink",
  name: "Hyperia audit: Arthur no crafting ink",
  skipPreGame: true,
  seed: "set14-audit-arthur-novice-no-ink",
  description: "Exact-cost entry cannot pay for crafting.",
  playerOne: { hand: [arthurNoviceBlacksmith], inkwell: 2, deck },
  playerTwo: { inkwell: 3, deck },
});

export const set14AuditBerliozFixture = createFixture({
  id: "set14-audit-berlioz",
  name: "Hyperia audit: Berlioz",
  skipPreGame: true,
  seed: "set14-audit-berlioz",
  description: "Entry damage targets and optional decline.",
  playerOne: {
    hand: [berliozTinyRascal, berliozTinyRascal, berliozTinyRascal],
    play: [{ card: wildcatUnconventionalMechanic, isDrying: false }],
    inkwell: 5,
    deck,
  },
  playerTwo: {
    hand: [berliozTinyRascal],
    play: [
      { card: wildcatUnconventionalMechanic, damage: 2, isDrying: false },
      bellesHouseMauricesWorkshop,
    ],
    inkwell: 2,
    deck,
  },
});

export const set14AuditBerliozKeywordsFixture = createFixture({
  id: "set14-audit-berlioz-keywords",
  name: "Hyperia audit: Berlioz Ward and Resist",
  skipPreGame: true,
  seed: "set14-audit-berlioz-keywords",
  description: "Opposing Ward exclusion and Resist damage prevention.",
  playerOne: {
    hand: [berliozTinyRascal, berliozTinyRascal],
    play: [aladdinPrinceAli],
    inkwell: 3,
    deck,
  },
  playerTwo: {
    play: [aladdinPrinceAli, eeyoreOverstuffedDonkey, bellesHouseMauricesWorkshop],
    inkwell: 2,
    deck,
  },
});

export const set14AuditMarieFixture = createFixture({
  id: "set14-audit-marie",
  name: "Hyperia audit: Marie",
  skipPreGame: true,
  seed: "set14-audit-marie",
  description: "Quest rewards for current-turn opposing damage.",
  playerOne: {
    hand: [fireTheCannons, healingGlow, marieCaughtInTheAct, marieCaughtInTheAct],
    play: [
      { card: marieCaughtInTheAct, isDrying: false },
      { card: marieCaughtInTheAct, isDrying: false },
    ],
    inkwell: 5,
    deck,
  },
  playerTwo: {
    hand: [fireTheCannons],
    play: [
      { card: wildcatUnconventionalMechanic, damage: 1, isDrying: false },
      { card: marieCaughtInTheAct, isDrying: false },
    ],
    inkwell: 2,
    deck,
  },
});

export const set14AuditMarieHealingFixture = createFixture({
  id: "set14-audit-marie-healing",
  name: "Hyperia audit: Marie healed damage",
  skipPreGame: true,
  seed: "set14-audit-marie-healing",
  description: "Healed current-turn damage still qualifies each Marie.",
  playerOne: {
    hand: [fireTheCannons, healingGlow],
    play: [
      { card: marieCaughtInTheAct, isDrying: false },
      { card: marieCaughtInTheAct, isDrying: false },
    ],
    inkwell: 2,
    deck,
  },
  playerTwo: { play: [wildcatUnconventionalMechanic], inkwell: 2, deck },
});

export const set14AuditMariePreventedFixture = createFixture({
  id: "set14-audit-marie-prevented",
  name: "Hyperia audit: Marie prevented damage",
  skipPreGame: true,
  seed: "set14-audit-marie-prevented",
  description: "Fully prevented damage does not qualify Marie.",
  playerOne: {
    hand: [berliozTinyRascal],
    play: [{ card: marieCaughtInTheAct, isDrying: false }],
    inkwell: 1,
    deck,
  },
  playerTwo: { play: [eeyoreOverstuffedDonkey], inkwell: 2, deck },
});

export const set14AuditBalooFixture = createFixture({
  id: "set14-audit-baloo",
  name: "Hyperia audit: Baloo",
  skipPreGame: true,
  seed: "set14-audit-baloo",
  description: "Current-turn drop permission for quest and challenge.",
  playerOne: {
    hand: [arthurNoviceBlacksmith, balooDeliveryPilot, balooDeliveryPilot, fireTheCannons],
    play: [
      { card: balooDeliveryPilot, isDrying: false },
      { card: balooDeliveryPilot, isDrying: false },
    ],
    inkwell: 5,
    deck,
  },
  playerTwo: {
    hand: [arthurNoviceBlacksmith],
    play: [
      { card: wildcatUnconventionalMechanic, exerted: true, isDrying: false },
      { card: balooDeliveryPilot, isDrying: false },
    ],
    inkwell: 3,
    deck,
  },
});

export const set14AuditKoslovFixture = createFixture({
  id: "set14-audit-koslov",
  name: "Hyperia audit: Koslov",
  skipPreGame: true,
  seed: "set14-audit-koslov",
  description: "Vanilla stats, paid entry, quest, and challenge.",
  playerOne: {
    hand: [koslovImposingEnforcer, koslovImposingEnforcer],
    play: [
      { card: koslovImposingEnforcer, isDrying: false },
      { card: koslovImposingEnforcer, isDrying: false },
    ],
    inkwell: 4,
    deck,
  },
  playerTwo: {
    play: [{ card: koslovImposingEnforcer, exerted: true, isDrying: false }],
    inkwell: 2,
    deck,
  },
});

export const set14AuditSirEctorFixture = createFixture({
  id: "set14-audit-sir-ector",
  name: "Hyperia audit: Sir Ector",
  skipPreGame: true,
  seed: "set14-audit-sir-ector",
  description: "Repeated challenge draws and mutual banishment reward.",
  playerOne: {
    hand: [sirEctorBlusteryKnight, sirEctorBlusteryKnight, fanTheFlames],
    play: [
      { card: sirEctorBlusteryKnight, isDrying: false },
      { card: sirEctorBlusteryKnight, isDrying: false },
    ],
    inkwell: 6,
    deck,
  },
  playerTwo: {
    play: [
      { card: fruFruVipGuest, exerted: true, isDrying: false },
      { card: fruFruVipGuest, exerted: true, isDrying: false },
      { card: sirEctorBlusteryKnight, exerted: true, isDrying: false },
    ],
    inkwell: 3,
    deck,
  },
});

export const set14AuditSirEctorNegativeFixture = createFixture({
  id: "set14-audit-sir-ector-negative",
  name: "Hyperia audit: Sir Ector no reward",
  skipPreGame: true,
  seed: "set14-audit-sir-ector-negative",
  description: "Nonlethal challenge, another attacker, and action banishment do not draw.",
  playerOne: {
    hand: [dragonFire],
    play: [
      { card: sirEctorBlusteryKnight, isDrying: false },
      { card: sirEctorBlusteryKnight, isDrying: false },
      { card: koslovImposingEnforcer, isDrying: false },
    ],
    inkwell: 5,
    deck,
  },
  playerTwo: {
    play: [
      { card: yaxConcertGoer, exerted: true, isDrying: false },
      { card: fruFruVipGuest, exerted: true, isDrying: false },
      { card: fruFruVipGuest, exerted: true, isDrying: false },
    ],
    deck,
  },
});
export const set14AuditSirEctorEmptyFixture = createFixture({
  id: "set14-audit-sir-ector-empty",
  name: "Hyperia audit: Sir Ector empty deck",
  skipPreGame: true,
  seed: "set14-audit-sir-ector-empty",
  description: "Empty reward resolves and deck loss occurs when passing.",
  playerOne: { play: [{ card: sirEctorBlusteryKnight, isDrying: false }], deck: [] },
  playerTwo: { play: [{ card: fruFruVipGuest, exerted: true, isDrying: false }], deck },
});

export const set14AuditBalooFreightFixture = createFixture({
  id: "set14-audit-baloo-freight",
  name: "Hyperia audit: Baloo Freight Pilot",
  skipPreGame: true,
  seed: "set14-audit-baloo-freight",
  description: "Resist prevention, repeated action damage, and challenge damage.",
  playerOne: {
    hand: [berliozTinyRascal, fireTheCannons, fireTheCannons, balooFreightPilot, balooFreightPilot],
    play: [
      { card: balooFreightPilot, isDrying: false },
      { card: balooFreightPilot, isDrying: false },
    ],
    inkwell: 7,
    deck,
  },
  playerTwo: {
    play: [{ card: koslovImposingEnforcer, exerted: true, isDrying: false }],
    hand: [fireTheCannons],
    inkwell: 1,
    deck,
  },
});

export const set14AuditKitSureShotFixture = createFixture({
  id: "set14-audit-kit-sure-shot",
  name: "Hyperia audit: Kit Sure Shot",
  skipPreGame: true,
  seed: "set14-audit-kit-sure-shot",
  description: "Quest choices, Shift, target legality, and controller ownership.",
  playerOne: {
    hand: [kitCloudkickerSureShot, kitCloudkickerSureShot],
    play: [
      { card: kitCloudkickerSureShot, isDrying: false },
      { card: kitCloudkickerSureShot, isDrying: false },
      { card: kitCloudkickerUnpredictableCourier, isDrying: false, damage: 1 },
      aladdinPrinceAli,
    ],
    inkwell: 8,
    deck,
  },
  playerTwo: {
    play: [
      { card: kitCloudkickerSureShot, isDrying: false },
      wildcatUnconventionalMechanic,
      aladdinPrinceAli,
      eeyoreOverstuffedDonkey,
      bellesHouseMauricesWorkshop,
    ],
    inkwell: 3,
    deck,
  },
});

export const set14AuditArthurJoustingFixture = createFixture({
  id: "set14-audit-arthur-jousting",
  name: "Hyperia audit: Arthur Jousting Knight",
  description: "Challenge rewards, Challenger, Shift and normal actions.",
  skipPreGame: true,
  seed: "set14-audit-arthur-jousting",
  playerOne: {
    hand: [arthurJoustingKnight, arthurJoustingKnight, fanTheFlames],
    play: [
      { card: arthurJoustingKnight, isDrying: false },
      { card: arthurJoustingKnight, isDrying: false },
      { card: arthurNoviceBlacksmith, isDrying: false, damage: 1 },
    ],
    inkwell: 8,
    deck,
  },
  playerTwo: {
    play: [
      { card: fruFruVipGuest, exerted: true, isDrying: false },
      { card: fruFruVipGuest, exerted: true, isDrying: false },
      { card: sirEctorBlusteryKnight, exerted: true, isDrying: false },
      { card: arthurJoustingKnight, isDrying: false },
      { card: yaxConcertGoer, exerted: true, isDrying: false },
    ],
    inkwell: 3,
    deck,
  },
});

export const set14AuditMrBigFixture = createFixture({
  id: "set14-audit-mr-big",
  name: "Hyperia audit: Mr Big Distribution Magnate",
  description: "End-turn challenge restriction, targets and expiry.",
  skipPreGame: true,
  seed: "set14-audit-mr-big",
  playerOne: {
    hand: [mrBigDistributionMagnate, mrBigDistributionMagnate],
    play: [{ card: koslovImposingEnforcer, exerted: true, isDrying: false }],
    inkwell: 2,
    deck,
  },
  playerTwo: {
    hand: [mrBigDistributionMagnate],
    play: [
      { card: kitCloudkickerSureShot, isDrying: false },
      { card: kitCloudkickerSureShot, isDrying: false },
      aladdinPrinceAli,
      bellesHouseMauricesWorkshop,
    ],
    inkwell: 2,
    deck,
  },
});

export const set14AuditShereKhanCeoPlayerTwoFixture = createFixture({
  id: "set14-audit-shere-khan-ceo-player-two",
  name: "Hyperia audit: CEO player-two independent rewards",
  skipPreGame: true,
  seed: "ceo-player-two",
  description:
    "Player One wounded Fru challenges exerted Koslov; defense victory gives no reward. Pass. Player Two: original CEO defeats exerted Fru, no self reward. Middle Koslov challenges Carl, survivor means no reward. Tick-Tock destroys Belle's House, no reward. Dragon Fire banishes another Fru, no reward. Play second CEO and grant first Koslov ready challenges. That Koslov challenges ready Wildcat: two CEOs grant two drops. Last Koslov defeats another Fru: no extra this turn. Spend one drop on hand Fru at zero ink. Pass; Player One quests remaining Fru and passes. Last Koslov defeats it for two new rewards. Compare both logs.",
  playerOne: {
    play: [
      { card: fruFruVipGuest, damage: 2 },
      { card: fruFruVipGuest, exerted: true },
      { card: fruFruVipGuest, exerted: true },
      { card: fruFruVipGuest, exerted: true },
      { card: fruFruVipGuest, exerted: true },
      { card: carlFredricksenWildernessGuide, exerted: true },
      wildcatUnconventionalMechanic,
      aladdinPrinceAli,
      bellesHouseMauricesWorkshop,
    ],
    deck,
  },
  playerTwo: {
    play: [
      shereKhanKhanIndustriesCeo,
      { card: koslovImposingEnforcer, exerted: true },
      koslovImposingEnforcer,
      koslovImposingEnforcer,
      ticktockCanalCroc,
      aladdinPrinceAli,
    ],
    hand: [shereKhanKhanIndustriesCeo, dragonFire, fruFruVipGuest],
    inkwell: 9,
    deck,
  },
});

export const set14AuditShereKhanCeoGrantsFixture = createFixture({
  id: "set14-audit-shere-khan-ceo-grants",
  name: "Hyperia audit: CEO self, Ward and opposing grants",
  skipPreGame: true,
  seed: "ceo-grant-boundaries",
  description:
    "Pass to Player Two. First CEO grants itself ready challenges but Fresh Ink still prevents acting. Second CEO grants friendly Ward Aladdin; Aladdin can challenge wounded ready Fru. Third CEO grants opposing Koslov, which shows the readable this-turn effect but loses it on pass. On Player One turn Koslov cannot challenge Player Two's ready CEO; no action or damage occurs.",
  playerOne: {
    play: [
      { card: fruFruVipGuest, damage: 1 },
      koslovImposingEnforcer,
      aladdinPrinceAli,
      bellesHouseMauricesWorkshop,
    ],
    deck,
  },
  playerTwo: {
    play: [aladdinPrinceAli],
    hand: [shereKhanKhanIndustriesCeo, shereKhanKhanIndustriesCeo, shereKhanKhanIndustriesCeo],
    inkwell: 12,
    deck,
  },
});

export const set14AuditShereKhanCeoFixture = createFixture({
  id: "set14-audit-shere-khan-ceo",
  name: "Hyperia audit: Shere Khan CEO",
  description: "Ready challenges, target legality and once-per-turn rewards.",
  skipPreGame: true,
  seed: "set14-audit-shere-khan-ceo",
  playerOne: {
    hand: [shereKhanKhanIndustriesCeo, shereKhanKhanIndustriesCeo],
    play: [
      { card: koslovImposingEnforcer, isDrying: false },
      { card: koslovImposingEnforcer, isDrying: false },
      { card: aladdinPrinceAli, isDrying: false },
    ],
    inkwell: 4,
    deck,
  },
  playerTwo: {
    play: [
      { card: wildcatUnconventionalMechanic, isDrying: false },
      { card: fruFruVipGuest, exerted: true, isDrying: false },
      aladdinPrinceAli,
      bellesHouseMauricesWorkshop,
    ],
    inkwell: 4,
    deck,
  },
});

export const set14AuditTianaHostessFixture = createFixture({
  id: "set14-audit-tiana-hostess",
  name: "Hyperia audit: Tiana Party Hostess",
  description: "Draw, chosen discard, free location identity and Shift.",
  skipPreGame: true,
  seed: "set14-audit-tiana-hostess",
  playerOne: {
    hand: [tianaPartyHostess, tianaPartyHostess, portAuthorityCenterHub, koslovImposingEnforcer],
    discard: [centralStationTransportationHub],
    play: [{ card: tianaRestauranteur, isDrying: false, damage: 1 }],
    inkwell: 7,
    deck,
  },
  playerTwo: {
    hand: [tianaPartyHostess, portAuthorityCenterHub],
    discard: [centralStationTransportationHub],
    play: [{ card: tianaRestauranteur, isDrying: false }],
    inkwell: 7,
    deck,
  },
});

export const set14AuditJoustingMatchFixture = createFixture({
  id: "set14-audit-jousting-match",
  name: "Hyperia audit: Jousting Match",
  description: "Ink and drop payment, damage replacement, Ward and Resist targets.",
  skipPreGame: true,
  seed: "set14-audit-jousting-match",
  playerOne: {
    hand: [joustingMatch, joustingMatch, joustingMatch, joustingMatch],
    play: [aladdinPrinceAli, koslovImposingEnforcer],
    inkwell: 9,
    inkDrops: 3,
    deck,
  },
  playerTwo: {
    hand: [joustingMatch, joustingMatch],
    play: [
      balooFreightPilot,
      yaxConcertGoer,
      fruFruVipGuest,
      aladdinPrinceAli,
      bellesHouseMauricesWorkshop,
    ],
    inkwell: 3,
    inkDrops: 1,
    deck,
  },
});

export const set14AuditInkExplosionFixture = createFixture({
  id: "set14-audit-ink-explosion",
  name: "Hyperia audit: Ink Explosion",
  description: "Four damage, controller drop gain, payment, Ward and Resist.",
  skipPreGame: true,
  seed: "set14-audit-ink-explosion",
  playerOne: {
    hand: [inkExplosion, inkExplosion, inkExplosion],
    play: [aladdinPrinceAli, yaxConcertGoer],
    inkwell: 8,
    inkDrops: 1,
    deck,
  },
  playerTwo: {
    hand: [inkExplosion],
    play: [
      balooFreightPilot,
      koslovImposingEnforcer,
      aladdinPrinceAli,
      bellesHouseMauricesWorkshop,
    ],
    inkwell: 4,
    inkDrops: 1,
    deck,
  },
});

export const set14AuditKhanDeliveryFixture = createFixture({
  id: "set14-audit-khan-delivery",
  name: "Hyperia audit: Khan Transport Delivery",
  description: "Draw, drop gain, payment, non-inkable controls and empty deck.",
  skipPreGame: true,
  seed: "set14-audit-khan-delivery",
  playerOne: {
    hand: [khanTransportDelivery, khanTransportDelivery, khanTransportDelivery],
    inkwell: 2,
    inkDrops: 1,
    deck: [fruFruVipGuest],
  },
  playerTwo: {
    hand: [khanTransportDelivery, khanTransportDelivery],
    inkwell: 2,
    inkDrops: 1,
    deck,
  },
});

export const set14AuditPeopleOwnershipFixture = createFixture({
  id: "set14-audit-people-ownership",
  name: "Hyperia audit: People song exact owner and destination",
  skipPreGame: true,
  seed: "people-owner-destination",
  description:
    "Pass to Player Two. Sing with second Maui at zero ink. Mandatory free-location picker must offer only two own hand Ports and two own discarded Belle Houses, excluding Fru, old location and opposing discard. Select second Belle; accept movement to the new exact copy, leaving first Maui and old Belle unmoved. Sing second song with first Maui and play a hand Port, then decline movement. Compare owner and public logs and privacy while choices are pending.",
  playerOne: {
    play: [centralStationTransportationHub],
    discard: [bellesHouseMauricesWorkshop, bellesHouseMauricesWorkshop],
    deck,
  },
  playerTwo: {
    hand: [
      peopleGonnaComeHere,
      peopleGonnaComeHere,
      portAuthorityCenterHub,
      portAuthorityCenterHub,
      fruFruVipGuest,
    ],
    play: [mauiDemigod, mauiDemigod, bellesHouseMauricesWorkshop],
    discard: [bellesHouseMauricesWorkshop, bellesHouseMauricesWorkshop],
    deck,
  },
});

export const set14AuditPeopleGonnaComeHereFixture = createFixture({
  id: "set14-audit-people-gonna-come-here",
  name: "Hyperia audit: People Gonna Come Here",
  description: "Free location from hand or discard, singer movement and decline.",
  skipPreGame: true,
  seed: "set14-audit-people-gonna-come-here",
  playerOne: {
    hand: [peopleGonnaComeHere, peopleGonnaComeHere, portAuthorityCenterHub],
    play: [{ card: mauiDemigod, isDrying: false }, centralStationTransportationHub],
    discard: [bellesHouseMauricesWorkshop],
    inkwell: 7,
    deck,
  },
  playerTwo: {
    hand: [peopleGonnaComeHere, portAuthorityCenterHub],
    play: [{ card: mauiDemigod, isDrying: false }, centralStationTransportationHub],
    discard: [bellesHouseMauricesWorkshop],
    inkwell: 7,
    deck,
  },
});

export const set14AuditExpressPlayerTwoFixture = createFixture({
  id: "set14-audit-express-player-two",
  name: "Hyperia audit: Express player-two copies and source removal",
  skipPreGame: true,
  seed: "express-player-two-copies",
  description:
    "Pass to Player Two. Own Port starts at twelve willpower with nine damage, opponent Port eight and Belle Houses six. Play hand Koslov for four ink. Activate second Express; mandatory picker excludes opposing cards and items. Move only Fresh Ink Koslov to second own Belle for free, keeping bank four and character ready/drying, exerting only selected Express. Break unused Express for two: Port stays in play at ten willpower. Break exerted Express for two: Port drops to eight and is banished from nine damage. Compare both logs.",
  playerOne: {
    play: [koslovImposingEnforcer, portAuthorityCenterHub, bellesHouseMauricesWorkshop],
    deck,
  },
  playerTwo: {
    play: [
      hyperiaCityExpress,
      hyperiaCityExpress,
      koslovImposingEnforcer,
      { card: portAuthorityCenterHub, damage: 9 },
      bellesHouseMauricesWorkshop,
      bellesHouseMauricesWorkshop,
    ],
    hand: [koslovImposingEnforcer, breakCard, breakCard],
    inkwell: 8,
    deck,
  },
});

export const set14AuditHyperiaCityExpressFixture = createFixture({
  id: "set14-audit-hyperia-city-express",
  name: "Hyperia audit: Hyperia City Express",
  description: "Free movement, item exertion and Hyperia City willpower bonus.",
  skipPreGame: true,
  seed: "set14-audit-hyperia-city-express",
  playerOne: {
    hand: [hyperiaCityExpress],
    play: [
      hyperiaCityExpress,
      { card: koslovImposingEnforcer, isDrying: true },
      portAuthorityCenterHub,
      bellesHouseMauricesWorkshop,
    ],
    inkwell: 1,
    deck,
  },
  playerTwo: {
    play: [
      hyperiaCityExpress,
      { card: koslovImposingEnforcer, isDrying: false },
      portAuthorityCenterHub,
      bellesHouseMauricesWorkshop,
    ],
    inkwell: 0,
    deck,
  },
});

export const set14AuditPlaneCopiesFixture = createFixture({
  id: "set14-audit-plane-copies",
  name: "Hyperia audit: Pirate Plane exact copies",
  description:
    "Pass to Player Two. Play two Planes: damage the second Koslov, then decline. Activate second Plane on second Koslov, first Plane on opposing Pan. Inspect exact exertion, separate targets and expiry.",
  skipPreGame: true,
  seed: "set14-audit-plane-copies",
  playerOne: {
    play: [
      { card: peterPanNeverLanding, exerted: true, isDrying: false },
      aladdinPrinceAli,
      bellesHouseMauricesWorkshop,
    ],
    deck,
  },
  playerTwo: {
    hand: [piratePlane, piratePlane],
    play: [
      { card: koslovImposingEnforcer, isDrying: false },
      { card: koslovImposingEnforcer, isDrying: false },
      aladdinPrinceAli,
    ],
    inkwell: 8,
    deck,
  },
});

export const set14AuditPlaneNoTargetFixture = createFixture({
  id: "set14-audit-plane-no-target",
  name: "Hyperia audit: Pirate Plane no legal target",
  description:
    "Play Plane with only opposing Ward in play: no damage choice. Ink the other Plane without an entry trigger.",
  skipPreGame: true,
  seed: "set14-audit-plane-no-target",
  playerOne: { hand: [piratePlane, piratePlane], inkwell: 3, deck },
  playerTwo: { play: [aladdinPrinceAli], deck },
});

export const set14AuditPiratePlaneFixture = createFixture({
  id: "set14-audit-pirate-plane",
  name: "Hyperia audit: Pirate Plane",
  description: "Optional damage, Ward, Resist and Alert challenge legality.",
  skipPreGame: true,
  seed: "set14-audit-pirate-plane",
  playerOne: {
    hand: [piratePlane, piratePlane],
    play: [{ card: koslovImposingEnforcer, isDrying: false }, aladdinPrinceAli],
    inkwell: 4,
    inkDrops: 1,
    deck,
  },
  playerTwo: {
    hand: [piratePlane],
    play: [
      piratePlane,
      { card: koslovImposingEnforcer, isDrying: false },
      { card: peterPanNeverLanding, exerted: true, isDrying: false },
      balooFreightPilot,
      aladdinPrinceAli,
    ],
    inkwell: 4,
    inkDrops: 1,
    deck,
  },
});

// Test-only action isolates Free Souvenir's controller-turn condition.
export const set14AuditStationOffTurnFixture = createFixture({
  id: "set14-audit-station-off-turn",
  name: "Hyperia audit: Central Station off-turn movement",
  description:
    "Player One plays Audit Station Transport to move Player Two's Koslov to their Station. No reward on the opposing turn. Pass, play Yax and move him there for the first own-turn reward. Transport is a synthetic audit card.",
  skipPreGame: true,
  seed: "set14-audit-station-off-turn",
  playerOne: {
    hand: [
      {
        ...dragonFire,
        id: "audit-station-transport",
        canonicalId: "audit-station-transport",
        slug: "audit-station-transport",
        printings: [],
        reprints: [],
        name: "Audit Station Transport",
        i18n: {
          en: { name: "Audit Station Transport" },
          de: { name: "Audit Station Transport" },
          es: { name: "Audit Station Transport" },
          fr: { name: "Audit Station Transport" },
          it: { name: "Audit Station Transport" },
        },
        cost: 1,
        text: "Test only: Move each opposing character to their location for free.",
        abilities: [
          {
            type: "action",
            effect: {
              type: "move-to-location",
              cost: "free",
              character: {
                selector: "all",
                count: "all",
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["character"],
              },
              location: {
                selector: "all",
                count: "all",
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["location"],
              },
            },
          },
        ],
      },
    ],
    inkwell: 1,
    deck,
  },
  playerTwo: {
    play: [centralStationTransportationHub, { card: koslovImposingEnforcer, isDrying: false }],
    hand: [yaxConcertGoer],
    inkwell: 8,
    deck,
  },
});

export const set14AuditCentralStationFixture = createFixture({
  id: "set14-audit-central-station",
  name: "Hyperia audit: Central Station",
  description: "Movement reward, once-per-turn limit and next-turn reset.",
  skipPreGame: true,
  seed: "set14-audit-central-station",
  playerOne: {
    play: [
      centralStationTransportationHub,
      bellesHouseMauricesWorkshop,
      { card: koslovImposingEnforcer, isDrying: true },
      { card: yaxConcertGoer, isDrying: false },
      hyperiaCityExpress,
    ],
    inkwell: 3,
    deck,
  },
  playerTwo: {
    play: [
      centralStationTransportationHub,
      bellesHouseMauricesWorkshop,
      { card: koslovImposingEnforcer, isDrying: false },
    ],
    inkwell: 3,
    deck,
  },
});

export const set14AuditKhanIndustriesFixture = createFixture({
  id: "set14-audit-khan-industries",
  name: "Hyperia audit: Khan Industries",
  description:
    "Protected characters, legal location challenges and movement out of protection. Two hand copies allow failed four-ink play, normal inking, paid five-ink play and recurring location lore checks.",
  skipPreGame: true,
  seed: "set14-audit-khan-industries",
  playerOne: {
    hand: [khanIndustriesGreenwayLandmark, khanIndustriesGreenwayLandmark],
    play: [
      khanIndustriesGreenwayLandmark,
      bellesHouseMauricesWorkshop,
      { card: koslovImposingEnforcer, isDrying: false },
      { card: koslovImposingEnforcer, isDrying: false },
      { card: yaxConcertGoer, isDrying: false },
    ],
    inkwell: 4,
    deck,
  },
  playerTwo: {
    play: [
      khanIndustriesGreenwayLandmark,
      bellesHouseMauricesWorkshop,
      {
        card: koslovImposingEnforcer,
        atLocation: khanIndustriesGreenwayLandmark,
        exerted: true,
        isDrying: false,
      },
      { card: yaxConcertGoer, exerted: true, isDrying: false },
    ],
    inkwell: 4,
    deck,
  },
});

export const set14AuditIconicMickeyFixture = createFixture({
  id: "set14-audit-iconic-mickey",
  name: "Hyperia audit: Iconic Mickey",
  description: "Adventurous challenge restriction, mandatory quest and each-player end-turn drops.",
  skipPreGame: true,
  seed: "set14-audit-iconic-mickey",
  playerOne: {
    hand: [mickeyMouseBestInTownIconic],
    play: [{ card: mickeyMouseBestInTownIconic, isDrying: false }],
    inkwell: 1,
    deck,
  },
  playerTwo: {
    hand: [mickeyMouseBestInTownIconic],
    play: [
      { card: koslovImposingEnforcer, exerted: true, isDrying: false },
      { card: mickeyMouseBestInTownIconic, isDrying: false },
    ],
    inkwell: 1,
    deck,
  },
});

export const set14AuditIconicCinderellaFixture = createFixture({
  id: "set14-audit-iconic-cinderella",
  name: "Hyperia audit: Iconic Cinderella",
  skipPreGame: true,
  seed: "set14-audit-iconic-cinderella",
  description:
    "Optional top or bottom split with private facedown exerted ink; A Dark Age No More proves noninkable cards can be placed by the effect.",
  playerOne: {
    play: [{ card: cinderellaUnintentionalIconIconic, isDrying: false }],
    inkwell: 2,
    deck: [...deck, aDarkAgeNoMore, riveraFamilyPhoto],
  },
  playerTwo: {
    play: [{ card: cinderellaUnintentionalIconIconic, isDrying: false }],
    inkwell: 2,
    deck: [...deck, aDarkAgeNoMore, riveraFamilyPhoto],
  },
});
export const set14AuditIconicCinderellaShortFixture = createFixture({
  id: "set14-audit-iconic-cinderella-short",
  name: "Hyperia audit: Iconic Cinderella short deck",
  skipPreGame: true,
  seed: "set14-audit-iconic-cinderella-short",
  description: "One-card Bespoke Design can retain the card without adding ink.",
  playerOne: {
    play: [{ card: cinderellaUnintentionalIconIconic, isDrying: false }],
    inkwell: 2,
    deck: [riveraFamilyPhoto],
  },
  playerTwo: { deck },
});

export const set14AuditIconicCinderellaShiftFixture = createFixture({
  id: "set14-audit-iconic-cinderella-shift",
  name: "Hyperia audit: Iconic Cinderella Shift",
  skipPreGame: true,
  seed: "set14-audit-iconic-cinderella-shift",
  description:
    "Shift five ink onto ready damaged Cinderella and quest immediately; reload for normal seven-ink play.",
  playerOne: {
    hand: [cinderellaUnintentionalIconIconic],
    play: [{ card: cinderellaHomespunDressmaker, isDrying: false, damage: 1 }],
    inkwell: 7,
    deck: [...deck, jukebox, riveraFamilyPhoto],
  },
  playerTwo: { deck },
});

export const set14AuditChallengeAuraFixture = createFixture({
  id: "set14-audit-challenge-aura",
  name: "Hyperia audit: challenge aura restriction",
  skipPreGame: true,
  seed: "set14-audit-challenge-aura",
  description: "Jafar blocks cost-four Koslov; banish Jafar to restore its challenge action.",
  playerOne: {
    hand: [dragonFire],
    play: [{ card: koslovImposingEnforcer, isDrying: false }],
    inkwell: 5,
    deck,
  },
  playerTwo: {
    play: [jafarTyrannicalHypnotist, { card: fruFruVipGuest, exerted: true }],
    deck,
  },
});

export const set14AuditChallengePaymentFixture = createFixture({
  id: "set14-audit-challenge-payment",
  name: "Hyperia audit: payable challenge restriction",
  skipPreGame: true,
  seed: "set14-audit-challenge-payment",
  description:
    "RC can pay its restriction but has no exerted defender; spend the ink to inspect the unpaid reason.",
  playerOne: {
    hand: [fruFruVipGuest],
    play: [{ card: rcRemotecontrolledCar, isDrying: false }],
    inkwell: 1,
    deck,
  },
  playerTwo: { play: [{ card: koslovImposingEnforcer, isDrying: false }], deck },
});

export const set14AuditSongNoSingerFixture = createFixture({
  id: "set14-audit-song-no-singer",
  name: "Hyperia audit: restricted song without a singer",
  skipPreGame: true,
  seed: "set14-audit-song-no-singer",
  description:
    "Play Toulouse and pass; the opponent has only an item, location and low-value singer.",
  playerOne: { hand: [toulouseRoughAndTumble], inkwell: 2, deck },
  playerTwo: {
    hand: [oneJumpAhead],
    play: [jukebox, bellesHouseMauricesWorkshop, { card: fruFruVipGuest, isDrying: false }],
    deck,
  },
});

export const set14AuditSongEligibleSingerFixture = createFixture({
  id: "set14-audit-song-eligible-singer",
  name: "Hyperia audit: restricted song with a singer",
  skipPreGame: true,
  seed: "set14-audit-song-eligible-singer",
  description:
    "Play Toulouse and pass; ready Koslov could sing but the action restriction prevents it.",
  playerOne: { hand: [toulouseRoughAndTumble], inkwell: 2, deck },
  playerTwo: {
    hand: [oneJumpAhead],
    play: [{ card: koslovImposingEnforcer, isDrying: false }],
    deck,
  },
});

export const set14AuditSongPendingChoiceFixture = createFixture({
  id: "set14-audit-song-pending-choice",
  name: "Hyperia audit: song during pending choice",
  skipPreGame: true,
  seed: "set14-audit-song-pending-choice",
  description: "Wildcat's optional entry choice must finish before ready Koslov can sing.",
  playerOne: {
    hand: [wildcatUnconventionalMechanic, oneJumpAhead],
    play: [{ card: koslovImposingEnforcer, isDrying: false }],
    inkwell: 3,
    deck,
  },
  playerTwo: { play: [jukebox], deck },
});

export const set14AuditAbuelitaFixture = createFixture({
  id: "set14-audit-abuelita",
  name: "Hyperia audit: Abuelita",
  skipPreGame: true,
  seed: "set14-audit-abuelita",
  description: "Printed three-ink entry, Fresh Ink, two-lore quest and three damage in challenge.",
  playerOne: {
    hand: [abuelitaLovingGrandmother, abuelitaLovingGrandmother, abuelitaLovingGrandmother],
    play: [
      { card: abuelitaLovingGrandmother, isDrying: false },
      { card: abuelitaLovingGrandmother, isDrying: false },
    ],
    inkwell: 3,
    deck,
  },
  playerTwo: { play: [{ card: abuelitaLovingGrandmother, exerted: true }], deck },
});

export const set14AuditFruFruFixture = createFixture({
  id: "set14-audit-fru-fru",
  name: "Hyperia audit: Fru Fru",
  skipPreGame: true,
  seed: "set14-audit-fru-fru",
  description: "One-ink entry, Fresh Ink, one-lore quest and one damage in challenge.",
  playerOne: {
    hand: [fruFruVipGuest, fruFruVipGuest, fruFruVipGuest],
    play: [
      { card: fruFruVipGuest, isDrying: false },
      { card: fruFruVipGuest, isDrying: false },
    ],
    inkwell: 1,
    deck,
  },
  playerTwo: { play: [{ card: fruFruVipGuest, exerted: true }], deck },
});

export const set14AuditMaxMusicLoverFixture = createFixture({
  id: "set14-audit-max-music-lover",
  name: "Hyperia audit: Max Goof Music Lover",
  skipPreGame: true,
  seed: "set14-audit-max-music-lover",
  description:
    "Quest with Singer bonus, ready Max, sing Let It Go to ink Gazelle, then pass both turns and quest without bonus.",
  playerOne: {
    hand: [fanTheFlames, letItGo, fanTheFlames],
    play: [
      { card: maxGoofMusicLover, isDrying: false },
      { card: gazellePopDiva, isDrying: false },
    ],
    inkwell: 2,
    deck,
  },
  playerTwo: { play: [gazellePopDiva], deck },
});

export const set14AuditMaxMusicPlayerTwoFixture = createFixture({
  id: "set14-audit-max-music-player-two",
  name: "Hyperia audit: Max Music Lover Player Two",
  skipPreGame: true,
  seed: "set14-audit-max-music-player-two",
  description:
    "Pass to Player Two. Higitus Figitus costs six and cannot be sung by either ready Max, despite six bank ink. Quest the first Max for two; sing Let It Go with the other for no ink and put one own Max into your inkwell. The remaining Max immediately loses the other-Singer bonus despite opposing Gazelle. Pass both turns, then quest the survivor for one. Verify payment, ownership and both public logs.",
  playerOne: { play: [gazellePopDiva], deck },
  playerTwo: {
    hand: [higitusFigitus, letItGo],
    play: [maxGoofMusicLover, maxGoofMusicLover],
    inkwell: 6,
    deck,
  },
});

export const set14AuditGazellePopDivaFixture = createFixture({
  id: "set14-audit-gazelle-pop-diva",
  name: "Hyperia audit: Gazelle Pop Diva",
  skipPreGame: true,
  seed: "set14-audit-gazelle-pop-diva",
  description: "Singer 4 heals own characters; cost-five song remains ineligible.",
  playerOne: {
    hand: [hakunaMatata, letItGo],
    play: [
      { card: gazellePopDiva, isDrying: false, damage: 2 },
      { card: fruFruVipGuest, isDrying: false, damage: 1 },
    ],
    inkwell: 0,
    deck,
  },
  playerTwo: { play: [{ card: gazellePopDiva, damage: 2 }], deck },
});

export const set14AuditGazellePlayerTwoFixture = createFixture({
  id: "set14-audit-gazelle-player-two",
  name: "Hyperia audit: Gazelle Player Two Singer states",
  skipPreGame: true,
  seed: "set14-audit-gazelle-player-two",
  description:
    "Pass to Player Two. Play the hand Gazelle for two, leaving no ready ink. Let It Go cannot be sung at cost five. Sing Hakuna Matata with the older dry Gazelle only: own Gazelle and Fru Fru heal, opposing Gazelle does not. The second song cannot be sung while one Gazelle is exerted and the other is drying. Pass both turns; quest the older copy as setup, then sing the second song with the now-dry newer copy. Check both logs and payment ownership.",
  playerOne: { play: [{ card: gazellePopDiva, damage: 2 }], deck },
  playerTwo: {
    hand: [gazellePopDiva, hakunaMatata, hakunaMatata, letItGo],
    play: [
      { card: gazellePopDiva, damage: 2 },
      { card: fruFruVipGuest, damage: 1 },
    ],
    inkwell: 2,
    deck,
  },
});

export const set14AuditPeteBodyguardFixture = createFixture({
  id: "set14-audit-pete-bodyguard",
  name: "Hyperia audit: Pete Bodyguard",
  skipPreGame: true,
  seed: "set14-audit-pete-bodyguard",
  description: "Play Pete exerted or ready; opposing challengers must choose an exerted Bodyguard.",
  playerOne: {
    hand: [peteSuaveShowoff, peteSuaveShowoff],
    play: [{ card: fruFruVipGuest, exerted: true }],
    inkwell: 8,
    deck,
  },
  playerTwo: {
    play: [koslovImposingEnforcer, koslovImposingEnforcer, koslovImposingEnforcer],
    deck,
  },
});

export const set14AuditPeteMultipleGuardsFixture = createFixture({
  id: "set14-audit-pete-multiple-guards",
  name: "Hyperia audit: Pete multiple Bodyguards and readiness",
  skipPreGame: true,
  seed: "set14-audit-pete-multiple-guards",
  description:
    "Player One has three Koslovs. Two exerted Player Two Petes each have two damage and protect two exerted Fru Frus. First verify the ally cannot be challenged. Pass to Player Two to ready both guards, quest one Fru Fru as setup and pass back: that ally can now be challenged while both guards stay ready. Pass again, quest all three remaining Player Two characters as setup, then pass back. Both guards protect the second ally; after one guard is banished, the other still protects it. Banish the second guard and challenge the ally. Check exact damage, ownership and both logs.",
  playerOne: {
    play: [koslovImposingEnforcer, koslovImposingEnforcer, koslovImposingEnforcer],
    deck,
  },
  playerTwo: {
    play: [
      { card: peteSuaveShowoff, exerted: true, damage: 2 },
      { card: peteSuaveShowoff, exerted: true, damage: 2 },
      { card: fruFruVipGuest, exerted: true },
      { card: fruFruVipGuest, exerted: true },
    ],
    deck,
  },
});

export const set14AuditMiriamPlayerTwoFixture = createFixture({
  id: "set14-audit-miriam-player-two",
  name: "Hyperia audit: Miriam Player Two Support chain",
  skipPreGame: true,
  seed: "set14-audit-miriam-player-two",
  description:
    "Pass to Player Two. The first Miriam supports the opposing Koslov. The second supports the third, which then supports the fourth. Each source must be excluded from its own chooser, while the other exact Miriam copies remain legal. The fourth now has three strength and supports the own Koslov to seven. Challenge the exerted opposing Pete to prove seven damage. Pass to expire all bonuses and inspect both logs.",
  playerOne: { play: [koslovImposingEnforcer, { card: peteSuaveShowoff, exerted: true }], deck },
  playerTwo: {
    play: [
      miriamMendelsohnFrontrowFan,
      miriamMendelsohnFrontrowFan,
      miriamMendelsohnFrontrowFan,
      miriamMendelsohnFrontrowFan,
      koslovImposingEnforcer,
    ],
    deck,
  },
});

export const set14AuditMiriamSupportFixture = createFixture({
  id: "set14-audit-miriam-support",
  name: "Hyperia audit: Miriam Support",
  skipPreGame: true,
  seed: "set14-audit-miriam-support",
  description: "Quest and accept or decline Support; bonus ends with the turn.",
  playerOne: {
    play: [miriamMendelsohnFrontrowFan, miriamMendelsohnFrontrowFan, koslovImposingEnforcer],
    deck,
  },
  playerTwo: { play: [koslovImposingEnforcer], deck },
});

export const set14AuditPriyaPlayerTwoFixture = createFixture({
  id: "set14-audit-priya-player-two",
  name: "Hyperia audit: Priya Player Two combined reductions",
  skipPreGame: true,
  seed: "set14-audit-priya-player-two",
  description:
    "Pass to Player Two. Play two exact Priya copies and accept both BACK OFF! effects on the opposing Koslov: strength four to two to zero. Play the third copy and choose herself. Quest Pete as setup, then pass. Player One Koslov challenges Pete with the combined reductions still active: zero damage to Pete and one return damage. Pass to Player Two; both Koslov reductions and the self reduction must expire at this owner's next start. Check both logs and private hand isolation.",
  playerOne: { play: [koslovImposingEnforcer], deck },
  playerTwo: {
    hand: [priyaMangalImmovableFan, priyaMangalImmovableFan, priyaMangalImmovableFan],
    play: [peteSuaveShowoff],
    inkwell: 6,
    deck,
  },
});

export const set14AuditPriyaDurationFixture = createFixture({
  id: "set14-audit-priya-duration",
  name: "Hyperia audit: Priya duration",
  skipPreGame: true,
  seed: "set14-audit-priya-duration",
  description:
    "Accept one reduction and decline another; reduction lasts through the opposing turn.",
  playerOne: { hand: [priyaMangalImmovableFan, priyaMangalImmovableFan], inkwell: 4, deck },
  playerTwo: { play: [koslovImposingEnforcer], deck },
});

export const set14AuditYaxFixture = createFixture({
  id: "set14-audit-yax",
  name: "Hyperia audit: Yax",
  skipPreGame: true,
  seed: "set14-audit-yax",
  description: "Vanilla paid entry Fresh Ink quest combat inkability and next-turn quest.",
  playerOne: {
    hand: [yaxConcertGoer, yaxConcertGoer, yaxConcertGoer],
    play: [
      { card: yaxConcertGoer, isDrying: false },
      { card: yaxConcertGoer, isDrying: false },
    ],
    inkwell: 7,
    deck,
  },
  playerTwo: { play: [{ card: yaxConcertGoer, exerted: true }], deck },
});

export const set14AuditJudyPlayerTwoFixture = createFixture({
  id: "set14-audit-judy-player-two",
  name: "Hyperia audit: Judy Player Two healing and undamaged board",
  skipPreGame: true,
  seed: "set14-audit-judy-player-two",
  description:
    "Pass to Player Two. Play the first Judy and remove two damage from the opposing Koslov. Play the second and remove only the one existing damage from the own Pete. Play the third when every character is undamaged; resolve without fabricated healing or a stuck choice. Inspect exact named healing and completion logs in both views and private hand isolation.",
  playerOne: { play: [{ card: koslovImposingEnforcer, damage: 2 }], deck },
  playerTwo: {
    hand: [judyHoppsHelpfulOfficer, judyHoppsHelpfulOfficer, judyHoppsHelpfulOfficer],
    play: [{ card: peteSuaveShowoff, damage: 1 }, fruFruVipGuest],
    inkwell: 3,
    deck,
  },
});

export const set14AuditJudyHealingFixture = createFixture({
  id: "set14-audit-judy-healing",
  name: "Hyperia audit: Judy healing",
  skipPreGame: true,
  seed: "set14-audit-judy-healing",
  description: "Choose zero healing then heal the own target with only one damage.",
  playerOne: {
    hand: [judyHoppsHelpfulOfficer, judyHoppsHelpfulOfficer],
    play: [{ card: yaxConcertGoer, damage: 1 }],
    inkwell: 2,
    deck,
  },
  playerTwo: { play: [{ card: yaxConcertGoer, damage: 3 }], deck },
});

export const set14AuditMiguelPlayerTwoFixture = createFixture({
  id: "set14-audit-miguel-player-two",
  name: "Hyperia audit: Miguel Player Two Sing Together",
  skipPreGame: true,
  seed: "set14-audit-miguel-player-two",
  description:
    "Pass to Player Two. Sing Under the Sea with the two Koslovs only: no Crowd Pleaser reward. Pass through Player One to the next Player Two turn. Sing the second Under the Sea with both exact Miguel copies and one Koslov: each participating Miguel gains one lore, for two total; the opposing Miguel gives no reward and the song resolves with no eligible opposing characters. On the next own turn sing One Jump Ahead with one Miguel for one more Crowd Pleaser lore. Check ink preservation, exact singers, song discard and both logs.",
  playerOne: { play: [miguelRiveraPromisingMusician], deck: [...deck, ...deck] },
  playerTwo: {
    hand: [underTheSea, underTheSea, oneJumpAhead],
    play: [
      miguelRiveraPromisingMusician,
      miguelRiveraPromisingMusician,
      koslovImposingEnforcer,
      koslovImposingEnforcer,
    ],
    deck: [...deck, ...deck],
  },
});

export const set14AuditMiguelSingingFixture = createFixture({
  id: "set14-audit-miguel-singing",
  name: "Hyperia audit: Miguel singing",
  skipPreGame: true,
  seed: "set14-audit-miguel-singing",
  description:
    "Paid song and another singer give no Crowd Pleaser; Miguel singing grants one lore each turn.",
  playerOne: {
    hand: [oneJumpAhead, oneJumpAhead, oneJumpAhead, oneJumpAhead],
    play: [miguelRiveraPromisingMusician, koslovImposingEnforcer],
    inkwell: 2,
    deck: [...deck, ...deck],
  },
  playerTwo: { play: [miguelRiveraPromisingMusician], deck },
});

export const set14AuditNickHarbormasterPlayerTwoFixture = createFixture({
  id: "set14-audit-nick-harbormaster-player-two",
  name: "Hyperia audit: Nick Harbormaster Player Two",
  skipPreGame: true,
  seed: "set14-audit-nick-harbormaster-player-two",
  description:
    "Pass to Player Two. Quest the existing Harbormaster and decline Restricted Route. Quest the damaged Providing Backup and decline Support. Shift one Harbormaster onto that exerted base: retain1 damage and block questing. Play the other Providing Backup, then Shift the other Harbormaster onto the fresh base: retain drying and block questing. After the next own start, quest the damaged shifted Nick and give opposing Koslov Adventurous. Quest the other shifted Nick and choose itself. Player Two can pass with that self target exerted. Player One Koslov cannot challenge or pass while able to quest; quest it, then pass. Both targets lose Adventurous at Player Two next start. Check exact undercards, four-ink Shift payments and both public logs.",
  playerOne: {
    play: [koslovImposingEnforcer, { card: peteSuaveShowoff, exerted: true }],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    hand: [
      nickWildeInquisitiveHarbormaster,
      nickWildeInquisitiveHarbormaster,
      nickWildeProvidingBackup,
    ],
    play: [nickWildeInquisitiveHarbormaster, { card: nickWildeProvidingBackup, damage: 1 }],
    inkwell: 10,
    deck: [...deck, ...deck],
  },
});

export const set14AuditNickHarbormasterFixture = createFixture({
  id: "set14-audit-nick-harbormaster",
  name: "Hyperia audit: Nick Harbormaster",
  skipPreGame: true,
  seed: "set14-audit-nick-harbormaster",
  description:
    "Shift4 on damaged dry Nick; quest and give opposing Koslov Adventurous; quest requirement and expiry.",
  playerOne: {
    hand: [nickWildeInquisitiveHarbormaster],
    play: [{ card: nickWildeProvidingBackup, isDrying: false, damage: 1 }],
    inkwell: 4,
    deck,
  },
  playerTwo: { play: [koslovImposingEnforcer], deck },
});

export const set14AuditPjPetePlayerTwoFixture = createFixture({
  id: "set14-audit-pj-pete-player-two",
  name: "Hyperia audit: P.J. Pete Player Two",
  skipPreGame: true,
  seed: "set14-audit-pj-pete-player-two",
  description:
    "Pass to Player Two. Both P.J. Pete copies have3 lore with two own Gazelle Singers. Quest one for3, banish one own Gazelle with Dragon Fire and verify both bonuses remain. Quest the second Pete for3, then banish the last own Gazelle: both Pete lore values immediately become2 while Player One Pete stays3 with the opposing Gazelle. On Player Two next turn quest both for2 each: total10 lore. Both logs must show actual3/3/2/2 quest and exact Singer banishment. No stat-change log is required.",
  playerOne: { play: [pjPeteDevotedFan, gazellePopDiva], deck: [...deck, ...deck] },
  playerTwo: {
    play: [pjPeteDevotedFan, pjPeteDevotedFan, gazellePopDiva, gazellePopDiva],
    hand: [dragonFire, dragonFire],
    inkwell: 10,
    deck: [...deck, ...deck],
  },
});

export const set14AuditPjPeteFixture = createFixture({
  id: "set14-audit-pj-pete",
  name: "Hyperia audit: P.J. Pete",
  skipPreGame: true,
  seed: "set14-audit-pj-pete",
  description:
    "Quest with Singer bonus; remove the friendly Singer and verify the live lore bonus ends.",
  playerOne: { hand: [dragonFire], play: [pjPeteDevotedFan, gazellePopDiva], inkwell: 5, deck },
  playerTwo: { play: [gazellePopDiva], deck },
});

export const set14AuditManchasPlayerTwoFixture = createFixture({
  id: "set14-audit-manchas-player-two",
  name: "Hyperia audit: Manchas Player Two",
  skipPreGame: true,
  seed: "set14-audit-manchas-player-two",
  description:
    "Pass to Player Two. Quest one Manchas to discount Koslov4to3. Play Fire the Cannons for1 on opposing Koslov: the action keeps its full price and does not consume the character discount. Play first own Koslov for3, consuming it; second Koslov is full4 and cannot be played with0 ink. At the next own turn quest both Manchas copies: second Koslov costs2. Pass without using either discount. Player One hand Koslov is full4. At Player Two next turn the remaining Koslov is also full4; play it for4 and inspect both named ability/action/character logs.",
  playerOne: {
    hand: [koslovImposingEnforcer],
    play: [koslovImposingEnforcer],
    inkwell: 4,
    deck: [...deck, ...deck],
  },
  playerTwo: {
    hand: [koslovImposingEnforcer, koslovImposingEnforcer, fireTheCannons],
    play: [mrManchasServiceWithASmile, mrManchasServiceWithASmile],
    inkwell: 4,
    deck: [...deck, ...deck],
  },
});

export const set14AuditManchasDiscountFixture = createFixture({
  id: "set14-audit-manchas-discount",
  name: "Hyperia audit: Manchas discount",
  skipPreGame: true,
  seed: "set14-audit-manchas-discount",
  description:
    "Quest twice; two discounts apply only to the next character and leave the next copy unaffordable.",
  playerOne: {
    hand: [koslovImposingEnforcer, koslovImposingEnforcer],
    play: [mrManchasServiceWithASmile, mrManchasServiceWithASmile],
    inkwell: 5,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditNickToyDriveFixture = createFixture({
  id: "set14-audit-nick-toy-drive",
  name: "Hyperia audit: Nick Toy Drive",
  skipPreGame: true,
  seed: "set14-audit-nick-toy-drive",
  description:
    "Quest Nick and Support Koslov; play two Fru Fru; end-turn draw once and Support expires.",
  playerOne: {
    hand: [fruFruVipGuest, fruFruVipGuest],
    play: [nickWildeToyDriveOfficer, koslovImposingEnforcer],
    inkwell: 2,
    deck,
  },
  playerTwo: { play: [nickWildeToyDriveOfficer], deck },
});

export const set14AuditNickToyDrivePlayerTwoFixture = createFixture({
  id: "set14-audit-nick-toy-drive-player-two",
  name: "Hyperia audit: Nick Toy Drive Player Two",
  skipPreGame: true,
  seed: "set14-audit-nick-toy-drive-player-two",
  description:
    "Decline Support; one character plus an action does not draw. Next turn play two characters for Community Outreach; then verify the count resets.",
  playerOne: { play: [nickWildeToyDriveOfficer, koslovImposingEnforcer], deck },
  playerTwo: {
    hand: [fruFruVipGuest, fruFruVipGuest, fruFruVipGuest, fireTheCannons],
    play: [nickWildeToyDriveOfficer, koslovImposingEnforcer],
    inkwell: 4,
    deck,
  },
});

export const set14AuditClawhauserFixture = createFixture({
  id: "set14-audit-clawhauser",
  name: "Hyperia audit: Clawhauser",
  skipPreGame: true,
  seed: "set14-audit-clawhauser",
  description: "Play another character first, then choose ready or exerted Bodyguard entry.",
  playerOne: {
    hand: [fruFruVipGuest, clawhauserSafetyOfficer, clawhauserSafetyOfficer],
    play: [{ card: fruFruVipGuest, exerted: true }],
    inkwell: 7,
    deck,
  },
  playerTwo: {
    play: [koslovImposingEnforcer, koslovImposingEnforcer, koslovImposingEnforcer],
    deck,
  },
});

export const set14AuditClawhauserPlayerTwoFixture = createFixture({
  id: "set14-audit-clawhauser-player-two",
  name: "Hyperia audit: Clawhauser Player Two",
  skipPreGame: true,
  seed: "set14-audit-clawhauser-player-two",
  description:
    "Opposing character play and own action do not unlock Clawhauser. Play Fru Fru, choose ready/exerted entry, then verify next-turn reset.",
  playerOne: {
    hand: [fruFruVipGuest],
    play: [koslovImposingEnforcer, koslovImposingEnforcer, koslovImposingEnforcer],
    inkwell: 1,
    deck,
  },
  playerTwo: {
    hand: [
      fireTheCannons,
      fruFruVipGuest,
      clawhauserSafetyOfficer,
      clawhauserSafetyOfficer,
      clawhauserSafetyOfficer,
    ],
    play: [{ card: fruFruVipGuest, exerted: true }],
    inkwell: 8,
    deck,
  },
});

export const set14AuditElisaFixture = createFixture({
  id: "set14-audit-elisa",
  name: "Hyperia audit: Elisa Maza",
  skipPreGame: true,
  seed: "set14-audit-elisa",
  description:
    "Reveal the opposing hand and choose a non-character discard with another Detective in play.",
  playerOne: {
    hand: [elisaMazaHardworkingDetective],
    play: [clawhauserSafetyOfficer],
    inkwell: 4,
    deck,
  },
  playerTwo: { hand: [fruFruVipGuest, dragonFire, oneJumpAhead], deck },
});

export const set14AuditElisaPlayerTwoFixture = createFixture({
  id: "set14-audit-elisa-player-two",
  name: "Hyperia audit: Elisa Player Two",
  skipPreGame: true,
  seed: "set14-audit-elisa-player-two",
  description:
    "Player Two chooses between two non-characters; repeat for the last non-character, then complete the character-only reveal without a discard.",
  playerOne: { hand: [fruFruVipGuest, dragonFire, oneJumpAhead], deck },
  playerTwo: {
    hand: [
      elisaMazaHardworkingDetective,
      elisaMazaHardworkingDetective,
      elisaMazaHardworkingDetective,
    ],
    play: [clawhauserSafetyOfficer],
    inkwell: 12,
    deck,
  },
});

export const set14AuditElisaEmptyPlayerTwoFixture = createFixture({
  id: "set14-audit-elisa-empty-player-two",
  name: "Hyperia audit: Elisa negative and empty hand",
  skipPreGame: true,
  seed: "set14-audit-elisa-empty-player-two",
  description:
    "An opposing Detective and Elisa herself do not qualify. The second own Elisa qualifies and completes against an empty hand.",
  playerOne: { play: [clawhauserSafetyOfficer], deck },
  playerTwo: {
    hand: [elisaMazaHardworkingDetective, elisaMazaHardworkingDetective],
    inkwell: 8,
    deck,
  },
});

export const set14AuditPowerlineRecoveryFixture = createFixture({
  id: "set14-audit-powerline-recovery",
  name: "Hyperia audit: Powerline",
  skipPreGame: true,
  seed: "set14-audit-powerline-recovery",
  description: "Singer 9, once-per-turn Singer recovery, and live Perfect Harmony lore.",
  playerOne: {
    hand: [oneJumpAhead, oneJumpAhead, dragonFire],
    play: [powerlineMegastar, maxGoofMusicLover, gazellePopDiva],
    discard: [nickWildeToyDriveOfficer, gazellePopDiva, maxGoofMusicLover],
    inkwell: 9,
    deck,
  },
  playerTwo: { play: [gazellePopDiva], deck },
});

export const set14AuditLionheartMayorFixture = createFixture({
  id: "set14-audit-lionheart-mayor",
  name: "Hyperia audit: Lionheart Incumbent Mayor",
  skipPreGame: true,
  seed: "set14-audit-lionheart-mayor",
  description: "Choose up to two characters for temporary lore; quest and verify end-turn expiry.",
  playerOne: {
    hand: [lionheartIncumbentMayor, lionheartIncumbentMayor],
    play: [fruFruVipGuest, koslovImposingEnforcer],
    inkwell: 12,
    deck,
  },
  playerTwo: { play: [koslovImposingEnforcer], deck },
});

export const set14AuditLionheartMayorPlayerTwoFixture = createFixture({
  id: "set14-audit-lionheart-mayor-player-two",
  name: "Hyperia audit: Lionheart Mayor Player Two",
  skipPreGame: true,
  seed: "set14-audit-lionheart-mayor-player-two",
  description:
    "Grant lore to self and an opponent, stack a second grant on the first copy and Fru Fru, then verify expiry and exerted Bodyguard protection.",
  playerOne: {
    play: [
      koslovImposingEnforcer,
      koslovImposingEnforcer,
      koslovImposingEnforcer,
      koslovImposingEnforcer,
    ],
    deck,
  },
  playerTwo: {
    hand: [lionheartIncumbentMayor, lionheartIncumbentMayor],
    play: [fruFruVipGuest],
    inkwell: 12,
    deck,
  },
});

export const set14AuditAuroraSungFixture = createFixture({
  id: "set14-audit-aurora-sung",
  name: "Hyperia audit: Aurora sung-song recovery",
  skipPreGame: true,
  seed: "set14-audit-aurora-sung",
  description:
    "Sing before playing Aurora; recover the current-turn song and gain one lore at turn end.",
  playerOne: {
    hand: [oneJumpAhead, auroraDelightfulMusician],
    play: [koslovImposingEnforcer],
    discard: [oneJumpAhead, dragonFire],
    inkwell: 3,
    deck: [...deck, ...deck],
  },
  playerTwo: { play: [auroraDelightfulMusician], deck },
});

export const set14AuditRussellOrderingFixture = createFixture({
  id: "set14-audit-russell-ordering",
  name: "Hyperia audit: Russell bottom ordering",
  skipPreGame: true,
  seed: "set14-audit-russell-ordering",
  description: "Reveal two non-characters publicly and choose their bottom order.",
  playerOne: {
    play: [russellFindingAdventure],
    deck: [...deck, dragonFire, oneJumpAhead],
    inkwell: 2,
  },
  playerTwo: { deck },
});

export const set14AuditMiguelStreetFixture = createFixture({
  id: "set14-audit-miguel-street",
  name: "Hyperia audit: Miguel Street Musician",
  skipPreGame: true,
  seed: "set14-audit-miguel-street",
  description:
    "Play a song to enable Singer 3 and lore; Aurora returns the last song to remove both bonuses.",
  playerOne: {
    hand: [oneJumpAhead, oneJumpAhead, auroraDelightfulMusician],
    play: [miguelRiveraStreetMusician, miguelRiveraStreetMusician],
    inkwell: 5,
    deck: [...deck, ...deck],
  },
  playerTwo: { discard: [oneJumpAhead], deck },
});

export const set14AuditGoofyBandFixture = createFixture({
  id: "set14-audit-goofy-band",
  name: "Hyperia audit: Goofy Knows the Band",
  skipPreGame: true,
  seed: "set14-audit-goofy-band",
  description:
    "Play Goofy without a friendly Singer, then play a song to enable Miguel's Singer and play the second Goofy to draw exactly one card.",
  playerOne: {
    hand: [goofyKnowsTheBand, oneJumpAhead, goofyKnowsTheBand],
    play: [miguelRiveraStreetMusician],
    inkwell: 10,
    deck: [...deck, ...deck],
  },
  playerTwo: { play: [gazellePopDiva], deck },
});

export const set14AuditMickeyBestPlayerTwoFixture = createFixture({
  id: "set14-audit-mickey-best-player-two",
  name: "Hyperia audit: Mickey Best in Town Player Two",
  skipPreGame: true,
  seed: "set14-audit-mickey-best-player-two",
  description:
    "Pass with a fresh ready Mickey for no reward. Player Two plays the third Mickey, must quest both dry copies, then resolve two HOT DOG rewards; the fresh third copy gives none. Next opposing turn only Player One's Mickey rewards.",
  playerOne: {
    play: [{ card: mickeyMouseBestInTown, isDrying: true }],
    inkDrops: 2,
    deck,
  },
  playerTwo: {
    play: [mickeyMouseBestInTown, mickeyMouseBestInTown],
    hand: [mickeyMouseBestInTown],
    inkwell: 1,
    inkDrops: 3,
    deck,
  },
});

export const set14AuditMickeyBaseFixture = createFixture({
  id: "set14-audit-mickey-base",
  name: "Hyperia audit: Mickey Best in Town",
  skipPreGame: true,
  seed: "set14-audit-mickey-base",
  description:
    "Challenge is forbidden and quest is required; each player gains one end-turn drop. Player Two spends their drop to play Fru Fru; opposing turn gives no extra drop.",
  playerOne: { play: [mickeyMouseBestInTown], deck },
  playerTwo: {
    hand: [fruFruVipGuest],
    play: [{ card: koslovImposingEnforcer, exerted: true }],
    deck,
  },
});

export const set14AuditJudyVigilantFixture = createFixture({
  id: "set14-audit-judy-vigilant",
  name: "Hyperia audit: Judy Always Vigilant",
  skipPreGame: true,
  seed: "set14-audit-judy-vigilant",
  description:
    "Normal play without another character gives no choice. Play Fru Fru then Shift the second Judy for two ink onto the damaged base. Banish Yax; strength-four Koslov must not qualify.",
  playerOne: {
    hand: [judyHoppsAlwaysVigilant, fruFruVipGuest, judyHoppsAlwaysVigilant],
    play: [{ card: judyHoppsDayCampInstructor, damage: 1 }],
    inkwell: 7,
    deck,
  },
  playerTwo: { play: [yaxConcertGoer, koslovImposingEnforcer], deck },
});

export const set14AuditNickBackupFixture = createFixture({
  id: "set14-audit-nick-backup",
  name: "Hyperia audit: Nick Providing Backup",
  skipPreGame: true,
  seed: "set14-audit-nick-backup",
  description:
    "An opposing Detective does not give Support. Play Judy to enable Support, quest Nick and give Koslov +3 strength. Banish your Judy to remove Support immediately; the granted strength persists until turn end.",
  playerOne: {
    hand: [judyHoppsHelpfulOfficer, dragonFire],
    play: [nickWildeProvidingBackup, koslovImposingEnforcer],
    inkwell: 6,
    deck,
  },
  playerTwo: { play: [judyHoppsHelpfulOfficer, koslovImposingEnforcer], deck },
});

export const set14AuditMiguelAccomplishedFixture = createFixture({
  id: "set14-audit-miguel-accomplished",
  name: "Hyperia audit: Miguel Accomplished Musician",
  skipPreGame: true,
  seed: "set14-audit-miguel-accomplished",
  description:
    "Play Miguel normally for five and return Fru Fru; Shift the second copy for three onto damaged Street Musician and return Judy. The song and opposing discard cannot return. The shifted dry copy retains damage and may quest.",
  playerOne: {
    hand: [miguelRiveraAccomplishedMusician, miguelRiveraAccomplishedMusician],
    play: [{ card: miguelRiveraStreetMusician, damage: 1 }],
    discard: [fruFruVipGuest, judyHoppsHelpfulOfficer, oneJumpAhead],
    inkwell: 8,
    deck,
  },
  playerTwo: { discard: [koslovImposingEnforcer], deck },
});

export const set14AuditShedLoadFixture = createFixture({
  id: "set14-audit-shed-load",
  name: "Hyperia audit: Shed Your Weary Load",
  skipPreGame: true,
  seed: "set14-audit-shed-load",
  description:
    "Pay five to reveal the opponent's five-card hand and discard action/item/location; both characters remain public. Sing the second copy with Max without spending ink; the character-only hand remains unchanged and your own Dragon Fire stays in hand.",
  playerOne: {
    hand: [shedYourWearyLoad, shedYourWearyLoad, dragonFire],
    play: [maxGoofMusicLover],
    inkwell: 5,
    deck,
  },
  playerTwo: {
    hand: [
      fruFruVipGuest,
      judyHoppsHelpfulOfficer,
      dragonFire,
      riveraFamilyPhoto,
      hyperiaCityExpress,
    ],
    deck,
  },
});

export const set14AuditNeverApartFixture = createFixture({
  id: "set14-audit-never-apart",
  name: "Hyperia audit: Never Too Far Apart",
  skipPreGame: true,
  seed: "set14-audit-never-apart",
  description:
    "Pay nine, choose up to three Singer characters from the top nine, and arrange the remaining cards at the bottom. Check public selected cards and private unselected cards in both views.",
  playerOne: {
    hand: [neverTooFarApart],
    inkwell: 9,
    deck: [
      dragonFire,
      fruFruVipGuest,
      maxGoofMusicLover,
      gazellePopDiva,
      judyHoppsHelpfulOfficer,
      oneJumpAhead,
      miguelRiveraStreetMusician,
      shedYourWearyLoad,
      koslovImposingEnforcer,
      pjPeteDevotedFan,
    ],
  },
  playerTwo: { deck },
});

export const set14AuditNeverApartSungFixture = createFixture({
  id: "set14-audit-never-apart-sung",
  name: "Hyperia audit: Never Too Far Apart sung",
  skipPreGame: true,
  seed: "set14-audit-never-apart-sung",
  description:
    "Sing Together with Max and Gazelle for exactly nine without ink. Select three of four Singer cards, reject a fourth, then order the six remaining cards. Reload to select zero.",
  playerOne: {
    hand: [neverTooFarApart],
    play: [maxGoofMusicLover, gazellePopDiva],
    deck: [
      fruFruVipGuest,
      judyHoppsHelpfulOfficer,
      oneJumpAhead,
      miguelRiveraStreetMusician,
      shedYourWearyLoad,
      maxGoofMusicLover,
      gazellePopDiva,
      arielSpectacularSinger,
      cinderellaGentleAndKind,
    ],
  },
  playerTwo: { deck },
});

export const set14AuditNeverApartShortFixture = createFixture({
  id: "set14-audit-never-apart-short",
  name: "Hyperia audit: Never Too Far Apart short deck",
  skipPreGame: true,
  seed: "set14-audit-never-apart-short",
  description:
    "Pay nine and resolve the top-nine effect with a short deck. Check hand, discard, deck and pending choices.",
  playerOne: {
    hand: [neverTooFarApart],
    inkwell: 9,
    deck: [fruFruVipGuest, gazellePopDiva, oneJumpAhead],
  },
  playerTwo: { deck },
});

export const set14AuditNeverApartEmptyFixture = createFixture({
  id: "set14-audit-never-apart-empty",
  name: "Hyperia audit: Never Too Far Apart empty deck",
  skipPreGame: true,
  seed: "set14-audit-never-apart-empty",
  description:
    "Pay nine and resolve the top-nine effect with a empty deck. Check hand, discard, deck and pending choices.",
  playerOne: { hand: [neverTooFarApart], inkwell: 9, deck: [] },
  playerTwo: { deck },
});

export const set14AuditGuitarEntryFixture = createFixture({
  id: "set14-audit-guitar-entry",
  name: "Hyperia audit: Ancestral Guitar entry",
  skipPreGame: true,
  seed: "set14-audit-guitar-entry",
  description:
    "Pay two for Guitar and draw Fru Fru. Immediately pay one and exert Guitar to grant Archimedes Singer and +2 singing cost; sing Never Gonna Let You Cry without ink. Check the private draw log and opponent view.",
  playerOne: {
    hand: [ancestralGuitar, neverGonnaLetYouCry],
    play: [archimedesHasHadEnough],
    inkwell: 3,
    deck: [
      dragonFire,
      oneJumpAhead,
      koslovImposingEnforcer,
      judyHoppsHelpfulOfficer,
      pjPeteDevotedFan,
      fruFruVipGuest,
    ],
  },
  playerTwo: { deck },
});

export const set14AuditOwenReturnFixture = createFixture({
  id: "set14-audit-owen-return",
  name: "Hyperia audit: Owen returns",
  description:
    "Play Owen to return a cheap character, item or occupied location. Cost-three and cost-four targets are excluded. Later copies can decline.",
  skipPreGame: true,
  seed: "set14-audit-owen-return",
  playerOne: {
    hand: [
      owenBurnettXanatossAssistant,
      owenBurnettXanatossAssistant,
      owenBurnettXanatossAssistant,
    ],
    play: [
      bellesHouseMauricesWorkshop,
      { card: fruFruVipGuest, atLocation: bellesHouseMauricesWorkshop },
      ancestralGuitar,
      portAuthorityCenterHub,
    ],
    deck,
    inkwell: 9,
  },
  playerTwo: { play: [priyaMangalImmovableFan, gazellePopDiva], deck },
});

export const set14AuditAmethystVanillaFixture = createFixture({
  id: "set14-audit-amethyst-vanilla",
  name: "Hyperia audit: Scuttle and Xanatos",
  description: "Paid vanilla entry, Fresh Ink, questing and printed combat damage.",
  skipPreGame: true,
  seed: "set14-audit-amethyst-vanilla",
  playerOne: {
    hand: [
      scuttleDirectingTraffic,
      davidXanatosArcaneIndustrialist,
      scuttleDirectingTraffic,
      davidXanatosArcaneIndustrialist,
    ],
    play: [
      { card: scuttleDirectingTraffic, isDrying: false },
      { card: davidXanatosArcaneIndustrialist, isDrying: false },
    ],
    inkwell: 7,
    deck,
  },
  playerTwo: { play: [{ card: yaxConcertGoer, exerted: true }], deck },
});

export const set14AuditLexingtonReadyFixture = createFixture({
  id: "set14-audit-lexington-ready",
  name: "Hyperia audit: Lexington ready limit",
  description:
    "First Fan the Flames leaves three hand cards and cannot ready Lexington. Second leaves two and can ready it. Challenge Tinker Bell and pass twice to check Ready before Draw, then quest and pass twice again to check the three-card block.",
  skipPreGame: true,
  seed: "set14-audit-lexington-ready",
  playerOne: {
    hand: [fanTheFlames, fanTheFlames, fruFruVipGuest, scuttleDirectingTraffic],
    play: [{ card: lexingtonFearlessFlier, exerted: true }],
    inkwell: 4,
    deck,
  },
  playerTwo: { play: [{ card: tinkerBellCuriousFairy, exerted: true }], deck },
});

export const set14AuditMerlinDropFixture = createFixture({
  id: "set14-audit-merlin-drop",
  name: "Hyperia audit: Merlin ink drop",
  description:
    "Play Merlin with only an opposing Arthur: no drop. Play your Arthur, decline its payment, then play the second Merlin. Spend its drop to play Fru Fru after the eight ink is spent.",
  skipPreGame: true,
  seed: "set14-audit-merlin-drop",
  playerOne: {
    hand: [merlinBaubleExpert, arthurNoviceBlacksmith, merlinBaubleExpert, fruFruVipGuest],
    inkwell: 8,
    deck,
  },
  playerTwo: { play: [arthurNoviceBlacksmith], deck },
});

export const set14AuditMerlinPlayerTwoFixture = createFixture({
  id: "set14-audit-merlin-player-two",
  name: "Hyperia audit: Merlin player-two Arthur condition",
  description:
    "Pass to player two. Play Merlin while Arthur is only opposing: no drop. Play your Arthur and decline Careful Crafting, then play the second Merlin: gain exactly one drop. Spend that drop on Fru Fru with no ready ink and inspect both logs.",
  skipPreGame: true,
  seed: "set14-audit-merlin-player-two",
  playerOne: { play: [arthurNoviceBlacksmith], deck },
  playerTwo: {
    hand: [merlinBaubleExpert, arthurNoviceBlacksmith, merlinBaubleExpert, fruFruVipGuest],
    inkwell: 8,
    deck,
  },
});

export const set14AuditPepitaChallengeFixture = createFixture({
  id: "set14-audit-pepita-challenge",
  name: "Hyperia audit: Pepita Challenger",
  description:
    "Challenge Tinker Bell with one Pepita for four damage. Quest with the other for one lore, then pass and challenge it with Scuttle: Pepita deals only its base two strength while defending.",
  skipPreGame: true,
  seed: "set14-audit-pepita-challenge",
  playerOne: { play: [pepitaWatchfulAlebrije, pepitaWatchfulAlebrije], deck },
  playerTwo: {
    play: [{ card: tinkerBellCuriousFairy, exerted: true }, scuttleDirectingTraffic],
    deck,
  },
});

export const set14AuditPepitaPlayerTwoFixture = createFixture({
  id: "set14-audit-pepita-player-two",
  name: "Hyperia audit: Pepita player-two Challenger",
  description:
    "Pass to player two and challenge the exerted Tinker Bell with Pepita. Challenger adds two for exactly four damage; Pepita returns to two strength after the challenge. Inspect both public logs.",
  skipPreGame: true,
  seed: "set14-audit-pepita-player-two",
  playerOne: { play: [{ card: tinkerBellCuriousFairy, exerted: true }], deck },
  playerTwo: { play: [pepitaWatchfulAlebrije], deck },
});

export const set14AuditArchimedesEvasiveFixture = createFixture({
  id: "set14-audit-archimedes-evasive",
  name: "Hyperia audit: Archimedes Evasive",
  description:
    "Quest with Archimedes for two lore. Pass and switch to player two: Scuttle cannot challenge the Evasive defender; Lexington can and takes two retaliation damage.",
  skipPreGame: true,
  seed: "set14-audit-archimedes-evasive",
  playerOne: { play: [archimedesHasHadEnough], deck },
  playerTwo: { play: [scuttleDirectingTraffic, lexingtonFearlessFlier], deck },
});

export const set14AuditArchimedesPlayerTwoFixture = createFixture({
  id: "set14-audit-archimedes-player-two",
  name: "Hyperia audit: Archimedes player-two Evasive",
  description:
    "Player two's exerted Archimedes cannot be challenged by Scuttle. Evasive Lexington can challenge it, dealing three damage and taking two retaliation damage. Inspect both public logs.",
  skipPreGame: true,
  seed: "set14-audit-archimedes-player-two",
  playerOne: { play: [scuttleDirectingTraffic, lexingtonFearlessFlier], deck },
  playerTwo: { play: [{ card: archimedesHasHadEnough, exerted: true }], deck },
});

export const set14AuditVictoriaPlayerTwoFixture = createFixture({
  id: "set14-audit-victoria-player-two",
  name: "Hyperia audit: Victoria player-two timing",
  description:
    "Quest both characters and pass. Switch to player two, play Victoria and choose Scuttle, then banish Victoria with Dragon Fire. Pass: only Fru Fru readies. Pass both players again: Scuttle readies on its following turn.",
  skipPreGame: true,
  seed: "set14-audit-victoria-player-two",
  playerOne: { play: [scuttleDirectingTraffic, fruFruVipGuest], deck },
  playerTwo: { hand: [taVictoriaDisapprovingAncestor, dragonFire], inkwell: 11, deck },
});

export const set14AuditDanteChallengerFixture = createFixture({
  id: "set14-audit-dante-challenger",
  name: "Hyperia audit: Dante Challenger",
  description:
    "Play Dante and choose Pepita: Challenger stacks to four. Challenge Tinker Bell for six damage, then pass: Pepita keeps only its printed Challenger two.",
  skipPreGame: true,
  seed: "set14-audit-dante-challenger",
  playerOne: { hand: [danteEnthusiasticStray], play: [pepitaWatchfulAlebrije], inkwell: 2, deck },
  playerTwo: { play: [{ card: tinkerBellCuriousFairy, exerted: true }], deck },
});

export const set14AuditDantePlayerTwoFixture = createFixture({
  id: "set14-audit-dante-player-two",
  name: "Hyperia audit: Dante player-two Challenger targets",
  description:
    "Pass to player two. Play three Dantes, granting Challenger to the first Dante itself, opposing Scuttle, and friendly Pepita. Pepita stacks to Challenger four and deals six to Tinker Bell. Pass: both temporary-only grants disappear and Pepita keeps printed Challenger two.",
  skipPreGame: true,
  seed: "set14-audit-dante-player-two",
  playerOne: {
    play: [{ card: tinkerBellCuriousFairy, exerted: true }, scuttleDirectingTraffic],
    deck,
  },
  playerTwo: {
    hand: [danteEnthusiasticStray, danteEnthusiasticStray, danteEnthusiasticStray],
    play: [pepitaWatchfulAlebrije],
    inkwell: 6,
    deck,
  },
});

export const set14AuditCocoMillBatchesFixture = createFixture({
  id: "set14-audit-coco-mill-batches",
  name: "Hyperia audit: Coco mill batches",
  description:
    "Activate each Rivera Family Photo and select milling. Each two-card batch adds one lore to Coco. Quest for three lore, then pass: Coco returns to printed lore one.",
  skipPreGame: true,
  seed: "set14-audit-coco-mill-batches",
  playerOne: {
    play: [mamCocoVisitingThePark, riveraFamilyPhoto, riveraFamilyPhoto],
    inkwell: 2,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditTinkerVanillaFixture = createFixture({
  id: "set14-audit-tinker-vanilla",
  name: "Hyperia audit: Tinker Bell vanilla",
  description:
    "Challenge Scuttle with one ready Tinker Bell: zero damage dealt and one taken. Quest with the other for one lore. Pay one ink for the hand copy and verify Fresh Ink, then ink the remaining copy.",
  skipPreGame: true,
  seed: "set14-audit-tinker-vanilla",
  playerOne: {
    play: [tinkerBellCuriousFairy, tinkerBellCuriousFairy],
    hand: [tinkerBellCuriousFairy, tinkerBellCuriousFairy],
    inkwell: 1,
    deck,
  },
  playerTwo: { play: [{ card: scuttleDirectingTraffic, exerted: true }], deck },
});

export const set14AuditMimDropsFixture = createFixture({
  id: "set14-audit-mim-drops",
  name: "Hyperia audit: Mim ink drops",
  description:
    "Spend one drop to play Fru Fru: Mim keeps Evasive. Spend the last drop on the other Fru Fru: Mim loses Evasive. Quest with Mim, pass, and challenge it with opposing Scuttle.",
  skipPreGame: true,
  seed: "set14-audit-mim-drops",
  playerOne: {
    play: [madamMimBaubleChaser],
    hand: [fruFruVipGuest, fruFruVipGuest],
    inkDrops: 2,
    deck,
  },
  playerTwo: { play: [scuttleDirectingTraffic], deck },
});

export const set14AuditMimPlayerTwoFixture = createFixture({
  id: "set14-audit-mim-player-two",
  name: "Hyperia audit: Mim player two",
  description:
    "Pass to player two. Spend two drops on Fru Fru, then pay two ink for Khan to restore Evasive. Opposing drops must not keep Mim Evasive when her own drops are empty.",
  skipPreGame: true,
  seed: "set14-audit-mim-player-two",
  playerOne: { inkDrops: 3, deck },
  playerTwo: {
    play: [madamMimBaubleChaser],
    hand: [fruFruVipGuest, fruFruVipGuest, khanTransportDelivery],
    inkDrops: 2,
    inkwell: 2,
    deck,
  },
});

export const set14AuditShadowExertFixture = createFixture({
  id: "set14-audit-shadow-exert",
  name: "Hyperia audit: Shadow exert",
  description:
    "Play Shadow and accept Favorite Trick to exert Scuttle. Play the second Shadow and decline: Fru Fru stays ready. Fresh Ink prevents immediate quests.",
  skipPreGame: true,
  seed: "set14-audit-shadow-exert",
  playerOne: {
    hand: [peterPansShadowElusivePrankster, peterPansShadowElusivePrankster],
    inkwell: 6,
    play: [fruFruVipGuest],
    deck,
  },
  playerTwo: { play: [scuttleDirectingTraffic, fruFruVipGuest], deck },
});

export const set14AuditDanteTrashFixture = createFixture({
  id: "set14-audit-dante-trash",
  name: "Hyperia audit: Dante discard threshold",
  description:
    "Dante starts at one lore with nine discard cards. Play Khan: it becomes card ten and Dante gets two lore. Quest for two.",
  skipPreGame: true,
  seed: "set14-audit-dante-trash",
  playerOne: {
    play: [danteStrangeAndEndearing],
    hand: [khanTransportDelivery],
    discard: Array.from({ length: 9 }, () => fruFruVipGuest),
    inkwell: 2,
    deck,
  },
  playerTwo: { discard: Array.from({ length: 11 }, () => fruFruVipGuest), deck },
});

export const set14AuditFoxRushFixture = createFixture({
  id: "set14-audit-fox-rush",
  name: "Hyperia audit: Fox Rush",
  description:
    "Play Fox for five ink. Fresh Ink blocks Quest but Rush allows Challenge against exerted Tinker Bell. Ready Scuttle is not a legal target. Fox deals five and takes zero.",
  skipPreGame: true,
  seed: "set14-audit-fox-rush",
  playerOne: { hand: [foxXanatosCharismaticOutlaw], inkwell: 5, deck },
  playerTwo: {
    play: [{ card: tinkerBellCuriousFairy, exerted: true }, scuttleDirectingTraffic],
    deck,
  },
});

export const set14AuditBrooklynInkFixture = createFixture({
  id: "set14-audit-brooklyn-ink",
  name: "Hyperia audit: Brooklyn ink ability",
  description:
    "Brooklyn is exerted with Fresh Ink. Activate Wild Ride twice for six ink each, gaining one lore each time. A third activation is unavailable with no ink.",
  skipPreGame: true,
  seed: "set14-audit-brooklyn-ink",
  playerOne: {
    play: [{ card: brooklynFullThrottle, exerted: true, isDrying: true }],
    inkwell: 12,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditImeldaOrderFixture = createFixture({
  id: "set14-audit-imelda-order",
  name: "Hyperia audit: Imelda three-card order",
  description:
    "Play Imelda, choose the three-card return, and order Fru Fru, Priya and Scuttle on the bottom. She stays in play. Play three Khan actions to draw the returned cards in order. Opposing discard cards are excluded.",
  skipPreGame: true,
  seed: "set14-audit-imelda-order",
  playerOne: {
    hand: [
      mamImeldaNononsenseAncestor,
      khanTransportDelivery,
      khanTransportDelivery,
      khanTransportDelivery,
    ],
    discard: [fruFruVipGuest, priyaMangalImmovableFan, scuttleDirectingTraffic],
    inkwell: 10,
    deck: [],
  },
  playerTwo: { discard: [fruFruVipGuest], deck },
});

export const set14AuditMerlinShiftFixture = createFixture({
  id: "set14-audit-merlin-shift",
  name: "Hyperia audit: Merlin Shift drops",
  description:
    "Shift Merlin for five onto ready dry Bauble Expert with one damage. Gain two drops and quest for three immediately. Spend both drops to play Scuttle at zero ready ink.",
  skipPreGame: true,
  seed: "set14-audit-merlin-shift",
  playerOne: {
    hand: [merlinInkDropTinkerer, scuttleDirectingTraffic],
    play: [{ card: merlinBaubleExpert, damage: 1, isDrying: false }],
    inkwell: 5,
    deck,
  },
  playerTwo: { inkDrops: 3, deck },
});

export const set14AuditGoliathLethalFixture = createFixture({
  id: "set14-audit-goliath-lethal",
  name: "Hyperia audit: Goliath lethal damage move",
  description:
    "Discard Fru Fru and choose two damage from exerted Goliath to opposing Mim. Goliath goes from three to one damage and Mim is banished. Scuttle stays undamaged. The second use must be unavailable.",
  skipPreGame: true,
  seed: "set14-audit-goliath-lethal",
  playerOne: {
    play: [{ card: goliathTransformedWarrior, damage: 3, exerted: true }],
    hand: [fruFruVipGuest, priyaMangalImmovableFan],
    deck,
  },
  playerTwo: { play: [madamMimBaubleChaser, scuttleDirectingTraffic], deck },
});

export const set14AuditLoyalDanteCombatFixture = createFixture({
  id: "set14-audit-loyal-dante-combat",
  name: "Hyperia audit: Loyal Dante Evasive",
  description:
    "Pass and switch to player two. Scuttle cannot challenge exerted Evasive Dante. Archimedes can: it deals two and takes six, so only Archimedes is banished.",
  skipPreGame: true,
  seed: "set14-audit-loyal-dante-combat",
  playerOne: { play: [{ card: danteLoyalAlebrije, exerted: true }], deck },
  playerTwo: { play: [scuttleDirectingTraffic, archimedesHasHadEnough], deck },
});

export const set14AuditCuriousMerlinPaymentFixture = createFixture({
  id: "set14-audit-curious-merlin-payment",
  name: "Hyperia audit: Curious Merlin payment",
  description:
    "Play Merlin for four ink and gain one drop. Fresh Ink blocks Quest. Use the drop to play Fru Fru at zero ready ink.",
  skipPreGame: true,
  seed: "set14-audit-curious-merlin-payment",
  playerOne: { hand: [merlinProfoundlyCurious, fruFruVipGuest], inkwell: 4, deck },
  playerTwo: { deck },
});

export const set14AuditOwlDefenseFixture = createFixture({
  id: "set14-audit-owl-defense",
  name: "Hyperia audit: Owl defending trigger",
  description:
    "Pass to player two and challenge exerted Owl with Fox. Owl is banished; its controller gains one drop on the opponent turn after resolving The Indignity.",
  skipPreGame: true,
  seed: "set14-audit-owl-defense",
  playerOne: { play: [{ card: archimedesMessengerOwl, exerted: true }], deck },
  playerTwo: { play: [foxXanatosCharismaticOutlaw], deck },
});

export const set14AuditJuanitaEnhancedFixture = createFixture({
  id: "set14-audit-juanita-enhanced",
  name: "Hyperia audit: Juanita enhanced singing draw",
  description:
    "Sing Juanita with ready Loyal Alebrije. Ten existing discard cards make the song draw exactly three. The singer exerts and all ready ink remains. Check the draw and singing logs.",
  skipPreGame: true,
  seed: "set14-audit-juanita-enhanced",
  playerOne: {
    play: [{ card: danteLoyalAlebrije, isDrying: false }],
    hand: [everyoneKnowsJuanita],
    discard: Array.from({ length: 10 }, () => fruFruVipGuest),
    deck,
    inkwell: 2,
  },
  playerTwo: { deck, inkwell: 2 },
});

export const set14AuditMalicePlayerTwoFixture = createFixture({
  id: "set14-audit-malice-player-two",
  name: "Hyperia audit: player-two Malice lethal movement",
  description:
    "Pass to player two and switch view. Play Malice for two ink; move three damage from opposing Goliath to opposing Fru Fru. Goliath keeps one damage; Fru Fru is banished; Scuttle stays untouched. Check amount and target controls and logs.",
  skipPreGame: true,
  seed: "set14-audit-malice-player-two",
  playerOne: {
    play: [{ card: goliathTransformedWarrior, damage: 4 }, fruFruVipGuest, scuttleDirectingTraffic],
    deck,
  },
  playerTwo: { hand: [mimsMalice], deck, inkwell: 2 },
});

export const set14AuditHigitusPlayerTwoFixture = createFixture({
  id: "set14-audit-higitus-player-two",
  name: "Hyperia audit: player-two Higitus persistence",
  description:
    "Pass and switch to player two. Dante sings Higitus with zero ready ink; gain three drops. Pay one drop for Fru Fru, then pass both turns. Two drops persist; opposing four drops remain unchanged. Check gain and removal logs.",
  skipPreGame: true,
  seed: "set14-audit-higitus-player-two",
  playerOne: { deck, inkDrops: 4 },
  playerTwo: {
    play: [{ card: danteLoyalAlebrije, isDrying: false }],
    hand: [higitusFigitus, fruFruVipGuest],
    deck,
  },
});

export const set14AuditPocoPlayerTwoFixture = createFixture({
  id: "set14-audit-poco-player-two",
  name: "Hyperia audit: player-two Un Poco Loco",
  description:
    "Pass and switch to player two. Sing Together with Fru Fru and Scuttle at exact total cost three. Choose those two to return; own Goliath and opposing Fru Fru stay in play. Ready ink remains two. Check singing and return logs.",
  skipPreGame: true,
  seed: "set14-audit-poco-player-two",
  playerOne: { play: [fruFruVipGuest], deck },
  playerTwo: {
    play: [
      { card: fruFruVipGuest, isDrying: false },
      { card: scuttleDirectingTraffic, isDrying: false },
      goliathTransformedWarrior,
    ],
    hand: [unPocoLoco],
    deck,
    inkwell: 2,
  },
});

export const set14AuditMagnificentPlayerTwoFixture = createFixture({
  id: "set14-audit-magnificent-player-two",
  name: "Hyperia audit: player-two Magnificent lore and draw",
  description:
    "Pass and switch to player two. Pay four ink for the first Magnificent, then sing the second with Goliath at zero ready ink. Each gains two lore and draws one. Opposing lore seven and deck six stay unchanged. Check paid and sung logs.",
  skipPreGame: true,
  seed: "set14-audit-magnificent-player-two",
  playerOne: { deck, lore: 7 },
  playerTwo: {
    play: [{ card: goliathTransformedWarrior, isDrying: false }],
    hand: [magnificentMarvelous, magnificentMarvelous],
    deck,
    lore: 5,
    inkwell: 4,
  },
});

export const set14AuditCreativeShortDeckFixture = createFixture({
  id: "set14-audit-creative-short-deck",
  name: "Hyperia audit: player-two Creative short deck",
  description:
    "Pass and switch to player two. Normal draw leaves two cards. Play Creative Inspiration for seven ink; draw the remaining two. The game stays active until player two passes; then player one wins for empty deck. Check actual draw log and result.",
  skipPreGame: true,
  seed: "set14-audit-creative-short-deck",
  playerOne: { deck },
  playerTwo: {
    hand: [creativeInspiration],
    deck: [fruFruVipGuest, fruFruVipGuest, fruFruVipGuest],
    inkwell: 7,
  },
});

export const set14AuditRebeccaOnlyHandFixture = createFixture({
  id: "set14-audit-rebecca-only-hand",
  name: "Hyperia audit: Rebecca only-hand discard",
  description:
    "Play Rebecca from an otherwise empty hand, accept the draw, then discard the only drawn card.",
  skipPreGame: true,
  seed: "set14-audit-rebecca-only-hand",
  playerOne: {
    hand: [rebeccaCunninghamSavvyManager],
    inkwell: 3,
    deck: [fruFruVipGuest, belleReflectiveWriter],
  },
  playerTwo: { deck, inkwell: 3 },
});

export const set14AuditShereKhanEmptyHandFixture = createFixture({
  id: "set14-audit-shere-khan-empty-hand",
  name: "Hyperia audit: Shere Khan empty opposing hand",
  description:
    "Play Shere Khan with no opposing hand cards and verify exactly one Ink Drop is awarded.",
  skipPreGame: true,
  seed: "set14-audit-shere-khan-empty-hand",
  playerOne: { hand: [shereKhanOpportunisticTycoon], inkwell: 4, deck },
  playerTwo: { hand: [], deck, inkwell: 3 },
});

export const set14AuditHoraceNoTargetFixture = createFixture({
  id: "set14-audit-horace-no-target",
  name: "Hyperia audit: Horace no damaged target",
  description:
    "Play Horace against healthy Hiro. No damage choice is available and the turn can continue.",
  skipPreGame: true,
  seed: "set14-audit-horace-no-target",
  playerOne: { hand: [horaceClumsyClod], inkwell: 3, deck },
  playerTwo: { play: [hiroHamadaVersatileInventor], deck },
});

export const set14AuditRuthlessQuestFixture = createFixture({
  id: "set14-audit-ruthless-quest",
  name: "Hyperia audit: Ruthless Shere Khan quest",
  description:
    "Quest with Shere Khan. Gain one lore without triggering the play ability or moving opposing Fru Fru.",
  skipPreGame: true,
  seed: "set14-audit-ruthless-quest",
  playerOne: { play: [{ card: shereKhanRuthlessEntrepreneur, isDrying: false }], deck },
  playerTwo: { play: [fruFruVipGuest], deck },
});

export const set14AuditBobbyWardFixture = createFixture({
  id: "set14-audit-bobby-ward",
  name: "Hyperia audit: Bobby opposing Ward",
  description: "Distract may choose your Fru Fru but cannot choose opposing Bobby with Ward.",
  skipPreGame: true,
  seed: "set14-audit-bobby-ward",
  playerOne: { hand: [distract], inkwell: 2, play: [fruFruVipGuest], deck },
  playerTwo: { play: [bobbyZimuruskiSoundboardWhiz, leaningTowerOfCheesea], deck },
});

export const set14AuditBaymaxThreeItemsFixture = createFixture({
  id: "set14-audit-baymax-three-items",
  name: "Hyperia audit: Baymax three-item reward",
  description: "Three own items still award exactly two Ink Drops when Baymax is played.",
  skipPreGame: true,
  seed: "set14-audit-baymax-three-items",
  playerOne: {
    hand: [baymaxLabAssistant],
    inkwell: 4,
    play: [leaningTowerOfCheesea, leaningTowerOfCheesea, inkcasterSkates],
    deck,
  },
  playerTwo: { inkDrops: 3, deck },
});

export const set14AuditFredBossUnaffordableFixture = createFixture({
  id: "set14-audit-fred-boss-unaffordable",
  name: "Hyperia audit: Fred insufficient Shift payment",
  description:
    "Fred has an own-name Shift base but only three bank ink and no drops. His future reward cannot fund Shift.",
  skipPreGame: true,
  seed: "set14-audit-fred-boss-unaffordable",
  playerOne: { hand: [fredAwesomeBoss], play: [fredAssemblingTheTeam], inkwell: 3, deck },
  playerTwo: { play: [fredAssemblingTheTeam], deck },
});

export const set14AuditLesterLoreFloorFixture = createFixture({
  id: "set14-audit-lester-lore-floor",
  name: "Hyperia audit: Lester lore floor",
  description:
    "Challenge opposing Lester with Hook. Player two resolves the banish trigger; the attacker's one lore becomes zero.",
  skipPreGame: true,
  seed: "set14-audit-lester-lore-floor",
  playerOne: { play: [{ card: captainHookConcernedCaptain, isDrying: false }], lore: 1, deck },
  playerTwo: { play: [{ card: lesterThePossumParkMascot, exerted: true }], lore: 5, deck },
});

export const set14AuditKarnageNegativeLoreFixture = createFixture({
  id: "set14-audit-karnage-negative-lore",
  name: "Hyperia audit: Don Karnage negative quest lore",
  description:
    "Two exerted opposing Dons reduce damaged Fru Fru to negative one lore. Quest must grant zero and preserve existing lore.",
  skipPreGame: true,
  seed: "set14-audit-karnage-negative-lore",
  playerOne: { play: [{ card: fruFruVipGuest, damage: 1, isDrying: false }], lore: 5, deck },
  playerTwo: {
    play: [
      { card: donKarnageDebonairPirate, exerted: true },
      { card: donKarnageDebonairPirate, exerted: true },
    ],
    deck,
  },
});

export const set14AuditMaxShortDeckFixture = createFixture({
  id: "set14-audit-max-short-deck",
  name: "Hyperia audit: Max draws from a short deck",
  description:
    "Play Max and discard Magnificent to draw the only remaining card. Pass the turn to check the empty-deck loss.",
  skipPreGame: true,
  seed: "set14-audit-max-short-deck",
  playerOne: {
    hand: [maxGoofKaraokeStar, magnificentMarvelous],
    inkwell: 3,
    deck: [baymaxLabAssistant],
  },
  playerTwo: { deck },
});

export const set14AuditMaxEmptyDeckFixture = createFixture({
  id: "set14-audit-max-empty-deck",
  name: "Hyperia audit: Max draws from an empty deck",
  description:
    "Play Max and discard Magnificent to draw no cards. Pass the turn to check the empty-deck loss.",
  skipPreGame: true,
  seed: "set14-audit-max-empty-deck",
  playerOne: {
    hand: [maxGoofKaraokeStar, magnificentMarvelous],
    inkwell: 3,
    deck: [],
  },
  playerTwo: { deck },
});

export const set14AuditBelleChallengeFixture = createFixture({
  id: "set14-audit-belle-challenge",
  name: "Hyperia audit: Belle challenge discount",
  description: "Challenge the exerted Fru Fru with Belle, then play Magnificent for two ink.",
  skipPreGame: true,
  seed: "set14-audit-belle-challenge",
  playerOne: { play: [belleExceptionalWriter], hand: [magnificentMarvelous], inkwell: 2, deck },
  playerTwo: { play: [{ card: fruFruVipGuest, exerted: true }], deck },
});

export const set14AuditBelleStackedFixture = createFixture({
  id: "set14-audit-belle-stacked",
  name: "Hyperia audit: Belle stacked discounts",
  description:
    "Quest with both Belles, then play the first Magnificent for zero ink and the second for four.",
  skipPreGame: true,
  seed: "set14-audit-belle-stacked",
  playerOne: {
    play: [belleExceptionalWriter, belleExceptionalWriter],
    hand: [magnificentMarvelous, magnificentMarvelous],
    inkwell: 4,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditBelleSingingFixture = createFixture({
  id: "set14-audit-belle-singing",
  name: "Hyperia audit: Belle singing discount",
  description: "Sing the first Magnificent with Belle, then pay two ink for the next copy.",
  skipPreGame: true,
  seed: "set14-audit-belle-singing",
  playerOne: {
    play: [belleExceptionalWriter],
    hand: [magnificentMarvelous, magnificentMarvelous],
    inkwell: 2,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditFredNoLocationFixture = createFixture({
  id: "set14-audit-fred-no-location",
  name: "Hyperia audit: Fred without locations",
  description:
    "Play Fred with no locations. The effect must not block the turn or banish a character.",
  skipPreGame: true,
  seed: "set14-audit-fred-no-location",
  playerOne: { hand: [fredBigStomper], play: [fruFruVipGuest], inkwell: 5, deck },
  playerTwo: { play: [hiroHamadaVersatileInventor], deck },
});

export const set14AuditFredQuestFixture = createFixture({
  id: "set14-audit-fred-quest",
  name: "Hyperia audit: Fred quest leaves locations",
  description:
    "Quest Fred for two lore. Both locations must remain and no banishment prompt should appear.",
  skipPreGame: true,
  seed: "set14-audit-fred-quest",
  playerOne: { play: [fredBigStomper, merlinsShopAndSmithyMagicalMarket], deck },
  playerTwo: { play: [merlinsShopAndSmithyMagicalMarket], deck },
});

export const set14AuditMinnieEffectFixture = createFixture({
  id: "set14-audit-minnie-effect",
  name: "Hyperia audit: Minnie prevents action damage",
  description: "Play Fire the Cannons against opposing Minnie. Resist prevents all two damage.",
  skipPreGame: true,
  seed: "set14-audit-minnie-effect",
  playerOne: { hand: [fireTheCannons], inkwell: 1, deck },
  playerTwo: { play: [minnieMouseBusyGogetter], deck },
});

export const set14AuditHoneyNoItemFixture = createFixture({
  id: "set14-audit-honey-no-item",
  name: "Hyperia audit: Honey without an own item",
  description: "Play Honey with only an opposing item in play. No draw or drop can be gained.",
  skipPreGame: true,
  seed: "set14-audit-honey-no-item",
  playerOne: {
    hand: [honeyLemonTestingTheLimits],
    play: [fruFruVipGuest],
    inkwell: 3,
    inkDrops: 2,
    deck,
  },
  playerTwo: { play: [inkcasterSkates], deck },
});

export const set14AuditHoneyEmptyDeckFixture = createFixture({
  id: "set14-audit-honey-empty-deck",
  name: "Hyperia audit: Honey reward with an empty deck",
  description:
    "Play Honey and banish Skates. Draw nothing but gain one drop, then pass to verify defeat.",
  skipPreGame: true,
  seed: "set14-audit-honey-empty-deck",
  playerOne: { hand: [honeyLemonTestingTheLimits], play: [inkcasterSkates], inkwell: 3, deck: [] },
  playerTwo: { deck },
});

export const set14AuditAirDropHealedFixture = createFixture({
  id: "set14-audit-air-drop-healed",
  name: "Hyperia audit: Air Drop after healing",
  description:
    "Heal Fred's one damage, then play Air Drop. The fresh target takes three and survives.",
  skipPreGame: true,
  seed: "set14-audit-air-drop-healed",
  playerOne: {
    hand: [healingGlow, airDrop],
    play: [{ card: fredBigStomper, damage: 1 }],
    inkwell: 5,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditCrowdEmptyDeckFixture = createFixture({
  id: "set14-audit-crowd-empty-deck",
  name: "Hyperia audit: Above the Crowd empty deck",
  description:
    "Put opposing Fru Fru into their empty deck. The deck must contain exactly that card.",
  skipPreGame: true,
  seed: "set14-audit-crowd-empty-deck",
  playerOne: { hand: [aboveTheCrowd], inkwell: 5, deck },
  playerTwo: { play: [fruFruVipGuest], deck: [] },
});

export const set14AuditTaleEmptyDeckFixture = createFixture({
  id: "set14-audit-tale-empty-deck",
  name: "Hyperia audit: Another Tale empty deck",
  description:
    "Play Another Tale with no deck cards. Choose the opponent; both gain one drop, then passing ends the game.",
  skipPreGame: true,
  seed: "set14-audit-tale-empty-deck",
  playerOne: { hand: [anotherTaleToSpin], inkwell: 2, deck: [] },
  playerTwo: { deck },
});

export const set14AuditAbigailPaymentFixture = createFixture({
  id: "set14-audit-abigail-payment",
  name: "Hyperia audit: Abigail payment",
  description:
    "With four ink, Abigail costs five and cannot be played. Ink one copy, then play the other for five. Check drying and logs.",
  skipPreGame: true,
  seed: "set14-audit-abigail-payment",
  playerOne: {
    hand: [abigailCallaghanSeasonedTestPilot, abigailCallaghanSeasonedTestPilot],
    inkwell: 4,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditPepitaPaymentFixture = createFixture({
  id: "set14-audit-pepita-payment",
  name: "Hyperia audit: Pepita payment",
  description:
    "At zero ink Pepita cannot be played. Ink one copy, then play the other for one and check drying.",
  skipPreGame: true,
  seed: "set14-audit-pepita-payment",
  playerOne: { hand: [pepitaSweetKitty, pepitaSweetKitty], deck },
  playerTwo: { deck },
});

export const set14AuditDonaldExertedFixture = createFixture({
  id: "set14-audit-donald-exerted",
  name: "Hyperia audit: Donald exerted target",
  description:
    "Play Donald and grant Rush to exerted Jock. Jock must stay exerted and cannot challenge Hook.",
  skipPreGame: true,
  seed: "set14-audit-donald-exerted",
  playerOne: {
    hand: [donaldDuckTaxiDriver],
    play: [{ card: jockEnjoyingTheSights, exerted: true }],
    inkwell: 3,
    deck,
  },
  playerTwo: { play: [{ card: captainHookConcernedCaptain, exerted: true }], deck },
});

export const set14AuditTouristCopiesFixture = createFixture({
  id: "set14-audit-tourist-copies",
  name: "Hyperia audit: Tourist copies",
  description:
    "Two own Goofy copies get three strength from an exerted drying Singer. Opposing Goofy remains zero. Quest both for one lore each.",
  skipPreGame: true,
  seed: "set14-audit-tourist-copies",
  playerOne: {
    play: [
      goofyEnthusiasticTourist,
      goofyEnthusiasticTourist,
      { card: goofyDancingSuperstar, exerted: true, isDrying: true },
    ],
    deck,
  },
  playerTwo: { play: [goofyEnthusiasticTourist], deck },
});

export const set14AuditTadashiSurvivesFixture = createFixture({
  id: "set14-audit-tadashi-survives",
  name: "Hyperia audit: Tadashi survives",
  description:
    "Challenge exerted Fru Fru with Tadashi. Tadashi takes one damage and stays in play; no drop reward should appear.",
  skipPreGame: true,
  seed: "set14-audit-tadashi-survives",
  playerOne: { play: [tadashiHamadaMakingWaves], deck },
  playerTwo: { play: [{ card: fruFruVipGuest, exerted: true }], deck },
});

export const set14AuditCruellaFatalFixture = createFixture({
  id: "set14-audit-cruella-fatal",
  name: "Hyperia audit: Cruella fatal Rush",
  description:
    "Play Cruella for six, then Rush into exerted Hook. She deals five damage and is banished by nine return damage.",
  skipPreGame: true,
  seed: "set14-audit-cruella-fatal",
  playerOne: { hand: [cruellaDeVilDodgingTraffic], inkwell: 6, deck },
  playerTwo: { play: [{ card: captainHookConcernedCaptain, exerted: true }], deck },
});

export const set14AuditJasperPlainFixture = createFixture({
  id: "set14-audit-jasper-plain",
  name: "Hyperia audit: Jasper plain defender",
  description:
    "Challenge exerted Fru Fru with Jasper. Evasive must not restrict attacking a plain defender. Check five damage and one returned.",
  skipPreGame: true,
  seed: "set14-audit-jasper-plain",
  playerOne: { play: [jasperDodgyBoater], deck },
  playerTwo: { play: [{ card: fruFruVipGuest, exerted: true }], deck },
});

export const set14AuditPegLimitFixture = createFixture({
  id: "set14-audit-peg-limit",
  name: "Hyperia audit: Peg Singer limit",
  description:
    "Peg has Singer four. Higitus costs six: ink play is legal with six bank ink, singing with Peg is not.",
  skipPreGame: true,
  seed: "set14-audit-peg-limit",
  playerOne: { play: [pegLatenightVocalist], hand: [higitusFigitus], inkwell: 6, deck },
  playerTwo: { deck },
});

export const set14AuditStaceyPaymentFixture = createFixture({
  id: "set14-audit-stacey-payment",
  name: "Hyperia audit: Stacey payment",
  description:
    "At two ink Stacey cannot be played. Ink one copy, play the other for three, pass both turns, then quest for three and check the exerted repeat is blocked.",
  skipPreGame: true,
  seed: "set14-audit-stacey-payment",
  playerOne: { hand: [staceyPowerlineSuperfan, staceyPowerlineSuperfan], inkwell: 2, deck },
  playerTwo: { deck },
});

export const set14AuditHectorStreetEmptyFixture = createFixture({
  id: "set14-audit-hector-street-empty",
  name: "Hyperia audit: Street Musician empty deck",
  description:
    "Play Héctor for one with an empty deck. Accept Strike a Chord and verify no card is discarded, no false mill log appears, and the character remains drying. Pass to verify the empty-deck loss.",
  skipPreGame: true,
  seed: "set14-audit-hector-street-empty",
  playerOne: { hand: [hctorRiveraStreetMusician], inkwell: 1, deck: [] },
  playerTwo: { deck },
});

export const set14AuditErnestoCopiesFixture = createFixture({
  id: "set14-audit-ernesto-copies",
  name: "Hyperia audit: Ernesto copies and multiple songs",
  description:
    "Two own Ernesto copies each get only one additional lore from two opposing discarded songs. The opposing copy has base lore. Quest with both own copies for four total and inspect the named logs.",
  skipPreGame: true,
  seed: "set14-audit-ernesto-copies",
  playerOne: { play: [ernestoDeLaCruzIdolOfMillions, ernestoDeLaCruzIdolOfMillions], deck },
  playerTwo: {
    play: [ernestoDeLaCruzIdolOfMillions],
    discard: [magnificentMarvelous, oneJumpAhead],
    deck,
  },
});

export const set14AuditPepitaExertedShiftFixture = createFixture({
  id: "set14-audit-pepita-exerted-shift",
  name: "Hyperia audit: Pepita exerted Shift",
  description:
    "Shift Pepita for three onto an exerted base with two damage. Retain both states and the underlying card. At ten discard cards show strength six and lore three, but block quest and challenge due to exertion.",
  skipPreGame: true,
  seed: "set14-audit-pepita-exerted-shift",
  playerOne: {
    hand: [pepitaImeldasRightHand],
    play: [{ card: pepitaWatchfulAlebrije, exerted: true, damage: 2 }],
    inkwell: 3,
    discard: Array(10).fill(fruFruVipGuest),
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditHectorPiecesCopiesFixture = createFixture({
  id: "set14-audit-hector-pieces-copies",
  name: "Hyperia audit: Gone to Pieces copy ownership",
  description:
    "Own base and D23 Héctor each get Evasive and only one extra lore from two own discarded songs. Opposing Héctor stays at base lore without Evasive. Quest both for four and inspect the log.",
  skipPreGame: true,
  seed: "set14-audit-hector-pieces-copies",
  playerOne: {
    play: [hctorRiveraGoneToPieces, hctorRiveraGoneToPiecesD23],
    discard: [magnificentMarvelous, oneJumpAhead],
    deck,
  },
  playerTwo: { play: [hctorRiveraGoneToPieces], deck },
});

export const set14AuditTrampNoTargetFixture = createFixture({
  id: "set14-audit-tramp-no-target",
  name: "Hyperia audit: Tramp no exert target",
  description:
    "Play Tramp for two. Choose exert with no strength-one-or-less character. Resolve without exerting anyone or granting Rush; Fresh Ink blocks quest and challenge.",
  skipPreGame: true,
  seed: "set14-audit-tramp-no-target",
  playerOne: { hand: [trampQuickOnHisFeet], inkwell: 2, deck },
  playerTwo: { play: [{ card: captainHookConcernedCaptain, exerted: true }], deck },
});

export const set14AuditMeilinNonSongFixture = createFixture({
  id: "set14-audit-meilin-non-song",
  name: "Hyperia audit: Meilin non-song allowance",
  description:
    "Play Fru Fru for one without gaining a drop. Then play Magnificent Marvelous for four: Meilin gains exactly one drop despite other copies in hand and discard. Verify payment and logs.",
  skipPreGame: true,
  seed: "set14-audit-meilin-non-song",
  playerOne: {
    play: [meilinLeeEcstaticFan],
    hand: [fruFruVipGuest, magnificentMarvelous, meilinLeeEcstaticFan],
    discard: [meilinLeeEcstaticFan],
    inkwell: 5,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditRoxanneNoPairFixture = createFixture({
  id: "set14-audit-roxanne-no-pair",
  name: "Hyperia audit: Roxanne no legal pair",
  description:
    "Play Roxanne for two with no other character or location. Accept the optional effect and verify no movement, no lore bonus, no stuck prompt, and normal drying restrictions.",
  skipPreGame: true,
  seed: "set14-audit-roxanne-no-pair",
  playerOne: { hand: [roxanneConcertLover], inkwell: 2, deck },
  playerTwo: { deck },
});

export const set14AuditWasabiQuestFixture = createFixture({
  id: "set14-audit-wasabi-quest",
  name: "Hyperia audit: Wasabi quest exclusion",
  description:
    "Quest Wasabi with one ink drop. Strength is six but lore stays printed; no Twin Blades prompt or damage occurs. Inspect exertion, held drop, and named quest log.",
  skipPreGame: true,
  seed: "set14-audit-wasabi-quest",
  playerOne: { play: [wasabiCalledIntoBattle], inkDrops: 1, deck },
  playerTwo: { play: [fruFruVipGuest], deck },
});

export const set14AuditTremaineSongFixture = createFixture({
  id: "set14-audit-tremaine-song",
  name: "Hyperia audit: Tremaine entry and song choices",
  description:
    "Play Tremaine undamaged then play Magnificent Marvelous and accept or decline her damage-and-draw choice. A second song checks the once-per-turn limit.",
  skipPreGame: true,
  seed: "set14-audit-tremaine-song",
  playerOne: {
    hand: [ladyTremaineScornfulSnob, magnificentMarvelous, magnificentMarvelous],
    inkwell: 11,
    deck,
  },
  playerTwo: { hand: [gazellePopDiva, fruFruVipGuest], inkwell: 3, deck },
});

export const set14AuditTremaineResistFixture = createFixture({
  id: "set14-audit-tremaine-resist",
  name: "Hyperia audit: Tremaine prevented self-damage",
  description:
    "Activate Mouse Armor targeting Tremaine then play the song. Accept Delicate Sensibilities: Resist prevents damage and its conditional draw.",
  skipPreGame: true,
  seed: "set14-audit-tremaine-resist",
  playerOne: {
    play: [ladyTremaineScornfulSnob, mouseArmor],
    hand: [magnificentMarvelous],
    inkwell: 4,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditTremaineLethalFixture = createFixture({
  id: "set14-audit-tremaine-lethal",
  name: "Hyperia audit: Tremaine lethal Singer entry",
  description:
    "Play Hector Street Musician against Tremaine. His one willpower makes entry damage lethal; his entry trigger must still be available.",
  skipPreGame: true,
  seed: "set14-audit-tremaine-lethal",
  playerOne: { hand: [hctorRiveraStreetMusician], inkwell: 1, deck },
  playerTwo: { play: [ladyTremaineScornfulSnob], deck },
});

export const set14AuditTremaineMiguelFixture = createFixture({
  id: "set14-audit-tremaine-miguel",
  name: "Hyperia audit: Tremaine conditional Singer entry",
  description:
    "Miguel gains Singer from a song in his own discard and must enter with Tremaine damage.",
  skipPreGame: true,
  seed: "set14-audit-tremaine-miguel",
  playerOne: {
    hand: [miguelRiveraStreetMusician],
    discard: [magnificentMarvelous],
    inkwell: 1,
    deck,
  },
  playerTwo: { play: [ladyTremaineScornfulSnob], deck },
});

export const set14AuditTremaineMiguelInactiveFixture = createFixture({
  id: "set14-audit-tremaine-miguel-inactive",
  name: "Hyperia audit: Tremaine inactive Singer condition",
  description:
    "Only the opponent has a discarded song. Miguel must enter undamaged without Singer.",
  skipPreGame: true,
  seed: "set14-audit-tremaine-miguel-inactive",
  playerOne: { hand: [miguelRiveraStreetMusician], inkwell: 1, deck },
  playerTwo: { play: [ladyTremaineScornfulSnob], discard: [magnificentMarvelous], deck },
});

export const set14AuditTremaineEffectEntryFixture = createFixture({
  id: "set14-audit-tremaine-effect-entry",
  name: "Hyperia audit: Tremaine effect-driven lethal entry",
  description:
    "Use Just in Time to play Hector for free. Lethal entry damage must preserve Strike a Chord.",
  skipPreGame: true,
  seed: "set14-audit-tremaine-effect-entry",
  playerOne: { hand: [justInTime, hctorRiveraStreetMusician], inkwell: 3, deck },
  playerTwo: { play: [ladyTremaineScornfulSnob], deck },
});

export const set14AuditTremaineShiftFixture = createFixture({
  id: "set14-audit-tremaine-shift",
  name: "Hyperia audit: Tremaine Singer Shift",
  description:
    "Shift Goofy onto his damaged dry base. Preserve inherited damage and add one entry counter from Tremaine with a named log.",
  skipPreGame: true,
  seed: "set14-audit-tremaine-shift",
  playerOne: {
    hand: [goofyDancingSuperstar],
    play: [{ card: goofyKnowsTheBand, damage: 1, isDrying: false }],
    inkwell: 3,
    deck,
  },
  playerTwo: { play: [ladyTremaineScornfulSnob], deck },
});

export const set14AuditMulanStackedFixture = createFixture({
  id: "set14-audit-mulan-stacked",
  name: "Hyperia audit: stacked Mulan grants",
  description:
    "Play both Mulan copies and grant dry Aladdin both entry abilities. Strength becomes six and one character challenge draws two cards.",
  skipPreGame: true,
  seed: "set14-audit-mulan-stacked",
  playerOne: {
    hand: [mulanMartialArtsMaster, mulanMartialArtsMaster],
    play: [{ card: aladdinPrinceAli, isDrying: false }],
    inkwell: 8,
    deck,
  },
  playerTwo: { play: [{ card: fruFruVipGuest, exerted: true }], deck },
});

export const set14AuditMulanSourceRemovalFixture = createFixture({
  id: "set14-audit-mulan-source-removal",
  name: "Hyperia audit: Mulan grant after source removal",
  description:
    "Play Mulan and grant dry Aladdin the entry ability. Banish Mulan with Dragon Fire then challenge Fru Fru; the grant still draws one card.",
  skipPreGame: true,
  seed: "set14-audit-mulan-source-removal",
  playerOne: {
    hand: [mulanMartialArtsMaster, dragonFire],
    play: [{ card: aladdinPrinceAli, isDrying: false }],
    inkwell: 9,
    deck,
  },
  playerTwo: { play: [{ card: fruFruVipGuest, exerted: true }], deck },
});

export const set14AuditMulanEmptyDeckFixture = createFixture({
  id: "set14-audit-mulan-empty-deck",
  name: "Hyperia audit: Mulan empty-deck challenge draw",
  description:
    "Play Mulan and grant Aladdin the entry ability. Challenge Fru Fru with an empty deck; combat completes and the failed draw loses the game at turn end.",
  skipPreGame: true,
  seed: "set14-audit-mulan-empty-deck",
  playerOne: {
    hand: [mulanMartialArtsMaster],
    play: [{ card: aladdinPrinceAli, isDrying: false }],
    inkwell: 4,
    deck: [],
  },
  playerTwo: { play: [{ card: fruFruVipGuest, exerted: true }], deck },
});

export const set14AuditMulanResistFixture = createFixture({
  id: "set14-audit-mulan-resist",
  name: "Hyperia audit: Mulan draw despite prevented damage",
  description:
    "Play Mulan targeting Aladdin then Distract your own Aladdin. Challenge exerted Minnie with strength two into Resist two; still draw one before damage is prevented.",
  skipPreGame: true,
  seed: "set14-audit-mulan-resist",
  playerOne: {
    hand: [mulanMartialArtsMaster, distract],
    play: [{ card: aladdinPrinceAli, isDrying: false }],
    inkwell: 6,
    deck,
  },
  playerTwo: { play: [{ card: minnieMouseBusyGogetter, exerted: true }], deck },
});

export const set14AuditMimNosyEmptyFixture = createFixture({
  id: "set14-audit-mim-nosy-empty",
  name: "Hyperia audit: Mim empty opposing hand",
  description:
    "Play Mim for five ink against an empty opposing hand. NO HIDING completes without a reveal window or target picker.",
  skipPreGame: true,
  seed: "set14-audit-mim-nosy-empty",
  playerOne: { hand: [madamMimNosyNeighbor], inkwell: 5, deck },
  playerTwo: { hand: [], deck },
});

export const set14AuditMimNosyPlayerTwoFixture = createFixture({
  id: "set14-audit-mim-nosy-player-two",
  name: "Hyperia audit: Mim player-two drop payment",
  description:
    "Pass PlayerOne turn then switch to PlayerTwo. Spend four ink and one drop to play Mim and privately inspect opposing Photo and Jukebox. Spectator must see only card backs.",
  skipPreGame: true,
  seed: "set14-audit-mim-nosy-player-two",
  playerOne: { hand: [riveraFamilyPhoto, jukebox], deck },
  playerTwo: { hand: [madamMimNosyNeighbor], inkwell: 4, inkDrops: 1, deck },
});

export const set14AuditPeopleNoLocationFixture = createFixture({
  id: "set14-audit-people-no-location",
  name: "Hyperia audit: People song without a playable location",
  description:
    "Sing with Maui. No location exists in your hand or discard. The existing Central Station must not receive Maui; the effect must finish without a stuck prompt or movement log.",
  skipPreGame: true,
  seed: "set14-audit-people-no-location",
  playerOne: {
    hand: [peopleGonnaComeHere],
    play: [{ card: mauiDemigod, isDrying: false }, centralStationTransportationHub],
    inkwell: 0,
    deck,
  },
  playerTwo: { discard: [bellesHouseMauricesWorkshop], deck },
});

export const set14AuditExpressRemovalFixture = createFixture({
  id: "set14-audit-express-removal",
  name: "Hyperia audit: Express source removal",
  description:
    "Port Authority has nine damage and ten willpower from Express. Pay two ink for Break and banish Express. Port Authority must lose the bonus and be banished; Belle House and opposing Port Authority stay in play. Inspect named logs.",
  skipPreGame: true,
  seed: "set14-audit-express-removal",
  playerOne: {
    hand: [breakCard],
    play: [
      hyperiaCityExpress,
      { card: portAuthorityCenterHub, damage: 9 },
      bellesHouseMauricesWorkshop,
    ],
    inkwell: 2,
    deck,
  },
  playerTwo: { play: [portAuthorityCenterHub], deck },
});

export const set14AuditPlaneDryingFixture = createFixture({
  id: "set14-audit-plane-drying",
  name: "Hyperia audit: Alert does not bypass drying",
  description:
    "Activate Barrel Roll for one ink on drying Koslov. Alert is visible but Challenge and Quest remain disabled by Fresh Ink even with an exerted Evasive Peter Pan opposite. The item exerts; Koslov stays ready and Peter Pan undamaged.",
  skipPreGame: true,
  seed: "set14-audit-plane-drying",
  playerOne: {
    play: [piratePlane, { card: koslovImposingEnforcer, isDrying: true }],
    inkwell: 1,
    deck,
  },
  playerTwo: { play: [{ card: peterPanNeverLanding, isDrying: false, exerted: true }], deck },
});

export const set14AuditLafayetteFixture = createFixture({
  id: "set14-audit-lafayette",
  name: "Hyperia audit: Lafayette All Ears",
  description:
    "Pay two ink to play Lafayette; Fresh Ink still blocks actions despite Alert. Dry Lafayette can challenge exerted Evasive Peter Pan but not the ready copy. Reset and quest Lafayette; plain opposing Kit can challenge him after a normal turn pass. Check logs and persistent Alert.",
  skipPreGame: true,
  seed: "set14-audit-lafayette",
  playerOne: {
    hand: [lafayetteAllEars],
    play: [{ card: lafayetteAllEars, isDrying: false }],
    inkwell: 2,
    deck,
  },
  playerTwo: {
    play: [
      { card: peterPanNeverLanding, isDrying: false, exerted: true },
      { card: peterPanNeverLanding, isDrying: false },
      { card: kitCloudkickerUnpredictableCourier, isDrying: false },
    ],
    deck,
  },
});

export const set14AuditGeeseFixture = createFixture({
  id: "set14-audit-geese",
  name: "Hyperia audit: Abigail and Amelia",
  description:
    "At one ink the cost-two play is blocked. Ink one copy, then pay two for the other. Fresh Ink blocks quest and challenge. After both turns pass, quest for two lore. Reset to challenge with the dry copy: both cost-one Kit and the Geese are banished by two damage. Inspect named logs.",
  skipPreGame: true,
  seed: "set14-audit-geese",
  playerOne: {
    hand: [abigailAmeliaGossipingGeese, abigailAmeliaGossipingGeese],
    play: [{ card: abigailAmeliaGossipingGeese, isDrying: false }],
    inkwell: 1,
    deck,
  },
  playerTwo: {
    hand: [abigailAmeliaGossipingGeese],
    inkwell: 2,
    play: [{ card: kitCloudkickerUnpredictableCourier, isDrying: false, exerted: true }],
    deck,
  },
});

export const set14AuditGoGoFixture = createFixture({
  id: "set14-audit-go-go",
  name: "Hyperia audit: Go Go Working Late",
  description:
    "Cost-three play is blocked at two ink. Ink one copy then pay three for the other; drying blocks actions. Pass both turns and quest for one lore. Reset: dry Go Go challenges Kit for two damage and survives two return damage. A second dry copy with five damage is banished by Kit. Player two can pay three and quest on their next turn. Inspect printed 2/6/1 values and named logs.",
  skipPreGame: true,
  seed: "set14-audit-go-go",
  playerOne: {
    hand: [goGoTomagoWorkingLate, goGoTomagoWorkingLate],
    play: [
      { card: goGoTomagoWorkingLate, isDrying: false },
      { card: goGoTomagoWorkingLate, isDrying: false, damage: 5 },
    ],
    inkwell: 2,
    deck,
  },
  playerTwo: {
    hand: [goGoTomagoWorkingLate],
    play: [
      { card: kitCloudkickerUnpredictableCourier, isDrying: false, exerted: true },
      { card: kitCloudkickerUnpredictableCourier, isDrying: false, exerted: true },
    ],
    inkwell: 3,
    deck,
  },
});

export const set14AuditSpyglassNamesFixture = createFixture({
  id: "set14-audit-spyglass-names",
  name: "Hyperia audit: Spyglass duplicate names",
  description:
    "Play a second Jukebox then a second Hat. Neither matching-name item may offer hand inking. Play Fru Fru: characters must not trigger Hat Couture. Inspect exact ink payment and absence of hand movement or effect prompts.",
  skipPreGame: true,
  seed: "set14-audit-spyglass-names",
  playerOne: {
    play: [spyglassHat, jukebox],
    hand: [jukebox, spyglassHat, fruFruVipGuest, aDarkAgeNoMore],
    inkwell: 6,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditChemPurseEmptyFixture = createFixture({
  id: "set14-audit-chem-purse-empty",
  name: "Hyperia audit: Purse empty deck",
  description:
    "Activate Purse for one ink and banish Jukebox. Empty deck must still charge all costs and finish without a card choice. Pass turn normally to verify no pending choice blocks the existing empty-deck end-turn result.",
  skipPreGame: true,
  seed: "set14-audit-chem-purse-empty",
  playerOne: { play: [upgradedChemPurse, jukebox], inkwell: 1, deck: [] },
  playerTwo: { deck },
});

export const set14AuditChemPurseShortFixture = createFixture({
  id: "set14-audit-chem-purse-short",
  name: "Hyperia audit: Purse short nonitem deck",
  description:
    "Pass player one then switch to player two. The normal draw leaves two nonitems. Activate Purse for one and banish own Jukebox. Both looked-at cards must go to the bottom with no hand addition or public identity leak.",
  skipPreGame: true,
  seed: "set14-audit-chem-purse-short",
  playerOne: { deck },
  playerTwo: {
    play: [upgradedChemPurse, jukebox],
    inkwell: 1,
    deck: [fruFruVipGuest, abuelitaLovingGrandmother, staceyPowerlineSuperfan],
  },
});

export const set14AuditChemPurseRevealFixture = createFixture({
  id: "set14-audit-chem-purse-reveal",
  name: "Hyperia audit: Purse player-two short reveal",
  description:
    "Pass player one and switch to player two. Normal draw leaves Photo and Fru Fru. Pay one and banish the other Purse copy as cost. Reveal Photo into hand and bottom the character. Reset to decline the item and verify both bottom identities remain private.",
  skipPreGame: true,
  seed: "set14-audit-chem-purse-reveal",
  playerOne: { deck },
  playerTwo: {
    play: [upgradedChemPurse, upgradedChemPurse],
    inkwell: 1,
    deck: [fruFruVipGuest, riveraFamilyPhoto, staceyPowerlineSuperfan],
  },
});

export const set14AuditIconicCinderellaShiftStatesFixture = createFixture({
  id: "set14-audit-iconic-cinderella-shift-states",
  name: "Hyperia audit: Iconic Cinderella inherited Shift states",
  description:
    "Shift onto exerted damaged Homespun, then drying Homespun. Each pays five and retains damage one. Quest stays blocked for the inherited state. Wrong-name and opposing characters are excluded.",
  skipPreGame: true,
  seed: "set14-audit-iconic-cinderella-shift-states",
  playerOne: {
    hand: [cinderellaUnintentionalIconIconic, cinderellaUnintentionalIconIconic],
    play: [
      { card: cinderellaHomespunDressmaker, isDrying: false, exerted: true, damage: 1 },
      { card: cinderellaHomespunDressmaker, isDrying: true, damage: 1 },
      fruFruVipGuest,
    ],
    inkwell: 10,
    deck,
  },
  playerTwo: { play: [cinderellaHomespunDressmaker], deck },
});

export const set14AuditIconicCinderellaShiftPaymentFixture = createFixture({
  id: "set14-audit-iconic-cinderella-shift-payment",
  name: "Hyperia audit: Iconic Cinderella failed Shift payment",
  description:
    "Four ink blocks Shift. Ink one hand copy then Shift the other onto damaged drying exerted Homespun; all inherited states remain and actions stay disabled.",
  skipPreGame: true,
  seed: "set14-audit-iconic-cinderella-shift-payment",
  playerOne: {
    hand: [cinderellaUnintentionalIconIconic, cinderellaUnintentionalIconIconic],
    play: [{ card: cinderellaHomespunDressmaker, isDrying: true, exerted: true, damage: 1 }],
    inkwell: 4,
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditIconicCinderellaEmptyFixture = createFixture({
  id: "set14-audit-iconic-cinderella-empty",
  name: "Hyperia audit: Iconic Cinderella empty deck",
  description:
    "End turn with no deck cards. Resolve or decline Bespoke Design before the final deck-loss check; no ink is added.",
  skipPreGame: true,
  seed: "set14-audit-iconic-cinderella-empty",
  playerOne: { play: [cinderellaUnintentionalIconIconic], inkwell: 2, deck: [] },
  playerTwo: { deck },
});

export const set14AuditIconicCinderellaDuplicatesFixture = createFixture({
  id: "set14-audit-iconic-cinderella-duplicates",
  name: "Hyperia audit: Iconic Cinderella duplicate deck cards",
  description:
    "Accept Bespoke Design with two Photo copies. Keep one on top and put only the other into facedown exerted ink. Check owner and opponent logs, then normal draw and ink readiness.",
  skipPreGame: true,
  seed: "set14-audit-iconic-cinderella-duplicates",
  playerOne: {
    play: [cinderellaUnintentionalIconIconic],
    inkwell: 2,
    deck: [riveraFamilyPhoto, riveraFamilyPhoto],
  },
  playerTwo: { deck },
});

export const set14AuditIconicMickeyPaymentFixture = createFixture({
  id: "set14-audit-iconic-mickey-payment",
  name: "Hyperia audit: Iconic Mickey payment",
  description:
    "Zero-ink play is disabled; normal inking permits paid play; only the dry questing copy rewards both players at its own turn end.",
  skipPreGame: true,
  seed: "set14-audit-iconic-mickey-payment",
  playerOne: {
    hand: [mickeyMouseBestInTownIconic, mickeyMouseBestInTownIconic],
    play: [{ card: mickeyMouseBestInTownIconic, isDrying: false }],
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditClarabelleNoItemsFixture = createFixture({
  id: "set14-audit-clarabelle-no-items",
  name: "Hyperia audit: Clarabelle without items",
  skipPreGame: true,
  seed: "set14-audit-clarabelle-no-items",
  description:
    "Play Clarabelle with no item in play. Check that the optional effect cannot move either deck or add ink and leaves no target prompt stuck.",
  playerOne: { hand: [clarabelleOutForAStroll], inkwell: 6, deck },
  playerTwo: { inkwell: 2, deck },
});
export const set14AuditClarabellePlayerTwoFixture = createFixture({
  id: "set14-audit-clarabelle-player-two",
  name: "Hyperia audit: player-two Clarabelle",
  skipPreGame: true,
  seed: "set14-audit-clarabelle-player-two",
  description:
    "Pass to player two, play Clarabelle and banish player one Jukebox. Check player-two ability control, exerted private ink for player one and both logs.",
  playerOne: { play: [jukebox], inkwell: 2, deck: [...deck, aDarkAgeNoMore] },
  playerTwo: { hand: [clarabelleOutForAStroll], inkwell: 6, deck },
});

export const set14AuditObsoleteEmptyFixture = createFixture({
  id: "set14-audit-obsolete-empty",
  name: "Hyperia audit: Obsolete empty deck",
  skipPreGame: true,
  seed: "set14-audit-obsolete-empty",
  description:
    "Play Obsolete with an empty deck; pay three without adding ink or a stuck scry prompt.",
  playerOne: { hand: [everythingElseIsObsolete], inkwell: 3, deck: [] },
  playerTwo: { deck },
});
export const set14AuditObsoletePlayerTwoFixture = createFixture({
  id: "set14-audit-obsolete-player-two",
  name: "Hyperia audit: player-two Obsolete",
  skipPreGame: true,
  seed: "set14-audit-obsolete-player-two",
  description:
    "Pass to player two; play Obsolete and split exactly three own cards into ink, top and bottom. Check both private logs.",
  playerOne: { inkwell: 2, deck },
  playerTwo: {
    hand: [everythingElseIsObsolete],
    inkwell: 3,
    deck: [riveraFamilyPhoto, jukebox, duchessCosmopolitanCat, fruFruVipGuest],
  },
});

export const set14AuditResearchEmptyFixture = createFixture({
  id: "set14-audit-research-empty",
  name: "Hyperia audit: empty-deck Research ordinary ink",
  skipPreGame: true,
  seed: "set14-audit-research-empty",
  description:
    "Play Intense Research with an empty deck; verify payment without a stuck mandatory hand prompt.",
  playerOne: { hand: [intenseResearch], inkwell: 2, inkDrops: 0, deck: [] },
  playerTwo: { deck },
});

export const set14AuditResearchEmptyDropFixture = createFixture({
  id: "set14-audit-research-empty-drop",
  name: "Hyperia audit: empty-deck Research ink drop",
  skipPreGame: true,
  seed: "set14-audit-research-empty-drop",
  description:
    "Play Intense Research with an empty deck; verify payment without a stuck mandatory hand prompt.",
  playerOne: { hand: [intenseResearch], inkwell: 1, inkDrops: 1, deck: [] },
  playerTwo: { deck },
});

export const set14AuditResearchOneFixture = createFixture({
  id: "set14-audit-research-one",
  name: "Hyperia audit: one-card Research ordinary ink",
  skipPreGame: true,
  seed: "set14-audit-research-one",
  description:
    "Play Research with one card in deck. The only card must go into hand with no bottom remainder. Check both private logs.",
  playerOne: { hand: [intenseResearch], inkwell: 2, inkDrops: 0, deck: [riveraFamilyPhoto] },
  playerTwo: { deck },
});

export const set14AuditResearchOneDropFixture = createFixture({
  id: "set14-audit-research-one-drop",
  name: "Hyperia audit: one-card Research ink drop",
  skipPreGame: true,
  seed: "set14-audit-research-one-drop",
  description:
    "Play Research with one card in deck. The only card must go into hand with no bottom remainder. Check both private logs.",
  playerOne: { hand: [intenseResearch], inkwell: 1, inkDrops: 1, deck: [riveraFamilyPhoto] },
  playerTwo: { deck },
});

export const set14AuditResearchPlayerTwoFixture = createFixture({
  id: "set14-audit-research-player-two",
  name: "Hyperia audit: player-two Research",
  skipPreGame: true,
  seed: "set14-audit-research-player-two",
  description:
    "Pass to player two; spend one ink and one drop to look at five own cards. Take one and order four on the bottom. Check chooser ownership and both private logs.",
  playerOne: { inkwell: 2, deck },
  playerTwo: {
    hand: [intenseResearch],
    inkwell: 1,
    inkDrops: 1,
    deck: [
      riveraFamilyPhoto,
      jukebox,
      duchessCosmopolitanCat,
      fruFruVipGuest,
      riveraFamilyPhoto,
      jukebox,
    ],
  },
});

export const set14AuditChemPursePlayFixture = createFixture({
  id: "set14-audit-chem-purse-play",
  name: "Hyperia audit: Chem Purse play and ink",
  skipPreGame: true,
  seed: "set14-audit-chem-purse-play",
  description:
    "Play Purse for two, then activate with one and another item. An exerted Purse cannot activate again. Reset and ink Purse normally without activating.",
  playerOne: { hand: [upgradedChemPurse], play: [jukebox, spyglassHat], inkwell: 4, deck },
  playerTwo: { deck },
});

export const set14AuditEdgarPlayFixture = createFixture({
  id: "set14-audit-edgar-play",
  name: "Hyperia audit: Edgar play quest and ink",
  skipPreGame: true,
  seed: "set14-audit-edgar-play",
  description:
    "Play Edgar for five and verify Resist +2 and drying. Pass both turns and quest for two. Reset and ink normally.",
  playerOne: { hand: [edgarBalthazarLongsufferingButler], inkwell: 5, deck },
  playerTwo: { deck },
});

export const set14AuditEdgarDamageKindsFixture = createFixture({
  id: "set14-audit-edgar-damage-kinds",
  name: "Hyperia audit: Edgar damage kinds",
  skipPreGame: true,
  seed: "set14-audit-edgar-damage-kinds",
  description:
    "Mouse Armor adds Resist +1 to undamaged Edgar. Fire the Cannons deals zero; Mosquito Bite puts one damage and removes only Umbrella. Move two Goliath damage to opposing Edgar with Mim Malice. Inspect badges and both public logs.",
  playerOne: {
    play: [
      edgarBalthazarLongsufferingButler,
      mouseArmor,
      { card: goliathTransformedWarrior, damage: 2 },
    ],
    hand: [fireTheCannons, mosquitoBite, mimsMalice],
    inkwell: 4,
    deck,
  },
  playerTwo: { play: [edgarBalthazarLongsufferingButler], deck },
});

export const set14AuditLabPlayerTwoFixture = createFixture({
  id: "set14-audit-lab-player-two",
  name: "Hyperia audit: player-two Lab",
  skipPreGame: true,
  seed: "set14-audit-lab-player-two",
  description:
    "Pass to player two; play Lab for two, move dry Super there for one and quest to return its only discarded item. Check own next-turn location lore and empty discard quest.",
  playerOne: { discard: [spyglassHat], deck },
  playerTwo: {
    hand: [instituteOfTechnologyHoneyLemonsLab],
    play: [{ card: honeyLemonEndlesslyCurious, isDrying: false }],
    inkwell: 3,
    discard: [jukebox],
    deck,
  },
});

export const set14AuditLabPairFixture = createFixture({
  id: "set14-audit-lab-pair",
  name: "Hyperia audit: separate Lab limits",
  skipPreGame: true,
  seed: "set14-audit-lab-pair",
  description:
    "Move one dry Super to each exact Lab copy. Quest each and verify one independent item return per location. Both Labs have the same printed name.",
  playerOne: {
    play: [
      instituteOfTechnologyHoneyLemonsLab,
      instituteOfTechnologyHoneyLemonsLab,
      { card: honeyLemonEndlesslyCurious, isDrying: false },
      { card: honeyLemonTestingTheLimits, isDrying: false },
    ],
    inkwell: 2,
    discard: [jukebox, riveraFamilyPhoto],
    deck,
  },
  playerTwo: { deck },
});

export const set14AuditArthurNoLocationFixture = createFixture({
  id: "set14-audit-arthur-no-location",
  name: "Hyperia audit: Arthur without locations",
  skipPreGame: true,
  seed: "set14-audit-arthur-no-location",
  description:
    "Play Arthur for three with no locations. Resolve entry without movement or ink drops; verify drying, next-own-turn quest for one and normal inking after reset.",
  playerOne: { hand: [arthurMerlinsAssistant], inkwell: 3, deck },
  playerTwo: { deck },
});

export const set14AuditArthurPlayerTwoPairFixture = createFixture({
  id: "set14-audit-arthur-player-two-pair",
  name: "Hyperia audit: player-two Arthur pair",
  skipPreGame: true,
  seed: "set14-audit-arthur-player-two-pair",
  description:
    "Pass to player two. Play two Arthurs and freely move each to an own Lab: each earns its own first drop. Opposing Lab is excluded. Move each again in the same turn and verify no extra drop.",
  playerOne: { play: [instituteOfTechnologyHoneyLemonsLab], deck },
  playerTwo: {
    hand: [arthurMerlinsAssistant, arthurMerlinsAssistant],
    play: [instituteOfTechnologyHoneyLemonsLab, instituteOfTechnologyHoneyLemonsLab],
    inkwell: 8,
    deck,
  },
});

export const set14AuditFlashPairFixture = createFixture({
  id: "set14-audit-flash-pair",
  name: "Hyperia audit: Flash pair global Rush",
  skipPreGame: true,
  seed: "set14-audit-flash-pair",
  description:
    "One Flash on each side suppresses both fresh Maui copies. Return one Flash then the other; Rush must return only after the last Flash leaves.",
  playerOne: {
    play: [flashEfficientClerk, { card: mauiHeroToAll, isDrying: true }],
    hand: [motherKnowsBest, motherKnowsBest],
    inkwell: 6,
    deck,
  },
  playerTwo: {
    play: [
      flashEfficientClerk,
      { card: mauiHeroToAll, isDrying: true },
      { card: captainHookConcernedCaptain, exerted: true },
    ],
    deck,
  },
});

export const set14AuditFlashDamageFixture = createFixture({
  id: "set14-audit-flash-damage",
  name: "Hyperia audit: Flash zero and lethal damage",
  skipPreGame: true,
  seed: "set14-audit-flash-damage",
  description:
    "Quick Shot deals one reduced to zero on Flash and still draws. Smash deals three reduced to two and banishes Flash. Check public prevention and lethal damage logs.",
  playerOne: { hand: [quickShot, smash], inkwell: 5, deck },
  playerTwo: { play: [flashEfficientClerk, { card: mauiHeroToAll, isDrying: true }], deck },
});

export const set14AuditFlashPlayFixture = createFixture({
  id: "set14-audit-flash-play",
  name: "Hyperia audit: Flash play and quest",
  skipPreGame: true,
  seed: "set14-audit-flash-play",
  description:
    "Flash cannot be inked. Play for two, verify Resist +1 and fresh-ink quest restriction, then pass both turns and quest for two lore.",
  playerOne: { hand: [flashEfficientClerk], inkwell: 2, deck },
  playerTwo: { deck },
});

export const set14AuditFlashExpiryFixture = createFixture({
  id: "set14-audit-flash-expiry",
  name: "Hyperia audit: Flash temporary Rush expiry",
  skipPreGame: true,
  seed: "set14-audit-flash-expiry",
  description:
    "Activate Rocket to grant fresh Fru Fru Rush this turn, then play Flash to suppress it. Pass to player two and return Flash with Mother Knows Best. The expired grant must not restore Rush.",
  playerOne: {
    hand: [flashEfficientClerk],
    play: [mushusRocket, { card: fruFruVipGuest, isDrying: true }],
    inkwell: 4,
    deck,
  },
  playerTwo: {
    hand: [motherKnowsBest],
    inkwell: 3,
    play: [{ card: captainHookConcernedCaptain, exerted: true }],
    deck,
  },
});

export const set14AuditFlashOpposingGrantFixture = createFixture({
  id: "set14-audit-flash-opposing-grant",
  name: "Hyperia audit: Flash blocks opposing Rush grant",
  skipPreGame: true,
  seed: "set14-audit-flash-opposing-grant",
  description:
    "Activate Rocket on opposing fresh Fru Fru while Flash is in play. Return Flash in the same turn. The prohibited Rush grant must not appear after removal.",
  playerOne: {
    play: [flashEfficientClerk, mushusRocket],
    hand: [motherKnowsBest],
    inkwell: 5,
    deck,
  },
  playerTwo: { play: [{ card: fruFruVipGuest, isDrying: true }], deck },
});

export const set14AuditImeldaInsufficientPlayerTwoFixture = createFixture({
  id: "set14-audit-imelda-insufficient-player-two",
  name: "Hyperia audit: Imelda zero and one discard",
  description:
    "Pass to player two. Play the first Imelda with no own discard cards: the three-card return must be unavailable. Banish her, then play the second with only one own discard card and banish her too. Three opposing discard cards never enable the return.",
  skipPreGame: true,
  seed: "set14-audit-imelda-insufficient-player-two",
  playerOne: { discard: [fruFruVipGuest, priyaMangalImmovableFan, scuttleDirectingTraffic], deck },
  playerTwo: {
    hand: [mamImeldaNononsenseAncestor, mamImeldaNononsenseAncestor],
    inkwell: 8,
    deck,
  },
});

export const set14AuditImeldaOrderPlayerTwoFixture = createFixture({
  id: "set14-audit-imelda-order-player-two",
  name: "Hyperia audit: Imelda player-two return order",
  description:
    "Pass to player two, who draws the only starting deck card. Play Imelda, return exactly three own discard cards, then use three Khan actions to draw them in the chosen bottom order. The opposing discard stays unchanged and Imelda stays in play.",
  skipPreGame: true,
  seed: "set14-audit-imelda-order-player-two",
  playerOne: { discard: [fruFruVipGuest], deck },
  playerTwo: {
    hand: [
      mamImeldaNononsenseAncestor,
      khanTransportDelivery,
      khanTransportDelivery,
      khanTransportDelivery,
    ],
    discard: [fruFruVipGuest, priyaMangalImmovableFan, scuttleDirectingTraffic],
    inkwell: 10,
    deck: [ancestralGuitar],
  },
});

export const set14AuditCocoOwnershipFixture = createFixture({
  id: "set14-audit-coco-ownership",
  name: "Hyperia audit: Coco ownership and negative triggers",
  description:
    "Each player has Coco. Player one plays A Very Merry Unbirthday: only player two's Coco gains lore. Pass, then player two mills their own last two cards with Photo and tries Photo on the empty deck. Play the opposing mill song and discard Fru Fru for Demona: only the correct deck-to-discard batches grant lore, and each bonus ends with its turn.",
  skipPreGame: true,
  seed: "set14-audit-coco-ownership",
  playerOne: {
    play: [mamCocoVisitingThePark],
    hand: [aVeryMerryUnbirthday],
    inkwell: 1,
    deck,
  },
  playerTwo: {
    play: [
      mamCocoVisitingThePark,
      riveraFamilyPhoto,
      riveraFamilyPhoto,
      demonaImperiousSpellcaster,
    ],
    hand: [aVeryMerryUnbirthday, fruFruVipGuest],
    inkwell: 3,
    deck: [fruFruVipGuest, fruFruVipGuest, fruFruVipGuest, fruFruVipGuest, fruFruVipGuest],
  },
});

export const set14AuditCocoShortDeckPlayerTwoFixture = createFixture({
  id: "set14-audit-coco-short-deck-player-two",
  name: "Hyperia audit: Coco player-two one-card mill",
  description:
    "Pass to player two, drawing one of the two deck cards. Activate Photo and mill the one remaining card: Coco must gain exactly one lore for this turn. Quest for two lore; do not pass with an empty deck.",
  skipPreGame: true,
  seed: "set14-audit-coco-short-deck-player-two",
  playerOne: { deck },
  playerTwo: {
    play: [mamCocoVisitingThePark, riveraFamilyPhoto],
    inkwell: 1,
    deck: [fruFruVipGuest, priyaMangalImmovableFan],
  },
});

export const set14AuditGoliathPlayerTwoResetFixture = createFixture({
  id: "set14-audit-goliath-player-two-reset",
  name: "Hyperia audit: Goliath player-two zero and reset",
  description:
    "Pass to player two. Three starting hand cards keep exerted Goliath from readying. Discard Fru Fru, select opposing Powerline, and move zero damage. The use is spent. Ink Scuttle to leave two cards before the next own turn: Goliath readies before drawing the third. After passing both turns, use the reset ability and move two lethal damage to opposing Mim.",
  skipPreGame: true,
  seed: "set14-audit-goliath-player-two-reset",
  playerOne: { play: [powerlineMegastar, madamMimBaubleChaser], deck },
  playerTwo: {
    play: [{ card: goliathTransformedWarrior, damage: 3, exerted: true }],
    hand: [fruFruVipGuest, priyaMangalImmovableFan, scuttleDirectingTraffic],
    deck,
  },
});

export const set14AuditDemonaPlayerTwoFixture = createFixture({
  id: "set14-audit-demona-player-two",
  name: "Hyperia audit: Demona player-two repeat and duration",
  description:
    "Pass to player two: three starting hand cards keep Demona exerted. Discard Fru Fru to grant herself Rush/Evasive, then discard Priya to grant opposing Goliath both keywords. The chooser must exclude Scuttle. Two payments leave two cards: keywords survive player one's start, expire at player two's next start, and Demona readies before drawing the third card.",
  skipPreGame: true,
  seed: "set14-audit-demona-player-two",
  playerOne: { play: [goliathTransformedWarrior, scuttleDirectingTraffic], deck },
  playerTwo: {
    play: [{ card: demonaImperiousSpellcaster, exerted: true }],
    hand: [fruFruVipGuest, priyaMangalImmovableFan, scuttleDirectingTraffic],
    deck,
  },
});

export const set14AuditDanteLoyalPlayerTwoFixture = createFixture({
  id: "set14-audit-dante-loyal-player-two",
  name: "Hyperia audit: Loyal Dante player-two Shift and falling threshold",
  description:
    "Pass to player two. Quest with damaged Dante Enthusiastic Stray, then Shift Loyal Alebrije for four ink onto the exerted base. Check inherited exertion and damage, four lore at ten own discard cards, and disabled quest. Quest Honey Lemon and accept returning Photo: nine own discard cards remove the bonus despite ten opposing discard cards. Pass both turns and quest Dante for two lore. Inspect both public logs.",
  skipPreGame: true,
  seed: "set14-audit-dante-loyal-player-two",
  playerOne: { discard: Array.from({ length: 10 }, () => fruFruVipGuest), deck },
  playerTwo: {
    play: [
      { card: danteEnthusiasticStray, damage: 1, isDrying: false },
      { card: honeyLemonIngeniousResearcher, isDrying: false },
    ],
    hand: [danteLoyalAlebrije],
    inkwell: 4,
    discard: [riveraFamilyPhoto, ...Array.from({ length: 9 }, () => fruFruVipGuest)],
    deck,
  },
});

export const set14AuditMiguelStreetPlayerTwoFixture = createFixture({
  id: "set14-audit-miguel-street-player-two",
  name: "Hyperia audit: Street Miguel player-two Singer boundary",
  description:
    "Pass to player two. Two own discarded songs grant each Miguel exactly one bonus lore and Singer 3. Quest with one for two lore. Magnificent Marvelous cannot be sung by the remaining Miguel because it costs four. Sing Un Poco Loco using only the second Miguel, whose printed cost is one but Singer value is three; select both Miguels for return. Four ready ink must remain, and both views show named singer/return logs.",
  skipPreGame: true,
  seed: "set14-audit-miguel-street-player-two",
  playerOne: { discard: [oneJumpAhead], deck },
  playerTwo: {
    play: [
      { card: miguelRiveraStreetMusician, isDrying: false },
      { card: miguelRiveraStreetMusician, isDrying: false },
    ],
    hand: [unPocoLoco, magnificentMarvelous],
    discard: [oneJumpAhead, thoughIHaveToSayGoodbye],
    inkwell: 4,
    deck,
  },
});

export const set14AuditJockPlainChallengeFixture = createFixture({
  id: "set14-audit-jock-plain-challenge",
  name: "Hyperia audit: Jock challenges a non-Evasive character",
  description:
    "Pass to player two. Challenge exerted Scuttle with Jock: Evasive must allow the ordinary target. Scuttle takes four lethal damage; Jock takes one damage, remains in play and becomes exerted. Both player views show exact damage and banishment logs.",
  skipPreGame: true,
  seed: "set14-audit-jock-plain-challenge",
  playerOne: { play: [{ card: scuttleDirectingTraffic, exerted: true }], deck },
  playerTwo: { play: [{ card: jockEnjoyingTheSights, isDrying: false }], deck },
});

export const set14AuditRuthlessPlayerTwoFixture = createFixture({
  id: "set14-audit-ruthless-player-two",
  name: "Hyperia audit: Ruthless Shere Khan boosted strength and no target",
  description:
    "Pass to player two. Play Mulan for four and grant opposing Mulan +2 strength, reaching four. Play Shere Khan for seven: only opposing Scuttle is legal; boosted Mulan, Ward Aladdin, high-strength Hook and own characters are excluded. Bottom Scuttle, increasing player-one deck from six to seven. Play the second Shere Khan for seven: no targets remain and resolution must finish without a choice or deck movement. Inspect both views and named logs.",
  skipPreGame: true,
  seed: "set14-audit-ruthless-player-two",
  playerOne: {
    play: [
      mulanMartialArtsMaster,
      scuttleDirectingTraffic,
      aladdinPrinceAli,
      captainHookConcernedCaptain,
    ],
    deck,
  },
  playerTwo: {
    hand: [mulanMartialArtsMaster, shereKhanRuthlessEntrepreneur, shereKhanRuthlessEntrepreneur],
    play: [fruFruVipGuest],
    inkwell: 18,
    deck,
  },
});

export const set14AuditBellePlayerTwoFixture = createFixture({
  id: "set14-audit-belle-player-two",
  name: "Hyperia audit: Belle player-two action and optional destinations",
  description:
    "Pass to player two and draw Fru Fru. Play six Belles for two ink each: take revealed Mosquito Bite; decline Healing Glow; decline City Guide; take Healing Glow; take City Guide; finally play with an empty deck. The two declines rotate those cards below each other. Inspect named public reveals, actual hand/deck changes, opponent privacy and absence of a stuck choice or failed draw at empty deck.",
  skipPreGame: true,
  seed: "set14-audit-belle-player-two",
  playerOne: { deck, hand: [fruFruVipGuest] },
  playerTwo: {
    hand: Array.from({ length: 6 }, () => belleReflectiveWriter),
    inkwell: 12,
    deck: [bellesCityGuide, healingGlow, mosquitoBite, fruFruVipGuest],
  },
});

export const set14AuditBobbyCopiesPlayerTwoFixture = createFixture({
  id: "set14-audit-bobby-copies-player-two",
  name: "Hyperia audit: Bobby copies and independent grants",
  description:
    "Pass to player two. Activate the first Cheese-a with bank ink: exactly one drop. Return one Bobby with Befuddle; the second still grants the ability. Activate a second Cheese-a with bank ink: total two drops. Return the last Bobby; the third ready Cheese-a must lose Scrumptious despite one ready ink and two drops. Opposing Cheese-a and own Skates never gain it. Inspect costs, source removal and both public logs.",
  skipPreGame: true,
  seed: "set14-audit-bobby-copies-player-two",
  playerOne: { play: [leaningTowerOfCheesea], inkDrops: 4, deck },
  playerTwo: {
    play: [
      bobbyZimuruskiSoundboardWhiz,
      bobbyZimuruskiSoundboardWhiz,
      leaningTowerOfCheesea,
      leaningTowerOfCheesea,
      leaningTowerOfCheesea,
      inkcasterSkates,
    ],
    hand: [befuddle, befuddle],
    inkwell: 5,
    deck,
  },
});

export const set14AuditRussellOrderPlayerTwoFixture = createFixture({
  id: "set14-audit-russell-order-player-two",
  name: "Hyperia audit: Russell player-two natural bottom draws",
  description:
    "Pass to player two, drawing Fru Fru. Activate Russell: publicly reveal One Jump Ahead and Dragon Fire, move Dragon Fire left into the Drawn last position on the bottom row, and confirm. Pass both turns to draw One Jump Ahead first. Activate Russell on the remaining Dragon Fire and finish it to the bottom. Pass both turns to draw Dragon Fire last. Activate with empty deck: no choice or failed draw; stop before another turn. Two ready ink remain throughout; inspect both player views and public ordering logs.",
  skipPreGame: true,
  seed: "set14-audit-russell-order-player-two",
  playerOne: { deck },
  playerTwo: {
    play: [{ card: russellFindingAdventure, isDrying: false }],
    deck: [dragonFire, oneJumpAhead, fruFruVipGuest],
    inkwell: 2,
  },
});

export const set14AuditGoofyBandPlayerTwoFixture = createFixture({
  id: "set14-audit-goofy-band-player-two",
  name: "Hyperia audit: Goofy Player-two multiple exerted Singers",
  description:
    "Pass to player two, drawing One Jump Ahead normally. Quest both Singers to exert them, then play Goofy for four ink with two exerted friendly Singers. Draw exactly one Scuttle; Fru Fru remains in deck. Inspect both views: the opponent sees the source and one-card draw, but no private drawn identity.",
  skipPreGame: true,
  seed: "set14-audit-goofy-band-player-two",
  playerOne: { deck },
  playerTwo: {
    hand: [goofyKnowsTheBand],
    play: [
      { card: gazellePopDiva, exerted: true, isDrying: false },
      { card: hctorRiveraStreetMusician, exerted: true, isDrying: false },
    ],
    inkwell: 4,
    deck: [fruFruVipGuest, scuttleDirectingTraffic, oneJumpAhead],
  },
});

export const set14AuditGoofyBandDryingSingerFixture = createFixture({
  id: "set14-audit-goofy-band-drying-singer",
  name: "Hyperia audit: Goofy Drying Singer qualifies",
  description:
    "Play Goofy for four ink with only a drying Gazelle. VIP Access draws exactly one Scuttle, leaving Fru Fru in deck. Inspect public source/count and private drawn identity in both views.",
  skipPreGame: true,
  seed: "set14-audit-goofy-band-drying-singer",
  playerOne: {
    hand: [goofyKnowsTheBand],
    play: [{ card: gazellePopDiva, isDrying: true }],
    inkwell: 4,
    deck: [fruFruVipGuest, scuttleDirectingTraffic],
  },
  playerTwo: { deck },
});

export const set14AuditGoofyBandEmptyFixture = createFixture({
  id: "set14-audit-goofy-band-empty",
  name: "Hyperia audit: Goofy Empty deck draw completes",
  description:
    "Play Goofy with an exerted friendly Singer and an empty deck. The ability completes without a choice, fabricated draw or immediate defeat. Stop before passing the turn. Inspect both views.",
  skipPreGame: true,
  seed: "set14-audit-goofy-band-empty",
  playerOne: {
    hand: [goofyKnowsTheBand],
    play: [{ card: gazellePopDiva, exerted: true, isDrying: false }],
    inkwell: 4,
    deck: [],
  },
  playerTwo: { deck },
});

export const set14AuditJudyVigilantPlayerTwoFixture = createFixture({
  id: "set14-audit-judy-vigilant-player-two",
  name: "Hyperia audit: Judy Player-two Shift, decline and friendly current strength",
  description:
    "Pass to player two. Quest damaged Day Camp Instructor and decline Support, play Mulan to boost friendly Koslov from four to six, and play Distract to reduce opposing Fox from five to three. Shift first Judy for two onto exerted damaged base, then decline: nothing banishes. Play second Judy normally; accept and banish friendly boosted Koslov. Opposing Yax is also legal; reduced Fox is excluded. Inspect both player logs, cost and inheritance.",
  skipPreGame: true,
  seed: "set14-audit-judy-vigilant-player-two",
  playerOne: { deck, play: [foxXanatosCharismaticOutlaw, yaxConcertGoer] },
  playerTwo: {
    hand: [mulanMartialArtsMaster, distract, judyHoppsAlwaysVigilant, judyHoppsAlwaysVigilant],
    play: [
      { card: judyHoppsDayCampInstructor, damage: 1, isDrying: false },
      koslovImposingEnforcer,
    ],
    inkwell: 12,
    deck,
  },
});

export const set14AuditJudyVigilantNegativesFixture = createFixture({
  id: "set14-audit-judy-vigilant-negatives",
  name: "Hyperia audit: Judy Prior-turn and action-only exclusions",
  description:
    "Play Fru Fru, pass both turns, then play Distract on opposing Yax and play Judy. Earlier-turn character and this-turn action do not enable GOT YOU NOW; Yax remains in play and no choice appears.",
  skipPreGame: true,
  seed: "set14-audit-judy-vigilant-negatives",
  playerOne: { hand: [fruFruVipGuest, distract, judyHoppsAlwaysVigilant], inkwell: 6, deck },
  playerTwo: { deck, play: [yaxConcertGoer] },
});

export const set14AuditJudyVigilantNoTargetFixture = createFixture({
  id: "set14-audit-judy-vigilant-no-target",
  name: "Hyperia audit: Judy No eligible target completes",
  description:
    "Play Fru Fru then Judy. All characters are below strength five; GOT YOU NOW finishes without a choice or movement. Verify named automatic decline log and active game.",
  skipPreGame: true,
  seed: "set14-audit-judy-vigilant-no-target",
  playerOne: { hand: [fruFruVipGuest, judyHoppsAlwaysVigilant], inkwell: 5, deck },
  playerTwo: { deck, play: [koslovImposingEnforcer] },
});

export const set14AuditNickBackupPlayerTwoFixture = createFixture({
  id: "set14-audit-nick-backup-player-two",
  name: "Hyperia audit: Nick player-two current strength and decline",
  description:
    "Pass to player two. The two friendly Nicks count as another Detective for each other. Play Mulan for four, boost one Nick to five, and quest him. Support excludes the questing source, allows the other Nick and opposing Koslov, and adds current five strength to opposing Koslov (four to nine). Quest the second Nick and decline Support; no strength changes. Pass to expire both boosts. Inspect both player logs and source/target badges.",
  skipPreGame: true,
  seed: "set14-audit-nick-backup-player-two",
  playerOne: { deck, play: [koslovImposingEnforcer] },
  playerTwo: {
    deck,
    hand: [mulanMartialArtsMaster],
    inkwell: 4,
    play: [nickWildeProvidingBackup, nickWildeProvidingBackup],
  },
});

export const set14AuditMiguelAccomplishedPlayerTwoFixture = createFixture({
  id: "set14-audit-miguel-accomplished-player-two",
  name: "Hyperia audit: Miguel Player-two exerted and drying Shift",
  description:
    "Pass to player two. Quest dry damaged Street Musician, Shift first Accomplished for three onto it, and return only own Fru Fru. Play Street Musician for one then Shift second Accomplished for three onto the fresh Street Musician; return own Judy. Song/item/opposing discard are excluded, no Skip is allowed. First Shift retains exertion and one damage; second stays Fresh Ink with quest blocked. Inspect both named source/target logs.",
  skipPreGame: true,
  seed: "set14-audit-miguel-accomplished-player-two",
  playerOne: { deck, discard: [koslovImposingEnforcer] },
  playerTwo: {
    deck,
    hand: [
      miguelRiveraStreetMusician,
      miguelRiveraAccomplishedMusician,
      miguelRiveraAccomplishedMusician,
    ],
    play: [{ card: miguelRiveraStreetMusician, damage: 1, isDrying: false }],
    discard: [fruFruVipGuest, judyHoppsHelpfulOfficer, oneJumpAhead, riveraFamilyPhoto],
    inkwell: 7,
  },
});

export const set14AuditMiguelAccomplishedEmptyFixture = createFixture({
  id: "set14-audit-miguel-accomplished-empty",
  name: "Hyperia audit: Miguel Empty discard finishes",
  description:
    "Play Accomplished for five with an empty own discard and an opposing discarded character. The ability completes with no return or chooser and no opponent card movement. Inspect both views.",
  skipPreGame: true,
  seed: "set14-audit-miguel-accomplished-empty",
  playerOne: { deck, hand: [miguelRiveraAccomplishedMusician], inkwell: 5 },
  playerTwo: { deck, discard: [koslovImposingEnforcer] },
});

export const set14AuditMiguelAccomplishedNonCharacterFixture = createFixture({
  id: "set14-audit-miguel-accomplished-non-character",
  name: "Hyperia audit: Miguel Non-character discard finishes",
  description:
    "Play Accomplished for five with only a song and item in own discard and an opposing discarded character. No legal character return or chooser; all discard cards stay. Inspect both named logs.",
  skipPreGame: true,
  seed: "set14-audit-miguel-accomplished-non-character",
  playerOne: {
    deck,
    hand: [miguelRiveraAccomplishedMusician],
    inkwell: 5,
    discard: [oneJumpAhead, riveraFamilyPhoto],
  },
  playerTwo: { deck, discard: [koslovImposingEnforcer] },
});

export const set14AuditMiguelAccomplishedInsufficientFixture = createFixture({
  id: "set14-audit-miguel-accomplished-insufficient",
  name: "Hyperia audit: Miguel Shift ink rejection",
  description:
    "With only two ready ink, Accomplished in hand and a matching Street Musician in play, Shift needs three and is disabled. Normal play needs five and is also disabled. Discard and source remain unchanged.",
  skipPreGame: true,
  seed: "set14-audit-miguel-accomplished-insufficient",
  playerOne: {
    deck,
    hand: [miguelRiveraAccomplishedMusician],
    inkwell: 2,
    play: [miguelRiveraStreetMusician],
    discard: [fruFruVipGuest],
  },
  playerTwo: { deck },
});

export const set14AuditMiguelAccomplishedWrongNameFixture = createFixture({
  id: "set14-audit-miguel-accomplished-wrong-name",
  name: "Hyperia audit: Miguel Shift name rejection",
  description:
    "With three ready ink and only Judy in play, Shift is disabled because the name does not match Miguel Rivera. Normal play also needs five. Source, discard and ink remain unchanged.",
  skipPreGame: true,
  seed: "set14-audit-miguel-accomplished-wrong-name",
  playerOne: {
    deck,
    hand: [miguelRiveraAccomplishedMusician],
    inkwell: 3,
    play: [judyHoppsHelpfulOfficer],
    discard: [fruFruVipGuest],
  },
  playerTwo: { deck },
});

export const set14AuditShedLoadPlayerTwoFixture = createFixture({
  id: "set14-audit-shed-load-player-two",
  name: "Hyperia audit: Shed Load Player-two mixed reveal and repeat",
  description:
    "Pass to player two. Sing the first Shed Your Weary Load with Max for free: opposing Dragon Fire, Rivera Family Photo and Hyperia City Express discard, Fru Fru and Judy stay revealed. Pay five for the second copy against the remaining character-only hand; no extra discard. Own Dragon Fire remains in hand. Check public reveals, all discard names and both logs.",
  skipPreGame: true,
  seed: "set14-audit-shed-load-player-two",
  playerOne: {
    deck,
    hand: [
      fruFruVipGuest,
      judyHoppsHelpfulOfficer,
      dragonFire,
      riveraFamilyPhoto,
      hyperiaCityExpress,
    ],
  },
  playerTwo: {
    deck,
    hand: [shedYourWearyLoad, shedYourWearyLoad, dragonFire],
    play: [maxGoofMusicLover],
    inkwell: 5,
  },
});

export const set14AuditShedLoadEmptyPlayerTwoFixture = createFixture({
  id: "set14-audit-shed-load-empty-player-two",
  name: "Hyperia audit: Shed Load Player-two empty hand",
  description:
    "Pass to player two. Sing one copy with Max, then pay five for the other against the empty opposing hand. Both complete with no chooser, fabricated reveal or discard. Own hand remains except the two songs. Inspect both views.",
  skipPreGame: true,
  seed: "set14-audit-shed-load-empty-player-two",
  playerOne: { deck, hand: [] },
  playerTwo: {
    deck,
    hand: [shedYourWearyLoad, shedYourWearyLoad, dragonFire],
    play: [maxGoofMusicLover],
    inkwell: 5,
  },
});

export const set14AuditShedLoadAllNonCharacterFixture = createFixture({
  id: "set14-audit-shed-load-all-non-character",
  name: "Hyperia audit: Shed Load All non-characters discard",
  description:
    "Pass to player two and sing with Max at zero ink. Opposing action, item and location all reveal and discard, leaving hand empty. Own Dragon Fire stays in hand. All three exact discard identities must be in both public logs.",
  skipPreGame: true,
  seed: "set14-audit-shed-load-all-non-character",
  playerOne: { deck, hand: [dragonFire, riveraFamilyPhoto, hyperiaCityExpress] },
  playerTwo: { deck, hand: [shedYourWearyLoad, dragonFire], play: [maxGoofMusicLover] },
});

export const set14AuditPowerlinePlayerTwoFixture = createFixture({
  id: "set14-audit-powerline-player-two",
  name: "Hyperia audit: player-two Powerline repeat-turn recovery",
  skipPreGame: true,
  seed: "set14-audit-powerline-player-two",
  description:
    "Pass to player two. Sing One Jump Ahead with Max and return Max; Goofy and Fru Fru are not Singers. Pay two for the second song: no second recovery. Banish own Gazelle with Dragon Fire and quest Powerline for two lore. Pass; player one pays for their song without triggering opposing Powerline. Pass back; sing the third song with Powerline and return Gazelle, proving recovery resets. Own discard only; both return logs are public.",
  playerOne: {
    hand: [oneJumpAhead],
    play: [powerlineMegastar],
    discard: [fruFruVipGuest],
    inkwell: 2,
    deck,
  },
  playerTwo: {
    hand: [oneJumpAhead, oneJumpAhead, oneJumpAhead, dragonFire],
    play: [powerlineMegastar, maxGoofMusicLover, gazellePopDiva],
    discard: [goofyKnowsTheBand, maxGoofMusicLover, fruFruVipGuest],
    inkwell: 9,
    deck,
  },
});

export const set14AuditAuroraPlayerTwoFixture = createFixture({
  id: "set14-audit-aurora-player-two",
  name: "Hyperia audit: player-two Aurora cost and repeat boundaries",
  skipPreGame: true,
  seed: "set14-audit-aurora-player-two",
  description:
    "Pass to player two. Sing Friends on the Other Side3 with Koslov and Magnificent Marvelous4 with Max. Play Aurora3: only the current cost-three song can return, excluding the old duplicate, cost-four song and action. Pay3 to replay the returned song; second Aurora3 can return it again. End turn gains one lore per Aurora, not per song; opposing Aurora gains none. Pass both turns without songs to prove the condition resets.",
  playerOne: { play: [auroraDelightfulMusician], discard: [friendsOnTheOtherSide], deck },
  playerTwo: {
    hand: [
      friendsOnTheOtherSide,
      magnificentMarvelous,
      auroraDelightfulMusician,
      auroraDelightfulMusician,
    ],
    play: [koslovImposingEnforcer, maxGoofMusicLover],
    discard: [friendsOnTheOtherSide, dragonFire],
    inkwell: 12,
    deck: [...deck, ...deck],
  },
});

export const set14AuditNeverApartPlayerTwoFixture = createFixture({
  id: "set14-audit-never-apart-player-two",
  name: "Hyperia audit: player-two Never Too Far Apart",
  skipPreGame: true,
  seed: "set14-audit-never-apart-player-two",
  description:
    "Pass to player two, then Sing Together with Max5 and Gazelle4 at zero ink. Only player two sees the nine looked cards. Choose three of four Singers; the fourth and non-Singers stay at bottom. Both logs reveal only selected Singer identities. Opponent normal draw and hidden bottom identities remain private.",
  playerOne: { deck },
  playerTwo: {
    hand: [neverTooFarApart],
    play: [maxGoofMusicLover, gazellePopDiva],
    deck: [
      fruFruVipGuest,
      judyHoppsHelpfulOfficer,
      oneJumpAhead,
      miguelRiveraStreetMusician,
      shedYourWearyLoad,
      maxGoofMusicLover,
      gazellePopDiva,
      arielSpectacularSinger,
      cinderellaGentleAndKind,
      fruFruVipGuest,
    ],
  },
});
export const set14AuditNeverApartUnavailablePlayerTwoFixture = createFixture({
  id: "set14-audit-never-apart-unavailable-player-two",
  name: "Hyperia audit: player-two unavailable Singers",
  skipPreGame: true,
  seed: "set14-audit-never-apart-unavailable-player-two",
  description:
    "Pass to player two. Play Max for three ink: fresh Max5 plus ready Gazelle4 cannot sing. Pass both turns, then quest Max: exerted Max plus Gazelle still cannot sing. Song remains in hand and no look or reveal opens.",
  playerOne: { deck },
  playerTwo: {
    hand: [neverTooFarApart, maxGoofMusicLover],
    play: [gazellePopDiva],
    inkwell: 3,
    deck: [...deck, ...deck],
  },
});

export const set14AuditRememberMePlayerTwoFixture = createFixture({
  id: "set14-audit-remember-me-player-two",
  name: "Hyperia audit: player-two repeated Remember Me",
  skipPreGame: true,
  seed: "set14-audit-remember-me-player-two",
  description:
    "Pass to player two. Sing Together with Aladdin2/Koslov4, play Fru from discard for1 exerted, then pay6 for a second Remember Me. Hand Fru remains blocked despite3ink; unused Priya/action are not forced. Pass: player one can play their Fru. Pass back: hand Fru is legal and enters ready, unused Priya no longer has discard permission.",
  playerOne: { hand: [fruFruVipGuest], discard: [fruFruVipGuest], inkwell: 10, deck },
  playerTwo: {
    hand: [rememberMe, rememberMe, fruFruVipGuest],
    play: [aladdinPrinceAli, koslovImposingEnforcer],
    discard: [fruFruVipGuest, priyaMangalImmovableFan, magnificentMarvelous],
    inkwell: 10,
    deck: [...deck, ...deck],
  },
});
export const set14AuditRememberMePairPlayerTwoFixture = createFixture({
  id: "set14-audit-remember-me-pair-player-two",
  name: "Hyperia audit: combined name played first",
  skipPreGame: true,
  seed: "set14-audit-remember-me-pair-player-two",
  description:
    "Pass to player two. Sing Remember Me with Aladdin/Koslov, then play Mickey Mouse and Minnie Mouse Adventuring Duo from discard for7 exerted. Both individual Mickey and Minnie cards in hand and discard must be blocked despite13ink.",
  playerOne: { deck },
  playerTwo: {
    hand: [rememberMe, mickeyMouseTrueFriend, minnieMouseBelovedPrincess],
    play: [aladdinPrinceAli, koslovImposingEnforcer],
    discard: [
      mickeyMouseMinnieMouseAdventuringDuo,
      mickeyMouseTrueFriend,
      minnieMouseBelovedPrincess,
    ],
    inkwell: 20,
    deck,
  },
});
export const set14AuditRememberMeHalfPlayerTwoFixture = createFixture({
  id: "set14-audit-remember-me-half-player-two",
  name: "Hyperia audit: individual name played first",
  skipPreGame: true,
  seed: "set14-audit-remember-me-half-player-two",
  description:
    "Pass to player two. Sing Remember Me, then play Mickey Mouse True Friend from discard for3. The combined Mickey/Minnie card must be blocked despite17ink. Minnie has a different unused name and remains playable.",
  playerOne: { deck },
  playerTwo: {
    hand: [rememberMe, mickeyMouseMinnieMouseAdventuringDuo, minnieMouseBelovedPrincess],
    play: [aladdinPrinceAli, koslovImposingEnforcer],
    discard: [mickeyMouseTrueFriend, mickeyMouseMinnieMouseAdventuringDuo],
    inkwell: 20,
    deck,
  },
});

export const set14AuditNeverCryPlayerTwoFixture = createFixture({
  id: "set14-audit-never-cry-player-two",
  name: "Hyperia audit: player-two Never Gonna Let You Cry",
  skipPreGame: true,
  seed: "set14-audit-never-cry-player-two",
  description:
    "Pass to player two. Sing with Max Singer5, choose Fru/Priya from three own eligible cards; cost3 Aurora, action and opposing Fru are excluded. Two returns are public. Pay5 for the second song and choose zero; Judy remains discard, no false return appears.",
  playerOne: { discard: [fruFruVipGuest], deck },
  playerTwo: {
    hand: [neverGonnaLetYouCry, neverGonnaLetYouCry],
    play: [maxGoofMusicLover],
    discard: [
      fruFruVipGuest,
      priyaMangalImmovableFan,
      judyHoppsHelpfulOfficer,
      auroraDelightfulMusician,
      magnificentMarvelous,
    ],
    inkwell: 5,
    deck,
  },
});
export const set14AuditNeverCryNoEligiblePlayerTwoFixture = createFixture({
  id: "set14-audit-never-cry-no-eligible-player-two",
  name: "Hyperia audit: player-two no eligible discard",
  skipPreGame: true,
  seed: "set14-audit-never-cry-no-eligible-player-two",
  description:
    "Pass to player two. Sing with Max Singer5, then pay5 for the second song. Own discard has only cost3 Aurora, a song, an item and a location; opposing Fru cannot return. Both effects complete without choices or fabricated return logs.",
  playerOne: { discard: [fruFruVipGuest], deck },
  playerTwo: {
    hand: [neverGonnaLetYouCry, neverGonnaLetYouCry],
    play: [maxGoofMusicLover],
    discard: [
      auroraDelightfulMusician,
      magnificentMarvelous,
      riveraFamilyPhoto,
      hyperiaCityExpress,
    ],
    inkwell: 5,
    deck,
  },
});

export const set14AuditGuitarPlayerTwoFixture = createFixture({
  id: "set14-audit-guitar-player-two",
  name: "Hyperia audit: Ancestral Guitar Player Two",
  skipPreGame: true,
  seed: "set14-audit-guitar-player-two",
  description:
    "Pass to Player Two, play Guitar and privately draw Judy after the normal Fru draw. Pay the last ink to boost Archimedes, sing one song, then pass both turns and check the second song cannot be sung after expiry.",
  playerOne: { deck },
  playerTwo: {
    hand: [ancestralGuitar, neverGonnaLetYouCry, neverGonnaLetYouCry],
    play: [archimedesHasHadEnough],
    inkwell: 3,
    deck: [
      dragonFire,
      oneJumpAhead,
      koslovImposingEnforcer,
      pjPeteDevotedFan,
      judyHoppsHelpfulOfficer,
      fruFruVipGuest,
    ],
  },
});

export const set14AuditGuitarEmptyPlayerTwoFixture = createFixture({
  id: "set14-audit-guitar-empty-player-two",
  name: "Hyperia audit: Ancestral Guitar empty Player Two",
  skipPreGame: true,
  seed: "set14-audit-guitar-empty-player-two",
  description:
    "Pass to Player Two to draw the last Fru, then play Guitar with an empty deck. Check no invented card, draw log, or pending choice appears in either view.",
  playerOne: { deck },
  playerTwo: { hand: [ancestralGuitar], inkwell: 2, deck: [fruFruVipGuest] },
});

export const set14AuditStackPlayerTwoFixture = createFixture({
  id: "set14-audit-stack-player-two",
  name: "Hyperia audit: Speaker Stack Player Two",
  skipPreGame: true,
  seed: "set14-audit-stack-player-two",
  description:
    "Pass to Player Two. Max has four damage and survives with one Stack. Pay two for a second Stack, then Break each Stack. Check own-only Singer bonuses, unchanged Archimedes/opponent Max, and Max banishment when the last willpower bonus disappears.",
  playerOne: { play: [maxGoofMusicLover], deck },
  playerTwo: {
    play: [speakerStack, { card: maxGoofMusicLover, damage: 4 }, archimedesHasHadEnough],
    hand: [speakerStack, breakCard, breakCard],
    inkwell: 6,
    deck,
  },
});

export const set14AuditStackExpiryPlayerTwoFixture = createFixture({
  id: "set14-audit-stack-expiry-player-two",
  name: "Hyperia audit: Speaker Stack temporary Singer expiry",
  skipPreGame: true,
  seed: "set14-audit-stack-expiry-player-two",
  description:
    "Pass to Player Two, activate Guitar on Archimedes, then deal two damage twice with Fire the Cannons. Archimedes survives at 3/5 with four damage. Pass: Singer expires, Stack bonus disappears and Archimedes must be banished with Stack still in play.",
  playerOne: { deck },
  playerTwo: {
    play: [speakerStack, ancestralGuitar, archimedesHasHadEnough],
    hand: [fireTheCannons, fireTheCannons],
    inkwell: 3,
    deck,
  },
});

export const set14AuditBlessingPlayerTwoFixture = createFixture({
  id: "set14-audit-blessing-player-two",
  name: "Hyperia audit: Mamá Imelda's Blessing Player Two",
  skipPreGame: true,
  seed: "set14-audit-blessing-player-two",
  description:
    "Pass to Player Two and activate each Blessing for one ink, targeting opposing Powerline and Archimedes. On Player One's turn both have -1 strength and cannot sing either single or together. At Player Two's next start both effects expire; pass back and sing Never Cry with Powerline, Friends with plain Archimedes. Check public source, target, duration and restored singing logs.",
  playerOne: {
    play: [powerlineMegastar, archimedesHasHadEnough],
    hand: [neverGonnaLetYouCry, friendsOnTheOtherSide],
    deck,
  },
  playerTwo: { play: [mamImeldasBlessing, mamImeldasBlessing], inkwell: 2, deck },
});

export const set14AuditPortPlayerTwoFixture = createFixture({
  id: "set14-audit-port-player-two",
  name: "Hyperia audit: Port Authority Player Two",
  skipPreGame: true,
  seed: "set14-audit-port-player-two",
  description:
    "Pass to Player Two. Move Fru to Belle's House first: no reward. Move Archimedes to Port, then Fru to Port: each player gets one lore/drop only once. Move Archimedes away/back in the same turn: no extra reward. Pass both turns and repeat to prove reset. Observe named public movement/rewards in both views.",
  playerOne: { deck },
  playerTwo: {
    play: [
      portAuthorityCenterHub,
      bellesHouseMauricesWorkshop,
      fruFruVipGuest,
      archimedesHasHadEnough,
    ],
    inkwell: 7,
    deck,
  },
});

// Diagnostic action: force movement outside the location controller's turn.
// This isolates the timing restriction without changing Port Authority's definition.
export const set14AuditPortOpposingMoveFixture = createFixture({
  id: "set14-audit-port-opposing-move",
  name: "Hyperia audit: Port Authority opposing-turn diagnostic",
  skipPreGame: true,
  seed: "set14-audit-port-opposing-move",
  description:
    "Player One plays the diagnostic Move Rival action to move Player Two's Fru to their Port Authority on the opposing turn. No WELCOME TO TOWN reward should occur. This action is an audit harness card, not a printed Lorcana card.",
  playerOne: {
    hand: [
      {
        ...dragonFire,
        id: "audit-port-forced-move",
        name: "Audit Move Rival",
        cost: 1,
        text: "Audit harness: move each opposing character to their location.",
        abilities: [
          {
            type: "action",
            effect: {
              type: "move-to-location",
              cost: "free",
              character: {
                selector: "all",
                count: "all",
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["character"],
              },
              location: {
                selector: "all",
                count: "all",
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["location"],
              },
            },
          },
        ],
      },
    ],
    inkwell: 1,
    deck,
  },
  playerTwo: { play: [portAuthorityCenterHub, fruFruVipGuest], deck },
});

export const set14AuditOwenPlayerTwoFixture = createFixture({
  id: "set14-audit-owen-player-two",
  name: "Hyperia audit: Owen Burnett Player Two item returns",
  skipPreGame: true,
  seed: "set14-audit-owen-player-two",
  description:
    "Pass to Player Two. First Owen returns own Guitar (cost two) to own hand; second returns opposing Speaker Stack (cost two) to opponent hand. Picker excludes Port, Powerline and Owen. Third entry has no eligible permanent and must complete without another return. Check both views and owner hand destinations.",
  playerOne: { play: [speakerStack, powerlineMegastar], deck },
  playerTwo: {
    play: [ancestralGuitar, portAuthorityCenterHub],
    hand: [
      owenBurnettXanatossAssistant,
      owenBurnettXanatossAssistant,
      owenBurnettXanatossAssistant,
    ],
    inkwell: 9,
    deck,
  },
});

export const set14AuditLexingtonPlayerTwoFixture = createFixture({
  id: "set14-audit-lexington-player-two",
  name: "Hyperia audit: Lexington Player Two hand threshold",
  skipPreGame: true,
  seed: "set14-audit-lexington-player-two",
  description:
    "Pass to Player Two: Lexington readies with two hand cards before draw raises hand to three. Quest as setup, then pass both turns: with three before draw, Lexington stays exerted and hand becomes four. First Fan leaves three and cannot ready; second leaves two and readies. Check no false ready log and both views.",
  playerOne: { deck },
  playerTwo: {
    play: [{ card: lexingtonFearlessFlier, exerted: true }],
    hand: [fanTheFlames, fanTheFlames],
    inkwell: 2,
    deck,
  },
});

export const set14AuditLexingtonDefenderPlayerTwoFixture = createFixture({
  id: "set14-audit-lexington-defender-player-two",
  name: "Hyperia audit: Lexington Player Two Evasive defender",
  skipPreGame: true,
  seed: "set14-audit-lexington-defender-player-two",
  description:
    "Player Two Lexington is exerted with Evasive. Plain Scuttle cannot challenge; Evasive Archimedes can, dealing two damage to banish Lexington and taking three retaliation damage. Check both public logs.",
  playerOne: { play: [scuttleDirectingTraffic, archimedesHasHadEnough], deck },
  playerTwo: { play: [{ card: lexingtonFearlessFlier, exerted: true }], deck },
});

export const set14AuditShadowPlayerTwoFixture = createFixture({
  id: "set14-audit-shadow-player-two",
  name: "Hyperia audit: Shadow Player Two exert choices",
  skipPreGame: true,
  seed: "set14-audit-shadow-player-two",
  description:
    "Pass to Player Two. First Shadow chooses opposing Scuttle, leaving Archimedes ready. Second chooses already exerted Scuttle. Third declines. Picker must exclude own Fru and Shadows; public logs show only the actual first exert and selected source/target resolutions.",
  playerOne: { play: [scuttleDirectingTraffic, archimedesHasHadEnough], deck },
  playerTwo: {
    play: [fruFruVipGuest],
    hand: [
      peterPansShadowElusivePrankster,
      peterPansShadowElusivePrankster,
      peterPansShadowElusivePrankster,
    ],
    inkwell: 9,
    deck,
  },
});

export const set14AuditShadowEmptyPlayerTwoFixture = createFixture({
  id: "set14-audit-shadow-empty-player-two",
  name: "Hyperia audit: Shadow no opposing characters",
  skipPreGame: true,
  seed: "set14-audit-shadow-empty-player-two",
  description:
    "Pass to Player Two and play Shadow with only own Fru in play. No opposing target exists; resolve without a choice or invented exert log.",
  playerOne: { deck },
  playerTwo: { play: [fruFruVipGuest], hand: [peterPansShadowElusivePrankster], inkwell: 3, deck },
});

export const set14AuditShadowDefenderPlayerTwoFixture = createFixture({
  id: "set14-audit-shadow-defender-player-two",
  name: "Hyperia audit: Shadow Evasive defender",
  skipPreGame: true,
  seed: "set14-audit-shadow-defender-player-two",
  description:
    "Player Two Shadow is exerted with Evasive. Plain Scuttle cannot challenge; Evasive Archimedes can. Check two damage each, Shadow banished and both public logs.",
  playerOne: { play: [scuttleDirectingTraffic, archimedesHasHadEnough], deck },
  playerTwo: { play: [{ card: peterPansShadowElusivePrankster, exerted: true }], deck },
});

export const set14AuditDanteTrashPlayerTwoFixture = createFixture({
  id: "set14-audit-dante-trash-player-two",
  name: "Hyperia audit: Dante Player Two discard threshold",
  skipPreGame: true,
  seed: "set14-audit-dante-trash-player-two",
  description:
    "Pass to Player Two. Own nine discard gives lore one despite opposing eleven. Play Khan to make own ten: lore two. Quest for two as ability proof, then play Never Cry and return Fru/Priya: song adds one, two returns leave nine and lore drops to one. Check both views and exact return logs.",
  playerOne: { discard: Array.from({ length: 11 }, () => dragonFire), deck },
  playerTwo: {
    play: [danteStrangeAndEndearing],
    hand: [khanTransportDelivery, neverGonnaLetYouCry],
    discard: [
      fruFruVipGuest,
      priyaMangalImmovableFan,
      ...Array.from({ length: 7 }, () => dragonFire),
    ],
    inkwell: 6,
    deck,
  },
});

export const set14AuditDanteTrashDefenderPlayerTwoFixture = createFixture({
  id: "set14-audit-dante-trash-defender-player-two",
  name: "Hyperia audit: Dante Player Two Evasive defender",
  skipPreGame: true,
  seed: "set14-audit-dante-trash-defender-player-two",
  description:
    "Player Two Dante is exerted with Evasive. Plain Scuttle cannot challenge; Evasive Archimedes deals two damage, receives zero retaliation, and banishes Dante. Check both views.",
  playerOne: { play: [scuttleDirectingTraffic, archimedesHasHadEnough], deck },
  playerTwo: { play: [{ card: danteStrangeAndEndearing, exerted: true }], deck },
});

export const set14AuditFoxRushPlayerTwoFixture = createFixture({
  id: "set14-audit-fox-rush-player-two",
  name: "Hyperia audit: Fox Player Two Rush",
  description:
    "Pass to Player Two. Play Fox for five ink. Fresh Ink blocks Quest and Friends singing; Rush allows immediate challenge against exerted Tinker Bell, but excludes ready Scuttle. Fox deals five and takes zero. On the next own turn, Fox can sing Friends. Check both logs.",
  skipPreGame: true,
  seed: "set14-audit-fox-rush-player-two",
  playerOne: {
    play: [{ card: tinkerBellCuriousFairy, exerted: true }, scuttleDirectingTraffic],
    deck,
  },
  playerTwo: { hand: [foxXanatosCharismaticOutlaw, friendsOnTheOtherSide], inkwell: 5, deck },
});

export const set14AuditBrooklynReadyPlayerTwoFixture = createFixture({
  id: "set14-audit-brooklyn-ready-player-two",
  name: "Hyperia audit: Brooklyn Player Two Ready before Draw",
  skipPreGame: true,
  seed: "brooklyn-p2-ready",
  description:
    "Pass to Player Two. Brooklyn readies at own hand two before draw raises it to three. Quest as setup, pass both turns: own hand three prevents ready before draw raises to four. Both views must show only the first ready outcome.",
  playerOne: { deck },
  playerTwo: {
    play: [{ card: brooklynFullThrottle, exerted: true }],
    hand: [fruFruVipGuest, priyaMangalImmovableFan],
    deck,
  },
});
export const set14AuditBrooklynEffectPlayerTwoFixture = createFixture({
  id: "set14-audit-brooklyn-effect-player-two",
  name: "Hyperia audit: Brooklyn Player Two effect ready",
  skipPreGame: true,
  seed: "brooklyn-p2-effect",
  description:
    "Pass to Player Two. Hand three blocks ready before draw to four. Wild Ride works twice while exerted, paying twelve ink for two lore. First Fan leaves hand three and cannot ready. Second Fan leaves hand two and readies. Check both views for no false first ready outcome.",
  playerOne: { deck },
  playerTwo: {
    play: [{ card: brooklynFullThrottle, exerted: true }],
    hand: [fanTheFlames, fanTheFlames, fruFruVipGuest],
    inkwell: 14,
    deck,
  },
});
export const set14AuditBrooklynFreshPlayerTwoFixture = createFixture({
  id: "set14-audit-brooklyn-fresh-player-two",
  name: "Hyperia audit: Brooklyn Player Two Fresh Ink payment",
  skipPreGame: true,
  seed: "brooklyn-p2-fresh",
  description:
    "Pass to Player Two. Pay one for Brooklyn leaving eleven ink. Activate Wild Ride while Fresh Ink: first six ink, then five ink plus one drop. Gain two own lore, remain ready, and third activation is unavailable. Check both views and named drop removal.",
  playerOne: { deck },
  playerTwo: { hand: [brooklynFullThrottle], inkwell: 12, inkDrops: 1, deck },
});

export const set14AuditMerlinTinkererNormalPlayerTwoFixture = createFixture({
  id: "set14-audit-merlin-tinkerer-normal-player-two",
  name: "Hyperia audit: Merlin Tinkerer Player Two normal",
  skipPreGame: true,
  seed: "tinkerer-p2-normal",
  description:
    "Pass to Player Two. Pay seven for Tinkerer, get exactly one own drop. Spend it on Fru at zero ready ink. Opponent three drops unchanged. Both logs show source and one gain/removal.",
  playerOne: { inkDrops: 3, deck },
  playerTwo: { hand: [merlinInkDropTinkerer, fruFruVipGuest], inkwell: 7, deck },
});
export const set14AuditMerlinTinkererShiftPlayerTwoFixture = createFixture({
  id: "set14-audit-merlin-tinkerer-shift-player-two",
  name: "Hyperia audit: Merlin Tinkerer Player Two Shift",
  skipPreGame: true,
  seed: "tinkerer-p2-shift",
  description:
    "Pass to Player Two. Shift five targets only own dry Bauble Expert with one damage, excluding own Fru and opposing Merlin. Gain two drops instead of one, preserve damage/dry state, quest three immediately. Use both drops on Scuttle at zero ink. Both public logs.",
  playerOne: { play: [merlinBaubleExpert], inkDrops: 3, deck },
  playerTwo: {
    play: [{ card: merlinBaubleExpert, damage: 1, isDrying: false }, fruFruVipGuest],
    hand: [merlinInkDropTinkerer, scuttleDirectingTraffic],
    inkwell: 5,
    deck,
  },
});
export const set14AuditMerlinTinkererExertedPlayerTwoFixture = createFixture({
  id: "set14-audit-merlin-tinkerer-exerted-player-two",
  name: "Hyperia audit: Merlin Tinkerer Player Two exerted Shift",
  skipPreGame: true,
  seed: "tinkerer-p2-exerted",
  description:
    "Pass to Player Two. Quest Bauble Expert as setup. Select one ink drop and Shift five using four ink plus one drop. Preserve exertion and one damage, grant exactly two new drops. Quest stays unavailable. Opponent three drops unchanged. Both named public logs.",
  playerOne: { inkDrops: 3, deck },
  playerTwo: {
    play: [{ card: merlinBaubleExpert, damage: 1, isDrying: false }],
    hand: [merlinInkDropTinkerer],
    inkwell: 4,
    inkDrops: 1,
    deck,
  },
});

export const set14AuditMerlinCuriousEntryPlayerTwoFixture = createFixture({
  id: "set14-audit-merlin-curious-entry-player-two",
  name: "Hyperia audit: Curious Merlin Player Two entry and quests",
  skipPreGame: true,
  seed: "curious-p2-entry",
  description:
    "Pass to Player Two. Paid Merlin4 grants one own drop; spend on Fru at zero ink. Next own turn Fru quest must not draw, Merlin quest draws one privately. Repeat Merlin quest on a later own turn. Both source and draw-count logs; no false rewards.",
  playerOne: { inkDrops: 2, deck },
  playerTwo: { hand: [merlinProfoundlyCurious, fruFruVipGuest], inkwell: 4, deck },
});
export const set14AuditMerlinCuriousNegativePlayerTwoFixture = createFixture({
  id: "set14-audit-merlin-curious-negative-player-two",
  name: "Hyperia audit: Curious Merlin Player Two no false triggers",
  skipPreGame: true,
  seed: "curious-p2-negative",
  description:
    "Pass to Player Two. Play Fru1: no entry drop. Quest dry Fru: no draw. Challenge exerted Scuttle with dry Merlin: no draw. Both logs must have no Merlin triggered outcomes.",
  playerOne: { play: [{ card: scuttleDirectingTraffic, exerted: true }], deck },
  playerTwo: {
    play: [merlinProfoundlyCurious, fruFruVipGuest],
    hand: [fruFruVipGuest],
    inkwell: 1,
    deck,
  },
});
export const set14AuditMerlinCuriousEmptyPlayerTwoFixture = createFixture({
  id: "set14-audit-merlin-curious-empty-player-two",
  name: "Hyperia audit: Curious Merlin Player Two empty deck",
  skipPreGame: true,
  seed: "curious-p2-empty",
  description:
    "Pass to Player Two: normal draw exhausts one-card deck. Quest Merlin: gain2, resolve Thrilling Discovery with no draw outcome. Hand remains one; no pending effect. End own turn loses from empty deck. Check both views.",
  playerOne: { deck },
  playerTwo: { play: [merlinProfoundlyCurious], deck: [fruFruVipGuest] },
});

export const set14AuditOwlRushPlayerTwoFixture = createFixture({
  id: "set14-audit-owl-rush-player-two",
  name: "Hyperia audit: Owl Player Two Rush reward",
  skipPreGame: true,
  seed: "owl-p2-rush",
  description:
    "Pass to Player Two. Pay Owl3 ink0. Rush allows challenge exerted Fox, but Fresh Ink blocks quest/singing Friends and ready Scuttle is excluded. Owl deals3 takes5 and is banished; THE INDIGNITY grants1own drop. Spend on Fru at ink0. Opponent2unchanged. Both public logs.",
  playerOne: {
    play: [{ card: foxXanatosCharismaticOutlaw, exerted: true }, scuttleDirectingTraffic],
    inkDrops: 2,
    deck,
  },
  playerTwo: {
    hand: [archimedesMessengerOwl, friendsOnTheOtherSide, fruFruVipGuest],
    inkwell: 3,
    deck,
  },
});
export const set14AuditOwlDefenderPlayerTwoFixture = createFixture({
  id: "set14-audit-owl-defender-player-two",
  name: "Hyperia audit: Owl Player Two defender reward",
  skipPreGame: true,
  seed: "owl-p2-defender",
  description:
    "Player One Fox challenges exerted Player Two Owl. Owl deals3 takes5 and is banished. Player Two owns THE INDIGNITY pending trigger; resolve it in P2 view for1drop. Opposing turn reward belongs only to defender controller. Both public logs.",
  playerOne: { play: [foxXanatosCharismaticOutlaw], inkDrops: 2, deck },
  playerTwo: { play: [{ card: archimedesMessengerOwl, exerted: true }], deck },
});
export const set14AuditOwlNegativePlayerTwoFixture = createFixture({
  id: "set14-audit-owl-negative-player-two",
  name: "Hyperia audit: Owl Player Two no false rewards",
  skipPreGame: true,
  seed: "owl-p2-negative",
  description:
    "Pass to Player Two. Owl challenges Scuttle, deals3 takes1 survives: no drop. Fru challenges Fox and is banished: no Owl trigger. Pass to Player One, Dragon Fire banishes Owl by effect: no drop. Check both public logs and no pending effects.",
  playerOne: {
    play: [
      { card: scuttleDirectingTraffic, exerted: true },
      { card: foxXanatosCharismaticOutlaw, exerted: true },
    ],
    hand: [dragonFire],
    inkwell: 5,
    deck,
  },
  playerTwo: { play: [archimedesMessengerOwl, fruFruVipGuest], deck },
});

export const set14AuditMimEntryPlayerTwoFixture = createFixture({
  id: "set14-audit-mim-entry-player-two",
  name: "Hyperia audit: Mim Player Two entry timing",
  skipPreGame: true,
  seed: "mim-p2-entry",
  description:
    "Pass to Player Two. First Mim paid8 ink-only draws none. Select3drops and pay second Mim: old Mim Bauble Game draws1, incoming Upper Hand draws2, incoming Bauble Game does not see own payment. Play Khan with2ink to gain1drop and draw1. Fru paid1drop triggers only new Mim Bauble Game draw1. Both private/public logs.",
  playerOne: { inkDrops: 4, deck },
  playerTwo: {
    hand: [
      madamMimResourcefulTrickster,
      madamMimResourcefulTrickster,
      khanTransportDelivery,
      fruFruVipGuest,
    ],
    inkwell: 20,
    inkDrops: 3,
    deck: Array.from({ length: 10 }, () => fruFruVipGuest),
  },
});
export const set14AuditMimOncePlayerTwoFixture = createFixture({
  id: "set14-audit-mim-once-player-two",
  name: "Hyperia audit: Mim Player Two once and reset",
  skipPreGame: true,
  seed: "mim-p2-once",
  description:
    "P1Fru paid1drop gives no P2Mim draw. Pass to P2. Khan paid2drops draws1 for Khan and exactly1 for Bauble Game, gains1drop. Fru paid1drop gives no second Bauble draw. Pass both turns. Final Fru paid1drop triggers Bauble again after reset. Both logs/private draw ownership.",
  playerOne: { hand: [fruFruVipGuest], inkDrops: 4, deck },
  playerTwo: {
    play: [madamMimResourcefulTrickster],
    hand: [khanTransportDelivery, fruFruVipGuest, fruFruVipGuest],
    inkwell: 10,
    inkDrops: 3,
    deck: Array.from({ length: 10 }, () => fruFruVipGuest),
  },
});

export const set14AuditJuanitaBoundaryPlayerTwoFixture = createFixture({
  id: "set14-audit-juanita-boundary-player-two",
  name: "Hyperia audit: Juanita Player Two discard boundary",
  description:
    "Pass to Player Two. Pay first Juanita with5ink while own discard9 and opposing11: draw2. Its discard raises own pile to10. Sing second Juanita with dry Loyal Alebrije: draw3 with remaining2ink unchanged. Owner drawn names stay private in opposing logs.",
  skipPreGame: true,
  seed: "juanita-p2-boundary",
  playerOne: { discard: Array.from({ length: 11 }, () => fruFruVipGuest), deck },
  playerTwo: {
    play: [danteLoyalAlebrije],
    hand: [everyoneKnowsJuanita, everyoneKnowsJuanita],
    discard: Array.from({ length: 9 }, () => fruFruVipGuest),
    inkwell: 7,
    deck: Array.from({ length: 8 }, () => fruFruVipGuest),
  },
});
export const set14AuditJuanitaShortPlayerTwoFixture = createFixture({
  id: "set14-audit-juanita-short-player-two",
  name: "Hyperia audit: Juanita Player Two short deck",
  description:
    "Pass to Player Two: normal draw leaves1card. Sing enhanced Juanita with Loyal Alebrije. Draw only1 instead of3, deck0; no immediate loss. Pass ends game with Player One winner. Check both public logs.",
  skipPreGame: true,
  seed: "juanita-p2-short",
  playerOne: { deck },
  playerTwo: {
    play: [danteLoyalAlebrije],
    hand: [everyoneKnowsJuanita],
    discard: Array.from({ length: 10 }, () => fruFruVipGuest),
    inkwell: 2,
    deck: [fruFruVipGuest, fruFruVipGuest],
  },
});
export const set14AuditJuanitaEmptyPlayerTwoFixture = createFixture({
  id: "set14-audit-juanita-empty-player-two",
  name: "Hyperia audit: Juanita Player Two empty deck",
  description:
    "Pass to Player Two: normal draw empties deck. Pay Juanita5ink with discard11, draw0 with no fabricated card. No immediate loss. Pass gives Player One victory. Check both public logs.",
  skipPreGame: true,
  seed: "juanita-p2-empty",
  playerOne: { deck },
  playerTwo: {
    hand: [everyoneKnowsJuanita],
    discard: Array.from({ length: 11 }, () => fruFruVipGuest),
    inkwell: 5,
    deck: [fruFruVipGuest],
  },
});

export const set14AuditMaliceAmountsPlayerTwoFixture = createFixture({
  id: "set14-audit-malice-amounts-player-two",
  name: "Hyperia audit: Malice Player Two chosen amounts",
  description:
    "Pass to Player Two. Play three Malice spells: own Goliath starts2damage. First choose0 to opposing Scuttle, then1, then remaining1. Scuttle ends2damage and survives; Goliath heals0. Merlin Wand excluded as source and friendly characters excluded as destinations. Both public damage-movement logs.",
  skipPreGame: true,
  seed: "malice-p2-amounts",
  playerOne: { play: [scuttleDirectingTraffic, fruFruVipGuest, merlinsWand], deck },
  playerTwo: {
    play: [{ card: goliathTransformedWarrior, damage: 2 }, fruFruVipGuest],
    hand: [mimsMalice, mimsMalice, mimsMalice],
    inkwell: 6,
    deck,
  },
});
export const set14AuditMaliceZeroPlayerTwoFixture = createFixture({
  id: "set14-audit-malice-zero-player-two",
  name: "Hyperia audit: Malice Player Two undamaged source",
  description:
    "Pass to Player Two. Malice chooses own undamaged Goliath and opposing Scuttle with1damage. Only0damage available: both unchanged, spell discards with no fabricated damage or banishment log. Both views.",
  skipPreGame: true,
  seed: "malice-p2-zero",
  playerOne: { play: [{ card: scuttleDirectingTraffic, damage: 1 }], deck },
  playerTwo: { play: [goliathTransformedWarrior], hand: [mimsMalice], inkwell: 2, deck },
});

export const set14AuditHigitusPaidPlayerTwoFixture = createFixture({
  id: "set14-audit-higitus-paid-player-two",
  name: "Hyperia audit: Higitus Player Two repeated and mixed payment",
  description:
    "Pass to Player Two. First Higitus paid6bank adds3 to existing1drop (4held,2bank). Second Higitus selected4drops+2bank removes before gain3 (3held,0bank). Fru paid1drop leaves2. Pass both turns and Scuttle paid2drops uses stored remainder,8bank untouched. Opposing4drops unchanged; both gain/payment logs.",
  skipPreGame: true,
  seed: "higitus-p2-paid",
  playerOne: { deck, inkDrops: 4 },
  playerTwo: {
    hand: [higitusFigitus, higitusFigitus, fruFruVipGuest, scuttleDirectingTraffic],
    inkwell: 8,
    inkDrops: 1,
    deck,
  },
});
export const set14AuditHigitusInsufficientPlayerTwoFixture = createFixture({
  id: "set14-audit-higitus-insufficient-player-two",
  name: "Hyperia audit: Higitus Player Two no future payment",
  description:
    "Pass to Player Two with5ink and0drops. Higitus6 cannot use prospective3drops to pay itself. No play/gain log, song remains hand,5ink ready and opposing4drops untouched.",
  skipPreGame: true,
  seed: "higitus-p2-insufficient",
  playerOne: { deck, inkDrops: 4 },
  playerTwo: { hand: [higitusFigitus], inkwell: 5, deck },
});

export const set14AuditPocoBoundaryPlayerTwoFixture = createFixture({
  id: "set14-audit-poco-boundary-player-two",
  name: "Hyperia audit: Poco Player Two selected cost boundary",
  description:
    "Pass to Player Two. Pay first Poco3 and select Goliath4 plus Dante6: no return despite unselected Fru1 and Owl3. Pay second3 choose Owl3 plus Goliath4: both return, Dante and Fru remain. Only own characters selectable, Wand/opponents excluded. Both public logs.",
  skipPreGame: true,
  seed: "poco-p2-boundary",
  playerOne: { play: [scuttleDirectingTraffic, merlinsWand], deck },
  playerTwo: {
    play: [
      goliathTransformedWarrior,
      danteLoyalAlebrije,
      archimedesMessengerOwl,
      fruFruVipGuest,
      merlinsWand,
    ],
    hand: [unPocoLoco, unPocoLoco],
    inkwell: 6,
    deck,
  },
});
export const set14AuditPocoOnlyPlayerTwoFixture = createFixture({
  id: "set14-audit-poco-only-player-two",
  name: "Hyperia audit: Poco Player Two only one character",
  description:
    "Pass to Player Two. Pay Poco3. Only own Owl3 eligible despite opposingScuttle. Choose Owl, return it, no impossible second target, spelldiscard. Both public logs.",
  skipPreGame: true,
  seed: "poco-p2-only",
  playerOne: { play: [scuttleDirectingTraffic], deck },
  playerTwo: { play: [archimedesMessengerOwl, merlinsWand], hand: [unPocoLoco], inkwell: 3, deck },
});
export const set14AuditPocoEmptyPlayerTwoFixture = createFixture({
  id: "set14-audit-poco-empty-player-two",
  name: "Hyperia audit: Poco Player Two no characters",
  description:
    "Pass to Player Two. Pay Poco3 with no own characters, own Wand not eligible. Resolve no target and no return; opposingScuttle untouched, no stuck prompt or fabricated return log.",
  skipPreGame: true,
  seed: "poco-p2-empty",
  playerOne: { play: [scuttleDirectingTraffic], deck },
  playerTwo: { play: [merlinsWand], hand: [unPocoLoco], inkwell: 3, deck },
});

export const set14AuditMagnificentEmptyPlayerTwoFixture = createFixture({
  id: "set14-audit-magnificent-empty-player-two",
  name: "Hyperia audit: Magnificent Player Two empty deck lore",
  description:
    "Pass to Player Two: normal draw empties deck. Sing Magnificent with Goliath4. Lore5to7 still gains2; no card drawn, bank2unchanged, no immediate loss. Pass gives Player One winner for emptydeck. Both public logs.",
  skipPreGame: true,
  seed: "magnificent-p2-empty",
  playerOne: { lore: 7, deck },
  playerTwo: {
    play: [goliathTransformedWarrior],
    hand: [magnificentMarvelous],
    lore: 5,
    inkwell: 2,
    deck: [fruFruVipGuest],
  },
});
export const set14AuditMagnificentRejectedPlayerTwoFixture = createFixture({
  id: "set14-audit-magnificent-rejected-player-two",
  name: "Hyperia audit: Magnificent Player Two rejected actions",
  description:
    "Pass to Player Two. Only3ink and onlyOwl3 singer: carddetail Play and Sing disabled for cost4; cannot ink. Lore5 deck5 and songhand unchanged, no gain/draw/play log; opposinglore7untouched.",
  skipPreGame: true,
  seed: "magnificent-p2-rejected",
  playerOne: { lore: 7, deck },
  playerTwo: {
    play: [archimedesMessengerOwl],
    hand: [magnificentMarvelous],
    lore: 5,
    inkwell: 3,
    deck,
  },
});

export const set14AuditCreativeMixedPlayerTwoFixture = createFixture({
  id: "set14-audit-creative-mixed-player-two",
  name: "Hyperia audit: Creative Player Two exact mixed draw",
  description:
    "Pass to Player Two. Unarmed Creative7 blocked at6ink. Arm1helddrop and pay6ink+1drop: drawexactly4 from5remaining, deck1 hand5 actiondiscard. Opposinghand1deck6drops4unchanged. Owner drawn names private in opposinglog.",
  skipPreGame: true,
  seed: "creative-p2-mixed",
  playerOne: { hand: [fruFruVipGuest], deck, inkDrops: 4 },
  playerTwo: {
    hand: [creativeInspiration],
    inkwell: 6,
    inkDrops: 1,
    deck: Array.from({ length: 6 }, () => fruFruVipGuest),
  },
});
export const set14AuditCreativeEmptyPlayerTwoFixture = createFixture({
  id: "set14-audit-creative-empty-player-two",
  name: "Hyperia audit: Creative Player Two empty deck",
  description:
    "Pass to Player Two: normaldrawlastFru emptiesdeck. Pay Creative7 draws0, hand1 remains, actiondiscard no fabricateddrawlog, noimmediateloss. Pass ownturn gives Player One winner emptydeckreason. Bothpubliclogs.",
  skipPreGame: true,
  seed: "creative-p2-empty",
  playerOne: { deck },
  playerTwo: { hand: [creativeInspiration], inkwell: 7, deck: [fruFruVipGuest] },
});

export const set14AuditWandVersionsPlayerTwoFixture = createFixture({
  id: "set14-audit-wand-versions-player-two",
  name: "Hyperia audit: Wand Player Two named versions and consumption",
  description:
    "Pass to Player Two. PlayWand2 and activateimmediately, reveal MerlinCurious4 and MerlinTinkerer7 (same name different versions). Wandexerts. PlayFru1 first without consumingdiscount. Curious costs3, leaves4bank; Tinkerer full7 blocked, discountconsumed. Opposing Merlinhand excluded. Both public reveal/activation/payment logs.",
  skipPreGame: true,
  seed: "wand-p2-versions",
  playerOne: { hand: [merlinProfoundlyCurious], deck },
  playerTwo: {
    hand: [merlinsWand, merlinProfoundlyCurious, merlinInkDropTinkerer, fruFruVipGuest],
    inkwell: 10,
    deck,
  },
});
export const set14AuditWandExpiryPlayerTwoFixture = createFixture({
  id: "set14-audit-wand-expiry-player-two",
  name: "Hyperia audit: Wand Player Two unused expiry",
  description:
    "Pass to Player Two. ActivateWand revealing both Merlin versions with3ink. Do not playMerlin. Passbothturns: Wandready, unuseddiscountgone, Curious4 disabledat3ink. Both public reveal logs.",
  skipPreGame: true,
  seed: "wand-p2-expiry",
  playerOne: { deck },
  playerTwo: {
    play: [merlinsWand],
    hand: [merlinProfoundlyCurious, merlinInkDropTinkerer],
    inkwell: 3,
    deck,
  },
});
export const set14AuditWandInvalidPlayerTwoFixture = createFixture({
  id: "set14-audit-wand-invalid-player-two",
  name: "Hyperia audit: Wand Player Two no matching reveal pair",
  description:
    "Pass to Player Two. OnlyMerlin andFru inhand, no same-name pair; Wandabilitydisabled, remainsready, no reveal/activation/discount log. Curious4 blockedat3ink. Opposing Merlin cannot satisfyownreveal.",
  skipPreGame: true,
  seed: "wand-p2-invalid",
  playerOne: { hand: [merlinProfoundlyCurious], deck },
  playerTwo: {
    play: [merlinsWand],
    hand: [merlinProfoundlyCurious],
    inkwell: 3,
    deck: [fruFruVipGuest, ...deck],
  },
});

export const set14AuditRebeccaEmptyPlayerTwoFixture = createFixture({
  id: "set14-audit-rebecca-empty-player-two",
  name: "Hyperia audit: Rebecca Player Two empty deck discard",
  description:
    "Pass to Player Two, normaldrawlastFru leavesemptydeck. PlayRebecca3, accept DueDiligence: draw0 but mandatorydiscardstillchoose ownWand orFru. BoardGoliath/Rebecca andopposinghand excluded; discardWand public, Fru retainedprivate. Reloadrepeatdecline: no draw/discard. Bothpubliclogs.",
  skipPreGame: true,
  seed: "rebecca-p2-empty",
  playerOne: { hand: [merlinsWand], play: [scuttleDirectingTraffic], deck },
  playerTwo: {
    play: [goliathTransformedWarrior],
    hand: [rebeccaCunninghamSavvyManager, merlinsWand],
    inkwell: 3,
    deck: [fruFruVipGuest],
  },
});
export const set14AuditRebeccaNoHandPlayerTwoFixture = createFixture({
  id: "set14-audit-rebecca-no-hand-player-two",
  name: "Hyperia audit: Rebecca Player Two no cards to discard",
  description:
    "Pass to Player Two. Ink normaldrawnFru, thenplayRebecca3 leaveshand0deck0. AcceptDueDiligence: no draw/discardpossible, completesnopendingprompt, Rebecca staysplay; pass ownturn emptydeckloss. Bothpubliclogs.",
  skipPreGame: true,
  seed: "rebecca-p2-no-hand",
  playerOne: { hand: [merlinsWand], deck },
  playerTwo: { hand: [rebeccaCunninghamSavvyManager], inkwell: 3, deck: [fruFruVipGuest] },
});

export const set14AuditHeiheiDryCopiesFixture = createFixture({
  id: "set14-audit-heihei-dry-copies",
  name: "Hyperia audit: Heihei drying copies",
  description:
    "Both drying copies at Beanstalk can move to own Belle House for free at zero bank ink. Each gains one lore and has its own once-per-turn limit. Current, opposing and hand locations are excluded. Pass both turns to reset both uses.",
  skipPreGame: true,
  seed: "heihei-dry-copies",
  playerOne: {
    play: [
      theBeanstalkOnwardAndUpward,
      bellesHouseMauricesWorkshop,
      { card: heiheiAtTheCrosswalk, atLocation: theBeanstalkOnwardAndUpward, isDrying: true },
      { card: heiheiAtTheCrosswalk, atLocation: theBeanstalkOnwardAndUpward, isDrying: true },
    ],
    hand: [portAuthorityCenterHub],
    inkDrops: 3,
    deck,
  },
  playerTwo: { play: [bellesHouseMauricesWorkshop], inkDrops: 4, deck },
});
export const set14AuditHeiheiNoDestinationPlayerTwoFixture = createFixture({
  id: "set14-audit-heihei-no-destination-player-two",
  name: "Hyperia audit: Heihei Player Two no destination",
  description:
    "Pass to Player Two. Heihei at the only own location has no other legal destination despite an opposing and hand location. Outside-location copy cannot activate. No move or ability lore should result.",
  skipPreGame: true,
  seed: "heihei-no-destination-p2",
  playerOne: { play: [bellesHouseMauricesWorkshop], lore: 5, deck },
  playerTwo: {
    play: [
      theBeanstalkOnwardAndUpward,
      { card: heiheiAtTheCrosswalk, atLocation: theBeanstalkOnwardAndUpward },
      heiheiAtTheCrosswalk,
    ],
    hand: [portAuthorityCenterHub],
    lore: 7,
    inkDrops: 3,
    deck,
  },
});

export const set14AuditAbbyTypesPlayerTwoFixture = createFixture({
  id: "set14-audit-abby-types-player-two",
  name: "Hyperia audit: Abby Player Two type routing",
  description:
    "Pass to Player Two. Play five Abbys: Goliath without Singer, Creative Inspiration and Beanstalk must go to the bottom; accept Singer Goofy; decline the song. Only the current revealed card can be routed. The next normal draw is Fru Fru. Both public logs show exact reveals and destinations.",
  skipPreGame: true,
  seed: "abby-types-p2",
  playerOne: { deck, hand: [goofyDancingSuperstar], discard: [neverGonnaLetYouCry], inkDrops: 4 },
  playerTwo: {
    hand: [
      abbyParkIntenseFan,
      abbyParkIntenseFan,
      abbyParkIntenseFan,
      abbyParkIntenseFan,
      abbyParkIntenseFan,
    ],
    inkwell: 20,
    inkDrops: 3,
    deck: [
      fruFruVipGuest,
      neverGonnaLetYouCry,
      goofyDancingSuperstar,
      theBeanstalkOnwardAndUpward,
      creativeInspiration,
      goliathTransformedWarrior,
      fruFruVipGuest,
    ],
  },
});
export const set14AuditAbbySinglePlayerTwoFixture = createFixture({
  id: "set14-audit-abby-single-player-two",
  name: "Hyperia audit: Abby Player Two single and empty deck",
  description:
    "Pass to Player Two, leaving one Singer in deck. First Abby declines and leaves the same card in deck; second takes it into hand, leaving deck empty. Third Abby completes without a reveal or routing choice. Remains active until Player Two passes with an empty deck.",
  skipPreGame: true,
  seed: "abby-single-p2",
  playerOne: { deck, inkDrops: 4 },
  playerTwo: {
    hand: [abbyParkIntenseFan, abbyParkIntenseFan, abbyParkIntenseFan],
    inkwell: 12,
    inkDrops: 3,
    deck: [goofyDancingSuperstar, fruFruVipGuest],
  },
});

export const set14AuditGoofyRepeatPlayerTwoFixture = createFixture({
  id: "set14-audit-goofy-repeat-player-two",
  name: "Hyperia audit: Goofy repeated quests and source removal",
  description:
    "Pass to Player Two. Quest Goofy, ready him with You Came Back, quest again. Existing Max Goof gains two lore bonuses; play another Max Goof afterward without either prior bonus. Dragon Fire removes Goofy; existing Max Goof keeps both bonuses and quests for four. Pass to expire them. Plain and opposing characters stay unchanged.",
  skipPreGame: true,
  seed: "goofy-repeat-p2",
  playerOne: { play: [maxGoofMusicLover], lore: 5, deck },
  playerTwo: {
    play: [goofyDancingSuperstar, maxGoofMusicLover, fruFruVipGuest],
    hand: [youCameBack, maxGoofMusicLover, dragonFire],
    inkwell: 11,
    inkDrops: 3,
    deck,
  },
});
export const set14AuditGoofyShiftSingerPlayerTwoFixture = createFixture({
  id: "set14-audit-goofy-shift-singer-player-two",
  name: "Hyperia audit: Goofy Shift and Singer boundaries",
  description:
    "Pass to Player Two. Unarmed Shift requires three ink but only two are ready. Select the one drop: Shift onto only own Goofy, inherit one damage. Opposing Goofy and own Fru Fru are excluded. Singer six cannot sing Be Prepared seven, but sings Higitus six at zero bank ink without In the Groove.",
  skipPreGame: true,
  seed: "goofy-shift-singer-p2",
  playerOne: { play: [goofyKnowsTheBand], inkDrops: 4, deck },
  playerTwo: {
    play: [{ card: goofyKnowsTheBand, damage: 1 }, hctorRiveraStreetMusician, fruFruVipGuest],
    hand: [goofyDancingSuperstar, bePrepared, higitusFigitus],
    inkwell: 2,
    inkDrops: 1,
    deck,
  },
});

export const set14AuditWasabiBoundsPlayerTwoFixture = createFixture({
  id: "set14-audit-wasabi-bounds-player-two",
  name: "Hyperia audit: Wasabi Resist, copies, turn ownership and last known Strength",
  skipPreGame: true,
  seed: "set14-audit-wasabi-bounds-player-two",
  description:
    "Player one: activate Mouse Armor on exerted Tiana at Maui, stacking Resist to four, then pass. Player two has three Wasabi copies at four Strength despite the opposing three drops. First copy challenges Tiana: zero outgoing damage, one return damage and no Twin Blades. Second challenges Edgar at Maui: one outgoing damage after Resist three and four return damage; resolve Twin Blades against undamaged Edgar outside Maui for two damage after Resist two. Picker excludes source, opposing Ward, items, locations and hidden copies; another friendly copy and own Ward remain legal. Pay six for Higitus to gain three drops: all own Wasabi become six, enemy remains six from its own drops. Quest the undamaged third copy only to exert it for the opposing-turn setup, then pass. Player one challenges that copy with Fru Fru: one damage to Wasabi, six return damage and no opposing-turn Twin Blades. Quest player one's Wasabi to exert it as the next challenge target, then pass back: the damaged second Wasabi is ready again. Challenge opposing Wasabi: both banish; Twin Blades uses last known Strength six to banish the damaged Edgar. Inspect both logs, independent copy triggers and preserved drop pools.",
  playerOne: {
    play: [
      mouseArmor,
      { card: tianaCelebratingPrincess, exerted: true, atLocation: mauisPlaceOfExileHiddenIsland },
      {
        card: edgarBalthazarLongsufferingButler,
        exerted: true,
        atLocation: mauisPlaceOfExileHiddenIsland,
      },
      edgarBalthazarLongsufferingButler,
      mauisPlaceOfExileHiddenIsland,
      wasabiCalledIntoBattle,
      fruFruVipGuest,
      aladdinPrinceAli,
      bellesHouseMauricesWorkshop,
    ],
    hand: [fruFruVipGuest],
    inkwell: 2,
    inkDrops: 3,
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [
      wasabiCalledIntoBattle,
      wasabiCalledIntoBattle,
      wasabiCalledIntoBattle,
      aladdinPrinceAli,
      ancestralGuitar,
    ],
    hand: [higitusFigitus, wasabiCalledIntoBattle],
    discard: [wasabiCalledIntoBattle],
    inkwell: 6,
    deck: [...deck, ...deck],
  },
});

export const set14AuditTremaineSongPlayerTwoFixture = createFixture({
  id: "set14-audit-tremaine-song-player-two",
  name: "Hyperia audit: Tremaine independent songs for player two",
  description:
    "Player one plays Unbirthday and declines, then passes. Player two plays a fresh Tremaine, pays Befuddle to return Fru Fru, and has zero bank ink. An unpaid Unbirthday cannot be played. Sing it with Goofy: accept the lethal copy, decline the healthy copy, accept the fresh copy. Only two cards draw. Sing again with Mickey: only the declined copy can resolve, taking one damage and drawing one. Opposing and hidden copies remain excluded.",
  skipPreGame: true,
  seed: "tremaine-song-p2",
  playerOne: {
    play: [ladyTremaineScornfulSnob],
    hand: [aVeryMerryUnbirthday],
    inkwell: 1,
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [
      { card: ladyTremaineScornfulSnob, damage: 2 },
      ladyTremaineScornfulSnob,
      goofyDancingSuperstar,
      mickeyMouseTrueFriend,
      fruFruVipGuest,
    ],
    hand: [
      ladyTremaineScornfulSnob,
      befuddle,
      aVeryMerryUnbirthday,
      aVeryMerryUnbirthday,
      ladyTremaineScornfulSnob,
    ],
    discard: [ladyTremaineScornfulSnob],
    inkwell: [ladyTremaineScornfulSnob, fruFruVipGuest, fruFruVipGuest, fruFruVipGuest],
    deck: [ladyTremaineScornfulSnob, ...deck, ...deck],
  },
});
export const set14AuditTremaineEntryBoundsFixture = createFixture({
  id: "set14-audit-tremaine-entry-bounds",
  name: "Hyperia audit: Tremaine entry counters and source departure",
  description:
    "Two opposing Tremaines. Existing Ariel stays undamaged. Play own Tremaine, then another Ariel: two entry counters despite Ward and Resist, ignoring the friendly source. Fru Fru enters undamaged. Perdita plays Hector from discard: two lethal counters, retained Strike a Chord mills one. Dragon Fire removes one source; Gazelle enters with one counter. Remove the other source; Hector enters undamaged despite friendly Tremaine. Inspect counter logs before banishment.",
  skipPreGame: true,
  seed: "tremaine-entry-bounds",
  playerOne: {
    play: [cogsworthGrandfatherClock, auroraDreamingGuardian, arielSpectacularSinger],
    hand: [
      ladyTremaineScornfulSnob,
      arielSpectacularSinger,
      fruFruVipGuest,
      perditaDevotedMother,
      dragonFire,
      dragonFire,
      gazellePopDiva,
      hctorRiveraStreetMusician,
    ],
    discard: [hctorRiveraStreetMusician],
    inkwell: 26,
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [ladyTremaineScornfulSnob, ladyTremaineScornfulSnob],
    deck: [...deck, ...deck],
  },
});
export const set14AuditTremaineResistPlayerTwoFixture = createFixture({
  id: "set14-audit-tremaine-resist-player-two",
  name: "Hyperia audit: Tremaine resisted song allowance for player two",
  description:
    "Pass to player two, then activate Mouse Armor on Tremaine. Sing Unbirthday with Goofy and accept Delicate Sensibilities: Resist prevents one damage, no draw. Sing the second with Mickey: the once allowance remains available, so accept the trigger again with no damage or draw. Opposing Tremaine stays unchanged.",
  skipPreGame: true,
  seed: "tremaine-resist-p2",
  playerOne: { play: [ladyTremaineScornfulSnob], deck: [...deck, ...deck] },
  playerTwo: {
    play: [ladyTremaineScornfulSnob, mouseArmor, goofyDancingSuperstar, mickeyMouseTrueFriend],
    hand: [aVeryMerryUnbirthday, aVeryMerryUnbirthday],
    deck: [...deck, ...deck],
  },
});
export const set14AuditTremaineSourceDepartureFixture = createFixture({
  id: "set14-audit-tremaine-source-departure",
  name: "Hyperia audit: Tremaine leaves before its song trigger",
  description:
    "Sing Mother Knows Best with Mickey and return own Tremaine to hand. Accept its retained Delicate Sensibilities: no valid self in play, no hand damage or draw. Pay Unbirthday afterward: the Tremaine in hand does not trigger.",
  skipPreGame: true,
  seed: "tremaine-song-departure",
  playerOne: {
    play: [ladyTremaineScornfulSnob, mickeyMouseTrueFriend],
    hand: [motherKnowsBest, aVeryMerryUnbirthday],
    inkwell: 1,
    deck,
  },
  playerTwo: { deck },
});
export const set14AuditTremaineEmptyFixture = createFixture({
  id: "set14-audit-tremaine-empty",
  name: "Hyperia audit: Tremaine empty deck",
  description:
    "Sing Unbirthday with Mickey, accept self damage at an empty deck. Tremaine takes one damage; no card can draw. Pass: player one loses at end of turn.",
  skipPreGame: true,
  seed: "tremaine-empty",
  playerOne: {
    play: [ladyTremaineScornfulSnob, mickeyMouseTrueFriend],
    hand: [aVeryMerryUnbirthday],
    deck: [],
  },
  playerTwo: { deck },
});

export const set14AuditMulanReplayPlayerTwoFixture = createFixture({
  id: "set14-audit-mulan-replay-player-two",
  name: "Hyperia audit: Mulan replay and repeated Rush for player two",
  description:
    "Pass to player two. Play Mulan and grant own Ward Aladdin Strength four and challenge draw; entry picker includes self and opposing plain characters but excludes opposing Ward, items, locations and hidden cards. Quest the existing dry Mulan and grant Aladdin Rush. Challenge Fru Fru and draw exactly one before combat. Mother Knows Best returns Aladdin; replay him and verify base Strength two, zero damage, no grant or Rush and no challenge while drying. You Came Back readies the old Mulan; quest again and grant new Rush to the replayed Aladdin. Challenge Mickey for two, taking three and being banished, without any draw. Another You Came Back permits a third quest; grant Rush to Mulan herself without readying her. Pass expires Rush while printed Ward and drops remain. Inspect both logs and private draw visibility.",
  skipPreGame: true,
  seed: "mulan-replay-p2",
  playerOne: {
    play: [
      { card: fruFruVipGuest, exerted: true },
      { card: mickeyMouseTrueFriend, exerted: true },
      aladdinPrinceAli,
      mouseArmor,
      mauisPlaceOfExileHiddenIsland,
    ],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [mulanMartialArtsMaster, aladdinPrinceAli, ancestralGuitar, bellesHouseMauricesWorkshop],
    hand: [mulanMartialArtsMaster, motherKnowsBest, youCameBack, youCameBack, fruFruVipGuest],
    discard: [aladdinPrinceAli],
    inkwell: [aladdinPrinceAli, ...Array.from({ length: 14 }, () => fruFruVipGuest)],
    inkDrops: 3,
    deck: [aladdinPrinceAli, ...deck, ...deck],
  },
});

export const set14AuditIntimidationBoundsPlayerTwoFixture = createFixture({
  id: "set14-audit-intimidation-bounds-player-two",
  name: "Hyperia audit: Intimidation current Strength and Resist for player two",
  description:
    "Pass to player two. Play Mulan and grant opposing Mulan Strength four; Intimidation excludes that increased value, opposing Wasabi four and Ward Aladdin two. Its four legal choices are own fresh Mulan two, own Ward Aladdin two, opposing Tremaine zero and opposing Minnie one with Resist two. Items, locations and hidden characters are excluded. Use four Intimidation copies to banish Minnie through Resist, Tremaine zero, own Ward and own Mulan. A fifth copy has no legal target: it still plays and completes with no banishment or stalled choice. Both logs show named targets and no damage, own drops stay two.",
  skipPreGame: true,
  seed: "intimidation-bounds-p2",
  playerOne: {
    play: [
      ladyTremaineScornfulSnob,
      minnieMouseBusyGogetter,
      mulanMartialArtsMaster,
      aladdinPrinceAli,
      wasabiCalledIntoBattle,
      mouseArmor,
      mauisPlaceOfExileHiddenIsland,
    ],
    hand: [ladyTremaineScornfulSnob],
    discard: [ladyTremaineScornfulSnob],
    inkwell: [fruFruVipGuest],
    deck: [ladyTremaineScornfulSnob, ...deck, ...deck],
  },
  playerTwo: {
    play: [aladdinPrinceAli, ancestralGuitar, bellesHouseMauricesWorkshop],
    hand: [
      mulanMartialArtsMaster,
      intimidationTactics,
      intimidationTactics,
      intimidationTactics,
      intimidationTactics,
      intimidationTactics,
      ladyTremaineScornfulSnob,
    ],
    discard: [ladyTremaineScornfulSnob],
    inkwell: 14,
    inkDrops: 2,
    deck: [...deck, ...deck],
  },
});

export const set14AuditBoundariesReplayPlayerTwoFixture = createFixture({
  id: "set14-audit-boundaries-replay-player-two",
  name: "Hyperia audit: Pushing Boundaries challenge triggers and replay for player two",
  skipPreGame: true,
  seed: "boundaries-replay-p2",
  description:
    "Pass to player two. Pushing Boundaries selects only own Kronk, dry Mulan or Ward Aladdin. Choose damaged Kronk and challenge exerted Mickey: existing one damage remains, no combat damage. Accept Scout Leader and choose Kronk: its two effect damage is prevented while the challenge finishes. Spend the one earned drop on Fire the Cannons outside the challenge: Resist reduces two to one, leaving two damage. Return Kronk with Mother Knows Best and replay it. Quest Mulan and grant Rush to fresh Kronk. Challenge Minnie, then choose Kronk for Scout Leader: the replayed character takes one combat damage and one effect damage, proving the old protection was removed. Both logs show no extra drops or draw.",
  playerOne: {
    play: [
      { card: mickeyMouseTrueFriend, exerted: true },
      { card: minnieMouseBelovedPrincess, exerted: true },
      aladdinPrinceAli,
      mouseArmor,
      mauisPlaceOfExileHiddenIsland,
    ],
    hand: [fruFruVipGuest],
    discard: [fruFruVipGuest],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [
      { card: kronkJuniorChipmunk, damage: 1 },
      mulanMartialArtsMaster,
      aladdinPrinceAli,
      ancestralGuitar,
      bellesHouseMauricesWorkshop,
    ],
    hand: [pushingBoundaries, fireTheCannons, motherKnowsBest, fruFruVipGuest],
    discard: [fruFruVipGuest],
    inkwell: 11,
    deck: [...deck, ...deck],
  },
});

export const set14AuditBoundariesNoTargetPlayerTwoFixture = createFixture({
  id: "set14-audit-boundaries-no-target-player-two",
  name: "Hyperia audit: Pushing Boundaries without a target for player two",
  skipPreGame: true,
  seed: "boundaries-no-target-p2",
  description:
    "Pass to player two. Own items and locations plus characters in hand, discard, deck and inkwell cannot receive protection. Play Pushing Boundaries with no legal target: it finishes without a picker and grants exactly one drop to player two. Spend that earned drop on Fire the Cannons targeting opposing Mickey for two damage. Inspect both public logs for drop gain and drop use, and no false protection or damage from Pushing Boundaries.",
  playerOne: {
    play: [mickeyMouseTrueFriend, aladdinPrinceAli, mouseArmor, mauisPlaceOfExileHiddenIsland],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [ancestralGuitar, bellesHouseMauricesWorkshop],
    hand: [pushingBoundaries, fireTheCannons, aladdinPrinceAli],
    discard: [kronkJuniorChipmunk],
    inkwell: [fruFruVipGuest, fruFruVipGuest],
    deck: [fruFruVipGuest, ...deck, ...deck],
  },
});

// Synthetic declaration-window probe mirrors the unit test. It is not a printed card.
const boundariesAuditTriggerAttacker: CharacterCard = {
  ...fruFruVipGuest,
  id: "boundaries-audit-trigger-attacker",
  canonicalId: "boundaries-audit-trigger-attacker",
  slug: "boundaries-audit-trigger-attacker",
  printings: [],
  reprints: [],
  name: "Audit Trigger Attacker",
  version: "Synthetic Test Card",
  strength: 2,
  willpower: 5,
  text: "Test only: Whenever this character challenges, deal 1 damage to this character.",
  i18n: {
    en: { name: "Audit Trigger Attacker", version: "Synthetic Test Card" },
    de: { name: "Audit Trigger Attacker", version: "Synthetic Test Card" },
    es: { name: "Audit Trigger Attacker", version: "Synthetic Test Card" },
    fr: { name: "Audit Trigger Attacker", version: "Synthetic Test Card" },
    it: { name: "Audit Trigger Attacker", version: "Synthetic Test Card" },
  },
  abilities: [
    {
      type: "triggered",
      name: "DECLARATION DAMAGE",
      trigger: { event: "challenge", on: "SELF", timing: "whenever" },
      effect: { type: "deal-damage", amount: 1, target: "SELF" },
    },
  ],
};
export const set14AuditBoundariesDeclarationFixture = createFixture({
  id: "set14-audit-boundaries-declaration",
  name: "Hyperia audit: Pushing Boundaries synthetic declaration damage",
  skipPreGame: true,
  seed: "boundaries-declaration",
  description:
    "Synthetic test-only attacker mirrors the declaration trigger in the unit test; it is not a printed Lorcana card. Grant it Pushing Boundaries, then challenge Yama. Both the one effect damage on declaring the challenge and Yama's four combat damage are prevented; the prior damage remains one. Outside the challenge, Fire the Cannons adds two damage. Pushing Boundaries grants exactly one drop. Inspect both public logs.",
  playerOne: {
    play: [{ card: boundariesAuditTriggerAttacker, damage: 1 }],
    hand: [pushingBoundaries, fireTheCannons],
    inkwell: 3,
    deck: [...deck, ...deck],
  },
  playerTwo: { play: [{ card: yamaNotoriousCriminal, exerted: true }], deck: [...deck, ...deck] },
});

export const set14AuditScarePlayerTwoFixture = createFixture({
  id: "set14-audit-scare-player-two",
  name: "Hyperia audit: If She Doesn't Scare You for player two",
  skipPreGame: true,
  seed: "scare-p2",
  description:
    "Pass to player two. Cost-two Sebastian has Singer 4 and sings the cost-four song without spending ink or drops. The mandatory first picker contains only own characters, including Ward Aladdin. Banish Sebastian himself, then opposing Minnie through Resist 2. The second picker includes both owners but excludes opposing Ward, items, locations, hidden characters and the banished Sebastian. Pay the second song and banish own Mulan first, then own Ward Aladdin second. Pay the last song and banish sole own Fru Fru: opposing Ward and non-character cards leave no legal second target, so the action completes without a stalled prompt. Both logs show the ordered banishments and no damage. Drops stay two; bank eight stays unchanged by singing then reaches zero after two paid songs.",
  playerOne: {
    play: [minnieMouseBusyGogetter, aladdinPrinceAli, mouseArmor, mauisPlaceOfExileHiddenIsland],
    hand: [fruFruVipGuest],
    discard: [fruFruVipGuest],
    inkwell: [fruFruVipGuest],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [
      sebastianCourtComposer,
      mulanMartialArtsMaster,
      aladdinPrinceAli,
      fruFruVipGuest,
      ancestralGuitar,
      bellesHouseMauricesWorkshop,
    ],
    hand: [ifSheDoesntScareYou, ifSheDoesntScareYou, ifSheDoesntScareYou, mickeyMouseTrueFriend],
    discard: [mickeyMouseTrueFriend],
    inkwell: 8,
    inkDrops: 2,
    deck: [mickeyMouseTrueFriend, ...deck, ...deck],
  },
});

export const set14AuditScareNoOwnPlayerTwoFixture = createFixture({
  id: "set14-audit-scare-no-own-player-two",
  name: "Hyperia audit: If She Doesn't Scare You without an own character",
  skipPreGame: true,
  seed: "scare-no-own-p2",
  description:
    "Pass to player two. Own characters are only in hand, discard, deck and inkwell; own play contains an item and a location. Pay the song. It completes without either target prompt and cannot banish opposing Mickey or Minnie, despite both being legal characters for the second step. Opposing Ward and non-character cards also remain. Bank reaches zero and existing two drops remain; both public logs contain the song play and no fabricated banishment or damage.",
  playerOne: {
    play: [
      mickeyMouseTrueFriend,
      minnieMouseBusyGogetter,
      aladdinPrinceAli,
      mouseArmor,
      mauisPlaceOfExileHiddenIsland,
    ],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [ancestralGuitar, bellesHouseMauricesWorkshop],
    hand: [ifSheDoesntScareYou, aladdinPrinceAli],
    discard: [mulanMartialArtsMaster],
    inkwell: [fruFruVipGuest, fruFruVipGuest, fruFruVipGuest, fruFruVipGuest],
    inkDrops: 2,
    deck: [fruFruVipGuest, ...deck, ...deck],
  },
});

export const set14AuditGoodbyeReplayPlayerTwoFixture = createFixture({
  id: "set14-audit-goodbye-replay-player-two",
  name: "Hyperia audit: Though I Have to Say Goodbye replay for player two",
  skipPreGame: true,
  seed: "goodbye-replay-p2",
  description:
    "Pass to player two and play Ward Aladdin for two. Pay Goodbye for two: mill Everyone Knows Juanita, Fru Fru and Magnificent Marvelous; one old own song plus two new songs boosts opposing Mickey from three to six. Opposing discard songs do not count. The picker offers both owners but excludes opposing Ward, items, locations and hidden characters. Sing the second Goodbye with dry Mulan: mill Fan the Flames, Dragon Fire and Break, all non-songs, and boost fresh own Ward Aladdin from two to six using four existing songs. Mickey stays six instead of recalculating. Return Aladdin with Mother Knows Best and replay it: its bonus is removed and base Strength returns to two. The extra song in discard does not change Mickey's fixed six. Pass: Mickey returns to three. Both public logs show the mills, singer, target, return and replay; drops stay two.",
  playerOne: {
    play: [
      mickeyMouseTrueFriend,
      wasabiCalledIntoBattle,
      aladdinPrinceAli,
      mouseArmor,
      mauisPlaceOfExileHiddenIsland,
    ],
    hand: [fruFruVipGuest],
    discard: [rememberMe, rememberMe, rememberMe],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [mulanMartialArtsMaster, ancestralGuitar, bellesHouseMauricesWorkshop],
    hand: [aladdinPrinceAli, thoughIHaveToSayGoodbye, thoughIHaveToSayGoodbye, motherKnowsBest],
    discard: [
      rememberMe,
      fireTheCannons,
      fruFruVipGuest,
      ancestralGuitar,
      mauisPlaceOfExileHiddenIsland,
    ],
    inkwell: 9,
    inkDrops: 2,
    deck: [
      healingGlow,
      breakCard,
      dragonFire,
      fanTheFlames,
      magnificentMarvelous,
      fruFruVipGuest,
      everyoneKnowsJuanita,
      fruFruVipGuest,
    ],
  },
});

export const set14AuditGoodbyeNoTargetPlayerTwoFixture = createFixture({
  id: "set14-audit-goodbye-no-target-player-two",
  name: "Hyperia audit: Though I Have to Say Goodbye with no character target",
  skipPreGame: true,
  seed: "goodbye-no-target-p2",
  description:
    "Pass to player two. Play Goodbye with no legal character in play: own board has only an item and location, and opposing Aladdin has Ward. Hidden characters are excluded. The song still mills the own top three (Everyone Knows Juanita, Fru Fru, Magnificent Marvelous), leaving one card; it completes without a Strength picker, pending effect or false bonus. Both logs show only the completed mill. Opposing deck/discard and Ward Strength remain unchanged; drops stay two.",
  playerOne: {
    play: [aladdinPrinceAli, mouseArmor, mauisPlaceOfExileHiddenIsland],
    discard: [rememberMe, rememberMe],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [ancestralGuitar, bellesHouseMauricesWorkshop],
    hand: [thoughIHaveToSayGoodbye, aladdinPrinceAli],
    discard: [rememberMe, mulanMartialArtsMaster],
    inkwell: [fruFruVipGuest, fruFruVipGuest],
    inkDrops: 2,
    deck: [healingGlow, magnificentMarvelous, fruFruVipGuest, everyoneKnowsJuanita, fruFruVipGuest],
  },
});

export const set14AuditGoodbyeZeroSongsPlayerTwoFixture = createFixture({
  id: "set14-audit-goodbye-zero-songs-player-two",
  name: "Hyperia audit: Though I Have to Say Goodbye with two non-songs",
  skipPreGame: true,
  seed: "goodbye-zero-songs-p2",
  description:
    "Pass to player two: the turn draw leaves two cards, Fru Fru and Dragon Fire. Play Goodbye and choose own Ward Aladdin. It mills only those two available non-songs, gives zero Strength bonus, and excludes the resolving song plus three opposing discard songs. Aladdin stays two, own deck is empty and the game stays playing. Pass the turn: player two loses at own turn end. Both logs show the actual mill count without a false Strength bonus; drops stay two.",
  playerOne: {
    play: [mickeyMouseTrueFriend, aladdinPrinceAli],
    discard: [rememberMe, rememberMe, rememberMe],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [aladdinPrinceAli],
    hand: [thoughIHaveToSayGoodbye],
    inkwell: 2,
    inkDrops: 2,
    deck: [fruFruVipGuest, dragonFire, fruFruVipGuest],
  },
});

export const set14AuditGoodbyeOneCardPlayerTwoFixture = createFixture({
  id: "set14-audit-goodbye-one-card-player-two",
  name: "Hyperia audit: Though I Have to Say Goodbye with one available song",
  skipPreGame: true,
  seed: "goodbye-one-card-p2",
  description:
    "Pass to player two: the turn draw leaves one Remember Me song. Play Goodbye and choose opposing Mickey. Only one card is milled, the one own song boosts Mickey from three to four, and the resolving song plus opposing songs do not count. The game stays playing with an empty deck. Pass: the boost expires to three and player two loses at own turn end. Both logs show mill one and the named target.",
  playerOne: {
    play: [mickeyMouseTrueFriend, aladdinPrinceAli],
    discard: [rememberMe, rememberMe, rememberMe],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [aladdinPrinceAli],
    hand: [thoughIHaveToSayGoodbye],
    inkwell: 2,
    inkDrops: 2,
    deck: [rememberMe, fruFruVipGuest],
  },
});

export const set14AuditGoodbyeEmptyPlayerTwoFixture = createFixture({
  id: "set14-audit-goodbye-empty-player-two",
  name: "Hyperia audit: Though I Have to Say Goodbye with an empty deck",
  skipPreGame: true,
  seed: "goodbye-empty-p2",
  description:
    "Pass to player two: the turn draw empties the deck. One own Remember Me is already in discard. Play Goodbye and choose own Ward Aladdin: no cards are milled, but the existing song still grants exactly one Strength, from two to three. The resolving song and opposing songs do not count. The game stays playing until player two passes, then the bonus expires and player one wins. Both logs contain no invented mill.",
  playerOne: {
    play: [mickeyMouseTrueFriend, aladdinPrinceAli],
    discard: [rememberMe, rememberMe, rememberMe],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [aladdinPrinceAli],
    hand: [thoughIHaveToSayGoodbye],
    discard: [rememberMe],
    inkwell: 2,
    inkDrops: 2,
    deck: [fruFruVipGuest],
  },
});

// Player One passes normally; Player Two draws the last array entry before activating.
const photoAuditMixedDiscard = [
  motherKnowsBest,
  fanTheFlames,
  dragonFire,
  breakCard,
  healingGlow,
  riveraFamilyPhoto,
  fireTheCannons,
  fruFruVipGuest,
  khanStadiumStateOfTheArt,
] as const;
export const set14AuditPhotoPlayerTwoFixture = createFixture({
  id: "set14-audit-photo-player-two",
  name: "Hyperia audit: Rivera Family Photo player two",
  description:
    "Three independent copies: choose lore at nine for no gain, mill Fru Fru and Dragon Fire to eleven, then gain exactly one lore. Opposing eleven-card discard does not count. Inspect both logs and exerted source exclusion.",
  skipPreGame: true,
  seed: "photo-player-two",
  playerOne: {
    play: [riveraFamilyPhoto],
    discard: [...photoAuditMixedDiscard, magnificentMarvelous, everyoneKnowsJuanita],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [riveraFamilyPhoto, riveraFamilyPhoto, riveraFamilyPhoto],
    inkwell: 3,
    inkDrops: 2,
    discard: [...photoAuditMixedDiscard],
    deck: [healingGlow, dragonFire, fruFruVipGuest, aladdinPrinceAli],
  },
});

export const set14AuditPhotoShort0PlayerTwoFixture = createFixture({
  id: "set14-audit-photo-short-0-player-two",
  name: "Hyperia audit: Rivera Family Photo player two deck 0",
  description:
    "After turn draw, deck has 0. First Photo chooses lore at exactly ten discard cards; second mills only available cards; third gains lore even with empty deck. Loss occurs only at own turn end, with no opponent draw. Inspect both logs.",
  skipPreGame: true,
  seed: "photo-short-0-p2",
  playerOne: {
    play: [riveraFamilyPhoto],
    discard: [...photoAuditMixedDiscard, magnificentMarvelous, everyoneKnowsJuanita],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [riveraFamilyPhoto, riveraFamilyPhoto, riveraFamilyPhoto],
    inkwell: 3,
    inkDrops: 2,
    discard: [...photoAuditMixedDiscard, magnificentMarvelous],
    deck: [...[healingGlow, fruFruVipGuest].slice(0, 0), aladdinPrinceAli],
  },
});

export const set14AuditPhotoShort1PlayerTwoFixture = createFixture({
  id: "set14-audit-photo-short-1-player-two",
  name: "Hyperia audit: Rivera Family Photo player two deck 1",
  description:
    "After turn draw, deck has 1. First Photo chooses lore at exactly ten discard cards; second mills only available cards; third gains lore even with empty deck. Loss occurs only at own turn end, with no opponent draw. Inspect both logs.",
  skipPreGame: true,
  seed: "photo-short-1-p2",
  playerOne: {
    play: [riveraFamilyPhoto],
    discard: [...photoAuditMixedDiscard, magnificentMarvelous, everyoneKnowsJuanita],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [riveraFamilyPhoto, riveraFamilyPhoto, riveraFamilyPhoto],
    inkwell: 3,
    inkDrops: 2,
    discard: [...photoAuditMixedDiscard, magnificentMarvelous],
    deck: [...[healingGlow, fruFruVipGuest].slice(0, 1), aladdinPrinceAli],
  },
});

export const set14AuditPhotoShort2PlayerTwoFixture = createFixture({
  id: "set14-audit-photo-short-2-player-two",
  name: "Hyperia audit: Rivera Family Photo player two deck 2",
  description:
    "After turn draw, deck has 2. First Photo chooses lore at exactly ten discard cards; second mills only available cards; third gains lore even with empty deck. Loss occurs only at own turn end, with no opponent draw. Inspect both logs.",
  skipPreGame: true,
  seed: "photo-short-2-p2",
  playerOne: {
    play: [riveraFamilyPhoto],
    discard: [...photoAuditMixedDiscard, magnificentMarvelous, everyoneKnowsJuanita],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [riveraFamilyPhoto, riveraFamilyPhoto, riveraFamilyPhoto],
    inkwell: 3,
    inkDrops: 2,
    discard: [...photoAuditMixedDiscard, magnificentMarvelous],
    deck: [...[healingGlow, fruFruVipGuest].slice(0, 2), aladdinPrinceAli],
  },
});

export const set14AuditTornPlayerTwoFixture = createFixture({
  id: "set14-audit-torn-player-two",
  name: "Hyperia audit: Torn Corner Player Two copies",
  skipPreGame: true,
  seed: "torn-p2",
  description:
    "Activate old Corner at nine for no draw. Photo mills two new Corners; accept one and decline the other. New copy enters ready for free, reduces discard to ten, then draws Stacey for one ink. Older discard copy stays. Inspect chooser ownership and both logs.",
  playerOne: {
    play: [riveraFamilyPhoto],
    discard: [...photoAuditMixedDiscard, magnificentMarvelous, everyoneKnowsJuanita],
    deck: [...deck, ...deck],
  },
  playerTwo: {
    play: [riveraFamilyPhoto, theTornCorner],
    inkwell: 3,
    inkDrops: 2,
    discard: [...photoAuditMixedDiscard.slice(0, 8), theTornCorner],
    deck: [...deck, staceyPowerlineSuperfan, theTornCorner, theTornCorner, aladdinPrinceAli],
  },
});

export const set14AuditTornShort0PlayerTwoFixture = createFixture({
  id: "set14-audit-torn-short-0-player-two",
  name: "Hyperia audit: Torn Corner Player Two deck 0",
  skipPreGame: true,
  seed: "torn-short-0-p2",
  description:
    "After turn draw, activate at ten discard cards with deck 0. Draw actual 0; item exerts and pays one. Empty deck does not lose until own pass; opponent never draws. Inspect private draw and both logs.",
  playerOne: { deck: [...deck, ...deck] },
  playerTwo: {
    play: [theTornCorner],
    inkwell: 1,
    discard: [...photoAuditMixedDiscard, magnificentMarvelous],
    deck: [...[staceyPowerlineSuperfan].slice(0, 0), aladdinPrinceAli],
  },
});

export const set14AuditTornShort1PlayerTwoFixture = createFixture({
  id: "set14-audit-torn-short-1-player-two",
  name: "Hyperia audit: Torn Corner Player Two deck 1",
  skipPreGame: true,
  seed: "torn-short-1-p2",
  description:
    "After turn draw, activate at ten discard cards with deck 1. Draw actual 1; item exerts and pays one. Empty deck does not lose until own pass; opponent never draws. Inspect private draw and both logs.",
  playerOne: { deck: [...deck, ...deck] },
  playerTwo: {
    play: [theTornCorner],
    inkwell: 1,
    discard: [...photoAuditMixedDiscard, magnificentMarvelous],
    deck: [...[staceyPowerlineSuperfan].slice(0, 1), aladdinPrinceAli],
  },
});

// Synthetic test-only actions reproduce timing/origin unit boundaries; not printed cards.
const tornAuditLatePhoto: ActionCard = {
  ...fireTheCannons,
  id: "torn-audit-late-photo",
  canonicalId: "torn-audit-late-photo",
  slug: "torn-audit-late-photo",
  printings: [],
  reprints: [],
  cost: 0,
  name: "Audit Late Photo",
  text: "Test only: Mill one, then play a Photo from hand for free.",
  i18n: {
    en: { name: "Audit Late Photo" },
    de: { name: "Audit Late Photo" },
    es: { name: "Audit Late Photo" },
    fr: { name: "Audit Late Photo" },
    it: { name: "Audit Late Photo" },
  },
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          { type: "mill", amount: 1, target: "CONTROLLER" },
          {
            type: "play-card",
            cardType: "item",
            from: "hand",
            cost: "free",
            filter: { name: "Rivera Family Photo" },
          },
        ],
      },
    },
  ],
};
const tornAuditDiscard: ActionCard = {
  ...fireTheCannons,
  id: "torn-audit-discard",
  canonicalId: "torn-audit-discard",
  slug: "torn-audit-discard",
  printings: [],
  reprints: [],
  cost: 0,
  name: "Audit Hand Discard",
  text: "Test only: Discard a card from your hand.",
  i18n: {
    en: { name: "Audit Hand Discard" },
    de: { name: "Audit Hand Discard" },
    es: { name: "Audit Hand Discard" },
    fr: { name: "Audit Hand Discard" },
    it: { name: "Audit Hand Discard" },
  },
  abilities: [
    { type: "action", effect: { type: "discard", amount: 1, target: "CONTROLLER", chosen: true } },
  ],
};
const tornAuditRemover: ItemCard = {
  ...riveraFamilyPhoto,
  id: "torn-audit-remover",
  canonicalId: "torn-audit-remover",
  slug: "torn-audit-remover",
  printings: [],
  reprints: [],
  name: "Audit Photo Remover",
  text: "Test only: When milled, banish a chosen own item.",
  i18n: {
    en: { name: "Audit Photo Remover" },
    de: { name: "Audit Photo Remover" },
    es: { name: "Audit Photo Remover" },
    fr: { name: "Audit Photo Remover" },
    it: { name: "Audit Photo Remover" },
  },
  abilities: [
    {
      type: "triggered",
      name: "REMOVE PHOTO",
      trigger: {
        event: "discard",
        on: "SELF",
        timing: "when",
        restrictions: [{ type: "from-deck" }],
      },
      sourceZones: ["discard"],
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["item"],
        },
      },
    },
  ],
};
export const set14AuditTornLatePhotoFixture = createFixture({
  id: "set14-audit-torn-late-photo",
  name: "Hyperia audit: Torn Corner synthetic late Photo",
  skipPreGame: true,
  seed: "torn-late-p2",
  description:
    "Synthetic test only: Player Two plays Audit Late Photo. Mill Corner before Photo enters during the same action, then accept Mend the Photo after the action. Condition is checked at resolution. No ink is available.",
  playerOne: { deck: [...deck, ...deck] },
  playerTwo: {
    hand: [tornAuditLatePhoto, riveraFamilyPhoto],
    deck: [...deck, theTornCorner, aladdinPrinceAli],
  },
});
export const set14AuditTornRemovedPhotoFixture = createFixture({
  id: "set14-audit-torn-removed-photo",
  name: "Hyperia audit: Torn Corner synthetic Photo removal",
  skipPreGame: true,
  seed: "torn-remove-p2",
  description:
    "Synthetic test only: Player Two Photo mills Audit Photo Remover and Corner. Resolve Remover first, banish own Photo. Corner cannot free-play after the named Photo leaves. Both milled cards stay discarded; inspect both logs.",
  playerOne: { play: [riveraFamilyPhoto], deck: [...deck, ...deck] },
  playerTwo: {
    play: [riveraFamilyPhoto],
    inkwell: 1,
    deck: [...deck, theTornCorner, tornAuditRemover, aladdinPrinceAli],
  },
});
export const set14AuditTornAbsentPhotoFixture = createFixture({
  id: "set14-audit-torn-absent-photo",
  name: "Hyperia audit: Torn Corner Photo in wrong zones",
  skipPreGame: true,
  seed: "torn-absent-p2",
  description:
    "Player Two has Photo only in hand/discard while Player One controls a Photo. Goodbye mills Corner plus two cards but Mend the Photo does not occur. No character target exists. Inspect both logs and unchanged play.",
  playerOne: { play: [riveraFamilyPhoto], deck: [...deck, ...deck] },
  playerTwo: {
    hand: [thoughIHaveToSayGoodbye, riveraFamilyPhoto],
    discard: [riveraFamilyPhoto],
    inkwell: 2,
    deck: [...deck, theTornCorner, fruFruVipGuest, healingGlow, aladdinPrinceAli],
  },
});
export const set14AuditTornOriginsFixture = createFixture({
  id: "set14-audit-torn-origins",
  name: "Hyperia audit: Torn Corner synthetic origin exclusion",
  skipPreGame: true,
  seed: "torn-origins-p2",
  description:
    "Synthetic hand-discard probe: Player Two normally draws Corner with Photo in play; no Mend. Play Audit Hand Discard and discard that Corner; no Mend. Break the existing played Corner; no Mend. Only deck-to-discard causes this printed trigger.",
  playerOne: { deck: [...deck, ...deck] },
  playerTwo: {
    play: [riveraFamilyPhoto, theTornCorner],
    hand: [tornAuditDiscard, breakCard],
    inkwell: 2,
    deck: [...deck, theTornCorner],
  },
});

// Test-only boundary cards. These do not alter the published card catalog.
const jukeboxAuditLocked: CharacterCard = {
  ...wasabiCalledIntoBattle,
  id: "jukebox-audit-locked",
  canonicalId: "jukebox-audit-locked",
  slug: "jukebox-audit-locked",
  printings: [],
  reprints: [],
  name: "Audit Cannot Ready",
  text: "Test only: This character can't ready.",
  i18n: {
    en: { name: "Audit Cannot Ready" },
    de: { name: "Audit Cannot Ready" },
    es: { name: "Audit Cannot Ready" },
    fr: { name: "Audit Cannot Ready" },
    it: { name: "Audit Cannot Ready" },
  },
  abilities: [
    { type: "static", effect: { type: "restriction", restriction: "cant-ready", target: "SELF" } },
  ],
};
const jukeboxAuditMiller: ItemCard = {
  ...jukebox,
  id: "jukebox-audit-miller",
  canonicalId: "jukebox-audit-miller",
  slug: "jukebox-audit-miller",
  printings: [],
  reprints: [],
  name: "Audit Song Miller",
  text: "Test only: Whenever you play a song, you may mill a card.",
  i18n: {
    en: { name: "Audit Song Miller" },
    de: { name: "Audit Song Miller" },
    es: { name: "Audit Song Miller" },
    fr: { name: "Audit Song Miller" },
    it: { name: "Audit Song Miller" },
  },
  abilities: [
    {
      type: "triggered",
      trigger: { event: "play", on: { cardType: "song", controller: "you" }, timing: "whenever" },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: { type: "mill", amount: 1, target: "CONTROLLER" },
      },
    },
  ],
};
const jukeboxAuditRetriever: ItemCard = {
  ...jukeboxAuditMiller,
  id: "jukebox-audit-retriever",
  canonicalId: "jukebox-audit-retriever",
  slug: "jukebox-audit-retriever",
  name: "Audit Song Retriever",
  text: "Test only: Whenever you play a song, you may return chosen action from your discard to your hand.",
  i18n: {
    en: { name: "Audit Song Retriever" },
    de: { name: "Audit Song Retriever" },
    es: { name: "Audit Song Retriever" },
    fr: { name: "Audit Song Retriever" },
    it: { name: "Audit Song Retriever" },
  },
  abilities: [
    {
      type: "triggered",
      trigger: { event: "play", on: { cardType: "song", controller: "you" }, timing: "whenever" },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["discard"],
            cardTypes: ["action"],
          },
        },
      },
    },
  ],
};
export const set14AuditJukeboxPlayerTwoFixture = createFixture({
  id: "set14-audit-jukebox-player-two",
  name: "Hyperia audit: Player Two Jukebox copies",
  skipPreGame: true,
  seed: "jukebox-p2",
  description:
    "Pass to Player Two. Sing Magnificent, Marvelous with Mulan. Two Jukebox copies have separate choices: ready Mulan and opposing Wasabi. Opposing Ward Aladdin and non-play zones are excluded. Check the wrong viewer. Accept both copies, then play another song: no more uses. Reload and decline one copy: the next song allows only that copy to resolve; a third song grants neither another use. Pass to expire both restrictions. Inspect both logs.",
  playerOne: {
    play: [
      { card: wasabiCalledIntoBattle, exerted: true, isDrying: false },
      { card: aladdinPrinceAli, exerted: true, isDrying: false },
      bellesHouseMauricesWorkshop,
    ],
    deck,
  },
  playerTwo: {
    hand: [magnificentMarvelous, magnificentMarvelous, magnificentMarvelous, aladdinPrinceAli],
    play: [jukebox, jukebox, { card: mulanMartialArtsMaster, isDrying: false }],
    discard: [magnificentMarvelous, aladdinPrinceAli],
    inkwell: 8,
    deck,
  },
});
export const set14AuditJukeboxReadyBoundaryFixture = createFixture({
  id: "set14-audit-jukebox-ready-boundary",
  name: "Hyperia audit: synthetic ready boundaries",
  skipPreGame: true,
  seed: "jukebox-ready-boundary",
  description:
    "Test-only Cannot Ready character. Paid song creates two Jukebox choices. Choose the already-ready Wasabi and the exerted Cannot Ready character: neither gets a quest restriction. Wasabi can quest. Play a second song: both copies remain eligible. Accept Wasabi to ready him and decline the other copy. Play a third song: only the declined copy remains eligible. Inspect both logs for actual ready outcomes.",
  playerOne: {
    hand: [magnificentMarvelous, magnificentMarvelous, magnificentMarvelous],
    play: [
      jukebox,
      jukebox,
      { card: wasabiCalledIntoBattle, isDrying: false },
      { card: jukeboxAuditLocked, exerted: true, isDrying: false },
    ],
    discard: [magnificentMarvelous],
    inkwell: 12,
    deck,
  },
  playerTwo: { deck },
});
export const set14AuditJukeboxNoTargetsFixture = createFixture({
  id: "set14-audit-jukebox-no-targets",
  name: "Hyperia audit: Jukebox no legal character",
  skipPreGame: true,
  seed: "jukebox-no-targets",
  description:
    "Play the matching song. Own characters are only in hand/discard; the only opposing character has Ward. Accept Jukebox: it finishes without readying or restricting anything. Inspect both logs.",
  playerOne: {
    hand: [magnificentMarvelous, wasabiCalledIntoBattle],
    play: [jukebox],
    discard: [magnificentMarvelous, wasabiCalledIntoBattle],
    inkwell: 4,
    deck,
  },
  playerTwo: { play: [{ card: aladdinPrinceAli, exerted: true, isDrying: false }], deck },
});
export const set14AuditJukeboxNoMatchFixture = createFixture({
  id: "set14-audit-jukebox-no-match",
  name: "Hyperia audit: Jukebox excludes own song and opponent discard",
  skipPreGame: true,
  seed: "jukebox-no-match",
  description:
    "Play the song with no other own matching discard card. Its own discard entry and the opponent's matching song do not satisfy the condition. No ready choice; Wasabi stays exerted. Inspect both logs.",
  playerOne: {
    hand: [magnificentMarvelous],
    play: [jukebox, { card: wasabiCalledIntoBattle, exerted: true, isDrying: false }],
    inkwell: 4,
    deck,
  },
  playerTwo: { discard: [magnificentMarvelous], deck },
});
export const set14AuditJukeboxLateMatchFixture = createFixture({
  id: "set14-audit-jukebox-late-match",
  name: "Hyperia audit: synthetic late discard match",
  skipPreGame: true,
  seed: "jukebox-late-match",
  description:
    "Test-only Song Miller. Play the song; its draw takes the first deck card. Resolve Miller before Jukebox to mill the next matching song. Jukebox now readies Wasabi and blocks questing. Inspect both logs.",
  playerOne: {
    hand: [magnificentMarvelous],
    play: [
      jukeboxAuditMiller,
      jukebox,
      { card: wasabiCalledIntoBattle, exerted: true, isDrying: false },
    ],
    deck: [...deck, magnificentMarvelous, riveraFamilyPhoto],
    inkwell: 4,
  },
  playerTwo: { deck },
});
export const set14AuditJukeboxRemovedMatchFixture = createFixture({
  id: "set14-audit-jukebox-removed-match",
  name: "Hyperia audit: synthetic removed discard match",
  skipPreGame: true,
  seed: "jukebox-removed-match",
  description:
    "Test-only Song Retriever. Play the song. Resolve Retriever first and return either discarded song to hand. Only one matching discard entry remains; Jukebox must cancel if the other song was returned, but can resolve if the played song was returned. Inspect card instance IDs and logs.",
  playerOne: {
    hand: [magnificentMarvelous],
    play: [
      jukeboxAuditRetriever,
      jukebox,
      { card: wasabiCalledIntoBattle, exerted: true, isDrying: false },
    ],
    discard: [magnificentMarvelous],
    inkwell: 4,
    deck,
  },
  playerTwo: { deck },
});
