import React, { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      const countries = await axios.get("https://restcountries.com/v3.1/all");
      const foundCountry = countries.data.find(
        (country) => country.name.common.toLowerCase() === name.toLowerCase()
      );

      if (foundCountry) {
        const finalCountry = {
          data: {
            name: foundCountry.name.common,
            capital: foundCountry.capital[0],
            population: foundCountry.population,
            flag: foundCountry.flags.png,
          },
          found: true,
        };
        setCountry(finalCountry);
      } else {
        setCountry({
          data: null,
          found: false,
        });
      }
    };

    fetchCountries();
  }, [name]);

  return country;
};

const Country = ({ country }) => {
  console.log("-----loading country------", country);
  if (!country) {
    return null;
  }

  if (!country.found) {
    return <div>not found...</div>;
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div>
      <img
        src={country.data.flag}
        height="100"
        alt={`flag of ${country.data.name}`}
      />
    </div>
  );
};

const App = () => {
  const nameInput = useField("text");
  const [name, setName] = useState("");
  const country = useCountry(name);

  const fetch = async (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;
