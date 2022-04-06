// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import riskObjects from '../../data/riskObjects.json'
import { IRiskObject } from '../../interfaces/riskObject.interface'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IRiskObject[]>
) {
  res.status(200).json(riskObjects)
}