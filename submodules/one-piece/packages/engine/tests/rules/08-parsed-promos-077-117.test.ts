import { beforeEach, afterEach, describe, expect, test } from "vite-plus/test";
import { getCard, getAllCards, validateDeckForFormat } from "@tcg/op-cards";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";
const ids = ["P-077", "P-091", "P-100", "P-104", "P-117"];
const originals = ids.map((id) => getCard(id).effects);
beforeEach(() => {
  for (const id of ids) {
    const card = getCard(id);
    card.effects = buildCardEffects(card.effect ?? "");
  }
});
afterEach(() => {
  ids.forEach((id, index) => {
    getCard(id).effects = originals[index];
  });
});
describe("P077 Ulti", () => {
  test("returning two DON adds one rested and readies purple Stage; payable second return does not repeat", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "EB02-010",
      character: ["P-077", "ST05-011"],
      stage: "ST04-017",
      restedDon: 6,
      donDeckCount: 4,
    });
    const stage = e.findCardInZone("south", "stage", "ST04-017");
    e.asSouth().activateMain(stage);
    e.asSouth().acceptOptional();
    const fire = () => {
      e.asSouth().activateMain(e.leader("south"));
      e.asSouth().acceptOptional();
    };
    fire();
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    e.asSouth().chooseTargets(stage);
    expect(e.getView("south").players.south.restedDon).toBe(5);
    expect(e.getView("south").players.south.stage?.rested).toBe(false);
    e.asSouth().activateMain(stage);
    e.asSouth().acceptOptional();
    e.asSouth().activateMain(e.findCardInZone("south", "character", "ST05-011"));
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.stage?.rested).toBe(true);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("zero optional ramp still permits Stage ready", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "EB02-010",
      character: ["P-077", "ST05-011"],
      stage: "ST04-017",
      restedDon: 2,
    });
    const stage = e.findCardInZone("south", "stage", "ST04-017");
    e.asSouth().activateMain(stage);
    e.asSouth().acceptOptional();
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    e.asSouth().chooseTargets(stage);
    expect(e.getView("south").players.south.restedDon).toBe(0);
    expect(e.getView("south").players.south.stage?.rested).toBe(false);
  });
  test("one DON return does not trigger", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-077", "ST34-005"], restedDon: 1 },
      { character: ["ST01-006"] },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST34-005"), e.leader("north"));
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets();
    e.asNorth().chooseBlocker();
    expect(e.getView("south").players.south.restedDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

describe("P091 Shirahoshi", () => {
  test("OnPlay filters both traits and Main grants Character-only immediate attack", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-091", "OP11-027", "OP11-026", "ST02-012"], activeDon: 4 },
      { character: [{ cardId: "ST02-012", rested: true }] },
    );
    const fish = e.findCardInZone("south", "hand", "OP11-027");
    e.asSouth().play("P-091");
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([fish]);
    e.asSouth().choosePlay(fish);
    const source = e.findCardInZone("south", "character", "P-091");
    e.asSouth().activateMain(source);
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(fish);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === source)?.rested,
    ).toBe(true);
    e.asSouth().expectFailure({ type: "attack", attackerId: fish, targetId: e.leader("north") });
    const target = e.findCardInZone("north", "character", "ST02-012");
    e.asSouth().attack(fish, target);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
  });
  test("declines optional self-rest and optional OnPlay with eligible Fish-Man Island Character", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-091", "OP11-109"], activeDon: 4 });
    e.asSouth().play("P-091");
    e.asSouth().chooseNoPlay();
    const source = e.findCardInZone("south", "character", "P-091");
    e.asSouth().activateMain(source);
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
});
describe("P100 Teach", () => {
  test("attack negates opposing Leader aura and Character Blocker until turn ends, preserving own effects", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-100", "ST01-006"] },
      { leaderCardId: "ST30-001", character: ["ST30-007", "ST01-006"], life: 4 },
    );
    expect(e.getView("north").players.north.characters[0]?.power).toBe(9000);
    e.asSouth().attack(e.findCardInZone("south", "character", "P-100"), e.leader("north"));
    expect(e.getView("north").players.north.characters[0]?.power).toBe(6000);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("north").players.north.characters[1]?.rested).toBe(false);
    e.asSouth().endTurn();
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST01-006"));
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    e.asNorth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(9000);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker(e.findCardInZone("north", "character", "ST01-006"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
  });
});

describe("p-104-shanks", () => {
  test.each(["self", "opponent"])(
    "ten field DON on %s protects selected Character from bottom-deck effect",
    (owner) => {
      const e = OnePieceTestEngine.create(
        {
          character: ["P-104"],
          activeDon: owner === "self" ? 9 : 0,
          restedDon: owner === "self" ? 1 : 0,
        },
        { hand: ["OP04-056"], activeDon: owner === "opponent" ? 10 : 6 },
        { activeSeat: "north", firstPlayer: "south" },
      );
      const id = e.findCardInZone("south", "character", "P-104");
      e.asNorth().play("OP04-056");
      e.asNorth().chooseTargets(id);
      expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(id);
      expect(e.getView("south").players.south.trash).toHaveLength(0);
    },
  );
  test("nine DON does not protect", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-104"], activeDon: 9 },
      { hand: ["OP04-056"], activeDon: 6 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().play("OP04-056");
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "P-104"));
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
  });
  test("battle KO remains possible with ten DON", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-104", rested: true }], activeDon: 10 },
      { character: [{ cardId: "P-041", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack("P-041", e.findCardInZone("south", "character", "P-104"));
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("P-104");
  });
});
describe("p-117-nami", () => {
  test("damage with DON mills last deck card and wins instead of losing", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "P-117", deck: ["P-012"], activeDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.attachDon(e.leader("south"), 1);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.deckCount).toBe(0);
    expect(e.getView("south").winner).toBe("south");
    expect(e.getView("south").status).toBe("finished");
  });
  test("declines optional damage mill and remains active", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "P-117", deck: ["P-012"], activeDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.attachDon(e.leader("south"), 1);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").status).toBe("active");
  });
  test("without DON damage cannot mill", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "P-117", deck: ["P-012"] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
  });
  test("public deck validator permits EastBlue and rejects other types", () => {
    const okay = validateDeckForFormat("standard", [
      { cardId: "P-117", quantity: 1 },
      { cardId: "OP03-044", quantity: 4 },
    ]);
    const bad = validateDeckForFormat("standard", [
      { cardId: "P-117", quantity: 1 },
      { cardId: "P-012", quantity: 4 },
    ]);
    expect(okay.rules.find((r) => r.kind === "leader-restrictions")?.passed).toBe(true);
    expect(bad.rules.find((r) => r.kind === "leader-restrictions")?.passed).toBe(false);
  });
  test("full fifty-card EastBlue deck is valid and replacing one slot with other type is invalid", () => {
    const cards = getAllCards()
      .filter(
        (c) =>
          c.cardType === "character" && c.color.includes("blue") && c.traits?.includes("East Blue"),
      )
      .slice(0, 13);
    expect(cards).toHaveLength(13);
    const deck = [
      { cardId: "P-117", quantity: 1 },
      ...cards.map((c, i) => ({ cardId: c.id, quantity: i === 12 ? 2 : 4 })),
    ];
    expect(validateDeckForFormat("standard", deck).valid).toBe(true);
    const changed = deck.map((c, i) => (i === 1 ? { cardId: "P-012", quantity: 4 } : c));
    expect(validateDeckForFormat("standard", changed).valid).toBe(false);
  });
});
