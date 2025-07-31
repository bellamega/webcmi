// src/app/login/page.js
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Untuk navigasi programatis
import { User, Lock, LogIn, XCircle } from 'lucide-react'; // Icon untuk form login

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault(); // Mencegah reload halaman

    setError(''); // Reset error message

    // **********************************************
    // Peringatan Keamanan:
    // Kredensial hardcoded ini TIDAK AMAN untuk produksi.
    // Gunakan backend yang aman untuk otentikasi nyata.
    // **********************************************
    if (username === 'admin' && password === 'password123') {
      // Login berhasil
      alert('Login berhasil! Selamat datang, Admin.'); // Ganti dengan modal UI kustom jika perlu
      router.push('/admin/dashboard'); // Redirect ke halaman dashboard admin
    } else {
      setError('Username atau password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Login Admin</h2>
          <p className="text-gray-500">Akses panel kontrol artikel</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:border-red-500 focus:ring-red-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:border-red-500 focus:ring-red-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="password123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <LogIn className="w-6 h-6 mr-2" />
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Untuk demo: Username: <span className="font-semibold">admin</span> | Password: <span className="font-semibold">password123</span>
        </p>
      </div>
    </div>
  );
}
