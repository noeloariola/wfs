"use client";

import { use, useState } from "react"

export default function VideosPage() {

    const [ videos, setVideos ] = useState([
        {
            id: "4E-HjMycMkg",
            title: "50pcs Purple Carnation",
            description: "Big bouquet of purple carnations"
        },
        {
            id: "LkPz1f4H4JE",
            title: "Code: ASSR-01",
            description: "Beautiful assorted flowers"
        },
        {
            id: "0D7ychvHz_w",
            title: "Code: T3",
            description: "Yellow and Pink Tulips"
        },
        {
            id: "4yhHUzhNFjc",
            title: "Code: R12",
            description: "1 Dozen White Roses"
        },
        {
            id: "728tCA3nVw0",
            title: "Code: NP1",
            description: "A Touch of Fuchsia: Hand-Sprayed Roses "
        },
        {
            id: "4jTwa4xh_tk",
            title: "Code: TR12-01",
            description: "12 Pink Tulips"
        }


        

    ])

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