<script lang="ts">
  import EyeOff from "@lucide/svelte/icons/eye-off";

  interface Props {
    visible: boolean;
  }

  const { visible }: Props = $props();
</script>

{#if visible}
  <div class="afk-indicator" role="status" aria-label="Opponent is away from keyboard">
    <EyeOff class="shrink-0" size={12} />
    <span>Away</span>
  </div>
{/if}

<style>
  .afk-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.15rem 0.5rem;
    border-radius: 9999px;
    background: rgba(217, 119, 6, 0.85);
    color: #fff;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    pointer-events: none;
    animation: afk-fade-in 0.3s ease-out both;
  }

  @keyframes afk-fade-in {
    from {
      opacity: 0;
      transform: translateY(-3px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
