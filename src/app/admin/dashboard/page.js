// src/app/admin/dashboard/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Edit, Trash2, XCircle, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Image from 'next/image';

const API_BASE_URL = 'http://localhost/api';

// Skema validasi untuk form artikel (validasi 'image' ditangani secara manual untuk unggah)
const articleSchema = yup.object().shape({
  title: yup.string().required('Judul wajib diisi'),
  slug: yup.string().required('Slug wajib diisi').matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug harus dalam format kebab-case (huruf kecil, angka, dan strip saja)'),
  excerpt: yup.string().required('Ringkasan wajib diisi'),
  content: yup.string().required('Konten wajib diisi'),
  publication_date: yup.string().required('Tanggal publikasi wajib diisi'),
});

// Komponen Modal Pesan Kustom (pengganti alert())
const MessageModal = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Pemberitahuan</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Untuk pesan error umum
  const [message, setMessage] = useState(null); // Untuk pesan sukses/info (menggunakan modal kustom)
  const [isModalOpen, setIsModalOpen] = useState(false); // Untuk Modal Tambah/Edit Artikel
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Untuk Modal Konfirmasi Hapus
  const [currentArticle, setCurrentArticle] = useState(null); // Untuk artikel yang dipilih (edit/hapus)
  const [formMode, setFormMode] = useState('add'); // 'add' atau 'edit'
  const [imageFile, setImageFile] = useState(null); // State untuk file gambar yang dipilih
  const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // State untuk pratinjau gambar lokal

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(articleSchema),
  });

  const titleValue = watch('title'); // Memantau nilai input judul

  // Efek untuk menghasilkan slug otomatis saat judul berubah dan dalam mode 'add'
  useEffect(() => {
    if (formMode === 'add' && titleValue) {
      const generatedSlug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [titleValue, formMode, setValue]); // Dependencies: titleValue, formMode, setValue

  useEffect(() => {
    fetchArticles();
  }, []);

  // Fungsi untuk mengambil daftar artikel dari PHP API
  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/get_articles.php`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setArticles(data);
      } else {
        setError("Format data artikel tidak valid.");
        setArticles([]);
      }
    } catch (e) {
      console.error("Error fetching articles:", e);
      setError("Gagal memuat artikel dari server. Pastikan API berjalan.");
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk perubahan file gambar (untuk pratinjau lokal)
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl('');
    }
  };

  // Fungsi untuk mengunggah gambar ke server PHP
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload_image.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengunggah gambar.');
      }
      return result.imageUrl; // Mengembalikan path URL dari server
    } catch (e) {
      console.error("Error uploading image:", e);
      setMessage('Gagal mengunggah gambar: ' + e.message); // Gunakan modal kustom untuk error
      return null; // Mengembalikan null jika unggahan gagal
    }
  };

  // Handler untuk submit form artikel (tambah/edit)
  const onSubmit = async (data) => {
    setError(null); // Bersihkan error sebelumnya
    setMessage(null); // Bersihkan pesan sebelumnya
    let finalImageUrl = ''; // URL gambar yang akan dikirim ke database

    // Logika penanganan unggah gambar
    if (imageFile) {
      // Jika ada file gambar baru yang dipilih, unggah
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl === null) {
        // Jika uploadImage mengembalikan null (berarti ada error yang sudah ditangani oleh setMessage)
        return;
      }
      finalImageUrl = uploadedUrl;
    } else if (formMode === 'edit' && currentArticle?.image) {
      // Jika dalam mode edit dan tidak ada file baru dipilih, gunakan URL gambar yang sudah ada
      finalImageUrl = currentArticle.image;
    } else if (formMode === 'add') {
      // Jika dalam mode tambah artikel dan tidak ada file gambar yang dipilih
      setMessage('Gambar utama wajib diisi untuk artikel baru.');
      return;
    }

    // Pastikan finalImageUrl tidak kosong sebelum melanjutkan
    if (!finalImageUrl) {
        setMessage('URL Gambar tidak tersedia. Harap unggah gambar atau pastikan URL gambar yang ada valid.');
        return;
    }

    try {
      let response;
      if (formMode === 'add') {
        response = await fetch(`${API_BASE_URL}/add_article.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...data, image_url: finalImageUrl }), // Ganti 'image' menjadi 'image_url'
        });
      } else { // formMode === 'edit'
        if (!currentArticle || !currentArticle.id) {
          setError('Error: Artikel tidak ditemukan untuk diperbarui. ID artikel hilang.');
          return;
        }
        response = await fetch(`${API_BASE_URL}/update_article.php`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...data, image_url: finalImageUrl, id: currentArticle.id }), // Ganti 'image' menjadi 'image_url'
        });
      }

      const result = await response.json();
      if (!response.ok) {
        // Tangani pesan error dari backend PHP
        throw new Error(result.message || `Terjadi kesalahan pada server: ${response.status} ${response.statusText}`);
      }

      // Pastikan ada pesan sukses dari backend atau set pesan default
      setMessage(result.message || `Artikel berhasil ${formMode === 'add' ? 'ditambahkan' : 'diperbarui'}!`);
      setIsModalOpen(false); // Tutup modal
      reset(); // Reset form fields
      setImageFile(null); // Bersihkan state file gambar
      setImagePreviewUrl(''); // Bersihkan pratinjau gambar
      fetchArticles(); // Perbarui daftar artikel
      router.refresh(); // Perbarui cache Next.js untuk halaman lain
    } catch (e) {
      console.error("Error submitting article to DB:", e);
      // Gunakan state error untuk kesalahan kritis saat submit API
      setError(e.message || "Terjadi kesalahan saat menyimpan artikel. Silakan coba lagi."); 
    }
  };

  // Handler untuk membuka modal "Tambah Artikel"
  const handleAddClick = () => {
    setFormMode('add');
    setCurrentArticle(null); // Bersihkan artikel yang sedang dipilih
    reset({ // Reset semua field form ke default kosong
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      publication_date: new Date().toISOString().slice(0, 16), // Atur tanggal default ke waktu saat ini
    });
    setImageFile(null);
    setImagePreviewUrl('');
    setIsModalOpen(true);
  };

  // Handler untuk membuka modal "Edit Artikel"
  const handleEditClick = (article) => {
    setFormMode('edit');
    setCurrentArticle(article);
    // Atur nilai form untuk pengeditan
    setValue('title', article.title);
    setValue('slug', article.slug);
    setValue('excerpt', article.excerpt);
    setValue('content', article.content);
    // Format string tanggal dari YYYY-MM-DD HH:MM:SS ke YYYY-MM-DDTHH:MM untuk input datetime-local
    setValue('publication_date', article.date ? article.date.replace(' ', 'T').slice(0, 16) : '');
    setImagePreviewUrl(article.image); // Atur pratinjau ke URL gambar saat ini
    setImageFile(null); // Bersihkan file yang dipilih untuk mode edit
    setIsModalOpen(true);
  };

  // Handler untuk membuka modal konfirmasi "Hapus Artikel"
  const handleDeleteClick = (article) => {
    setCurrentArticle(article);
    setIsDeleteDialogOpen(true);
  };

  // Fungsi untuk mengkonfirmasi dan menghapus artikel
  const confirmDelete = async () => {
    setError(null);
    setMessage(null);
    if (!currentArticle || !currentArticle.slug) {
        setError('Error: Artikel tidak ditemukan untuk dihapus. Slug artikel hilang.');
        setIsDeleteDialogOpen(false);
        return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/delete_article.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: currentArticle.slug }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `Gagal menghapus artikel: ${response.status} ${response.statusText}`);
      }

      setMessage(result.message || 'Artikel berhasil dihapus!');
      setIsDeleteDialogOpen(false); // Tutup modal konfirmasi
      fetchArticles(); // Perbarui daftar artikel
      router.refresh(); // Perbarui cache Next.js
    } catch (e) {
      console.error("Error deleting article:", e);
      setError(e.message || "Terjadi kesalahan saat menghapus artikel. Silakan coba lagi.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-16">
        <p className="text-xl text-gray-700">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 pt-24">
      {/* Modal Pesan untuk sukses/info */}
      <MessageModal message={message} onClose={() => setMessage(null)} />

      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard Artikel</h1>
        <div className="mb-8 text-right">
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Tambah Artikel Baru
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
              <XCircle className="w-5 h-5 cursor-pointer" />
            </span>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Judul</th>
                <th className="py-3 px-6 text-left">Slug</th>
                <th className="py-3 px-6 text-left">Tanggal Publikasi</th>
                <th className="py-3 px-6 text-center">Gambar</th>
                <th className="py-3 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-3 px-6 text-center">Belum ada artikel. Tambahkan yang baru!</td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <span className="font-medium">{article.title}</span>
                    </td>
                    <td className="py-3 px-6 text-left">{article.slug}</td>
                    <td className="py-3 px-6 text-left">
                      {/* Format tampilan tanggal untuk tabel */}
                      {new Date(article.date).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {article.image && (
                        <Image
                          src={article.image}
                          alt="Thumbnail"
                          width={60}
                          height={40}
                          style={{ objectFit: 'cover' }}
                          className="inline-block rounded"
                        />
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-4">
                        <button onClick={() => handleEditClick(article)} className="text-blue-500 hover:text-blue-700 transform hover:scale-110">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteClick(article)} className="text-red-500 hover:text-red-700 transform hover:scale-110">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Article */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6 transform transition-all scale-100 opacity-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {formMode === 'add' ? 'Tambah Artikel Baru' : 'Edit Artikel'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Judul Artikel</label>
                <input
                  type="text"
                  id="title"
                  {...register('title')}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title.message}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="slug" className="block text-gray-700 text-sm font-bold mb-2">Slug (URL)</label>
                <input
                  type="text"
                  id="slug"
                  {...register('slug')}
                  readOnly={formMode === 'edit'}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.slug ? 'border-red-500' : ''} ${formMode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                {errors.slug && <p className="text-red-500 text-xs italic mt-1">{errors.slug.message}</p>}
                {formMode === 'edit' && <p className="text-xs text-gray-500 mt-1">Slug tidak dapat diubah saat mengedit.</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="excerpt" className="block text-gray-700 text-sm font-bold mb-2">Ringkasan</label>
                <textarea
                  id="excerpt"
                  {...register('excerpt')}
                  rows="3"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.excerpt ? 'border-red-500' : ''}`}
                ></textarea>
                {errors.excerpt && <p className="text-red-500 text-xs italic mt-1">{errors.excerpt.message}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">Konten Lengkap</label>
                <textarea
                  id="content"
                  {...register('content')}
                  rows="8"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.content ? 'border-red-500' : ''}`}
                ></textarea>
                {errors.content && <p className="text-red-500 text-xs italic mt-1">{errors.content.message}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="publication_date" className="block text-gray-700 text-sm font-bold mb-2">Tanggal Publikasi</label>
                <input
                  type="datetime-local"
                  id="publication_date"
                  {...register('publication_date')}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.publication_date ? 'border-red-500' : ''}`}
                />
                {errors.publication_date && <p className="text-red-500 text-xs italic mt-1">{errors.publication_date.message}</p>}
              </div>

              <div className="mb-6">
                <label htmlFor="imageFile" className="block text-gray-700 text-sm font-bold mb-2">Unggah Gambar Baru</label>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imageFile && <p className="text-gray-500 text-xs mt-2">File dipilih: {imageFile.name}</p>}
                
                {/* Pratinjau Gambar untuk unggahan baru dan gambar yang sudah ada dalam mode edit */}
                {(imagePreviewUrl || (formMode === 'edit' && currentArticle?.image)) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">Pratinjau Gambar:</p>
                    <Image
                      src={imagePreviewUrl || currentArticle?.image}
                      alt={currentArticle?.title || 'Pratinjau Gambar'}
                      width={400}
                      height={250}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                >
                  {formMode === 'add' ? 'Tambahkan Artikel' : 'Simpan Perubahan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                    setImageFile(null);
                    setImagePreviewUrl('');
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h2>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus artikel &quot;<span className="font-semibold">{currentArticle?.title}</span>&quot;?
                Tindakan ini tidak dapat dibatalkan.
              </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
