import { IRiskMapping } from "../interfaces/riskMapping.interface";
import { IRiskObject,  ICompleteRiskObject } from "../interfaces/riskObject.interface";
import { keyBy, round } from 'lodash'

export const calculateOpenRisks = (riskObjects: IRiskObject[]) => {
  return riskObjects.filter(riskObject => riskObject.status === 'open').length // replace with enum
}

export const weaveSeverity = (riskObjects: IRiskObject[], riskMapping: IRiskMapping[]): ICompleteRiskObject[] => {
  const severityMap = keyBy(riskMapping, 'index')
  return riskObjects.map(riskObject => {
    return {
      ...riskObject,
      severity: severityMap[riskObject['type_id']].recommended_severity,
      type: severityMap[riskObject['type_id']].type,
      parsed_date: new Date(riskObject['first_date'])
    }
  })
}

export const calculateSeverityByTime = (riskObjects: ICompleteRiskObject[]) => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  return riskObjects.filter(riskObject => riskObject.parsed_date >= lastMonth && riskObject.severity === 'critical').length;
}

export const calculateAverageRiskPerDay = (riskObjects: ICompleteRiskObject[]) => {
  if (riskObjects.length === 0) return 0
  const minDate = riskObjects.reduce((a, b) => (a.parsed_date > b.parsed_date ? a : b)).parsed_date;
  const maxDate = riskObjects.reduce((a, b) => (a.parsed_date > b.parsed_date ? b : a)).parsed_date;
  const daysInBetween = (minDate.getTime() - maxDate.getTime())  / (1000 * 3600 * 24);
  return round((riskObjects.length / daysInBetween), 2)
}