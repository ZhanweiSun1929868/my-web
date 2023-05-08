import { useState, useEffect } from "react";
import axios from "axios";
import Dropdown from "./Dropdown";

interface Props {
  countryCode : string;
  onSubmit : (city:string) => void;
}

const StateCitySelector = ({ countryCode, onSubmit }: Props) => {
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const fetchStates = async () => {
      const config = {
        method: "get",
        url: `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
        headers: {
          "X-CSCAPI-KEY":
            "dzh3Q0RqSTRGNTBMODRMbXJlRlNhNUhncWFWNmcyNHlXU0NqdjlxeQ==",
        },
      };
      const response = await axios(config);
      const new_data = response.data.map(({ iso2, ...rest }) => ({ key: iso2, ...rest }));
      setStateList(new_data);
    };
    fetchStates();
  }, [countryCode]);

  const handleStateChange = async (event) => {
    setSelectedState(event.target.value);
    const response = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${event.target.value}/cities`,
      {
        headers: {
          "X-CSCAPI-KEY":"dzh3Q0RqSTRGNTBMODRMbXJlRlNhNUhncWFWNmcyNHlXU0NqdjlxeQ==",
        },
      }
    );
    setCityList(response.data);
  };

  const handleCityChange = async (event) => {
    setSelectedCity(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(selectedCity);
  }

  return (
    <>
    <form onSubmit={handleSubmit}>
      <Dropdown
        data={stateList}
        title="State"
        value={selectedState}
        onChange={handleStateChange}
      />
      <br />
      <br />

      {cityList.length > 0 && <Dropdown
        data={cityList}
        title="City"
        value={selectedCity}
        onChange={handleCityChange}
      />}

      <br />
      <br />

      {selectedCity && <button type="submit" className="btn btn-info">Submit</button>}
    </form>
    </>
  );
};

export default StateCitySelector;
