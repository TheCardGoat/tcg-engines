/**
 * Set 14 (Hyperia City) condition scenarios for manual QA.
 * Each fixture stages the prerequisites its cards need: paired cards,
 * zone contents, damage, and pre-banked ink drops. Load via /tests/<id>,
 * then exercise each listed card against its printed text.
 */
import { createFixture } from "./fixture-factory";
import {
  abbyParkIntenseFan,
  aboveTheCrowd,
  airDrop,
  ancestralGuitar,
  archimedesMessengerOwl,
  arielCollectorOfOddities,
  arthurJoustingKnight,
  arthurMerlinsAssistant,
  arthurNoviceBlacksmith,
  auroraDelightfulMusician,
  baymaxAmpedUp,
  baymaxLabAssistant,
  baymaxQualifiedPhysician,
  belleExceptionalWriter,
  belleReflectiveWriter,
  bellesCityGuide,
  berliozTinyRascal,
  blindingChemBall,
  bobbyZimuruskiSoundboardWhiz,
  brooklynFullThrottle,
  centralStationTransportationHub,
  chemicalReaction,
  chiefBogoPoliceCommissioner,
  cinderellaHomespunDressmaker,
  cinderellaUnintentionalIcon,
  cinderellaUnintentionalIconIconic,
  clarabelleOutForAStroll,
  clawhauserSafetyOfficer,
  danteLoyalAlebrije,
  danteStrangeAndEndearing,
  demonaImperiousSpellcaster,
  donKarnageDebonairPirate,
  edgarBalthazarLongsufferingButler,
  elisaMazaHardworkingDetective,
  ernestoDeLaCruzIdolOfMillions,
  ernestoDeLaCruzRuthlessMusician,
  everyoneKnowsJuanita,
  flippantTaunt,
  fredAssemblingTheTeam,
  fredAwesomeBoss,
  fredBigStomper,
  gazellePopDiva,
  goGoTomagoExtremeTester,
  goliathTransformedWarrior,
  goofyDancingSuperstar,
  goofyEnthusiasticTourist,
  goofyKnowsTheBand,
  hctorRiveraGoneToPieces,
  hctorRiveraStreetMusician,
  hctorRiveraWorldwideSensation,
  heiheiAtTheCrosswalk,
  higitusFigitus,
  hiroHamadaPioneeringInventor,
  hiroHamadaVersatileInventor,
  honeyLemonEndlesslyCurious,
  honeyLemonIngeniousResearcher,
  honeyLemonTestingTheLimits,
  horaceClumsyClod,
  hyperiaCityExpress,
  ifSheDoesntScareYou,
  inkExplosion,
  inkcasterSkates,
  instituteOfTechnologyHoneyLemonsLab,
  intimidationTactics,
  joustingMatch,
  jukebox,
  khanIndustriesGreenwayLandmark,
  khanStadiumStateOfTheArt,
  khanTransportDelivery,
  kitCloudkickerSureShot,
  kitCloudkickerUnpredictableCourier,
  landOfTheDeadMarigoldBridge,
  leaningTowerOfCheesea,
  lexingtonFearlessFlier,
  madamMimBaubleChaser,
  madamMimNosyNeighbor,
  madamMimResourcefulTrickster,
  mamCocoVisitingThePark,
  mamImeldaNononsenseAncestor,
  mamImeldasBlessing,
  marieCaughtInTheAct,
  maxGoofKaraokeStar,
  maxGoofMusicLover,
  merlinBaubleExpert,
  merlinInkDropTinkerer,
  merlinProfoundlyCurious,
  merlinsShopAndSmithyMagicalMarket,
  mickeyMouseBestInTown,
  mickeyMouseBestInTownIconic,
  miguelRiveraAccomplishedMusician,
  miguelRiveraPromisingMusician,
  miguelRiveraStreetMusician,
  mimsMalice,
  miriamMendelsohnFrontrowFan,
  neverGonnaLetYouCry,
  neverTooFarApart,
  nickWildeInquisitiveHarbormaster,
  nickWildeProvidingBackup,
  nickWildeToyDriveOfficer,
  pegLatenightVocalist,
  peopleGonnaComeHere,
  pepitaImeldasRightHand,
  pepitaWatchfulAlebrije,
  piratePlane,
  pjPeteDevotedFan,
  portAuthorityCenterHub,
  powerlineMegastar,
  prototypeChemBall,
  pushingBoundaries,
  rayaDeterminedExplorer,
  rememberMe,
  riveraFamilyPhoto,
  roxanneConcertLover,
  scram,
  shereKhanOpportunisticTycoon,
  sirKayDeterminedToWin,
  speakerStack,
  spyglassHat,
  theBeanstalkOnwardAndUpward,
  theTornCorner,
  thoughIHaveToSayGoodbye,
  tianaPartyHostess,
  tianaRestauranteur,
  toulouseRoughAndTumble,
  unPocoLoco,
  upgradedChemPurse,
  wasabiCalledIntoBattle,
  wasabiFutureThinker,
  wildcatUnconventionalMechanic,
} from "@tcg/lorcana-cards/cards/014";
import {
  arielOnHumanLegs,
  aladdinPrinceAli,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
} from "@tcg/lorcana-cards/cards/001";
import { pawpsicle } from "@tcg/lorcana-cards/cards/002";
import { healingGlow } from "@tcg/lorcana-cards/cards/001";
import { propheticVision } from "@tcg/lorcana-cards/cards/013";
import { andysRoomHomeBase } from "@tcg/lorcana-cards/cards/012";
import { lookWhatYouveDone } from "@tcg/lorcana-cards/cards/013";

