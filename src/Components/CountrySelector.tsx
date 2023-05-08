import * as React from "react";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";

interface Props {
  className?: string;
  onSubmit: (year: number, selectedCountryCode: string) => void;
}

const CountrySelector = ({ onSubmit }: Props) => {
  const [year, setYear] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch(
        "https://date.nager.at/api/v3/AvailableCountries"
      );
      const data = await response.json();
      const new_data = data.map(({ countryCode, ...rest }) => ({
        key: countryCode,
        ...rest,
      }));
      setCountryList(new_data);
    };
    fetchCountries();
  }, []);

  const handleCountryChange = (event) => {
    setSelectedCountryCode(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(year, selectedCountryCode);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="row justify-content-center">
        <div className="col-3">
          <label for="InputYear" class="form-label">
            Year:
          </label>
          <input
            type="number"
            className="form-control"
            id="InputYear"
            value={year}
            onChange={handleYearChange}
            placeholder="Please input a year"
          />
        </div>
        <div className="col-3">
          <Dropdown
            data={countryList}
            title="Country"
            value={selectedCountryCode}
            onChange={handleCountryChange}
          ></Dropdown>
        </div>
        <div className="col-2">
          <label for="submit-btn" class="form-label">
            &nbsp;
          </label>
          <br />
          <button type="submit" id="submit-btn" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
      <br />
    </>
  );
};

export default CountrySelector;
