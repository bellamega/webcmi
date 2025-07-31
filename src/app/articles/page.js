"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from 'next/image'

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost/api";

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(`${API_BASE_URL}/get_articles.php`);
        if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
        const data = await response.json();
        setArticles(data);
      } catch (e) {
        console.error("Error fetching articles:", e);
        setError("Gagal memuat artikel. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32 pb-16">
        <p className="text-xl text-gray-700">Memuat artikel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 pt-32 pb-16">
        <p className="text-xl text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold text-gray-800 mb-8 text-center">
          Artikel <span className="text-red-600">Kesehatan</span> Terbaru
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Temukan informasi dan wawasan terbaru seputar kesehatan, tips gaya
          hidup sehat, dan berita medis dari Klinik CMI.
        </p>

        {articles.length === 0 ? (
          <p className="text-center text-gray-600 text-2xl mt-10">
            Belum ada artikel yang tersedia.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article) => (
              <div
                key={article.slug}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={400}
                    height={250}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white text-sm font-semibold bg-red-600 px-3 py-1 rounded-full">
                    {new Date(article.date).toLocaleDateString(
                      "id-ID",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-5 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="inline-flex items-center text-red-600 font-semibold hover:underline group"
                  >
                    Baca Selengkapnya
                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