export const set14InkDropsFixture = createFixture({
  id: "set14-ink-drops",
  name: "Ink Drops — bank, hold, and spend",
  description:
    "Ink-drop families. Mim - Resourceful Trickster draws on removal (once per turn); Sir Kay gains Challenger +3 and Wasabi - Called into Battle gains +2{S} while you hold a drop; Mim - Bauble Chaser (hand) gains Evasive while you hold one; Merlin - Bauble Expert needs Arthur - Novice Blacksmith (staged in play); Baymax - Lab Assistant (hand) needs 2 items in play (staged). Pre-banked: 3 ink drops. Play Higitus Figitus to bank 3 more, then pay Khan Transport Delivery / spells by REMOVING ink drops; Wasabi - Future Thinker wants to be paid with a removed drop.",
  skipPreGame: true,
  playerOne: {
    hand: [
      { card: higitusFigitus, isDrying: false },
      { card: khanTransportDelivery, isDrying: false },
      { card: sirKayDeterminedToWin, isDrying: false },
      { card: wasabiFutureThinker, isDrying: false },
      { card: madamMimBaubleChaser, isDrying: false },
    ],
    play: [
      { card: madamMimResourcefulTrickster, isDrying: false },
      { card: merlinProfoundlyCurious, isDrying: false },
      { card: wasabiCalledIntoBattle, isDrying: false },
      { card: baymaxLabAssistant, isDrying: false },
      { card: merlinBaubleExpert, isDrying: false },
      pawpsicle,
      andysRoomHomeBase,
    ],
    discard: [
      // (empty)
    ],
    deck: [],
    inkwell: 20,
    inkDrops: 3,
    lore: 3,
  },
  playerTwo: {
    hand: [
      // (empty)
    ],
    play: [
      // (none)
    ],
    discard: [],
    deck: [],
    inkwell: 10,
    lore: 0,
    inkDrops: 0,
  },
  seed: "set14-ink-drops",
});

