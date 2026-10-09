import { buildActivityFeed } from "../../simulator/panels/event-log-presentation.js";
import { describe, expect, it } from "bun:test";

import {
  LorcanaMultiplayerSimulatorAdapter,
  selectFallbackMoveLogWindow,
} from "./lorcana-multiplayer-simulator-adapter.js";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import {
  madamMimResourcefulTrickster,
  miguelRiveraPromisingMusician,
  merlinsShopAndSmithyMagicalMarket,
  goGoTomagoExtremeTester,
  hiroHamadaVersatileInventor,
  mickeyMouseBestInTown,
  koslovImposingEnforcer,
  tadashiHamadaMakingWaves,
  fruFruVipGuest,
} from "@tcg/lorcana-cards/cards/014";

import { distract } from "@tcg/lorcana-cards/cards/003";
import { motherKnowsBest } from "@tcg/lorcana-cards/cards/001";

describe("selectFallbackMoveLogWindow", () => {
  it("aligns fallback logs to the returned move-history window", () => {
    expect(selectFallbackMoveLogWindow(["a", "b", "c", "d"], 4, 2)).toEqual(["c", "d"]);
  });

  it("returns the full fallback list when the limit exceeds history length", () => {
    expect(selectFallbackMoveLogWindow(["a", "b"], 2, 50)).toEqual(["a", "b"]);
  });
});

describe("automatic ability logs", () => {
  it("shows Mickey's drop reward separately from the next player's ready step", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: mickeyMouseBestInTown, exerted: true }], deck: 6 },
      { play: [{ card: koslovImposingEnforcer, exerted: true }], deck: 6 },
    );
    const adapter = new LorcanaMultiplayerSimulatorAdapter(engine);
    try {
      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      for (const view of ["playerOne", "playerTwo"] as const) {
        const logs = adapter.getMoveLog(50, view);
        expect(logs.map((log) => log.moveId)).toEqual(["passTurn", "resolveBag", "turnStart"]);
        const reward = logs[1]?.typedLogEntry;
        expect(
          reward && "public" in reward
            ? reward.public.filter((message) => message.key === "lorcana.outcome.inkDropsGained")
            : [],
        ).toHaveLength(2);
        expect(
          reward && "public" in reward
            ? reward.public.some((message) => message.key === "lorcana.outcome.cardReadied")
            : true,
        ).toBe(false);
        const ready = logs[2];
        expect(ready?.actorSide).toBe("playerTwo");
        expect(ready?.turnNumber).toBe(2);
        expect(
          ready?.typedLogEntry && "public" in ready.typedLogEntry
            ? ready.typedLogEntry.public.map((message) => message.key)
            : [],
        ).toContain("lorcana.outcome.cardReadied");
      }
    } finally {
      adapter.dispose();
      engine.dispose();
    }
  });
  it("maps the internal ink command and keeps both viewers' later turn logs usable", () => {
    const card = createMockCharacter({
      id: "adapter-ink",
      name: "Ink Character",
      cost: 1,
      inkable: true,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [card], deck: 3 },
      { deck: 3 },
    );
    const adapter = new LorcanaMultiplayerSimulatorAdapter(engine);
    try {
      expect(engine.asPlayerOne().putIntoInkwell(PLAYER_ONE, card)).toBeSuccessfulCommand();
      for (const view of ["playerOne", "playerTwo"] as const) {
        expect(adapter.getMoveLog(50, view).map((entry) => entry.moveId)).toEqual([
          "putCardIntoInkwell",
        ]);
      }
      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(adapter.getMoveLog(1, "playerOne")[0]?.moveId).toBe("passTurn");
      expect(adapter.getMoveLog(1, "playerTwo")[0]?.moveId).toBe("passTurn");
    } finally {
      adapter.dispose();
      engine.dispose();
    }
  });
  it("shows Mim's automatic Upper Hand draw after her play and keeps the next move aligned", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [madamMimResourcefulTrickster],
        inkwell: 20,
        inkDrops: 3,
        deck: 6,
      },
      { deck: 6 },
    );
    const adapter = new LorcanaMultiplayerSimulatorAdapter(engine);
    try {
      expect(
        engine.asPlayerOne().playCard(madamMimResourcefulTrickster, { inkDrops: 3 }),
      ).toBeSuccessfulCommand();
      const logs = adapter.getMoveLog(50, "playerOne");
      expect(logs.map((entry) => entry.moveId)).toEqual(["playCard", "resolveBag"]);
      const drawLog = logs[1]?.typedLogEntry;
      expect(drawLog && "public" in drawLog ? drawLog.public : undefined).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: "lorcana.bag.resolve.completed.named",
            values: expect.objectContaining({ abilityName: "UPPER HAND" }),
          }),
          expect.objectContaining({
            key: "lorcana.outcome.cardsDrawn",
            values: expect.objectContaining({ amount: 2 }),
          }),
        ]),
      );
      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(adapter.getMoveLog(1, "playerOne")[0]?.moveId).toBe("passTurn");
    } finally {
      adapter.dispose();
      engine.dispose();
    }
  });
});

