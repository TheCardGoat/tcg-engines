import { describe, expect, test } from "vite-plus/test";
import {
  buildDecisionContext,
  CyberpunkTestEngine,
  P1,
  tacticalStrategy,
  type PlayerId,
} from "@tcg/cyberpunk-engine";
import {
  welcomeToNightCityRetail6thStreetRecruits,
  welcomeToNightCityRetailAllIsLost,
  welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
  welcomeToNightCityRetailCarnageAtTheColosseum,
  welcomeToNightCityRetailChromeReverie,
  welcomeToNightCityRetailDexterDeshawnOffTheGrid,
  theHeistRetailStarterDeckDexterDeshawnOneLastChance,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
  welcomeToNightCityRetailIndustrialAssembly,
  welcomeToNightCityRetailJackedInVoodooBoy,
  theHeistRetailStarterDeckJackieWellesPourOneOutForMe,
  welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
  welcomeToNightCityRetailLaLloronaGhostOfThePast,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailPacificaNetrunner,
  welcomeToNightCityRetailSatoriSwordOfSaburo,
  welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
  welcomeToNightCityRetailMuamarReyesElCapitan,
  welcomeToNightCityRetailPeaceOffering,
  welcomeToNightCityRetailPepeNajarroWorkingDoubles,
  welcomeToNightCityRetailTheHeist,
  welcomeToNightCityRetailTowerfall,
  welcomeToNightCityRetailTrustNoOne,
  welcomeToNightCityRetailVStreetkid,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";
import { bindStrategyToDeck } from "../src/bind-deck-strategy.ts";
import { authoredBotLabDeckSpecs } from "../src/authored-decks.ts";

const filler = [
  welcomeToNightCityRetailIndustrialAssembly,
  welcomeToNightCityRetailIndustrialAssembly,
];

function bind(id: string) {
  const spec = authoredBotLabDeckSpecs.find((deck) => deck.id === id);
  if (!spec) throw new Error(id);
  const mainDeck: string[] = [];
  for (const [name, count] of Object.entries(spec.mainDeck)) {
    for (let copy = 0; copy < count; copy += 1) mainDeck.push(name);
  }
  return bindStrategyToDeck(tacticalStrategy, { legends: [...spec.legends], mainDeck });
}

function setTurn(engine: CyberpunkTestEngine, turn: number) {
  engine.getState().G.turnMetadata.turnNumber = turn;
}

function markSold(engine: CyberpunkTestEngine, playerId: PlayerId) {
  const player = engine.getState().G.players[playerId as string];
  if (!player) throw new Error("missing player");
  player.soldThisTurn = true;
}

function spendLegends(engine: CyberpunkTestEngine, playerId: PlayerId, count: number) {
  const ids = engine.getState().G.players[playerId as string]?.zones.legendArea ?? [];
  for (let index = 0; index < count; index += 1) {
    const card = engine.getState().G.cardIndex[ids[index] as string];
    if (card) card.meta.spent = true;
  }
}

function hostName(engine: CyberpunkTestEngine, playerId: PlayerId, gearName: string): string {
  const zones = engine.getFilteredView(playerId).players[playerId as string]?.zones;
  if (!zones) return "";
  for (const zone of Object.values(zones)) {
    if (!Array.isArray(zone)) continue;
    const gear = zone.find((card) => card.cardName === gearName);
    if (gear?.attachedToId) return nameOf(engine, playerId, gear.attachedToId);
  }
  return "";
}

function spendable(engine: CyberpunkTestEngine, playerId: PlayerId): number {
  return engine.getFilteredView(playerId).players[playerId as string]?.availableEddies ?? -1;
}

function nameOf(engine: CyberpunkTestEngine, playerId: PlayerId, id: string): string {
  const view = engine.getFilteredView(playerId);
  for (const zone of Object.values(view.players[playerId as string]?.zones ?? {})) {
    if (!Array.isArray(zone)) continue;
    const card = zone.find((candidate) => candidate.instanceId === id);
    if (card?.cardName) return card.cardName;
  }
  return id;
}

function actedCardId(args: Record<string, unknown> | undefined): string {
  const targetIds = args?.targetIds;
  const targetId = Array.isArray(targetIds) && typeof targetIds[0] === "string" ? targetIds[0] : "";
  return String(args?.cardId ?? args?.legendId ?? args?.attackerId ?? targetId);
}

function act(engine: CyberpunkTestEngine, strategy: ReturnType<typeof bind>, playerId: PlayerId) {
  const decision = strategy.decideAction(
    buildDecisionContext(engine.getLocalEngine(), playerId, () => 0),
  );
  expect(decision.kind).toBe("command");
  if (decision.kind !== "command") throw new Error("not a command");
  const id = actedCardId(decision.args);
  const label = id ? nameOf(engine, playerId, id) : "";
  const result = engine.getLocalEngine().processCommand(
    {
      commandID: `curve-${engine.getState().G.turnMetadata.turnNumber}-${decision.move}`,
      move: decision.move,
      input: decision.args ? { args: decision.args } : undefined,
    },
    playerId,
  );
  expect(result.success, result.success ? "" : result.error).toBe(true);
  return { decision, label };
}

function steps(
  engine: CyberpunkTestEngine,
  strategy: ReturnType<typeof bind>,
  playerId: PlayerId,
  limit = 8,
) {
  const taken: Array<{ move: string; name: string }> = [];
  for (let index = 0; index < limit; index += 1) {
    const actor = engine.getActivePlayerId();
    if (engine.getPrompt(actor).status === "idle") break;
    const { decision, label } = act(engine, strategy, actor);
    if (actor === playerId) taken.push({ move: decision.move, name: label });
    if (decision.move === "passPhase") break;
  }
  return taken;
}

describe("spendable €$ ladder", () => {
  test("sell every turn reaches 2 on the play, 4 on the draw, then 5, 6, 7, and 8", () => {
    const sellFuel = Array.from({ length: 40 }, () => welcomeToNightCityRetailIndustrialAssembly);
    const legends = [
      welcomeToNightCityRetailVStreetkid,
      welcomeToNightCityRetailMuamarReyesElCapitan,
      welcomeToNightCityRetailDexterDeshawnOffTheGrid,
    ];
    const engine = CyberpunkTestEngine.createWithFixture(
      { deck: sellFuel, legendArea: legends },
      { deck: [...sellFuel], legendArea: [...legends] },
      { seed: "curve-ladder", skipSetup: false },
    );
    const first = engine.getActivePlayerId();
    const second = engine.getOpponentOf(first);
    expect(engine.getSpentLegends(first)).toHaveLength(2);
    expect(engine.getSpentLegends(second)).toHaveLength(0);
    engine.keepHand({ as: first });
    engine.keepHand({ as: second });
    expect(engine.getPhase()).toBe("main");
    expect(engine.getSpentLegends(first)).toHaveLength(2);

    const sell = (playerId: PlayerId) => {
      const hand = engine.getFilteredView(playerId).players[playerId as string]?.zones.hand;
      const card = Array.isArray(hand) ? hand.find((candidate) => candidate.hasSellTag) : undefined;
      expect(card?.instanceId).toBeTruthy();
      engine.sellCard(card!.instanceId, { as: playerId });
    };

    const playLadder: number[] = [];
    const drawLadder: number[] = [];
    for (let own = 0; own < 5; own += 1) {
      sell(first);
      playLadder.push(spendable(engine, first));
      engine.passPhase({ as: first });
      sell(second);
      drawLadder.push(spendable(engine, second));
      engine.passPhase({ as: second });
    }
    expect(playLadder).toEqual([2, 5, 6, 7, 8]);
    expect(drawLadder).toEqual([4, 5, 6, 7, 8]);
  });
});

describe("RRY prompt lines", () => {
  for (const deckId of [
    "authored-rry-llorona-steel-dragon",
    "authored-rry-detonate-gear-curve",
  ] as const) {
    test(`${deckId} on the play sells then Calls the one ready Legend`, () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [welcomeToNightCityRetailCarnageAtTheColosseum],
          legendArea: [
            { card: welcomeToNightCityRetailVStreetkid, faceDown: true, spent: true },
            { card: welcomeToNightCityRetailDexterDeshawnOffTheGrid, faceDown: true, spent: true },
            { card: welcomeToNightCityRetailMuamarReyesElCapitan, faceDown: true, spent: false },
          ],
          eddies: 0,
          deck: filler,
        },
        { eddies: 0, deck: filler },
      );
      setTurn(engine, 1);
      spendLegends(engine, P1, 2);
      const taken = steps(engine, bind(deckId), P1);
      expect(taken[0]).toEqual({ move: "sellCard", name: "Carnage at the Colosseum" });
      expect(taken[1]).toEqual({ move: "callLegend", name: "Muamar Reyes" });
      expect(taken.some((step) => step.move === "playCard")).toBe(false);
    });

    test(`${deckId} on the draw Calls Muamar or Dexter and plays All is Lost`, () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [welcomeToNightCityRetailIndustrialAssembly, welcomeToNightCityRetailAllIsLost],
          legendArea: [
            { card: welcomeToNightCityRetailVStreetkid, faceDown: true, spent: false },
            { card: welcomeToNightCityRetailMuamarReyesElCapitan, faceDown: true, spent: false },
            { card: welcomeToNightCityRetailDexterDeshawnOffTheGrid, faceDown: true, spent: false },
          ],
          eddies: 0,
          deck: filler,
        },
        { eddies: 0, deck: filler },
      );
      setTurn(engine, 2);
      const taken = steps(engine, bind(deckId), P1, 4);
      expect(taken.some((step) => step.move === "sellCard")).toBe(true);
      const call = taken.find((step) => step.move === "callLegend");
      expect(call?.name === "Muamar Reyes" || call?.name === "Dexter DeShawn").toBe(true);
      expect(taken.some((step) => step.move === "playCard" && step.name === "All is Lost")).toBe(
        true,
      );
      expect(taken.some((step) => step.name === "V")).toBe(false);
    });
  }
});

