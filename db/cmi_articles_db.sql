-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 24, 2025 at 04:18 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cmi_articles_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `publication_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `views_count` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `title`, `slug`, `excerpt`, `image_url`, `content`, `publication_date`, `created_at`, `views_count`) VALUES
(29, 'Pasien Sembuh Kanker Kelenjar Getah Bening', 'pasien-sembuh-kanker-kelenjar-getah-bening', 'Cerita Bu Euis Pasien Sembuh Kanker Kelenjar Getah Bening', '/images/684d26cbacf386.21976502.jpg', 'Cerita Bu Euis Pasien Sembuh Kanker Kelenjar Getah Bening', '2025-06-14 14:37:00', '2025-06-14 07:37:47', 2),
(30, 'Kisah Pasien Sembuh Kanker Payudara', 'kisah-pasien-sembuh-kanker-payudara', 'Cerita Pasien Sembuh Klinik CMI , Bu Euis', '/images/684d28847d3a20.37419559.jpg', 'Cerita Pasien Sembuh Klinik CMI , Bu Euis', '2025-06-14 14:44:00', '2025-06-14 07:45:08', 0),
(31, '700 Juta Orang di Dunia Mengalami Penyakit Gagal Ginjal Kronis.', '700-juta-orang-di-dunia-mengalami-penyakit-gagal-ginjal-kronis', '700 Juta Orang di Dunia Mengalami Penyakit Gagal Ginjal Kronis.', '/images/684f7d1a363e34.66589895.jpg', '700 Juta Orang di Dunia Mengalami Penyakit Gagal Ginjal Kronis.', '2025-06-16 09:11:00', '2025-06-16 02:10:34', 4),
(32, 'Khasiat Buah Blackberry Penghambat Pertumbuhan Sel Kanker.', 'khasiat-buah-blackberry-penghambat-pertumbuhan-sel-kanker', 'Khasiat Buah Blackberry Penghambat Pertumbuhan Sel Kanker.', '/images/684f9085b3a0f5.24143046.jpg', 'Khasiat Buah Blackberry Penghambat Pertumbuhan Sel Kanker.', '2025-06-16 03:31:00', '2025-06-16 03:33:25', 0),
(33, 'Ternyata Warna Urine itu bisa Warna Warni Seperti Pelangi Loh!!', 'ternyata-ada-warna-urine-warna-warni-seperti-pelangi-loh', 'ukan hanya pelangi, ternyata urine juga berwarna-warni!\n\nHalo sahabat CMI!\nDi post sebelumnya, kita sudah membahas mengenai urine dengan warna kuning. Tapi ternyata, urine bukan hanya berwarna kuning.', '/images/684f93dee919e0.79104799.jpg', 'ukan hanya pelangi, ternyata urine juga berwarna-warni!\n\nHalo sahabat CMI!\nDi post sebelumnya, kita sudah membahas mengenai urine dengan warna kuning. Tapi ternyata, urine bukan hanya berwarna kuning.', '2025-06-16 07:34:00', '2025-06-16 03:47:42', 2),
(34, 'Bebaskan Hidup Tanpa Cuci Darah di Klinik CMI', 'bebaskan-hidup-tanpa-cuci-darah-di-klinik-cmi', 'Saatnya berobat tanpa menggunakan Pengobatan Cuci Darah', '/images/68512b85b2e3d1.06572872.jpg', 'Saatnya berobat tanpa menggunakan Pengobatan Cuci Darah', '2025-06-17 08:42:00', '2025-06-17 08:47:01', 19),
(35, 'Klinik CMI Bandung Pengobatan Kanker Tanpa Operasi', 'klinik-cmi-bandung-pengobatan-kanker-tanpa-operasi', 'Tahukah Kamu Ada Pengobatan Kanker Tanpa Operasi menggunakan Formula Pengobatan Modern dan Kontenporer (Kimia Organik).', '/images/6853ae2edbcfc6.00586892.jpg', 'Pengobatan Klinik CMI Bandung memiliki Pengobatan dengan Formula gabungan antara Pengobatan Modern dan Pengobatan Kontenporer (Kimia Organik). dengan Formula yang sudah terjuji dengan adanya Pasien Sembuh tanpa Operasi, Klinik CMI dipercaya sudah lama sejak tahun 2008 sampai Sekarang. Pasien pada Klinik CMI sendiri sangat nyaman pada Pengobatan di Klinik ini dengan tidak adanya Operasi. Pengobatan Kimia Organik ini atau disebut juga dengan Herbal sangat mudah untuk di konsumsi dibanding dengan obat-obatan padan umumnya, oleh karena itu Pasien sangat nyaman untuk Berobat di Klinik CMI ini. ', '2025-06-19 06:23:00', '2025-06-19 06:29:02', 8);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
