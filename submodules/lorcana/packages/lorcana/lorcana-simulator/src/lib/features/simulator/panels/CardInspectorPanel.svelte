<script lang="ts">
    import type {LorcanaCardSnapshot} from "@/features/simulator/model/contracts.js";

  interface CardInspectorPanelProps {
    card: LorcanaCardSnapshot | null;
  }

  let { card }: CardInspectorPanelProps = $props();
</script>

<section class="card-inspector" aria-label="Card inspector">
  <h2>Card Inspector</h2>

  {#if !card}
    <p class="empty">Select a card to inspect full details.</p>
  {:else}
    <div class="head">
      <h3>{card.label}</h3>
      <span class="type">{card.cardType ?? "unknown"}</span>
    </div>

    <div class="stats">
      <span><strong>Cost</strong> {card.cost ?? 0}</span>
      <span><strong>Strength</strong> {card.strength ?? 0}</span>
      <span><strong>Willpower</strong> {card.willpower ?? 0}</span>
      <span><strong>Lore</strong> {card.loreValue ?? 0}</span>
      <span><strong>Damage</strong> {card.damage ?? 0}</span>
      <span><strong>State</strong> {card.readyState ?? "ready"}</span>
      <span><strong>Drying</strong> {card.isDrying ? "Yes" : "No"}</span>
      <span><strong>Zone</strong> {card.zoneId}</span>
    </div>

    <div class="ink-row">
      <strong>Ink:</strong>
      {#if card.inkType?.length}
        <span>{card.inkType.join(", ")}</span>
      {:else}
        <span>n/a</span>
      {/if}
    </div>

    <div class="rules">
      <strong>Rules Text</strong>
      <p>{card.text ?? "No rules text projected for this card."}</p>
    </div>
  {/if}
</section>

<style>
  .card-inspector {
    background: rgba(12, 22, 36, 0.82);
    border: 1px solid rgba(109, 149, 195, 0.3);
    border-radius: 12px;
    padding: 0.9rem;
  }

  h2 {
    margin: 0 0 0.75rem;
    font-size: 0.76rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #94a3b8;
  }

  .empty {
    margin: 0;
    color: #93a6bd;
    font-size: 0.8rem;
  }

  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.7rem;
  }

  h3 {
    margin: 0;
    font-size: 0.95rem;
    color: #f8fafc;
  }

  .type {
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #bfdbfe;
    background: rgba(30, 58, 138, 0.35);
    border-radius: 999px;
    border: 1px solid rgba(96, 165, 250, 0.4);
    padding: 0.18rem 0.45rem;
  }

  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.35rem 0.5rem;
    margin-bottom: 0.7rem;
  }

  .stats span,
  .ink-row {
    font-size: 0.78rem;
    color: #d5e2f1;
  }

  strong {
    color: #94a3b8;
    font-weight: 700;
    margin-right: 0.25rem;
  }

  .ink-row {
    margin-bottom: 0.7rem;
  }

  .rules strong {
    display: block;
    margin-bottom: 0.35rem;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .rules p {
    margin: 0;
    white-space: pre-wrap;
    line-height: 1.45;
    color: #e2e8f0;
    font-size: 0.8rem;
  }
</style>
