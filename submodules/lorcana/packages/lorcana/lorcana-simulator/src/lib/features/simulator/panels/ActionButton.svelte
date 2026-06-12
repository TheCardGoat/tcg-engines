<script lang="ts">
    import type {ActionCandidate} from "@/features/simulator/model/contracts.js";

  interface ActionButtonProps {
    action: ActionCandidate;
    onClick?: (action: ActionCandidate) => void;
  }

  let { action, onClick }: ActionButtonProps = $props();
</script>

<div class="action-button-wrapper">
  <button
    type="button"
    class="action-button"
    class:action-button--disabled={!action.enabled}
    onclick={() => onClick?.(action)}
    disabled={!action.enabled}
    aria-label={action.reason ? `${action.label}: ${action.reason}` : action.label}
    title={action.reason ?? action.label}
  >
    <span class="action-label">{action.label}</span>
  </button>
  {#if action.reason && !action.enabled}
    <p class="action-reason">{action.reason}</p>
  {/if}
</div>

<style>
  .action-button-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .action-button {
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

  .action-button:hover:enabled {
    background: rgba(29, 58, 92, 0.9);
    border-color: rgba(125, 187, 242, 0.55);
    transform: translateY(-1px);
  }

  .action-button--disabled,
  .action-button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .action-label {
    font-size: 0.82rem;
  }

  .action-reason {
    margin: 0;
    font-size: 0.72rem;
    color: #fca5a5;
    padding-left: 0.5rem;
  }
</style>
