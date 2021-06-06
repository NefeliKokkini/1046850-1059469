CREATE DATABASE  IF NOT EXISTS `readit` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `readit`;
-- MySQL dump 10.13  Distrib 8.0.24, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: readit
-- ------------------------------------------------------
-- Server version	5.7.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_tokens`
--

DROP TABLE IF EXISTS `auth_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_tokens` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userID` int(10) unsigned NOT NULL,
  `token` varchar(255) NOT NULL,
  `expired` int(11) NOT NULL DEFAULT '0',
  `expireDate` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `auth_fk_userid_idx` (`userID`),
  CONSTRAINT `auth_fk_userid` FOREIGN KEY (`userID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_tokens`
--

LOCK TABLES `auth_tokens` WRITE;
/*!40000 ALTER TABLE `auth_tokens` DISABLE KEYS */;
INSERT INTO `auth_tokens` VALUES (20,1,'688ef30c4c4bd64ce6718c3445add132c8f38aff',0,'2021-06-07 15:47:39'),(21,1,'c89e4fd4ac038961a06fbedbed7a5f25bedccfad',1,'2021-06-07 16:50:33'),(22,1,'9c32a3d0a783b5be9632e013841376150a42b770',0,'2021-06-07 17:44:10'),(23,1,'6adee6f9973688b6575d0026cb9fac2cc504c2c9',0,'2021-06-07 18:03:10'),(24,2,'26b8ddf2eee6873eaa19374569ca4d241cf89de6',0,'2021-06-07 18:24:36'),(25,1,'8609a996f182b1b0d521f0116d73d0f858575837',0,'2021-06-08 01:07:59'),(26,1,'3005c361a6642ae92e15da76b01ca65ab1694fc6',0,'2021-06-08 01:32:16');
/*!40000 ALTER TABLE `auth_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `categoryName` text NOT NULL,
  `info` varchar(255) NOT NULL,
  `creatorID` int(10) unsigned NOT NULL,
  `subscriptions` int(10) unsigned NOT NULL DEFAULT '0',
  `posts` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `categories_fk_userid_idx` (`creatorID`),
  CONSTRAINT `categories_fk_userid` FOREIGN KEY (`creatorID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Web Development','Are a web developer, or are you trying to become one? Then this is the right place for you! Connect with others and discuss problems, find solutions and learn new stuff!',1,2,3),(2,'Cats','Everyone\'s favorite pet, cats are the cutest animals in the world. Who wouldn\'t want to have one?',1,1,2),(3,'Travel','Find new destinations and share experiences with others members of the community.',1,1,1),(4,'Studying','Learn tips and tricks to become more productive during studying. Share your experiences with other students',2,1,2);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `content` longtext NOT NULL,
  `likes` int(10) unsigned NOT NULL DEFAULT '0',
  `date` datetime NOT NULL,
  `creatorID` int(10) unsigned NOT NULL,
  `postID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_fk_userid_idx` (`creatorID`),
  KEY `comments_fk_postid_idx` (`postID`),
  CONSTRAINT `comments_fk_postid` FOREIGN KEY (`postID`) REFERENCES `posts` (`id`),
  CONSTRAINT `comments_fk_userid` FOREIGN KEY (`creatorID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (9,'Also Angular!',0,'2021-06-06 17:18:06',1,6),(10,'php',0,'2021-06-06 17:25:41',2,1),(11,'for sure ',0,'2021-06-06 17:25:50',2,1),(12,'Pet her!',0,'2021-06-06 18:15:14',1,2),(13,'Best tutorial ever, am a NASA Aerospace engineer now.',0,'2021-06-07 00:34:34',1,4);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `postID` int(10) unsigned NOT NULL,
  `userID` int(10) unsigned NOT NULL,
  `likedDate` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `likes_fk_userid_idx` (`userID`),
  KEY `likes_fk_postid_idx` (`postID`),
  CONSTRAINT `likes_fk_postid` FOREIGN KEY (`postID`) REFERENCES `posts` (`id`),
  CONSTRAINT `likes_fk_userid` FOREIGN KEY (`userID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (7,3,1,'2021-06-06'),(8,1,2,'2021-06-06'),(9,2,2,'2021-06-06'),(10,4,1,'2021-06-07');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `content` longtext NOT NULL,
  `likes` int(10) unsigned NOT NULL DEFAULT '0',
  `comments` int(10) unsigned NOT NULL,
  `categoryID` int(10) unsigned NOT NULL,
  `creatorID` int(10) unsigned NOT NULL,
  `createdDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `posts_fk_userid_idx` (`creatorID`),
  KEY `posts_fk_categoryid_idx` (`categoryID`),
  CONSTRAINT `posts_fk_categoryid` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`),
  CONSTRAINT `posts_fk_userid` FOREIGN KEY (`creatorID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'PHP or Node.js?','That is the real question!!',1,2,1,1,'2021-06-06 15:05:21'),(2,'My cat is the best!','No specific reason why.. That\'s how it is!',1,1,2,1,'2021-06-06 15:18:21'),(3,'IDEAL DESTINATIONS IN GREECE','Have you ever wondered which is the best islands in Greece for summer holidays? Then this post is destined for you!',1,0,3,2,'2021-06-06 16:00:21'),(4,'Study guide','10 tips and tricks to get better grades!',1,1,4,2,'2021-06-06 17:10:21'),(6,'React is the future','React is the library of the future! Other alternatives is Vue.js  which is really good!',0,1,1,1,'2021-06-06 17:17:57'),(7,'studying','yeah im studying\r\n',0,0,4,2,'2021-06-06 17:24:52'),(8,'this is an other post','test post',0,0,1,1,'2021-06-06 18:04:19'),(9,'My cat\'s name is Eevee','And wants to say hi to all!',0,0,2,1,'2021-06-06 18:14:22');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userID` int(10) unsigned NOT NULL,
  `categoryID` int(10) unsigned NOT NULL,
  `subscribedDate` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subs_fk_userid_idx` (`userID`),
  KEY `subs_fk_categoryid_idx` (`categoryID`),
  CONSTRAINT `subs_fk_categoryid` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`),
  CONSTRAINT `subs_fk_userid` FOREIGN KEY (`userID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` VALUES (22,1,3,'2021-06-06'),(23,2,1,'2021-06-06'),(24,1,2,'2021-06-06'),(26,1,1,'2021-06-06'),(28,1,4,'2021-06-07');
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birthDate` date NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Nefeli','Kokkini','nefeli','$2b$10$v5X.k0hjErBCjgOVG2i7N.rpwGh1jMtz5jmKAGGcgutyWSATCGLeW','1997-04-05','nefelikokkini@gmail.com'),(2,'vasilis ','saratsis','bas_sar','$2b$10$lWaOMcmKSPaGWNFj0doScOghT8tyjZyltKOZvRNGaGkFdVXXl7y7O','1999-08-10','saratsisbasilis@gmail.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'readit'
--

--
-- Dumping routines for database 'readit'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-07  0:39:41
