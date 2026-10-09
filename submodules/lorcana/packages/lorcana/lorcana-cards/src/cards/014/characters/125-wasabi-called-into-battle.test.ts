// CR 2.2.0: 1.9.4 (damage), 6.1.6 (another), 6.1.13 (duration), 6.2 (bag), 6.4 (static), 8.8 (Resist), 8.14 (Ward).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockLocation,
  createMockItem,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { wasabiCalledIntoBattle } from "./125-wasabi-called-into-battle";

const inkDropSource = createMockAction({
  id: "wasabi-ink-source",
  name: "Ink Source",
  cost: 1,
  abilities: [
    {
      type: "action",
      text: "Get 2 ink drops.",
      effect: {
        type: "gain-ink-drop",
        amount: 2,
        target: "CONTROLLER",
      },
    },
  ],
});

const defender = createMockCharacter({
  id: "wasabi-defender",
  name: "Defender",
  cost: 3,
  strength: 1,
  willpower: 9,
});

const bystander = createMockCharacter({
  id: "wasabi-bystander",
  name: "Bystander",
  cost: 2,
  strength: 1,
  willpower: 9,
});

const otherAttacker = createMockCharacter({
  id: "wasabi-other-attacker",
  name: "Other Attacker",
  cost: 2,
  strength: 2,
  willpower: 5,
});

describe("Wasabi - Called into Battle", () => {
  it("deals damage equal to his {S} to another chosen character when he deals challenge damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: wasabiCalledIntoBattle, isDrying: false }],
      },
      {
        play: [{ card: defender, exerted: true }, bystander],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(wasabiCalledIntoBattle, defender),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(wasabiCalledIntoBattle, {
        targets: [bystander],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({
      card: bystander,
      value: wasabiCalledIntoBattle.strength,
    });
  });

  it("does not trigger when another of your characters deals challenge damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: wasabiCalledIntoBattle, isDrying: false }, otherAttacker],
      },
      {
        play: [{ card: defender, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().challenge(otherAttacker, defender)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("has base strength without an ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [wasabiCalledIntoBattle],
      deck: 2,
    });

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getCardStrength(wasabiCalledIntoBattle)).toBe(
      wasabiCalledIntoBattle.strength,
    );
  });

  it("gets +2 {S} while you have an ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [wasabiCalledIntoBattle],
      hand: [inkDropSource],
      inkwell: 1,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(inkDropSource)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBeGreaterThan(0);
    expect(testEngine.asPlayerOne().getCardStrength(wasabiCalledIntoBattle)).toBe(
      wasabiCalledIntoBattle.strength + 2,
    );
  });
});

const wasabi = wasabiCalledIntoBattle;
const place = createMockLocation({
  id: "wasabi-location",
  name: "Location",
  cost: 1,
  willpower: 12,
});
const item = createMockItem({ id: "wasabi-item", name: "Item", cost: 1 });
const ward = createMockCharacter({
  id: "wasabi-ward",
  name: "Ward",
  cost: 1,
  willpower: 9,
  abilities: [{ type: "keyword", keyword: "Ward" }],
});
const resist = createMockCharacter({
  id: "wasabi-resist",
  name: "Resist",
  cost: 1,
  strength: 1,
  willpower: 9,
  abilities: [{ type: "keyword", keyword: "Resist", value: 3 }],
});
const immune = createMockCharacter({
  id: "wasabi-immune",
  name: "Immune",
  cost: 1,
  strength: 1,
  willpower: 9,
  abilities: [{ type: "keyword", keyword: "Resist", value: 4 }],
});
const fatal = createMockCharacter({
  id: "wasabi-fatal",
  name: "Fatal Defender",
  cost: 1,
  strength: 5,
  willpower: 9,
});
const lethalTarget = createMockCharacter({
  id: "wasabi-lethal-target",
  name: "Lethal Target",
  cost: 1,
  willpower: 4,
});
const cheap = createMockCharacter({ id: "wasabi-cheap", name: "Cheap", cost: 1, willpower: 2 });
const spend = createMockAction({ id: "wasabi-spend", name: "Spend", cost: 1, abilities: [] });
const reduce = createMockAction({
  id: "wasabi-reduce",
  name: "Reduce",
  cost: 0,
  abilities: [
    {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -4,
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
});
const ready = createMockAction({
  id: "wasabi-ready",
  name: "Ready",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "ready", target: "CHOSEN_CHARACTER" } }],
});
const watcher = createMockCharacter({
  id: "wasabi-watcher",
  name: "Challenge Reward",
  cost: 0,
  abilities: [
    {
      type: "triggered",
      trigger: {
        event: "deal-damage",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        restrictions: [{ type: "in-challenge" }],
      },
      effect: { type: "gain-ink-drop", amount: 1, target: "CONTROLLER" },
    },
  ],
});

