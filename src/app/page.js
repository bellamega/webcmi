// src/app/page.js
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Menu, X, Phone, MapPin, Clock, Star, Heart, Shield, Award, ChevronRight } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import Image from 'next/image'; // Pastikan ini diimpor

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [latestArticles, setLatestArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState(null);

  const whatsapp = '628123456789';
  const API_BASE_URL = 'http://localhost/api'; // Pertimbangkan untuk menggunakan variabel lingkungan

  // Tambahkan deklarasi state dan fungsi Cardiac Risk Calculator di bawah ini
  const [gender, setGender] = useState(''); // 'male' or 'female'
  const [smoker, setSmoker] = useState(''); // 'yes' or 'no'
  const [weight, setWeight] = useState(''); // kg
  const [height, setHeight] = useState(''); // cm
  const [age, setAge] = useState('');
  const [systolicBP, setSystolicBP] = useState(''); // Systolic Blood Pressure

  const [result, setResult] = useState(null); // To store calculation result
  const [showResult, setShowResult] = useState(false); // To toggle result display

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchLatestArticles() {
      try {
        setArticlesLoading(true);
        const response = await fetch(`${API_BASE_URL}/get_articles.php`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const sortedArticles = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.date) - new Date(a.date))
          : [];
        setLatestArticles(sortedArticles.slice(0, 3));
        
        // --- DEBUGGING: CEK SLUG YANG DITERIMA DARI API ---
        console.log("Articles fetched from API for home page:", data);
        if (sortedArticles.length > 0) {
            console.log("First article slug:", sortedArticles[0].slug);
        }
        // ----------------------------------------------------

      } catch (e) {
        console.error("Error fetching latest articles:", e);
        setArticlesError("Gagal memuat artikel terbaru.");
      } finally {
        setArticlesLoading(false);
      }
    }
    fetchLatestArticles();
  }, []);


  const FloatingWhatsApp = () => (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
        <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-green-500/25">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.687"/>
          </svg>
        </div>
      </div>
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-bounce">
        !
      </div>
    </a>
  );

  const calculateRisk = () => {
    let riskScore = 0;
    if (gender === 'male') riskScore += 5;
    if (smoker === 'yes') riskScore += 10;
    if (age && age >= 50) riskScore += 7;
    if (systolicBP && systolicBP >= 140) riskScore += 8;

    let interpretation = "Risiko rendah";
    if (riskScore > 15) interpretation = "Risiko sedang";
    if (riskScore > 25) interpretation = "Risiko tinggi";

    setResult({ score: riskScore, interpretation: interpretation });
    setShowResult(true);
  };

  const resetCalculator = () => {
    setGender('');
    setSmoker('');
    setWeight('');
    setHeight('');
    setAge('');
    setSystolicBP('');
    setResult(null);
    setShowResult(false);
  };

  const ageOptions = Array.from({ length: 70 }, (_, i) => 20 + i); // Ages 20 to 89
    // Systolic BP options (updated to use categorical strings)
  const bpOptions = [
    '<120',
    '120-139',
    '140-159',
    '160-179',
    '>180'
  ];
  return (
    <>
      {/* Enhanced Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Perbaikan: Ganti <img> dengan <Image /> */}
              <Image 
                src="/images/cmi-logo2.png" 
                alt="CMI Logo" 
                width={150} // Perkiraan lebar yang sesuai dengan h-12 (48px)
                height={48} // h-12 setara dengan 48px
                className="object-contain" // Tetap gunakan class CSS untuk styling tambahan
              />
            </div>
            
            <nav className="hidden md:flex space-x-8">
              {[
                { href: '#about', label: 'Tentang Kami' },
                { href: '#services', label: 'Layanan' },
                { href: '#testimonials', label: 'Testimoni' },
                { href: '/articles', label: 'Artikel' },
                { href: '#contact', label: 'Kontak' }
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-300 relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <nav className="flex flex-col space-y-3">
                {[
                  { href: '#about', label: 'Tentang Kami' },
                  { href: '#services', label: 'Layanan' },
                  { href: '#testimonials', label: 'Testimoni' },
                  { href: '/articles', label: 'Artikel' },
                  { href: '#contact', label: 'Kontak' }
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-300 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="font-sans text-gray-800 bg-white">
        <FloatingWhatsApp />

        {/* Enhanced Hero Section */}
        <section className="relative min-h-screen bg-gradient-to-br from-red-700 via-red-600 to-red-500 text-white overflow-hidden" id="about">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>

          <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
                  <Shield className="w-5 h-5 mr-2" />
                  <span className="text-sm font-semibold">Trusted Healthcare Partner</span>
                </div>

                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  Kami Mengobati Dengan{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-100">
                    Sepenuh Hati
                  </span>
                </h1>

                <p className="text-xl leading-relaxed text-white/90 max-w-2xl">
                  Klinik Utama CMI Bandung Memberikan upaya pengobatan penyakit kronis dan pencegahan yang terintegrasi dengan metode modern dan klasik.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
                  >
                    <Phone className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Konsultasi Sekarang
                  </a>
                  <a
                    href="#services"
                    className="group inline-flex items-center justify-center bg-transparent border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300 hover:scale-105"
                  >
                    Lihat Layanan
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20">
                    <div className="w-full h-96 rounded-2xl overflow-hidden">
                      {/* Perbaikan: Ganti <img> dengan <Image /> */}
                      <Image 
                        src="/images/bangunan-cmi.jpg" 
                        alt="CMI Hospital Building"
                        layout="fill" // Mengisi parent container
                        objectFit="cover" // Menjaga aspek rasio
                        className="transition-transform duration-300" // Class CSS tambahan
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="bg-white py-20 relative">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '1000+', label: 'Happy Patients', icon: Heart, color: 'text-red-500' },
                { value: '15+', label: 'Expert Doctors', icon: Award, color: 'text-blue-500' },
                { value: '10+', label: 'Years Experience', icon: Shield, color: 'text-green-500' },
                { value: '24/7', label: 'Emergency Care', icon: Clock, color: 'text-purple-500' },
              ].map(({ value, label, icon: Icon, color }, i) => (
                <div
                  key={i}
                  className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-2"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${
                    i === 0 ? 'from-red-500 to-red-600' :
                    i === 1 ? 'from-blue-500 to-blue-600' :
                    i === 2 ? 'from-green-500 to-green-600' :
                    'from-purple-500 to-purple-600'
                  } mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-800 mb-2">{value}</h3>
                  <p className="text-gray-600 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Services Section */}
        <section id="services" className="py-24 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-800 mb-6">
                Layanan <span className="text-red-600">Terbaik</span> Kami
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Kami menyediakan berbagai layanan kesehatan terpadu dengan teknologi modern dan tenaga medis profesional
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Rawat Inap",
                  desc: "Fasilitas rawat inap dengan kamar yang nyaman dan perawatan 24 jam oleh tenaga medis berpengalaman",
                  gradient: "from-blue-500 to-blue-600",
                  icon: "🏥"
                },
                {
                  title: "Poliklinik",
                  desc: "Pelayanan konsultasi dokter spesialis dengan berbagai bidang keahlian untuk kesehatan optimal",
                  gradient: "from-green-500 to-green-600",
                  icon: "👨‍⚕️"
                },
                {
                  title: "IGD",
                  desc: "Unit Gawat Darurat yang siap melayani 24/7 dengan peralatan medis canggih dan tim yang responsif",
                  gradient: "from-red-500 to-red-600",
                  icon: "🚑"
                }
              ].map((service, index) => (
                <div
                  key={service.title}
                  className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <div className="relative p-8">
                    <div className="text-4xl mb-6">{service.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-red-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {service.desc}
                    </p>
                    <div className="flex items-center text-red-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Pelajari lebih lanjut</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section id="testimonials" className="py-24 bg-gradient-to-r from-red-50 to-red-100">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Testimoni <span className="text-red-600">Pasien</span>
            </h2>
            <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
              Kepercayaan dan kepuasan pasien adalah prioritas utama kami
            </p>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  name: "Sarah Wijaya",
                  location: "Bandung",
                  rating: 5,
                  text: "Pelayanan yang sangat baik dan profesional. Dokter dan perawat sangat ramah dan membantu proses pemulihan saya.",
                  avatar: "👩‍💼"
                },
                {
                  name: "Ahmad Fauzi",
                  location: "Cimahi",
                  rating: 5,
                  text: "Fasilitas lengkap dan modern. Saya merasa sangat terbantu dengan layanan telemedicine yang disediakan.",
                  avatar: "👨‍💻"
                },
                {
                  name: "Ibu Siti",
                  location: "Bandung",
                  rating: 5,
                  text: "Alhamdulillah sudah sembuh total berkat pengobatan di CMI. Terima kasih untuk semua tim medis yang luar biasa.",
                  avatar: "👵"
                }
              ].map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 group"
                >
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 italic mb-6 leading-relaxed text-lg">
                    {/* Perbaikan: Gunakan &quot; untuk karakter kutip ganda */}
                    &quot;{testimonial.text}&quot;
                  </p>
                  
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-800 text-lg">{testimonial.name}</p>
                      <p className="text-gray-500 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cardiac Risk Calculator Section */}
        <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[700px] mx-auto my-16">
          {/* Left Section - Info */}
          <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-red-50 border-r border-red-100">
            <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Alat Penilaian Kesehatan</p>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Kalkulator Risiko <span className="text-red-600">Jantung</span>
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Periksa risiko penyakit jantung Anda dengan mengisi formulir untuk menentukan skor risiko jantung Anda.
            </p>
            <div className="bg-red-100 p-6 rounded-xl border border-red-200 flex items-start space-x-4">
              <svg className="w-8 h-8 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Penting:</h3>
                <p className="text-red-700 text-base">
                  Kalkulator ini hanya untuk tujuan informasi dan tidak menggantikan nasihat medis profesional. Selalu konsultasikan dengan dokter.
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Calculator Form */}
          <div className="lg:w-1/2 p-10 lg:p-16 bg-[#d32f2f] text-white flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-8 text-white">Cardiac Risk Calculator</h2>

            {showResult ? (
              <div className="bg-white/20 p-8 rounded-xl shadow-inner text-center">
                <h3 className="text-3xl font-bold mb-4 text-white">Hasil Penilaian Risiko Anda:</h3>
                <p className="text-5xl font-extrabold text-yellow-300 mb-6">{result?.score || 0}</p>
                <p className="text-2xl text-white mb-8">{result?.interpretation}</p>
                <button
                  onClick={resetCalculator}
                  className="w-full bg-white/30 text-white py-4 rounded-xl font-bold text-lg hover:bg-white/40 transition-colors duration-300 shadow-lg"
                >
                  Hitung Ulang
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Gender Selection */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Jenis Kelamin</label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setGender('male')}
                      className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 ${
                        gender === 'male' ? 'bg-white text-[#d32f2f] shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      Pria
                    </button>
                    <button
                      onClick={() => setGender('female')}
                      className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 ${
                        gender === 'female' ? 'bg-white text-[#d32f2f] shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      Wanita
                    </button>
                  </div>
                </div>

                {/* Do you smoke? */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Apakah Anda Merokok?</label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setSmoker('yes')}
                      className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 ${
                        smoker === 'yes' ? 'bg-white text-[#d32f2f] shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      Ya
                    </button>
                    <button
                      onClick={() => setSmoker('no')}
                      className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 ${
                        smoker === 'no' ? 'bg-white text-[#d32f2f] shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      Tidak
                    </button>
                  </div>
                </div>

                {/* Body Weight & Body Height */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="weight" className="block text-white text-sm font-medium mb-2">Berat Badan</label>
                    <input
                      type="number"
                      id="weight"
                      className="w-full p-3 pr-12 rounded-xl bg-white border border-white/30 text-[#d32f2f] placeholder-[#d32f2f] focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                      placeholder="Berat"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#d32f2f]">kg</span>
                  </div>
                  <div>
                    <label htmlFor="height" className="block text-white text-sm font-medium mb-2">Tinggi Badan</label>
                    <input
                      type="number"
                      id="height"
                      className="w-full p-3 pr-12 rounded-xl bg-white border border-white/30 text-[#d32f2f] placeholder-[#d32f2f] focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                      placeholder="Tinggi"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#d32f2f]">cm</span>
                  </div>
                </div>

                {/* Age & Systolic Blood Pressure */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-white text-sm font-medium mb-2">Umur</label>
                    <select
                      id="age"
                      className="w-full p-3 rounded-xl bg-white border border-white/30 text-[#d32f2f] appearance-none focus:ring-2 focus:ring-white focus:border-transparent transition-all cursor-pointer"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    >
                      <option value="" disabled>Pilih Umur</option>
                      {ageOptions.map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    {/* Custom arrow for select */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#d32f2f]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="systolicBP" className="block text-white text-sm font-medium mb-2">Tekanan Darah Sistolik</label>
                    <select
                      id="systolicBP"
                      className="w-full p-3 rounded-xl bg-white border border-white/30 text-[#d32f2f] appearance-none focus:ring-2 focus:ring-white focus:border-transparent transition-all cursor-pointer"
                      value={systolicBP}
                      onChange={(e) => setSystolicBP(e.target.value)}
                    >
                      <option value="" disabled>Pilih Angka</option>
                      {bpOptions.map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    {/* Custom arrow for select */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#d32f2f]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <button
                  onClick={calculateRisk}
                  className="w-full bg-white/30 text-white py-4 rounded-xl font-bold text-lg hover:bg-white/40 transition-colors duration-300 shadow-lg"
                  disabled={!gender || !smoker || !weight || !height || !age || !systolicBP}
                >
                  Selanjutnya
                </button>
              </div>
            )}

            {/* Browse Medical Checkup Packages Link */}
            <div className="mt-8 text-center">
              <Link href="#" className="inline-flex items-center text-white hover:text-yellow-200 transition-colors duration-300">
                Ingin pemeriksaan detail? Jelajahi Paket Medical Checkup
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* New: Latest Articles Section */}
        <section id="articles" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-800 mb-6">
                Baca <span className="text-red-600">Artikel</span> Kami
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Dapatkan wawasan terbaru seputar kesehatan, tips, dan berita dari para ahli kami.
              </p>
            </div>

            {articlesLoading ? (
              <div className="text-center text-gray-600 text-lg">Memuat artikel terbaru...</div>
            ) : articlesError ? (
              <div className="text-center text-red-600 text-lg">{articlesError}</div>
            ) : latestArticles.length === 0 ? (
              <p className="text-center text-gray-600 text-2xl mt-10">Belum ada artikel terbaru yang tersedia.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {latestArticles.map((article) => (
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
                        {new Date(article.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors duration-300">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-5 leading-relaxed">
                        {article.excerpt}
                      </p>
                      {/* Ini adalah Link yang seharusnya sudah BENAR */}
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

            <div className="text-center mt-16">
              <Link
                href="/articles"
                className="inline-flex items-center justify-center bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Lihat Semua Artikel
                <ChevronRight className="w-6 h-6 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-700 py-24 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full opacity-50">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}></div>
            </div>
          </div>

          <div className="relative z-10 container mx-auto px-6 text-center">
            <h2 className="text-5xl font-bold mb-6">
              Siap Memulai Perjalanan <span className="text-yellow-300">Kesehatan</span> Anda?
            </h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto text-white/90">
              Hubungi kami sekarang untuk konsultasi gratis dan dapatkan solusi kesehatan terbaik untuk Anda dan keluarga
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center bg-green-500 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-green-600 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                <svg className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.687"/>
                </svg>
                WhatsApp Consultation
              </a>
              
              <a
                href="tel:+6222531000"
                className="group inline-flex items-center bg-white text-red-600 px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                <Phone className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Call Now
              </a>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-gray-900 text-white py-16" id="contact">
          <div className="container mx-auto px-6">
            <div className="grid gap-12 md:grid-cols-4">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">CMI Hospital</h3>
                    <p className="text-sm text-gray-400">Trusted Healthcare</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Klinik CMI menawarkan pengobatan integratif terbaik bagi Anda dan keluarga dengan pendekatan modern dan klasik.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>

                  <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <FaTiktok className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="#about" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">About Us</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#services" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Our Services</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Doctors Team</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/articles" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Health Articles</span>
                    </Link>
                  </li>
                  {/* Tambahkan link ke cardiac risk calculator di bawah ini */}
                  <li>
                    <Link href="/cardiac-risk-calculator" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Cardiac Risk Calculator</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Our Services</h4>
                <ul className="space-y-3">
                  {['Rawat Inap', 'Telemedicine', 'Imunisasi', 'Emergency Care'].map((svc) => (
                    <li key={svc} className="text-gray-300">{svc}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Contact Info</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300">Jl. Tubagus Ismail VIII No.21</p>
                      <p className="text-gray-300">Bandung, West Java</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-red-500" />
                    <p className="text-gray-300">022 253 1000</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Added missing closing tags based on the snippet end */}
            <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} CMI Hospital. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