export const set14SingersSongsFixture = createFixture({
  id: "set14-singers-songs",
  name: "Singers, songs, and song-in-discard triggers",
  description:
    "Singers on your board (Peg/Gazelle 4, Powerline 9, Goofy/Miguel/H\u00e9ctor/Ernesto variants) with songs in hand to play or sing. Discard holds an Un Poco Loco copy (same-name for Jukebox, H\u00e9ctor and Miguel song-in-discard triggers) plus more songs for Aurora and Though I Have to Say Goodbye. Abby Park reveals a Singer/song; Ernesto - Ruthless banishes a Singer; Goofy - Enthusiastic Tourist buffs off a Singer; Jukebox readies on a same-name song.",
  skipPreGame: true,
  playerOne: {
    hand: [
      { card: unPocoLoco, isDrying: false },
      { card: neverGonnaLetYouCry, isDrying: false },
      { card: neverTooFarApart, isDrying: false },
      { card: rememberMe, isDrying: false },
      { card: thoughIHaveToSayGoodbye, isDrying: false },
      { card: peopleGonnaComeHere, isDrying: false },
      { card: abbyParkIntenseFan, isDrying: false },
      { card: goofyDancingSuperstar, isDrying: false },
      { card: hctorRiveraWorldwideSensation, isDrying: false },
      { card: ernestoDeLaCruzRuthlessMusician, isDrying: false },
      { card: miguelRiveraAccomplishedMusician, isDrying: false },
    ],
    play: [
      { card: pegLatenightVocalist, isDrying: false },
      { card: gazellePopDiva, isDrying: false },
      { card: powerlineMegastar, isDrying: false },
      { card: goofyEnthusiasticTourist, isDrying: false },
      { card: maxGoofMusicLover, isDrying: false },
      { card: pjPeteDevotedFan, isDrying: false },
      { card: goofyKnowsTheBand, isDrying: false },
      { card: miguelRiveraStreetMusician, isDrying: false },
      { card: ernestoDeLaCruzIdolOfMillions, isDrying: false },
      { card: hctorRiveraGoneToPieces, isDrying: false },
      { card: miguelRiveraPromisingMusician, isDrying: false },
      { card: miriamMendelsohnFrontrowFan, isDrying: false },
      { card: auroraDelightfulMusician, isDrying: false },
      { card: jukebox, isDrying: false },
      { card: ancestralGuitar, isDrying: false },
      { card: speakerStack, isDrying: false },
    ],
    discard: [
      { card: unPocoLoco, isDrying: false },
      { card: thoughIHaveToSayGoodbye, isDrying: false },
      { card: peopleGonnaComeHere, isDrying: false },
      { card: rememberMe, isDrying: false },
    ],
    deck: [],
    inkwell: 25,
    inkDrops: 5,
    lore: 3,
  },
  playerTwo: {
    hand: [
      // (empty)
    ],
    play: [
      // (none)
    ],
    discard: [],
    deck: [],
    inkwell: 10,
    lore: 0,
    inkDrops: 0,
  },
  seed: "set14-singers-songs",
});

export const set14DiscardTenFixture = createFixture({
  id: "set14-discard-ten",
  name: "Discard-matters (14 cards pre-staged in discard)",
  description:
    "Your discard starts with 14 cards (5 songs included) so Dante variants, Pepita - Imelda's Right Hand, Land of the Dead (+2{L}), Max Goof - Karaoke Star (5+ songs), Everyone Knows Juanita (draw 3), Mam\u00e1 Coco, and Rivera Family Photo / The Torn Corner have their conditions met. Dante - Loyal Alebrije and Pepita - Imelda's Right Hand shift onto their staged bases.",
  skipPreGame: true,
  playerOne: {
    hand: [
      { card: danteLoyalAlebrije, isDrying: false },
      { card: pepitaImeldasRightHand, isDrying: false },
      { card: maxGoofKaraokeStar, isDrying: false },
      { card: mamCocoVisitingThePark, isDrying: false },
      { card: mamImeldaNononsenseAncestor, isDrying: false },
      { card: everyoneKnowsJuanita, isDrying: false },
      { card: riveraFamilyPhoto, isDrying: false },
      { card: theTornCorner, isDrying: false },
    ],
    play: [
      { card: danteStrangeAndEndearing, isDrying: false },
      { card: pepitaWatchfulAlebrije, isDrying: false },
      landOfTheDeadMarigoldBridge,
    ],
    discard: [
      { card: unPocoLoco, isDrying: false },
      { card: neverGonnaLetYouCry, isDrying: false },
      { card: thoughIHaveToSayGoodbye, isDrying: false },
      { card: peopleGonnaComeHere, isDrying: false },
      { card: rememberMe, isDrying: false },
      mickeyMouseTrueFriend,
      simbaProtectiveCub,
      pawpsicle,
      andysRoomHomeBase,
      lookWhatYouveDone,
      propheticVision,
      healingGlow,
      aladdinPrinceAli,
      arielOnHumanLegs,
    ],
    deck: [],
    inkwell: 20,
    inkDrops: 2,
    lore: 3,
  },
  playerTwo: {
    hand: [
      // (empty)
    ],
    play: [
      // (none)
    ],
    discard: [],
    deck: [],
    inkwell: 10,
    lore: 0,
    inkDrops: 0,
  },
  seed: "set14-discard-ten",
});

