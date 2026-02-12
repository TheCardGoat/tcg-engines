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

describe("Set 002 Card Text Parser Tests - Characters A M", () => {
  it.skip("Bashful - Hopeless Romantic: should parse card text", () => {
    const text =
      "OH, GOSH! This character can't quest unless you have another Seven Dwarfs character in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ohGosh = {
      effect: {
        condition: {
          type: "unless",
          condition: {
            type: "have-character",
            classification: "Seven Dwarfs",
          },
        },
        restriction: "cant-quest",
        target: "SELF",
        type: "restriction",
      },
      name: "OH, GOSH!",
      type: "static",
    };
    expect(result.abilities[0].name).toBe("OH, GOSH!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(ohGosh),
    );
  });

  it.skip("Christopher Robin - Adventurer: should parse card text", () => {
    const text =
      "WE'LL ALWAYS BE TOGETHER Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const wellAlwaysBeTogether = {
      effect: {
        condition: {
          type: "character-count",
          count: 2,
          comparison: "or-more",
        },
        effect: {
          type: "gain-lore",
          amount: 2,
          target: "CONTROLLER",
        },
        type: "conditional",
      },
      name: "WE'LL ALWAYS BE TOGETHER",
      trigger: {
        event: "ready",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("WE'LL ALWAYS BE TOGETHER");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(wellAlwaysBeTogether),
    );
  });

  it.skip("Cinderella - Ballroom Sensation: should parse card text", () => {
    const text = "Singer 3 (This character counts as cost 3 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const singer: KeywordAbilityDefinition = {
      keyword: "Singer",
      type: "keyword",
      value: 3,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer),
    );
  });

  it.skip("Doc - Leader of the Seven Dwarfs: should parse card text", () => {
    const text =
      "SHARE AND SHARE ALIKE Whenever this character quests, you pay 1 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const shareAndShareAlike = {
      effect: {
        reduction: { ink: 1 },
        target: "NEXT_CHARACTER",
        type: "cost-reduction",
      },
      name: "SHARE AND SHARE ALIKE",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("SHARE AND SHARE ALIKE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shareAndShareAlike),
    );
  });

  it.skip("Dopey - Always Playful: should parse card text", () => {
    const text =
      "ODD ONE OUT When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const oddOneOut = {
      effect: {
        duration: "until-start-of-next-turn",
        modifier: 2,
        stat: "strength",
        target: "YOUR_OTHER_SEVEN_DWARFS_CHARACTERS",
        type: "modify-stat",
      },
      name: "ODD ONE OUT",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("ODD ONE OUT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(oddOneOut),
    );
  });

  it.skip("Gaston - Baritone Bully: should parse card text", () => {
    const text = "Singer 5 (This character counts as cost 5 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const singer: KeywordAbilityDefinition = {
      keyword: "Singer",
      type: "keyword",
      value: 5,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(singer),
    );
  });

  it.skip("Grand Duke - Advisor to the King: should parse card text", () => {
    const text =
      "YES, YOUR MAJESTY Your Prince, Princess, King, and Queen characters get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const yesYourMajesty = {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "YOUR_PRINCE_PRINCESS_KING_QUEEN_CHARACTERS",
        type: "modify-stat",
      },
      name: "YES, YOUR MAJESTY",
      type: "static",
    };
    expect(result.abilities[0].name).toBe("YES, YOUR MAJESTY");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(yesYourMajesty),
    );
  });

  it.skip("Grumpy - Bad-Tempered: should parse card text", () => {
    const text =
      "THERE'S TROUBLE A-BREWIN' Your other Seven Dwarfs characters get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const theresTroubleABrewin = {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "YOUR_OTHER_SEVEN_DWARFS_CHARACTERS",
        type: "modify-stat",
      },
      name: "THERE'S TROUBLE A-BREWIN'",
      type: "static",
    };
    expect(result.abilities[0].name).toBe("THERE'S TROUBLE A-BREWIN'");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theresTroubleABrewin),
    );
  });

  it.skip("Happy - Good-Natured: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("King Louie - Jungle VIP: should parse card text", () => {
    const text =
      "LAY IT ON THE LINE Whenever another character is banished, you may remove up to 2 damage from this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const layItOnTheLine = {
      effect: {
        effect: {
          type: "remove-damage",
          amount: 2,
          target: "SELF",
        },
        type: "optional",
      },
      name: "LAY IT ON THE LINE",
      trigger: {
        event: "banish",
        on: "OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("LAY IT ON THE LINE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(layItOnTheLine),
    );
  });

  it.skip("Mickey Mouse - Friendly Face: should parse card text", () => {
    const text =
      "GLAD YOU'RE HERE! Whenever this character quests, you pay 3 {I} less for the next character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const gladYoureHere = {
      effect: {
        reduction: { ink: 3 },
        target: "NEXT_CHARACTER",
        type: "cost-reduction",
      },
      name: "GLAD YOU'RE HERE!",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("GLAD YOU'RE HERE!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(gladYoureHere),
    );
  });

  it.skip("Mufasa - Betrayed Leader: should parse card text", () => {
    const text =
      "THE SUN WILL SET When this character is banished, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const theSunWillSet = {
      effect: {
        effect: {
          type: "reveal-and-conditional",
          reveal: {
            source: "deck",
            count: 1,
          },
          condition: {
            type: "card-type",
            cardType: "character",
          },
          ifTrue: {
            type: "play-for-free",
            enterExerted: true,
          },
          ifFalse: {
            type: "put-on-deck",
            position: "top",
          },
        },
        type: "optional",
      },
      name: "THE SUN WILL SET",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("THE SUN WILL SET");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theSunWillSet),
    );
  });

  it.skip("Mulan - Reflecting: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Mulan.)\nHONOR TO THE ANCESTORS Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 2 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: HONOR TO THE ANCESTORS
    const honorToTheAncestors = {
      effect: {
        effect: {
          type: "reveal-and-conditional",
          reveal: {
            source: "deck",
            count: 1,
          },
          condition: {
            type: "card-type",
            cardType: "song",
          },
          ifTrue: {
            type: "play-for-free",
          },
          ifFalse: {
            type: "put-on-deck",
            position: "top",
          },
        },
        type: "optional",
      },
      name: "HONOR TO THE ANCESTORS",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].name).toBe("HONOR TO THE ANCESTORS");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(honorToTheAncestors),
    );
  });

  it.skip("Hold Still: should parse card text", () => {
    const text = "Remove up to 4 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const holdStill = {
      effect: {
        amount: 4,
        target: "CHOSEN_CHARACTER",
        type: "remove-damage",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(holdStill),
    );
  });

  it.skip("Last Stand: should parse card text", () => {
    const text = "Banish chosen character who was challenged this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const lastStand = {
      effect: {
        target: "CHOSEN_CHALLENGED_CHARACTER",
        type: "banish",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lastStand),
    );
  });

  it.skip("Dragon Gem: should parse card text", () => {
    const text =
      "BRING BACK TO LIFE {E}, 3 {I} — Return a character card with Support from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const bringBackToLife = {
      cost: {
        exert: true,
        ink: 3,
      },
      effect: {
        target: "SUPPORT_CHARACTER_FROM_DISCARD",
        type: "return-to-hand",
      },
      name: "BRING BACK TO LIFE",
      type: "activated",
    };
    expect(result.abilities[0].name).toBe("BRING BACK TO LIFE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bringBackToLife),
    );
  });

  it.skip("Arthur - Wizard's Apprentice: should parse card text", () => {
    const text =
      "STUDENT Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const student = {
      effect: {
        effect: {
          type: "cost-effect",
          cost: {
            type: "return-to-hand",
            target: "YOUR_OTHER_CHARACTER",
          },
          effect: {
            type: "gain-lore",
            amount: 2,
            target: "CONTROLLER",
          },
        },
        type: "optional",
      },
      name: "STUDENT",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("STUDENT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(student),
    );
  });

  it.skip("Blue Fairy - Rewarding Good Deeds: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nETHEREAL GLOW Whenever you play a Floodborn character, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: ETHEREAL GLOW
    const etherealGlow = {
      effect: {
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      name: "ETHEREAL GLOW",
      trigger: {
        event: "play",
        on: "FLOODBORN_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].name).toBe("ETHEREAL GLOW");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(etherealGlow),
    );
  });

  it.skip("Dr. Facilier - Savvy Opportunist: should parse card text", () => {
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

  it.skip("Fairy Godmother - Mystic Armorer: should parse card text", () => {
    const text = `Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Fairy Godmother.)
FORGET THE COACH, HERE'S A SWORD Whenever this character quests, your characters gain Challenger +3 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +3 {S} while challenging.)`;
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 2 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: FORGET THE COACH, HERE'S A SWORD
    const forgetTheCoach = {
      effect: {
        effects: [
          {
            type: "gain-keyword",
            keyword: "Challenger",
            value: 3,
            target: "YOUR_CHARACTERS",
            duration: "this-turn",
          },
          {
            type: "gain-ability",
            ability: {
              type: "triggered",
              trigger: {
                event: "banish-in-challenge",
              },
              effect: {
                type: "return-to-hand",
                target: "SELF",
              },
            },
            target: "YOUR_CHARACTERS",
            duration: "this-turn",
          },
        ],
        type: "compound",
      },
      name: "FORGET THE COACH, HERE'S A SWORD",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].name).toBe("FORGET THE COACH, HERE'S A SWORD");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(forgetTheCoach),
    );
  });

  it.skip("Fairy Godmother - Pure Heart: should parse card text", () => {
    const text =
      "JUST LEAVE IT TO ME Whenever you play a character named Cinderella, you may exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const justLeaveItToMe = {
      effect: {
        effect: {
          type: "exert",
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      name: "JUST LEAVE IT TO ME",
      trigger: {
        event: "play",
        on: "CINDERELLA_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("JUST LEAVE IT TO ME");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(justLeaveItToMe),
    );
  });

  it.skip("HeiHei - Persistent Presence: should parse card text", () => {
    const text =
      "HE'S BACK! When this character is banished in a challenge, return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hesBack = {
      effect: {
        target: "SELF",
        type: "return-to-hand",
      },
      name: "HE'S BACK!",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("HE'S BACK!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hesBack),
    );
  });

  it.skip("Jiminy Cricket - Pinocchio's Conscience: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nTHAT STILL, SMALL VOICE When you play this character, if you have a character named Pinocchio in play, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: THAT STILL, SMALL VOICE
    const thatStillSmallVoice = {
      effect: {
        condition: {
          type: "have-character",
          name: "Pinocchio",
        },
        effect: {
          type: "optional",
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        },
        type: "conditional",
      },
      name: "THAT STILL, SMALL VOICE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].name).toBe("THAT STILL, SMALL VOICE");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(thatStillSmallVoice),
    );
  });

  it.skip("Madam Mim - Fox: should parse card text", () => {
    const text =
      "CHASING THE RABBIT When you play this character, banish her or return another chosen character of yours to your hand.\nRush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: CHASING THE RABBIT
    const chasingTheRabbit = {
      effect: {
        choices: [
          {
            type: "banish",
            target: "SELF",
          },
          {
            type: "return-to-hand",
            target: "YOUR_OTHER_CHARACTER",
          },
        ],
        type: "choice",
      },
      name: "CHASING THE RABBIT",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("CHASING THE RABBIT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(chasingTheRabbit),
    );

    // Second ability: Rush
    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Madam Mim - Purple Dragon: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nI WIN, I WIN! When you play this character, banish her or return another 2 chosen characters of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: I WIN, I WIN!
    const iWinIWin = {
      effect: {
        choices: [
          {
            type: "banish",
            target: "SELF",
          },
          {
            type: "return-to-hand",
            target: "YOUR_OTHER_2_CHARACTERS",
          },
        ],
        type: "choice",
      },
      name: "I WIN, I WIN!",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].name).toBe("I WIN, I WIN!");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(iWinIWin),
    );
  });

  it.skip("Madam Mim - Rival of Merlin: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Madam Mim.)\nGRUESOME AND GRIM {E} — Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 3 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: GRUESOME AND GRIM
    const gruesomeAndGrim = {
      cost: {
        exert: true,
      },
      effect: {
        effects: [
          {
            type: "play-for-free",
            filter: {
              cardType: "character",
              maxCost: 4,
            },
          },
          {
            type: "gain-keyword",
            keyword: "Rush",
            target: "PLAYED_CARD",
          },
          {
            type: "delayed",
            timing: "end-of-turn",
            effect: {
              type: "banish",
              target: "PLAYED_CARD",
            },
          },
        ],
        type: "sequence",
      },
      name: "GRUESOME AND GRIM",
      type: "activated",
    };
    expect(result.abilities[1].name).toBe("GRUESOME AND GRIM");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(gruesomeAndGrim),
    );
  });

  it.skip("Madam Mim - Snake: should parse card text", () => {
    const text =
      "JUST YOU WAIT When you play this character, banish her or return another chosen character of yours to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const justYouWait = {
      effect: {
        choices: [
          {
            type: "banish",
            target: "SELF",
          },
          {
            type: "return-to-hand",
            target: "YOUR_OTHER_CHARACTER",
          },
        ],
        type: "choice",
      },
      name: "JUST YOU WAIT",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("JUST YOU WAIT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(justYouWait),
    );
  });

  it.skip("Merlin - Crab: should parse card text", () => {
    const text =
      "READY OR NOT! When you play this character and when he leaves play, chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const readyOrNot = {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 3,
      },
      name: "READY OR NOT!",
      trigger: {
        events: ["play", "leave-play"],
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("READY OR NOT!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(readyOrNot),
    );
  });

  it.skip("Merlin - Goat: should parse card text", () => {
    const text =
      "HERE I COME! When you play this character and when he leaves play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hereICome = {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
      name: "HERE I COME!",
      trigger: {
        events: ["play", "leave-play"],
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("HERE I COME!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hereICome),
    );
  });

  it.skip("Merlin - Rabbit: should parse card text", () => {
    const text =
      "HOPPITY HIP! When you play this character and when he leaves play, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hoppityHip = {
      effect: {
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      name: "HOPPITY HIP!",
      trigger: {
        events: ["play", "leave-play"],
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("HOPPITY HIP!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hoppityHip),
    );
  });

  it.skip("Merlin - Shapeshifter: should parse card text", () => {
    const text =
      "BATTLE OF WITS Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const battleOfWits = {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      name: "BATTLE OF WITS",
      trigger: {
        event: "return-to-hand",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("BATTLE OF WITS");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(battleOfWits),
    );
  });

  it.skip("Merlin - Squirrel: should parse card text", () => {
    const text =
      "LOOK BEFORE YOU LEAP When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const lookBeforeYouLeap = {
      effect: {
        effects: [
          {
            type: "look",
            source: "deck",
            position: "top",
            count: 1,
          },
          {
            type: "put-on-deck",
            position: "choice",
            options: ["top", "bottom"],
          },
        ],
        type: "sequence",
      },
      name: "LOOK BEFORE YOU LEAP",
      trigger: {
        events: ["play", "leave-play"],
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("LOOK BEFORE YOU LEAP");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lookBeforeYouLeap),
    );
  });

  it.skip("Gruesome and Grim: should parse card text", () => {
    const text =
      "Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const gruesomeAndGrim = {
      effect: {
        effects: [
          {
            type: "play-for-free",
            filter: {
              cardType: "character",
              maxCost: 4,
            },
          },
          {
            type: "gain-keyword",
            keyword: "Rush",
            target: "PLAYED_CARD",
          },
          {
            type: "delayed",
            timing: "end-of-turn",
            effect: {
              type: "banish",
              target: "PLAYED_CARD",
            },
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(gruesomeAndGrim),
    );
  });

  it.skip("Legend of the Sword in the Stone: should parse card text", () => {
    const text =
      "Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const legendOfTheSword = {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 3,
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(legendOfTheSword),
    );
  });

  it.skip("Binding Contract: should parse card text", () => {
    const text =
      "FOR ALL ETERNITY {E}, {E} one of your characters — Exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const forAllEternity = {
      cost: {
        exert: true,
        exertCharacter: true,
      },
      effect: {
        target: "CHOSEN_CHARACTER",
        type: "exert",
      },
      name: "FOR ALL ETERNITY",
      type: "activated",
    };
    expect(result.abilities[0].name).toBe("FOR ALL ETERNITY");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(forAllEternity),
    );
  });

  it.skip("Croquet Mallet: should parse card text", () => {
    const text =
      "HURTLING HEDGEHOG Banish this item — Chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hurtlingHedgehog = {
      cost: {
        banishSelf: true,
      },
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      name: "HURTLING HEDGEHOG",
      type: "activated",
    };
    expect(result.abilities[0].name).toBe("HURTLING HEDGEHOG");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hurtlingHedgehog),
    );
  });

  it.skip("Beast - Relentless: should parse card text", () => {
    const text =
      "SECOND WIND Whenever an opposing character is damaged, you may ready this character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const secondWind = {
      effect: {
        effect: {
          type: "ready",
          target: "SELF",
        },
        type: "optional",
      },
      name: "SECOND WIND",
      trigger: {
        event: "damage",
        on: "OPPOSING_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("SECOND WIND");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(secondWind),
    );
  });

  it.skip("Belle - Bookworm: should parse card text", () => {
    const text =
      "USE YOUR IMAGINATION While an opponent has no cards in their hand, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const useYourImagination = {
      condition: {
        controller: "opponent",
        count: 0,
        type: "hand-count",
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      name: "USE YOUR IMAGINATION",
      type: "static",
    };
    expect(result.abilities[0].name).toBe("USE YOUR IMAGINATION");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(useYourImagination),
    );
  });

  it.skip("Belle - Hidden Archer: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Belle.)\nTHORNY ARROWS Whenever this character is challenged, the challenging character's player discards all cards in their hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 3 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: THORNY ARROWS
    const thornyArrows = {
      effect: {
        amount: "all",
        target: "CHALLENGER_OWNER",
        type: "discard",
      },
      name: "THORNY ARROWS",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].name).toBe("THORNY ARROWS");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(thornyArrows),
    );
  });

  it.skip("Bucky - Squirrel Squeak Tutor: should parse card text", () => {
    const text =
      "SQUEAK Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const squeak = {
      effect: {
        condition: {
          type: "used-shift",
        },
        effect: {
          type: "discard",
          amount: 1,
          target: "EACH_OPPONENT",
          chosenBy: "TARGET",
        },
        type: "conditional",
      },
      name: "SQUEAK",
      trigger: {
        event: "play",
        on: "FLOODBORN_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("SQUEAK");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(squeak),
    );
  });

  it.skip("Cheshire Cat - From the Shadows: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Cheshire Cat.)\nEvasive (Only characters with Evasive can challenge this character.)\nWICKED SMILE {E} — Banish chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 5
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 5 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Third ability: WICKED SMILE
    const wickedSmile = {
      cost: {
        exert: true,
      },
      effect: {
        target: "CHOSEN_DAMAGED_CHARACTER",
        type: "banish",
      },
      name: "WICKED SMILE",
      type: "activated",
    };
    expect(result.abilities[2].name).toBe("WICKED SMILE");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(wickedSmile),
    );
  });

  it.skip("Dr. Facilier - Fortune Teller: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nYOU'RE IN MY WORLD Whenever this character quests, chosen opposing character can't quest during their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: YOU'RE IN MY WORLD
    const youreInMyWorld = {
      effect: {
        duration: "next-turn",
        restriction: "cant-quest",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "restriction",
      },
      name: "YOU'RE IN MY WORLD",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].name).toBe("YOU'RE IN MY WORLD");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(youreInMyWorld),
    );
  });

  it.skip("Flynn Rider - His Own Biggest Fan: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Flynn Rider.)\nEvasive (Only characters with Evasive can challenge this character.)\nONE LAST, BIG SCORE This character gets -1 {L} for each card in your opponents' hands.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 2
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 2 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Third ability: ONE LAST, BIG SCORE
    const oneLastBigScore = {
      effect: {
        modifier: {
          type: "for-each",
          counter: {
            type: "cards-in-hand",
            controller: "opponent",
          },
          modifier: -1,
        },
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      name: "ONE LAST, BIG SCORE",
      type: "static",
    };
    expect(result.abilities[2].name).toBe("ONE LAST, BIG SCORE");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(oneLastBigScore),
    );
  });

  it.skip("Gaston - Scheming Suitor: should parse card text", () => {
    const text =
      "YES, I'M INTIMIDATING While one or more opponents have no cards in their hands, this character gets +3 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const yesImIntimidating = {
      condition: {
        controller: "opponent",
        count: 0,
        type: "hand-count",
      },
      effect: {
        modifier: 3,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      name: "YES, I'M INTIMIDATING",
      type: "static",
    };
    expect(result.abilities[0].name).toBe("YES, I'M INTIMIDATING");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(yesImIntimidating),
    );
  });

  it.skip("Lucifer - Cunning Cat: should parse card text", () => {
    const text =
      "MOUSE CATCHER When you play this character, each opponent chooses and discards either 2 cards or 1 action card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const mouseCatcher = {
      effect: {
        effect: {
          type: "choice",
          chosenBy: "TARGET",
          choices: [
            {
              type: "discard",
              amount: 2,
            },
            {
              type: "discard",
              amount: 1,
              filter: {
                cardType: "action",
              },
            },
          ],
        },
        type: "for-each-opponent",
      },
      name: "MOUSE CATCHER",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("MOUSE CATCHER");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(mouseCatcher),
    );
  });

  it.skip("Bibbidi Bobbidi Boo: should parse card text", () => {
    const text =
      "Return chosen character of yours to your hand to play another character with the same cost or less for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const bibbidiBobbidiBoo = {
      effect: {
        cost: {
          type: "return-to-hand",
          target: "YOUR_CHOSEN_CHARACTER",
        },
        effect: {
          type: "play-for-free",
          filter: {
            cardType: "character",
            maxCost: "RETURNED_CARD_COST",
          },
        },
        type: "cost-effect",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bibbidiBobbidiBoo),
    );
  });

  it.skip("Bounce: should parse card text", () => {
    const text =
      "Return chosen character of yours to your hand to return another chosen character to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const bounce = {
      effect: {
        cost: {
          type: "return-to-hand",
          target: "YOUR_CHOSEN_CHARACTER",
        },
        effect: {
          type: "return-to-hand",
          target: "CHOSEN_OTHER_CHARACTER",
        },
        type: "cost-effect",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bounce),
    );
  });

  it.skip("Hypnotize: should parse card text", () => {
    const text = "Each opponent chooses and discards a card. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const hypnotize = {
      effect: {
        effects: [
          {
            type: "discard",
            amount: 1,
            target: "EACH_OPPONENT",
            chosenBy: "TARGET",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(hypnotize),
    );
  });

  it.skip("Donald Duck - Not Again!: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nPHOOEY! This character gets +1 {L} for each 1 damage on him.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Second ability: PHOOEY!
    const phooey = {
      effect: {
        modifier: {
          type: "for-each",
          counter: "damage-on-self",
          modifier: 1,
        },
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      name: "PHOOEY!",
      type: "static",
    };
    expect(result.abilities[1].name).toBe("PHOOEY!");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(phooey),
    );
  });

  it.skip("Felicia - Always Hungry: should parse card text", () => {
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

  it.skip("Fidget - Ratigan's Henchman: should parse card text", () => {
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

  it.skip("Honest John - Not That Honest: should parse card text", () => {
    const text =
      "EASY STREET Whenever you play a Floodborn character, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const easyStreet = {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      name: "EASY STREET",
      trigger: {
        event: "play",
        on: "FLOODBORN_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("EASY STREET");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(easyStreet),
    );
  });

  it.skip("Lady Tremaine - Imperious Queen: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Lady Tremaine.)\nPOWER TO RULE AT LAST When you play this character, each opponent chooses and banishes one of their characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 4 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: POWER TO RULE AT LAST
    const powerToRuleAtLast = {
      effect: {
        effect: {
          type: "banish",
          target: "THEIR_CHOSEN_CHARACTER",
        },
        type: "for-each-opponent",
      },
      name: "POWER TO RULE AT LAST",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].name).toBe("POWER TO RULE AT LAST");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(powerToRuleAtLast),
    );
  });

  it.skip("Lady Tremaine - Overbearing Matriarch: should parse card text", () => {
    const text =
      "NOT FOR YOU When you play this character, each opponent with more lore than you loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const notForYou = {
      effect: {
        condition: {
          type: "lore-comparison",
          comparison: "more-than",
          compareTo: "you",
        },
        effect: {
          type: "lose-lore",
          amount: 1,
        },
        type: "for-each-opponent",
      },
      name: "NOT FOR YOU",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("NOT FOR YOU");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(notForYou),
    );
  });

  it.skip("Minnie Mouse - Stylish Surfer: should parse card text", () => {
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

  it.skip("Minnie Mouse - Wide-Eyed Diver: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Minnie Mouse.)\nEvasive (Only characters with Evasive can challenge this character.)\nUNDERSEA ADVENTURE Whenever you play a second action in a turn, this character gets +2 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 2
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 2 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Evasive
    const evasive = Abilities.Keyword("Evasive");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(evasive),
    );

    // Third ability: UNDERSEA ADVENTURE
    const underseaAdventure = {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      name: "UNDERSEA ADVENTURE",
      trigger: {
        condition: {
          type: "second-in-turn",
        },
        event: "play",
        on: "YOUR_ACTIONS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[2].name).toBe("UNDERSEA ADVENTURE");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(underseaAdventure),
    );
  });

  it.skip("Mother Gothel - Withered and Wicked: should parse card text", () => {
    const text =
      "WHAT HAVE YOU DONE?! This character enters play with 3 damage.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const whatHaveYouDone = {
      effect: {
        damage: 3,
        type: "enters-play-with",
      },
      name: "WHAT HAVE YOU DONE?!",
      type: "static",
    };
    expect(result.abilities[0].name).toBe("WHAT HAVE YOU DONE?!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatHaveYouDone),
    );
  });

  it.skip("Mulan - Soldier in Training: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const rush = Abilities.Keyword("Rush");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(rush));
  });

  it.skip("Go the Distance: should parse card text", () => {
    const text =
      "Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const goTheDistance = {
      effect: {
        effects: [
          {
            type: "ready",
            target: "YOUR_CHOSEN_DAMAGED_CHARACTER",
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(goTheDistance),
    );
  });

  it.skip("Basil - Great Mouse Detective: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Basil.)\nTHERE'S ALWAYS A CHANCE If you used Shift to play this character, you may draw 2 cards when he enters play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 5
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 5 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: THERE'S ALWAYS A CHANCE
    const theresAlwaysAChance = {
      condition: {
        type: "used-shift",
      },
      effect: {
        effect: {
          type: "draw",
          amount: 2,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      name: "THERE'S ALWAYS A CHANCE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].name).toBe("THERE'S ALWAYS A CHANCE");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(theresAlwaysAChance),
    );
  });

  it.skip("Basil - Of Baker Street: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );
  });

  it.skip("Cogsworth - Grandfather Clock: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Cogsworth.)\nWard (Opponents can't choose this character except to challenge.)\nUNWIND Your other characters gain Resist +1 (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 3 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Ward
    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(ward));

    // Third ability: UNWIND
    const unwind = {
      effect: {
        keyword: "Resist",
        target: "YOUR_OTHER_CHARACTERS",
        type: "grant-keyword",
        value: 1,
      },
      name: "UNWIND",
      type: "static",
    };
    expect(result.abilities[2].name).toBe("UNWIND");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(unwind),
    );
  });

  it.skip("Cogsworth - Talking Clock: should parse card text", () => {
    const text = `WAIT A MINUTE Your characters with Reckless gain "{E} — Gain 1 lore."`;
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const waitAMinute = {
      effect: {
        ability: {
          type: "activated",
          cost: {
            exert: true,
          },
          effect: {
            type: "gain-lore",
            amount: 1,
            target: "CONTROLLER",
          },
        },
        target: "YOUR_RECKLESS_CHARACTERS",
        type: "grant-ability",
      },
      name: "WAIT A MINUTE",
      type: "static",
    };
    expect(result.abilities[0].name).toBe("WAIT A MINUTE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(waitAMinute),
    );
  });

  it.skip("Cruella De Vil - Perfectly Wretched: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Cruella De Vil.)\nOH, NO YOU DON'T Whenever this character quests, chosen opposing character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 3 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: OH, NO YOU DON'T
    const ohNoYouDont = {
      effect: {
        duration: "this-turn",
        modifier: -2,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      name: "OH, NO YOU DON'T",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].name).toBe("OH, NO YOU DON'T");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(ohNoYouDont),
    );
  });

  it.skip("Duke Weaselton - Small-Time Crook: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const ward = Abilities.Keyword("Ward");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(ward));
  });

  it.skip("Gaston - Intellectual Powerhouse: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Gaston.)\nDEVELOPED BRAIN When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 4 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: DEVELOPED BRAIN
    const developedBrain = {
      effect: {
        effects: [
          {
            type: "look",
            source: "deck",
            position: "top",
            count: 3,
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
        type: "sequence",
      },
      name: "DEVELOPED BRAIN",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].name).toBe("DEVELOPED BRAIN");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(developedBrain),
    );
  });

  it.skip("Hiram Flaversham - Toymaker: should parse card text", () => {
    const text =
      "ARTIFICER When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const artificer = {
      effect: {
        effect: {
          type: "cost-effect",
          cost: {
            type: "banish",
            target: "YOUR_ITEM",
          },
          effect: {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
        },
        type: "optional",
      },
      name: "ARTIFICER",
      trigger: {
        events: [
          { event: "play", on: "SELF" },
          { event: "quest", on: "SELF" },
        ],
        timing: "when-or-whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("ARTIFICER");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(artificer),
    );
  });

  it.skip("James - Role Model: should parse card text", () => {
    const text =
      "NEVER, EVER LOSE SIGHT When this character is banished, you may put this card into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const neverEverLoseSight = {
      effect: {
        effect: {
          type: "put-into-inkwell",
          target: "SELF",
          exerted: true,
        },
        type: "optional",
      },
      name: "NEVER, EVER LOSE SIGHT",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("NEVER, EVER LOSE SIGHT");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(neverEverLoseSight),
    );
  });

  it.skip("Mrs. Judson - Housekeeper: should parse card text", () => {
    const text =
      "TIDY UP Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const tidyUp = {
      effect: {
        effect: {
          type: "put-into-inkwell",
          source: "deck",
          position: "top",
          exerted: true,
        },
        type: "optional",
      },
      name: "TIDY UP",
      trigger: {
        event: "play",
        on: "FLOODBORN_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("TIDY UP");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(tidyUp),
    );
  });

  it.skip("Falling Down the Rabbit Hole: should parse card text", () => {
    const text =
      "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const fallingDownTheRabbitHole = {
      effect: {
        effect: {
          type: "put-into-inkwell",
          target: "THEIR_CHOSEN_CHARACTER",
          chosenBy: "TARGET",
          exerted: true,
        },
        type: "for-each-player",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fallingDownTheRabbitHole),
    );
  });

  it.skip("Launch: should parse card text", () => {
    const text =
      "Banish chosen item of yours to deal 5 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const launch = {
      effect: {
        cost: {
          type: "banish",
          target: "YOUR_CHOSEN_ITEM",
        },
        effect: {
          type: "deal-damage",
          amount: 5,
          target: "CHOSEN_CHARACTER",
        },
        type: "cost-effect",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(launch),
    );
  });

  it.skip("Fang Crossbow: should parse card text", () => {
    const text =
      "CAREFUL AIM {E}, 2 {I} — Chosen character gets -2 {S} this turn.\nSTAY BACK! {E}, Banish this item — Banish chosen Dragon character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: CAREFUL AIM
    const carefulAim = {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        duration: "this-turn",
        modifier: -2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      name: "CAREFUL AIM",
      type: "activated",
    };
    expect(result.abilities[0].name).toBe("CAREFUL AIM");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(carefulAim),
    );

    // Second ability: STAY BACK!
    const stayBack = {
      cost: {
        banishSelf: true,
        exert: true,
      },
      effect: {
        target: "CHOSEN_DRAGON_CHARACTER",
        type: "banish",
      },
      name: "STAY BACK!",
      type: "activated",
    };
    expect(result.abilities[1].name).toBe("STAY BACK!");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(stayBack),
    );
  });

  it.skip("Gumbo Pot: should parse card text", () => {
    const text =
      "THE BEST I'VE EVER TASTED {E} — Remove 1 damage each from up to 2 chosen characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const theBestIveEverTasted = {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "UP_TO_2_CHOSEN_CHARACTERS",
        type: "remove-damage",
      },
      name: "THE BEST I'VE EVER TASTED",
      type: "activated",
    };
    expect(result.abilities[0].name).toBe("THE BEST I'VE EVER TASTED");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theBestIveEverTasted),
    );
  });

  it.skip("Maurice's Workshop: should parse card text", () => {
    const text =
      "LOOKING FOR THIS? Whenever you play another item, you may pay 1 {I} to draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const lookingForThis = {
      effect: {
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
        type: "optional",
      },
      name: "LOOKING FOR THIS?",
      trigger: {
        event: "play",
        on: "YOUR_OTHER_ITEMS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("LOOKING FOR THIS?");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lookingForThis),
    );
  });

  it.skip("Beast - Forbidding Recluse: should parse card text", () => {
    const text =
      "YOU'RE NOT WELCOME HERE When you play this character, you may deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const youreNotWelcomeHere = {
      effect: {
        effect: {
          type: "deal-damage",
          amount: 1,
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      name: "YOU'RE NOT WELCOME HERE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("YOU'RE NOT WELCOME HERE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youreNotWelcomeHere),
    );
  });

  it.skip("Beast - Selfless Protector: should parse card text", () => {
    const text =
      "SHIELD ANOTHER Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const shieldAnother = {
      effect: {
        condition: {
          type: "target",
          target: "YOUR_OTHER_CHARACTERS",
        },
        replacement: {
          type: "redirect-damage",
          target: "SELF",
          amount: "all",
        },
        replaces: "damage-to-character",
        type: "replacement",
      },
      name: "SHIELD ANOTHER",
      type: "static",
    };
    expect(result.abilities[0].name).toBe("SHIELD ANOTHER");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shieldAnother),
    );
  });

  it.skip("Beast - Tragic Hero: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Beast.)\nIT'S BETTER THIS WAY At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 3
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 3 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: IT'S BETTER THIS WAY
    const itsBetterThisWay = {
      effect: {
        condition: {
          type: "no-damage",
          target: "SELF",
        },
        ifFalse: {
          type: "modify-stat",
          stat: "strength",
          modifier: 4,
          target: "SELF",
          duration: "this-turn",
        },
        ifTrue: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "conditional",
      },
      name: "IT'S BETTER THIS WAY",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
    };
    expect(result.abilities[1].name).toBe("IT'S BETTER THIS WAY");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(itsBetterThisWay),
    );
  });

  it.skip("Chief Bogo - Respected Officer: should parse card text", () => {
    const text =
      "INSUBORDINATION! Whenever you play a Floodborn character, deal 1 damage to each opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const insubordination = {
      effect: {
        amount: 1,
        target: "EACH_OPPOSING_CHARACTER",
        type: "deal-damage",
      },
      name: "INSUBORDINATION!",
      trigger: {
        event: "play",
        on: "FLOODBORN_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("INSUBORDINATION!");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(insubordination),
    );
  });

  it.skip("Cinderella - Knight in Training: should parse card text", () => {
    const text =
      "HAVE COURAGE When you play this character, you may draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const haveCourage = {
      effect: {
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
        type: "optional",
      },
      name: "HAVE COURAGE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("HAVE COURAGE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(haveCourage),
    );
  });

  it.skip("Cinderella - Stouthearted: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Cinderella.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nTHE SINGING SWORD Whenever you play a song, this character may challenge ready characters this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // First ability: Shift 5
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 5 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Resist +2
    const resist: KeywordAbilityDefinition = {
      keyword: "Resist",
      type: "keyword",
      value: 2,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(resist),
    );

    // Third ability: THE SINGING SWORD
    const theSingingSword = {
      effect: {
        ability: {
          type: "can-challenge-ready",
        },
        duration: "this-turn",
        target: "SELF",
        type: "grant-ability",
      },
      name: "THE SINGING SWORD",
      trigger: {
        event: "play",
        on: "YOUR_SONGS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[2].name).toBe("THE SINGING SWORD");
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(theSingingSword),
    );
  });

  it.skip("Hercules - Divine Hero: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Hercules.)\nResist +2 (Damage dealt to this character is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 4
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 4 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: Resist +2
    const resist: KeywordAbilityDefinition = {
      keyword: "Resist",
      type: "keyword",
      value: 2,
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(resist),
    );
  });

  it.skip("Jafar - Dreadnought: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Jafar.)\nNOW WHERE WERE WE? During your turn, whenever this character banishes another character in a challenge, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 2
    const shift: KeywordAbilityDefinition = {
      cost: { ink: 2 },
      keyword: "Shift",
      type: "keyword",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: NOW WHERE WERE WE?
    const nowWhereWereWe = {
      condition: {
        type: "your-turn",
      },
      effect: {
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      name: "NOW WHERE WERE WE?",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].name).toBe("NOW WHERE WERE WE?");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(nowWhereWereWe),
    );
  });

  it.skip("Kronk - Junior Chipmunk: should parse card text", () => {
    const text =
      "Resist +1 (Damage dealt to this character is reduced by 1.)\nSCOUT LEADER During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Resist +1
    const resist: KeywordAbilityDefinition = {
      keyword: "Resist",
      type: "keyword",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(resist),
    );

    // Second ability: SCOUT LEADER
    const scoutLeader = {
      condition: {
        type: "your-turn",
      },
      effect: {
        effect: {
          type: "deal-damage",
          amount: 2,
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      name: "SCOUT LEADER",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].name).toBe("SCOUT LEADER");
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(scoutLeader),
    );
  });

  it.skip("Li Shang - Archery Instructor: should parse card text", () => {
    const text =
      "ARCHERY LESSON Whenever this character quests, your characters gain Evasive this turn. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const archeryLesson = {
      effect: {
        duration: "this-turn",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
        type: "grant-keyword",
      },
      name: "ARCHERY LESSON",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("ARCHERY LESSON");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(archeryLesson),
    );
  });

  it.skip("Magic Broom - Industrial Model: should parse card text", () => {
    const text =
      "MAKE IT SHINE When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const makeItShine = {
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        type: "grant-keyword",
        value: 1,
      },
      name: "MAKE IT SHINE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].name).toBe("MAKE IT SHINE");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(makeItShine),
    );
  });

  it.skip("Charge!: should parse card text", () => {
    const text =
      "Chosen character gains Challenger +2 and Resist +2 this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const charge = {
      effect: {
        duration: "this-turn",
        keywords: [
          { keyword: "Challenger", value: 2 },
          { keyword: "Resist", value: 2 },
        ],
        target: "CHOSEN_CHARACTER",
        type: "grant-keywords",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(charge),
    );
  });

  it.skip("Let the Storm Rage On: should parse card text", () => {
    const text = "Deal 2 damage to chosen character. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const letTheStormRageOn = {
      effect: {
        effects: [
          {
            type: "deal-damage",
            amount: 2,
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(letTheStormRageOn),
    );
  });

  it.skip("Last Cannon: should parse card text", () => {
    const text =
      "ARM YOURSELF 1 {I}, Banish this item — Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const armYourself = {
      cost: {
        banishSelf: true,
        ink: 1,
      },
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        type: "grant-keyword",
        value: 3,
      },
      name: "ARM YOURSELF",
      type: "activated",
    };
    expect(result.abilities[0].name).toBe("ARM YOURSELF");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(armYourself),
    );
  });

  it.skip("Mouse Armor: should parse card text", () => {
    const text =
      "PROTECTION {E} — Chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const protection = {
      cost: {
        exert: true,
      },
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        type: "grant-keyword",
        value: 1,
      },
      name: "PROTECTION",
      type: "activated",
    };
    expect(result.abilities[0].name).toBe("PROTECTION");
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(protection),
    );
  });
});
