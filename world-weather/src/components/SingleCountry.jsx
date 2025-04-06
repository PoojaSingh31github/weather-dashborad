import React, { useEffect, useState } from "react";
import { CountryData } from "../utils/db";
import { useLocation } from "react-router-dom";
const SingleCountry = () => {
    const location = useLocation();
    console.log(location)
    const countryy = location.search.split("=")
    const query = countryy[1].split("%20").join(" ");

    const [filterData, setFilterData] = useState({})

    const handleFilter = (query) => {
        let data = [...CountryData];
        const filter = data.filter((items) => items.name == query)
        console.log(filter)
        setFilterData(filter)
    }

    useEffect(() => {
        handleFilter(query)
    }, [query])


    return (
        <>
            {
                filterData.length > 0 ? <div className="bg-gray-300 shadow-md m-2 p-3 cursor-pointer rounded-md">
                    <h2 className="font-bold">{filterData[0].name}</h2>
                    <h2 className="text-16 "> Capital: {filterData[0].capital}</h2>
                    <h2 className="text-16 "> Regoin :{filterData[0].region}</h2>
                    <h2 className="text-16 ">Alpha-2 Code:{filterData[0].alpha2Code}</h2>
                    <h2 className="text-16 ">Alpha3 Code: {filterData[0].alpha3Code}</h2>
                </div> : <h1>No Weather for {query} country</h1>

            }

        </>
    )

}
export default SingleCountry;