export const set14ItemsFixture = createFixture({
  id: "set14-items",
  name: "Item synergies (towers, chem balls, differing names)",
  description:
    "Four Leaning Tower of Cheese-a in play (EXTRA CHEESY Ward at 4; Bobby Zimuruski grants them an activation), differing-name items for Ariel - Collector of Oddities and Spyglass Hat, chem balls to banish, Upgraded Chem Purse to sacrifice, Wildcat and Clarabelle banish items, Honey Lemon variants banish/return/reduce items, Belle's City Guide + Belle - Reflective Writer pair (Reflective staged). Inkcaster Skates wants a quest first.",
  skipPreGame: true,
  playerOne: {
    hand: [
      { card: bobbyZimuruskiSoundboardWhiz, isDrying: false },
      { card: honeyLemonTestingTheLimits, isDrying: false },
      { card: honeyLemonIngeniousResearcher, isDrying: false },
      { card: honeyLemonEndlesslyCurious, isDrying: false },
      { card: hiroHamadaPioneeringInventor, isDrying: false },
      { card: arielCollectorOfOddities, isDrying: false },
      { card: spyglassHat, isDrying: false },
      { card: upgradedChemPurse, isDrying: false },
      { card: blindingChemBall, isDrying: false },
      { card: prototypeChemBall, isDrying: false },
      { card: belleExceptionalWriter, isDrying: false },
      { card: bellesCityGuide, isDrying: false },
      { card: wildcatUnconventionalMechanic, isDrying: false },
      { card: clarabelleOutForAStroll, isDrying: false },
    ],
    play: [
      { card: leaningTowerOfCheesea, isDrying: false },
      { card: leaningTowerOfCheesea, isDrying: false },
      { card: leaningTowerOfCheesea, isDrying: false },
      { card: leaningTowerOfCheesea, isDrying: false },
      { card: hyperiaCityExpress, isDrying: false },
      { card: piratePlane, isDrying: false },
      { card: inkcasterSkates, isDrying: false },
      { card: mamImeldasBlessing, isDrying: false },
      { card: belleReflectiveWriter, isDrying: false },
    ],
    discard: [pawpsicle],
    deck: [],
    inkwell: 20,
    inkDrops: 3,
    lore: 3,
  },
  playerTwo: {
    hand: [
      // (empty)
    ],
    play: [
      // (none)
    ],
    discard: [],
    deck: [],
    inkwell: 10,
    lore: 0,
    inkDrops: 0,
  },
  seed: "set14-items",
});

export const set14GargoyleHandFixture = createFixture({
  id: "set14-gargoyle-hand",
  name: "Gargoyle hand-size (Stone by Day)",
  description:
    "Demona, Goliath, Brooklyn, and Lexington are in play and you hold 4 cards, so STONE BY DAY (can't ready at 3+ cards in hand) is active: quest with them, end your turn, verify they stay exerted. Demona's activated ability grants Rush+Evasive to a staged Gargoyle; Goliath discards to move damage and readies.",
  skipPreGame: true,
  playerOne: {
    hand: [lookWhatYouveDone, propheticVision, pawpsicle, andysRoomHomeBase],
    play: [
      { card: lexingtonFearlessFlier, isDrying: false },
      { card: brooklynFullThrottle, isDrying: false },
      { card: goliathTransformedWarrior, isDrying: false },
      { card: demonaImperiousSpellcaster, isDrying: false },
    ],
    discard: [
      // (empty)
    ],
    deck: [],
    inkwell: 12,
    inkDrops: 0,
    lore: 3,
  },
  playerTwo: {
    hand: [
      // (empty)
    ],
    play: [{ card: mickeyMouseTrueFriend, isDrying: false }],
    discard: [],
    deck: [],
    inkwell: 10,
    lore: 0,
    inkDrops: 0,
  },
  seed: "set14-gargoyle-hand",
});

