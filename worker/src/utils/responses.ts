import type { Context } from 'hono';

export function parsePositiveId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function isAuthorizedAdmin(c: Context): boolean {
  const configuredToken = c.env.ADMIN_TOKEN as string | undefined;

  if (!configuredToken) {
    return false;
  }

  return c.req.header('Authorization') === `Bearer ${configuredToken}`;
}
