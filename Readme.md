# Property Matching System

This project is a property matching system that connects property requests with relevant ads based on specific criteria. The system includes three main roles: Admin, Client, and Agent.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Admin](#admin)
  - [Client](#client)
  - [Agent](#agent)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Docker](#docker)
- [Postman Documentation](#postman-documentation)
- [License](#license)

## Overview

The system has three main roles:

1. **Admin**: Can view statistics about ads and property requests.
2. **Client**: Can create property requests specifying their needs.
3. **Agent**: Can create ads for properties available for rent or sale.

The project is built using Node.js, TypeScript, and MongoDB with Mongoose for database interactions.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yousefshabaneg/matching-ads-system.git
   cd matching-ads-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the required environment variables (see [Environment Variables](#environment-variables)).

4. Run the application:

   ```bash
   npm run dev
   ```

## Usage

### Admin

Admins can get statistics about ads and property requests.

### Client

Clients can create property requests specifying their needs.

### Agent

Agents can create ads for properties available for rent or sale.

## API Endpoints

### Admin

#### Get Stats

- **URL**: `/admin/stats`
- **Method**: `GET`
- **Auth Required**: Yes (Admin only)
- **Description**: Returns statistics about ads and property requests for a given user.
- **Query Parameters**:
  - `userId` (optional): Filter stats by user ID.
  - `page` (optional): Page number for pagination.
  - `limit` (optional): Number of items per page.
- **Response**:

  ```json
  {
    "data": [
      {
        "_id": "665227385f2c781117becc90",
        "name": "Agent",
        "phone": "01234567892",
        "role": "AGENT",
        "status": "ACTIVE",
        "adsCount": 3,
        "totalAdsAmount": 57000,
        "requestsCount": 0,
        "totalRequestsAmount": 0
      },
      {
        "_id": "665227455f2c781117becc92",
        "name": "Client",
        "phone": "01234567891",
        "role": "CLIENT",
        "status": "ACTIVE",
        "adsCount": 0,
        "totalAdsAmount": 0,
        "requestsCount": 3,
        "totalRequestsAmount": 58000
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 2
  }
  ```

### Client

#### Create Property Request

- **URL**: `/property/clientRequest`
- **Method**: `POST`
- **Auth Required**: (Client only)
- **Description**: Creates a new property request.
- **Request Body**:

  ```json
  {
    "propertyType": "APARTMENT",
    "price": "19000",
    "district": "kafr abdo",
    "city": "alex",
    "area": "alex",
    "userId": "665227455f2c781117becc92",
    "description": "Looking for a 2-bedroom apartment."
  }
  ```

- **Response**:

  ```json
  {
    "status": "SUCCESS",
    "message": "Created Successfully",
    "data": {
      "area": "alex",
      "price": 19000,
      "city": "alex",
      "district": "kafr abdo",
      "userId": "665227455f2c781117becc92",
      "propertyType": "APARTMENT",
      "_id": "66523618578cadbc64a894f0",
      "createdAt": "2024-05-25T19:03:52.212Z",
      "updatedAt": "2024-05-25T19:03:52.212Z",
      "__v": 0
    }
  }
  ```

### Agent

#### Create Ad

- **URL**: `/ads`
- **Method**: `POST`
- **Auth Required**: (Agent only)
- **Description**: Creates a new ad for a property.
- **Request Body**:

  ```json
    {
        "propertyType": "APARTMENT",
        "price": "19000",
        "district":"kafr abdo",
        "city":"alex",
        "area": "alex",
        "userId":"665227385f2c781117becc90"
        "description": "Luxury villa with pool."
    }
  ```

- **Response**:

  ```json
  {
    "status": "SUCCESS",
    "message": "Created Successfully",
    "data": {
      "area": "alex",
      "price": 19000,
      "city": "alex",
      "district": "kafr abdo",
      "description": "nice description",
      "userId": "665227385f2c781117becc90",
      "propertyType": "APARTMENT",
      "_id": "66523676578cadbc64a894f2",
      "createdAt": "2024-05-25T19:05:26.979Z",
      "updatedAt": "2024-05-25T19:05:26.979Z",
      "__v": 0
    }
  }
  ```

#### Get matched property requests

- **URL**: `/ads/match/:id`
- **Method**: `GET`
- **Auth Required**: (Agent only)
- **Description**: Get the matched property requests for this ads
- **Response**:

  ```json
  {
    "status": "SUCCESS",
    "data": [
      {
        "_id": "665229a7530bc99ca3f81c1d",
        "area": "alex",
        "price": 19000,
        "city": "alex",
        "district": "kafr abdo",
        "userId": "665227455f2c781117becc92",
        "propertyType": "APARTMENT",
        "createdAt": "2024-05-25T18:10:47.535Z",
        "updatedAt": "2024-05-25T18:10:47.535Z",
        "__v": 0
      },
      {
        "_id": "66523618578cadbc64a894f0",
        "area": "alex",
        "price": 19000,
        "city": "alex",
        "district": "kafr abdo",
        "userId": "665227455f2c781117becc92",
        "propertyType": "APARTMENT",
        "createdAt": "2024-05-25T19:03:52.212Z",
        "updatedAt": "2024-05-25T19:03:52.212Z",
        "__v": 0
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 2
  }
  ```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Application
API_PORT=3000
BASE_URL=http://localhost:3000
NODE_ENV=development
LOG_PATH=./logs

# Database
DATABASE_URI=mongodb://127.0.0.1:27017/matchingAds
DATABASE_URI=mongodb://127.0.0.1:27017/matchingAdsTest

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=14d

# Pagination
DEFAULT_PAGE_NUMBER=1
DEFAULT_PAGE_SIZE=20

```
