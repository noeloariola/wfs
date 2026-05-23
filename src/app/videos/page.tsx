"use client";

import { GetVideos } from "@/repository/youtube/videos";
import { useState } from "react"

export default function VideosPage() {

    const [ videos ] = useState(GetVideos());

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.8)]">
            <div className="mb-8 text-center">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Floral Design Videos</p>
              <h2 className="mt-3 text-4xl font-semibold text-slate-100">Watch our latest floral tutorials</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <div key={video.id} className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950/80 shadow-[0_8px_30px_-15px_rgba(15,23,42,0.7)]">
                  <div className="relative w-full h-64 bg-slate-900 overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-100 mb-2">{video.title}</h3>
                    <p className="text-sm text-slate-400">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
    )
}