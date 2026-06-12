<script lang="ts">
    import type {LorcanaCardSnapshot} from "@/features/simulator/model/contracts.js";

  interface CardTooltipProps {
    card: LorcanaCardSnapshot;
    x: number;
    y: number;
  }

  let { card, x, y }: CardTooltipProps = $props();

  let tooltipX = $derived(Math.min(x + 20, window.innerWidth - 250));
  let tooltipY = $derived(Math.min(y - 50, window.innerHeight - 220));
</script>

<div class="card-tooltip" style:left="{tooltipX}px" style:top="{Math.max(tooltipY, 10)}px">
  <header>
    <h3>{card.label}</h3>
    <span>{card.cardType ?? "card"}</span>
  </header>

  <div class="rows">
    <p><strong>Cost:</strong> {card.cost ?? 0}</p>
    <p><strong>State:</strong> {card.readyState ?? "ready"}</p>
    <p><strong>Damage:</strong> {card.damage ?? 0}</p>
  </div>
</div>

<style>
  .card-tooltip {
    position: fixed;
    width: 230px;
    background: rgba(15, 25, 40, 0.98);
    border: 1px solid rgba(100, 150, 200, 0.3);
    border-radius: 12px;
    padding: 0.65rem;
    box-shadow:
      0 20px 50px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    pointer-events: none;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.4rem;
    margin-bottom: 0.45rem;
  }

  h3 {
    margin: 0;
    font-size: 0.84rem;
    color: #f8fafc;
    line-height: 1.2;
  }

  span {
    font-size: 0.63rem;
    color: #cbd5e1;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .rows {
    display: grid;
    gap: 0.2rem;
  }

  p {
    margin: 0;
    font-size: 0.74rem;
    color: #dbeafe;
  }

  strong {
    color: #94a3b8;
  }
</style>
