import { getGrandArchiveCard } from "@tcg/grand-archive-cards";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
import { useGrandArchiveInteractionWorkspace } from "./GrandArchiveInteractionLayer";

/** Read-only combat context. Every transition and Opportunity owner comes from the engine. */
export function GrandArchiveCombatFlow({
  fixture,
}: {
  readonly fixture: GrandArchiveHarnessFixture;
}) {
  const workspace = useGrandArchiveInteractionWorkspace();
  const combat = fixture.combatView;
  const preparing = Boolean(workspace.attackSourceId);
  const self = fixture.table.seats.find((seat) => seat.perspective === "bottom")?.id;
  const pendingEffects = fixture.table.zones.find((zone) => zone.id === "effects-stack")?.entityIds
    .length;
  const step = preparing ? "declaration" : combat?.active ? combat.combat.step : undefined;
  const stackId = fixture.table.zones.find((zone) => zone.id === "effects-stack")?.entityIds.at(-1);
  const top = fixture.entities.find((entity) => entity.id === stackId && entity.face === "public");
  const definitionId = top?.dataAttributes?.["data-definition-id"];
  const attackActivation =
    !step &&
    typeof definitionId === "string" &&
    getGrandArchiveCard(definitionId)?.types.includes("ATTACK");
  if (!step && !attackActivation) return null;
  const decision = combat?.active ? combat.decision : null;
  const actor =
    decision?.playerId ??
    ("playerId" in fixture.waitState ? fixture.waitState.playerId : undefined);
  const own = actor === self;
  const window = attackActivation
    ? "Before attack-card resolution"
    : preparing
      ? "Prepare attack"
      : decision?.kind === "choose-retaliators"
        ? "Choose retaliation"
        : decision?.kind === "order-retaliation-damage"
          ? "Order retaliation"
          : decision?.kind === "choose-replacement"
            ? "Apply replacement"
            : decision
              ? "Combat choice"
              : fixture.waitState.kind === "resolving"
                ? step === "damage"
                  ? "Dealing damage"
                  : "Resolving combat"
                : pendingEffects
                  ? "Respond to combat effects"
                  : step === "retaliation"
                    ? "Before retaliation"
                    : step === "damage"
                      ? "Before damage"
                      : step === "end"
                        ? "End of combat"
                        : "Declare attack";
  const opportunity = !preparing && fixture.waitState.kind === "opportunity";
  const status = preparing
    ? "No Opportunity during declaration"
    : opportunity
      ? `Opportunity · ${own ? "You may act" : "Opponent may act"}`
      : decision
        ? `${own ? "Your choice" : "Opponent choosing"} · No Opportunity`
        : `No Opportunity · resolving ${step === "damage" ? "damage" : "combat"}`;
  const steps = ["declaration", "retaliation", "damage", "end"];
  return (
    <section className="ga-combat-flow" aria-label="Combat flow">
      {step ? (
        <ol aria-label="Combat steps">
          {steps.map((item, index) => (
            <li
              key={item}
              aria-current={item === step ? "step" : undefined}
              data-complete={index < steps.indexOf(step) || undefined}
            >
              {["Declare", "Retaliation", "Damage", "End"][index]}
            </li>
          ))}
        </ol>
      ) : null}
      <div role="status" aria-live="polite">
        <strong>{window}</strong>
        <span>{status}</span>
      </div>
    </section>
  );
}
