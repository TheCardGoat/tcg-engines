// @ts-nocheck - Skipped tests contain expected values that don't match current types
import { describe, expect, it } from "bun:test";
import { Abilities, Conditions, Costs, Effects, Targets, Triggers } from "@tcg/lorcana-types";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 004 Card Text Parser Tests - Characters N Z", () => {
  it.skip("Prince Eric - Seafaring Prince: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose a character with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(bodyguard));
  });

  it.skip("Prince Eric - Ursula's Groom: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Prince Eric.)\nUNDER VANESSA'S SPELL While you have a character named Ursula in play, this character gains Bodyguard and gets +2 {W}. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift4 = Abilities.Shift({ cost: Costs.Ink(4) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift4));

    // Second ability: UNDER VANESSA'S SPELL static
    const underVanessasSpell = {
      effect: {
        condition: { name: "Ursula", type: "have-character" },
        then: { effects: [], type: "compound" },
        type: "conditional",
      },
      name: "UNDER VANESSA'S SPELL",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(underVanessasSpell));
  });

  it.skip("Ursula - Eric's Bride: should parse card text", () => {
    const text =
      "Shift: Discard a song card (You may discard a song card to play this on top of one of your characters named Ursula.)\nVANESSA'S DESIGN Whenever this character quests, chosen opponent reveals their hand and discards a non-character card of your choice.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift with discard cost
    const shiftDiscardSong = Abilities.Shift({ cost: Costs.Discard(1) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shiftDiscardSong));

    // Second ability: VANESSA'S DESIGN triggered
    const vanessasDesign = {
      effect: {
        effects: [
          { target: "OPPONENT", type: "reveal-hand" },
          { amount: 1, target: "OPPONENT", type: "discard" },
        ],
        type: "sequence",
      },
      name: "VANESSA'S DESIGN",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(vanessasDesign));
  });

  it.skip("Sign the Scroll: should parse card text", () => {
    const text =
      "Each opponent may choose and discard a card. For each opponent who doesn't, you gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const signTheScroll = {
      effect: {
        counter: { controller: "opponent", type: "cards-in-hand" },
        effect: { amount: 2, type: "gain-lore" },
        type: "for-each",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(signTheScroll));
  });

  it.skip("Record Player: should parse card text", () => {
    const text =
      "LOOK AT THIS! Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.\nHIT PARADE Your characters named Stitch count as having +1 cost to sing songs.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: LOOK AT THIS! triggered
    const lookAtThis = {
      effect: {
        modifier: -2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      name: "LOOK AT THIS!",
      trigger: {
        event: "play",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(lookAtThis));

    // Second ability: HIT PARADE static
    const hitParade = {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      name: "HIT PARADE",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(hitParade));
  });

  it.skip("The Underworld - River Styx: should parse card text", () => {
    const text =
      "SAVE A SOUL Whenever a character quests while here, you may pay 3 {I} to return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const saveASoul = {
      effect: {
        effect: {
          target: "CHARACTER_FROM_DISCARD",
          type: "return-to-hand",
        },
        type: "optional",
      },
      name: "SAVE A SOUL",
      trigger: {
        event: "quest",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(saveASoul));
  });

  it.skip("Pepa Madrigal - Weather Maker: should parse card text", () => {
    const text =
      "IT LOOKS LIKE RAIN When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless they're at a location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const itLooksLikeRain = {
      effect: {
        type: "optional",
      },
      name: "IT LOOKS LIKE RAIN",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(itLooksLikeRain));
  });

  it.skip("Peter Pan - Shadow Finder: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)\nFLY, OF COURSE! Your other characters with Evasive gain Rush.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Rush
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // Second ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(evasive));

    // Third ability: FLY, OF COURSE! static
    const flyOfCourse = {
      effect: {
        type: "gain-keyword",
      },
      name: "FLY, OF COURSE!",
      type: "static",
    };
    expect(result.abilities[2].ability).toEqual(expect.objectContaining(flyOfCourse));
  });

  it.skip("Ursula - Mad Sea Witch: should parse card text", () => {
    const text = "Challenger +2 (While challenging, this character gets +2 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const challenger2 = Abilities.KeywordParameterized("Challenger", {
      value: 2,
    });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(challenger2));
  });

  it.skip("Ursula - Sea Witch Queen: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Ursula.)\nNOW I AM THE RULER! Whenever this character quests, exert chosen character.\nYOU'LL LISTEN TO ME! Other characters can't exert to sing songs.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 5
    const shift5 = Abilities.Shift({ cost: Costs.Ink(5) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift5));

    // Second ability: NOW I AM THE RULER! triggered
    const nowIAmTheRuler = {
      effect: {
        type: "exert",
      },
      name: "NOW I AM THE RULER!",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(nowIAmTheRuler));

    // Third ability: YOU'LL LISTEN TO ME! static
    const youllListenToMe = {
      effect: {
        type: "restriction",
      },
      name: "YOU'LL LISTEN TO ME!",
      type: "static",
    };
    expect(result.abilities[2].ability).toEqual(expect.objectContaining(youllListenToMe));
  });

  it.skip("Yen Sid - Powerful Sorcerer: should parse card text", () => {
    const text =
      "TIMELY INTERVENTION When you play this character, if you have a character named Magic Broom in play, you may draw a card. ARCANE STUDY While you have 2 or more Broom characters in play, this character gets +2.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: TIMELY INTERVENTION triggered
    const timelyIntervention = {
      effect: {
        type: "conditional",
      },
      name: "TIMELY INTERVENTION",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(timelyIntervention));

    // Second ability: ARCANE STUDY static
    const arcaneStudy = {
      effect: {
        type: "conditional",
      },
      name: "ARCANE STUDY",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(arcaneStudy));
  });

  it.skip("Ursula's Plan: should parse card text", () => {
    const text =
      "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ursulasPlan = {
      effect: {
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ursulasPlan));
  });

  it.skip("Triton's Trident: should parse card text", () => {
    const text =
      "SYMBOL OF POWER Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const symbolOfPower = {
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "for-each",
      },
      name: "SYMBOL OF POWER",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(symbolOfPower));
  });

  it.skip("Ursula's Lair - Eye of the Storm: should parse card text", () => {
    const text =
      "SLIPPERY HALLS Whenever a character is banished in a challenge while here, you may return them to your hand.\nSEAT OF POWER Characters named Ursula get +1 {L} while here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SLIPPERY HALLS triggered
    const slipperyHalls = {
      effect: {
        type: "optional",
      },
      name: "SLIPPERY HALLS",
      trigger: {
        event: "banish-in-challenge",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(slipperyHalls));

    // Second ability: SEAT OF POWER static
    const seatOfPower = {
      effect: {
        type: "modify-stat",
      },
      name: "SEAT OF POWER",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(seatOfPower));
  });

  it.skip("Panic - Immortal Sidekick: should parse card text", () => {
    const text =
      "REPORTING FOR DUTY While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const reportingForDuty = {
      effect: {
        type: "conditional",
      },
      name: "REPORTING FOR DUTY",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(reportingForDuty));
  });

  it.skip("Pegasus - Cloud Racer: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Pegasus.)\nEvasive (Only characters with Evasive can challenge this character.)\nHOP ON! When you play this character, if you used Shift to play him, your characters gain Evasive until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 3
    const shift3 = Abilities.Shift({ cost: Costs.Ink(3) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift3));

    // Second ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(evasive));

    // Third ability: HOP ON! triggered
    const hopOn = {
      effect: {
        type: "conditional",
      },
      name: "HOP ON!",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[2].ability).toEqual(expect.objectContaining(hopOn));
  });

  it.skip("Pete - Born to Cheat: should parse card text", () => {
    const text =
      "I CLOBBER YOU! Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const iClobberYou = {
      effect: {
        type: "conditional",
      },
      name: "I CLOBBER YOU!",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(iClobberYou));
  });

  it.skip("The Fates - Only One Eye: should parse card text", () => {
    const text =
      "ALL WILL BE SEEN When you play this character, look at the top card of each opponent's deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const allWillBeSeen = {
      effect: {
        type: "look-at-top",
      },
      name: "ALL WILL BE SEEN",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(allWillBeSeen));
  });

  it.skip("The Muses - Proclaimers of Heroes: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nTHE GOSPEL TRUTH Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward
    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Second ability: THE GOSPEL TRUTH triggered
    const theGospelTruth = {
      effect: {
        type: "optional",
      },
      name: "THE GOSPEL TRUTH",
      trigger: {
        event: "play",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(theGospelTruth));
  });

  it.skip("Zeus - Mr. Lightning Bolts: should parse card text", () => {
    const text =
      "TARGET PRACTICE Whenever this character challenges another character, he gets +{S} equal to the {S} of chosen character this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const targetPractice = {
      effect: {
        type: "modify-stat",
      },
      name: "TARGET PRACTICE",
      trigger: {
        event: "challenge",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(targetPractice));
  });

  it.skip("Ursula's Trickery: should parse card text", () => {
    const text =
      "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ursulasTrickery = {
      effect: {
        type: "conditional",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ursulasTrickery));
  });

  it.skip("We Don't Talk About Bruno: should parse card text", () => {
    const text =
      "Return chosen character to their player's hand, then that player discards a card at random.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const weDontTalkAboutBruno = {
      effect: {
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(weDontTalkAboutBruno));
  });

  it.skip("Vision Slab: should parse card text", () => {
    const text =
      "DANGER REVEALED At the start of your turn, if an opposing character has damage, gain 1 lore.\nTRAPPED! Damage counters can't be removed.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: DANGER REVEALED triggered
    const dangerRevealed = {
      effect: {
        type: "conditional",
      },
      name: "DANGER REVEALED",
      trigger: {
        event: "start-of-turn",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(dangerRevealed));

    // Second ability: TRAPPED! static
    const trapped = {
      effect: {
        type: "restriction",
      },
      name: "TRAPPED!",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(trapped));
  });

  it.skip("Ursula's Garden - Full of the Unfortunate: should parse card text", () => {
    const text =
      "ABANDON HOPE While you have an exerted character here, opposing characters get -1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const abandonHope = {
      effect: {
        type: "conditional",
      },
      name: "ABANDON HOPE",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(abandonHope));
  });

  it.skip("Namaari - Heir of Fang: should parse card text", () => {
    const text =
      "TWO-WEAPON FIGHTING During your turn, whenever this character deals damage to another character in a challenge, you may deal the same amount of damage to another chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const twoWeaponFighting = {
      effect: {
        type: "optional",
      },
      name: "TWO-WEAPON FIGHTING",
      trigger: {
        event: "deal-damage",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(twoWeaponFighting));
  });

  it.skip("Noi - Acrobatic Baby: should parse card text", () => {
    const text =
      "FANCY FOOTWORK Whenever you play an action, this character takes no damage from challenges this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const fancyFootwork = {
      effect: {
        type: "protection",
      },
      name: "FANCY FOOTWORK",
      trigger: {
        event: "play",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(fancyFootwork));
  });

  it.skip("Pegasus - Flying Steed: should parse card text", () => {
    const text = "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(evasive));
  });

  it.skip("Raya - Fierce Protector: should parse card text", () => {
    const text =
      "DON'T CROSS ME Whenever this character challenges another character, gain 1 lore for each other damaged character you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const dontCrossMe = {
      effect: {
        type: "for-each",
      },
      name: "DON'T CROSS ME",
      trigger: {
        event: "challenge",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(dontCrossMe));
  });

  it.skip("Raya - Guardian of the Dragon Gem: should parse card text", () => {
    const text =
      "WE HAVE TO COME TOGETHER When you play this character, ready chosen character of yours at a location. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const weHaveToComeTogether = {
      effect: {
        type: "sequence",
      },
      name: "WE HAVE TO COME TOGETHER",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(weHaveToComeTogether));
  });

  it.skip("Sisu - Empowered Sibling: should parse card text", () => {
    const text =
      "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Sisu.)\nI GOT THIS! When you play this character, banish all opposing characters with 2 {S} or less.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 6
    const shift6 = Abilities.Shift({ cost: Costs.Ink(6) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift6));

    // Second ability: I GOT THIS! triggered
    const iGotThis = {
      effect: {
        type: "banish",
      },
      name: "I GOT THIS!",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(iGotThis));
  });

  it.skip("Tong - Survivor: should parse card text", () => {
    const text = "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const reckless = Abilities.Keyword("Reckless");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(reckless));
  });

  it.skip("The Plank: should parse card text", () => {
    const text =
      "WALK! 2 {I}, Banish this item – Choose one:\n• Banish chosen Hero character.\n• Ready chosen Villain character. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const walk = {
      cost: {
        banishSelf: true,
        ink: 2,
      },
      effect: {
        type: "choice",
      },
      name: "WALK!",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(walk));
  });

  it.skip("Vitalisphere: should parse card text", () => {
    const text =
      "EXTRACT OF RUBY 1 {I}, Banish this item — Chosen character gains Rush and gets +2 {S} this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const extractOfRuby = {
      cost: {
        banishSelf: true,
        ink: 1,
      },
      effect: {
        type: "sequence",
      },
      name: "EXTRACT OF RUBY",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(extractOfRuby));
  });

  it.skip("Snuggly Duckling - Disreputable Pub: should parse card text", () => {
    const text =
      "ROUTINE RUCKUS Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const routineRuckus = {
      effect: {
        type: "conditional",
      },
      name: "ROUTINE RUCKUS",
      trigger: {
        event: "challenge",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(routineRuckus));
  });

  it.skip("Training Grounds - Impossible Pillar: should parse card text", () => {
    const text = "STRENGTH OF MIND 1 {I} — Chosen character here gets +1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const strengthOfMind = {
      cost: {
        ink: 1,
      },
      effect: {
        type: "modify-stat",
      },
      name: "STRENGTH OF MIND",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(strengthOfMind));
  });

  it.skip("Olaf - Carrot Enthusiast: should parse card text", () => {
    const text =
      "Shift: Discard an item card (You may discard an item card to play this on top of one of your characters named Olaf.)\nCARROTS ALL AROUND! Whenever he quests, each of your other characters gets +{S} equal to this character's {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift with discard item
    const shiftDiscardItem = Abilities.Shift({ cost: Costs.Discard(1) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shiftDiscardItem));

    // Second ability: CARROTS ALL AROUND! triggered
    const carrotsAllAround = {
      effect: {
        type: "modify-stat",
      },
      name: "CARROTS ALL AROUND!",
      trigger: {
        event: "quest",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(carrotsAllAround));
  });

  it.skip("Olaf - Trusting Companion: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(support));
  });

  it.skip("Pascal - Inquisitive Pet: should parse card text", () => {
    const text =
      "COLORFUL TACTICS When you play this character, look at the top 3 cards of your deck and put them back in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const colorfulTactics = {
      effect: {
        type: "scry",
      },
      name: "COLORFUL TACTICS",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(colorfulTactics));
  });

  it.skip("Prince Phillip - Gallant Defender: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nBEST DEFENSE Whenever one of your characters is chosen for Support, they gain Resist +1 this turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support
    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(support));

    // Second ability: BEST DEFENSE triggered
    const bestDefense = {
      effect: {
        type: "gain-keyword",
      },
      name: "BEST DEFENSE",
      trigger: {
        event: "support",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(bestDefense));
  });

  it.skip("Rapunzel - Appreciative Artist: should parse card text", () => {
    const text =
      "PERCEPTIVE PARTNER While you have a character named Pascal in play, this character gains Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const perceptivePartner = {
      effect: {
        type: "conditional",
      },
      name: "PERCEPTIVE PARTNER",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(perceptivePartner));
  });

  it.skip("Scuttle - Expert on Humans: should parse card text", () => {
    const text =
      "LET ME SEE When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const letMeSee = {
      effect: {
        type: "look-at-top",
      },
      name: "LET ME SEE",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(letMeSee));
  });

  it.skip("The Queen - Diviner: should parse card text", () => {
    const text =
      "CONSULT THE SPELLBOOK {E} — Look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. If that item costs 3 or less, you may play it for free instead and it enters play exerted. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const consultTheSpellbook = {
      cost: {
        exert: true,
      },
      effect: {
        type: "look-at-top",
      },
      name: "CONSULT THE SPELLBOOK",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(consultTheSpellbook));
  });

  it.skip("Transformed Chef - Castle Stove: should parse card text", () => {
    const text =
      "A CULINARY MASTERPIECE When you play this character, remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const aCulinaryMasterpiece = {
      effect: {
        type: "remove-damage",
      },
      name: "A CULINARY MASTERPIECE",
      trigger: {
        event: "play",
        on: "SELF",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(aCulinaryMasterpiece));
  });

  it.skip("Triton - Champion of Atlantica: should parse card text", () => {
    const text =
      "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Triton.)\nIMPOSING PRESENCE Opposing characters get -1 {S} for each location you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 6
    const shift6 = Abilities.Shift({ cost: Costs.Ink(6) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift6));

    // Second ability: IMPOSING PRESENCE static
    const imposingPresence = {
      effect: {
        type: "for-each",
      },
      name: "IMPOSING PRESENCE",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(imposingPresence));
  });

  it.skip("Triton - Discerning King: should parse card text", () => {
    const text = "CONSIGN TO THE DEPTHS {E}, Banish one of your items — Gain 3 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const consignToTheDepths = {
      cost: {
        banishOther: true,
        exert: true,
      },
      effect: {
        type: "gain-lore",
      },
      name: "CONSIGN TO THE DEPTHS",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(consignToTheDepths));
  });

  it.skip("Triton - Young Prince: should parse card text", () => {
    const text =
      "SUPERIOR SWIMMER During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nKEEPER OF ATLANTICA Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: SUPERIOR SWIMMER static
    const superiorSwimmer = {
      effect: {
        type: "gain-keyword",
      },
      name: "SUPERIOR SWIMMER",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(superiorSwimmer));

    // Second ability: KEEPER OF ATLANTICA triggered
    const keeperOfAtlantica = {
      effect: {
        type: "optional",
      },
      name: "KEEPER OF ATLANTICA",
      trigger: {
        event: "banish",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(keeperOfAtlantica));
  });

  it.skip("Seldom All They Seem: should parse card text", () => {
    const text = "Chosen character gets -3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const seldomAllTheySeem = {
      effect: {
        stat: "strength",
        type: "modify-stat",
        value: -3,
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(seldomAllTheySeem));
  });

  it.skip("Treasures Untold: should parse card text", () => {
    const text = "Return up to 2 item cards from your discard into your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const treasuresUntold = {
      effect: {
        type: "return-from-discard",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(treasuresUntold));
  });

  it.skip("Winter Camp - Medical Tent: should parse card text", () => {
    const text =
      "HELP THE WOUNDED Whenever a character quests while here, remove up to 2 damage from them. If they're a Hero character, remove up to 4 damage instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const helpTheWounded = {
      effect: {
        type: "conditional",
      },
      name: "HELP THE WOUNDED",
      trigger: {
        event: "quest",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(helpTheWounded));
  });

  it.skip("Piglet - Sturdy Swordsman: should parse card text", () => {
    const text =
      "Resist +1 (Damage dealt to this character is reduced by 1.)\nNOT SO SMALL ANYMORE While you have no cards in your hand, this character can challenge ready characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Resist +1
    const resist1 = Abilities.KeywordParameterized("Resist", { value: 1 });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(resist1));

    // Second ability: NOT SO SMALL ANYMORE static
    const notSoSmallAnymore = {
      effect: {
        type: "conditional",
      },
      name: "NOT SO SMALL ANYMORE",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(notSoSmallAnymore));
  });

  it.skip("Rajah - Royal Protector: should parse card text", () => {
    const text =
      "STEADY GAZE While you have no cards in your hand, characters with cost 4 or less can't challenge this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const steadyGaze = {
      effect: {
        type: "conditional",
      },
      name: "STEADY GAZE",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(steadyGaze));
  });

  it.skip("Raya - Unstoppable Force: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nYOU GAVE IT YOUR BEST During your turn, whenever this character banishes another character in a challenge, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Challenger +2
    const challenger2 = Abilities.KeywordParameterized("Challenger", {
      value: 2,
    });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(challenger2));

    // Second ability: Resist +2
    const resist2 = Abilities.KeywordParameterized("Resist", { value: 2 });
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(resist2));

    // Third ability: YOU GAVE IT YOUR BEST triggered
    const youGaveItYourBest = {
      effect: {
        type: "optional",
      },
      name: "YOU GAVE IT YOUR BEST",
      trigger: {
        event: "banish-in-challenge",
      },
      type: "triggered",
    };
    expect(result.abilities[2].ability).toEqual(expect.objectContaining(youGaveItYourBest));
  });

  it.skip("Yao - Imperial Soldier: should parse card text", () => {
    const text = "Challenger +2 (While challenging, this character gets +2 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const challenger2 = Abilities.KeywordParameterized("Challenger", {
      value: 2,
    });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(challenger2));
  });

  it.skip("Triton's Decree: should parse card text", () => {
    const text = "Each opponent chooses one of their characters and deals 2 damage to them.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const tritonsDecree = {
      effect: {
        type: "deal-damage",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(tritonsDecree));
  });

  it.skip("RLS Legacy's Cannon: should parse card text", () => {
    const text =
      "BA-BOOM! {E}, 2 {I}, Discard a card — Deal 2 damage to chosen character or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const baBoom = {
      cost: {
        discardCard: 1,
        exert: true,
        ink: 2,
      },
      effect: {
        type: "deal-damage",
      },
      name: "BA-BOOM!",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(baBoom));
  });

  it.skip("The Wall - Border Fortress: should parse card text", () => {
    const text =
      "PROTECT THE REALM While you have an exerted character here, your other locations can't be challenged.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const protectTheRealm = {
      effect: {
        type: "conditional",
      },
      name: "PROTECT THE REALM",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(protectTheRealm));
  });

  it.skip("Thebes - The Big Olive: should parse card text", () => {
    const text =
      "IF YOU CAN MAKE IT HERE... During your turn, whenever a character banishes another character in a challenge while here, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ifYouCanMakeItHere = {
      effect: {
        type: "gain-lore",
      },
      name: "IF YOU CAN MAKE IT HERE...",
      trigger: {
        event: "banish-in-challenge",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ifYouCanMakeItHere));
  });
});