export const set14LocationsMovementFixture = createFixture({
  id: "set14-locations-movement",
  name: "Locations and free movement",
  description:
    "All eight Hyperia City locations are in play. Movers in hand: Arthur - Merlin's Assistant and Heihei (move for free), Roxanne (move herself + another), Chief Bogo (move to a Hyperia City location), Raya (+1{L} per location), Fred - Big Stomper (banish a location), Tiana - Party Hostess (play a location from your discard \u2014 a location copy is staged in your discard).",
  skipPreGame: true,
  playerOne: {
    hand: [
      { card: heiheiAtTheCrosswalk, isDrying: false },
      { card: roxanneConcertLover, isDrying: false },
      { card: arthurMerlinsAssistant, isDrying: false },
      { card: rayaDeterminedExplorer, isDrying: false },
      { card: chiefBogoPoliceCommissioner, isDrying: false },
      { card: fredBigStomper, isDrying: false },
      { card: tianaPartyHostess, isDrying: false },
    ],
    play: [
      portAuthorityCenterHub,
      merlinsShopAndSmithyMagicalMarket,
      theBeanstalkOnwardAndUpward,
      khanStadiumStateOfTheArt,
      instituteOfTechnologyHoneyLemonsLab,
      centralStationTransportationHub,
      khanIndustriesGreenwayLandmark,
      landOfTheDeadMarigoldBridge,
    ],
    discard: [andysRoomHomeBase],
    deck: [],
    inkwell: 25,
    inkDrops: 4,
    lore: 3,
  },
  playerTwo: {
    hand: [
      // (empty)
    ],
    play: [
      // (none)
    ],
    discard: [],
    deck: [],
    inkwell: 10,
    lore: 0,
    inkDrops: 0,
  },
  seed: "set14-locations-movement",
});

export const set14DamageChallengeFixture = createFixture({
  id: "set14-damage-challenge",
  name: "Damage tables and challenge triggers",
  description:
    "Opposing characters enter damaged. Your board: Don Karnage (exerted; -1{L} aura on damaged opponents), Edgar (Resist 2 while undamaged), Marie (drop when an opposing character took damage this turn), Baymax - Qualified Physician (remove 2 damage on quest), Go Go - Extreme Tester (drop when challenged), Archimedes - Messenger Owl (exerted, 1 damage; drop when banished in a challenge). Hand spells: Air Drop (5 damage on damaged), Mim's Malice (move damage), Ink Explosion, Jousting Match (bonus when paid with an ink drop), Above the Crowd, Chemical Reaction, Flippant Taunt, Intimidation Tactics, Pushing Boundaries, If She Doesn't Scare You. Challenge the exerted/damaged targets to fire the challenge triggers.",
  skipPreGame: true,
  playerOne: {
    hand: [
      { card: airDrop, isDrying: false },
      { card: mimsMalice, isDrying: false },
      { card: inkExplosion, isDrying: false },
      { card: joustingMatch, isDrying: false },
      { card: aboveTheCrowd, isDrying: false },
      { card: chemicalReaction, isDrying: false },
      { card: flippantTaunt, isDrying: false },
      { card: intimidationTactics, isDrying: false },
      { card: pushingBoundaries, isDrying: false },
      { card: ifSheDoesntScareYou, isDrying: false },
      { card: horaceClumsyClod, isDrying: false },
      { card: berliozTinyRascal, isDrying: false },
    ],
    play: [
      { card: donKarnageDebonairPirate, isDrying: false },
      { card: edgarBalthazarLongsufferingButler, isDrying: false },
      { card: marieCaughtInTheAct, isDrying: false },
      { card: baymaxQualifiedPhysician, isDrying: false },
      { card: goGoTomagoExtremeTester, isDrying: false },
      { card: archimedesMessengerOwl, isDrying: false },
    ],
    discard: [
      // (empty)
    ],
    deck: [],
    inkwell: 25,
    inkDrops: 2,
    lore: 3,
  },
  playerTwo: {
    hand: [
      // (empty)
    ],
    play: [
      { card: simbaProtectiveCub, isDrying: false, damage: 2 },
      { card: mickeyMouseTrueFriend, isDrying: false, exerted: true, damage: 3 },
    ],
    discard: [],
    deck: [],
    inkwell: 10,
    lore: 0,
    inkDrops: 0,
  },
  seed: "set14-damage-challenge",
});

