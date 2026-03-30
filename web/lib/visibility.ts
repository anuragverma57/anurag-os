/**
 * Content visibility rule for Anurag OS (Phase 1 contract).
 * Public routes must only surface entities where isPublic === true.
 * Admin can read/write all content; filtering applies at read time for public pages.
 */
export type WithVisibility = {
  isPublic: boolean;
};

export function isVisibleOnPublicSite(entity: WithVisibility): boolean {
  return entity.isPublic === true;
}
