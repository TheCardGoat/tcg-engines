import { afterAll, expect, it } from "vite-plus/test";
import { bombardier, getCard, previewDeck } from "@tcg/alpha-clash-cards";
import { applyCommand, type AcCommand, type PlayerId } from "@tcg/alpha-clash-engine";
import { Spec, specState } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

const body = getCard("ac-ac1-027"),
  trap = getCard("ac-ac1-020"),
  weapon = getCard("ac-ac6-162"),
  hero = getCard("ac-st-001");
const seats = { p1: "player-one", p2: "player-two" } as const;
const context = { gameId: "ordinary-command-matrix", sourceAuthority: "server" as const };
type Ordinary = Exclude<AcCommand, { type: `manual${string}` }>;
const stages = [
  "setup-first",
  "setup-second",
  "setup-select",
  "setup-ready",
  "resource",
  "primary",
  "play-response",
  "counter",
  "obstruct",
  "attackerBuff",
  "defenderBuff",
  "beforeDamage-attacker",
  "beforeDamage-defender",
  "choice",
  "complete",
] as const;
type Stage = (typeof stages)[number];
function fixture(stage: Stage, active: PlayerId) {
  if (stage.startsWith("setup-")) {
    const game = new Spec(specState({ p1: { deck: previewDeck() }, p2: { deck: previewDeck() } }));
    if (stage !== "setup-first") game.playerOne.declareMulligan(stage === "setup-select");
    if (stage === "setup-select" || stage === "setup-ready")
      game.playerTwo.declareMulligan(stage === "setup-select");
    return game;
  }
  const board = () => ({
    contender: hero,
    hand: [body, trap],
    clash: [body, body, bombardier],
    resource: Array.from({ length: 3 }, () => [body, trap, weapon]).flat(),
    accessory: [weapon, weapon, { card: trap, faceDown: true, setOnTurn: 1 }],
    deck: 8,
  });
  const game = Spec.fromFixture({
    activePlayer: active,
    turnNumber: 3,
    phase: stage === "resource" ? { name: "expansion", step: "resource" } : { name: "primary" },
    playerOne: board(),
    playerTwo: board(),
  });
  for (const seat of ["player-one", "player-two"] as const) {
    const sources = game
      .asPlayer(seat)
      .instances(weapon)
      .filter((card) => card.zone === "accessory");
    game.run({
      type: "manualAttachWeapon",
      playerId: seat,
      weaponId: sources[1].instanceId,
      targetId: game.asPlayer(seat).at(body, "clash").instanceId,
    });
  }
  const defender = active === "player-one" ? "player-two" : "player-one";
  if (stage === "complete") game.run({ type: "concede", playerId: active });
  else if (stage === "play-response") game.asPlayer(active).play(body);
  else if (stage === "choice")
    game.asPlayer(active).attack(bombardier, game.asPlayer(defender).contender(), "pending");
  else if (stage !== "resource" && stage !== "primary") {
    game
      .asPlayer(active)
      .attack(
        game.asPlayer(active).at(body, "clash"),
        game.asPlayer(defender).contender(),
        "pending",
      );
    const count = [
      "counter",
      "obstruct",
      "attackerBuff",
      "defenderBuff",
      "beforeDamage-attacker",
      "beforeDamage-defender",
    ].indexOf(stage);
    for (const seat of [defender, defender, active, defender, active].slice(0, count))
      game.asPlayer(seat).passRound();
  }
  return game;
}
function probes(game: Spec, playerId: PlayerId) {
  const cards = Object.values(game.state.cards).filter((card) => card.controller === playerId);
  const card = (id: string, zone: string) =>
    cards.find((entry) => entry.definitionId === id && entry.zone === zone)?.instanceId ??
    cards.find((entry) => entry.zone === "hand")?.instanceId ??
    "unavailable-card";
  const host =
    cards.filter((entry) => entry.definitionId === body.id && entry.zone === "clash").at(-1)
      ?.instanceId ?? card(body.id, "clash");
  const attach =
    cards.find(
      (entry) =>
        entry.definitionId === weapon.id && entry.zone === "accessory" && !entry.attachedTo,
    )?.instanceId ?? "unavailable-weapon";
  const detach =
    cards.find((entry) => entry.definitionId === weapon.id && entry.attachedTo)?.instanceId ??
    "unavailable-attachment";
  const commands = {
    startGame: { type: "startGame" },
    declareMulligan: { type: "declareMulligan", playerId, take: false },
    mulligan: { type: "mulligan", playerId, cardIds: [] },
    deployResource: { type: "deployResource", playerId, cardId: card(body.id, "hand") },
    playCard: { type: "playCard", playerId, cardId: card(body.id, "hand") },
    setCard: { type: "setCard", playerId, cardId: card(trap.id, "hand") },
    respond: {
      type: "respond",
      playerId,
      cardId: card(trap.id, "accessory"),
      targetId: game.state.clash?.attackerId ?? host,
    },
    activatePortal: { type: "activatePortal", playerId },
    attachWeapon: { type: "attachWeapon", playerId, weaponId: attach, targetId: host },
    detachWeapon: { type: "detachWeapon", playerId, weaponId: detach },
    initiateClash: {
      type: "initiateClash",
      playerId,
      attackerId: host,
      targetId:
        game.state.players[playerId === "player-one" ? "player-two" : "player-one"].contenderId,
    },
    declareObstructors: { type: "declareObstructors", playerId, obstructorIds: [] },
    activateAbility: {
      type: "activateAbility",
      playerId,
      cardId: game.state.players[playerId].contenderId,
      abilityIndex: 1,
    },
    pass: { type: "pass", playerId },
    endTurn: { type: "endTurn", playerId },
    resolveChoice: {
      type: "resolveChoice",
      playerId,
      choiceId: game.state.pendingChoices[0]?.id ?? "unavailable-choice",
      division: {},
    },
    concede: { type: "concede", playerId },
  } satisfies { [K in Ordinary["type"]]: Extract<Ordinary, { type: K }> };
  return Object.values(commands);
}
function interaction(command: Ordinary): { id: string; values: InteractionSubmission["values"] } {
  switch (command.type) {
    case "declareMulligan":
      return { id: "declareMulligan:keep", values: {} };
    case "mulligan":
      return { id: "mulligan", values: { cardIds: [] } };
    case "deployResource":
      return { id: "deployResource", values: { cardId: [command.cardId] } };
    case "playCard":
    case "setCard":
      return { id: `${command.type}:${command.cardId}`, values: {} };
    case "respond":
      return { id: `respond:${command.cardId}`, values: { targetId: [command.targetId!] } };
    case "attachWeapon":
      return { id: `attachWeapon:${command.weaponId}`, values: { targetId: [command.targetId] } };
    case "detachWeapon":
      return { id: `detachWeapon:${command.weaponId}`, values: {} };
    case "initiateClash":
      return {
        id: "initiateClash",
        values: { attackerId: [command.attackerId], targetId: [command.targetId] },
      };
    case "declareObstructors":
      return { id: "declareObstructors", values: { obstructorIds: [] } };
    case "activateAbility":
      return { id: `activateAbility:${command.cardId}:${command.abilityIndex}`, values: {} };
    case "resolveChoice":
      return { id: `resolveChoice:${command.choiceId}`, values: { allocation: {} } };
    case "concede":
      return { id: "concede", values: { confirm: true } };
    default:
      return { id: command.type, values: {} };
  }
}
const acceptedCommands = new Set<Ordinary["type"]>();
const cases = (["player-one", "player-two"] as const).flatMap((active) =>
  stages
    .filter((stage) => active === "player-one" || !stage.startsWith("setup-"))
    .flatMap((stage) => (["p1", "p2"] as const).map((actor) => ({ active, stage, actor }))),
);
const commandTypes = probes(fixture("primary", "player-one"), "player-one").map(
  (command) => command.type,
);
const games = new Map<string, Spec>();
const views = new Map<string, ReturnType<AlphaClashServerEngine["getInteractionView"]>>();
it.each(cases.flatMap((entry) => commandTypes.map((commandType) => ({ ...entry, commandType }))))(
  "$active / $stage / $actor / $commandType agrees with native legality",
  ({ active, stage, actor, commandType }) => {
    const key = `${active}/${stage}`;
    let game = games.get(key);
    if (!game) {
      game = fixture(stage, active);
      games.set(key, game);
    }
    const state = game.state;
    if (stage === "choice") expect(state.pendingChoices.length).toBeGreaterThan(0);
    const command = probes(game, seats[actor]).find((command) => command.type === commandType)!;
    const label = `${stage}/${actor}/${command.type}`;
    const native = applyCommand(structuredClone(state), command);
    const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(state)), seats);
    const version = engine.getStateID(),
      before = structuredClone(engine.state),
      undo = structuredClone(engine.getUndoState());
    const payload: Record<string, unknown> = {
      ...command,
      playerId: seats[actor === "p1" ? "p2" : "p1"],
    };
    delete payload.type;
    const result = engine.dispatch(command.type, actor, payload, context);
    expect(result.success, label).toBe(native.success);
    if (!native.success) {
      expect(engine.state, label).toEqual(before);
      expect(engine.getUndoState(), label).toEqual(undo);
      expect(engine.getStateID(), label).toBe(version);
      return;
    }
    expect(engine.getStateID(), label).toBe(version + 1);
    // startGame has no native actor field; UI delegates it to the starting seat.
    // Repeated native concession is idempotent; completed UI has no commands.
    if (
      stage === "complete" ||
      (command.type === "startGame" && seats[actor] !== state.activePlayer)
    )
      return;
    const ui = new AlphaClashServerEngine(JSON.parse(JSON.stringify(state)), seats);
    const viewKey = `${key}/${actor}`;
    let view = views.get(viewKey);
    if (!view) {
      view = ui.getInteractionView(actor);
      views.set(viewKey, view);
    }
    const { id, values } = interaction(command);
    const action = view.actions.find((entry) =>
      command.type === "pass"
        ? ["passResource", "passCounter", "passObstruct", "passClashStep"].includes(entry.id) &&
          entry.enabled
        : entry.id === id,
    );
    expect(action?.enabled, `${label}: missing legal UI action ${id}`).toBe(true);
    if (!action) throw new Error(label);
    for (const input of action.inputs) {
      if (input.kind !== "option-selection" || input.id !== "resourcePayment") continue;
      if (input.presentation?.kind !== "cost-slots") throw new Error("Missing payment slots");
      const used = new Set<string>();
      values.resourcePayment = input.presentation.slots.map((slot) => {
        const option = slot.optionIds.find((id) => !used.has(JSON.parse(id)[0]));
        if (!option) throw new Error("No distinct resource for slot");
        used.add(JSON.parse(option)[0]);
        return option;
      });
    }
    const submitted = ui.submitInteraction(
      actor,
      buildInteractionSubmission({ view, action, values }),
      context,
    );
    expect(submitted.success, `${label}: ${JSON.stringify(submitted)}`).toBe(true);
    expect(ui.state, label).toEqual(engine.state);
    acceptedCommands.add(command.type);
  },
);

afterAll(() => {
  expect([...acceptedCommands].sort()).toEqual([...commandTypes].sort());
});
