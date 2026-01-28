// @ts-nocheck - Skipped tests contain expected values that don't match current types
import { describe, expect, it } from "bun:test";
import {
  Abilities,
  Conditions,
  Costs,
  Effects,
  Targets,
  Triggers,
} from "@tcg/lorcana-types";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 002 Card Text Parser Tests - Characters N Z", () => {
  it.skip("Nana - Darling Family Pet: should parse card text", () => {
    const text =
      "NURSEMAID Whenever you play a Floodborn character, you may remove all damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const nursemaid = {
      type: "triggered",
      name: "NURSEMAID",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "FLOODBORN_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: "all",
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].name).toBe("NURSEMAID");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nursemaid),
    );
  });

  it.skip("Rapunzel - Gifted Artist: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Rapunzel.)\nLET YOUR POWER SHINE Whenever you remove 1 or more damage from one of your characters, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: LET YOUR POWER SHINE
    const letYourPowerShine = {
      type: "triggered",
      name: "LET YOUR POWER SHINE",
      trigger: {
        timing: "whenever",
        event: "remove-damage",
        on: "YOUR_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[1].name).toBe("LET YOUR POWER SHINE");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(letYourPowerShine),
    );
  });

  it.skip("Sleepy - Nodding Off: should parse card text", () => {
    const text = "YAWN! This character enters play exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const yawn = {
      type: "static",
      name: "YAWN!",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
    };
    expect(result.abilities[0].name).toBe("YAWN!");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(yawn));
  });

  it.skip("Sneezy - Very Allergic: should parse card text", () => {
    const text =
      "AH-CHOO! Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ahChoo = {
      type: "triggered",
      name: "AH-CHOO!",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "SELF_OR_SEVEN_DWARFS_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: -1,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
      },
    };
    expect(result.abilities[0].name).toBe("AH-CHOO!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ahChoo),
    );
  });

  it.skip("Snow White - Lost in the Forest: should parse card text", () => {
    const text =
      "I WON'T HURT YOU When you play this character, you may remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const iWontHurtYou = {
      type: "triggered",
      name: "I WON'T HURT YOU",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].name).toBe("I WON'T HURT YOU");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iWontHurtYou),
    );
  });

  it.skip("Snow White - Unexpected Houseguest: should parse card text", () => {
    const text =
      "HOW DO YOU DO? You pay 1 {I} less to play Seven Dwarfs characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const howDoYouDo = {
      type: "static",
      name: "HOW DO YOU DO?",
      effect: {
        type: "cost-reduction",
        reduction: { ink: 1 },
        target: "SEVEN_DWARFS_CHARACTERS",
      },
    };
    expect(result.abilities[0].name).toBe("HOW DO YOU DO?");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(howDoYouDo),
    );
  });

  it.skip("Snow White - Well Wisher: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Snow White.)\nWISHES COME TRUE Whenever this character quests, you may return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: WISHES COME TRUE
    const wishesComeTrue = {
      type: "triggered",
      name: "WISHES COME TRUE",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "CHARACTER_FROM_DISCARD",
        },
      },
    };
    expect(result.abilities[1].name).toBe("WISHES COME TRUE");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(wishesComeTrue),
    );
  });

  it.skip("The Queen - Commanding Presence: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named The Queen.)\nWHO IS THE FAIREST? Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 2 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: WHO IS THE FAIREST?
    const whoIsTheFairest = {
      type: "triggered",
      name: "WHO IS THE FAIREST?",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "compound",
        effects: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: -4,
            target: "CHOSEN_OPPOSING_CHARACTER",
            duration: "this-turn",
          },
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 4,
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
        ],
      },
    };
    expect(result.abilities[1].name).toBe("WHO IS THE FAIREST?");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(whoIsTheFairest),
    );
  });

  it.skip("Painting the Roses Red: should parse card text", () => {
    const text = "Up to 2 chosen characters get -1 {S} this turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const paintingTheRosesRed = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: -1,
            target: "UP_TO_2_CHOSEN_CHARACTERS",
            duration: "this-turn",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(paintingTheRosesRed),
    );
  });

  it.skip("Zero to Hero: should parse card text", () => {
    const text =
      "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const zeroToHero = {
      type: "action",
      effect: {
        type: "cost-reduction",
        reduction: { ink: "CHARACTER_COUNT" },
        target: "NEXT_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(zeroToHero),
    );
  });

  it.skip("Sleepy's Flute: should parse card text", () => {
    const text =
      "A SILLY SONG {E} — If you played a song this turn, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const aSillySong = {
      type: "activated",
      name: "A SILLY SONG",
      cost: {
        exert: true,
      },
      effect: {
        type: "conditional",
        condition: {
          type: "played-this-turn",
          cardType: "song",
        },
        effect: {
          type: "gain-lore",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[0].name).toBe("A SILLY SONG");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(aSillySong),
    );
  });

  it.skip("Pinocchio - On the Run: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Pinocchio.)\nLISTEN TO YOUR CONSCIENCE When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: LISTEN TO YOUR CONSCIENCE
    const listenToYourConscience = {
      type: "triggered",
      name: "LISTEN TO YOUR CONSCIENCE",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "CHOSEN_CHARACTER_OR_ITEM_COST_3_OR_LESS",
        },
      },
    };
    expect(result.abilities[1].name).toBe("LISTEN TO YOUR CONSCIENCE");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(listenToYourConscience),
    );
  });

  it.skip("Pinocchio - Talkative Puppet: should parse card text", () => {
    const text =
      "TELLING LIES When you play this character, you may exert chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const tellingLies = {
      type: "triggered",
      name: "TELLING LIES",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "exert",
          target: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].name).toBe("TELLING LIES");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(tellingLies),
    );
  });

  it.skip("Yzma - Scary Beyond All Reason: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Yzma.)\nCRUEL IRONY When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: CRUEL IRONY
    const cruelIrony = {
      type: "triggered",
      name: "CRUEL IRONY",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [
          {
            type: "shuffle-into-deck",
            target: "CHOSEN_OTHER_CHARACTER",
          },
          {
            type: "draw",
            amount: 2,
            target: "THAT_PLAYER",
          },
        ],
      },
    };
    expect(result.abilities[1].name).toBe("CRUEL IRONY");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(cruelIrony),
    );
  });

  it.skip("Perplexing Signposts: should parse card text", () => {
    const text =
      "TO WONDERLAND Banish this item — Return chosen character of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const toWonderland = {
      type: "activated",
      name: "TO WONDERLAND",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "return-to-hand",
        target: "YOUR_CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].name).toBe("TO WONDERLAND");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(toWonderland),
    );
  });

  it.skip("The Sorcerer's Spellbook: should parse card text", () => {
    const text = "KNOWLEDGE {E}, 1 {I} — Gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const knowledge = {
      type: "activated",
      name: "KNOWLEDGE",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].name).toBe("KNOWLEDGE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(knowledge),
    );
  });

  it.skip("Pain - Underworld Imp: should parse card text", () => {
    const text =
      "COMING, YOUR MOST LUGUBRIOUSNESS While this character has 5 {S} or more, he gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const comingYourMostLugubriousness = {
      type: "static",
      name: "COMING, YOUR MOST LUGUBRIOUSNESS",
      condition: {
        type: "stat-threshold",
        stat: "strength",
        value: 5,
        comparison: "or-more",
        target: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
    };
    expect(result.abilities[0].name).toBe("COMING, YOUR MOST LUGUBRIOUSNESS");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(comingYourMostLugubriousness),
    );
  });

  it.skip("Panic - Underworld Imp: should parse card text", () => {
    const text =
      "I CAN HANDLE IT When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const iCanHandleIt = {
      type: "triggered",
      name: "I CAN HANDLE IT",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "name",
          name: "Pain",
          target: "CHOSEN_CHARACTER",
        },
        ifTrue: {
          type: "modify-stat",
          stat: "strength",
          modifier: 4,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
        ifFalse: {
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
      },
    };
    expect(result.abilities[0].name).toBe("I CAN HANDLE IT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iCanHandleIt),
    );
  });

  it.skip("Pete - Bad Guy: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nTAKE THAT! Whenever you play an action, this character gets +2 {S} this turn.\nWHO'S NEXT? While this character has 7 {S} or more, he gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Ward
    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Second ability: TAKE THAT!
    const takeThat = {
      type: "triggered",
      name: "TAKE THAT!",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "YOUR_ACTIONS",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
    };
    expect(result.abilities[1].name).toBe("TAKE THAT!");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(takeThat),
    );

    // Third ability: WHO'S NEXT?
    const whosNext = {
      type: "static",
      name: "WHO'S NEXT?",
      condition: {
        type: "stat-threshold",
        stat: "strength",
        value: 7,
        comparison: "or-more",
        target: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
    };
    expect(result.abilities[2].name).toBe("WHO'S NEXT?");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(whosNext),
    );
  });

  it.skip("Prince John - Greediest of All: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nI SENTENCE YOU Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Ward
    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));

    // Second ability: I SENTENCE YOU
    const iSentenceYou = {
      type: "triggered",
      name: "I SENTENCE YOU",
      trigger: {
        timing: "whenever",
        event: "discard",
        on: "OPPONENT",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: "DISCARDED_COUNT",
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[1].name).toBe("I SENTENCE YOU");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(iSentenceYou),
    );
  });

  it.skip("Queen of Hearts - Quick-Tempered: should parse card text", () => {
    const text =
      "ROYAL RAGE When you play this character, deal 1 damage to chosen damaged opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const royalRage = {
      type: "triggered",
      name: "ROYAL RAGE",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: "CHOSEN_DAMAGED_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].name).toBe("ROYAL RAGE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(royalRage),
    );
  });

  it.skip("Ratigan - Criminal Mastermind: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("Ray - Easygoing Firefly: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );
  });

  it.skip("The Queen - Disguised Peddler: should parse card text", () => {
    const text =
      "A PERFECT DISGUISE {E}, Choose and discard a character card — Gain lore equal to the discarded character's {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const aPerfectDisguise = {
      type: "activated",
      name: "A PERFECT DISGUISE",
      cost: {
        exert: true,
        discard: {
          cardType: "character",
          amount: 1,
        },
      },
      effect: {
        type: "gain-lore",
        amount: "DISCARDED_CARD_LORE",
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].name).toBe("A PERFECT DISGUISE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(aPerfectDisguise),
    );
  });

  it.skip("Pack Tactics: should parse card text", () => {
    const text =
      "Gain 1 lore for each damaged character opponents have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const packTactics = {
      type: "action",
      effect: {
        type: "gain-lore",
        amount: "OPPONENTS_DAMAGED_CHARACTER_COUNT",
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(packTactics),
    );
  });

  it.skip("Ring the Bell: should parse card text", () => {
    const text = "Banish chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ringTheBell = {
      type: "action",
      effect: {
        type: "banish",
        target: "CHOSEN_DAMAGED_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ringTheBell),
    );
  });

  it.skip("Ratigan's Marvelous Trap: should parse card text", () => {
    const text =
      "SNAP! BOOM! TWANG! Banish this item — Each opponent loses 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const snapBoomTwang = {
      type: "activated",
      name: "SNAP! BOOM! TWANG!",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "lose-lore",
        amount: 2,
        target: "EACH_OPPONENT",
      },
    };
    expect(result.abilities[0].name).toBe("SNAP! BOOM! TWANG!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(snapBoomTwang),
    );
  });

  it.skip("Namaari - Nemesis: should parse card text", () => {
    const text =
      "THIS SHOULDN'T TAKE LONG {E}, Banish this character — Banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const thisShouldntTakeLong = {
      type: "activated",
      name: "THIS SHOULDN'T TAKE LONG",
      cost: {
        exert: true,
        banishSelf: true,
      },
      effect: {
        type: "banish",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].name).toBe("THIS SHOULDN'T TAKE LONG");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thisShouldntTakeLong),
    );
  });

  it.skip("Ratigan - Very Large Mouse: should parse card text", () => {
    const text =
      "THIS IS MY KINGDOM When you play this character, exert chosen opposing character with 3 {S} or less. Choose one of your characters and ready them. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const thisIsMyKingdom = {
      type: "triggered",
      name: "THIS IS MY KINGDOM",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [
          {
            type: "exert",
            target: "CHOSEN_OPPOSING_CHARACTER_3_STRENGTH_OR_LESS",
          },
          {
            type: "ready",
            target: "YOUR_CHOSEN_CHARACTER",
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
        ],
      },
    };
    expect(result.abilities[0].name).toBe("THIS IS MY KINGDOM");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(thisIsMyKingdom),
    );
  });

  it.skip("Raya - Leader of Heart: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Raya.)\nCHAMPION OF KUMANDRA Whenever this character challenges a damaged character, she takes no damage from the challenge.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: CHAMPION OF KUMANDRA
    const championOfKumandra = {
      type: "triggered",
      name: "CHAMPION OF KUMANDRA",
      trigger: {
        timing: "whenever",
        event: "challenge",
        on: "SELF",
        condition: {
          type: "target-is-damaged",
        },
      },
      effect: {
        type: "prevent-damage",
        target: "SELF",
        source: "CHALLENGE",
      },
    };
    expect(result.abilities[1].name).toBe("CHAMPION OF KUMANDRA");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(championOfKumandra),
    );
  });

  it.skip("Scar - Vicious Cheater: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nDADDY ISN'T HERE TO SAVE YOU During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Rush
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));

    // Second ability: DADDY ISN'T HERE TO SAVE YOU
    const daddyIsntHereToSaveYou = {
      type: "triggered",
      name: "DADDY ISN'T HERE TO SAVE YOU",
      condition: {
        type: "your-turn",
      },
      trigger: {
        timing: "whenever",
        event: "banish-in-challenge",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [
            {
              type: "ready",
              target: "SELF",
            },
            {
              type: "restriction",
              restriction: "cant-quest",
              target: "SELF",
              duration: "this-turn",
            },
          ],
        },
      },
    };
    expect(result.abilities[1].name).toBe("DADDY ISN'T HERE TO SAVE YOU");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(daddyIsntHereToSaveYou),
    );
  });

  it.skip("Tigger - One of a Kind: should parse card text", () => {
    const text =
      "ENERGETIC Whenever you play an action, this character gets +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const energetic = {
      type: "triggered",
      name: "ENERGETIC",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "YOUR_ACTIONS",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].name).toBe("ENERGETIC");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(energetic),
    );
  });

  it.skip("Tuk Tuk - Wrecking Ball: should parse card text", () => {
    const text =
      "Reckless (This character can't quest and must challenge each turn if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const reckless = Abilities.Keyword("Reckless");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(reckless),
    );
  });

  it.skip("Teeth and Ambitions: should parse card text", () => {
    const text =
      "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const teethAndAmbitions = {
      type: "action",
      effect: {
        type: "cost-effect",
        cost: {
          type: "deal-damage",
          amount: 2,
          target: "YOUR_CHOSEN_CHARACTER",
        },
        effect: {
          type: "deal-damage",
          amount: 2,
          target: "CHOSEN_OTHER_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(teethAndAmbitions),
    );
  });

  it.skip("The Most Diabolical Scheme: should parse card text", () => {
    const text = "Banish chosen Villain of yours to banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const theMostDiabolicalScheme = {
      type: "action",
      effect: {
        type: "cost-effect",
        cost: {
          type: "banish",
          target: "YOUR_CHOSEN_VILLAIN",
        },
        effect: {
          type: "banish",
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theMostDiabolicalScheme),
    );
  });

  it.skip("What Did You Call Me?: should parse card text", () => {
    const text = "Chosen damaged character gets +3 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const whatDidYouCallMe = {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "CHOSEN_DAMAGED_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatDidYouCallMe),
    );
  });

  it.skip("Peter Pan's Dagger: should parse card text", () => {
    const text = "Your characters with Evasive get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const peterPansDagger = {
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_EVASIVE_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(peterPansDagger),
    );
  });

  it.skip("Sword in the Stone: should parse card text", () => {
    const text =
      "{E}, 2 {I} — Chosen character gets +1 {S} this turn for each 1 damage on them.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const swordInTheStone = {
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: {
          type: "for-each",
          counter: "damage-on-target",
          modifier: 1,
        },
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(swordInTheStone),
    );
  });

  it.skip("Nick Wilde - Wily Fox: should parse card text", () => {
    const text =
      "IT'S CALLED A HUSTLE When you play this character, you may return an item card named Pawpsicle from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const itsCalledAHustle = {
      type: "triggered",
      name: "IT'S CALLED A HUSTLE",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          target: "PAWPSICLE_ITEM",
          destination: "hand",
        },
      },
    };
    expect(result.abilities[0].name).toBe("IT'S CALLED A HUSTLE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(itsCalledAHustle),
    );
  });

  it.skip("Noi - Orphaned Thief: should parse card text", () => {
    const text =
      "HIDE AND SEEK While you have an item in play, this character gains Resist +1 and Ward. (Damage dealt to this character is reduced by 1. Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hideAndSeek = {
      type: "static",
      name: "HIDE AND SEEK",
      condition: {
        type: "have-card",
        cardType: "item",
        controller: "you",
      },
      effect: {
        type: "gain-keywords",
        keywords: [{ keyword: "Resist", value: 1 }, { keyword: "Ward" }],
        target: "SELF",
      },
    };
    expect(result.abilities[0].name).toBe("HIDE AND SEEK");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hideAndSeek),
    );
  });

  it.skip("Sisu - Divine Water Dragon: should parse card text", () => {
    const text =
      "I TRUST YOU Whenever this character quests, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const iTrustYou = {
      type: "triggered",
      name: "I TRUST YOU",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        effects: [
          {
            type: "look",
            source: "deck",
            position: "top",
            count: 2,
          },
          {
            type: "optional",
            effect: {
              type: "put-into-hand",
              count: 1,
            },
          },
          {
            type: "put-on-deck",
            position: "bottom",
            order: "any",
          },
        ],
      },
    };
    expect(result.abilities[0].name).toBe("I TRUST YOU");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iTrustYou),
    );
  });

  it.skip("The Nokk - Water Spirit: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Nothing to Hide: should parse card text", () => {
    const text = "Each opponent reveals their hand. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const nothingToHide = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "reveal-hand",
            target: "EACH_OPPONENT",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(nothingToHide),
    );
  });

  it.skip("Pawpsicle: should parse card text", () => {
    const text =
      "JUMBO POP When you play this item, you may draw a card.\nTHAT'S REDWOOD Banish this item — Remove up to 2 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: JUMBO POP
    const jumboPop = {
      type: "triggered",
      name: "JUMBO POP",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    };
    expect(result.abilities[0].name).toBe("JUMBO POP");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(jumboPop),
    );

    // Second ability: THAT'S REDWOOD
    const thatsRedwood = {
      type: "activated",
      name: "THAT'S REDWOOD",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "remove-damage",
        amount: 2,
        upTo: true,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[1].name).toBe("THAT'S REDWOOD");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(thatsRedwood),
    );
  });

  it.skip("Sardine Can: should parse card text", () => {
    const text =
      "FLIGHT CABIN Your exerted characters gain Ward. (Opponents can't choose them except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const flightCabin = {
      type: "static",
      name: "FLIGHT CABIN",
      effect: {
        type: "grant-keyword",
        keyword: "Ward",
        target: "YOUR_EXERTED_CHARACTERS",
      },
    };
    expect(result.abilities[0].name).toBe("FLIGHT CABIN");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(flightCabin),
    );
  });

  it.skip("Namaari - Morning Mist: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nBLADES This character can challenge ready characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // Second ability: BLADES
    const blades = {
      type: "static",
      name: "BLADES",
      effect: {
        type: "challenge-ready",
        target: "SELF",
      },
    };
    expect(result.abilities[1].name).toBe("BLADES");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(blades),
    );
  });

  it.skip("Queen of Hearts - Capricious Monarch: should parse card text", () => {
    const text =
      "OFF WITH THEIR HEADS! Whenever an opposing character is banished, you may ready this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const offWithTheirHeads = {
      type: "triggered",
      name: "OFF WITH THEIR HEADS!",
      trigger: {
        timing: "whenever",
        event: "banish",
        on: "OPPOSING_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].name).toBe("OFF WITH THEIR HEADS!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(offWithTheirHeads),
    );
  });

  it.skip("The Huntsman - Reluctant Enforcer: should parse card text", () => {
    const text =
      "CHANGE OF HEART Whenever this character quests, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const changeOfHeart = {
      type: "triggered",
      name: "CHANGE OF HEART",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [
            {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
            {
              type: "discard",
              amount: 1,
              chosenBy: "you",
            },
          ],
        },
      },
    };
    expect(result.abilities[0].name).toBe("CHANGE OF HEART");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(changeOfHeart),
    );
  });

  it.skip("The Prince - Never Gives Up: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nResist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // Second ability: Resist +1
    const resist: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 1,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(resist),
    );
  });

  it.skip("Tiana - Celebrating Princess: should parse card text", () => {
    const text =
      "Resist +2 (Damage dealt to this character is reduced by 2.)\nWHAT YOU GIVE IS WHAT YOU GET While this character is exerted and you have no cards in your hand, opponents can't play actions.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Resist +2
    const resist: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Resist",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(resist),
    );

    // Second ability: WHAT YOU GIVE IS WHAT YOU GET
    const whatYouGive = {
      type: "static",
      name: "WHAT YOU GIVE IS WHAT YOU GET",
      condition: {
        type: "and",
        conditions: [
          { type: "exerted", target: "SELF" },
          { type: "hand-count", controller: "you", count: 0 },
        ],
      },
      effect: {
        type: "restriction",
        restriction: "cant-play-actions",
        target: "OPPONENTS",
      },
    };
    expect(result.abilities[1].name).toBe("WHAT YOU GIVE IS WHAT YOU GET");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(whatYouGive),
    );
  });

  it.skip("Pick a Fight: should parse card text", () => {
    const text = "Chosen character can challenge ready characters this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const pickAFight = {
      type: "action",
      effect: {
        type: "grant-ability",
        ability: {
          type: "can-challenge-ready",
        },
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(pickAFight),
    );
  });

  it.skip("Weight Set: should parse card text", () => {
    const text =
      "TRAINING Whenever you play a character with 4 or more, you may pay 1 to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const training = {
      type: "triggered",
      name: "TRAINING",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "YOUR_CHARACTERS_COST_4_OR_MORE",
      },
      effect: {
        type: "optional",
        effect: {
          type: "cost-effect",
          cost: {
            ink: 1,
          },
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        },
      },
    };
    expect(result.abilities[0].name).toBe("TRAINING");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(training),
    );
  });
});
