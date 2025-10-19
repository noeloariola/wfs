import jsonData from './index.json'  assert { type: "json" }; // optional in ESM
export interface VideoData {
  id: string;
  title: string;
  description: string;
}

export const GetVideos = () => {
  const videos: VideoData[] = jsonData as unknown as VideoData[]
  return videos;
}