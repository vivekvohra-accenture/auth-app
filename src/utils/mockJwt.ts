import type { SessionUser } from "../types/users";

// Simulates JWT token generation (in real apps, backend does this)
export const generateMockToken = (user: SessionUser): string => {
  const header = { alg: "HS256", typ: "JWT" };

  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 60 * 60 * 1000, // expires in 1 hour
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const fakeSignature = btoa("mock-secret-key");

  return `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
};

// Read data from inside the token
export const decodeMockToken = (
  token: string
): { userId: number; email: string; role: string; exp: number } | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
};

// Check if token has expired
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeMockToken(token);
  if (!decoded) return true;
  return Date.now() > decoded.exp;
};