const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const LaTexItem = sequelize.define('LaTexItem', {
    laTexId: DataTypes.INTEGER,
    questionId: DataTypes.STRING,
    questionText: DataTypes.TEXT,
    questionPicture: DataTypes.STRING,
    arabicTranslationOfQuestion: DataTypes.TEXT,
    chapterNameTopic: DataTypes.STRING,
    duration: DataTypes.STRING,
    justification: DataTypes.TEXT,
    arabicTranslationOfJustification: DataTypes.TEXT,
    justificationImage: DataTypes.STRING,
    justificationType: DataTypes.STRING,
    hint: DataTypes.TEXT,
    arabicTranslationOfHint: DataTypes.TEXT,
    subject: DataTypes.STRING,
    skillProfile: DataTypes.STRING,
    questionType: DataTypes.STRING,
    subTopic: DataTypes.STRING,
    contentType: DataTypes.STRING,
    difficultyLevel: DataTypes.STRING,
    optionA: DataTypes.TEXT,
    optionB: DataTypes.TEXT,
    optionC: DataTypes.TEXT,
    optionD: DataTypes.TEXT,
    correctOptions: DataTypes.STRING,
    inputType: DataTypes.STRING,
    cat1: DataTypes.STRING,
    cat2: DataTypes.STRING,
    cat3: DataTypes.STRING
  }, {});
  LaTexItem.associate = function(models) {
  };
  return LaTexItem;
};
