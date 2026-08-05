import { headers } from "next/headers";

/** IP de quem fez a requisição, a partir dos headers que a Vercel injeta. */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headerList.get("x-real-ip") ?? "desconhecido";
}
