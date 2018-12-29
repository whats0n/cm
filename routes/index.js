const uuid = require("uuid"); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const database = require("../models/index");
const config = require("../config/config.json")
const request = require('request');
const AWS = require('aws-sdk');


process.env.NODE_ENV = "development";
const dbConfig = config[process.env.NODE_ENV];


function createNewExcel(laTexInfo, res) {
	return database.default.LaTex
        .create({
				    name: laTexInfo.name || "Uploaded File"
				})
        	.then(laTex => {
        		var XLSData = JSON.parse(laTexInfo.XLSData);
        		for (var i = 0; i < XLSData.length; i ++) {
        			database.default.LaTexItem
        			.create({
					    laTexId: laTex.id,
					    questionId: XLSData[i].questionId,
					    questionText: XLSData[i].questionText,
					    questionPicture: XLSData[i].questionPicture,
					    arabicTranslationOfQuestion: XLSData[i].arabicTranslationOfQuestion,
					    chapterNameTopic: XLSData[i].chapterNameTopic,
					    duration: XLSData[i].duration,
					    justification: XLSData[i].justification,
					    arabicTranslationOfJustification: XLSData[i].arabicTranslationOfJustification,
					    justificationImage: XLSData[i].justificationImage,
					    justificationType: XLSData[i].justificationType,
					    hint: XLSData[i].hint,
					    arabicTranslationOfHint: XLSData[i].arabicTranslationOfHint,
					    subject: XLSData[i].subject,
					    skillProfile: XLSData[i].skillProfile,
					    questionType: XLSData[i].questionType,
					    subTopic: XLSData[i].subTopic,
					    contentType: XLSData[i].contentType,
					    difficultyLevel: XLSData[i].difficultyLevel,
					    optionA: XLSData[i].optionA,
					    optionB: XLSData[i].optionB,
					    optionC: XLSData[i].optionC,
					    optionD: XLSData[i].optionD,
					    correctOptions: XLSData[i].correctOptions,
					    inputType: XLSData[i].inputType,
					    cat1: XLSData[i].cat1,
					    cat2: XLSData[i].cat2,
					    cat3: XLSData[i].cat3,
					})
        		}
        		res.json({success: true, laTex: laTex})
			})
			.catch(err => {
				
        		console.log("err", err);
        		res.json({success: false, err: err})
			})
}

module.exports = (router) => {
	router.post('/uploadNewExcel', function(req, res) {
		createNewExcel(req.body, res);
	});
	router.post('/fetchExcelIds', function(req, res) {
		database.default.LaTex
        .findAll({
				})
        .then(async laTexes => {
			res.json({
				success: true, 
				laTexes
			})
		})
		.catch(err => {
			res.json({success: false, err: err})
		})
	});
	
	router.post('/deleteExcel', function(req, res) {
		database.default.LaTex
        .destroy({
		    where: {
		        id: req.body.LaTexId
		    }
		})
        .then(() => {
			res.json({
				success: true
			})
		})
		.catch(err => {
			res.json({success: false, err: err})
		})
	});
	
	router.post('/fetchExcelById', function(req, res) {
	 	database.default.LaTex
        .findOne({
        			where: {
				    	id: req.body.LaTexId
        			}
				})
        .then(async laTex => {
        	var items = await laTex.getItems();
			res.json({success: true, laTex: {
				id: laTex.id,
				name: laTex.name,
				items: items
			}})
		})
		.catch(err => {
			res.json({success: false, err: err})
		})
	});
	router.post('/saveExcel', function(req, res) {
	  var laTexInfo = req.body;
	  var XLSData = JSON.parse(laTexInfo.XLSData);
	  XLSData.forEach(item =>  {
		  database.default.LaTexItem
	        .findOne({
	        			where: {
					    	id: item.id
	        			}
					})
	        .then(laTexItem => {
	        	if(laTexItem) { // update

		        	laTexItem.laTexId = item.laTexId;
					laTexItem.questionId = item.questionId;
					laTexItem.questionText = item.questionText;
					laTexItem.questionPicture = item.questionPicture;
					laTexItem.arabicTranslationOfQuestion = item.arabicTranslationOfQuestion;
					laTexItem.chapterNameTopic = item.chapterNameTopic;
					laTexItem.duration = item.duration;
					laTexItem.justification = item.justification;
					laTexItem.arabicTranslationOfJustification = item.arabicTranslationOfJustification;
					laTexItem.justificationImage = item.justificationImage;
					laTexItem.justificationType = item.justificationType;
					laTexItem.hint = item.hint;
					laTexItem.arabicTranslationOfHint = item.arabicTranslationOfHint;
					laTexItem.subject = item.subject;
					laTexItem.skillProfile = item.skillProfile;
					laTexItem.questionType = item.questionType;
					laTexItem.subTopic = item.subTopic;
					laTexItem.contentType = item.contentType;
					laTexItem.difficultyLevel = item.difficultyLevel;
					laTexItem.optionA = item.optionA;
					laTexItem.optionB = item.optionB;
					laTexItem.optionC = item.optionC;
					laTexItem.optionD = item.optionD;
					laTexItem.correctOptions = item.correctOptions;
					laTexItem.inputType = item.inputType;
					laTexItem.cat1 = item.cat1;
					laTexItem.cat2 = item.cat2;
					laTexItem.cat3 = item.cat3;

					laTexItem.save();
	            }
	            else { // insert
	            	laTexItem = {}; 
            		laTexItem.laTexId = item.laTexId;
					laTexItem.questionId = item.questionId;
					laTexItem.questionText = item.questionText;
					laTexItem.questionPicture = item.questionPicture;
					laTexItem.arabicTranslationOfQuestion = item.arabicTranslationOfQuestion;
					laTexItem.chapterNameTopic = item.chapterNameTopic;
					laTexItem.duration = item.duration;
					laTexItem.justification = item.justification;
					laTexItem.arabicTranslationOfJustification = item.arabicTranslationOfJustification;
					laTexItem.justificationImage = item.justificationImage;
					laTexItem.justificationType = item.justificationType;
					laTexItem.hint = item.hint;
					laTexItem.arabicTranslationOfHint = item.arabicTranslationOfHint;
					laTexItem.subject = item.subject;
					laTexItem.skillProfile = item.skillProfile;
					laTexItem.questionType = item.questionType;
					laTexItem.subTopic = item.subTopic;
					laTexItem.contentType = item.contentType;
					laTexItem.difficultyLevel = item.difficultyLevel;
					laTexItem.optionA = item.optionA;
					laTexItem.optionB = item.optionB;
					laTexItem.optionC = item.optionC;
					laTexItem.optionD = item.optionD;
					laTexItem.correctOptions = item.correctOptions;
					laTexItem.inputType = item.inputType;
					laTexItem.cat1 = item.cat1;
					laTexItem.cat2 = item.cat2;
					laTexItem.cat3 = item.cat3;
	                return database.default.LaTexItem
	                	.create(laTexItem);
	            }
			})
			.catch(err => {
				console.log("error saving", err);
			})
	  });
	  res.json({success: true})
	});
	router.get('/', function(req, res) {
	  res.render("index.html");
	});
	return router;
};