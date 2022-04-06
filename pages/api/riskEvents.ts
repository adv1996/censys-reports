// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import riskEventMap from '../../data/riskEvents.json'

type IEvent = {
  event_id: number
  risk_id: number
  ts: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IEvent[]>
) {
  const riskId = req.query.riskId as string
  res.status(200).json((riskEventMap as Record<string, IEvent[]>)[riskId])
}
