// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import riskObjects from '../../data/riskObjects.json'

type Data = {
  id: number
  status: string
  first_date: string
  type_id: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  res.status(200).json(riskObjects)
}