describe("Wasabi - complete behavior boundaries", () => {
  it("a location challenge does not trigger Twin Blades", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi] },
      { play: [place, bystander] },
    );
    expect(g.asPlayerOne().challenge(wasabi, place)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(place)).toBe(4);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().getDamage(bystander)).toBe(0);
  });
  it("defending on an opponent turn retains the drop bonus but does not trigger", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: wasabi, exerted: true }], inkDrops: 1, deck: 5 },
      { play: [defender], deck: 5 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().challenge(defender, wasabi)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(defender)).toBe(6);
    expect(g.asPlayerOne().getDamage(wasabi)).toBe(1);
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
  });
  it("damage reduced to zero does not trigger", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi] },
      { play: [{ card: immune, exerted: true }, bystander] },
    );
    expect(g.asPlayerOne().challenge(wasabi, immune)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(immune)).toBe(0);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
  it("partial Resist reduction triggers but does not reduce the copied Strength amount", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi] },
      { play: [{ card: resist, exerted: true }, bystander] },
    );
    expect(g.asPlayerOne().challenge(wasabi, resist)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(resist)).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [bystander] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(bystander)).toBe(4);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
  it("Resist also reduces Twin Blades ability damage and it does not trigger itself", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi] },
      { play: [{ card: defender, exerted: true }, resist] },
    );
    expect(g.asPlayerOne().challenge(wasabi, defender)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [resist] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(resist)).toBe(1);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
  it("zero Strength deals no damage and adds no trigger", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi], hand: [reduce] },
      { play: [{ card: defender, exerted: true }, bystander] },
    );
    expect(g.asPlayerOne().playCard(reduce, { targets: [wasabi] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(wasabi)).toBe(0);
    expect(g.asPlayerOne().challenge(wasabi, defender)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(defender)).toBe(0);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
  it("uses live Strength after resolving another challenge trigger that gains a drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi, watcher] },
      { play: [{ card: defender, exerted: true }, bystander] },
    );
    expect(g.asPlayerOne().challenge(wasabi, defender)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(defender)).toBe(4);
    expect(g.asPlayerOne().resolvePendingByCard(watcher)).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getCardStrength(wasabi)).toBe(6);
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [bystander] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(bystander)).toBe(6);
  });
  it("a trigger still resolves when Wasabi is banished by return damage", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi] },
      { play: [{ card: fatal, exerted: true }, bystander] },
    );
    expect(g.asPlayerOne().challenge(wasabi, fatal)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(wasabi)).toBe("discard");
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [bystander] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(bystander)).toBe(4);
  });
  it("may target the surviving challenge defender because another excludes the source", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi] },
      { play: [{ card: defender, exerted: true }] },
    );
    expect(g.asPlayerOne().challenge(wasabi, defender)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [defender] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(defender)).toBe(8);
  });
  it("can deal mandatory damage to an own Ward character", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi, ward] },
      { play: [{ card: defender, exerted: true }] },
    );
    expect(g.asPlayerOne().challenge(wasabi, defender)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [ward] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ward)).toBe(4);
  });
  it("rejects source, opposing Ward, item, location and hidden-zone targets before a valid retry", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi, item], hand: [cheap], discard: [otherAttacker] },
      { play: [{ card: defender, exerted: true }, ward, place, bystander] },
    );
    expect(g.asPlayerOne().challenge(wasabi, defender)).toBeSuccessfulCommand();
    for (const target of [wasabi, ward, item, place, cheap, otherAttacker])
      expect(
        g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [target] }),
      ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(bystander)).toBe(0);
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [bystander] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(bystander)).toBe(4);
  });
  it("rejects multiple targets and does not allow declining mandatory damage", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi, otherAttacker] },
      { play: [{ card: defender, exerted: true }, bystander] },
    );
    expect(g.asPlayerOne().challenge(wasabi, defender)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [bystander, otherAttacker] }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(bystander)).toBe(0);
    expect(
      g.asPlayerOne().getPendingEffects().length + g.asPlayerOne().getBagEffects().length,
    ).toBeGreaterThan(0);
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [bystander] }),
    ).toBeSuccessfulCommand();
  });
  it("lethal challenge damage removes the defender before choosing and the second hit can banish", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi] },
      { play: [{ card: cheap, exerted: true }, lethalTarget] },
    );
    expect(g.asPlayerOne().challenge(wasabi, cheap)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(cheap)).toBe("discard");
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [cheap] }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [lethalTarget] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(lethalTarget)).toBe("discard");
  });
  it("triggers again after being readied in the same turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi], hand: [ready] },
      { play: [{ card: defender, exerted: true }, bystander] },
    );
    expect(g.asPlayerOne().challenge(wasabi, defender)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [bystander] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(ready, { targets: [wasabi] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().challenge(wasabi, defender)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [bystander] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(defender)).toBe(8);
    expect(g.asPlayerOne().getDamage(bystander)).toBe(8);
    expect(g.asPlayerOne().getDamage(wasabi)).toBe(2);
  });
  it("one or many drops give exactly +2 and an opposing drop gives no bonus", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi], inkDrops: 3 },
      { play: [wasabi], inkDrops: 0 },
    );
    const own = g.findCardInstanceId(wasabi, "play", PLAYER_ONE),
      enemy = g.findCardInstanceId(wasabi, "play", PLAYER_TWO);
    expect(g.asPlayerOne().getCardStrength(own)).toBe(6);
    expect(g.asPlayerTwo().getCardStrength(enemy)).toBe(4);
  });
  it("spending the last drop removes the bonus immediately", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [wasabi],
      hand: [spend, spend],
      inkDrops: 2,
    });
    expect(g.asPlayerOne().playCard(spend, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getCardStrength(wasabi)).toBe(6);
    expect(g.asPlayerOne().playCard(spend, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getCardStrength(wasabi)).toBe(4);
  });
  it("paying five with the last drop leaves printed Strength and a drying uninkable source", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [wasabi], inkwell: 4, inkDrops: 1, deck: 5 },
      { deck: 5 },
    );
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, wasabi)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(wasabi, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getCardStrength(wasabi)).toBe(4);
    expect(g.asPlayerOne().quest(wasabi)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(wasabi)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
  });
  it("rejects insufficient payment without losing ink or drops", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [wasabi],
      inkwell: 3,
      inkDrops: 1,
    });
    expect(g.asPlayerOne().playCard(wasabi, { inkDrops: 1 })).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(wasabi)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  });
});

