// Rules grounding: Pirate Plane (set14-202).
// Dodge This! — When you play this item, you may deal 1 damage to chosen
// character. Barrel Roll {E}, 1 {I} — Chosen character gains Alert this turn.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { piratePlane } from "./202-pirate-plane";

const victim = createMockCharacter({
  id: "plane-victim",
  name: "Plane Victim",
  cost: 2,
  strength: 1,
  willpower: 4,
});

const attacker = createMockCharacter({
  id: "plane-attacker",
  name: "Plane Attacker",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const evasiveDefender = createMockCharacter({
  id: "plane-evasive-defender",
  name: "Evasive Defender",
  cost: 2,
  strength: 1,
  willpower: 6,
  abilities: [
    {
      id: "plane-evasive",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
});

describe("Pirate Plane", () => {
  it("Barrel Roll can target an opponent and pay its ink cost with one drop", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [piratePlane],
        inkwell: 0,
        inkDrops: 1,
        deck: [],
      },
      { play: [attacker], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(
      player.activateAbility(piratePlane, {
        ability: "Barrel Roll",
        targets: [attacker],
        inkDrops: 1,
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo()).toHaveKeyword({ card: attacker, keyword: "Alert" });
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.isExerted(piratePlane)).toBe(true);
  });

  it("Barrel Roll rejects an opposing Ward character without paying or exerting", () => {
    const ward = createMockCharacter({
      id: "plane-alert-ward",
      name: "Ward",
      cost: 2,
      abilities: [{ type: "keyword", keyword: "Ward" }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [piratePlane],
        inkwell: 1,
        deck: [],
      },
      { play: [ward], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(
      player.activateAbility(piratePlane, {
        ability: "Barrel Roll",
        targets: [ward],
      }),
    ).not.toBeSuccessfulCommand();
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(player.isExerted(piratePlane)).toBe(false);
    expect(engine.asPlayerTwo()).not.toHaveKeyword({ card: ward, keyword: "Alert" });
  });

  it("Dodge This! banishes a character when the one damage is lethal", () => {
    const fragile = createMockCharacter({
      id: "plane-fragile",
      name: "Fragile",
      cost: 1,
      willpower: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [piratePlane],
        inkwell: 3,
        deck: [],
      },
      { play: [fragile], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(player.playCard(piratePlane)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(piratePlane, {
        resolveOptional: true,
        targets: [fragile],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(fragile)).toBe("discard");
    expect(player.getCardZone(piratePlane)).toBe("play");
    expect(player.getBagCount()).toBe(0);
  });
  it("Alert does not allow challenging a ready Evasive defender", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [piratePlane, { card: attacker, isDrying: false }],
        inkwell: 1,
        deck: [],
      },
      { play: [{ card: evasiveDefender, isDrying: false }], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(
      player.activateAbility(piratePlane, { ability: "Barrel Roll", targets: [attacker] }),
    ).toBeSuccessfulCommand();
    expect(player).toHaveKeyword({ card: attacker, keyword: "Alert" });
    expect(player).not.toHaveKeyword({ card: attacker, keyword: "Evasive" });
    expect(player.challenge(attacker, evasiveDefender)).not.toBeSuccessfulCommand();
    expect(player.isExerted(attacker)).toBe(false);
    expect(engine.asPlayerTwo().getDamage(evasiveDefender)).toBe(0);
  });
  it("Barrel Roll pays one ink and exerts only the item", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [piratePlane, attacker],
      inkwell: 1,
      deck: [],
    });
    const player = engine.asPlayerOne();
    expect(
      player.activateAbility(piratePlane, { ability: "Barrel Roll", targets: [attacker] }),
    ).toBeSuccessfulCommand();
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.isExerted(piratePlane)).toBe(true);
    expect(player.isExerted(attacker)).toBe(false);
    expect(player).toHaveKeyword({ card: attacker, keyword: "Alert" });
  });

  it("Barrel Roll rejects an exerted item without paying ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: piratePlane, exerted: true }, attacker],
      inkwell: 1,
      deck: [],
    });
    const player = engine.asPlayerOne();
    expect(
      player.activateAbility(piratePlane, { ability: "Barrel Roll", targets: [attacker] }),
    ).not.toBeSuccessfulCommand();
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(player).not.toHaveKeyword({ card: attacker, keyword: "Alert" });
  });

  it("Dodge This! respects Resist and still completes the trigger", () => {
    const resistant = createMockCharacter({
      id: "plane-resistant",
      name: "Resistant",
      willpower: 4,
      cost: 2,
      abilities: [{ type: "keyword", keyword: "Resist", value: 1 }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [piratePlane],
        inkwell: 3,
        deck: [],
      },
      { play: [resistant], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(player.playCard(piratePlane)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(piratePlane, { resolveOptional: true, targets: [resistant] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getDamage(resistant)).toBe(0);
    expect(player.getBagCount()).toBe(0);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("Dodge This! rejects opposing Ward and permits a friendly Ward target", () => {
    const ward = createMockCharacter({
      id: "plane-ward",
      name: "Ward",
      willpower: 4,
      cost: 2,
      abilities: [{ type: "keyword", keyword: "Ward" }],
    });
    const friendly = createMockCharacter({
      id: "plane-friendly-ward",
      name: "Friendly Ward",
      willpower: 4,
      cost: 2,
      abilities: [{ type: "keyword", keyword: "Ward" }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [piratePlane],
        play: [friendly],
        inkwell: 3,
        deck: [],
      },
      { play: [ward], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(player.playCard(piratePlane)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(piratePlane, { resolveOptional: true, targets: [ward] }),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getDamage(ward)).toBe(0);
    expect(
      player.resolvePendingByCard(piratePlane, { resolveOptional: true, targets: [friendly] }),
    ).toBeSuccessfulCommand();
    expect(player.getDamage(friendly)).toBe(1);
  });

  it("Dodge This! — you may deal 1 damage to chosen character when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [piratePlane],
      inkwell: piratePlane.cost,
      play: [victim],
    });

    expect(testEngine.asPlayerOne().playCard(piratePlane)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(piratePlane, {
        resolveOptional: true,
        targets: [victim],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(victim)).toBe(1);
  });

  it("Dodge This! — declining deals no damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [piratePlane],
      inkwell: piratePlane.cost,
      play: [victim],
    });

    expect(testEngine.asPlayerOne().playCard(piratePlane)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(piratePlane, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(victim)).toBe(0);
  });

  it("Barrel Roll — chosen character gains Alert and can challenge Evasive this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        play: [piratePlane, { card: attacker, isDrying: false }],
      },
      {
        play: [{ card: evasiveDefender, exerted: true, isDrying: false }],
      },
    );

    // Without Alert, a non-Evasive attacker cannot challenge an Evasive
    // defender.
    expect(testEngine.asPlayerOne().challenge(attacker, evasiveDefender).success).toBe(false);

    expect(
      testEngine.asPlayerOne().activateAbility(piratePlane, {
        ability: "Barrel Roll",
        targets: [attacker],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().challenge(attacker, evasiveDefender)).toBeSuccessfulCommand();
  });

  it("Barrel Roll — the Alert expires after the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        deck: 6,
        play: [piratePlane, { card: attacker, isDrying: false }],
      },
      {
        play: [{ card: evasiveDefender, isDrying: false }],
        deck: 6,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(piratePlane, {
        ability: "Barrel Roll",
        targets: [attacker],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveKeyword({ card: attacker, keyword: "Alert" });
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).not.toHaveKeyword({ card: attacker, keyword: "Alert" });
    expect(testEngine.asPlayerOne().hasGameEnded()).toBe(false);
    // Quest through the public move to leave the Evasive defender exerted.
    expect(testEngine.asPlayerTwo().quest(evasiveDefender)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(evasiveDefender)).toBe(true);

    expect(testEngine.asPlayerOne().challenge(attacker, evasiveDefender).success).toBe(false);
  });

  it("negative — Barrel Roll requires 1 ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [piratePlane, { card: attacker, isDrying: false }],
    });

    const result = testEngine.asPlayerOne().activateAbility(piratePlane, {
      ability: "Barrel Roll",
      targets: [attacker],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(piratePlane)).toBe(false);
  });
});

it("Alert does not let a drying character challenge an exerted Evasive defender", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [piratePlane, { card: attacker, isDrying: true }], inkwell: 1, deck: 6 },
    { play: [{ card: evasiveDefender, exerted: true, isDrying: false }], deck: 6 },
  );
  const p = g.asPlayerOne();
  expect(
    p.activateAbility(piratePlane, { ability: "Barrel Roll", targets: [attacker] }),
  ).toBeSuccessfulCommand();
  expect(p).toHaveKeyword({ card: attacker, keyword: "Alert" });
  expect(p).not.toHaveKeyword({ card: attacker, keyword: "Rush" });
  expect(p.challenge(attacker, evasiveDefender)).not.toBeSuccessfulCommand();
  expect(p.isExerted(attacker)).toBe(false);
  expect(g.asPlayerTwo().getDamage(evasiveDefender)).toBe(0);
  expect(p.getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(p.isExerted(piratePlane)).toBe(true);
});

it("Player Two chooses the exact damage copy and each Plane activates independently", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [victim], deck: 6 },
    { hand: [piratePlane, piratePlane], play: [victim, victim], inkwell: 8, deck: 6 },
  );
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const p = g.asPlayerTwo();
  const hand = g
    .getCardInstanceIdsInZone("hand", "player_two")
    .filter((id) => g.getCardDefinitionId(id) === piratePlane.id);
  const victims = g
    .getCardInstanceIdsInZone("play", "player_two")
    .filter((id) => g.getCardDefinitionId(id) === victim.id);
  expect(p.playCard(hand[1]!)).toBeSuccessfulCommand();
  expect(
    p.resolvePendingByCard(hand[1]!, { resolveOptional: true, targets: [victims[1]!] }),
  ).toBeSuccessfulCommand();
  expect(p.getDamage(victims[1]!)).toBe(1);
  expect(p.getDamage(victims[0]!)).toBe(0);
  expect(g.asPlayerOne().getDamage(victim)).toBe(0);
  expect(p.playCard(hand[0]!)).toBeSuccessfulCommand();
  expect(p.resolvePendingByCard(hand[0]!, { resolveOptional: false })).toBeSuccessfulCommand();
  expect(p.getDamage(victims[1]!)).toBe(1);
  expect(p.getAvailableInk(PLAYER_TWO)).toBe(2);
  expect(
    p.activateAbility(hand[0]!, { ability: "Barrel Roll", targets: [victims[1]!] }),
  ).toBeSuccessfulCommand();
  expect(p.isExerted(hand[0]!)).toBe(true);
  expect(p.isExerted(hand[1]!)).toBe(false);
  expect(p).toHaveKeyword({ card: victims[1]!, keyword: "Alert" });
  expect(p).not.toHaveKeyword({ card: victims[0]!, keyword: "Alert" });
  expect(
    p.activateAbility(hand[1]!, { ability: "Barrel Roll", targets: [victims[0]!] }),
  ).toBeSuccessfulCommand();
  expect(p.getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(p.isExerted(hand[1]!)).toBe(true);
  expect(p).toHaveKeyword({ card: victims[0]!, keyword: "Alert" });
  expect(p.getBagCount()).toBe(0);
});

it("Barrel Roll invalid multiple targets preserve payment and exact retry", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [piratePlane, victim, attacker],
    inkwell: 1,
    deck: 6,
  });
  const p = g.asPlayerOne();
  expect(
    p.activateAbility(piratePlane, { ability: "Barrel Roll", targets: [victim, attacker] }),
  ).not.toBeSuccessfulCommand();
  expect(p.getAvailableInk(PLAYER_ONE)).toBe(1);
  expect(p.isExerted(piratePlane)).toBe(false);
  expect(p).not.toHaveKeyword({ card: victim, keyword: "Alert" });
  expect(p).not.toHaveKeyword({ card: attacker, keyword: "Alert" });
  expect(
    p.activateAbility(piratePlane, { ability: "Barrel Roll", targets: [victim] }),
  ).toBeSuccessfulCommand();
  expect(p.getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(p).toHaveKeyword({ card: victim, keyword: "Alert" });
});

it("an opposing Alert grant expires before that opponent can use it on their turn", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [piratePlane, { card: evasiveDefender, exerted: true, isDrying: false }],
      inkwell: 1,
      deck: 6,
    },
    { play: [{ card: attacker, isDrying: false }], deck: 6 },
  );
  expect(
    g.asPlayerOne().activateAbility(piratePlane, { ability: "Barrel Roll", targets: [attacker] }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerTwo()).toHaveKeyword({ card: attacker, keyword: "Alert" });
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerTwo()).not.toHaveKeyword({ card: attacker, keyword: "Alert" });
  expect(g.asPlayerTwo().challenge(attacker, evasiveDefender)).not.toBeSuccessfulCommand();
  expect(g.asPlayerTwo().isExerted(attacker)).toBe(false);
  expect(g.asPlayerOne().getDamage(evasiveDefender)).toBe(0);
});

it("no legal damage target completes play; inking a Plane causes no entry trigger", () => {
  const ward = createMockCharacter({
    id: "plane-only-ward",
    name: "Only Ward",
    cost: 1,
    abilities: [{ type: "keyword", keyword: "Ward" }],
  });
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [piratePlane, piratePlane], inkwell: 3, deck: 6 },
    { play: [ward], deck: 6 },
  );
  const p = g.asPlayerOne();
  expect(p.playCard(piratePlane)).toBeSuccessfulCommand();
  expect(p.getBagCount()).toBe(0);
  expect(g.asPlayerTwo().getDamage(ward)).toBe(0);
  expect(p.getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(
    p.ink(
      g
        .getCardInstanceIdsInZone("hand", "player_one")
        .find((id) => g.getCardDefinitionId(id) === piratePlane.id)!,
    ),
  ).toBeSuccessfulCommand();
  expect(p.getBagCount()).toBe(0);
  expect(g.asPlayerTwo().getDamage(ward)).toBe(0);
});
