<script lang="ts">
  import JSONTree from "svelte-json-tree";
  import * as Sidebar from "$lib/design-system/primitives/sidebar";
  import {LORCANA_SIMULATOR_FIXTURES} from "@/features/simulator-devtools/fixtures";
  import {
      LORCANA_SIMULATOR_VIEWS,
      type BoardMoveAnimationVariant,
      type LorcanaSimulatorView,
      type SimulatorDebugAnimationPlayer,
      type SimulatorDebugAnimationRequest,
  } from "$lib";
  import type {LorcanaSimulatorFixture} from "@/features/simulator/model/contracts.js";
  import { useSidebar } from "$lib/design-system/primitives/sidebar";

  interface DebugPanelProps {
    isOpen: boolean;
    fixtureId: string;
    view: LorcanaSimulatorView;
    stateId: number | null;
    serializedState: string;
    serializedBoardProjection: string;
    serializedInteractionPrompt: string;
    onViewChange: (view: LorcanaSimulatorView) => void;
    onFixtureChange?: (fixtureId: string) => void;
    onReset: () => void;
    onRefresh: () => void;
    onRunAnimation: (animation: SimulatorDebugAnimationRequest) => boolean;
    onRunQuestAnimation?: (cardId: string, player: SimulatorDebugAnimationPlayer, loreGained: number) => boolean;
    onRunChallengeAnimation?: (attackerId: string, defenderId: string, player: SimulatorDebugAnimationPlayer, preview: { attackerDamageDealt: number; defenderDamageDealt: number; defenderKind: "character" | "location"; attackerWouldBeBanished: boolean; defenderWouldBeBanished: boolean; attackerDamageIsReduced: boolean; defenderDamageIsReduced: boolean }) => boolean;
    onClose: () => void;
    onOpenStateChange: (open: boolean) => void;
  }

  interface ProjectionSummary {
    gameId: string;
    matchId: string;
    rulesetHash: string;
    protocolVersion: number | null;
    status: {
      turn: number | null;
      phase: string;
      step: string;
      segment: string;
      gameEnded: boolean | null;
    };
    priority: {
      holder: string;
      windowOpen: boolean | null;
      stackDepth: number | null;
      passSequence: string[];
    };
    loreByPlayer: Array<{ playerId: string; lore: number | null; turnsCompleted: number | null }>;
    turnMetadata: Array<{ key: string; count: number; sample: string[] }>;
    continuousEffects: {
      count: number;
      nextSeq: number | null;
    };
    reveals: {
      activeCount: number;
      nextSeq: number | null;
    };
    zoneDefinitions: Array<{
      zoneKey: string;
      baseZone: string;
      ownerId: string;
      visibility: string;
      ordered: boolean | null;
      ownerScoped: boolean | null;
      faceDown: boolean | null;
    }>;
    zoneProjectionRows: Array<{
      zoneKey: string;
      baseZone: string;
      ownerId: string;
      summaryCount: number | null;
      privateCardCount: number;
      revision: number | null;
      topPublicCardId: string;
    }>;
    playerZoneMatrix: Array<{
      playerId: string;
      totals: {
        all: number;
        deck: number;
        hand: number;
        play: number;
        inkwell: number;
        discard: number;
        limbo: number;
      };
    }>;
    cardStats: {
      cardIndexCount: number;
      cardMetaCount: number;
      readyCount: number;
      exertedCount: number;
      unknownStateCount: number;
      damagedCount: number;
      controlledByOtherCount: number;
    };
    anomalies: string[];
  }

  type CopyTarget = "boardProjection" | "interactionPrompt" | "state";

  interface CopyFeedback {
    target: CopyTarget;
    tone: "success" | "error";
    message: string;
  }

  const BASE_ZONE_ORDER = ["deck", "hand", "play", "inkwell", "discard", "limbo"];

  const {
    isOpen,
    fixtureId,
    view,
    stateId,
    serializedState,
    serializedBoardProjection,
    serializedInteractionPrompt,
    onViewChange,
    onFixtureChange,
    onReset,
    onRefresh,
    onRunAnimation,
    onRunQuestAnimation,
    onRunChallengeAnimation,
    onClose,
    onOpenStateChange,
  }: DebugPanelProps = $props();
  const sidebar = useSidebar();

  const VIEW_LABELS: Record<LorcanaSimulatorView, string> = {
    playerOne: "PlayerOne",
    playerTwo: "PlayerTwo",
    spectator: "Spectator",
    authoritative: "Authoritative",
  };

  let parsedState = $state<unknown>(null);
  let stateParseError = $state<string | null>(null);
  let parsedBoardProjection = $state<unknown>(null);
  let boardProjectionParseError = $state<string | null>(null);
  let parsedInteractionPrompt = $state<unknown>(null);
  let interactionPromptParseError = $state<string | null>(null);
  let projectionSummary = $state<ProjectionSummary | null>(null);
  type AnimationType = "play.action" | "quest" | "challenge" | "lorcana.boardMove";
  let animationType = $state<AnimationType>("quest");
  let animationCardId = $state("");
  let animationPlayer = $state<SimulatorDebugAnimationPlayer>("player_one");
  let questLoreGained = $state(2);
  let boardMoveVariant = $state<BoardMoveAnimationVariant>("play-character");
  let challengeDefenderCardId = $state("");
  let challengeAttackerDamage = $state(3);
  let challengeDefenderDamage = $state(2);
  let challengeDefenderKind = $state<"character" | "location">("character");
  let challengeAttackerBanished = $state(false);
  let challengeDefenderBanished = $state(false);
  let animationStatus = $state<string | null>(null);
  let copyFeedback = $state<CopyFeedback | null>(null);
  const fixtureOptions = Object.values(LORCANA_SIMULATOR_FIXTURES).sort((left, right) =>
    left.name.localeCompare(right.name),
  ) satisfies LorcanaSimulatorFixture[];

  function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  }

  function asString(value: unknown): string {
    return typeof value === "string" ? value : "n/a";
  }

  function asNumber(value: unknown): number | null {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  }

  function asBoolean(value: unknown): boolean | null {
    return typeof value === "boolean" ? value : null;
  }

  function asStringList(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter((entry): entry is string => typeof entry === "string");
  }

  function parseZoneKey(zoneKey: string): { baseZone: string; ownerId: string } {
    const [baseZone, ownerId] = zoneKey.split(":");
    return {
      baseZone: baseZone || zoneKey,
      ownerId: ownerId || "global",
    };
  }

  function buildProjectionSummary(state: unknown): ProjectionSummary {
    const root = asRecord(state);
    const g = asRecord(root.G);
    const ctx = asRecord(root.ctx);
    const status = asRecord(ctx.status);
    const priority = asRecord(ctx.priority);
    const zones = asRecord(ctx.zones);
    const zoneDefs = asRecord(zones.zoneDefs);
    const publicState = asRecord(zones.public);
    const privateState = asRecord(zones.private);
    const reveals = asRecord(zones.reveals);
    const zoneSummaries = asRecord(publicState.zoneSummaries);
    const zoneCards = asRecord(privateState.zoneCards);
    const cardIndex = asRecord(privateState.cardIndex);
    const cardMeta = asRecord(privateState.cardMeta);

    const playerIds = asStringList(ctx.playerIds);
    const loreRecord = asRecord(g.lore);
    const turnsCompleted = asRecord(g.turnsCompletedByPlayer);

    const loreByPlayer = playerIds.map((playerId) => ({
      playerId,
      lore: asNumber(loreRecord[playerId]),
      turnsCompleted: asNumber(turnsCompleted[playerId]),
    }));

    const turnMetadataSource = asRecord(g.turnMetadata);
    const turnMetadata = Object.entries(turnMetadataSource)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return {
            key,
            count: value.length,
            sample: value.slice(0, 4).map((entry) => String(entry)),
          };
        }

        const mapped = asRecord(value);
        const entries = Object.entries(mapped);
        return {
          key,
          count: entries.length,
          sample: entries.slice(0, 4).map(([sampleKey, sampleValue]) => `${sampleKey}:${String(sampleValue)}`),
        };
      })
      .sort((left, right) => right.count - left.count || left.key.localeCompare(right.key));

    const zoneDefinitions = Object.entries(zoneDefs)
      .map(([zoneKey, value]) => {
        const def = asRecord(value);
        const parsed = parseZoneKey(zoneKey);
        return {
          zoneKey,
          baseZone: parsed.baseZone,
          ownerId: parsed.ownerId,
          visibility: asString(def.visibility),
          ordered: asBoolean(def.ordered),
          ownerScoped: asBoolean(def.ownerScoped),
          faceDown: asBoolean(def.faceDown),
        };
      })
      .sort((left, right) => {
        const leftBase = BASE_ZONE_ORDER.indexOf(left.baseZone);
        const rightBase = BASE_ZONE_ORDER.indexOf(right.baseZone);
        if (leftBase !== rightBase) {
          return leftBase - rightBase;
        }
        return left.ownerId.localeCompare(right.ownerId);
      });

    const zoneProjectionRows = Object.entries(zoneSummaries)
      .map(([zoneKey, value]) => {
        const summary = asRecord(value);
        const parsed = parseZoneKey(zoneKey);
        const privateCards = Array.isArray(zoneCards[zoneKey]) ? zoneCards[zoneKey] : [];

        return {
          zoneKey,
          baseZone: parsed.baseZone,
          ownerId: parsed.ownerId,
          summaryCount: asNumber(summary.count),
          privateCardCount: privateCards.length,
          revision: asNumber(summary.revision),
          topPublicCardId: asString(summary.topPublicCardID),
        };
      })
      .sort((left, right) => {
        const leftBase = BASE_ZONE_ORDER.indexOf(left.baseZone);
        const rightBase = BASE_ZONE_ORDER.indexOf(right.baseZone);
        if (leftBase !== rightBase) {
          return leftBase - rightBase;
        }
        return left.ownerId.localeCompare(right.ownerId);
      });

    const playerZoneMatrix = playerIds.map((playerId) => {
      const countFor = (baseZone: string): number => {
        const zoneKey = `${baseZone}:${playerId}`;
        const summary = asRecord(zoneSummaries[zoneKey]);
        return asNumber(summary.count) ?? 0;
      };

      const deck = countFor("deck");
      const hand = countFor("hand");
      const play = countFor("play");
      const inkwell = countFor("inkwell");
      const discard = countFor("discard");
      const limbo = countFor("limbo");

      return {
        playerId,
        totals: {
          all: deck + hand + play + inkwell + discard + limbo,
          deck,
          hand,
          play,
          inkwell,
          discard,
          limbo,
        },
      };
    });

    let readyCount = 0;
    let exertedCount = 0;
    let unknownStateCount = 0;
    let damagedCount = 0;
    let controlledByOtherCount = 0;

    for (const [cardId, cardPositionValue] of Object.entries(cardIndex)) {
      const cardPosition = asRecord(cardPositionValue);
      const ownerId = asString(cardPosition.ownerID);
      const controllerId = asString(cardPosition.controllerID);
      if (ownerId !== "n/a" && controllerId !== "n/a" && ownerId !== controllerId) {
        controlledByOtherCount += 1;
      }

      const meta = asRecord(cardMeta[cardId]);
      const state = asString(meta.state);
      if (state === "ready") {
        readyCount += 1;
      } else if (state === "exerted") {
        exertedCount += 1;
      } else {
        unknownStateCount += 1;
      }

      const damage = asNumber(meta.damage) ?? 0;
      if (damage > 0) {
        damagedCount += 1;
      }
    }

    const anomalies: string[] = [];
    for (const [zoneKey, value] of Object.entries(zoneSummaries)) {
      const summary = asRecord(value);
      const summaryCount = asNumber(summary.count);
      const privateList = Array.isArray(zoneCards[zoneKey]) ? zoneCards[zoneKey] : [];
      if (summaryCount !== null && summaryCount !== privateList.length) {
        anomalies.push(
          `Count mismatch for ${zoneKey}: zoneSummaries=${summaryCount}, zoneCards=${privateList.length}`,
        );
      }
    }

    for (const [cardId, positionValue] of Object.entries(cardIndex)) {
      if (!(cardId in cardMeta)) {
        anomalies.push(`Missing cardMeta entry for ${cardId}`);
      }

      const position = asRecord(positionValue);
      const zoneKey = asString(position.zoneKey);
      const zoneList = Array.isArray(zoneCards[zoneKey]) ? zoneCards[zoneKey] : [];
      if (!zoneList.includes(cardId)) {
        anomalies.push(`Card ${cardId} not found in zoneCards[${zoneKey}]`);
      }

      const expectedIndex = asNumber(position.index);
      if (expectedIndex !== null && zoneList[expectedIndex] !== cardId) {
        anomalies.push(
          `Card ${cardId} index mismatch: cardIndex=${expectedIndex}, zoneCards points to ${String(
            zoneList[expectedIndex],
          )}`,
        );
      }
    }

    for (const [zoneKey, value] of Object.entries(zoneCards)) {
      if (!Array.isArray(value)) {
        anomalies.push(`zoneCards[${zoneKey}] is not an array`);
        continue;
      }

      for (const cardId of value) {
        if (typeof cardId !== "string") {
          anomalies.push(`zoneCards[${zoneKey}] contains non-string entry`);
          continue;
        }

        if (!(cardId in cardIndex)) {
          anomalies.push(`zoneCards[${zoneKey}] references ${cardId} without cardIndex entry`);
        }
      }
    }

    const continuousEffects = asRecord(g.continuousEffects);
    const revealActive = Array.isArray(reveals.active) ? reveals.active : [];

    return {
      gameId: asString(ctx.gameID),
      matchId: asString(ctx.matchID),
      rulesetHash: asString(ctx.rulesetHash),
      protocolVersion: asNumber(ctx.protocolVersion),
      status: {
        turn: asNumber(status.turn),
        phase: asString(status.phase),
        step: asString(status.step),
        segment: asString(status.gameSegment),
        gameEnded: asBoolean(status.gameEnded),
      },
      priority: {
        holder: asString(priority.holder),
        windowOpen: asBoolean(priority.windowOpen),
        stackDepth: asNumber(priority.stackDepth),
        passSequence: asStringList(priority.passSequence),
      },
      loreByPlayer,
      turnMetadata,
      continuousEffects: {
        count: Array.isArray(continuousEffects.instances) ? continuousEffects.instances.length : 0,
        nextSeq: asNumber(continuousEffects.nextSeq),
      },
      reveals: {
        activeCount: revealActive.length,
        nextSeq: asNumber(reveals.nextSeq),
      },
      zoneDefinitions,
      zoneProjectionRows,
      playerZoneMatrix,
      cardStats: {
        cardIndexCount: Object.keys(cardIndex).length,
        cardMetaCount: Object.keys(cardMeta).length,
        readyCount,
        exertedCount,
        unknownStateCount,
        damagedCount,
        controlledByOtherCount,
      },
      anomalies,
    };
  }

  function handleFixtureChange(event: Event): void {
    const nextFixtureId = (event.currentTarget as HTMLSelectElement).value;
    if (!onFixtureChange || nextFixtureId === fixtureId) {
      return;
    }

    onFixtureChange(nextFixtureId);
  }

  function toBooleanText(value: boolean | null): string {
    if (value === null) {
      return "n/a";
    }
    return value ? "yes" : "no";
  }

  function toScalar(value: number | null): string {
    if (value === null) {
      return "n/a";
    }
    return String(value);
  }

  function handleViewChange(event: Event): void {
    const target = event.currentTarget;
    if (!(target instanceof HTMLSelectElement)) {
      return;
    }

    const nextView = target.value as LorcanaSimulatorView;
    if (!LORCANA_SIMULATOR_VIEWS.includes(nextView)) {
      return;
    }

    onViewChange(nextView);
  }

  function runSelectedAnimation(): void {
    if (animationType === "quest") {
      runQuestAnimationDebug();
    } else if (animationType === "challenge") {
      runChallengeAnimationDebug();
    } else if (animationType === "lorcana.boardMove") {
      runBoardMoveAnimation();
    } else {
      runPlayActionAnimation();
    }
  }

  function runPlayActionAnimation(): void {
    const cardId = animationCardId.trim();
    if (!cardId) {
      animationStatus = "Card ID is required.";
      return;
    }

    const success = onRunAnimation({
      id: `debug-play-action:${cardId}:${Date.now()}`,
      kind: "play.action",
      payload: {
        cardId,
        player: animationPlayer,
      },
    });

    animationStatus = success
      ? `Queued play.action for ${cardId}.`
      : `Unable to queue animation for ${cardId}. Check console for anchor debug info.`;
  }

  function runBoardMoveAnimation(): void {
    const cardId = animationCardId.trim();
    if (!cardId) {
      animationStatus = "Card instance ID is required.";
      return;
    }

    const success = onRunAnimation({
      id: `debug-board-move:${cardId}:${Date.now()}`,
      kind: "lorcana.boardMove",
      payload: {
        cardId,
        player: animationPlayer,
        variant: boardMoveVariant,
      },
    });

    animationStatus = success
      ? `Queued ${boardMoveVariant} for ${cardId}.`
      : `Unable to queue animation for ${cardId}. Check console for anchor debug info.`;
  }

  function runQuestAnimationDebug(): void {
    const cardId = animationCardId.trim();
    if (!cardId) {
      animationStatus = "Card instance ID is required. Use the instance ID of a card in play.";
      return;
    }

    if (!onRunQuestAnimation) {
      animationStatus = "Quest animation callback not wired. Check story wrapper.";
      return;
    }

    const success = onRunQuestAnimation(cardId, animationPlayer, questLoreGained);
    animationStatus = success
      ? `Fired quest animation: ${cardId} gained ${questLoreGained} lore.`
      : `Failed to fire quest animation for ${cardId}. Card may not be in play zone, or anchors not measured. Check console.`;
  }

  function runChallengeAnimationDebug(): void {
    const attackerId = animationCardId.trim();
    const defenderId = challengeDefenderCardId.trim();
    if (!attackerId || !defenderId) {
      animationStatus = "Both attacker and defender card instance IDs are required.";
      return;
    }

    if (!onRunChallengeAnimation) {
      animationStatus = "Challenge animation callback not wired. Check story wrapper.";
      return;
    }

    const success = onRunChallengeAnimation(attackerId, defenderId, animationPlayer, {
      attackerDamageDealt: challengeAttackerDamage,
      defenderDamageDealt: challengeDefenderDamage,
      defenderKind: challengeDefenderKind,
      attackerWouldBeBanished: challengeAttackerBanished,
      defenderWouldBeBanished: challengeDefenderBanished,
      attackerDamageIsReduced: false,
      defenderDamageIsReduced: false,
    });
    animationStatus = success
      ? `Fired challenge animation: ${attackerId} -> ${defenderId}.`
      : `Failed to fire challenge animation. Cards may not be in play zone, or anchors not measured. Check console.`;
  }

  async function copySerializedJson(target: CopyTarget, serializedJson: string, emptyMessage: string): Promise<void> {
    if (!serializedJson || serializedJson === emptyMessage) {
      copyFeedback = {
        target,
        tone: "error",
        message: emptyMessage,
      };
      return;
    }

    if (typeof navigator === "undefined" || !navigator.clipboard) {
      copyFeedback = {
        target,
        tone: "error",
        message: "Clipboard API is unavailable in this browser context.",
      };
      return;
    }

    try {
      await navigator.clipboard.writeText(serializedJson);
      copyFeedback = {
        target,
        tone: "success",
        message: "Copied JSON to clipboard.",
      };
    } catch {
      copyFeedback = {
        target,
        tone: "error",
        message: "Failed to copy JSON to clipboard.",
      };
    }
  }

  $effect(() => {
    parsedState = null;
    stateParseError = null;
    parsedBoardProjection = null;
    boardProjectionParseError = null;
    parsedInteractionPrompt = null;
    interactionPromptParseError = null;
    projectionSummary = null;

    if (!serializedState || serializedState === "No state available.") {
      stateParseError = serializedState;
    } else {
      try {
        const nextParsedState = JSON.parse(serializedState);
        parsedState = nextParsedState;
        projectionSummary = buildProjectionSummary(nextParsedState);
      } catch {
        stateParseError = "Unable to parse serialized state JSON.";
      }
    }

    if (!serializedBoardProjection || serializedBoardProjection === "No board projection available.") {
      boardProjectionParseError = serializedBoardProjection;
      return;
    }

    try {
      parsedBoardProjection = JSON.parse(serializedBoardProjection);
    } catch {
      boardProjectionParseError = "Unable to parse serialized board projection JSON.";
    }

    if (!serializedInteractionPrompt || serializedInteractionPrompt === "No interaction prompt available.") {
      interactionPromptParseError = serializedInteractionPrompt;
      return;
    }

    try {
      parsedInteractionPrompt = JSON.parse(serializedInteractionPrompt);
    } catch {
      interactionPromptParseError = "Unable to parse serialized interaction prompt JSON.";
    }
  });

  $effect(() => {
    if (!sidebar.isMobile) {
      return;
    }

    if (sidebar.openMobile !== isOpen) {
      sidebar.setOpenMobile(isOpen);
    }
  });

  $effect(() => {
    if (!sidebar.isMobile) {
      return;
    }

    if (sidebar.openMobile !== isOpen) {
      onOpenStateChange(sidebar.openMobile);
    }
  });