export const set14DetectiveCourtFixture = createFixture({
  id: "set14-detective-court",
  name: "Detective pair, played-a-character gates, Tremaine's court",
  description:
    "Clawhauser needs another character played this turn (play Nick - Providing Backup or Elisa first); Nick - Providing Backup needs the staged Detective (Elisa Maza). Lady Tremaine: HARSH CRITIQUE hits opposing Singers entering play (Gazelle + Peg staged opposing; play more), DELICATE SENSIBILITIES wants songs in your hand (two staged). Toulouse locks opposing actions; Priya debuffs; Scram / Shed Your Weary Load / Madam Mim - Nosy Neighbor / Shere Khan - One-Sided / Chemical Reaction read the OPPONENT's hand (3 cards staged).",
  skipPreGame: true,
  playerOne: {
    hand: [
      { card: clawhauserSafetyOfficer, isDrying: false },
      { card: scram, isDrying: false },
      { card: madamMimNosyNeighbor, isDrying: false },
      { card: shereKhanOpportunisticTycoon, isDrying: false },
      { card: chemicalReaction, isDrying: false },
      { card: unPocoLoco, isDrying: false },
      { card: neverGonnaLetYouCry, isDrying: false },
    ],
    play: [
      { card: elisaMazaHardworkingDetective, isDrying: false },
      { card: nickWildeProvidingBackup, isDrying: false },
      { card: toulouseRoughAndTumble, isDrying: false },
    ],
    discard: [
      // (empty)
    ],
    deck: [],
    inkwell: 25,
    inkDrops: 2,
    lore: 3,
  },
  playerTwo: {
    hand: [pawpsicle, andysRoomHomeBase, lookWhatYouveDone],
    play: [
      { card: gazellePopDiva, isDrying: false },
      { card: pegLatenightVocalist, isDrying: false },
    ],
    discard: [],
    deck: [],
    inkwell: 10,
    lore: 0,
    inkDrops: 0,
  },
  seed: "set14-detective-court",
});

export const set14SuperTeamFixture = createFixture({
  id: "set14-super-team",
  name: "Super team (Fred, Big Hero 6)",
  description:
    "Fred - Assembling the Team (base) in play with Institute of Technology (Super quests return items to hand) and Super teammates (Fred - Big Stomper, Baymax - Qualified Physician). Fred - Awesome Boss (hand) shifts onto Fred and grants an ink drop whenever a Super is played; Hiro - Versatile Inventor grants Evasive.",
  skipPreGame: true,
  playerOne: {
    hand: [
      { card: fredAwesomeBoss, isDrying: false },
      { card: hiroHamadaVersatileInventor, isDrying: false },
    ],
    play: [
      { card: fredAssemblingTheTeam, isDrying: false },
      instituteOfTechnologyHoneyLemonsLab,
      { card: fredBigStomper, isDrying: false },
      { card: baymaxQualifiedPhysician, isDrying: false },
    ],
    discard: [
      // (empty)
    ],
    deck: [],
    inkwell: 25,
    inkDrops: 3,
    lore: 3,
  },
  playerTwo: {
    hand: [
      // (empty)
    ],
    play: [
      // (none)
    ],
    discard: [],
    deck: [],
    inkwell: 10,
    lore: 0,
    inkDrops: 0,
  },
  seed: "set14-super-team",
});

