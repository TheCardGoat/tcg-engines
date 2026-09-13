import { createContext, useContext } from "react";

export interface LinkTargetPreviewValue {
  readonly active: boolean;
  readonly linkCandidateIds: ReadonlySet<string>;
}

const DEFAULT_LINK_TARGET_PREVIEW: LinkTargetPreviewValue = {
  active: false,
  linkCandidateIds: new Set(),
};

export const LinkTargetPreviewContext = createContext<LinkTargetPreviewValue>(
  DEFAULT_LINK_TARGET_PREVIEW,
);

export function useLinkTargetPreview(): LinkTargetPreviewValue {
  return useContext(LinkTargetPreviewContext);
}