describe("Wasabi additional outcomes", () => {
  // CR 6.7.6: use the source's last known Strength after it leaves play.
  it("keeps the boosted six-Strength damage after fatal return damage", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi], inkDrops: 1 },
      { play: [{ card: fatal, exerted: true }, bystander] },
    );
    expect(g.asPlayerOne().getCardStrength(wasabi)).toBe(6);
    expect(g.asPlayerOne().challenge(wasabi, fatal)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(fatal)).toBe(6);
    expect(g.asPlayerOne().getCardZone(wasabi)).toBe("discard");
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [bystander] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(bystander)).toBe(6);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
  it("a held drop raises both actual challenge damage and Twin Blades damage to six", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi], inkDrops: 1 },
      { play: [{ card: defender, exerted: true }, bystander] },
    );
    expect(g.asPlayerOne().challenge(wasabi, defender)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(defender)).toBe(6);
    expect(g.asPlayerOne().getDamage(wasabi)).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(wasabi, { targets: [bystander] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(bystander)).toBe(6);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  });
  it("independent copies each gain only two Strength and only the damaging copy triggers", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi, wasabi], inkDrops: 2 },
      { play: [{ card: defender, exerted: true }, bystander] },
    );
    const [one, two] = g.getCardInstanceIdsInZone("play", PLAYER_ONE);
    expect(g.asPlayerOne().getCardStrength(one!)).toBe(6);
    expect(g.asPlayerOne().getCardStrength(two!)).toBe(6);
    expect(g.asPlayerOne().challenge(one!, defender)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(one!, { targets: [bystander] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(bystander)).toBe(6);
    expect(g.asPlayerOne().isExerted(two!)).toBe(false);
  });
  it("player two uses its own drop bonus and controls Twin Blades damage", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: defender, exerted: true }, bystander, wasabiCalledIntoBattle], deck: 6 },
      { play: [wasabiCalledIntoBattle], inkDrops: 1, deck: 6 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const own = g.findCardInstanceId(wasabiCalledIntoBattle, "play", PLAYER_TWO);
    const enemy = g.findCardInstanceId(wasabiCalledIntoBattle, "play", PLAYER_ONE);
    expect(g.asPlayerTwo().getCardStrength(own)).toBe(6);
    expect(g.asPlayerOne().getCardStrength(enemy)).toBe(4);
    expect(g.asPlayerTwo().challenge(own, defender)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(defender)).toBe(6);
    expect(g.asPlayerTwo().getDamage(own)).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(own, { targets: [bystander] }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(own, { targets: [bystander] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(bystander)).toBe(6);
    expect(g.asPlayerOne().getDamage(enemy)).toBe(0);
    expect(g.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
  it("no remaining character target resolves with no additional damage", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wasabi] },
      { play: [{ card: cheap, exerted: true }] },
    );
    expect(g.asPlayerOne().challenge(wasabi, cheap)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(cheap)).toBe("discard");
    if (g.asPlayerOne().getBagCount() > 0)
      expect(g.asPlayerOne().resolvePendingByCard(wasabi)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.asPlayerOne().getDamage(wasabi)).toBe(cheap.strength);
  });
});