export const set14ShiftBasesFixture = createFixture({
  id: "set14-shift-bases",
  name: "Shift bases — every shift pair staged",
  description:
    "Every set-14 Shift character's base is in play, ready; the Shift versions are in your hand. Deck carries Coco songs so deck-reading abilities fire (H\u00e9ctor Rivera's Big Hit looks at the top 3 on quest or first sing each turn). Pairs: Nick Wilde (Toy Drive \u2192 Inquisitive Harbormaster), Merlin (Profoundly Curious \u2192 Ink Drop Tinkerer), Dante (Strange and Endearing \u2192 Loyal Alebrije), Fred (Assembling \u2192 Awesome Boss), Belle (Reflective \u2192 Exceptional), Goofy (Knows the Band \u2192 Dancing Superstar), H\u00e9ctor Rivera (Street \u2192 Worldwide Sensation), Pepita (Watchful \u2192 Imelda's Right Hand), Cinderella (Homespun \u2192 Unintentional Icon + Iconic 242), Baymax (Lab Assistant \u2192 Amped Up \u2014 costs 2 ink drops, 4 pre-banked), Kit Cloudkicker (vanilla base \u2192 Sure Shot), Arthur (Novice Blacksmith \u2192 Jousting Knight), Tiana (Restauranteur \u2192 Party Hostess), Mickey (Best in Town \u2192 Iconic 241).",
  skipPreGame: true,
  playerOne: {
    hand: [
      { card: nickWildeInquisitiveHarbormaster, isDrying: false },
      { card: merlinInkDropTinkerer, isDrying: false },
      { card: danteLoyalAlebrije, isDrying: false },
      { card: fredAwesomeBoss, isDrying: false },
      { card: belleExceptionalWriter, isDrying: false },
      { card: goofyDancingSuperstar, isDrying: false },
      { card: hctorRiveraWorldwideSensation, isDrying: false },
      { card: pepitaImeldasRightHand, isDrying: false },
      { card: cinderellaUnintentionalIcon, isDrying: false },
      { card: cinderellaUnintentionalIconIconic, isDrying: false },
      { card: baymaxAmpedUp, isDrying: false },
      { card: kitCloudkickerSureShot, isDrying: false },
      { card: arthurJoustingKnight, isDrying: false },
      { card: tianaPartyHostess, isDrying: false },
      { card: mickeyMouseBestInTownIconic, isDrying: false },
    ],
    play: [
      { card: nickWildeToyDriveOfficer, isDrying: false },
      { card: merlinProfoundlyCurious, isDrying: false },
      { card: danteStrangeAndEndearing, isDrying: false },
      { card: fredAssemblingTheTeam, isDrying: false },
      { card: belleReflectiveWriter, isDrying: false },
      { card: goofyEnthusiasticTourist, isDrying: false },
      { card: hctorRiveraStreetMusician, isDrying: false },
      { card: pepitaWatchfulAlebrije, isDrying: false },
      { card: cinderellaHomespunDressmaker, isDrying: false },
      { card: baymaxLabAssistant, isDrying: false },
      { card: kitCloudkickerUnpredictableCourier, isDrying: false },
      { card: arthurNoviceBlacksmith, isDrying: false },
      { card: tianaRestauranteur, isDrying: false },
      { card: mickeyMouseBestInTown, isDrying: false },
    ],
    discard: [
      // (empty)
    ],
    // Non-empty deck so deck-reading abilities are QA-able (e.g. Héctor Rivera -
    // Worldwide Sensation's Big Hit scrys the top 3; an empty deck auto-resolves
    // it as a silent no-op and the prompt never appears).
    deck: [
      rememberMe,
      clarabelleOutForAStroll,
      unPocoLoco,
      everyoneKnowsJuanita,
      clarabelleOutForAStroll,
    ],
    inkwell: 40,
    inkDrops: 4,
    lore: 3,
  },
  playerTwo: {
    hand: [
      // (empty)
    ],
    play: [
      // (none)
    ],
    discard: [],
    deck: [],
    inkwell: 10,
    lore: 0,
    inkDrops: 0,
  },
  seed: "set14-shift-bases",
});

export const set14InkDropRenderFixture = createFixture({
  id: "set14-ink-drop-render",
  name: "Ink Drops — counter rendering (overflow + both seats)",
  description:
    "Board staging for the ink-drop token strip: 8 ink drops on player one (exercises the +N overflow chip) and 2 on player two (opponent inkwell), with the ink-drop card families in hand/play for payment drills. Load via /tests/set14-ink-drop-render.",
  skipPreGame: true,
  playerOne: {
    hand: [
      { card: higitusFigitus, isDrying: false },
      { card: khanTransportDelivery, isDrying: false },
    ],
    play: [
      { card: madamMimResourcefulTrickster, isDrying: false },
      { card: wasabiCalledIntoBattle, isDrying: false },
    ],
    discard: [
      // (empty)
    ],
    deck: [],
    inkwell: 20,
    inkDrops: 8,
    lore: 5,
  },
  playerTwo: {
    hand: [
      // (empty)
    ],
    play: [
      // (none)
    ],
    discard: [],
    deck: [],
    inkwell: 10,
    lore: 0,
    inkDrops: 2,
  },
  seed: "set14-ink-drop-render",
});

export const SET14_CONDITION_SCENARIO_FIXTURE_IDS = [
  "set14-ink-drops",
  "set14-singers-songs",
  "set14-discard-ten",
  "set14-items",
  "set14-gargoyle-hand",
  "set14-locations-movement",
  "set14-damage-challenge",
  "set14-detective-court",
  "set14-super-team",
  "set14-shift-bases",
  "set14-ink-drop-render",
] as const;
