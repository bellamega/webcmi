// src/app/articles/[slug]/page.js
"use client";

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import Image from 'next/image'

export default function ArticleDetailPage({ params }) {
  const router = useRouter();
  const { slug } = use(params); // ✅ Benar di Next.js terbaru

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost/api';

  useEffect(() => {
    async function fetchArticleAndIncrementViews() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/get_articles.php`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allArticles = await response.json();
        const foundArticle = allArticles.find((art) => art.slug === slug);

        if (!foundArticle) {
          setError("Artikel tidak ditemukan.");
          return; // Jangan redirect di sini!
        }

        setArticle(foundArticle);

        // Increment views
        const incrementResponse = await fetch(`${API_BASE_URL}/increment_views.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: slug }),
        });

        if (!incrementResponse.ok) {
          console.warn(`Failed to increment views for slug: ${slug}. Status: ${incrementResponse.status}`);
        } else {
          setArticle(prevArticle => ({
            ...prevArticle,
            views_count: (prevArticle.views_count || 0) + 1
          }));
        }

      } catch (e) {
        setError("Gagal memuat detail artikel atau menambah views.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticleAndIncrementViews();
  }, [slug, router]);

  // Redirect jika error setelah render
  useEffect(() => {
    if (error === "Artikel tidak ditemukan." || error === "Gagal memuat detail artikel atau menambah views.") {
      const timeout = setTimeout(() => {
        router.push('/articles');
      }, 2000); // Redirect setelah 2 detik

      return () => clearTimeout(timeout);
    }
  }, [error, router]);

  // Fungsi untuk memformat tanggal
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      const formattedDate = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      const formattedDay = date.toLocaleDateString('id-ID', { weekday: 'long' });
      const formattedTime = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      return `${formattedDate} (${formattedDay}) - ${formattedTime}`;
    } catch (e) {
      return dateString;
    }
  };

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
        <Link 
          href="/articles" 
          className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors mt-4 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar Artikel
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl bg-white rounded-xl shadow-lg p-8 md:p-12">
        <Link 
          href="/articles" 
          className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar Artikel
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>
        <p className="text-gray-500 text-lg mb-2">
          Dipublikasikan pada: <span className="font-semibold">{formatDateForDisplay(article.date)}</span>
        </p>
        {article.views_count !== undefined && (
            <p className="text-gray-500 text-lg mb-8 border-b pb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" /> {article.views_count} views
            </p>
        )}

        <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden mb-8 shadow-md">
          <Image
          src={article.image_url}
          alt={article.title}
          width={400}
          height={250}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />

        </div>

        <div 
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        ></div>
      </div>
    </div>
  );
}
