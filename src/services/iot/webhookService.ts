/**
 * Webhook Service - Receives disturbance payloads from external sources.
 *
 * Usage:
 * - Deploy as Vercel/Netlify Function or Express route
 * - POST /api/webhook/disturbance with body: { who: "Todd", level: "Emergency" }
 * - The handler should call disturberController.reportDisturbance() with source: "webhook"
 *
 * Example Vercel API route (api/webhook/disturbance.ts):
 *
 * import { disturberController } from '@/controllers/disturberController';
 *
 * export default async function handler(req, res) {
 *   if (req.method !== 'POST') return res.status(405).end();
 *   const { who, level } = req.body;
 *   if (!who) return res.status(400).json({ error: 'who is required' });
 *   const result = await disturberController.reportDisturbance(
 *     { who, level: level ?? 'Emergency' },
 *     'webhook'
 *   );
 *   return res.status(200).json(result);
 * }
 */

import { reportDisturbance } from '../../controllers/disturberController';
import type { DisturbancePayload, EventSource } from '../../types/disturber.types';

export async function handleWebhookPayload(
  payload: DisturbancePayload,
  source: EventSource = 'webhook'
): Promise<{ success: boolean; eventId?: string }> {
  const result = await reportDisturbance(payload, source);
  return result
    ? { success: true, eventId: result.id }
    : { success: false };
}
