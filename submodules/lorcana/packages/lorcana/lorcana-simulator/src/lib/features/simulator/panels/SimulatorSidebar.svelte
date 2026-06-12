<script lang="ts">
    import type {
        LorcanaCardSnapshot,
        ActionCandidate,
        MoveLogEntrySnapshot,
        LorcanaPlayerSide
    } from "@/features/simulator/model/contracts.js";
    import PlayerInfo from "./PlayerInfo.svelte";
    import ActionButton from "./ActionButton.svelte";
    import LogEntry from "./LogEntry.svelte";
    import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
    import EmptyState from "@/design-system/simulator/display/EmptyState.svelte";

  interface SimulatorSidebarProps {
    // Player info
    playerOneName: string;
    playerTwoName: string;
    playerOneLore: number;
    playerTwoLore: number;
    playerOneDeckCount: number;
    playerTwoDeckCount: number;
    playerOneHandCount: number;
    playerTwoHandCount: number;
    activeSide?: LorcanaPlayerSide;
    interactiveSide?: LorcanaPlayerSide | null;

    // Inspector
    selectedCard: LorcanaCardSnapshot | null;

    // Actions
    actionCandidates: ActionCandidate[];
    challengeMode?: boolean;
    onAction?: (action: ActionCandidate) => void;

    // Event log
    logEntries: MoveLogEntrySnapshot[];
  }

  let {
    playerOneName,
    playerTwoName,
    playerOneLore,
    playerTwoLore,
    playerOneDeckCount,
    playerTwoDeckCount,
    playerOneHandCount,
    playerTwoHandCount,
    activeSide,
    interactiveSide,
    selectedCard,
    actionCandidates,
    challengeMode = false,
    onAction,
    logEntries,
  }: SimulatorSidebarProps = $props();
</script>

