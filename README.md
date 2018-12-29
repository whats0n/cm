# HTML LaTex Project

This is a content management system that allows you to upload a master excel file with a specific structure (See sample link) and edits specific columns using an HTML editor (CKEditor) with MathJax (LaTeX) functionality. It also allows you to add or modify other fields with string input, as needed. Finally, you can download copy of the DB as an Excel or CSV file.

## Deployment guide

1. Install Node.js and PostgreSQL

	- Install Node.js
    - Install MySQL

2. Install node packages

    npm install -g sequelize-cli
    npm install -g forever
    npm install

4. Initialize database structure

    sequelize db:create
    sequelize db:migrate

5. Start server

    npm start

