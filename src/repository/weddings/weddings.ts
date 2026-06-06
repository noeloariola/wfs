import jsonData from './index.json' with { type: "json" };
import { ArrangementData } from '@/common/constants/app';


export const GetWeddings = () => {
  const weddings: ArrangementData[] = jsonData as unknown as ArrangementData[];
  return weddings;
}
