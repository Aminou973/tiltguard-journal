// The read-only demo journal is served under a sub-path: a build with JOURNAL_BASE_PATH
// set gets Next's basePath for pages and assets, and this prefix for the app's own /api and /fonts requests.
// The regular journal builds with no base path and these are no-ops.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix an app-absolute path (`/api/...`) with the base path. */
export const withBase = (path: string): string =>
  BASE_PATH && path.startsWith("/") ? `${BASE_PATH}${path}` : path;

/** Demo build: the journal shows demo data and can't be changed (the proxy only lets reads through). */
export const IS_DEMO = process.env.NEXT_PUBLIC_JOURNAL_DEMO === "1";

/** Route the app's own fetch("/api/...") calls through the base path (client side, demo build only). */
export const BASE_FETCH_SHIM = BASE_PATH
  ? `(function(){var b=${JSON.stringify(BASE_PATH)},f=window.fetch;window.fetch=function(u,o){if(typeof u==="string"&&(u.indexOf("/api/")===0||u.indexOf("/fonts/")===0))u=b+u;return f.call(this,u,o)}})();`
  : "";
