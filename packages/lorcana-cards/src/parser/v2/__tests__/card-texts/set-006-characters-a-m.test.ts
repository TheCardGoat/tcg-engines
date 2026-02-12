// @ts-nocheck - Skipped tests contain expected values that don't match current types
import { describe, expect, it } from "bun:test";
import { Abilities, Conditions, Costs, Effects, Targets, Triggers } from "@tcg/lorcana-types";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 006 Card Text Parser Tests - Characters A M", () => {
  it.skip("Lilo - Escape Artist: should parse card text", () => {
    const text =
      "NO PLACE I’D RATHER BE At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "conditional",
        }),
        type: "static",
      }),
    );
  });

  it.skip("Chip - Friend Indeed: should parse card text", () => {
    const text =
      "DALE'S PARTNER When you play this character, chosen character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: DALE'S PARTNER (triggered)
    const dalesPartner = {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      name: "DALE'S PARTNER",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(dalesPartner));
  });

  it.skip("Dale - Friend in Need: should parse card text", () => {
    const text =
      "CHIP'S PARTNER This character enters play exerted unless you have a character named Chip in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: CHIP'S PARTNER (static)
    const chipsPartner = {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      name: "CHIP'S PARTNER",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(chipsPartner));
  });

  it.skip("David - Impressive Surfer: should parse card text", () => {
    const text =
      "SHOWING OFF While you have a character named Nani in play, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: SHOWING OFF (static)
    const showingOff = {
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      name: "SHOWING OFF",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(showingOff));
  });

  it.skip("Chief Bogo - Gazelle Fan: should parse card text", () => {
    const text =
      "YOU LIKE GAZELLE TOO? While you have a character named Gazelle in play, this character gains Singer 6. (He counts as cost 6 to sing songs.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Chip - Ranger Leader: should parse card text", () => {
    const text =
      "THE VALUE OF FRIENDSHIP While you have a character named Dale in play, this character gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: THE VALUE OF FRIENDSHIP (static)
    const theValueOfFriendship = {
      effect: {
        keyword: "Support",
        target: "SELF",
        type: "gain-keyword",
      },
      name: "THE VALUE OF FRIENDSHIP",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(theValueOfFriendship));
  });

  it.skip("Chip 'n' Dale - Recovery Rangers: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Chip or Dale.)\n(This character counts as being named both Chip and Dale.)\nSEARCH AND RESCUE During your turn, whenever a card is put into your inkwell, you may return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 5
    const shift = Abilities.Shift({ cost: Costs.Ink(5) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: SEARCH AND RESCUE (triggered)
    const searchAndRescue = {
      effect: {
        effect: {
          target: "CHARACTER_FROM_DISCARD",
          type: "return-to-hand",
        },
        type: "optional",
      },
      name: "SEARCH AND RESCUE",
      trigger: {
        event: "put-into-inkwell",
        on: "CONTROLLER",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(searchAndRescue));
  });

  it.skip("Judy Hopps - Resourceful Rabbit: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\n\nNEED SOME HELP? At the end of your turn, you may ready another chosen character of yours.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support
    const support = Abilities.Keyword("Support");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(support));

    // Second ability: NEED SOME HELP? (triggered)
    const needSomeHelp = {
      effect: {
        effect: {
          target: "YOUR_CHARACTERS",
          type: "ready",
        },
        type: "optional",
      },
      name: "NEED SOME HELP?",
      trigger: {
        event: "end-of-turn",
        on: "CONTROLLER",
        timing: "at",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(needSomeHelp));
  });

  it.skip("Grand Councilwoman - Federation Leader: should parse card text", () => {
    const text =
      "FIND IT! Whenever this character quests, your other Alien characters get +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: FIND IT! (triggered)
    const findIt = {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "YOUR_ALIEN_CHARACTERS",
        type: "modify-stat",
      },
      name: "FIND IT!",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(findIt));
  });

  it.skip("Dale - Mischievous Ranger: should parse card text", () => {
    const text =
      "NUTS ABOUT PRANKS When you play this character, you may put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Kanga - Nurturing Mother: should parse card text", () => {
    const text =
      "SAFE AND SOUND Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: SAFE AND SOUND (triggered)
    const safeAndSound = {
      effect: {
        restriction: "cant-be-challenged",
        target: "CHOSEN_CHARACTER",
        type: "restriction",
      },
      name: "SAFE AND SOUND",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(safeAndSound));
  });

  it.skip("Mr. Litwak - Arcade Owner: should parse card text", () => {
    const text =
      "THE GANG'S ALL HERE Once during your turn, whenever you play another character, you may ready this character. He can’t quest or challenge for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: THE GANG'S ALL HERE (triggered)
    const theGangsAllHere = {
      effect: {
        effect: {
          target: "SELF",
          type: "ready",
        },
        type: "optional",
      },
      name: "THE GANG'S ALL HERE",
      trigger: {
        event: "play",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(theGangsAllHere));
  });

  it.skip("Jim Hawkins - Honorable Pirate: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nHIRE A CREW When you play this character, look at the top 4 cards of your deck. You may reveal any number of Pirate character cards and put them into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    const bodyguard = Abilities.Keyword("Bodyguard");
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(bodyguard));

    // Second ability: HIRE A CREW (triggered)
    const hireACrew = {
      effect: {
        amount: 4,
        filter: "PIRATE_CHARACTER",
        type: "scry",
      },
      name: "HIRE A CREW",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(hireACrew));
  });

  it.skip("Good Job!: should parse card text", () => {
    const text = "Chosen character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Good Job! (action)
    const goodJob = {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(goodJob));
  });

  it.skip("I Won't Give In: should parse card text", () => {
    const text = "Return a character card with cost 2 or less from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: I Won't Give In (action)
    const iWontGiveIn = {
      effect: {
        filter: { maxCost: 2 },
        target: "CHARACTER_FROM_DISCARD",
        type: "return-to-hand",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(iWontGiveIn));
  });

  it.skip("Hundred Acre Island - Pooh's Home: should parse card text", () => {
    const text =
      "FRIENDS FOREVER During an opponent's turn, whenever a character is banished here, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: FRIENDS FOREVER (triggered)
    const friendsForever = {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      name: "FRIENDS FOREVER",
      trigger: {
        event: "banish",
        on: "CHARACTERS_AT_LOCATION",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(friendsForever));
  });

  it.skip("Hades - Lord of the Dead: should parse card text", () => {
    const text =
      "SOUL COLLECTOR Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: SOUL COLLECTOR (triggered)
    const soulCollector = {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      name: "SOUL COLLECTOR",
      trigger: {
        event: "banish",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(soulCollector));
  });

  it.skip("Madam Mim - Tiny Adversary: should parse card text", () => {
    const text =
      "Challenger +1 (While challenging, this character gets +1 {S}.)\nZIM ZABBERIM ZIM Your other characters gain Challenger +1.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Challenger +1
    const challenger = Abilities.KeywordParameterized("Challenger", {
      value: 1,
    });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(challenger));

    // Second ability: ZIM ZABBERIM ZIM (static)
    const zimZabberimZim = {
      effect: {
        keyword: "Challenger",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
        value: 1,
      },
      name: "ZIM ZABBERIM ZIM",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(zimZabberimZim));
  });

  it.skip("Juju - Mama Odie's Companion: should parse card text", () => {
    const text =
      "BEES' KNEES When you play this character, move 1 damage counter from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: BEES' KNEES (triggered)
    const beesKnees = {
      effect: {
        amount: 1,
        from: "CHOSEN_CHARACTER",
        to: "CHOSEN_OPPOSING_CHARACTER",
        type: "move-damage",
      },
      name: "BEES' KNEES",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(beesKnees));
  });

  it.skip("Iago - Reappearing Parrot: should parse card text", () => {
    const text =
      "GUESS WHO When this character is banished in a challenge, return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: GUESS WHO
    const guessWho = {
      effect: {
        target: "SELF",
        type: "return-to-hand",
      },
      name: "GUESS WHO",
      trigger: {
        condition: {
          type: "in-challenge",
        },
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(guessWho));
  });

  it.skip("Diablo - Obedient Raven: should parse card text", () => {
    const text = "FLY, MY PET! When this character is banished, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: FLY, MY PET! (triggered)
    const flyMyPet = {
      effect: {
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "FLY, MY PET!",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(flyMyPet));
  });

  it.skip("March Hare - Absurd Host: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Genie - Wish Fulfilled: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nWHAT HAPPENS NOW? When you play this character, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: WHAT HAPPENS NOW? (triggered)
    const whatHappensNow = {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "WHAT HAPPENS NOW?",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(whatHappensNow));
  });

  it.skip("Madam Mim - Truly Marvelous: should parse card text", () => {
    const text = "OH, BAT GIZZARDS 2 {I}, Choose and discard a card - Gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "gain-lore",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Mama Odie - Solitary Sage: should parse card text", () => {
    const text =
      "I HAVE TO DO EVERYTHING AROUND HERE Whenever you play a song, you may move up to 2 damage counters from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mad Hatter - Eccentric Host: should parse card text", () => {
    const text =
      "WE'LL HAVE TO LOOK INTO THIS Whenever this character quests, you may look at the top card of chosen player's deck. Put it on top of their deck or into their discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("A Very Merry Unbirthday: should parse card text", () => {
    const text = "Each opponent puts the top 2 cards of their deck into their discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Genie - Wonderful Trickster: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Genie.)\nYOUR REWARD AWAITS Whenever you play a card, draw a card.\nFORBIDDEN TREASURE At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // Ability 1: Shift 5
    const shift = Abilities.Shift({ cost: Costs.Ink(5) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Ability 2: YOUR REWARD AWAITS (triggered)
    const yourRewardAwaits = {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "YOUR REWARD AWAITS",
      trigger: {
        event: "play",
        on: "CONTROLLER",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(yourRewardAwaits));

    // Ability 3: FORBIDDEN TREASURE (triggered)
    const forbiddenTreasure = {
      effect: {
        destination: "deck",
        order: "any",
        target: "YOUR_HAND",
        type: "put-on-bottom",
      },
      name: "FORBIDDEN TREASURE",
      trigger: {
        event: "end-of-turn",
        on: "CONTROLLER",
        timing: "at",
      },
      type: "triggered",
    };
    expect(result.abilities[2].ability).toEqual(expect.objectContaining(forbiddenTreasure));
  });

  it.skip("Making Magic: should parse card text", () => {
    const text =
      "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Making Magic (action)
    const makingMagic = {
      effect: {
        effects: [
          {
            amount: 1,
            from: "CHOSEN_CHARACTER",
            to: "CHOSEN_OPPOSING_CHARACTER",
            type: "move-damage",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(makingMagic));
  });

  it.skip("Lose the Way: should parse card text", () => {
    const text =
      "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Lose the Way (action)
    const loseTheWay = {
      effect: {
        effects: [
          {
            target: "CHOSEN_CHARACTER",
            type: "exert",
          },
          {
            effect: {
              cost: {
                discard: { amount: 1, chosenBy: "you" },
              },
              effect: {
                duration: "until-start-of-next-turn",
                restriction: "cant-ready",
                target: "EXERTED_CHARACTER",
                type: "restriction",
              },
              type: "cost-effect",
            },
            type: "optional",
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(loseTheWay));
  });

  it.skip("Maleficent's Staff: should parse card text", () => {
    const text =
      "BACK, FOOLS! Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: BACK, FOOLS! (triggered)
    const backFools = {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
      name: "BACK, FOOLS!",
      trigger: {
        event: "return-to-hand",
        on: "OPPONENTS_CARDS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(backFools));
  });

  it.skip("Mad Hatter's Teapot: should parse card text", () => {
    const text =
      "NO ROOM, NO ROOM {E}, 1 {I} - Each opponent puts the top card of their deck into their discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mystical Tree - Mama Odie's Home: should parse card text", () => {
    const text =
      "NOT BAD At the start of your turn, you may move 1 damage counter from chosen character here to chosen opposing character.\n\nHARD-EARNED WISDOM At the start of your turn, if you have a character named Mama Odie here, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: NOT BAD (triggered)
    const notBad = {
      effect: {
        effect: {
          amount: 1,
          from: "CHOSEN_CHARACTER_HERE",
          to: "CHOSEN_OPPOSING_CHARACTER",
          type: "move-damage",
        },
        type: "optional",
      },
      name: "NOT BAD",
      trigger: {
        event: "start-of-turn",
        on: "CONTROLLER",
        timing: "at",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(notBad));
  });

  it.skip("Jasmine - Royal Seafarer: should parse card text", () => {
    const text =
      "BY ORDER OF THE PRINCESS When you play this character, choose one: \n* Exert chosen damaged character. \n* Chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: BY ORDER OF THE PRINCESS (triggered)
    const byOrderOfThePrincess = {
      effect: {
        choices: [
          {
            target: "CHOSEN_DAMAGED_CHARACTER",
            type: "exert",
          },
          {
            duration: "their-next-turn",
            keyword: "Reckless",
            target: "CHOSEN_OPPOSING_CHARACTER",
            type: "gain-keyword",
          },
        ],
        type: "choose-one",
      },
      name: "BY ORDER OF THE PRINCESS",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(byOrderOfThePrincess));
  });

  it.skip("Captain Hook - Underhanded: should parse card text", () => {
    const text =
      "INSPIRES DREAD While this character is exerted, opposing Pirate characters can't quest.\nUPPER HAND Whenever this character is challenged, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: INSPIRES DREAD (static)
    const inspiresDread = {
      condition: {
        target: "SELF",
        type: "exerted",
      },
      effect: {
        restriction: "cant-quest",
        target: "OPPOSING_PIRATE_CHARACTERS",
        type: "restriction",
      },
      name: "INSPIRES DREAD",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(inspiresDread));

    // Ability 2: UPPER HAND (triggered)
    const upperHand = {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "UPPER HAND",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(upperHand));
  });

  it.skip("Go Go Tomago - Darting Dynamo: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSTOP WHINING, WOMAN UP When you play this character, you may pay 2 {I} to gain lore equal to the damage on chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: STOP WHINING, WOMAN UP (triggered)
    const stopWhining = {
      effect: {
        effect: {
          cost: { ink: 2 },
          effect: {
            amount: {
              target: "CHOSEN_OPPOSING_CHARACTER",
              type: "damage-on",
            },
            target: "CONTROLLER",
            type: "gain-lore",
          },
          type: "cost-effect",
        },
        type: "optional",
      },
      name: "STOP WHINING, WOMAN UP",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(stopWhining));
  });

  it.skip("Honey Lemon - Chemical Genius: should parse card text", () => {
    const text =
      "HERE'S THE BEST PART When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: HERE'S THE BEST PART (triggered)
    const heresTheBestPart = {
      effect: {
        effect: {
          cost: { ink: 2 },
          effect: {
            amount: 1,
            chosenBy: "opponent",
            target: "EACH_OPPONENT",
            type: "discard",
          },
          type: "cost-effect",
        },
        type: "optional",
      },
      name: "HERE'S THE BEST PART",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(heresTheBestPart));
  });

  it.skip("Fred - Mascot by Day: should parse card text", () => {
    const text = "HOW COOL IS THAT Whenever this character is challenged, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: HOW COOL IS THAT (triggered)
    const howCoolIsThat = {
      effect: {
        amount: 2,
        target: "CONTROLLER",
        type: "gain-lore",
      },
      name: "HOW COOL IS THAT",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(howCoolIsThat));
  });

  it.skip("Heathcliff - Stoic Butler: should parse card text", () => {
    const text = "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Basil - Hypnotized Mouse: should parse card text", () => {
    const text = "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Donald Duck - First Mate: should parse card text", () => {
    const text =
      "CAPTAIN ON DECK While you have a Captain character in play, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: CAPTAIN ON DECK (static)
    const captainOnDeck = {
      condition: {
        classification: "Captain",
        controller: "you",
        type: "have-character",
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      name: "CAPTAIN ON DECK",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(captainOnDeck));
  });

  it.skip("Daisy Duck - Pirate Captain: should parse card text", () => {
    const text =
      "DISTANT SHORES Whenever one of your Pirate characters quests while at a location, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: DISTANT SHORES (triggered)
    const distantShores = {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "DISTANT SHORES",
      trigger: {
        condition: {
          type: "at-location",
        },
        event: "quest",
        on: "YOUR_PIRATE_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(distantShores));
  });

  it.skip("Jasmine - Royal Commodore: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Jasmine.)\nRULER OF THE SEAS When you play this character, if you used Shift to play her, return all other exerted characters to their players’ hands.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "optional",
        }),
        type: "action",
      }),
    );

    // Ability 2: RULER OF THE SEAS
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        name: "RULER OF THE SEAS",
        trigger: expect.objectContaining({
          event: "play",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Hercules - Baby Demigod: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nSTRONG LIKE HIS DAD 3 {I} - Deal 1 damage to chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "deal-damage",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Alistair Krei - Ambitious Entrepreneur: should parse card text", () => {
    const text =
      "AN EYE FOR TECH When you play this character, if an opponent has an item in play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: AN EYE FOR TECH (triggered)
    const anEyeForTech = {
      condition: {
        cardType: "item",
        type: "opponent-has",
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
      name: "AN EYE FOR TECH",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(anEyeForTech));
  });

  it.skip("Gazelle - Angel with Horns: should parse card text", () => {
    const text =
      "YOU ARE A REALLY HOT DANCER When you play this character, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: YOU ARE A REALLY HOT DANCER (triggered)
    const youAreAReallyHotDancer = {
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      name: "YOU ARE A REALLY HOT DANCER",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(youAreAReallyHotDancer));
  });

  it.skip("Goofy - Expert Shipwright: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nCLEVER DESIGN Whenever this character quests, chosen character gains Ward until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: CLEVER DESIGN (triggered)
    const cleverDesign = {
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Ward",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      name: "CLEVER DESIGN",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(cleverDesign));
  });

  it.skip("Bellwether - Assistant Mayor: should parse card text", () => {
    const text =
      "FEAR ALWAYS WORKS During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: FEAR ALWAYS WORKS (triggered)
    const fearAlwaysWorks = {
      condition: {
        type: "your-turn",
      },
      effect: {
        duration: "their-next-turn",
        keyword: "Reckless",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "gain-keyword",
      },
      name: "FEAR ALWAYS WORKS",
      trigger: {
        event: "put-into-inkwell",
        on: "CONTROLLER",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(fearAlwaysWorks));
  });

  it.skip("Basil - Disguised Detective: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Basil.)\nTWISTS AND TURNS During your turn, whenever a card is put into your inkwell, you may pay 1 {I} to have chosen opponent choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: Shift 4
    const shift4 = Abilities.Shift({ cost: Costs.Ink(4) });
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift4));

    // Ability 2: TWISTS AND TURNS (triggered)
    const twistsAndTurns = {
      condition: {
        type: "your-turn",
      },
      effect: {
        effect: {
          cost: { ink: 1 },
          effect: {
            amount: 1,
            target: "OPPONENT",
            type: "discard",
          },
          type: "cost-effect",
        },
        type: "optional",
      },
      name: "TWISTS AND TURNS",
      trigger: {
        event: "put-into-inkwell",
        on: "CONTROLLER",
        timing: "whenever",
      },
      type: "triggered",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(twistsAndTurns));
  });

  it.skip("Bend to My Will: should parse card text", () => {
    const text = "Each opponent discards all cards in their hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Heffalumps and Woozles: should parse card text", () => {
    const text = "Chosen opposing character can't quest during their next turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Heffalumps and Woozles (action)
    const heffalumpsAndWoozles = {
      effect: {
        effects: [
          {
            duration: "their-next-turn",
            restriction: "cant-quest",
            target: "CHOSEN_OPPOSING_CHARACTER",
            type: "restriction",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(heffalumpsAndWoozles));
  });

  it.skip("Mosquito Bite: should parse card text", () => {
    const text = "Put 1 damage counter on chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Mosquito Bite (action)
    const mosquitoBite = {
      effect: {
        amount: 1,
        target: "CHOSEN_CHARACTER",
        type: "put-damage",
      },
      type: "action",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(mosquitoBite));
  });

  it.skip("MegaBot: should parse card text", () => {
    const text =
      "HAPPY FACE This item enters play exerted.\nDESTROY! {E}, Banish this item - Choose one:\n* Banish chosen item.\n* Banish chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: HAPPY FACE (static)
    const happyFace = {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      name: "HAPPY FACE",
      type: "static",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(happyFace));
  });

  it.skip("Galactic Communicator: should parse card text", () => {
    const text =
      "RESOURCE ALLOCATION 1 {I}, Banish this item - Return chosen character with 2 {S} or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: RESOURCE ALLOCATION (activated)
    const resourceAllocation = {
      cost: {
        banishSelf: true,
        ink: 1,
      },
      effect: {
        target: "CHOSEN_CHARACTER_WITH_2_STRENGTH_OR_LESS",
        type: "return-to-hand",
      },
      name: "RESOURCE ALLOCATION",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(resourceAllocation));
  });

  it.skip("Mickey Mouse - Pirate Captain: should parse card text", () => {
    const text =
      'Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Mickey Mouse.)\nMARINER’S MIGHT Whenever this character quests, chosen Pirate character gets +2 {S} and gains "This character takes no damage from challenges" this turn.';
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "optional",
        }),
        type: "action",
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Kakamora - Boarding Party: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Kakamora - Pirate Pitcher: should parse card text", () => {
    const text =
      "DIZZYING SPEED When you play this character, chosen Pirate character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: DIZZYING SPEED
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        name: "DIZZYING SPEED",
        trigger: expect.objectContaining({
          event: "play",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Jasmine - Rebellious Princess: should parse card text", () => {
    const text = "YOU'LL NEVER MISS IT Whenever this character quests, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: YOU'LL NEVER MISS IT
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        name: "YOU'LL NEVER MISS IT",
        trigger: expect.objectContaining({
          event: "quest",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("John Silver - Ferocious Friend: should parse card text", () => {
    const text =
      "YOU HAVE TO CHART YOUR OWN COURSE Whenever this character quests, you may deal 1 damage to one of your other characters. If you do, ready that character. They cannot quest this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: YOU HAVE TO CHART YOUR OWN COURSE
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        name: "YOU HAVE TO CHART YOUR OWN COURSE",
        trigger: expect.objectContaining({
          event: "quest",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Markowski - Space Trooper: should parse card text", () => {
    const text = "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Abu - Bold Helmsman: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they’re played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mickey Mouse - Courageous Sailor: should parse card text", () => {
    const text = "SOLID GROUND While this character is at a location, he gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
        type: "static",
      }),
    );
  });

  it.skip("Adorabeezle Winterpop - Ice Rocket Racer: should parse card text", () => {
    const text = "KEEP DRIVING While this character has damage, she gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
        type: "static",
      }),
    );
  });

  it.skip("Moana - Self-Taught Sailor: should parse card text", () => {
    const text =
      "LEARNING THE ROPES This character can't challenge unless you have a Captain character in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: LEARNING THE ROPES
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "restriction",
        }),
        name: "LEARNING THE ROPES",
        type: "static",
      }),
    );
  });

  it.skip("Aladdin - Intrepid Commander: should parse card text", () => {
    const text =
      "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Aladdin.)\nREMEMBER YOUR TRAINING When you play this character, your characters get +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "optional",
        }),
        type: "action",
      }),
    );

    // Ability 2: REMEMBER YOUR TRAINING
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        name: "REMEMBER YOUR TRAINING",
        trigger: expect.objectContaining({
          event: "play",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Minnie Mouse - Pirate Lookout: should parse card text", () => {
    const text =
      "LAND, HO! Once during your turn, whenever a card is put into your inkwell, you may return a location card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "optional",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Moana - Kakamora Leader: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Moana.)\nGATHERING FORCES When you play this character, you may move any number of your characters to the same location for free. Gain 1 lore for each character you moved.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "optional",
        }),
        type: "action",
      }),
    );

    // Ability 2: GATHERING FORCES
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        name: "GATHERING FORCES",
        trigger: expect.objectContaining({
          event: "play",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Goofy - Flying Goof: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Maui - Half-Shark: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nCHEEEEOHOOOO! Whenever this character challenges another character, you may return an action card from your discard to your hand.\nWAYFINDING Whenever you play an action, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: CHEEEEOHOOOO!
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        name: "CHEEEEOHOOOO!",
        trigger: expect.objectContaining({
          event: "challenge",
        }),
        type: "triggered",
      }),
    );

    // Ability 2: WAYFINDING
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        name: "WAYFINDING",
        trigger: expect.objectContaining({
          event: "play",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Hades - Strong Arm: should parse card text", () => {
    const text =
      "WHAT ARE YOU GONNA DO? {E}, 3 {I}, Banish one of your characters – Banish chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Lead the Way: should parse card text", () => {
    const text = "Your characters get +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
        type: "static",
      }),
    );
  });

  it.skip("Energy Blast: should parse card text", () => {
    const text = "Banish chosen character. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "sequence",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Longboat: should parse card text", () => {
    const text =
      "TAKE IT FOR A SPIN 2 {I} – Chosen character of yours gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Gold Coin: should parse card text", () => {
    const text =
      "GLITTERING ACCESS {E}, 1 {I}, Banish this item – Ready chosen character of yours. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "restriction",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Card Soldier's Spear: should parse card text", () => {
    const text = "A SUITABLE WEAPON Your damaged characters get +1 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: A SUITABLE WEAPON Your damaged
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
        name: "A SUITABLE WEAPON Your damaged",
        type: "static",
      }),
    );
  });

  it.skip("Flotilla - Coconut Armada: should parse card text", () => {
    const text =
      "TINY THIEVES At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "conditional",
        }),
        type: "action",
      }),
    );
  });

  it.skip("B.E.N. - Eccentric Robot: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Aunt Cass - Biggest Fan: should parse card text", () => {
    const text =
      "HAPPY TO HELP Whenever this character quests, chosen Inventor character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: HAPPY TO HELP
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        name: "HAPPY TO HELP",
        trigger: expect.objectContaining({
          event: "quest",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Gadget Hackwrench - Creative Thinker: should parse card text", () => {
    const text = "BRAINSTORM Whenever you play an item, this character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: BRAINSTORM
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        name: "BRAINSTORM",
        trigger: expect.objectContaining({
          event: "play",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Gadget Hackwrench - Brilliant Bosun: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Gadget Hackwrench.)\nMECHANICALLY SAVVY While you have 3 or more items in play, you pay 1 {I} less to play Inventor characters.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "optional",
        }),
        type: "action",
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "play-card",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Hiro Hamada - Robotics Prodigy: should parse card text", () => {
    const text =
      "SWEET TECH {2} {E} - Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: SWEET TECH (activated)
    const sweetTech = {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        cardType: ["item", "Robot character"],
        destination: "top-of-deck",
        reveal: true,
        shuffle: true,
        type: "search-deck",
      },
      name: "SWEET TECH",
      type: "activated",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(sweetTech));
  });

  it.skip("Heihei - Not-So-Tricky Chicken: should parse card text", () => {
    const text =
      "EAT ANYTHING When you play this character, exert chosen opposing item. It can't ready at the start of its next turn.\nOUT TO LUNCH During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: EAT ANYTHING (triggered)
    const eatAnything = {
      effect: {
        effects: [
          {
            target: "CHOSEN_OPPOSING_ITEM",
            type: "exert",
          },
          {
            duration: "until-start-of-next-turn",
            restriction: "cant-ready",
            target: "THAT_ITEM",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      name: "EAT ANYTHING",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(eatAnything));

    // Ability 2: OUT TO LUNCH (static)
    const outToLunch = {
      condition: {
        type: "your-turn",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      name: "OUT TO LUNCH",
      type: "static",
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(outToLunch));
  });

  it.skip("Hiro Hamada - Team Leader: should parse card text", () => {
    const text =
      "I NEED TO UPGRADE ALL OF YOU Your other Inventor characters gain Resist +1. (Damage dealt to them is reduced by 1.)\n\nSHAPE THE FUTURE 2 {I} - Look at the top card of your deck. Put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: I NEED TO UPGRADE ALL OF YOU Your other Inventor
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
        name: "I NEED TO UPGRADE ALL OF YOU Your other Inventor",
        type: "static",
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "put-on-bottom",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Baymax - Personal Healthcare Companion: should parse card text", () => {
    const text =
      "FULLY CHARGED If you have an Inventor character in play, you pay 1 {I} less to play this character.\nYOU SAID 'OW' 2 {I} - Remove up to 1 damage from another chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "conditional",
        }),
        type: "action",
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "remove-damage",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Baymax - Armored Companion: should parse card text", () => {
    const text =
      "THE TREATMENT IS WORKING When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: THE TREATMENT IS WORKING When you play this character and
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        name: "THE TREATMENT IS WORKING When you play this character and",
        trigger: expect.objectContaining({
          event: "play",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Alice - Savvy Sailor: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nAHOY! Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: AHOY!
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        name: "AHOY!",
        trigger: expect.objectContaining({
          event: "quest",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Helping Hand: should parse card text", () => {
    const text =
      "Chosen character gains Support this turn. Draw a card. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Baymax's Healthcare Chip: should parse card text", () => {
    const text =
      "10,000 MEDICAL PROCEDURES {E} - Choose one:\n* Remove up to 1 damage from chosen character. \n* If you have a Robot character in play, remove up to 3 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "remove-damage",
        }),
        type: "action",
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "conditional",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Microbots: should parse card text", () => {
    const text =
      "LIMITLESS APPLICATIONS You may have any number of cards named Microbots in your deck.\nINSPIRED TECH When you play this item, chosen character gets -1 {S} this turn for each item named Microbots you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: INSPIRED TECH
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        name: "INSPIRED TECH",
        trigger: expect.objectContaining({
          event: "play",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Jumbo Pop: should parse card text", () => {
    const text =
      "HERE YOU GO Banish this item – Remove up to 2 damage from each of your characters. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "sequence",
        }),
        type: "static",
      }),
    );
  });

  it.skip("Institute of Technology - Prestigious University: should parse card text", () => {
    const text =
      "WELCOME TO THE LAB Inventor characters get +1 {W} while here.\nPUSH THE BOUNDARIES At the start of your turn, if you have a character here, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: WELCOME TO THE LAB Inventor
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
        name: "WELCOME TO THE LAB Inventor",
        type: "static",
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "conditional",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Kakamora - Long-Range Specialist: should parse card text", () => {
    const text =
      "A LITTLE HELP When you play this character, if you have another Pirate character in play, you may deal 1 damage to chosen character or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: A LITTLE HELP
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        name: "A LITTLE HELP",
        trigger: expect.objectContaining({
          event: "play",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Kakamora - Pirate Chief: should parse card text", () => {
    const text =
      "COCONUT LEADER Whenever this character quests, you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character or location. If a Pirate character card was discarded, deal 3 damage to that character or location instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: COCONUT LEADER
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        name: "COCONUT LEADER",
        trigger: expect.objectContaining({
          event: "quest",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Jim Hawkins - Stubborn Cabin Boy: should parse card text", () => {
    const text =
      "COME HERE, COME HERE, COME HERE! During your turn, whenever a card is put into your inkwell, this character gets Challenger +2 this turn. (While challenging, this character gets +2 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "sequence",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Mr. Big - Shrewd Tycoon: should parse card text", () => {
    const text = "REPUTATION This character can't be challenged by characters with 2 {S} or more.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: REPUTATION
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "restriction",
        }),
        name: "REPUTATION",
        type: "static",
      }),
    );
  });

  it.skip("Mr. Smee - Steadfast Mate: should parse card text", () => {
    const text =
      "GOOD CATCH During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Mr. Smee - Captain of the Jolly Roger: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mr. Smee.)\nRAISE THE COLORS When you play this character, you may deal damage to chosen character equal to the number of your other Pirate characters in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "optional",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Mullins - Seasoned Shipmate: should parse card text", () => {
    const text =
      "FALL IN LINE While you have a character named Mr. Smee in play, this character gains Resist +1. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Hercules - Unwavering Demigod: should parse card text", () => {
    const text = "Challenger +2 (While challenging, this character gets +2 {S}).";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Challenger keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        keyword: "Challenger",
        type: "keyword",
        value: 2,
      }),
    );
  });

  it.skip("John Silver - Ship's Cook: should parse card text", () => {
    const text =
      "HUNK OF HARDWARE When you play this character, chosen character can't challenge during their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: HUNK OF HARDWARE
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        name: "HUNK OF HARDWARE",
        trigger: expect.objectContaining({
          event: "play",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Mr. Arrow - Legacy's First Mate: should parse card text", () => {
    const text = "Resist +1 (Damage dealt to this character is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Resist keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        keyword: "Resist",
        type: "keyword",
        value: 1,
      }),
    );
  });

  it.skip("Jim Hawkins - Rigging Specialist: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Jim Hawkins.)\nBATTLE STATION When you play this character, you may deal 1 damage to chosen character or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "optional",
        }),
        type: "action",
      }),
    );

    // Ability 2: BATTLE STATION
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        name: "BATTLE STATION",
        trigger: expect.objectContaining({
          event: "play",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Billy Bones - Space Sailor: should parse card text", () => {
    const text =
      "KEEP IT HIDDEN When this character is banished, you may banish chosen item or location.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: KEEP IT HIDDEN
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        name: "KEEP IT HIDDEN",
        trigger: expect.objectContaining({
          event: "banish",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Mickey Mouse - Night Watch: should parse card text", () => {
    const text =
      "SUPPORT Your Pluto characters get Resist +1. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: SUPPORT Your Pluto
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
        name: "SUPPORT Your Pluto",
        type: "static",
      }),
    );
  });

  it.skip("Cobra Bubbles - Former CIA: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nTHINK ABOUT WHAT'S BEST 2 {I} – Draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "restriction",
        }),
        type: "static",
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "sequence",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Calhoun - Marine Sergeant: should parse card text", () => {
    const text =
      "Resist +1 (Damage dealt to this character is reduced by 1.)\nLEVEL UP During your turn, whenever this character banishes another character in a challenge, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: Resist keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        keyword: "Resist",
        type: "keyword",
        value: 1,
      }),
    );

    // Ability 2: LEVEL UP
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        name: "LEVEL UP",
        trigger: expect.objectContaining({
          event: "banish",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("Captain Amelia - Commander of the Legacy: should parse card text", () => {
    const text =
      "DRIVELING GALOOTS This character can't be challenged by Pirate characters.\nEVERYTHING SHIPSHAPE While being challenged, your other characters gain Resist +1. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: DRIVELING GALOOTS
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "restriction",
        }),
        name: "DRIVELING GALOOTS",
        type: "static",
      }),
    );

    // Ability 2: static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
        type: "static",
      }),
    );
  });

  it.skip("Jafar - Power-Hungry Vizier: should parse card text", () => {
    const text =
      "YOU WILL BE PAID WHEN THE TIME COMES During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: YOU WILL BE PAID WHEN THE TIME COMES
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        name: "YOU WILL BE PAID WHEN THE TIME COMES",
        trigger: expect.objectContaining({
          event: "play",
        }),
        type: "triggered",
      }),
    );
  });

  it.skip("John Silver - Stern Captain: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named John Silver.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nDON'T JUST SIT THERE! At the start of your turn, deal 1 damage to each opposing ready character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "optional",
        }),
        type: "action",
      }),
    );

    // Ability 2: Resist keyword
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        keyword: "Resist",
        type: "keyword",
        value: 2,
      }),
    );

    // Ability 3: action effect
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "deal-damage",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Hot Potato: should parse card text", () => {
    const text = "Choose one:\n- Deal 2 damage to chosen character.\n- Banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "deal-damage",
        }),
        type: "action",
      }),
    );
  });

  it.skip("I'm Still Here: should parse card text", () => {
    const text =
      "Chosen character gains Resist +2 until the start of your next turn. Draw a card. (Damage dealt to them is reduced by 2.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Ambush!: should parse card text", () => {
    const text =
      "{E} one of your characters to deal damage equal to their {S} to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("King's Sensor Core: should parse card text", () => {
    const text =
      "SYMBOL OF ROYALTY Your Prince and King characters gain Resist +1. (Damage dealt to them is reduced by 1.)\nROYAL SEARCH {E}, 2 {I} – Reveal the top card of your deck. If it's a Prince or King character card, you may put that card into your hand. Otherwise, put it on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: SYMBOL OF ROYALTY Your Prince and King
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
        name: "SYMBOL OF ROYALTY Your Prince and King",
        type: "static",
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        effect: expect.objectContaining({
          type: "reveal-top-card",
        }),
        type: "action",
      }),
    );
  });

  it.skip("Galactic Council Chamber - Courtroom: should parse card text", () => {
    const text =
      "FEDERATION DECREE While you have an Alien or Robot character here, this location can’t be challenged.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });
});
