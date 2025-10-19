"use client";

import { GetVideos } from "@/repository/youtube/videos";
import { useState } from "react"

export default function VideosPage() {

    const [ videos ] = useState(GetVideos());

    return (
        <div className="w-full max-w-7xl mx-auto my-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Floral Design Videos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="flex flex-col">
                <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{video.title}</h3>
                <p className="text-sm text-gray-600">{video.description}</p>
              </div>
            ))}
          </div>
        </div>
    )
}