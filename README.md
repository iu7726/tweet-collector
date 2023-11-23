# Twitter Tweet Collector

![TypeScript](https://img.shields.io/badge/-TypeScript-blue?logo=typescript&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/-RabbitMQ-%23FF6600?logo=rabbitmq&logoColor=white)
![Twitter API](https://img.shields.io/badge/-TwitterAPI-%231DA1F2?logo=twitter&logoColor=white)

## Description
This project is designed to automate the collection and processing of Twitter data. It fetches tweets based on user IDs, processes tweet information, and stores relevant data in a database.

## Features
- Collects tweets based on specific user IDs.
- Processes tweets to create posts and manage threads.
- Updates user profiles and tweet information in a database.

## Setup

### Prerequisites
- Node.js installed on your system.
- Access to Twitter API credentials.
- A working instance of ModelManager and related entities.

### Installation
1. Clone the repository to your local machine.
2. Install necessary dependencies: npm install
3. Set up your Twitter API credentials and other necessary environment variables.

### Environment Variables
- Ensure that your environment variables for accessing the Twitter API are set correctly.

## Usage
1. TwitterJob: This job searches for new tweets based on Twitter user ID and stores them in the database.
2. TwitterPostJob: This job involves reassembling the collected tweets by weaving them into threads
- Execute the job to process and post tweets.
3. TwitterUserJob: This job handles Twitter user data.
- Executes to update Twitter user profiles.

## API Url
[TwitterAPI](https://developer.twitter.com/en/docs/twitter-api)