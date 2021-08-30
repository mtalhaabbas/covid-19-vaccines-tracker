import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Table from "./Table";
import { sortData } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [date, setdate] = useState("");
  const [total, settotal] = useState("");
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
  
      fetch('https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=1').then((response) => response.json()).then((data) => {
        setdate(Object.keys(data)[0])
        settotal(Object.values(data)[0])
     });

  }, []);


  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        
        });
    };

    getCountriesData();
    
  }, []);

  console.log(casesType);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=1"
        : `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${countryCode}?lastdays=1`;
         await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        if(countryCode==="worldwide"){
         setdate(Object.keys(data)[0])
         settotal(Object.values(data)[0])
        }
        else{
          setdate(Object.keys(data.timeline)[0])
         settotal(Object.values(data.timeline)[0])
        }        
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Vaccines</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
         
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Total Vaccination"
            active={casesType === "deaths"}
            date={date}
            total={numeral(total).format("0.0a")}
          />
        </div>

        
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
          
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