describe("alternate play-cost logs", () => {
  it("shows a sung song and Miguel's automatic lore without duplicate command rows", () => {
    const song = createMockSong({
      id: "adapter-song",
      name: "Adapter Song",
      cost: 2,
      text: "A song.",
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [song],
        play: [miguelRiveraPromisingMusician],
        deck: 6,
      },
      { deck: 6 },
    );
    const adapter = new LorcanaMultiplayerSimulatorAdapter(engine);
    try {
      expect(
        engine.asPlayerOne().singSong(song, miguelRiveraPromisingMusician),
      ).toBeSuccessfulCommand();
      const logs = adapter.getMoveLog(50, "playerOne");
      expect(logs.map((entry) => entry.moveId)).toEqual(["playCard", "resolveBag"]);
      expect(logs[0]?.typedLogEntry).toBeDefined();
      expect(logs[1]?.title).toContain("Crowd Pleaser");
      expect(engine.getLore("player_one")).toBe(1);
      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(adapter.getMoveLog(1, "playerOne")[0]?.moveId).toBe("passTurn");
    } finally {
      adapter.dispose();
      engine.dispose();
    }
  });
});

describe("location movement logs", () => {
  it("normalizes movement logs and shows the Market reward only on the first move", () => {
    const first = createMockCharacter({
      id: "adapter-first-traveler",
      name: "First Traveler",
      cost: 2,
    });
    const second = createMockCharacter({
      id: "adapter-second-traveler",
      name: "Second Traveler",
      cost: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [first, second, merlinsShopAndSmithyMagicalMarket], inkwell: 4, deck: 6 },
      { deck: 6 },
    );
    const adapter = new LorcanaMultiplayerSimulatorAdapter(engine);
    try {
      expect(
        engine.asPlayerOne().moveCharacterToLocation(first, merlinsShopAndSmithyMagicalMarket),
      ).toBeSuccessfulCommand();
      expect(adapter.getMoveLog(50, "playerOne").map((entry) => entry.moveId)).toEqual([
        "moveCharacterToLocation",
        "resolveBag",
      ]);
      expect(
        engine.asPlayerOne().moveCharacterToLocation(second, merlinsShopAndSmithyMagicalMarket),
      ).toBeSuccessfulCommand();
      const logs = adapter.getMoveLog(50, "playerOne");
      expect(logs.map((entry) => entry.moveId)).toEqual([
        "moveCharacterToLocation",
        "resolveBag",
        "moveCharacterToLocation",
      ]);
      expect(logs[1]?.title).toContain("Open for Business");
      expect(logs[1]?.title).toContain("Drew 1 card(s)");
      expect(logs[1]?.title).toContain("gained 1 lore");
      expect(engine.getLore("player_one")).toBe(1);
      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(adapter.getMoveLog(1, "playerOne")[0]?.moveId).toBe("passTurn");
    } finally {
      adapter.dispose();
      engine.dispose();
    }
  });
});

