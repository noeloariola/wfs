import jsonData from './index.json' with { type: "json" }; // optional in ESM
import { ArrangementData } from '@/common/constants/app';


export const GetFlowerBox = () => {
  const items: ArrangementData[] = jsonData as unknown as ArrangementData[];
  return items;
}
