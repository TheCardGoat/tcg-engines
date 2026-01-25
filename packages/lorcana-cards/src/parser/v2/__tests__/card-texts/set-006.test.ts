import { describe, expect, it } from "bun:test";
import type {
  ActionAbilityDefinition,
  ActivatedAbilityDefinition,
  KeywordAbilityDefinition,
  StaticAbilityDefinition,
  TriggeredAbilityDefinition,
} from "@tcg/lorcana-types";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 006 Card Text Parser Tests", () => {
  it.skip("Owl - Pirate Lookout: should parse card text", () => {
    const text =
      "WELL SPOTTED During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: WELL SPOTTED (triggered)
    const wellSpotted: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WELL SPOTTED",
      trigger: {
        event: "put-into-inkwell",
        timing: "whenever",
        on: "CONTROLLER",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "OPPOSING_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(wellSpotted),
    );
  });

  it.skip("Lilo - Escape Artist: should parse card text", () => {
    const text =
      "NO PLACE I’D RATHER BE At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Winnie the Pooh - Hunny Pirate: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\n\nWE'RE PIRATES, YOU SEE Whenever this character quests, you pay 1 {I} less for the next Pirate character you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );

    // Second ability: WE'RE PIRATES, YOU SEE (triggered)
    const werePiratesYouSee: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WE'RE PIRATES, YOU SEE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "cost-reduction",
        reduction: { ink: 1 },
        target: "NEXT_PIRATE_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(werePiratesYouSee),
    );
  });

  it.skip("Chip - Friend Indeed: should parse card text", () => {
    const text =
      "DALE'S PARTNER When you play this character, chosen character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: DALE'S PARTNER (triggered)
    const dalesPartner: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DALE'S PARTNER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(dalesPartner),
    );
  });

  it.skip("Dale - Friend in Need: should parse card text", () => {
    const text =
      "CHIP'S PARTNER This character enters play exerted unless you have a character named Chip in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: CHIP'S PARTNER (static)
    const chipsPartner: StaticAbilityDefinition = {
      type: "static",
      name: "CHIP'S PARTNER",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(chipsPartner),
    );
  });

  it.skip("David - Impressive Surfer: should parse card text", () => {
    const text =
      "SHOWING OFF While you have a character named Nani in play, this character gets +2 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: SHOWING OFF (static)
    const showingOff: StaticAbilityDefinition = {
      type: "static",
      name: "SHOWING OFF",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(showingOff),
    );
  });

  it.skip("Prince Naveen - Vigilant First Mate: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Prince Naveen.)\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
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

    // Second ability: Bodyguard
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(bodyguard),
    );
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
    const theValueOfFriendship: StaticAbilityDefinition = {
      type: "static",
      name: "THE VALUE OF FRIENDSHIP",
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theValueOfFriendship),
    );
  });

  it.skip("Chip 'n' Dale - Recovery Rangers: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Chip or Dale.)\n(This character counts as being named both Chip and Dale.)\nSEARCH AND RESCUE During your turn, whenever a card is put into your inkwell, you may return a character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Shift 5
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Second ability: SEARCH AND RESCUE (triggered)
    const searchAndRescue: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SEARCH AND RESCUE",
      trigger: {
        event: "put-into-inkwell",
        timing: "whenever",
        on: "CONTROLLER",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "CHARACTER_FROM_DISCARD",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(searchAndRescue),
    );
  });

  it.skip("Judy Hopps - Resourceful Rabbit: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\n\nNEED SOME HELP? At the end of your turn, you may ready another chosen character of yours.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Support
    const support: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Support",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(support),
    );

    // Second ability: NEED SOME HELP? (triggered)
    const needSomeHelp: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NEED SOME HELP?",
      trigger: {
        event: "end-of-turn",
        timing: "at",
        on: "CONTROLLER",
      },
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: "YOUR_CHARACTERS",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(needSomeHelp),
    );
  });

  it.skip("Tiana - Restaurant Owner: should parse card text", () => {
    const text =
      "SPECIAL RESERVATION Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: SPECIAL RESERVATION (triggered)
    const specialReservation: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SPECIAL RESERVATION",
      trigger: {
        event: "challenged",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -3,
        target: "CHALLENGING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(specialReservation),
    );
  });

  it.skip("Grand Councilwoman - Federation Leader: should parse card text", () => {
    const text =
      "FIND IT! Whenever this character quests, your other Alien characters get +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: FIND IT! (triggered)
    const findIt: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FIND IT!",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_ALIEN_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(findIt),
    );
  });

  it.skip("Dale - Mischievous Ranger: should parse card text", () => {
    const text =
      "NUTS ABOUT PRANKS When you play this character, you may put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Nani - Caring Sister: should parse card text", () => {
    const text =
      "Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)\nI AM SO SORRY 2 {I} - Chosen character gets -1 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Simba - Pride Protector: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Simba.)\nUNDERSTAND THE BALANCE At the end of your turn, if this character is exerted, you may ready your other characters.";
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

    // Second ability: UNDERSTAND THE BALANCE (triggered)
    const understandTheBalance: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "UNDERSTAND THE BALANCE",
      trigger: {
        event: "end-of-turn",
        timing: "at",
        on: "CONTROLLER",
      },
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: "YOUR_CHARACTERS",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(understandTheBalance),
    );
  });

  it.skip("Kanga - Nurturing Mother: should parse card text", () => {
    const text =
      "SAFE AND SOUND Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: SAFE AND SOUND (triggered)
    const safeAndSound: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SAFE AND SOUND",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(safeAndSound),
    );
  });

  it.skip("Rabbit - Indignant Pirate: should parse card text", () => {
    const text =
      "BE MORE CAREFUL When you play this character, you may remove up to 1 damage from chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: BE MORE CAREFUL (triggered)
    const beMoreCareful: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BE MORE CAREFUL",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 1,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(beMoreCareful),
    );
  });

  it.skip("Roo - Littlest Pirate: should parse card text", () => {
    const text =
      "I'M A PIRATE TOO! When you play this character, you may give chosen character -2 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: I'M A PIRATE TOO! (triggered)
    const imAPirateToo: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I'M A PIRATE TOO!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: -2,
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(imAPirateToo),
    );
  });

  it.skip("Mr. Litwak - Arcade Owner: should parse card text", () => {
    const text =
      "THE GANG'S ALL HERE Once during your turn, whenever you play another character, you may ready this character. He can’t quest or challenge for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: THE GANG'S ALL HERE (triggered)
    const theGangsAllHere: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THE GANG'S ALL HERE",
      trigger: {
        event: "play",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theGangsAllHere),
    );
  });

  it.skip("Jim Hawkins - Honorable Pirate: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nHIRE A CREW When you play this character, look at the top 4 cards of your deck. You may reveal any number of Pirate character cards and put them into your hand. Put the rest on the bottom of your deck in any order.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Bodyguard
    const bodyguard: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Bodyguard",
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bodyguard),
    );

    // Second ability: HIRE A CREW (triggered)
    const hireACrew: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HIRE A CREW",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "scry",
        amount: 4,
        filter: "PIRATE_CHARACTER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(hireACrew),
    );
  });

  it.skip("Stitch - Little Trickster: should parse card text", () => {
    const text = "NEED A HAND? 1 {I} - This character gets +1 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: NEED A HAND? (activated)
    const needAHand: ActivatedAbilityDefinition = {
      type: "activated",
      name: "NEED A HAND?",
      cost: {
        ink: 1,
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(needAHand),
    );
  });

  it.skip("Good Job!: should parse card text", () => {
    const text = "Chosen character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Good Job! (action)
    const goodJob: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(goodJob),
    );
  });

  it.skip("I Won't Give In: should parse card text", () => {
    const text =
      "Return a character card with cost 2 or less from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: I Won't Give In (action)
    const iWontGiveIn: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: "CHARACTER_FROM_DISCARD",
        filter: { maxCost: 2 },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iWontGiveIn),
    );
  });

  it.skip("Rescue Rangers Away!: should parse card text", () => {
    const text =
      "Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Safe and Sound: should parse card text", () => {
    const text =
      "Chosen character of yours can’t be challenged until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Naveen's Ukulele: should parse card text", () => {
    const text =
      "MAKE IT SING 1 {I}, Banish this item - Chosen character counts as having +3 cost to sing songs this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pooh Pirate Ship: should parse card text", () => {
    const text =
      "MAKE A RESCUE {E}, 3 {I} – Return a Pirate character card from your discard to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: MAKE A RESCUE (activated)
    const makeARescue: ActivatedAbilityDefinition = {
      type: "activated",
      name: "MAKE A RESCUE",
      cost: {
        exert: true,
        ink: 3,
      },
      effect: {
        type: "return-to-hand",
        target: "PIRATE_CHARACTER_FROM_DISCARD",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(makeARescue),
    );
  });

  it.skip("Scrump: should parse card text", () => {
    const text =
      "I MADE HER {E} one of your characters - Chosen character gets -2 {S} until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: I MADE HER (activated)
    const iMadeHer: ActivatedAbilityDefinition = {
      type: "activated",
      name: "I MADE HER",
      cost: {
        exert: true,
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(iMadeHer),
    );
  });

  it.skip("Hundred Acre Island - Pooh's Home: should parse card text", () => {
    const text =
      "FRIENDS FOREVER During an opponent's turn, whenever a character is banished here, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: FRIENDS FOREVER (triggered)
    const friendsForever: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FRIENDS FOREVER",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "CHARACTERS_AT_LOCATION",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(friendsForever),
    );
  });

  it.skip("Sugar Rush Speedway - Finish Line: should parse card text", () => {
    const text =
      "BRING IT HOME, LITTLE ONE! When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: BRING IT HOME, LITTLE ONE! (triggered)
    const bringItHomeLittleOne: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BRING IT HOME, LITTLE ONE!",
      trigger: {
        event: "move",
        timing: "when",
        on: "CHARACTERS_MOVED_HERE",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [
            { type: "banish", target: "SELF" },
            { type: "gain-lore", amount: 3 },
            { type: "draw", amount: 3, target: "CONTROLLER" },
          ],
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(bringItHomeLittleOne),
    );
  });

  it.skip("Hades - Lord of the Dead: should parse card text", () => {
    const text =
      "SOUL COLLECTOR Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: SOUL COLLECTOR (triggered)
    const soulCollector: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SOUL COLLECTOR",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(soulCollector),
    );
  });

  it.skip("Madam Mim - Tiny Adversary: should parse card text", () => {
    const text =
      "Challenger +1 (While challenging, this character gets +1 {S}.)\nZIM ZABBERIM ZIM Your other characters gain Challenger +1.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // First ability: Challenger +1
    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 1,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );

    // Second ability: ZIM ZABBERIM ZIM (static)
    const zimZabberimZim: StaticAbilityDefinition = {
      type: "static",
      name: "ZIM ZABBERIM ZIM",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 1,
        target: "YOUR_CHARACTERS",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(zimZabberimZim),
    );
  });

  it.skip("Sisu - In Her Element: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}).";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Challenger +2
    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );
  });

  it.skip("The White Rose - Jewel of the Garden: should parse card text", () => {
    const text =
      "THE BEAUTY OF THE WORLD When you play this character, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: THE BEAUTY OF THE WORLD (triggered)
    const theBeautyOfTheWorld: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "THE BEAUTY OF THE WORLD",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(theBeautyOfTheWorld),
    );
  });

  it.skip("Juju - Mama Odie's Companion: should parse card text", () => {
    const text =
      "BEES' KNEES When you play this character, move 1 damage counter from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: BEES' KNEES (triggered)
    const beesKnees: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BEES' KNEES",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "move-damage",
        amount: 1,
        from: "CHOSEN_CHARACTER",
        to: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(beesKnees),
    );
  });

  it.skip("Tinker Bell - Fast Flier: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("The Carpenter - Dinner Companion: should parse card text", () => {
    const text =
      "I'LL GET YOU! When this character is banished, you may exert chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: I'LL GET YOU! (triggered)
    const illGetYou: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "I'LL GET YOU!",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "exert",
          target: "CHOSEN_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(illGetYou),
    );
  });

  it.skip("Iago - Reappearing Parrot: should parse card text", () => {
    const text =
      "GUESS WHO When this character is banished in a challenge, return this card to your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: GUESS WHO
    const guessWho: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GUESS WHO",
      trigger: {
        timing: "when",
        event: "banish",
        on: "SELF",
        condition: {
          type: "in-challenge",
        },
      },
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(guessWho),
    );
  });

  it.skip("Scar - Tempestuous Lion: should parse card text", () => {
    const text =
      "Rush (This character can challenge the turn they're played.)\nChallenger +3 (While challenging, this character gets +3 {S}.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Challenger keyword
    const challenger: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Challenger",
      value: 3,
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(challenger),
    );
  });

  it.skip("Tinker Bell - Queen of the Azurite Fairies: should parse card text", () => {
    const text =
      "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Tinker Bell.)\nEvasive (Only characters with Evasive can challenge this character.)\nSHINING EXAMPLE Whenever this character quests, your other Fairy characters get +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: Shift 5
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Ability 2: SHINING EXAMPLE
    const shiningExample: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "SHINING EXAMPLE",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_OTHER_FAIRY_CHARACTERS",
        duration: "this-turn",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(shiningExample),
    );
  });

  it.skip("Diablo - Obedient Raven: should parse card text", () => {
    const text =
      "FLY, MY PET! When this character is banished, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: FLY, MY PET! (triggered)
    const flyMyPet: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FLY, MY PET!",
      trigger: {
        timing: "when",
        event: "banish",
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
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(flyMyPet),
    );
  });

  it.skip("March Hare - Absurd Host: should parse card text", () => {
    const text = "Rush (This character can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Rafiki - Ethereal Guide: should parse card text", () => {
    const text =
      "Shift 7 (You may pay 7 {I} to play this on top of one of your characters named Rafiki.)\nASTRAL ATTUNEMENT During your turn, whenever a card is put into your inkwell, you may draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: Shift 7
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 7 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Ability 2: ASTRAL ATTUNEMENT
    const astralAttunement: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "ASTRAL ATTUNEMENT",
      condition: {
        type: "your-turn",
      },
      trigger: {
        timing: "whenever",
        event: "put-into-inkwell",
        on: "CONTROLLER",
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
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(astralAttunement),
    );
  });

  it.skip("Genie - Wish Fulfilled: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nWHAT HAPPENS NOW? When you play this character, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: WHAT HAPPENS NOW? (triggered)
    const whatHappensNow: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "WHAT HAPPENS NOW?",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(whatHappensNow),
    );
  });

  it.skip("Sisu - Uniting Dragon: should parse card text", () => {
    const text =
      "TRUST BUILDS TRUST Whenever this character quests, reveal the top card of your deck. If it’s a Dragon character card, put it into your hand and repeat this effect. Otherwise, put it on either the top or the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: TRUST BUILDS TRUST
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TRUST BUILDS TRUST",
        trigger: expect.objectContaining({
          event: "quest",
        }),
      }),
    );
  });

  it.skip("Madam Mim - Truly Marvelous: should parse card text", () => {
    const text =
      "OH, BAT GIZZARDS 2 {I}, Choose and discard a card - Gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-lore",
        }),
      }),
    );
  });

  it.skip("Yzma - Conniving Chemist: should parse card text", () => {
    const text =
      "FEEL THE POWER {E} - If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Mama Odie - Solitary Sage: should parse card text", () => {
    const text =
      "I HAVE TO DO EVERYTHING AROUND HERE Whenever you play a song, you may move up to 2 damage counters from chosen character to chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Peter Pan - Shadow Catcher: should parse card text", () => {
    const text =
      "GOTCHA! During your turn, whenever a card is put into your inkwell, exert chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: GOTCHA! (triggered)
    const gotcha: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "GOTCHA!",
      condition: {
        type: "your-turn",
      },
      trigger: {
        timing: "whenever",
        event: "put-into-inkwell",
        on: "CONTROLLER",
      },
      effect: {
        type: "exert",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(gotcha),
    );
  });

  it.skip("Mad Hatter - Eccentric Host: should parse card text", () => {
    const text =
      "WE'LL HAVE TO LOOK INTO THIS Whenever this character quests, you may look at the top card of chosen player's deck. Put it on top of their deck or into their discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("A Very Merry Unbirthday: should parse card text", () => {
    const text =
      "Each opponent puts the top 2 cards of their deck into their discard.";
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
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 5 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Ability 2: YOUR REWARD AWAITS (triggered)
    const yourRewardAwaits: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "YOUR REWARD AWAITS",
      trigger: {
        timing: "whenever",
        event: "play",
        on: "CONTROLLER",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(yourRewardAwaits),
    );

    // Ability 3: FORBIDDEN TREASURE (triggered)
    const forbiddenTreasure: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FORBIDDEN TREASURE",
      trigger: {
        timing: "at",
        event: "end-of-turn",
        on: "CONTROLLER",
      },
      effect: {
        type: "put-on-bottom",
        target: "YOUR_HAND",
        destination: "deck",
        order: "any",
      },
    };
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining(forbiddenTreasure),
    );
  });

  it.skip("Making Magic: should parse card text", () => {
    const text =
      "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Making Magic (action)
    const makingMagic: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "move-damage",
            amount: 1,
            from: "CHOSEN_CHARACTER",
            to: "CHOSEN_OPPOSING_CHARACTER",
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
      expect.objectContaining(makingMagic),
    );
  });

  it.skip("Lose the Way: should parse card text", () => {
    const text =
      "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Lose the Way (action)
    const loseTheWay: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "exert",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "optional",
            effect: {
              type: "cost-effect",
              cost: {
                discard: { amount: 1, chosenBy: "you" },
              },
              effect: {
                type: "restriction",
                restriction: "cant-ready",
                target: "EXERTED_CHARACTER",
                duration: "until-start-of-next-turn",
              },
            },
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(loseTheWay),
    );
  });

  it.skip("Seeking the Half Crown: should parse card text", () => {
    const text =
      "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.\nDraw 2 cards.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: Cost reduction (static)
    const costReduction: StaticAbilityDefinition = {
      type: "static",
      effect: {
        type: "for-each",
        count: {
          type: "characters",
          filter: { classification: "Sorcerer" },
          controller: "you",
        },
        effect: {
          type: "cost-reduction",
          reduction: { ink: 1 },
          target: "SELF",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(costReduction),
    );

    // Ability 2: Draw 2 (action)
    const draw2: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[1].ability).toEqual(expect.objectContaining(draw2));
  });

  it.skip("Maleficent's Staff: should parse card text", () => {
    const text =
      "BACK, FOOLS! Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: BACK, FOOLS! (triggered)
    const backFools: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BACK, FOOLS!",
      trigger: {
        timing: "whenever",
        event: "return-to-hand",
        on: "OPPONENTS_CARDS",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(backFools),
    );
  });

  it.skip("Mad Hatter's Teapot: should parse card text", () => {
    const text =
      "NO ROOM, NO ROOM {E}, 1 {I} - Each opponent puts the top card of their deck into their discard.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Pixie Dust: should parse card text", () => {
    const text =
      "FAITH AND TRUST {E}, {2} {I} - Chosen character gains Challenger +2 and Evasive until the start of your next turn. (While challenging, they get +2 {1}. Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: FAITH AND TRUST (activated)
    const faithAndTrust: ActivatedAbilityDefinition = {
      type: "activated",
      name: "FAITH AND TRUST",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "gain-keyword",
        keywords: ["Challenger +2", "Evasive"],
        target: "CHOSEN_CHARACTER",
        duration: "until-start-of-next-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(faithAndTrust),
    );
  });

  it.skip("Mystical Tree - Mama Odie's Home: should parse card text", () => {
    const text =
      "NOT BAD At the start of your turn, you may move 1 damage counter from chosen character here to chosen opposing character.\n\nHARD-EARNED WISDOM At the start of your turn, if you have a character named Mama Odie here, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: NOT BAD (triggered)
    const notBad: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "NOT BAD",
      trigger: {
        timing: "at",
        event: "start-of-turn",
        on: "CONTROLLER",
      },
      effect: {
        type: "optional",
        effect: {
          type: "move-damage",
          amount: 1,
          from: "CHOSEN_CHARACTER_HERE",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(notBad),
    );
  });

  it.skip("Jasmine - Royal Seafarer: should parse card text", () => {
    const text =
      "BY ORDER OF THE PRINCESS When you play this character, choose one: \n* Exert chosen damaged character. \n* Chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: BY ORDER OF THE PRINCESS (triggered)
    const byOrderOfThePrincess: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "BY ORDER OF THE PRINCESS",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "choose-one",
        choices: [
          {
            type: "exert",
            target: "CHOSEN_DAMAGED_CHARACTER",
          },
          {
            type: "gain-keyword",
            keyword: "Reckless",
            target: "CHOSEN_OPPOSING_CHARACTER",
            duration: "their-next-turn",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(byOrderOfThePrincess),
    );
  });

  it.skip("Captain Hook - Underhanded: should parse card text", () => {
    const text =
      "INSPIRES DREAD While this character is exerted, opposing Pirate characters can't quest.\nUPPER HAND Whenever this character is challenged, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: INSPIRES DREAD (static)
    const inspiresDread: StaticAbilityDefinition = {
      type: "static",
      name: "INSPIRES DREAD",
      condition: {
        type: "exerted",
        target: "SELF",
      },
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "OPPOSING_PIRATE_CHARACTERS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(inspiresDread),
    );

    // Ability 2: UPPER HAND (triggered)
    const upperHand: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "UPPER HAND",
      trigger: {
        timing: "whenever",
        event: "challenged",
        on: "SELF",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(upperHand),
    );
  });

  it.skip("Stitch - Alien Buccaneer: should parse card text", () => {
    const text =
      "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Stitch.)\nREADY FOR ACTION When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: Shift 3
    const shift: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
    };
    expect(result.abilities[0].ability).toEqual(expect.objectContaining(shift));

    // Ability 2: READY FOR ACTION (triggered)
    const readyForAction: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "READY FOR ACTION",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      condition: {
        type: "used-shift",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-deck",
          cardType: "action",
          from: "discard",
          position: "top",
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(readyForAction),
    );
  });

  it.skip("Go Go Tomago - Darting Dynamo: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSTOP WHINING, WOMAN UP When you play this character, you may pay 2 {I} to gain lore equal to the damage on chosen opposing character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: STOP WHINING, WOMAN UP (triggered)
    const stopWhining: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "STOP WHINING, WOMAN UP",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "cost-effect",
          cost: { ink: 2 },
          effect: {
            type: "gain-lore",
            amount: {
              type: "damage-on",
              target: "CHOSEN_OPPOSING_CHARACTER",
            },
            target: "CONTROLLER",
          },
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(stopWhining),
    );
  });

  it.skip("Honey Lemon - Chemical Genius: should parse card text", () => {
    const text =
      "HERE'S THE BEST PART When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: HERE'S THE BEST PART (triggered)
    const heresTheBestPart: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HERE'S THE BEST PART",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "cost-effect",
          cost: { ink: 2 },
          effect: {
            type: "discard",
            amount: 1,
            chosenBy: "opponent",
            target: "EACH_OPPONENT",
          },
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(heresTheBestPart),
    );
  });

  it.skip("Fred - Mascot by Day: should parse card text", () => {
    const text =
      "HOW COOL IS THAT Whenever this character is challenged, gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: HOW COOL IS THAT (triggered)
    const howCoolIsThat: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "HOW COOL IS THAT",
      trigger: {
        timing: "whenever",
        event: "challenged",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(howCoolIsThat),
    );
  });

  it.skip("Heathcliff - Stoic Butler: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Basil - Hypnotized Mouse: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
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
    const captainOnDeck: StaticAbilityDefinition = {
      type: "static",
      name: "CAPTAIN ON DECK",
      condition: {
        type: "have-character",
        classification: "Captain",
        controller: "you",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(captainOnDeck),
    );
  });

  it.skip("Daisy Duck - Pirate Captain: should parse card text", () => {
    const text =
      "DISTANT SHORES Whenever one of your Pirate characters quests while at a location, draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: DISTANT SHORES (triggered)
    const distantShores: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "DISTANT SHORES",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "YOUR_PIRATE_CHARACTERS",
        condition: {
          type: "at-location",
        },
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(distantShores),
    );
  });

  it.skip("Prince Phillip - Royal Explorer: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
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
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // Ability 2: RULER OF THE SEAS
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "RULER OF THE SEAS",
        trigger: expect.objectContaining({
          event: "play",
        }),
      }),
    );
  });

  it.skip("Peter Pan - Never Land Prankster: should parse card text", () => {
    const text =
      "LOOK INNOCENT This character enters play exerted.\nCAN'T TAKE A JOKE? While this character is exerted, each opposing player can't gain lore unless one of their characters has challenged this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: LOOK INNOCENT
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "LOOK INNOCENT",
        effect: expect.objectContaining({
          type: "restriction",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "deal-damage",
        }),
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
    const anEyeForTech: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "AN EYE FOR TECH",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      condition: {
        type: "opponent-has",
        cardType: "item",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(anEyeForTech),
    );
  });

  it.skip("Gazelle - Angel with Horns: should parse card text", () => {
    const text =
      "YOU ARE A REALLY HOT DANCER When you play this character, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: YOU ARE A REALLY HOT DANCER (triggered)
    const youAreAReallyHotDancer: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "YOU ARE A REALLY HOT DANCER",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "CHOSEN_CHARACTER",
        duration: "until-start-of-next-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youAreAReallyHotDancer),
    );
  });

  it.skip("Goofy - Expert Shipwright: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nCLEVER DESIGN Whenever this character quests, chosen character gains Ward until the start of your next turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: CLEVER DESIGN (triggered)
    const cleverDesign: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "CLEVER DESIGN",
      trigger: {
        timing: "whenever",
        event: "quest",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "CHOSEN_CHARACTER",
        duration: "until-start-of-next-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(cleverDesign),
    );
  });

  it.skip("Bellwether - Assistant Mayor: should parse card text", () => {
    const text =
      "FEAR ALWAYS WORKS During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: FEAR ALWAYS WORKS (triggered)
    const fearAlwaysWorks: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "FEAR ALWAYS WORKS",
      condition: {
        type: "your-turn",
      },
      trigger: {
        timing: "whenever",
        event: "put-into-inkwell",
        on: "CONTROLLER",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_OPPOSING_CHARACTER",
        duration: "their-next-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(fearAlwaysWorks),
    );
  });

  it.skip("Basil - Disguised Detective: should parse card text", () => {
    const text =
      "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Basil.)\nTWISTS AND TURNS During your turn, whenever a card is put into your inkwell, you may pay 1 {I} to have chosen opponent choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: Shift 4
    const shift4: KeywordAbilityDefinition = {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(shift4),
    );

    // Ability 2: TWISTS AND TURNS (triggered)
    const twistsAndTurns: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "TWISTS AND TURNS",
      condition: {
        type: "your-turn",
      },
      trigger: {
        timing: "whenever",
        event: "put-into-inkwell",
        on: "CONTROLLER",
      },
      effect: {
        type: "optional",
        effect: {
          type: "cost-effect",
          cost: { ink: 1 },
          effect: {
            type: "discard",
            amount: 1,
            chosenBy: "opponent",
            target: "CHOSEN_OPPONENT",
          },
        },
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(twistsAndTurns),
    );
  });

  it.skip("Bend to My Will: should parse card text", () => {
    const text = "Each opponent discards all cards in their hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Prepare to Board!: should parse card text", () => {
    const text =
      "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Prepare to Board! (action)
    const prepareToBoard: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "classification",
          classification: "Pirate",
          target: "CHOSEN_CHARACTER",
        },
        ifTrue: {
          type: "modify-stat",
          stat: "strength",
          modifier: 3,
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
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(prepareToBoard),
    );
  });

  it.skip("Heffalumps and Woozles: should parse card text", () => {
    const text =
      "Chosen opposing character can't quest during their next turn. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Heffalumps and Woozles (action)
    const heffalumpsAndWoozles: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "sequence",
        effects: [
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "CHOSEN_OPPOSING_CHARACTER",
            duration: "their-next-turn",
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
      expect.objectContaining(heffalumpsAndWoozles),
    );
  });

  it.skip("Mosquito Bite: should parse card text", () => {
    const text = "Put 1 damage counter on chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Mosquito Bite (action)
    const mosquitoBite: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "put-damage",
        amount: 1,
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(mosquitoBite),
    );
  });

  it.skip("You Came Back: should parse card text", () => {
    const text = "Ready chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: You Came Back (action)
    const youCameBack: ActionAbilityDefinition = {
      type: "action",
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(youCameBack),
    );
  });

  it.skip("MegaBot: should parse card text", () => {
    const text =
      "HAPPY FACE This item enters play exerted.\nDESTROY! {E}, Banish this item - Choose one:\n* Banish chosen item.\n* Banish chosen damaged character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: HAPPY FACE (static)
    const happyFace: StaticAbilityDefinition = {
      type: "static",
      name: "HAPPY FACE",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(happyFace),
    );
  });

  it.skip("Galactic Communicator: should parse card text", () => {
    const text =
      "RESOURCE ALLOCATION 1 {I}, Banish this item - Return chosen character with 2 {S} or less to their player's hand.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: RESOURCE ALLOCATION (activated)
    const resourceAllocation: ActivatedAbilityDefinition = {
      type: "activated",
      name: "RESOURCE ALLOCATION",
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "return-to-hand",
        target: "CHOSEN_CHARACTER_WITH_2_STRENGTH_OR_LESS",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(resourceAllocation),
    );
  });

  it.skip("Transport Pod: should parse card text", () => {
    const text =
      "GIVE 'EM A SHOW At the start of your turn, you may move a character of yours to a location for free.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Perilous Maze - Watery Labyrinth: should parse card text", () => {
    const text =
      "LOST IN THE WAVES Whenever a character is challenged while here, each opponent chooses and discards a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: LOST IN THE WAVES (triggered)
    const lostInTheWaves: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LOST IN THE WAVES",
      trigger: {
        timing: "whenever",
        event: "challenged",
        on: "CHARACTER_HERE",
      },
      effect: {
        type: "discard",
        amount: 1,
        chosenBy: "opponent",
        target: "EACH_OPPONENT",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(lostInTheWaves),
    );
  });

  it.skip("Owl Island - Secluded Entrance: should parse card text", () => {
    const text =
      "TEAMWORK For each character you have here, you pay 1 {I} less for the first action you play each turn.\nLOTS TO LEARN Whenever you play a second action in a turn, gain 3 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: TEAMWORK (static)
    const teamwork: StaticAbilityDefinition = {
      type: "static",
      name: "TEAMWORK",
      effect: {
        type: "for-each",
        count: {
          type: "characters-here",
          controller: "you",
        },
        effect: {
          type: "cost-reduction",
          reduction: { ink: 1 },
          target: "FIRST_ACTION_EACH_TURN",
        },
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(teamwork),
    );

    // Ability 2: LOTS TO LEARN (triggered)
    const lotsToLearn: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "LOTS TO LEARN",
      trigger: {
        timing: "whenever",
        event: "play-second-action",
        on: "CONTROLLER",
      },
      effect: {
        type: "gain-lore",
        amount: 3,
        target: "CONTROLLER",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(lotsToLearn),
    );
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
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
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
        type: "triggered",
        name: "DIZZYING SPEED",
        trigger: expect.objectContaining({
          event: "play",
        }),
      }),
    );
  });

  it.skip("Jasmine - Rebellious Princess: should parse card text", () => {
    const text =
      "YOU'LL NEVER MISS IT Whenever this character quests, each opponent loses 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: YOU'LL NEVER MISS IT
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "YOU'LL NEVER MISS IT",
        trigger: expect.objectContaining({
          event: "quest",
        }),
      }),
    );
  });

  it.skip("Raya - Kumandran Rider: should parse card text", () => {
    const text =
      "COME ON, LET'S DO THIS Once during your turn, whenever a card is put into your inkwell, you may ready another chosen character of yours. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );
  });

  it.skip("Wendy Darling - Courageous Captain: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nLOOK LIVELY, CREW! While you have another Pirate character in play, this character gets +1 {S} and +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
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
        type: "triggered",
        name: "YOU HAVE TO CHART YOUR OWN COURSE",
        trigger: expect.objectContaining({
          event: "quest",
        }),
      }),
    );
  });

  it.skip("Vanellope Von Schweetz - Gutsy Go-Getter: should parse card text", () => {
    const text =
      "AS READY AS I'LL EVER BE At the start of your turn, if this character is at a location, draw a card and gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Markowski - Space Trooper: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)";
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
    const text =
      "SOLID GROUND While this character is at a location, he gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Adorabeezle Winterpop - Ice Rocket Racer: should parse card text", () => {
    const text =
      "KEEP DRIVING While this character has damage, she gets +1 {L}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
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
        type: "static",
        name: "LEARNING THE ROPES",
        effect: expect.objectContaining({
          type: "restriction",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // Ability 2: REMEMBER YOUR TRAINING
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "REMEMBER YOUR TRAINING",
        trigger: expect.objectContaining({
          event: "play",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // Ability 2: GATHERING FORCES
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "GATHERING FORCES",
        trigger: expect.objectContaining({
          event: "play",
        }),
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
        type: "triggered",
        name: "CHEEEEOHOOOO!",
        trigger: expect.objectContaining({
          event: "challenge",
        }),
      }),
    );

    // Ability 2: WAYFINDING
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "WAYFINDING",
        trigger: expect.objectContaining({
          event: "play",
        }),
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

  it.skip("Tigger - In the Crow's Nest: should parse card text", () => {
    const text =
      "Evasive (Only characters with Evasive can challenge this character.)\nSWASH YOUR BUCKLES Whenever you play an action, this character gets +1 {S} and +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: SWASH YOUR BUCKLES
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "SWASH YOUR BUCKLES",
        trigger: expect.objectContaining({
          event: "play",
        }),
      }),
    );
  });

  it.skip("Scar - Heartless Hunter: should parse card text", () => {
    const text =
      "BARED TEETH When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: BARED TEETH
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BARED TEETH",
        trigger: expect.objectContaining({
          event: "play",
        }),
      }),
    );
  });

  it.skip("Thievery: should parse card text", () => {
    const text = "Chosen opponent loses 1 lore. Gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Lead the Way: should parse card text", () => {
    const text = "Your characters get +2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("The Islands I Pulled from the Sea: should parse card text", () => {
    const text =
      "Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "search-deck",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "restriction",
        }),
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
        type: "static",
        name: "A SUITABLE WEAPON Your damaged",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );
  });

  it.skip("Skull Rock - Isolated Fortress: should parse card text", () => {
    const text =
      "FAMILIAR GROUND Characters get +1 {S} while here.\nSAFE HAVEN At the start of your turn, if you have a Pirate character here, gain 1 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: FAMILIAR GROUND
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "FAMILIAR GROUND",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "conditional",
        }),
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
        type: "triggered",
        name: "HAPPY TO HELP",
        trigger: expect.objectContaining({
          event: "quest",
        }),
      }),
    );
  });

  it.skip("Gadget Hackwrench - Creative Thinker: should parse card text", () => {
    const text =
      "BRAINSTORM Whenever you play an item, this character gets +1 {L} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: BRAINSTORM
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BRAINSTORM",
        trigger: expect.objectContaining({
          event: "play",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "play-card",
        }),
      }),
    );
  });

  it.skip("Zipper - Astute Decoy: should parse card text", () => {
    const text =
      "Ward (Opponents can't choose this character except to challenge.)\nRUN INTERFERENCE During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: RUN INTERFERENCE
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "RUN INTERFERENCE",
        trigger: expect.objectContaining({
          event: "play",
        }),
      }),
    );
  });

  it.skip("Oswald - The Lucky Rabbit: should parse card text", () => {
    const text =
      "FAVORABLE CHANCE During your turn, whenever a card is put into your inkwell, you may reveal the top card of your deck. If it’s an item card, you may play that item for free and it enters play exerted. Otherwise, put it on the bottom of your deck.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: FAVORABLE CHANCE
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "FAVORABLE CHANCE",
        trigger: expect.objectContaining({
          event: "play",
        }),
      }),
    );
  });

  it.skip("Yokai - Enigmatic Inventor: should parse card text", () => {
    const text =
      "TIME TO UPGRADE Whenever this character quests, you may return one of your items to your hand to pay 2 {I} less for the next item you play this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: TIME TO UPGRADE
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TIME TO UPGRADE",
        trigger: expect.objectContaining({
          event: "quest",
        }),
      }),
    );
  });

  it.skip("Pleakley - Scientific Expert: should parse card text", () => {
    const text =
      "REPORTING FOR DUTY When you play this character, put chosen character of yours into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: REPORTING FOR DUTY
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "REPORTING FOR DUTY",
        trigger: expect.objectContaining({
          event: "play",
        }),
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
    const sweetTech: ActivatedAbilityDefinition = {
      type: "activated",
      name: "SWEET TECH",
      cost: {
        ink: 2,
        exert: true,
      },
      effect: {
        type: "search-deck",
        cardType: ["item", "Robot character"],
        reveal: true,
        destination: "top-of-deck",
        shuffle: true,
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(sweetTech),
    );
  });

  it.skip("Heihei - Not-So-Tricky Chicken: should parse card text", () => {
    const text =
      "EAT ANYTHING When you play this character, exert chosen opposing item. It can't ready at the start of its next turn.\nOUT TO LUNCH During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: EAT ANYTHING (triggered)
    const eatAnything: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "EAT ANYTHING",
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
            target: "CHOSEN_OPPOSING_ITEM",
          },
          {
            type: "restriction",
            restriction: "cant-ready",
            target: "THAT_ITEM",
            duration: "until-start-of-next-turn",
          },
        ],
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(eatAnything),
    );

    // Ability 2: OUT TO LUNCH (static)
    const outToLunch: StaticAbilityDefinition = {
      type: "static",
      name: "OUT TO LUNCH",
      condition: {
        type: "your-turn",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
    };
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining(outToLunch),
    );
  });

  it.skip("Sour Bill - Surly Henchman: should parse card text", () => {
    const text =
      "UNPALATABLE When you play this character, chosen opposing character gets -2 {S} this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: UNPALATABLE (triggered)
    const unpalatable: TriggeredAbilityDefinition = {
      type: "triggered",
      name: "UNPALATABLE",
      trigger: {
        timing: "when",
        event: "play",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_OPPOSING_CHARACTER",
        duration: "this-turn",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(unpalatable),
    );
  });

  it.skip("Nick Wilde - Soggy Fox: should parse card text", () => {
    const text =
      "NICE TO HAVE A PARTNER While you have another character with Support in play, this character gets +2 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
  });

  it.skip("Wasabi - Methodical Engineer: should parse card text", () => {
    const text =
      "BLADES OF FURY When you play this character, you may banish chosen item. Its player gains 1 lore.\nQUICK REFLEXES During your turn, this character gains Evasive. (They can challenge characters with Evasive.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: BLADES OF FURY
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BLADES OF FURY",
        trigger: expect.objectContaining({
          event: "play",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Nick Wilde - Sly Fox: should parse card text", () => {
    const text =
      "Shift 1 (You may pay 1 {I} to play this on top of one of your characters named Nick Wilde.)\nCAN'T TOUCH ME While you have an item in play, this character can't be challenged.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );
  });

  it.skip("Tadashi Hamada - Baymax Inventor: should parse card text", () => {
    const text =
      "LET'S GET BACK TO WORK This character gets +1 {S} and +1 {W} for each item you have in play.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );
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
        type: "static",
        name: "I NEED TO UPGRADE ALL OF YOU Your other Inventor",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "put-on-bottom",
        }),
      }),
    );
  });

  it.skip("Tadashi Hamada - Gifted Roboticist: should parse card text", () => {
    const text =
      "SOMEONE HAS TO HELP During an opponent’s turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "conditional",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "remove-damage",
        }),
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
        type: "triggered",
        name: "THE TREATMENT IS WORKING When you play this character and",
        trigger: expect.objectContaining({
          event: "play",
        }),
      }),
    );
  });

  it.skip("Yokai - Scientific Supervillain: should parse card text", () => {
    const text =
      "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Yokai.)\nNEUROTRANSMITTER You may play items named Microbots for free.\nTECHNICAL GAIN Whenever this character quests, draw a card for each opposing character with {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(3);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // Ability 3: TECHNICAL GAIN
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "TECHNICAL GAIN",
        trigger: expect.objectContaining({
          event: "quest",
        }),
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
        type: "triggered",
        name: "AHOY!",
        trigger: expect.objectContaining({
          event: "quest",
        }),
      }),
    );
  });

  it.skip("We Could Be Immortals: should parse card text", () => {
    const text =
      "Your Inventor characters gain Resist +6 this turn. Then, put this card into your inkwell facedown and exerted. (Damage dealt to them is reduced by 6.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Your Inventor
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "Your Inventor",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Sail the Azurite Sea: should parse card text", () => {
    const text =
      "This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Prepare Your Bot: should parse card text", () => {
    const text =
      "Choose one:\n* Ready chosen item.\n* Ready chosen Robot character. They can't quest for the rest of this turn.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "restriction",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "remove-damage",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "conditional",
        }),
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
        type: "triggered",
        name: "INSPIRED TECH",
        trigger: expect.objectContaining({
          event: "play",
        }),
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
        type: "static",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Rescue Rangers Submarine - Mobile Headquarters: should parse card text", () => {
    const text =
      "PLANNING SESSION At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "conditional",
        }),
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
        type: "static",
        name: "WELCOME TO THE LAB Inventor",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "conditional",
        }),
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
        type: "triggered",
        name: "A LITTLE HELP",
        trigger: expect.objectContaining({
          event: "play",
        }),
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
        type: "triggered",
        name: "COCONUT LEADER",
        trigger: expect.objectContaining({
          event: "quest",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Mr. Big - Shrewd Tycoon: should parse card text", () => {
    const text =
      "REPUTATION This character can't be challenged by characters with 2 {S} or more.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: REPUTATION
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        name: "REPUTATION",
        effect: expect.objectContaining({
          type: "restriction",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Hercules - Unwavering Demigod: should parse card text", () => {
    const text =
      "Challenger +2 (While challenging, this character gets +2 {S}).";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: Challenger keyword
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Challenger",
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
        type: "triggered",
        name: "HUNK OF HARDWARE",
        trigger: expect.objectContaining({
          event: "play",
        }),
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
        type: "keyword",
        keyword: "Resist",
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
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // Ability 2: BATTLE STATION
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "BATTLE STATION",
        trigger: expect.objectContaining({
          event: "play",
        }),
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
        type: "triggered",
        name: "KEEP IT HIDDEN",
        trigger: expect.objectContaining({
          event: "banish",
        }),
      }),
    );
  });

  it.skip("Pluto - Guard Dog: should parse card text", () => {
    const text =
      "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nBRAVO While this character has no damage, he gets +4 {S}.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(2);

    // Ability 1: static
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "static",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );

    // Ability 2: static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        effect: expect.objectContaining({
          type: "modify-stat",
        }),
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
        type: "static",
        name: "SUPPORT Your Pluto",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
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
        type: "static",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Wreck-It Ralph - Ham Hands: should parse card text", () => {
    const text =
      "I WRECK THINGS Whenever this character quests, you may banish chosen item or location to gain 2 lore.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: I WRECK THINGS
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "I WRECK THINGS",
        trigger: expect.objectContaining({
          event: "quest",
        }),
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
        type: "keyword",
        keyword: "Resist",
        value: 1,
      }),
    );

    // Ability 2: LEVEL UP
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "triggered",
        name: "LEVEL UP",
        trigger: expect.objectContaining({
          event: "banish",
        }),
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
        type: "static",
        name: "DRIVELING GALOOTS",
        effect: expect.objectContaining({
          type: "restriction",
        }),
      }),
    );

    // Ability 2: static
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "static",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
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
        type: "triggered",
        name: "YOU WILL BE PAID WHEN THE TIME COMES",
        trigger: expect.objectContaining({
          event: "play",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
      }),
    );

    // Ability 2: Resist keyword
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "keyword",
        keyword: "Resist",
        value: 2,
      }),
    );

    // Ability 3: action effect
    expect(result.abilities[2].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "deal-damage",
        }),
      }),
    );
  });

  it.skip("Hot Potato: should parse card text", () => {
    const text =
      "Choose one:\n- Deal 2 damage to chosen character.\n- Banish chosen item.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "deal-damage",
        }),
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
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Twin Fire: should parse card text", () => {
    const text =
      "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "optional",
        }),
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

  it.skip("Unfortunate Situation: should parse card text", () => {
    const text =
      "Each opponent chooses one of their characters and deals 4 damage to them.";
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
        type: "static",
        name: "SYMBOL OF ROYALTY Your Prince and King",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );

    // Ability 2: action effect
    expect(result.abilities[1].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "reveal-top-card",
        }),
      }),
    );
  });

  it.skip("Training Dummy: should parse card text", () => {
    const text =
      "HANDLE WITH CARE {E}, 2 {I} – Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "gain-keyword",
        }),
      }),
    );
  });

  it.skip("Sunglasses: should parse card text", () => {
    const text = "SPYCRAFT {E} - Draw a card, then choose and discard a card.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    // Ability 1: action effect
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining({
        type: "action",
        effect: expect.objectContaining({
          type: "sequence",
        }),
      }),
    );
  });

  it.skip("Treasure Mountain - Azurite Sea Island: should parse card text", () => {
    const text =
      "SECRET WEAPON At the start of your turn, deal damage to chosen character or location equal to the number of characters here.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });

  it.skip("Galactic Council Chamber - Courtroom: should parse card text", () => {
    const text =
      "FEDERATION DECREE While you have an Alien or Robot character here, this location can’t be challenged.";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBeGreaterThan(0);
  });
});
