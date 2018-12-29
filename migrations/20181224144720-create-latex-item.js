'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LaTexItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      laTexId: {
        type: Sequelize.INTEGER
      },
      questionId: {
        type: Sequelize.STRING
      },
      questionText: {
        type: Sequelize.TEXT
      },
      questionPicture: {
        type: Sequelize.STRING
      },
      arabicTranslationOfQuestion: {
        type: Sequelize.TEXT
      },
      chapterNameTopic: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.STRING
      },
      justification: {
        type: Sequelize.TEXT
      },
      arabicTranslationOfJustification: {
        type: Sequelize.TEXT
      },
      justificationImage: {
        type: Sequelize.STRING
      },
      justificationType: {
        type: Sequelize.STRING
      },
      hint: {
        type: Sequelize.TEXT
      },
      arabicTranslationOfHint: {
        type: Sequelize.TEXT
      },
      subject: {
        type: Sequelize.STRING
      },
      skillProfile: {
        type: Sequelize.STRING
      },
      questionType: {
        type: Sequelize.STRING
      },
      subTopic: {
        type: Sequelize.STRING
      },
      contentType: {
        type: Sequelize.STRING
      },
      difficultyLevel: {
        type: Sequelize.STRING
      },
      optionA: {
        type: Sequelize.TEXT
      },
      optionB: {
        type: Sequelize.TEXT
      },
      optionC: {
        type: Sequelize.TEXT
      },
      optionD: {
        type: Sequelize.TEXT
      },
      correctOptions: {
        type: Sequelize.STRING
      },
      inputType: {
        type: Sequelize.STRING
      },
      cat1: {
        type: Sequelize.STRING
      },
      cat2: {
        type: Sequelize.STRING
      },
      cat3: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('LaTexItems');
  }
};