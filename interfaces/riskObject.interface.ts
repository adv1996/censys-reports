export type IRiskObject = {
  id: number
  status: string // TODO change to enum OPEN / CLOSE
  first_date: string // TODO add formatter func when calling api to auto parse date
  type_id: number
}

export type IRiskObjectSeverity = {
  type: string
  severity: string
  parsed_date: Date
}

export type ICompleteRiskObject = IRiskObject & IRiskObjectSeverity;