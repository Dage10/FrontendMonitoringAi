const publicApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const API_URL = publicApiUrl && (publicApiUrl === "/api" || publicApiUrl.startsWith("http://localhost"))
  ? publicApiUrl
  : "/api";

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const readResponse = async (res: Response) => {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { message: text };
  }
};

export const api = async <T = never>(path: string, options: RequestInit = {}): Promise<T> => {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new ApiError("Unauthorized");
  }

  if (!res.ok) {
    const data = await readResponse(res);
    const message = typeof data?.message === "string"
      ? data.message
      : typeof data?.error === "string"
        ? data.error
        : res.statusText;
    throw new ApiError(message);
  }

  if (res.status === 204) return null as T;
  return await readResponse(res) as T;
};