describe("BBG prompt lines", () => {
  test("does not sell Chrome, Trust No One, or Peace Offering when a spare is legal", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailChromeReverie,
          welcomeToNightCityRetailTrustNoOne,
          welcomeToNightCityRetailPeaceOffering,
          welcomeToNightCityRetailFloorIt,
        ],
        legendArea: [
          {
            card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
            faceDown: true,
            spent: true,
          },
          {
            card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
            faceDown: true,
            spent: true,
          },
          {
            card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe,
            faceDown: true,
            spent: false,
          },
        ],
        gigArea: [3],
        eddies: 0,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 1);
    const first = steps(engine, bind("authored-bbg-towerfall-control"), P1, 1)[0];
    expect(first?.move).toBe("sellCard");
    expect(first?.name).toBe("Floor It");
  });

  test("on the play plays Trust No One and does not also Call", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailTrustNoOne],
        legendArea: [
          {
            card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
            faceDown: true,
            spent: true,
          },
          {
            card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
            faceDown: true,
            spent: true,
          },
          {
            card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe,
            faceDown: true,
            spent: false,
          },
        ],
        gigArea: [3],
        eddies: 0,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 1);
    const taken = steps(engine, bind("authored-bbg-towerfall-control"), P1, 4);
    expect(taken[0]).toEqual({ move: "sellCard", name: "Floor It" });
    expect(taken[1]?.move).toBe("playCard");
    expect(taken[1]?.name).toBe("Trust No One");
    expect(taken.some((step) => step.move === "callLegend")).toBe(false);
  });

  test("on the draw Calls, plays Jacked-In, and sets the Gig to a min", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailFloorIt,
          welcomeToNightCityRetailJackedInVoodooBoy,
          welcomeToNightCityRetailTrustNoOne,
        ],
        legendArea: [
          { card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, faceDown: true },
          { card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, faceDown: true },
          { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: true },
        ],
        gigArea: [3],
        eddies: 0,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 2);
    const strategy = bind("authored-bbg-towerfall-control");
    const taken = steps(engine, strategy, P1, 8);
    expect(taken.some((step) => step.move === "sellCard" && step.name === "Floor It")).toBe(true);
    expect(taken.some((step) => step.move === "callLegend")).toBe(true);
    expect(
      taken.some((step) => step.move === "playCard" && step.name === "Jacked-In Voodoo Boy"),
    ).toBe(true);
    const gig = engine.getFilteredView(P1).players.p1?.zones.gigArea;
    const face = Array.isArray(gig) ? (gig[0]?.effectivePower ?? gig[0]?.power) : undefined;
    expect(
      taken.some((step) => step.move === "playCard" && step.name === "Trust No One") || face === 1,
    ).toBe(true);
  });
});

