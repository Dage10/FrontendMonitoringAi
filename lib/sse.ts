import { API_URL } from "./api";

export const connectSSE = (onEvent: (event: string, data: unknown) => void) => {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(`${API_URL}/metrics/stream`, {
        credentials: "include",
        signal: controller.signal,
      });
      if (!res.ok || !res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          let event = "message";
          let data = "";
          for (const line of part.split("\n")) {
            if (line.startsWith("event:")) event = line.slice(6).trim();
            if (line.startsWith("data:")) data += line.slice(5).trim();
          }
          if (data) {
            try {
              onEvent(event, JSON.parse(data));
            } catch {
              onEvent(event, data);
            }
          }
        }
      }
    } catch {
      /* connection closed */
    }
  })();

  return () => controller.abort();
};
