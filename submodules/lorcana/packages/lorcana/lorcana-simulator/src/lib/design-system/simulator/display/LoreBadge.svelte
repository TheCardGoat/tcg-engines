<script lang="ts">
  import { m } from "$lib/i18n/messages.js";

  interface LoreBadgeProps {
    value: number;
    max?: number;
    size?: "small" | "medium" | "large";
    variant?: "default" | "winning" | "losing";
  }

  let {
    value,
    max = 20,
    size = "medium",
    variant = "default",
  }: LoreBadgeProps = $props();

  const sizeClasses = {
    small: "badge--small",
    medium: "badge--medium",
    large: "badge--large",
  };

  const variantClasses = {
    default: "badge--default",
    winning: "badge--winning",
    losing: "badge--losing",
  };

  const percentage = $derived(Math.min((value / max) * 100, 100));
</script>

<div class="lore-badge {sizeClasses[size]} {variantClasses[variant]}">
  <div class="badge-ring">
    <svg viewBox="0 0 36 36">
      <path
        class="badge-ring-bg"
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        class="badge-ring-fill"
        stroke-dasharray="{percentage}, 100"
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
      />
    </svg>
    <span class="badge-value">{value}</span>
  </div>
  <span class="badge-label">{m["sim.lore.label"]({})}</span>
</div>

<style>
  .lore-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .badge-ring {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .badge-ring svg {
    transform: rotate(-90deg);
  }

  .badge-ring-bg {
    fill: none;
    stroke: rgba(100, 150, 200, 0.2);
    stroke-width: 3;
  }

  .badge-ring-fill {
    fill: none;
    stroke: #fbbf24;
    stroke-width: 3;
    stroke-linecap: round;
    transition: stroke-dasharray 300ms ease;
  }

  .badge-value {
    position: absolute;
    font-weight: 800;
    color: #fbbf24;
    text-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
  }

  .badge-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
  }

  /* Sizes */
  .badge--small svg {
    width: 32px;
    height: 32px;
  }
  .badge--small .badge-value {
    font-size: 0.75rem;
  }

  .badge--medium svg {
    width: 48px;
    height: 48px;
  }
  .badge--medium .badge-value {
    font-size: 1rem;
  }

  .badge--large svg {
    width: 64px;
    height: 64px;
  }
  .badge--large .badge-value {
    font-size: 1.25rem;
  }

  /* Variants */
  .badge--winning .badge-ring-fill {
    stroke: #10b981;
  }
  .badge--winning .badge-value {
    color: #10b981;
    text-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
  }

  .badge--losing .badge-ring-fill {
    stroke: #ef4444;
  }
  .badge--losing .badge-value {
    color: #ef4444;
    text-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
  }
</style>