describe("later curve turns", () => {
  test("turn 2 plays All is Lost when no curve unit is in hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAllIsLost, welcomeToNightCityRetailIndustrialAssembly],
        legendArea: [
          { card: welcomeToNightCityRetailVStreetkid, faceDown: true },
          { card: welcomeToNightCityRetailMuamarReyesElCapitan, faceDown: true },
          { card: welcomeToNightCityRetailDexterDeshawnOffTheGrid, faceDown: true },
        ],
        eddies: 1,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 3);
    const taken = steps(engine, bind("authored-rry-llorona-steel-dragon"), P1, 3);
    expect(taken.some((step) => step.name === "All is Lost")).toBe(true);
  });

  test("turn 5 equips Mantis on Meredith and does not Go Solo", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMantisBlades, welcomeToNightCityRetailZetatechFaceplate],
        field: [{ card: welcomeToNightCityRetailMeredithStoutStoneColdCorpo, hasLag: false }],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false, spent: false }],
        eddies: 4,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 9);
    const taken = steps(engine, bind("authored-rry-llorona-steel-dragon"), P1, 4);
    expect(taken.some((step) => step.move === "goSolo")).toBe(false);
    const mantis = taken.find((step) => step.name === "Mantis Blades");
    expect(mantis?.move).toBe("playCard");
    expect(hostName(engine, P1, "Mantis Blades")).toBe("Meredith Stout");
  });

  test("turn 2 does not attack with Jacked-In", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailJackedInVoodooBoy, welcomeToNightCityRetailFloorIt],
        legendArea: [
          { card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, faceDown: true },
          { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: true },
          { card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, faceDown: true },
        ],
        eddies: 1,
        deck: filler,
      },
      {
        field: [{ card: welcomeToNightCityRetail6thStreetRecruits, hasLag: false }],
        eddies: 0,
        deck: filler,
      },
    );
    setTurn(engine, 3);
    const taken = steps(engine, bind("authored-bbg-towerfall-control"), P1, 5);
    expect(
      taken.some((step) => step.name === "Jacked-In Voodoo Boy" && step.move === "playCard"),
    ).toBe(true);
    expect(
      taken.some(
        (step) =>
          step.name === "Jacked-In Voodoo Boy" &&
          (step.move === "attackUnit" || step.move === "attackRival"),
      ),
    ).toBe(false);
  });

  test("turn 4 plays Pepe and attacks only when a value-pair would ready Alt and Jackie", () => {
    const mercs = [
      {
        card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
        faceDown: false,
        spent: true,
      },
      { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false, spent: true },
      { card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, faceDown: false },
    ];
    const pair = [
      { dieType: "d6" as const, faceValue: 2 },
      { dieType: "d8" as const, faceValue: 2 },
    ];
    const played = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPepeNajarroWorkingDoubles],
        legendArea: mercs,
        gigArea: pair,
        eddies: 4,
        deck: filler,
      },
      { gigArea: [{ dieType: "d6", faceValue: 1 }], eddies: 0, deck: filler },
    );
    setTurn(played, 7);
    const playedLine = steps(played, bind("authored-bbg-towerfall-control"), P1, 3);
    expect(
      playedLine.some((step) => step.move === "playCard" && step.name === "Pepe Najarro"),
    ).toBe(true);

    const attacking = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailPepeNajarroWorkingDoubles, hasLag: false, spent: false },
        ],
        legendArea: mercs,
        gigArea: pair,
        eddies: 0,
        deck: filler,
      },
      { gigArea: [{ dieType: "d6", faceValue: 1 }], eddies: 0, deck: filler },
    );
    setTurn(attacking, 7);
    spendLegends(attacking, P1, 2);
    const attackLine = steps(attacking, bind("authored-bbg-towerfall-control"), P1, 3);
    expect(
      attackLine.some(
        (step) =>
          step.name === "Pepe Najarro" &&
          (step.move === "attackUnit" || step.move === "attackRival"),
      ),
    ).toBe(true);

    const unpaired = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailPepeNajarroWorkingDoubles, hasLag: false, spent: false },
        ],
        legendArea: mercs,
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
        eddies: 0,
        deck: filler,
      },
      { gigArea: [{ dieType: "d6", faceValue: 1 }], eddies: 0, deck: filler },
    );
    setTurn(unpaired, 7);
    const quiet = steps(unpaired, bind("authored-bbg-towerfall-control"), P1, 3);
    expect(
      quiet.some(
        (step) =>
          step.name === "Pepe Najarro" &&
          (step.move === "attackUnit" || step.move === "attackRival"),
      ),
    ).toBe(false);
  });

  test("turn 5 plays Lizzy when Chrome Reverie is in hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
          welcomeToNightCityRetailChromeReverie,
        ],
        legendArea: [
          { card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, faceDown: true },
          { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: true },
          { card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, faceDown: true },
        ],
        eddies: 4,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 9);
    const taken = steps(engine, bind("authored-bbg-towerfall-control"), P1, 6);
    expect(taken.some((step) => step.move === "playCard" && step.name === "Lizzy Wizzy")).toBe(
      true,
    );
    expect(taken.some((step) => step.name === "Chrome Reverie")).toBe(true);
  });
});

