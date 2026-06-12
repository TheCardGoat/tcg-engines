<script lang="ts">
    import type {ActionCandidate} from "@/features/simulator/model/contracts.js";

  interface ActionBarProps {
    candidates: ActionCandidate[];
    challengeMode?: boolean;
    onAction?: (candidate: ActionCandidate) => void;
  }

  let { candidates, challengeMode = false, onAction }: ActionBarProps = $props();
</script>

<section class="action-bar" aria-label="Actions">
  <header class="action-bar-header">
    <h2>Actions</h2>
    {#if challengeMode}
      <span class="challenge-state">Challenge Mode</span>
    {/if}
  </header>

  {#if candidates.length === 0}
    <p class="empty">Select a card to see contextual actions.</p>
  {:else}
    <div class="action-list">
      {#each candidates as candidate (candidate.id)}
        <button
          type="button"
          class="action-btn"
          class:action-btn--disabled={!candidate.enabled}
          onclick={() => onAction?.(candidate)}
          disabled={!candidate.enabled}
          aria-label={candidate.reason ? `${candidate.label}: ${candidate.reason}` : candidate.label}
          title={candidate.reason ?? candidate.label}
        >
          <span class="label">{candidate.label}</span>
        </button>
        {#if candidate.reason && !candidate.enabled}
          <p class="reason">{candidate.reason}</p>
        {/if}
      {/each}
    </div>
  {/if}
</section>

<style>
  .action-bar {
    background: rgba(12, 22, 36, 0.82);
    border: 1px solid rgba(109, 149, 195, 0.3);
    border-radius: 12px;
    padding: 0.9rem;
  }

  .action-bar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.8rem;
  }

  h2 {
    margin: 0;
    font-size: 0.76rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #94a3b8;
  }

  .challenge-state {
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

  .empty {
    margin: 0;
    color: #93a6bd;
    font-size: 0.8rem;
  }

  .action-list {
    display: grid;
    gap: 0.5rem;
  }

  .action-btn {
    width: 100%;
    border: 1px solid rgba(109, 149, 195, 0.35);
    background: rgba(19, 38, 60, 0.75);
    border-radius: 8px;
    color: #e2e8f0;
    padding: 0.45rem 0.6rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: background 140ms ease, border-color 140ms ease, transform 140ms ease;
  }

  .action-btn:hover:enabled {
    background: rgba(29, 58, 92, 0.9);
    border-color: rgba(125, 187, 242, 0.55);
    transform: translateY(-1px);
  }

  .action-btn--disabled,
  .action-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .label {
    font-size: 0.82rem;
  }

  .reason {
    margin: -0.2rem 0 0;
    font-size: 0.72rem;
    color: #fca5a5;
  }
</style>
