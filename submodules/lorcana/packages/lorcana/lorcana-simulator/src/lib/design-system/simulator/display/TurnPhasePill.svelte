<script lang="ts">
  type PillVariant = "default" | "active" | "p1" | "p2";

  interface TurnPhasePillProps {
    label: string;
    variant?: PillVariant;
  }

  let { label, variant = "default" }: TurnPhasePillProps = $props();

  const variantClasses: Record<PillVariant, string> = {
    default: "pill--default",
    active: "pill--active",
    p1: "pill--p1",
    p2: "pill--p2",
  };
</script>

<span class="turn-phase-pill {variantClasses[variant]}">
  {label}
</span>

<style>
  .turn-phase-pill {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #dbeafe;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    background: rgba(15, 30, 50, 0.6);
    border: 1px solid rgba(100, 150, 200, 0.2);
  }

  .pill--active {
    background: rgba(30, 60, 100, 0.8);
    border-color: rgba(100, 180, 255, 0.4);
    box-shadow: 0 0 12px rgba(100, 180, 255, 0.2);
  }

  .pill--p1 {
    color: #7cc4ff;
    background: rgba(30, 80, 130, 0.5);
    border-color: rgba(124, 196, 255, 0.3);
  }

  .pill--p2 {
    color: #ff8f8f;
    background: rgba(130, 50, 50, 0.5);
    border-color: rgba(255, 143, 143, 0.3);
  }
</style>
