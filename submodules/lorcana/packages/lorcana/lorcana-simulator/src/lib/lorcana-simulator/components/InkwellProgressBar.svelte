<script lang="ts">
  interface InkwellProgressBarProps {
    available: number;
    total: number;
    maxExpected?: number;
    isPlayerTurn?: boolean;
    onClick?: () => void;
  }

  let {
    available,
    total,
    maxExpected = 10,
    isPlayerTurn = false,
    onClick,
  }: InkwellProgressBarProps = $props();

  // Calculate segments to display
  const displayMax = $derived(Math.max(maxExpected, total));
  const segments = $derived(Array.from({ length: displayMax }, (_, i) => i));
  
  function getSegmentState(index: number): 'available' | 'exerted' | 'empty' {
    if (index < available) return 'available';
    if (index < total) return 'exerted';
    return 'empty';
  }

  function getStatusColor(): string {
    if (available === 0) return '#ef4444'; // Red - no ink
    if (available <= 2) return '#f59e0b'; // Yellow - low ink
    return '#10b981'; // Green - good ink
  }
</script>

<div 
  class="inkwell-progress"
  class:inkwell-progress--active={isPlayerTurn}
  role="status"
  aria-label="Ink available: {available} of {total}"
  title="{available} ink available out of {total} total"
>
  <div class="inkwell-header">
    <span class="inkwell-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    </span>
    <span class="inkwell-label">Ink</span>
    <span class="inkwell-value" style:color={getStatusColor()}>
      {available}/{total}
    </span>
  </div>

  {#if onClick}
    <button type="button" class="inkwell-segments inkwell-segments--button" onclick={onClick}>
      {#each segments as index (index)}
        {@const state = getSegmentState(index)}
        <div 
          class="ink-segment"
          class:ink-segment--available={state === 'available'}
          class:ink-segment--exerted={state === 'exerted'}
          class:ink-segment--empty={state === 'empty'}
          style:animation-delay="{index * 50}ms"
        >
          {#if state === 'available'}
            <div class="ink-drop"></div>
          {/if}
        </div>
      {/each}
    </button>
  {:else}
    <div class="inkwell-segments">
      {#each segments as index (index)}
        {@const state = getSegmentState(index)}
        <div 
          class="ink-segment"
          class:ink-segment--available={state === 'available'}
          class:ink-segment--exerted={state === 'exerted'}
          class:ink-segment--empty={state === 'empty'}
          style:animation-delay="{index * 50}ms"
        >
          {#if state === 'available'}
            <div class="ink-drop"></div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  {#if available === 0 && total > 0}
    <div class="inkwell-warning">
      <span>No ink available</span>
    </div>
  {:else if available <= 2 && available > 0}
    <div class="inkwell-warning inkwell-warning--low">
      <span>Low ink</span>
    </div>
  {/if}
</div>

<style>
  .inkwell-progress {
    --segment-size: 20px;
    --segment-gap: 3px;
    --available-color: #10b981;
    --exerted-color: #4b5563;
    --empty-color: rgba(75, 85, 99, 0.2);
    
    background: rgba(15, 25, 40, 0.6);
    border: 1px solid rgba(100, 150, 200, 0.15);
    border-radius: 12px;
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 200px;
    transition: all 200ms ease;
  }

  .inkwell-progress--active {
    background: rgba(15, 40, 30, 0.7);
    border-color: rgba(16, 185, 129, 0.3);
    box-shadow: 
      0 0 20px rgba(16, 185, 129, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .inkwell-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
  }

  .inkwell-icon {
    width: 18px;
    height: 18px;
    color: rgba(150, 180, 210, 0.8);
  }

  .inkwell-label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(150, 180, 210, 0.8);
  }

  .inkwell-value {
    font-size: 0.9rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    transition: color 200ms ease;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  .inkwell-segments {
    display: flex;
    gap: var(--segment-gap);
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .inkwell-segments--button {
    background: none;
    border: 0;
    padding: 0;
    width: 100%;
    cursor: pointer;
  }

  .ink-segment {
    width: var(--segment-size);
    height: calc(var(--segment-size) * 1.5);
    border-radius: 4px;
    transition: all 200ms ease;
    position: relative;
    overflow: hidden;
  }

  .ink-segment--available {
    background: linear-gradient(
      180deg,
      #34d399 0%,
      var(--available-color) 50%,
      #059669 100%
    );
    box-shadow: 
      0 2px 8px rgba(16, 185, 129, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    animation: segment-appear 0.3s ease-out;
  }

  .ink-segment--exerted {
    background: linear-gradient(
      180deg,
      #6b7280 0%,
      var(--exerted-color) 50%,
      #374151 100%
    );
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
    opacity: 0.6;
  }

  .ink-segment--empty {
    background: var(--empty-color);
    border: 1px dashed rgba(100, 150, 200, 0.2);
  }

  @keyframes segment-appear {
    0% {
      transform: scale(0) translateY(-10px);
      opacity: 0;
    }
    50% {
      transform: scale(1.1) translateY(2px);
      opacity: 1;
    }
    100% {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }

  .ink-drop {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    animation: ink-shine 2s ease-in-out infinite;
  }

  @keyframes ink-shine {
    0%, 100% { 
      opacity: 0.3;
      transform: translate(-50%, -50%) scale(1);
    }
    50% { 
      opacity: 0.6;
      transform: translate(-50%, -50%) scale(1.2);
    }
  }

  .inkwell-warning {
    text-align: center;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #ef4444;
    padding: 0.25rem;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 4px;
    animation: warning-pulse 1.5s ease-in-out infinite;
  }

  .inkwell-warning--low {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
  }

  @keyframes warning-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  /* Hover effects */
  .inkwell-segments:hover .ink-segment--available {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  /* Active turn glow animation */
  .inkwell-progress--active .ink-segment--available {
    animation: segment-glow 2s ease-in-out infinite;
  }

  @keyframes segment-glow {
    0%, 100% {
      box-shadow: 
        0 2px 8px rgba(16, 185, 129, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    50% {
      box-shadow: 
        0 2px 12px rgba(16, 185, 129, 0.6),
        0 0 15px rgba(16, 185, 129, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .ink-segment,
    .ink-drop,
    .inkwell-warning,
    .inkwell-progress--active .ink-segment--available {
      animation: none;
    }
  }
</style>