const rivalBody = {
  field: [{ card: welcomeToNightCityRetailPacificaNetrunner, hasLag: false, spent: true }],
  gigArea: [{ dieType: "d6" as const, faceValue: 1 }],
  eddies: 0,
  deck: filler,
};
const bbgLegends = [
  { card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, faceDown: true },
  { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: true },
  { card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, faceDown: true },
];

describe("remaining curve branches", () => {
  test("RRY on the draw plays The Heist with the Call", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailIndustrialAssembly, welcomeToNightCityRetailTheHeist],
        legendArea: [
          { card: welcomeToNightCityRetailVStreetkid, faceDown: true },
          { card: welcomeToNightCityRetailMuamarReyesElCapitan, faceDown: true },
          { card: welcomeToNightCityRetailDexterDeshawnOffTheGrid, faceDown: true },
        ],
        eddies: 0,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 2);
    const taken = steps(engine, bind("authored-rry-llorona-steel-dragon"), P1, 6);
    expect(taken.some((step) => step.move === "sellCard")).toBe(true);
    const call = taken.find((step) => step.move === "callLegend");
    expect(call?.name === "Muamar Reyes" || call?.name === "Dexter DeShawn").toBe(true);
    expect(taken.some((step) => step.move === "playCard" && step.name === "The Heist")).toBe(true);
    expect(taken.some((step) => step.name === "V")).toBe(false);
  });

  test("RRY turn 2 plays The Heist when a Gig shows 2 and no blade is in hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTheHeist, welcomeToNightCityRetailLaLloronaGhostOfThePast],
        legendArea: [
          { card: welcomeToNightCityRetailVStreetkid, faceDown: true },
          { card: welcomeToNightCityRetailMuamarReyesElCapitan, faceDown: true },
          { card: welcomeToNightCityRetailDexterDeshawnOffTheGrid, faceDown: true },
        ],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
        eddies: 5,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 3);
    markSold(engine, P1);
    const taken = steps(engine, bind("authored-rry-llorona-steel-dragon"), P1, 4);
    expect(taken.some((step) => step.move === "playCard" && step.name === "The Heist")).toBe(true);
  });

  test("RRY turn 3 plays La Llorona", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailLaLloronaGhostOfThePast],
        legendArea: [{ card: welcomeToNightCityRetailMuamarReyesElCapitan, faceDown: true }],
        eddies: 6,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 5);
    const taken = steps(engine, bind("authored-rry-llorona-steel-dragon"), P1, 3);
    expect(taken.some((step) => step.move === "playCard" && step.name === "La Llorona")).toBe(true);
  });

  test("RRY turn 3 plays Dexter DeShawn: One Last Chance", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [theHeistRetailStarterDeckDexterDeshawnOneLastChance],
        legendArea: [{ card: welcomeToNightCityRetailMuamarReyesElCapitan, faceDown: true }],
        eddies: 6,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 5);
    const taken = steps(engine, bind("authored-rry-llorona-steel-dragon"), P1, 3);
    expect(taken.some((step) => step.move === "playCard" && step.name === "Dexter DeShawn")).toBe(
      true,
    );
  });

  test("RRY turn 4 plays Meredith or 6th Street", () => {
    for (const card of [
      welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
      welcomeToNightCityRetail6thStreetRecruits,
    ]) {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [card],
          legendArea: [{ card: welcomeToNightCityRetailMuamarReyesElCapitan, faceDown: true }],
          eddies: 7,
          deck: filler,
        },
        { eddies: 0, deck: filler },
      );
      setTurn(engine, 7);
      const taken = steps(engine, bind("authored-rry-llorona-steel-dragon"), P1, 3);
      expect(
        taken.some(
          (step) =>
            step.move === "playCard" &&
            (step.name === "Meredith Stout" || step.name === "6th Street Recruits"),
        ),
      ).toBe(true);
    }
  });

  test("RRY turn 5 equips Faceplate on La Llorona and Satori on 6th Street", () => {
    const faceplate = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailZetatechFaceplate],
        field: [{ card: welcomeToNightCityRetailLaLloronaGhostOfThePast, hasLag: false }],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
        eddies: 4,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(faceplate, 9);
    steps(faceplate, bind("authored-rry-llorona-steel-dragon"), P1, 3);
    expect(hostName(faceplate, P1, "Zetatech Faceplate")).toBe("La Llorona");

    const satori = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSatoriSwordOfSaburo],
        field: [{ card: welcomeToNightCityRetail6thStreetRecruits, hasLag: false }],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
        eddies: 4,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(satori, 9);
    steps(satori, bind("authored-rry-llorona-steel-dragon"), P1, 3);
    expect(hostName(satori, P1, "Satori")).toBe("6th Street Recruits");
  });

  test("BBG on the play Calls when no Gig shows 2–4", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt],
        legendArea: bbgLegends,
        gigArea: [{ dieType: "d6", faceValue: 1 }],
        eddies: 0,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 1);
    const taken = steps(engine, bind("authored-bbg-towerfall-control"), P1, 4);
    expect(taken[0]).toEqual({ move: "sellCard", name: "Floor It" });
    expect(taken.some((step) => step.move === "callLegend")).toBe(true);
    expect(taken.some((step) => step.name === "Trust No One")).toBe(false);
  });

  test("BBG on the draw without Jacked-In uses the on-the-play line", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailTrustNoOne],
        legendArea: bbgLegends,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        eddies: 0,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 2);
    const taken = steps(engine, bind("authored-bbg-towerfall-control"), P1, 6);
    expect(taken.some((step) => step.move === "sellCard" && step.name === "Floor It")).toBe(true);
    expect(taken.some((step) => step.move === "playCard" && step.name === "Trust No One")).toBe(
      true,
    );
    expect(taken.some((step) => step.move === "callLegend")).toBe(false);
    expect(taken.some((step) => step.name === "Jacked-In Voodoo Boy")).toBe(false);
  });

  test("BBG turn 2 does not play or attack a second Jacked-In", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailJackedInVoodooBoy],
        field: [{ card: welcomeToNightCityRetailJackedInVoodooBoy, hasLag: false, spent: false }],
        legendArea: bbgLegends,
        eddies: 5,
        deck: filler,
      },
      rivalBody,
    );
    setTurn(engine, 3);
    markSold(engine, P1);
    const taken = steps(engine, bind("authored-bbg-towerfall-control"), P1, 3);
    expect(
      taken.some((step) => step.move === "playCard" && step.name === "Jacked-In Voodoo Boy"),
    ).toBe(false);
    expect(
      taken.some(
        (step) =>
          step.name === "Jacked-In Voodoo Boy" &&
          (step.move === "attackUnit" || step.move === "attackRival"),
      ),
    ).toBe(false);
  });

  test("BBG turn 3 plays Peace Offering when there is no value-pair, then attacks", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPeaceOffering],
        field: [{ card: welcomeToNightCityRetailJackedInVoodooBoy, hasLag: false, spent: false }],
        legendArea: bbgLegends,
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
        eddies: 6,
        deck: filler,
      },
      rivalBody,
    );
    setTurn(engine, 5);
    markSold(engine, P1);
    const taken = steps(engine, bind("authored-bbg-towerfall-control"), P1, 8);
    expect(taken.some((step) => step.move === "playCard" && step.name === "Peace Offering")).toBe(
      true,
    );
    expect(
      taken.some(
        (step) =>
          step.name === "Jacked-In Voodoo Boy" &&
          (step.move === "attackUnit" || step.move === "attackRival"),
      ),
    ).toBe(true);
  });

  test("BBG turn 3 plays Trust No One when a value-pair exists, then attacks", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTrustNoOne, welcomeToNightCityRetailPeaceOffering],
        field: [{ card: welcomeToNightCityRetailJackedInVoodooBoy, hasLag: false, spent: false }],
        legendArea: bbgLegends,
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 2 },
        ],
        eddies: 6,
        deck: filler,
      },
      rivalBody,
    );
    setTurn(engine, 5);
    markSold(engine, P1);
    const taken = steps(engine, bind("authored-bbg-towerfall-control"), P1, 8);
    expect(taken.some((step) => step.move === "playCard" && step.name === "Trust No One")).toBe(
      true,
    );
    expect(taken.some((step) => step.move === "playCard" && step.name === "Peace Offering")).toBe(
      false,
    );
    expect(
      taken.some(
        (step) =>
          step.name === "Jacked-In Voodoo Boy" &&
          (step.move === "attackUnit" || step.move === "attackRival"),
      ),
    ).toBe(true);
  });

  test("BBG turn 3 plays Floor It when Peace Offering and Trust No One are absent, then attacks", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt],
        field: [{ card: welcomeToNightCityRetailJackedInVoodooBoy, hasLag: false, spent: false }],
        legendArea: bbgLegends,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        eddies: 6,
        deck: filler,
      },
      rivalBody,
    );
    setTurn(engine, 5);
    markSold(engine, P1);
    const taken = steps(engine, bind("authored-bbg-towerfall-control"), P1, 8);
    expect(taken.some((step) => step.move === "playCard" && step.name === "Floor It")).toBe(true);
    expect(
      taken.some(
        (step) =>
          step.name === "Jacked-In Voodoo Boy" &&
          (step.move === "attackUnit" || step.move === "attackRival"),
      ),
    ).toBe(true);
  });

  test("BBG turn 4 sells Towerfall before playing Pepe", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailTowerfall,
          welcomeToNightCityRetailPepeNajarroWorkingDoubles,
        ],
        legendArea: bbgLegends,
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 2 },
        ],
        eddies: 7,
        deck: filler,
      },
      rivalBody,
    );
    setTurn(engine, 7);
    const taken = steps(engine, bind("authored-bbg-towerfall-control"), P1, 4);
    expect(taken[0]).toEqual({ move: "sellCard", name: "Towerfall" });
    expect(taken.some((step) => step.move === "playCard" && step.name === "Pepe Najarro")).toBe(
      true,
    );
  });

  test("BBG turn 5 plays Lizzy when the program is only in the trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailLizzyWizzyDelicateWeapon],
        trash: [welcomeToNightCityRetailChromeReverie],
        legendArea: bbgLegends,
        eddies: 4,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 9);
    const taken = steps(engine, bind("authored-bbg-towerfall-control"), P1, 4);
    expect(taken.some((step) => step.move === "playCard" && step.name === "Lizzy Wizzy")).toBe(
      true,
    );
  });

  test("BBG on the play with a Gig above 4 sells then Calls and does not play Trust No One", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailTrustNoOne],
        legendArea: bbgLegends,
        gigArea: [{ dieType: "d8", faceValue: 5 }],
        eddies: 0,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 1);
    spendLegends(engine, P1, 2);
    const taken = steps(engine, bind("authored-bbg-towerfall-control"), P1, 4);
    expect(taken[0]).toEqual({ move: "sellCard", name: "Floor It" });
    expect(taken.some((step) => step.move === "callLegend")).toBe(true);
    expect(taken.some((step) => step.move === "playCard" && step.name === "Trust No One")).toBe(
      false,
    );
  });

  test("BBG on the draw with a Gig above 4 and no Jacked-In Calls instead of Trust No One", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailTrustNoOne],
        legendArea: bbgLegends,
        gigArea: [{ dieType: "d8", faceValue: 5 }],
        eddies: 0,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 2);
    const taken = steps(engine, bind("authored-bbg-towerfall-control"), P1, 4);
    expect(taken.some((step) => step.move === "sellCard" && step.name === "Floor It")).toBe(true);
    expect(taken.some((step) => step.move === "callLegend")).toBe(true);
    expect(taken.some((step) => step.move === "playCard" && step.name === "Trust No One")).toBe(
      false,
    );
  });

  test("BBG turn 3 plays Peace Offering ahead of Trust No One when the Gig is above 1 and unpaired", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPeaceOffering, welcomeToNightCityRetailTrustNoOne],
        field: [{ card: welcomeToNightCityRetailJackedInVoodooBoy, hasLag: false, spent: false }],
        legendArea: bbgLegends,
        gigArea: [
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 5 },
        ],
        eddies: 6,
        deck: filler,
      },
      rivalBody,
    );
    setTurn(engine, 5);
    markSold(engine, P1);
    const taken = steps(engine, bind("authored-bbg-towerfall-control"), P1, 8);
    expect(taken.some((step) => step.move === "playCard" && step.name === "Peace Offering")).toBe(
      true,
    );
    expect(taken.some((step) => step.move === "playCard" && step.name === "Trust No One")).toBe(
      false,
    );
    expect(
      taken.some(
        (step) =>
          step.name === "Jacked-In Voodoo Boy" &&
          (step.move === "attackUnit" || step.move === "attackRival"),
      ),
    ).toBe(true);
  });

  test("BBG turn 4 does not attack with Pepe when only Hanako could be readied", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailPepeNajarroWorkingDoubles, hasLag: false, spent: false },
        ],
        legendArea: [
          {
            card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
            faceDown: false,
            spent: true,
          },
        ],
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 2 },
        ],
        eddies: 0,
        deck: filler,
      },
      rivalBody,
    );
    setTurn(engine, 7);
    spendLegends(engine, P1, 1);
    const taken = steps(engine, bind("authored-bbg-towerfall-control"), P1, 3);
    expect(
      taken.some(
        (step) =>
          step.name === "Pepe Najarro" &&
          (step.move === "attackUnit" || step.move === "attackRival"),
      ),
    ).toBe(false);
  });

  test("RRY turn 5 does not equip Faceplate on Dexter", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailZetatechFaceplate],
        field: [
          {
            card: theHeistRetailStarterDeckDexterDeshawnOneLastChance,
            hasLag: false,
            spent: false,
          },
        ],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
        eddies: 4,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 9);
    steps(engine, bind("authored-rry-llorona-steel-dragon"), P1, 3);
    expect(hostName(engine, P1, "Zetatech Faceplate")).not.toBe("Dexter DeShawn");
  });

  test("RRY turn 2 still plays The Heist when the only gear is Faceplate", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailTheHeist,
          welcomeToNightCityRetailLaLloronaGhostOfThePast,
          welcomeToNightCityRetailZetatechFaceplate,
        ],
        legendArea: [
          { card: welcomeToNightCityRetailVStreetkid, faceDown: true },
          { card: welcomeToNightCityRetailMuamarReyesElCapitan, faceDown: true },
          { card: welcomeToNightCityRetailDexterDeshawnOffTheGrid, faceDown: true },
        ],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
        eddies: 5,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    setTurn(engine, 3);
    markSold(engine, P1);
    const taken = steps(engine, bind("authored-rry-llorona-steel-dragon"), P1, 4);
    expect(taken.some((step) => step.move === "playCard" && step.name === "The Heist")).toBe(true);
  });
});
