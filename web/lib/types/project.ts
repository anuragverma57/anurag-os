/** Shape used on the public site and in admin (with id). */
export type ProjectRecord = {
  id: string;
  title: string;
  description: string;
  stack: string[];
  href: string;
  repo?: string;
  linkLabel?: string;
  featured?: boolean;
  isPublic: boolean;
  sortOrder: number;
};

/** Input for create/update (no id). */
export type ProjectInput = {
  title: string;
  description: string;
  stack: string[];
  href: string;
  repo?: string | null;
  linkLabel?: string | null;
  featured?: boolean;
  isPublic: boolean;
  sortOrder: number;
};
