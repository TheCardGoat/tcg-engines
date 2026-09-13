import { ActionIcon, Tooltip } from "@mantine/core";
import type { SimulatorEntity, SimulatorTable } from "@tcg/simulator-contract";
import { GrandArchiveRoleCard } from "./GrandArchiveRoleCard";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Flag,
  Flame,
  Shield,
  Swords,
} from "lucide-react";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";

const STEPS = [
  {
    id: "declaration",
    label: "Declaration",
    Icon: Swords,
    description:
      "Declare the attacker, wielded objects and defenders. No Opportunity is given during declaration.",
  },
  {
    id: "retaliation",
    label: "Retaliation",
    Icon: Shield,
    description:
      "Resolve attack triggers and before-retaliation Opportunity, then choose eligible units to retaliate.",
  },
  {
    id: "damage",
    label: "Damage",
    Icon: Flame,
    description:
      "Before-damage Opportunity, then retaliation ordering if needed. Combat damage is dealt simultaneously.",
  },
  {
    id: "end",
    label: "End of combat",
    Icon: Flag,
    description: "Handle combat triggers and cleanup, then return to the Main Phase.",
  },
] as const;
const PENDING_REASONS = {
  effects: "Pending effects",
  choice: "Awaiting a choice",
  order: "Order retaliation damage",
  replacement: "Damage replacement choice pending",
  unavailable: "Forecast unavailable",
} as const;

function CombatMetric({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof ArrowRight;
  value: number | string;
  label: string;
}) {
  return (
    <Tooltip
      label={label}
      multiline
      w={240}
      withArrow
      events={{ hover: true, focus: true, touch: true }}
    >
      <span className="ga-combat-metric" tabIndex={0} aria-label={label}>
        <Icon size={15} aria-hidden="true" />
        <strong aria-hidden="true">{value}</strong>
        <span className="visually-hidden">{label}</span>
      </span>
    </Tooltip>
  );
}

