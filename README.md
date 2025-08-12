# TravelBuddy 

**TravelBuddy** is a web application that allows users to quickly search for the cheapest round-trip flights between two airports. Users can register, log in, enter origin and destination airports with travel dates, and receive flight options with prices and booking links.

---

## Features

- User registration and login with JWT authentication
- Search for round-trip flights by airport codes and dates
- Display airline name, price, and booking link (via Skyscanner)
- Modern React frontend with responsive UI
- ASP.NET Core backend integrating with Google Flights API via RapidAPI

---

## Technologies Used

- **Backend:** ASP.NET Core (C#)
- **Frontend:** React with TypeScript
- **Flight API:** Kiwi.com API via RapidAPI
- **Authentication:** JWT stored in localStorage
- **Tools:** Docker (optional), Git & GitHub

---



### Setup and Run Backend

1. Navigate to the backend project folder.

2. Create a `.env` or `appsettings.json` file with your RapidAPI credentials:
3. Run the backend
    dotnet run
```env
RapidAPI__FlightsHost=your-rapidapi-host
RapidAPI__FlightsKey=your-rapidapi-key
```
3. Run the backend
    dotnet run

### Setup and Run Frontend
Navigate to the frontend project folder.

1. Install dependencies:

    npm install
2. Run the React development server:
3. 
    npm start

### Usage:
  1. Register a new account.

  2. Log in using your credentials.

  3. Use the search form to enter:

          Origin airport code (e.g., BEG)
          Destination airport code (e.g., CDG)
          Outbound date
          Number of stay days
     
  4. View the list of flights with prices and booking links.

  5. Click the booking link to be redirected to Skyscanner.
