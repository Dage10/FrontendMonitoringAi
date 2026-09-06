import { api } from "./api";

export type User = { userId: number; username: string; email: string };

export const login = async (username: string, password: string): Promise<User> => {
  return api<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
};

export const register = async (username: string, email: string, password: string): Promise<User> => {
  return api<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
};

export const logout = () => api("/auth/logout", { method: "POST" });

export const getMe = async (): Promise<User | null> => {
  try {
    return await api<User>("/auth/me");
  } catch {
    return null;
  }
};
