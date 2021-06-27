# hackathon
This project is for hackathon 9.0
# Brief Summary :

## Problem Statement :

Develop an authentication system alongwith mailscheduler with given design.


## Decription :

This is a website which has a built in authentication system and a recurrent mail sender

## How I implemented it in short :

1) Made use of HTML, CSS and Boostrap to design the structure of website
2) MongoDB to save the users , mails
3) used Bcrypt to hash the passwords in MongoDB
4) Made use of JWT to save the token for the user on the browser as a cookie. ( So that there is  no necessity for the user to login each time he closes his website) and passport js for users through google
5) Also made use of this JWT token to make few pages secure so that only logged in users are able to see those secured pages.
6) Then implemented a forgot password system by sending a JWT token embedded url to change password for a user ( Now to make it more secure kept the expiry of this JWT token as 15 minutes - so that user can update as many time under 15 minutes)
7) After 15 mins, if the user tries to change password will be taken to HOME-PAGE again
8) Then implemented the recurrent mail scheduler feature.
9) this feature implemented using node-scheduler and cron scheduled recurrently
10) Used sendgrid API  to send mails      
11) Finally deployed on HEROKU
12) Note : For the mail service to work (the sender mail needs to be registered in sendgrid website)

## Steps to reproduce :

1) npm i 
2) node index.js

## Output :

[!website](https://hackathonmailer.herokuapp.com/)


