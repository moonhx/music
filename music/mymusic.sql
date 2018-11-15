/*
Navicat MySQL Data Transfer

Source Server         : music
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : mymusic

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2018-10-30 23:05:41
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for mgroup
-- ----------------------------
DROP TABLE IF EXISTS `mgroup`;
CREATE TABLE `mgroup` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of mgroup
-- ----------------------------
INSERT INTO `mgroup` VALUES ('1', '1', 'like');
INSERT INTO `mgroup` VALUES ('2', '1', 'history');

-- ----------------------------
-- Table structure for songlist
-- ----------------------------
DROP TABLE IF EXISTS `songlist`;
CREATE TABLE `songlist` (
  `songlist_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `song_id` int(11) NOT NULL,
  `name` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `songname` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `author` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`songlist_id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of songlist
-- ----------------------------
INSERT INTO `songlist` VALUES ('1', '1', '1234', 'like', '你好', '薛之谦');
INSERT INTO `songlist` VALUES ('2', '1', '4567', 'like', '你不好', '薛之谦');
INSERT INTO `songlist` VALUES ('14', '1', '604568155', 'history', '往后余生', '马良,孙茜茹');
INSERT INTO `songlist` VALUES ('8', '1', '601427388', 'history', '卡路里（电影《西虹市首富》插曲）', '火箭少女101');
INSERT INTO `songlist` VALUES ('13', '1', '606149060', 'history', '沙漠骆驼', '展展与罗罗');
INSERT INTO `songlist` VALUES ('12', '1', '121353608', 'history', '半壶纱', '刘珂矣');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` int(4) NOT NULL AUTO_INCREMENT,
  `pwd` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `nickname` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`,`username`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'admin', 'admin', null);
INSERT INTO `user` VALUES ('2', 'roott', 'roott', null);
INSERT INTO `user` VALUES ('7', '1231231', '12322222222', '');
