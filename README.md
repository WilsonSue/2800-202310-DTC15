## Project Title

### Techommend

---

## Project Description

Our Team, NeedJobPls, is developing Techommend, to provide personalized job recommendations for CS students based on their skills and MBTI personality.

---

## Technologies Used
Frontend:
- HTML(EJS)
- CSS
- Bootstrap
- JavaScript (jQuery)

Backend:
- MEN stack (MongoDB, Express, Node.js)
- Python
- Selenium

---

## File Contents

<pre>
│   index.js
│   package.json
│   README.md
|
├───config
|       config.js
|
├───database
|       databaseConnection.js
|
├───utils
|       utils.js
│
├───MBTI_sort
│       PersonalityAssign.py
│       mbtiAssignment.js
│       sortListings.js
│     
├───webscraper
│       main.py
│       requirements.txt
│
│
├───public
│   ├───audio
│   │       maow.mp3
│   │
│   ├───css
│   │       easter.css
│   │       style.css
│   │
│   └───image
│           404.svg
│           Holygrail.webp
│           Portfolio.svg
│           TechommendLogo.pny
│
├───views
│   │   404.ejs
│   │   easterEgg.ejs
│   │   index.ejs
│   │   login.ejs
│   │   loginSubmit.ejs
│   │   resetPassword.ejs
│   │   savedlistings.ejs
│   │   search.ejs
│   │   searchResults.ejs
│   │   signup.ejs
│   │   signupSubmit.ejs
│   │   userProfile.ejs
│   │
│   └───templates
│           easter.ejs
│           email.ejs
│           footer.ejs
│           header.ejs
│           nav.ejs
│
└───routes
        404.js
        easterEgg.js
        home.js
        login.js
        logout.js
        profile.js
        resetPassword.js
        savedListings.js
        search.js
        signup.js
        update_mbti.js
</pre>

---

## Setup and Installation

To set up the development environment for the project, follow these steps:

**Install the following requirements**:

- Visual Studio Code 1.77.3: [Download from the official website.](https://code.visualstudio.com/download)
- Node.js v19.4.0: [Download from the official website.](https://nodejs.org/en/download)

**Clone the GitHub repository**

- Request to be added as a collaborator on the GitHub repo.
- Once you receive the invitation email from GitHub, accept it to collaborate.
- Clone the repository to your local machine.

**Configure Environment Variables**

- Obtain the required environment variables from the project team.
- Create a .env file in the project's root folder.
- Add the environment variables to the .env file.

**Install Node Modules**

- Open a new terminal in Visual Studio Code.
- Run  `npm install` to install the necessary packages.

**Start the app locally**

- Run `npm install --global nodemon` to automatically restart the app whenever changes are made to the source code.
- Run `nodemon index.js` to start working on Techommend.

---

## How to use Techommend (Features)

**As a user, I want to be able to search for jobs based on my skills and personality.**

1. First login with your user credentials.
2. Click on the search button on the navigation bar.
3. Type the job title, skill, or company you want to search for in the search bar.
4. Click search.
5. You will be redirected to the search results page which is populated with job listings based on your search query. Great job! :smile:

**As a user, I want to be able to save jobs that I am interested in.**

1. First login with your user credentials.
2. Do the steps previously done in searching for a job.
3. Once you've found a job you're interested in, click on the save button.
4. Next, click on the saved listings button on the navigation bar to view your saved listings.
5. You will be redirected to the saved listings page which is populated with the jobs you've saved. Great job! :smile:
6. (Optionally) to remove a saved listing, click on the save button again.

**As a user, I want to login and save my skills, personality, and other information.**

1. First login with your user credentials.
2. Click the hamburger menu at the top right corner of the navigation bar.
3. Click on the profile button.
4. You will be redirected to the profile page where you can view and edit your profile information. Great job! :smile:

---

## Credits, References, and More

This project acknowledges the use of the following resources:

**Credits**

We would like to give credit to the following tutorials and resources that were helpful in the development of our app:

- Tutorial: "[Indeed Jobs Web Scraping Save to CSV](https://www.youtube.com/watch?v=PPcgtx0sI2E&list=PL2ctgOywL8Kij9IQcpsobkJY9sPRIrliR&index=9&ab_channel=JohnWatsonRooney)" by John Watson Rooney
- Tutorial: "[User Agent Switching - Python Web Scraping](https://www.youtube.com/watch?v=90t9WkQbQ2E&list=PL2ctgOywL8Kij9IQcpsobkJY9sPRIrliR&index=6&ab_channel=JohnWatsonRooney)" by John Watson Rooney
- Website: [WhatIsMyBrowser - User Agent Explorer](https://explore.whatismybrowser.com/useragents/explore/) for generating a list of user agents
- Website: [postimages.org](https://postimages.org/) for hosting the Techommend logo


**References**

Sources from ChatGPT:
Title: "MBTI personality types and their relationship to demographic variables and job satisfaction in Korean organizations"
Title: "The relationship between personality traits, flow experience, and creativity in a game-based learning environment"
Title: "The impact of personality type on group decision-making processes: The moderating role of information sharing"
Title: "Personality, motivation, and achievement: A model and review of the literature"
Title: "Personality traits and academic performance: A meta-analysis"
Title: "The influence of personality traits on information-seeking behavior in online social networks"
Title: "Examining the relationship between personality traits and information-seeking behavior on the Web"
Title: "Personality traits, motivation, and language proficiency in a second language"
Title: "The relationship between personality traits and academic dishonesty in a Turkish EFL context"
Title: "Exploring the relationship between personality, learning style preferences, and academic performance"

**Tools**
- Illustrations: [Storyset](https://storyset.com/)
- Icons: [Font Awesome](https://fontawesome.com/)

We would like to express our gratitude to the creators of these tutorials and resources for providing valuable guidance and information in the process of developing our project.

---

## How was AI Used

In our project, Techommend, we leveraged AI in various aspects:

**AI Usage during App Development:**

- We leveraged https://chat.openai.com/ for ideation and guidance throughout the development process. It helped us generate ideas and refine the implementation of our MBTI sorting algorithm.
    
**Data Set Creation and Cleaning:**

- While we did not use AI for creating or cleaning data sets, we optimized the usage of the data in our project. We initially utilized a Kaggle job data set spanning from 2017 to 2019. However, recognizing the need for up-to-date information, we decided to incorporate web scraping techniques to gather job data from Indeed. This process did not involve AI but aimed to ensure the availability of the latest job information.
    
**API Integration and Overcoming Limitations:**

- During development, we encountered limitations with the API that provides the percentage of how well a job recommendation matches the user's MBTI personality. The API from [applymagicsauce.com](http://applymagicsauce.com/) predicted a different personality metric and required input from Facebook, Twitter, and LinkedIn activities, making it infeasible for integration into our app.
- To address this, we developed a custom Python algorithm. This algorithm takes the job description as input and calculates the closest matching MBTI personality based on keywords present in the description. It assigns a final MBTI type and provides a percentage indicating the match strength by evaluating the alignment with each MBTI preference.
- By customizing our algorithm, we overcame the limitations of external APIs and created a tailored solution for our app.
    
If you have any further questions or need clarification, please feel free to reach out.

---

## Contact Information

For any inquiries or support regarding this project, please reach out to:

- Wilson: wilsonbuubuu@gmail.com
- Elijah: sceptile5504@gmail.com / efabon2@my.bcit.ca
- Joanne: cho186@my.bcit.ca

---
