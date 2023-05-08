import { useState } from "react";
import CityRentalInfo from "./Components/CityRentalInfo";
import CountrySelector from "./Components/CountrySelector";
import StateCitySelector from "./Components/StateCitySelector";

const App = () => {
  const [holidays, setHolidays] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [selectedHoliday, setSelectedHoliday] = useState("");
  const [weather, setWeather] = useState(Object);
  const [city, setCity] = useState("");
  const [rentalData, setRentalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCountrySubmit = async (
    year: number,
    selectedCountryCode: string
  ) => {
    setCountryCode(selectedCountryCode);
    const response = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${selectedCountryCode}`
    );
    const data = await response.json();
    setHolidays(data);
    setSelectedHoliday("");
    setWeather("");
    setRentalData([]);
  };

  const handleCitySubmit = async (city: string) => {
    setRentalData([]);
    setIsLoading(true);
    setCity(city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2f600b3bbbe4077933e23dd95bb270fa&dt=${selectedHoliday}`
    );
    const data = await response.json();
    setWeather(data);

    const checkinDate = new Date(selectedHoliday);
    const checkoutDate = new Date(checkinDate.getTime() + 86400000);
    const checkout = checkoutDate.toISOString().substring(0,10);
    console.log('crawing...',`http://localhost:5000/api/homes?city=${city}&checkin=${selectedHoliday}&checkout=${checkout}`);
    async function fetchRentalData() {
      const response1 = await fetch(
        `http://localhost:5000/api/homes?city=${city}&checkin=${selectedHoliday}&checkout=${checkout}`
      );
      const data1 = await response1.json();
      if (data1.length > 0) {
        setIsLoading(false);
        setRentalData(data1);
        console.log('rentalData:', data1);
      } else {
        console.warn('Received empty rental data, retrying...');
        await fetchRentalData();
      }
    }
    await fetchRentalData();
  };

  const handleHolidayChange = (event) => {
    setSelectedHoliday(event.target.value);
    setWeather("");
  };

  return (
    <>
      <div className="container text-left">
        <CountrySelector
          className="country-selector"
          onSubmit={handleCountrySubmit}
        />
        <br />

        <div className="row justify-content-center">
          <div className="col-4">
            {holidays.length > 0 ? (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {holidays.map((holiday) => (
                  <li key={holiday.date}>
                    <input
                      type="radio"
                      name="holiday"
                      value={holiday.date}
                      checked={selectedHoliday === holiday.date}
                      onChange={handleHolidayChange}
                      disabled={new Date(holiday.date) < new Date()}
                    />
                    {holiday.date}: {holiday.name}
                  </li>
                ))}
              </ul>
            ) : (
              <h5 style={{ textAlign: "center" }}>
                Input a year and select a country
                <br />
                to see the public holidays.
              </h5>
            )}
          </div>

          <div className="col-4">
            <StateCitySelector
              countryCode={countryCode}
              onSubmit={handleCitySubmit}
            />
          </div>
        </div>
        <br />
        <br />
        <div className="row justify-content-center">
          <div className="col-3">
            {selectedHoliday && weather && (
              <div className="card text-center">
                <label>
                  <br />
                  <h5>Weather Infomation Card</h5>
                </label>
                <div className="card-body text-left">
                  Date : {selectedHoliday},<br />
                  Location : {city},<br />
                  Humidity : {weather.main["humidity"]},<br />
                  Weather : {weather.weather[0].main},<br />
                  Fahrenheit : {weather.main["temp_min"]}-
                  {weather.main["temp_max"]},<br />
                  Description : {weather.weather[0].description}
                  <br />
                </div>
              </div>
            )}
          </div>
          <div className="col-8">
            {rentalData.length > 0 &&
              <CityRentalInfo data={rentalData}/>
            }
            {isLoading && (<div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>)}
          </div>
        </div>

        <div className="row" style={{ style: "50px" }}></div>
      </div>
    </>
  );
};

export default App;
