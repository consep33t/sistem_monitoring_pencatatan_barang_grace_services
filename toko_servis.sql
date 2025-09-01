-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: toko_servis
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `additional_costs`
--

DROP TABLE IF EXISTS `additional_costs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `additional_costs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sales_id` bigint unsigned NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cost` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_id` (`sales_id`),
  CONSTRAINT `additional_costs_ibfk_1` FOREIGN KEY (`sales_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `additional_costs`
--

LOCK TABLES `additional_costs` WRITE;
/*!40000 ALTER TABLE `additional_costs` DISABLE KEYS */;
INSERT INTO `additional_costs` VALUES (1,2,'Biaya Kirim',25000.00),(2,3,'Ongkir Luar Kota',25000.00),(3,3,'Biaya Packing Kayu',15000.00),(4,4,'Ongkir Luar Kota',45000.00),(5,11,'biaya ganti lcd',100000.00);
/*!40000 ALTER TABLE `additional_costs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Budi Santoso','081234567890','2025-06-09 02:18:56'),(2,'Siti Aminah','082233445566','2025-06-09 02:18:56'),(3,'dadawdwqd','05923925923592','2025-07-09 16:04:35'),(4,'dinda','98123123','2025-07-09 16:21:59'),(5,'makmum','08776776667','2025-07-09 18:52:22'),(6,'fsfsfsfe','0898898293829','2025-07-10 02:14:03'),(7,'asdadad','08110120129','2025-07-21 22:27:02'),(8,'ahbshdad','081231009112','2025-07-21 22:28:00'),(9,'sadasd','082112112121','2025-07-21 22:32:40'),(10,'anananan','08323232','2025-07-21 22:34:20'),(11,'adadawd','0832322233','2025-07-21 22:45:34'),(12,'asasasas','0029199129219','2025-07-21 22:58:53');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_roles`
--

DROP TABLE IF EXISTS `employee_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_roles` (
  `employee_id` int unsigned NOT NULL,
  `role_id` smallint unsigned NOT NULL,
  PRIMARY KEY (`employee_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `employee_roles_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `employee_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_roles`
--

LOCK TABLES `employee_roles` WRITE;
/*!40000 ALTER TABLE `employee_roles` DISABLE KEYS */;
INSERT INTO `employee_roles` VALUES (1,1),(2,2),(3,3),(4,4),(5,4),(6,4);
/*!40000 ALTER TABLE `employee_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` char(72) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Asep Owner','asep@tokoservis.com','$2b$10$vFQ8fiMMrEqfuH5i1VmY4OdIojRV3n/rZoIOFdRwTbJNSVDJN3xRe',1,'2025-06-09 02:18:07'),(2,'Dina Admin','dina@tokoservis.com','hashedpass2',1,'2025-06-09 02:18:07'),(3,'Rudi Kasir','rudi@tokoservis.com','hashedpass3',1,'2025-06-09 02:18:07'),(4,'Toni Teknisi','toni@tokoservis.com','hashedpass4',1,'2025-06-09 02:18:07'),(5,'ageng prayoga','ageng@gmail.com','$2b$10$ByqHzNi/fgOr6CDjxiMfaOMqMB.2yFNy6vP5K422K8OldovHfeMTC',1,'2025-07-09 18:46:41'),(6,'Budi Teknik','budi@tokoservis.com','$2b$10$f2o6R05dpGwQguSumd2vbuMBGsrO6eutISVVeJciPULZkO6h6bRum',1,'2025-07-10 01:53:05');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (2,'card'),(1,'cash'),(4,'ewallet'),(3,'transfer');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (3,3,'/api/images/1749411823903-ChatGPT_Image_4_Mei_2025,_22.43.16.png',1,'2025-06-09 02:43:43'),(5,2,'/api/images/1749417240448-cddc1a56-9607-4b4c-99d8-86566ae05cf1.jpg',1,'2025-06-09 04:14:00'),(6,1,'/api/images/1749417280918-baterai-lithium-li-ion-18650-37v-3000mah-pointed-top-rechargeable-battery-633178.jpg',1,'2025-06-09 04:14:40'),(7,4,'/api/images/1750431276760-medium.webp',1,'2025-06-20 21:54:36'),(8,5,'/api/images/1751138628872-misi.webp',1,'2025-06-29 02:23:48');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `sku` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit_cost` decimal(12,2) unsigned NOT NULL DEFAULT '0.00',
  `unit_price` decimal(12,2) unsigned NOT NULL DEFAULT '0.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `idx_cat` (`category`),
  KEY `idx_brand` (`brand`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'SPK001','Speaker Bluetooth','Audio','Sony',200000.00,350000.00,'2025-06-09 02:19:04'),(2,'LCD123','LCD HP Samsung A12','Sparepart','Samsung',400000.00,600000.00,'2025-06-09 02:19:04'),(3,'asasa123','anjayy','anjayyss','uhuyy',20000.00,30000.00,'2025-06-09 02:43:43'),(4,'b8099fg','sukak ku lah','Sparepart','samsung',35000.00,45000.00,'2025-06-20 21:53:46'),(5,'12nidn','sampoerna','roko','sampoerna grub',30000.00,37000.00,'2025-06-29 02:23:12');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_items`
--

DROP TABLE IF EXISTS `purchase_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `purchase_id` bigint unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `qty` int unsigned NOT NULL,
  `unit_cost` decimal(12,2) unsigned NOT NULL,
  `total_cost` decimal(14,2) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `idx_purchase` (`purchase_id`),
  CONSTRAINT `purchase_items_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `purchase_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_items`
--

LOCK TABLES `purchase_items` WRITE;
/*!40000 ALTER TABLE `purchase_items` DISABLE KEYS */;
INSERT INTO `purchase_items` VALUES (1,1,1,5,200000.00,1000000.00),(2,2,3,5,20000.00,100000.00),(5,5,1,10,2750.00,27500.00),(6,6,1,3,500000.00,1500000.00),(7,7,3,5,50000.00,250000.00);
/*!40000 ALTER TABLE `purchase_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_orders`
--

DROP TABLE IF EXISTS `purchase_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `po_number` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `supplier_id` int unsigned DEFAULT NULL,
  `employee_id` int unsigned DEFAULT NULL,
  `total_cost` decimal(14,2) unsigned NOT NULL,
  `status` enum('ordered','received','canceled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ordered',
  `ordered_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `received_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `po_number` (`po_number`),
  KEY `supplier_id` (`supplier_id`),
  KEY `employee_id` (`employee_id`),
  KEY `idx_status_date` (`status`,`ordered_at`),
  CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `purchase_orders_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_orders`
--

LOCK TABLES `purchase_orders` WRITE;
/*!40000 ALTER TABLE `purchase_orders` DISABLE KEYS */;
INSERT INTO `purchase_orders` VALUES (1,'PO20240601',1,2,600000.00,'received','2025-06-09 02:19:27',NULL),(2,'PO20250710-01',1,2,100000.00,'received','2025-07-10 03:32:10',NULL),(5,'PO-1752621048026',1,5,27500.00,'received','2025-07-16 06:10:48','2025-07-16 06:10:48'),(6,'PO-1752622599621',2,5,1500000.00,'received','2025-07-16 06:36:39','2025-07-16 06:36:39'),(7,'PO-1752623745798',2,5,250000.00,'received','2025-07-16 06:55:45','2025-07-16 06:55:45');
/*!40000 ALTER TABLE `purchase_orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_ALL_TABLES' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_po_receive_AU` AFTER UPDATE ON `purchase_orders` FOR EACH ROW BEGIN
  IF NEW.status = 'received' AND OLD.status <> 'received' THEN
    INSERT INTO stock_movements
      (product_id, movement_type, ref_table, ref_id, qty, cost)
    SELECT
      pi.product_id, 'in', 'purchase', pi.id, pi.qty, pi.unit_cost
    FROM
      purchase_items pi
    WHERE
      pi.purchase_id = NEW.id;
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (2,'admin'),(3,'cashier'),(1,'owner'),(4,'technician');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_no` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id` int unsigned DEFAULT NULL,
  `employee_id` int unsigned DEFAULT NULL,
  `sub_total` decimal(12,2) unsigned NOT NULL,
  `discount_total` decimal(12,2) unsigned NOT NULL DEFAULT '0.00',
  `grand_total` decimal(12,2) unsigned NOT NULL,
  `paid` decimal(12,2) unsigned NOT NULL,
  `payment_method` tinyint unsigned NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_no` (`invoice_no`),
  KEY `customer_id` (`customer_id`),
  KEY `employee_id` (`employee_id`),
  KEY `payment_method` (`payment_method`),
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sales_ibfk_3` FOREIGN KEY (`payment_method`) REFERENCES `payment_methods` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,'INV20240601',1,3,600000.00,50000.00,550000.00,550000.00,1,'Diskon khusus pelanggan tetap','2025-06-09 02:19:33'),(2,'INV20250609-001',1,3,1200000.00,50000.00,1150000.00,1150000.00,1,'Diskon promo toko','2025-06-09 05:40:57'),(3,'INV20250708-002',1,2,1300000.00,50000.00,1250000.00,1250000.00,3,'Customer repeat order - dapat diskon spesial','2025-07-09 02:28:02'),(4,'INV20250708-257',1,1,112000.00,0.00,157000.00,157000.00,4,'mamama','2025-07-09 02:46:11'),(5,'INV20250708-489',1,1,682000.00,25000.00,657000.00,657000.00,1,'bbbaba','2025-07-09 02:53:15'),(6,'INV20250709-659',NULL,1,90000.00,0.00,90000.00,90000.00,1,'','2025-07-09 15:32:47'),(7,'INV20250709-189',NULL,1,30000.00,0.00,30000.00,30000.00,1,'','2025-07-09 15:42:42'),(8,'INV20250709-088',3,1,60000.00,0.00,60000.00,60000.00,1,'','2025-07-09 16:04:35'),(9,'INV20250709-292',4,1,950000.00,50000.00,900000.00,900000.00,3,'','2025-07-09 16:21:59'),(10,'INV20250709-874',5,5,1032000.00,50000.00,982000.00,982000.00,3,'paket lengkap','2025-07-09 18:52:22'),(11,'INV20250709-073',6,6,75000.00,50000.00,125000.00,125000.00,1,'','2025-07-10 02:14:03'),(12,'INV20250721-949',7,5,90000.00,0.00,90000.00,90000.00,3,'','2025-07-21 22:27:02'),(13,'INV20250721-906',8,5,112000.00,0.00,112000.00,112000.00,3,'','2025-07-21 22:28:00'),(14,'INV20250721-127',9,5,37000.00,0.00,37000.00,37000.00,2,'','2025-07-21 22:32:40'),(15,'INV20250721-841',10,5,82000.00,0.00,82000.00,82000.00,1,'','2025-07-21 22:34:20'),(16,'INV20250721-155',11,5,37000.00,0.00,37000.00,37000.00,2,'','2025-07-21 22:45:34'),(17,'INV20250721-685',12,5,30000.00,0.00,30000.00,30000.00,1,'','2025-07-21 22:58:53');
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_items`
--

DROP TABLE IF EXISTS `sales_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sales_id` bigint unsigned NOT NULL,
  `item_type` enum('product','service') COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` int unsigned DEFAULT NULL,
  `service_id` int unsigned DEFAULT NULL,
  `qty` int unsigned NOT NULL DEFAULT '1',
  `unit_price` decimal(12,2) unsigned NOT NULL,
  `discount` decimal(12,2) unsigned NOT NULL DEFAULT '0.00',
  `total` decimal(12,2) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `service_id` (`service_id`),
  KEY `idx_sales` (`sales_id`),
  CONSTRAINT `sales_items_ibfk_1` FOREIGN KEY (`sales_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sales_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `sales_items_ibfk_3` FOREIGN KEY (`service_id`) REFERENCES `service_catalog` (`id`),
  CONSTRAINT `sales_items_chk_1` CHECK ((((`item_type` = _cp850'product') and (`product_id` is not null) and (`service_id` is null)) or ((`item_type` = _cp850'service') and (`service_id` is not null) and (`product_id` is null))))
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_items`
--

LOCK TABLES `sales_items` WRITE;
/*!40000 ALTER TABLE `sales_items` DISABLE KEYS */;
INSERT INTO `sales_items` VALUES (1,1,'product',2,NULL,1,600000.00,0.00,600000.00),(2,1,'service',NULL,1,1,150000.00,50000.00,100000.00),(7,2,'product',2,NULL,1,600000.00,0.00,600000.00),(8,2,'product',1,NULL,1,350000.00,0.00,350000.00),(9,2,'service',NULL,1,1,150000.00,0.00,150000.00),(10,2,'service',NULL,2,1,100000.00,0.00,100000.00),(11,3,'product',3,NULL,1,700000.00,0.00,700000.00),(12,3,'product',1,NULL,1,400000.00,0.00,400000.00),(13,3,'service',NULL,2,1,200000.00,0.00,200000.00),(14,4,'product',3,NULL,1,30000.00,0.00,30000.00),(15,4,'product',4,NULL,1,45000.00,0.00,45000.00),(16,4,'product',5,NULL,1,37000.00,0.00,37000.00),(17,5,'product',5,NULL,1,37000.00,0.00,37000.00),(18,5,'product',4,NULL,1,45000.00,0.00,45000.00),(19,5,'product',2,NULL,1,600000.00,0.00,600000.00),(20,6,'product',3,NULL,3,30000.00,0.00,90000.00),(21,7,'product',3,NULL,1,30000.00,0.00,30000.00),(22,8,'product',3,NULL,2,30000.00,0.00,60000.00),(23,9,'product',2,NULL,1,600000.00,0.00,600000.00),(24,9,'product',1,NULL,1,350000.00,0.00,350000.00),(25,10,'product',5,NULL,1,37000.00,0.00,37000.00),(26,10,'product',4,NULL,1,45000.00,0.00,45000.00),(27,10,'product',1,NULL,1,350000.00,0.00,350000.00),(28,10,'product',2,NULL,1,600000.00,0.00,600000.00),(29,11,'product',3,NULL,1,30000.00,0.00,30000.00),(30,11,'product',4,NULL,1,45000.00,0.00,45000.00),(31,12,'product',4,NULL,2,45000.00,0.00,90000.00),(32,13,'product',5,NULL,1,37000.00,0.00,37000.00),(33,13,'product',4,NULL,1,45000.00,0.00,45000.00),(34,13,'product',3,NULL,1,30000.00,0.00,30000.00),(35,14,'product',5,NULL,1,37000.00,0.00,37000.00),(36,15,'product',5,NULL,1,37000.00,0.00,37000.00),(37,15,'product',4,NULL,1,45000.00,0.00,45000.00),(38,16,'product',5,NULL,1,37000.00,0.00,37000.00),(39,17,'product',3,NULL,1,30000.00,0.00,30000.00);
/*!40000 ALTER TABLE `sales_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_ALL_TABLES' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_salesitem_AI` AFTER INSERT ON `sales_items` FOR EACH ROW BEGIN
  IF NEW.item_type = 'product' THEN
    INSERT INTO stock_movements
      (product_id, movement_type, ref_table, ref_id, qty, cost)
    VALUES
      (NEW.product_id, 'out', 'sale', NEW.id, -NEW.qty, NULL);
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_ALL_TABLES' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_salesitem_AD` AFTER DELETE ON `sales_items` FOR EACH ROW BEGIN
  IF OLD.item_type = 'product' THEN
    INSERT INTO stock_movements
      (product_id, movement_type, ref_table, ref_id, qty, cost)
    VALUES
      (OLD.product_id, 'in', 'sale', OLD.id, OLD.qty, NULL);
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `service_catalog`
--

DROP TABLE IF EXISTS `service_catalog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_catalog` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `default_price` decimal(12,2) unsigned NOT NULL DEFAULT '0.00',
  `estimated_minutes` smallint unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_catalog`
--

LOCK TABLES `service_catalog` WRITE;
/*!40000 ALTER TABLE `service_catalog` DISABLE KEYS */;
INSERT INTO `service_catalog` VALUES (1,'SVC001','Ganti LCD HP',150000.00,60,'2025-06-09 02:19:04'),(2,'SVC002','Servis Speaker',100000.00,45,'2025-06-09 02:19:04');
/*!40000 ALTER TABLE `service_catalog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_images`
--

DROP TABLE IF EXISTS `service_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_images` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `service_id` int unsigned NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `service_images_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `service_catalog` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_images`
--

LOCK TABLES `service_images` WRITE;
/*!40000 ALTER TABLE `service_images` DISABLE KEYS */;
INSERT INTO `service_images` VALUES (1,1,'images/ganti_lcd.jpg',1,'2025-06-09 02:19:11'),(2,2,'images/servis_speaker.jpg',1,'2025-06-09 02:19:11');
/*!40000 ALTER TABLE `service_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_movements`
--

DROP TABLE IF EXISTS `stock_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_movements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `movement_type` enum('in','out','adjust') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ref_table` enum('purchase','sale','manual') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ref_id` bigint unsigned DEFAULT NULL,
  `qty` int NOT NULL,
  `cost` decimal(12,2) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_prod_date` (`product_id`,`created_at`),
  CONSTRAINT `stock_movements_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_movements`
--

LOCK TABLES `stock_movements` WRITE;
/*!40000 ALTER TABLE `stock_movements` DISABLE KEYS */;
INSERT INTO `stock_movements` VALUES (1,1,'in','purchase',1,5,200000.00,'2025-06-09 02:19:27'),(2,2,'out','sale',1,-1,NULL,'2025-06-09 02:19:33'),(3,2,'out','sale',1,-1,NULL,'2025-06-09 02:19:33'),(4,1,'adjust','manual',NULL,1,NULL,'2025-06-09 02:19:46'),(5,2,'out','sale',7,-1,NULL,'2025-06-09 05:40:57'),(6,1,'out','sale',8,-1,NULL,'2025-06-09 05:40:57'),(7,3,'out','sale',11,-1,NULL,'2025-07-09 02:28:02'),(8,1,'out','sale',12,-1,NULL,'2025-07-09 02:28:02'),(9,3,'out','sale',14,-1,NULL,'2025-07-09 02:46:11'),(10,4,'out','sale',15,-1,NULL,'2025-07-09 02:46:11'),(11,5,'out','sale',16,-1,NULL,'2025-07-09 02:46:11'),(12,5,'out','sale',17,-1,NULL,'2025-07-09 02:53:15'),(13,4,'out','sale',18,-1,NULL,'2025-07-09 02:53:15'),(14,2,'out','sale',19,-1,NULL,'2025-07-09 02:53:15'),(15,3,'out','sale',20,-3,NULL,'2025-07-09 15:32:47'),(16,3,'out','sale',21,-1,NULL,'2025-07-09 15:42:42'),(17,3,'out','sale',22,-2,NULL,'2025-07-09 16:04:35'),(18,2,'out','sale',23,-1,NULL,'2025-07-09 16:21:59'),(19,1,'out','sale',24,-1,NULL,'2025-07-09 16:21:59'),(20,5,'out','sale',25,-1,NULL,'2025-07-09 18:52:22'),(21,4,'out','sale',26,-1,NULL,'2025-07-09 18:52:22'),(22,1,'out','sale',27,-1,NULL,'2025-07-09 18:52:22'),(23,2,'out','sale',28,-1,NULL,'2025-07-09 18:52:22'),(24,3,'out','sale',29,-1,NULL,'2025-07-10 02:14:03'),(25,4,'out','sale',30,-1,NULL,'2025-07-10 02:14:03'),(26,3,'in','purchase',2,5,20000.00,'2025-07-10 03:32:26'),(27,3,'adjust','manual',NULL,19,NULL,'2025-07-10 03:33:37'),(28,2,'adjust','manual',NULL,21,NULL,'2025-07-10 03:33:37'),(29,5,'adjust','manual',NULL,18,NULL,'2025-07-10 03:33:37'),(30,1,'adjust','manual',NULL,13,NULL,'2025-07-10 03:33:37'),(31,4,'adjust','manual',NULL,19,NULL,'2025-07-10 03:33:37'),(32,3,'adjust','manual',NULL,10,50000.00,'2025-07-16 03:45:21'),(33,3,'adjust','manual',NULL,-5,NULL,'2025-07-16 03:55:50'),(34,2,'in','manual',NULL,5,118000.00,'2025-07-16 04:44:04'),(35,5,'in','manual',NULL,5,185000.00,'2025-07-16 04:51:27'),(36,4,'in','manual',NULL,5,75000.00,'2025-07-16 05:03:55'),(38,5,'in','manual',NULL,1,15000.00,'2025-07-16 05:43:53'),(39,5,'in','manual',NULL,12,720000.00,'2025-07-16 05:45:54'),(41,1,'in','purchase',5,20,1100000.00,'2025-07-16 06:10:48'),(42,1,'in','purchase',5,6,16500.00,'2025-07-16 06:35:08'),(43,1,'in','purchase',6,3,1500000.00,'2025-07-16 06:36:39'),(44,1,'in','purchase',5,10,27500.00,'2025-07-16 06:37:10'),(45,1,'in','purchase',5,6,2750.00,'2025-07-16 06:38:14'),(46,1,'in','purchase',5,10,200000.00,'2025-07-16 06:39:22'),(47,3,'in','purchase',7,5,250000.00,'2025-07-16 06:55:46'),(48,4,'out','sale',31,-2,NULL,'2025-07-21 22:27:02'),(49,5,'out','sale',32,-1,NULL,'2025-07-21 22:28:00'),(50,4,'out','sale',33,-1,NULL,'2025-07-21 22:28:00'),(51,3,'out','sale',34,-1,NULL,'2025-07-21 22:28:00'),(52,5,'out','sale',35,-1,NULL,'2025-07-21 22:32:40'),(53,5,'out','sale',36,-1,NULL,'2025-07-21 22:34:20'),(54,4,'out','sale',37,-1,NULL,'2025-07-21 22:34:20'),(55,5,'out','sale',38,-1,NULL,'2025-07-21 22:45:34'),(56,3,'out','sale',39,-1,NULL,'2025-07-21 22:58:53');
/*!40000 ALTER TABLE `stock_movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'PT. Sumber Jaya Elektronik','0211234567','Jl. Industri No. 123','2025-06-09 02:18:56'),(2,'CV. Teknologi Abadi','0217654321','Jl. Mangga Dua No. 77','2025-06-09 02:18:56'),(3,'PT. Mencari Cinta Sejati','085767777677','jl. menuju pintu syurga no.01','2025-07-16 17:20:58');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-06  1:50:35
