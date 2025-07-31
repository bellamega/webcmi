'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image';

export default function ArticlesSection() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('articles') || '[]')
    setArticles(data)
  }, [])

  if (!articles.length) return null

  return (
    <section id="articles" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Artikel <span className="text-red-600">Kesehatan</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dapatkan informasi dan tips kesehatan terbaru dari para ahli di CMI Hospital
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
              <div className="h-52 overflow-hidden rounded-t-2xl">

        <Image
        src={article.image}
        alt={article.title}
        width={400}
        height={250}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />

              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">{article.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {article.content.slice(0, 100)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