export function GrandArchiveCombatWorkspace({
  view,
  seats,
  entities,
  candidateIds,
  selectedIds,
  selectedOrder,
  onSelect,
  onPreview,
  collapsed,
  onCollapsedChange,
}: {
  readonly view: GrandArchiveHarnessFixture["combatView"];
  readonly seats: SimulatorTable["seats"];
  readonly entities: readonly SimulatorEntity[];
  readonly candidateIds: readonly string[];
  readonly selectedIds: readonly string[];
  readonly selectedOrder: ReadonlyMap<string, number>;
  readonly onSelect: (id: string) => void;
  readonly onPreview: (entity: SimulatorEntity | undefined) => void;
  readonly collapsed: boolean;
  readonly onCollapsedChange: (value: boolean) => void;
}) {
  if (!view?.active) return null;
  const { combat, damage } = view;
  const currentStep = combat.step;
  const stepIndex = STEPS.findIndex((step) => step.id === currentStep);
  const name = (id: string) =>
    entities.find((entity) => entity.id === id)?.title ?? "Departed combatant";
  const player = (id: string) => seats.find((seat) => seat.id === id)?.label ?? "Player";
  const activity = view.decision
    ? `${player(view.decision.playerId)} · ${view.decision.kind === "choose-retaliators" ? "Choose retaliation" : view.decision.kind === "order-retaliation-damage" ? "Order retaliation damage" : "Decision pending"}`
    : view.opportunityHolderId
      ? `Opportunity: ${player(view.opportunityHolderId)}${currentStep === "damage" ? " · Before damage" : currentStep === "retaliation" ? " · Before retaliation" : ""}`
      : currentStep === "declaration"
        ? "Declaring attack · No Opportunity"
        : "Resolving combat";
  const attackSources = new Set([combat.attackerId, ...combat.weaponIds, ...combat.intentIds]);
  const retaliationSources = new Set(combat.retaliatorIds);
  const outgoing =
    damage.kind === "pending"
      ? null
      : damage.amounts.filter((entry) => attackSources.has(entry.sourceId));
  const incoming =
    damage.kind === "pending"
      ? null
      : damage.amounts.filter((entry) => retaliationSources.has(entry.sourceId));
  const recipients = Array.from(
    new Set([...combat.targetIds, ...(outgoing?.map((entry) => entry.recipientId) ?? [])]),
  );
  const amountFor = (id: string) =>
    outgoing
      ?.filter((entry) => entry.recipientId === id)
      .reduce((sum, entry) => sum + entry.amount, 0) ?? 0;
  const retaliationAmount = incoming?.reduce((sum, entry) => sum + entry.amount, 0) ?? 0;
  const retaliationRecipients = Array.from(
    new Set([combat.attackerId, ...(incoming?.map((entry) => entry.recipientId) ?? [])]),
  );
  const retaliationFor = (id: string) =>
    incoming
      ?.filter((entry) => entry.recipientId === id)
      .reduce((sum, entry) => sum + entry.amount, 0) ?? 0;
  const redirectedRetaliation = retaliationRecipients.some((id) => id !== combat.attackerId);
  const compact = collapsed;
  const renderCard = (id: string, role: string, support = false) => {
    const entity = entities.find((entry) => entry.id === id);
    if (!entity)
      return (
        <div className="ga-combat-departed" key={id}>
          {role}
          <small>Left combat</small>
        </div>
      );
    const retaliationDamage =
      incoming
        ?.filter((entry) => entry.sourceId === id)
        .reduce((sum, entry) => sum + entry.amount, 0) ?? 0;
    const contribution = view.contributions.find((entry) => entry.objectId === id);
    return (
      <div className="ga-combat-card" data-support={support || undefined} key={id}>
        {selectedOrder.has(id) ? (
          <span className="ga-interaction-order" aria-hidden="true">
            {selectedOrder.get(id)}
          </span>
        ) : null}
        <GrandArchiveRoleCard
          entity={entity}
          density="mini"
          selected={selectedIds.includes(id)}
          targetable={candidateIds.includes(id)}
          dimmed={candidateIds.length > 0 && !candidateIds.includes(id)}
          tabIndex={candidateIds.includes(id) ? 0 : -1}
          accessibleLabel={
            selectedOrder.has(id)
              ? `${entity.title}, position ${selectedOrder.get(id)} of ${selectedOrder.size}`
              : undefined
          }
          onClick={() => onSelect(id)}
          onHoverEnter={() => onPreview(entity)}
          onHoverLeave={() => onPreview(undefined)}
        />
        <div className="ga-combat-card__metrics">
          <Tooltip label={role} withArrow events={{ hover: true, focus: true, touch: true }}>
            <span className="ga-combat-role-icon" tabIndex={0} aria-label={role}>
              {id === combat.attackerId ? (
                <Swords size={14} aria-hidden="true" />
              ) : support ? (
                <Flag size={14} aria-hidden="true" />
              ) : (
                <Shield size={14} aria-hidden="true" />
              )}
              <span className="visually-hidden">{role}</span>
            </span>
          </Tooltip>
          {combat.targetIds.some((targetId) => targetId === id) && outgoing ? (
            <CombatMetric
              icon={ArrowRight}
              value={amountFor(id)}
              label={`Receives ${amountFor(id)} ${damage.kind === "projected" ? "projected damage" : "damage"}`}
            />
          ) : null}
          {contribution ? (
            <CombatMetric
              icon={Swords}
              value={contribution.amount}
              label={`${contribution.amount} attack contribution before attack-wide modifiers and damage replacements`}
            />
          ) : null}
          {combat.retaliatorIds.some((retaliatorId) => retaliatorId === id) && incoming ? (
            <CombatMetric
              icon={ArrowLeft}
              value={retaliationDamage}
              label={`Retaliates for ${retaliationDamage} ${damage.kind === "dealt" ? "damage dealt" : "projected damage"}`}
            />
          ) : null}
        </div>
      </div>
    );
  };
  return (
    <section className="ga-combat-workspace" data-collapsed={compact} aria-label="Combat workspace">
      <header>
        <strong>Combat</strong>
        <span>{STEPS[stepIndex]?.label}</span>
        <div className="ga-combat-totals" aria-live="polite" aria-atomic="true">
          <CombatMetric
            icon={ArrowRight}
            value={
              outgoing === null
                ? "…"
                : recipients.length > 1
                  ? `${recipients.length}×`
                  : amountFor(recipients[0] ?? "")
            }
            label={`To ${recipients.length > 1 ? "defenders" : "defender"}: ${damage.kind === "pending" ? PENDING_REASONS[damage.reason] : recipients.length > 1 ? recipients.map((id) => `${name(id)} receives ${amountFor(id)}`).join("; ") : `${amountFor(recipients[0] ?? "")} ${damage.kind === "dealt" ? "damage dealt" : "projected damage"}`}`}
          />
          <CombatMetric
            icon={ArrowLeft}
            value={view.retaliationPending || incoming === null ? "…" : retaliationAmount}
            label={`To ${redirectedRetaliation ? "attacking side" : "attacker"}: ${view.retaliationPending ? "Awaiting choice · Retaliation not committed" : damage.kind === "pending" ? PENDING_REASONS[damage.reason] : `${retaliationAmount} ${damage.kind === "dealt" ? "damage dealt" : "projected retaliation damage"}`}`}
          />
        </div>
        <ActionIcon
          variant="subtle"
          color="gray"
          aria-label={collapsed ? "Expand combat" : "Collapse combat"}
          aria-expanded={!collapsed}
          onClick={() => onCollapsedChange(!collapsed)}
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </ActionIcon>
      </header>
      <p className="ga-combat-activity">{activity}</p>
      {!compact ? (
        <>
          <div className="ga-combat-body">
            <ol className="ga-combat-steps" aria-label="Combat step progress">
              {STEPS.map(({ id, label, description, Icon }, index) => (
                <Tooltip
                  key={id}
                  label={`${label}: ${description}`}
                  multiline
                  w={240}
                  withArrow
                  events={{ hover: true, focus: true, touch: true }}
                >
                  <li
                    tabIndex={0}
                    aria-current={id === currentStep ? "step" : undefined}
                    aria-label={`${label}. ${index < stepIndex ? "Completed." : id === currentStep ? "Current step." : "Upcoming."} ${description}`}
                    data-status={
                      index < stepIndex ? "done" : id === currentStep ? "current" : "upcoming"
                    }
                  >
                    {index < stepIndex ? <Check size={15} /> : <Icon size={15} />}
                    <span className="visually-hidden">{label}</span>
                  </li>
                </Tooltip>
              ))}
            </ol>
            <div className="ga-combat-workspace__lanes">
              <section aria-label="Attack">
                <span>Attack</span>
                <div>
                  {renderCard(combat.attackerId, "Attacker")}
                  {combat.weaponIds.map((id) => renderCard(id, "Wielded weapon", true))}
                  {combat.intentIds.map((id) => renderCard(id, "Intent", true))}
                </div>
              </section>
              <section aria-label="Defend">
                <span>Defend</span>
                <div>
                  {Array.from(new Set([...combat.targetIds, ...combat.retaliatorIds])).map((id) =>
                    renderCard(
                      id,
                      combat.retaliatorIds.some((retaliatorId) => retaliatorId === id)
                        ? "Defender · Retaliating"
                        : "Defender",
                    ),
                  )}
                  {combat.targetIds.length === 0 && combat.retaliatorIds.length === 0 ? (
                    <span className="ga-combat-departed">No remaining defenders</span>
                  ) : null}
                </div>
              </section>
            </div>
          </div>
          <details className="ga-combat-breakdown">
            <summary>Damage breakdown</summary>
            {damage.kind === "pending" ? (
              <p>{PENDING_REASONS[damage.reason]}. The forecast updates after this is resolved.</p>
            ) : (
              <>
                {recipients.map((id) => (
                  <p key={id}>
                    {name(id)} receives <strong>{amountFor(id)}</strong>
                  </p>
                ))}
                {!view.retaliationPending
                  ? retaliationRecipients.map((id) => (
                      <p key={`retaliation:${id}`}>
                        {name(id)} receives <strong>{retaliationFor(id)}</strong> from retaliation.
                      </p>
                    ))
                  : null}
              </>
            )}
            {damage.kind === "projected" ? (
              <p>
                Based on the current state, including applicable damage replacements. Further
                actions can change the result. Both directions deal damage simultaneously.
              </p>
            ) : null}
            {view.contributions.length > 0 ? (
              <p>
                Card contributions show current combat values before attack-wide modifiers and
                damage replacements.
              </p>
            ) : null}
          </details>
        </>
      ) : null}
    </section>
  );
}