<div class="simulator-sidebar">
  <!-- Opponent Info -->
  <section class="sidebar-section">
    <h2>Opponent</h2>
    <PlayerInfo
      name={playerTwoName}
      side="playerTwo"
      lore={playerTwoLore}
      deckCount={playerTwoDeckCount}
      handCount={playerTwoHandCount}
      discardCount={0}
      inkwellCount={0}
      availableInk={0}
      isActive={activeSide === "playerTwo"}
      isOpponent={true}
    />
  </section>

  <!-- Card Inspector -->
  <section class="sidebar-section sidebar-section--inspector">
    <h2>Card Inspector</h2>
    {#if !selectedCard}
      <div class="inspector-empty">
        <EmptyState icon="🔍" label="Select a card to inspect" />
      </div>
    {:else}
      <div class="inspector-content">
        <div class="inspector-card-preview">
          <LorcanaCard
            card={selectedCard}
            size="large"
            imageFormat="full"
            isExerted={selectedCard.readyState === "exerted"}
            isDrying={selectedCard.isDrying ?? false}
            damage={selectedCard.damage ?? 0}
          />
        </div>
        <div class="inspector-details">
          <h3>{selectedCard.label}</h3>
          <span class="card-type">{selectedCard.cardType ?? "unknown"}</span>

          <div class="stats-grid">
            <div class="stat">
              <span class="stat-label">Cost</span>
              <span class="stat-value">{selectedCard.cost ?? 0}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Strength</span>
              <span class="stat-value">{selectedCard.strength ?? 0}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Willpower</span>
              <span class="stat-value">{selectedCard.willpower ?? 0}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Lore</span>
              <span class="stat-value">{selectedCard.loreValue ?? 0}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Damage</span>
              <span class="stat-value">{selectedCard.damage ?? 0}</span>
            </div>
            <div class="stat">
              <span class="stat-label">State</span>
              <span class="stat-value">{selectedCard.readyState ?? "ready"}</span>
            </div>
          </div>

          {#if selectedCard.text}
            <div class="rules-text">
              <strong>Rules Text</strong>
              <p>{selectedCard.text}</p>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </section>

  <!-- Actions -->
  <section class="sidebar-section">
    <div class="section-header">
      <h2>Actions</h2>
      {#if challengeMode}
        <span class="challenge-badge">Challenge Mode</span>
      {/if}
    </div>
    {#if actionCandidates.length === 0}
      <p class="actions-empty">Select a card to see contextual actions.</p>
    {:else}
      <div class="actions-list">
        {#each actionCandidates as action (action.id)}
          <ActionButton {action} onClick={onAction} />
        {/each}
      </div>
    {/if}
  </section>

  <!-- Event Log -->
  <section class="sidebar-section sidebar-section--log">
    <h2>Event Log</h2>
    {#if logEntries.length === 0}
      <p class="log-empty">No moves recorded yet.</p>
    {:else}
      <div class="log-list">
        {#each [...logEntries].reverse() as entry (entry.id)}
          <LogEntry {entry} />
        {/each}
      </div>
    {/if}
  </section>

  <!-- Your Info -->
  <section class="sidebar-section">
    <h2>You</h2>
    <PlayerInfo
      name={playerOneName}
      side="playerOne"
      lore={playerOneLore}
      deckCount={playerOneDeckCount}
      handCount={playerOneHandCount}
      discardCount={0}
      inkwellCount={0}
      availableInk={0}
      isActive={activeSide === "playerOne"}
      isOpponent={false}
    />
  </section>
</div>

<style>
  .simulator-sidebar {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    height: 100%;
    overflow-y: auto;
  }

  .sidebar-section {
    background: rgba(12, 22, 36, 0.82);
    border: 1px solid rgba(109, 149, 195, 0.3);
    border-radius: 12px;
    padding: 0.9rem;
  }

  .sidebar-section--inspector {
    flex: 1;
    min-height: 200px;
    display: flex;
    flex-direction: column;
  }

  .sidebar-section--log {
    flex: 1;
    min-height: 150px;
    display: flex;
    flex-direction: column;
  }

  h2 {
    margin: 0 0 0.75rem;
    font-size: 0.76rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #94a3b8;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .challenge-badge {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #fde68a;
    background: rgba(180, 83, 9, 0.28);
    border: 1px solid rgba(217, 119, 6, 0.45);
    border-radius: 999px;
    padding: 0.2rem 0.5rem;
  }

  /* Inspector */
  .inspector-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .inspector-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .inspector-card-preview {
    display: flex;
    justify-content: center;
    padding: 0.5rem;
  }

  .inspector-details h3 {
    margin: 0 0 0.35rem;
    font-size: 0.95rem;
    color: #f8fafc;
  }

  .card-type {
    display: inline-block;
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #bfdbfe;
    background: rgba(30, 58, 138, 0.35);
    border-radius: 999px;
    border: 1px solid rgba(96, 165, 250, 0.4);
    padding: 0.18rem 0.45rem;
    margin-bottom: 0.75rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .stat {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.35rem 0.5rem;
    background: rgba(15, 30, 50, 0.5);
    border-radius: 6px;
  }

  .stat-label {
    font-size: 0.7rem;
    color: #94a3b8;
  }

  .stat-value {
    font-size: 0.8rem;
    font-weight: 700;
    color: #e2e8f0;
  }

  .rules-text {
    padding: 0.5rem;
    background: rgba(15, 30, 50, 0.5);
    border-radius: 6px;
  }

  .rules-text strong {
    display: block;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 0.35rem;
  }

  .rules-text p {
    margin: 0;
    font-size: 0.8rem;
    line-height: 1.45;
    color: #e2e8f0;
  }

  /* Actions */
  .actions-empty {
    margin: 0;
    color: #93a6bd;
    font-size: 0.8rem;
  }

  .actions-list {
    display: grid;
    gap: 0.5rem;
  }

  /* Log */
  .log-empty {
    margin: 0;
    color: #93a6bd;
    font-size: 0.8rem;
  }

  .log-list {
    overflow: auto;
    max-height: 200px;
    display: grid;
    gap: 0.45rem;
  }

  /* Scrollbar styling */
  .simulator-sidebar::-webkit-scrollbar,
  .log-list::-webkit-scrollbar {
    width: 6px;
  }

  .simulator-sidebar::-webkit-scrollbar-track,
  .log-list::-webkit-scrollbar-track {
    background: rgba(15, 30, 50, 0.3);
    border-radius: 3px;
  }

  .simulator-sidebar::-webkit-scrollbar-thumb,
  .log-list::-webkit-scrollbar-thumb {
    background: rgba(100, 150, 200, 0.3);
    border-radius: 3px;
  }

  .simulator-sidebar::-webkit-scrollbar-thumb:hover,
  .log-list::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 150, 200, 0.5);
  }
</style>
