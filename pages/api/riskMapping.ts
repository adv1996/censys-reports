// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import riskMapping from '../../data/riskMapping.json'

type Data = {
  index: number
  type: string
  name: string
  context_type: string
  recommended_severity: string
  parent: string
  child: string
  subchild: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  res.status(200).json(riskMapping)
}
