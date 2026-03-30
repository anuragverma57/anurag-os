export const THEME_STORAGE_KEY = "anurag-os-theme";

export type Theme = "light" | "dark";

const listeners = new Set<() => void>();

export function subscribeTheme(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function emitThemeChange() {
  listeners.forEach((fn) => fn());
}

export function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}