</script>

<Sidebar.Header class="debug-sidebar__shell">
  <header class="debug-sidebar__header">
    <div>
      <h2>Debug Projection</h2>
      <p>Authoritative board state diagnostics</p>
    </div>
    <button type="button" class="debug-sidebar__close" onclick={onClose}>
      Close
    </button>
  </header>

  <div class="debug-sidebar__meta">
    <p><strong>Fixture:</strong> {fixtureId}</p>
    <p><strong>View:</strong> {view}</p>
    <p><strong>State ID:</strong> {stateId ?? "n/a"}</p>
  </div>

  <div class="debug-sidebar__actions">
    {#if onFixtureChange}
      <label class="debug-sidebar__view">
        <span>Fixture</span>
        <select value={fixtureId} onchange={handleFixtureChange}>
          {#each fixtureOptions as fixtureOption}
            <option value={fixtureOption.id}>{fixtureOption.name}</option>
          {/each}
        </select>
      </label>
    {/if}
    <label class="debug-sidebar__view">
      <span>View</span>
      <select value={view} onchange={handleViewChange}>
        {#each LORCANA_SIMULATOR_VIEWS as simulatorView}
          <option value={simulatorView}>{VIEW_LABELS[simulatorView]}</option>
        {/each}
      </select>
    </label>
    <button type="button" class="debug-sidebar__refresh" onclick={onReset}>
      Reset Fixture
    </button>
    <button type="button" class="debug-sidebar__refresh" onclick={onRefresh}>
      Refresh
    </button>
  </div>
</Sidebar.Header>

<Sidebar.Content class="debug-sidebar__content">
    <section class="debug-section debug-section--animation">
        <div class="debug-section__header">
            <div>
                <h3>Animation Lab</h3>
                <p>Inject UI animations without waiting for engine packets.</p>
            </div>
            <button type="button" class="debug-sidebar__refresh" onclick={runSelectedAnimation}>
                Run {animationType}
            </button>
        </div>

        <div class="debug-animation-form">
            <label>
                <span>Type</span>
                <select bind:value={animationType}>
                    <option value="quest">Quest (lore fly)</option>
                    <option value="challenge">Challenge (arrow + badges)</option>
                    <option value="play.action">Play Action (preview)</option>
                    <option value="lorcana.boardMove">Play Card (spotlight)</option>
                </select>
            </label>

            <label>
                <span>Player Side</span>
                <select bind:value={animationPlayer}>
                    <option value="player_one">player_one</option>
                    <option value="player_two">player_two</option>
                </select>
            </label>

            <label>
                <span>{animationType === "quest" || animationType === "lorcana.boardMove" || animationType === "challenge" ? (animationType === "challenge" ? "Attacker Card Instance ID" : "Card Instance ID") : "Card Definition ID"}</span>
                <input bind:value={animationCardId} placeholder={animationType === "quest" || animationType === "lorcana.boardMove" || animationType === "challenge" ? "instance ID from play zone" : "definition ID e.g. GGr"}/>
            </label>

            {#if animationType === "quest"}
                <label>
                    <span>Lore Gained</span>
                    <input type="number" bind:value={questLoreGained} min="0" max="10" />
                </label>
            {/if}

            {#if animationType === "lorcana.boardMove"}
                <label>
                    <span>Variant</span>
                    <select bind:value={boardMoveVariant}>
                        <option value="play-character">Character</option>
                        <option value="play-item">Item</option>
                        <option value="play-location">Location</option>
                        <option value="play-action">Action</option>
                    </select>
                </label>
            {/if}

            {#if animationType === "challenge"}
                <label>
                    <span>Defender Card Instance ID</span>
                    <input bind:value={challengeDefenderCardId} placeholder="instance ID from opponent play zone"/>
                </label>
                <label>
                    <span>Attacker Damage Dealt</span>
                    <input type="number" bind:value={challengeAttackerDamage} min="0" max="20" />
                </label>
                <label>
                    <span>Defender Damage Dealt</span>
                    <input type="number" bind:value={challengeDefenderDamage} min="0" max="20" />
                </label>
                <label>
                    <span>Defender Kind</span>
                    <select bind:value={challengeDefenderKind}>
                        <option value="character">Character</option>
                        <option value="location">Location</option>
                    </select>
                </label>
                <label class="debug-animation-checkbox">
                    <input type="checkbox" bind:checked={challengeAttackerBanished} />
                    <span>Attacker Banished</span>
                </label>
                <label class="debug-animation-checkbox">
                    <input type="checkbox" bind:checked={challengeDefenderBanished} />
                    <span>Defender Banished</span>
                </label>
            {/if}
        </div>

        {#if animationType === "quest"}
            <p class="debug-animation-hint">
                Use a card instance ID from the play zone (visible in the board projection JSON).
                The quest animation renders a golden lore pill flying from the card to the lore badge.
            </p>
        {:else if animationType === "challenge"}
            <p class="debug-animation-hint">
                Use card instance IDs from the play zones. The attacker must be on the selected player's side,
                the defender on the opponent's side. The animation renders a golden arrow with damage badges.
            </p>
        {:else if animationType === "lorcana.boardMove"}
            <p class="debug-animation-hint">
                Use a card instance ID. The card spotlights at board center then settles to its destination zone.
                Actions fly to discard; characters/items/locations fly to the play zone.
            </p>
        {:else}
            <p class="debug-animation-hint">
                Use a card instance ID from the board projection. The play.action animation renders the card flying from hand to center.
            </p>
        {/if}

        {#if animationStatus}
            <p class="debug-animation-status" class:debug-animation-status--error={animationStatus.includes("Failed") || animationStatus.includes("Unable")}>{animationStatus}</p>
        {/if}
    </section>

    {#if stateParseError}
    <pre class="debug-sidebar__state debug-sidebar__state--raw">{stateParseError}</pre>
  {:else if projectionSummary}
    <div class="debug-sidebar__state">
      <section class="debug-section">
        <h3>Match Context</h3>
        <div class="debug-kv-grid">
          <p><span>Game</span><strong>{projectionSummary.gameId}</strong></p>
          <p><span>Match</span><strong>{projectionSummary.matchId}</strong></p>
          <p><span>Ruleset</span><strong>{projectionSummary.rulesetHash}</strong></p>
          <p><span>Protocol</span><strong>{toScalar(projectionSummary.protocolVersion)}</strong></p>
          <p><span>Turn</span><strong>{toScalar(projectionSummary.status.turn)}</strong></p>
          <p><span>Phase</span><strong>{projectionSummary.status.phase}</strong></p>
          <p><span>Step</span><strong>{projectionSummary.status.step}</strong></p>
          <p><span>Segment</span><strong>{projectionSummary.status.segment}</strong></p>
          <p><span>Game Ended</span><strong>{toBooleanText(projectionSummary.status.gameEnded)}</strong></p>
          <p><span>Priority Holder</span><strong>{projectionSummary.priority.holder}</strong></p>
          <p><span>Priority Window</span><strong>{toBooleanText(projectionSummary.priority.windowOpen)}</strong></p>
          <p><span>Stack Depth</span><strong>{toScalar(projectionSummary.priority.stackDepth)}</strong></p>
        </div>
        <p class="debug-inline-list">
          <span>Pass Sequence</span>
          {#if projectionSummary.priority.passSequence.length === 0}
            <strong>none</strong>
          {:else}
            <strong>{projectionSummary.priority.passSequence.join(" -> ")}</strong>
          {/if}
        </p>
      </section>

      <section class="debug-section">
        <h3>Player Totals</h3>
        <table class="debug-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Lore</th>
              <th>Turns</th>
              <th>Cards</th>
              <th>Deck</th>
              <th>Hand</th>
              <th>Play</th>
              <th>Inkwell</th>
              <th>Discard</th>
              <th>Limbo</th>
            </tr>
          </thead>
          <tbody>
            {#each projectionSummary.playerZoneMatrix as row}
              {@const lore = projectionSummary.loreByPlayer.find((entry) => entry.playerId === row.playerId)}
              <tr>
                <td>{row.playerId}</td>
                <td>{toScalar(lore?.lore ?? null)}</td>
                <td>{toScalar(lore?.turnsCompleted ?? null)}</td>
                <td>{row.totals.all}</td>
                <td>{row.totals.deck}</td>
                <td>{row.totals.hand}</td>
                <td>{row.totals.play}</td>
                <td>{row.totals.inkwell}</td>
                <td>{row.totals.discard}</td>
                <td>{row.totals.limbo}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>

      <section class="debug-section">
        <h3>Card + Effect Health</h3>
        <div class="debug-kv-grid">
          <p><span>Card Index</span><strong>{projectionSummary.cardStats.cardIndexCount}</strong></p>
          <p><span>Card Meta</span><strong>{projectionSummary.cardStats.cardMetaCount}</strong></p>
          <p><span>Ready</span><strong>{projectionSummary.cardStats.readyCount}</strong></p>
          <p><span>Exerted</span><strong>{projectionSummary.cardStats.exertedCount}</strong></p>
          <p><span>Unknown State</span><strong>{projectionSummary.cardStats.unknownStateCount}</strong></p>
          <p><span>Damaged</span><strong>{projectionSummary.cardStats.damagedCount}</strong></p>
          <p>
            <span>Controller != Owner</span>
            <strong>{projectionSummary.cardStats.controlledByOtherCount}</strong>
          </p>
          <p><span>Continuous Effects</span><strong>{projectionSummary.continuousEffects.count}</strong></p>
          <p><span>Effect nextSeq</span><strong>{toScalar(projectionSummary.continuousEffects.nextSeq)}</strong></p>
          <p><span>Active Reveals</span><strong>{projectionSummary.reveals.activeCount}</strong></p>
          <p><span>Reveal nextSeq</span><strong>{toScalar(projectionSummary.reveals.nextSeq)}</strong></p>
        </div>
      </section>

      <details class="debug-section debug-raw" open>
        <summary class="debug-raw__summary">
          <span>Current UI Prompt JSON ({VIEW_LABELS[view]})</span>
          <button
                  type="button"
                  class="debug-copy-button"
                  onclick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void copySerializedJson(
                "interactionPrompt",
                serializedInteractionPrompt,
                "No interaction prompt available.",
              );
            }}
          >
            Copy JSON
          </button>
        </summary>
        <div class="debug-raw__body">
          {#if copyFeedback?.target === "interactionPrompt"}
            <p class:debug-copy-feedback={true} class:debug-copy-feedback--error={copyFeedback.tone === "error"}>
              {copyFeedback.message}
            </p>
          {/if}
          {#if interactionPromptParseError}
            <pre class="debug-sidebar__state debug-sidebar__state--raw">{interactionPromptParseError}</pre>
          {:else if parsedInteractionPrompt}
            <JSONTree value={parsedInteractionPrompt} />
          {:else}
            <pre class="debug-sidebar__state debug-sidebar__state--raw">No parsed interaction prompt available.</pre>
          {/if}
        </div>
      </details>

      <section class="debug-section">
        <h3>Zone Projection</h3>
        <table class="debug-table debug-table--dense">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Owner</th>
              <th>Count</th>
              <th>Private</th>
              <th>Revision</th>
              <th>Top Public Card</th>
            </tr>
          </thead>
          <tbody>
            {#each projectionSummary.zoneProjectionRows as row}
              <tr>
                <td>{row.baseZone}</td>
                <td>{row.ownerId}</td>
                <td>{toScalar(row.summaryCount)}</td>
                <td>{row.privateCardCount}</td>
                <td>{toScalar(row.revision)}</td>
                <td>{row.topPublicCardId}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>

      <section class="debug-section">
        <h3>Turn Metadata</h3>
        <table class="debug-table debug-table--dense">
          <thead>
            <tr>
              <th>Key</th>
              <th>Count</th>
              <th>Sample</th>
            </tr>
          </thead>
          <tbody>
            {#each projectionSummary.turnMetadata as row}
              <tr>
                <td>{row.key}</td>
                <td>{row.count}</td>
                <td>{row.sample.length === 0 ? "-" : row.sample.join(", ")}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>

      <section class="debug-section">
        <h3>Zone Definitions</h3>
        <table class="debug-table debug-table--dense">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Owner</th>
              <th>Visibility</th>
              <th>Ordered</th>
              <th>Owner Scoped</th>
              <th>Face Down</th>
            </tr>
          </thead>
          <tbody>
            {#each projectionSummary.zoneDefinitions as row}
              <tr>
                <td>{row.baseZone}</td>
                <td>{row.ownerId}</td>
                <td>{row.visibility}</td>
                <td>{toBooleanText(row.ordered)}</td>
                <td>{toBooleanText(row.ownerScoped)}</td>
                <td>{toBooleanText(row.faceDown)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>

      <section class="debug-section">
        <h3>Consistency Checks</h3>
        <p class="debug-check-summary">
          <strong>{projectionSummary.anomalies.length}</strong> issue(s)
        </p>
        {#if projectionSummary.anomalies.length === 0}
          <p class="debug-ok">All zone/card projection consistency checks passed.</p>
        {:else}
          <ol class="debug-issues">
            {#each projectionSummary.anomalies.slice(0, 60) as anomaly}
              <li>{anomaly}</li>
            {/each}
          </ol>
          {#if projectionSummary.anomalies.length > 60}
            <p class="debug-overflow">Showing first 60 anomalies.</p>
          {/if}
        {/if}
      </section>

      <details class="debug-section debug-raw" open>
        <summary class="debug-raw__summary">
          <span>Raw Board Projection JSON ({VIEW_LABELS[view]})</span>
          <button
                  type="button"
                  class="debug-copy-button"
                  onclick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void copySerializedJson(
                "boardProjection",
                serializedBoardProjection,
                "No board projection available.",
              );
            }}
          >
            Copy JSON
          </button>
        </summary>
        <div class="debug-raw__body">
          {#if copyFeedback?.target === "boardProjection"}
            <p class:debug-copy-feedback={true} class:debug-copy-feedback--error={copyFeedback.tone === "error"}>
              {copyFeedback.message}
            </p>
          {/if}
          {#if boardProjectionParseError}
            <pre class="debug-sidebar__state debug-sidebar__state--raw">{boardProjectionParseError}</pre>
          {:else if parsedBoardProjection}
            <JSONTree value={parsedBoardProjection} />
          {:else}
            <pre class="debug-sidebar__state debug-sidebar__state--raw">No parsed board projection available.</pre>
          {/if}
        </div>
      </details>

      <details class="debug-section debug-raw" open>
        <summary class="debug-raw__summary">
          <span>Raw Authoritative State JSON</span>
          <button
                  type="button"
                  class="debug-copy-button"
                  onclick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void copySerializedJson("state", serializedState, "No state available.");
            }}
          >
            Copy JSON
          </button>
        </summary>
        <div class="debug-raw__body">
          {#if copyFeedback?.target === "state"}
            <p class:debug-copy-feedback={true} class:debug-copy-feedback--error={copyFeedback.tone === "error"}>
              {copyFeedback.message}
            </p>
          {/if}
          <JSONTree value={parsedState} />
        </div>
      </details>
    </div>
  {:else}
    <pre class="debug-sidebar__state debug-sidebar__state--raw">No parsed projection summary available.</pre>
  {/if}
</Sidebar.Content>

<style>
  :global(.debug-sidebar__shell) {
    gap: 0;
    padding: 0;
    flex-shrink: 0;
    background: rgba(8, 18, 35, 0.96);
    border-bottom: 1px solid rgba(137, 179, 235, 0.2);
    color: #e3eeff;
    font-family: "Trebuchet MS", "Segoe UI", sans-serif;
  }

  .debug-sidebar__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.9rem 1rem;
    border-bottom: 1px solid rgba(137, 179, 235, 0.2);
    background: rgba(8, 18, 35, 0.96);
  }

  .debug-sidebar__header h2 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
  }

  .debug-sidebar__header p {
    margin: 0.18rem 0 0;
    color: #9fbcde;
    font-size: 0.78rem;
    line-height: 1.35;
  }

  .debug-sidebar__close,
  .debug-sidebar__refresh {
    border: 1px solid rgba(132, 172, 224, 0.36);
    border-radius: 8px;
    background: rgba(24, 45, 73, 0.95);
    color: #e3efff;
    font-family: inherit;
    font-size: 0.78rem;
    line-height: 1;
    padding: 0.5rem 0.7rem;
    cursor: pointer;
  }

  .debug-sidebar__close:hover,
  .debug-sidebar__refresh:hover {
    background: rgba(33, 63, 101, 0.95);
  }

  .debug-sidebar__meta {
    padding: 0.75rem 1rem 0.3rem;
    font-size: 0.8rem;
    color: #d4e4fb;
  }

  .debug-sidebar__meta p {
    margin: 0 0 0.33rem;
  }

  .debug-sidebar__actions {
    padding: 0.5rem 1rem 0.65rem;
    display: flex;
    align-items: flex-end;
    gap: 0.6rem;
    border-bottom: 1px solid rgba(137, 179, 235, 0.18);
  }

  .debug-sidebar__view {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.72rem;
    color: #b9d1f3;
  }

  .debug-sidebar__view select {
    border: 1px solid rgba(132, 172, 224, 0.36);
    border-radius: 8px;
    background: rgba(24, 45, 73, 0.95);
    color: #e3efff;
    font-family: inherit;
    font-size: 0.78rem;
    line-height: 1;
    padding: 0.5rem 0.6rem;
    cursor: pointer;
  }

  .debug-sidebar__view select:focus-visible {
    outline: 2px solid rgba(148, 190, 244, 0.7);
    outline-offset: 1px;
  }

  .debug-sidebar__state {
    --json-tree-string-color: #cb3f41;
    --json-tree-symbol-color: #cb3f41;
    --json-tree-boolean-color: #72f6ff;
    --json-tree-function-color: #72f6ff;
    --json-tree-number-color: #8bdbf7;
    --json-tree-label-color: #9ad4a3;
    --json-tree-property-color: #f2f7ff;
    --json-tree-arrow-color: #95b7de;
    --json-tree-operator-color: #95b7de;
    --json-tree-null-color: #b4bfd8;
    --json-tree-undefined-color: #8d8d8d;
    --json-tree-date-color: #b4bfd8;
    --json-tree-internal-color: #4f6078;
    --json-tree-regex-color: #cb3f41;
    --json-tree-li-indentation: 1em;
    --json-tree-li-line-height: 1.35;
    --json-tree-font-size: 0.72rem;
    --json-tree-font-family: "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace;

    flex: 1;
    min-height: 0;
    margin: 0;
    padding: 0.75rem 1rem 1rem;
    overflow: auto;
    background: rgba(4, 10, 19, 0.9);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  :global(.debug-sidebar__content) {
    gap: 0;
    overflow: hidden;
    background: rgba(4, 10, 19, 0.9);
    color: #e3eeff;
    font-family: "Trebuchet MS", "Segoe UI", sans-serif;
  }

  .debug-sidebar__state :global(ul) {
    margin: 0;
    padding-left: 0;
  }

  .debug-sidebar__state--raw {
    white-space: pre;
    color: #cde0fb;
    font-size: 0.72rem;
    line-height: 1.35;
    overflow: auto;
  }

  .debug-section {
    border: 1px solid rgba(137, 179, 235, 0.16);
    border-radius: 10px;
    background: rgba(8, 19, 35, 0.66);
    padding: 0.7rem 0.75rem;
  }

  .debug-section--animation {
      background: linear-gradient(180deg, rgba(9, 24, 45, 0.92) 0%, rgba(7, 17, 32, 0.82) 100%);
      box-shadow: inset 0 1px 0 rgba(203, 238, 255, 0.06),
      0 16px 36px rgba(2, 8, 18, 0.26);
  }

  .debug-section__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.7rem;
  }

  .debug-section__header p {
      margin: 0.2rem 0 0;
      color: #b4ccec;
      font-size: 0.72rem;
      line-height: 1.35;
  }

  .debug-animation-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.55rem;
      margin-bottom: 0.65rem;
  }

  .debug-animation-form label {
      display: grid;
      gap: 0.28rem;
  }

  .debug-animation-form span {
      font-size: 0.66rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #9bb8dd;
  }

  .debug-animation-form input,
  .debug-animation-form select {
      width: 100%;
      border: 1px solid rgba(137, 179, 235, 0.18);
      border-radius: 8px;
      background: rgba(6, 14, 27, 0.88);
      padding: 0.55rem 0.6rem;
      color: #eef6ff;
      font-size: 0.78rem;
  }

  .debug-animation-checkbox {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.4rem;
  }

  .debug-animation-checkbox input[type="checkbox"] {
    width: auto;
  }

  .debug-animation-hint {
    margin: 0.45rem 0 0;
    font-size: 0.68rem;
    color: #8badc8;
    line-height: 1.4;
  }

  .debug-animation-status {
    margin: 0.55rem 0 0;
    font-size: 0.72rem;
    color: #b8edff;
  }

  .debug-animation-status--error {
    color: #ffd6d8;
  }

  .debug-section h3 {
    margin: 0 0 0.5rem;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #9ec7fb;
  }

  .debug-kv-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 0.35rem 0.55rem;
  }

  .debug-kv-grid p {
    margin: 0;
    border: 1px solid rgba(137, 179, 235, 0.12);
    border-radius: 8px;
    background: rgba(7, 15, 30, 0.7);
    padding: 0.35rem 0.45rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .debug-kv-grid span {
    color: #9bb8dd;
    font-size: 0.66rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .debug-kv-grid strong {
    color: #eef6ff;
    font-size: 0.73rem;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  .debug-inline-list {
    margin: 0.55rem 0 0;
    padding: 0.45rem;
    border-radius: 8px;
    border: 1px solid rgba(137, 179, 235, 0.12);
    background: rgba(7, 15, 30, 0.7);
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .debug-inline-list span {
    font-size: 0.66rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #9bb8dd;
  }

  .debug-inline-list strong {
    font-size: 0.72rem;
    color: #eef6ff;
    overflow-wrap: anywhere;
  }

  .debug-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.72rem;
  }

  .debug-table th,
  .debug-table td {
    border: 1px solid rgba(137, 179, 235, 0.16);
    padding: 0.32rem 0.42rem;
    text-align: left;
    vertical-align: top;
  }

  .debug-table th {
    background: rgba(20, 38, 62, 0.95);
    color: #c6dcfa;
    font-size: 0.66rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .debug-table td {
    color: #ebf4ff;
    background: rgba(8, 16, 31, 0.8);
    overflow-wrap: anywhere;
  }

  .debug-table--dense th,
  .debug-table--dense td {
    font-size: 0.69rem;
    padding: 0.26rem 0.38rem;
  }

  .debug-check-summary {
    margin: 0 0 0.4rem;
    font-size: 0.74rem;
    color: #dceafc;
  }

  .debug-ok {
    margin: 0;
    font-size: 0.72rem;
    color: #a7f7cf;
  }

  .debug-issues {
    margin: 0;
    padding-left: 1rem;
    display: grid;
    gap: 0.22rem;
    font-size: 0.69rem;
    color: #ffd6d8;
  }

  .debug-overflow {
    margin: 0.45rem 0 0;
    font-size: 0.68rem;
    color: #ffdeb3;
  }

  .debug-raw summary {
    cursor: pointer;
    font-size: 0.74rem;
    color: #c8ddfa;
  }

  .debug-raw__summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .debug-copy-button {
    border: 1px solid rgba(132, 172, 224, 0.28);
    border-radius: 999px;
    background: rgba(18, 37, 60, 0.92);
    color: #e3efff;
    font-family: inherit;
    font-size: 0.68rem;
    line-height: 1;
    padding: 0.4rem 0.65rem;
    cursor: pointer;
  }

  .debug-copy-button:hover {
    background: rgba(28, 55, 88, 0.96);
  }

  .debug-raw__body {
    margin-top: 0.55rem;
    border-top: 1px solid rgba(137, 179, 235, 0.16);
    padding-top: 0.55rem;
  }

  .debug-copy-feedback {
    margin: 0 0 0.55rem;
    font-size: 0.69rem;
    color: #9fe9bf;
  }

  .debug-copy-feedback--error {
    color: #ffd6d8;
  }
</style>
