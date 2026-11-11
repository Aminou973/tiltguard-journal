import { MarketDataError, type MarketDataProvider } from "./provider";
import { array, number, readJson, record, result, validateBars, windows } from "./http";

/** NQ / ES 1m archive served by the Tilt Guard backend on the same host (local-only endpoint). */
const BASE = () => process.env.TILTGUARD_BARS_URL?.trim() || "http://127.0.0.1:8940";
const ROOTS: Record<string, string> = { NQ: "NQ", MNQ: "NQ", ES: "ES", MES: "ES" };

const rootOf = (symbol: string) => {
  const s = symbol.trim().toUpperCase().replace(/^.*:/, "");
  const m = s.match(/^([A-Z]{2,3}?)(?:[FGHJKMNQUVXZ]\d{1,4})?$/);
  return m ? ROOTS[m[1]!] : undefined;
};

export const tiltguardBars: MarketDataProvider = {
  id: "tiltguard",
  name: "TiltGuard bars (NQ / ES)",
  environmentKey: "",
  async test() {
    await readJson(`${BASE()}/api/bars/health`, {}, undefined, { cache: false });
  },
  async history(request) {
    const root = rootOf(request.symbol);
    if (!root) throw new MarketDataError("Use NQ, MNQ, ES or MES.");
    if (request.dataset) throw new MarketDataError("Leave the dataset blank for TiltGuard bars.");
    const micro = /^M(NQ|ES)/.test(request.symbol.trim().toUpperCase().replace(/^.*:/, ""));
    const history = await windows(request, 5000, async (from, to, signal) => {
      const query = new URLSearchParams({
        symbol: root,
        res: request.resolution,
        from: String(from),
        to: String(to),
      });
      const body = record(await readJson(`${BASE()}/api/bars?${query}`, {}, signal));
      return validateBars(
        array(body.bars).map((item) => {
          const row = array(item);
          return {
            time: number(row[0]),
            open: number(row[1]),
            high: number(row[2]),
            low: number(row[3]),
            close: number(row[4]),
            volume: number(row[5]),
          };
        }),
      );
    });
    return result(
      this.name,
      request,
      history.bars,
      history.truncated,
      micro
        ? [
            `${root === "NQ" ? "MNQ" : "MES"} uses ${root} prices (same index, 1/10 the multiplier).`,
          ]
        : [],
      "USD",
    );
  },
};
