-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 19 mars 2022 à 13:35
-- Version du serveur : 10.4.22-MariaDB
-- Version de PHP : 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `chat_mydi`
--

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `content` varchar(255) NOT NULL,
  `user_id` int(12) NOT NULL,
  `room_id` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`message_id`, `date`, `content`, `user_id`, `room_id`) VALUES
(1, '2022-02-22', 'test message', 1, 1),
(2, '2022-02-22', 'Yo !', 3, 2),
(3, '2022-02-22', 'Yo man la forme ?', 1, 2),
(4, '2022-02-22', 'Yes et toi ?', 3, 2),
(5, '2022-02-22', 'Bah écoutes ça va !', 1, 2),
(6, '2022-02-22', 'Un petit LOL ?', 3, 2),
(7, '2022-02-22', 'Allez vas-y !', 1, 2),
(8, '2022-02-22', 'Envoies une invit\' !', 1, 2),
(9, '2022-02-22', 'Enfaite flemme, y\'a ma go qui vient d\'arriver !', 3, 2),
(10, '2022-02-22', 'Roooh t\'abuses !', 1, 2),
(11, '2022-02-22', 'Passes pas le bonjour à ta go du coup ! :P', 1, 2),
(12, '2022-02-22', 'haha', 3, 2),
(13, '2022-02-22', 'Allez ciao !', 1, 2),
(14, '2022-02-22', 'Ciao l\'artiste !', 3, 2),
(15, '2022-02-22', 'Yo les manos, bien ?', 2, 2),
(16, '2022-02-22', 'Yes et toi ?', 3, 2),
(17, '2022-02-22', 'Go Lol !', 1, 2),
(18, '2022-02-22', 'Allez !', 3, 2),
(20, '2022-03-18', 'bonsoir', 2, 2),
(21, '2022-03-18', 'Bonsoir toi', 1, 2),
(22, '2022-03-17', 'Nous allons tester la premiere room', 2, 1),
(23, '2022-03-17', 'Bonsoir everyone', 3, 1),
(24, '2022-03-17', 'Re bonjour', 2, 1),
(25, '2022-03-17', 'Encore bonjour?', 1, 1),
(26, '2022-03-18', 'Il est quelle heure ?', 3, 3),
(27, '2022-03-19', 'Jsp', 2, 3),
(28, '2022-03-19', 'Ba regarde ton tel', 2, 3),
(29, '2022-03-19', 'Bien vu', 1, 3),
(30, '2022-03-19', 'J\'ai un bug ', 3, 3),
(31, '2022-03-19', 'ah non c\'est ok', 3, 3),
(32, '2022-03-19', 'zaoelnjdsjgnfdm', 2, 3),
(33, '2022-03-19', 'etpokrjiye', 1, 3);

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(12) NOT NULL,
  `name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`role_id`, `name`) VALUES
(0, 'admin'),
(1, 'user'),
(2, 'mp');

-- --------------------------------------------------------

--
-- Structure de la table `rooms`
--

CREATE TABLE `rooms` (
  `room_id` int(12) NOT NULL,
  `name` varchar(64) NOT NULL,
  `image` varchar(64) NOT NULL,
  `private` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `rooms`
--

INSERT INTO `rooms` (`room_id`, `name`, `image`, `private`) VALUES
(1, 'Test room', '', 0),
(2, 'Team LoL', '', 0),
(3, 'Room', '', 1),
(4, 'test', '', 0);

-- --------------------------------------------------------

--
-- Structure de la table `rooms_users`
--

CREATE TABLE `rooms_users` (
  `room_id` int(12) NOT NULL,
  `user_id` int(12) NOT NULL,
  `role_id` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `rooms_users`
--

INSERT INTO `rooms_users` (`room_id`, `user_id`, `role_id`) VALUES
(1, 0, 0),
(1, 1, 1),
(1, 2, 1),
(1, 3, 1),
(2, 0, 0),
(2, 1, 0),
(2, 2, 1),
(2, 3, 1),
(3, 0, 0),
(3, 1, 0),
(3, 2, 1),
(3, 3, 1),
(4, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `user_id` int(12) NOT NULL,
  `pseudo` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`user_id`, `pseudo`, `password`) VALUES
(0, 'superadmin', 'admin'),
(1, 'Rico', 'blabla'),
(2, 'Koffi', 'yoyo'),
(3, 'Artur', 'yeye'),
(4, 'test', ''),
(5, 'pseudo', 'hgru');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `id_user` (`user_id`,`room_id`),
  ADD KEY `id_room` (`room_id`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Index pour la table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`);

--
-- Index pour la table `rooms_users`
--
ALTER TABLE `rooms_users`
  ADD KEY `id_room` (`room_id`,`user_id`,`role_id`),
  ADD KEY `id_role` (`role_id`),
  ADD KEY `id_user` (`user_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `room_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Contraintes pour la table `rooms_users`
--
ALTER TABLE `rooms_users`
  ADD CONSTRAINT `rooms_users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  ADD CONSTRAINT `rooms_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `rooms_users_ibfk_3` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
