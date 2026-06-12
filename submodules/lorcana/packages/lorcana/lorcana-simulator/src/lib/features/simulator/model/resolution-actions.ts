import type { ResolutionActionView } from "@/features/simulator/model/contracts.js";

type ResolutionActionSourceItem = {
  id: string;
  kind?: "bag" | "pending";
  title: string;
  summaryTitle?: string;
  isActive?: boolean;
  canResolve?: boolean;
  canAccept?: boolean;
  canReject?: boolean;
  primaryActionLabel?: string;
  statusMessage?: string;
  onResolve?: () => void;
  onPrimaryAction?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
};

type ResolutionActionLabels = {
  acceptEffect: string;
  arrangeCards: string;
  declineEffect: string;
  resolveEffect: string;
  resolveTriggeredAbility: string;
};

export function buildResolutionActionViews(params: {
  items: ResolutionActionSourceItem[];
  labels: ResolutionActionLabels;
}): ResolutionActionView[] {
  const actions: ResolutionActionView[] = [];

  for (const item of params.items) {
    if (item.statusMessage) {
      continue;
    }

    const isBagItem = item.kind === "bag" || item.id.startsWith("bag:");

    if (isBagItem) {
      if (item.canResolve && item.onResolve) {
        actions.push({
          id: `${item.id}:resolve`,
          label: params.labels.resolveTriggeredAbility,
          detail: item.summaryTitle ?? item.title,
          emphasis: true,
          onClick: item.onResolve,
        });
      }

      if (item.canAccept && item.onAccept) {
        actions.push({
          id: `${item.id}:accept`,
          label: params.labels.acceptEffect,
          detail: item.summaryTitle ?? item.title,
          emphasis: true,
          onClick: item.onAccept,
        });
      }

      if (item.canReject && item.onReject) {
        actions.push({
          id: `${item.id}:reject`,
          label: params.labels.declineEffect,
          detail: item.summaryTitle ?? item.title,
          onClick: item.onReject,
        });
      }

      continue;
    }

    if (!item.isActive) {
      continue;
    }

    if (item.onPrimaryAction) {
      actions.push({
        id: `${item.id}:primary`,
        label: item.primaryActionLabel ?? params.labels.arrangeCards,
        detail: item.summaryTitle ?? item.title,
        emphasis: true,
        onClick: item.onPrimaryAction,
      });
    }

    if (item.canAccept && item.onAccept) {
      actions.push({
        id: `${item.id}:accept`,
        label: params.labels.acceptEffect,
        detail: item.summaryTitle ?? item.title,
        emphasis: true,
        onClick: item.onAccept,
      });
    }

    if (item.canReject && item.onReject) {
      actions.push({
        id: `${item.id}:reject`,
        label: params.labels.declineEffect,
        detail: item.summaryTitle ?? item.title,
        onClick: item.onReject,
      });
    }

    if (item.canResolve && item.onResolve) {
      actions.push({
        id: `${item.id}:resolve`,
        label: params.labels.resolveEffect,
        detail: item.summaryTitle ?? item.title,
        emphasis: true,
        onClick: item.onResolve,
      });
    }
  }

  return actions;
}