describe("deferred challenge logs", () => {
  it("shows one actual damage exchange and Go Go's drop after a fatal challenge", () => {
    const attacker = createMockCharacter({
      id: "adapter-gogo-attacker",
      name: "Attacker",
      cost: 2,
      strength: 1,
      willpower: 4,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hiroHamadaVersatileInventor],
        inkwell: 3,
        play: [{ card: goGoTomagoExtremeTester, exerted: true }],
        deck: 6,
      },
      { play: [attacker], deck: 6 },
    );
    const adapter = new LorcanaMultiplayerSimulatorAdapter(engine);
    try {
      expect(engine.asPlayerOne().playCard(hiroHamadaVersatileInventor)).toBeSuccessfulCommand();
      expect(
        engine
          .asPlayerOne()
          .resolvePendingByCard(hiroHamadaVersatileInventor, { resolveOptional: false }),
      ).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        engine.asPlayerTwo().challenge(attacker, goGoTomagoExtremeTester),
      ).toBeSuccessfulCommand();
      engine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });
      const logs = adapter.getMoveLog(50, "playerOne");
      expect(logs.map((row) => [row.moveId, row.turnNumber])).toEqual([
        ["playCard", 1],
        ["resolveBag", 1],
        ["passTurn", 1],
        ["challenge", 2],
        ["resolveBag", 2],
      ]);
      expect(
        buildActivityFeed(logs, [], "playerOne").flatMap((group) =>
          group.kind === "event-group" ? group.rows.map((row) => row.id) : [],
        ),
      ).toEqual(logs.map((row) => row.id));
      const entry = logs.findLast((entry) => entry.moveId === "resolveBag")?.typedLogEntry;
      expect(
        entry && "public" in entry
          ? entry.public.filter((message) => message.key === "lorcana.outcome.combatDamage")
          : [],
      ).toEqual([
        expect.objectContaining({
          values: expect.objectContaining({ attackerDamage: 1, defenderDamage: 2 }),
        }),
      ]);
      expect(logs.findLast((entry) => entry.moveId === "resolveBag")?.title).toContain(
        "gained 1 ink drop",
      );
      expect(engine.asPlayerOne().getCardZone(goGoTomagoExtremeTester)).toBe("discard");
    } finally {
      adapter.dispose();
      engine.dispose();
    }
  });
});

describe("confirmed undo logs", () => {
  it("shows a real restored checkpoint in both views and preserves later command order", () => {
    const card = createMockCharacter({ id: "undo-log-character", name: "Undo Character", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [card], inkwell: 1 },
      { deck: 6 },
    );
    const adapter = new LorcanaMultiplayerSimulatorAdapter(engine);
    try {
      expect(engine.asPlayerOne().playCard(card)).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().undo()).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getCardZone(card)).toBe("hand");
      expect(engine.asPlayerOne().getAvailableInk("player_one")).toBe(1);
      for (const view of ["playerOne", "playerTwo"] as const) {
        const rows = adapter.getMoveLog(50, view);
        expect(rows.map((row) => row.moveId)).toEqual(["playCard", "undo"]);
        expect(rows[1]?.params?.restoredCheckpointStateID).toBeNumber();
        expect(rows[1]?.title).toBe("Undo");
      }
      expect(engine.asPlayerOne().playCard(card)).toBeSuccessfulCommand();
      expect(adapter.getMoveLog(50, "playerOne").map((row) => row.moveId)).toEqual([
        "playCard",
        "undo",
        "playCard",
      ]);
    } finally {
      adapter.dispose();
      engine.dispose();
    }
  });
});

it("retains public play and return names after cards become hidden without exposing private draws", () => {
  const secret = createMockCharacter({ id: "private-future", name: "Private Future", cost: 1 });
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [tadashiHamadaMakingWaves, motherKnowsBest, distract],
      inkwell: 10,
      deck: [secret, secret],
    },
    { play: [fruFruVipGuest], deck: 6 },
  );
  const adapter = new LorcanaMultiplayerSimulatorAdapter(engine);
  try {
    const tadashi = engine.findCardInstanceId(tadashiHamadaMakingWaves, "hand", PLAYER_ONE)!;
    expect(engine.asPlayerOne().playCard(tadashi)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().playCard(motherKnowsBest, { targets: [tadashi] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getBoard().cards[tadashi]).toBeUndefined();
    expect(
      engine.asPlayerOne().playCard(distract, { targets: [fruFruVipGuest] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    for (const view of ["playerOne", "playerTwo", "spectator"] as const) {
      const logs = adapter.getMoveLog(50, view);
      expect(
        logs.find((log) => log.moveId === "playCard" && log.title.includes("returned to hand"))
          ?.title,
      ).toContain("Tadashi Hamada");
      expect(logs.find((log) => log.moveId === "playCard")?.title).toContain("Tadashi Hamada");
      if (view !== "playerOne")
        expect(logs.map((log) => log.title).join(" ")).not.toContain("Private Future");
    }
    expect(
      adapter
        .getMoveLog(50, "playerOne")
        .map((log) => log.title)
        .join(" "),
    ).toContain("Private Future");
  } finally {
    adapter.dispose();
  }
});
