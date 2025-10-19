import jsonData from './index.json'  assert { type: "json" }; // optional in ESM
import { ArrangementData } from '@/common/constants/app';


export const GetVideos = () => {
  const videos: ArrangementData[] = jsonData as unknown as any[];
  return videos;
}