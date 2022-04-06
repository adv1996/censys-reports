export type IRiskObject = {
  id: number
  status: string // TODO change to enum OPEN / CLOSE
  first_date: string
  type_id: number
}

export type IRiskObjectSeverity = {
  type: string
  severity: string
  parsed_date: Date
}

export type ICompleteRiskObject = IRiskObject & IRiskObjectSeverity;