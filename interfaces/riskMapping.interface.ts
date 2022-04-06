export type IRiskMapping = {
  index: number
  type: string
  name: string
  context_type: string
  recommended_severity: string
  parent: string
  child: string
  subchild: string
}

export interface INode {
  id: string
  parent: string | null
  nodes: INode[]
}