import React, { useCallback, useEffect, useMemo } from "react";
import { CountryData } from "../utils/db"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const WeatherApp = () => {
    const [data, setdata] = useState(CountryData);
    const [table, setTable] = useState(true);
    const [region, setRegion] = useState([])
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    console.log(CountryData[0])
    const handleGridAndtable = () => {
        setTable(!table)
    }

    const handleSort = (val) => {
        console.log(val)
        let sortedData = [...data];
        if (val == "A-Z") {
            sortedData.sort((a, b) => ((a.name).localeCompare(b.name)))
        } else {
            sortedData.sort((a, b) => ((b.name).localeCompare(a.name)))
        }
        setdata(sortedData)
    }

    const handleFiler = (reg) => {
        let filterData = [...CountryData]
        setdata(filterData.filter(item => item.region == reg))
    }

    useEffect(() => {
        const resgionsSet = data.map((items) => items.region);
        const uniqueRegoins = [...new Set(resgionsSet)].filter(Boolean)
        setRegion(uniqueRegoins)
    }, [])

    function debouce(func, delay) {
        let timer;
        return function (...argu) {
            clearTimeout(timer)
            timer = setTimeout(() => func(...argu), delay);
        }
    }

    const handleSearchInput = (query) => {
        setdata(CountryData)
        let searchInput = query.toLowerCase();

        const filterData = [...data].filter(items => items.name.toLowerCase().includes(searchInput) || items.capital.toLowerCase().includes(searchInput) || items.region.toLowerCase().includes(searchInput))
        setdata(filterData)
    }
    const deb = useCallback(debouce((query) => {
        handleSearchInput(query)
    }, 1000), [])

    const totalPage = Math.ceil(data.length / 10);
    const paginatedData = data.slice((currentPage - 1) * 10, currentPage * 10)

    const Pagination = useMemo(() => {
        const pages = []
        console.log(totalPage)
        if (totalPage <= 1) {
            return Array.from({ length: totalPage }, (_, index) => index + 1)
        }
        if (currentPage <= 5) {
            pages.push(1, 2, 3, "...", totalPage);

        } else if (currentPage >= totalPage - 2) {
            pages.push(1, "...", totalPage - 2, totalPage - 1, totalPage)
        } else {
            pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPage)
        }
        return pages;

    }, [currentPage, totalPage])

    return (
        <div className="flex flex-col justify-center items-center bg-gray-800 py-10">
            <div className="flex justify-between items-center w-[60%]">
                <div className="">
                    <input className="py-2 px-3 w-full bg-gray-300 rounded-md" type="text" placeholder="search..." onChange={(e) => { setSearch(e.target.value); deb(e.target.value) }} />
                </div>
                <div>
                    <select className="bg-gray-300 rounded-md text-16 font-bold px-4 py-2 m-2" onChange={(e) => handleFiler(e.target.value)} >
                        <option value="">--filter--</option>
                        {
                            region.map((items, index) => (
                                <option key={index} value={items}>{items}</option>
                            ))
                        }
                    </select>

                    <select className="bg-gray-300 rounded-md text-16 font-bold px-4 py-2 m-2" value="" onChange={(e) => {
                        handleSort(e.target.value)
                    }}>
                        <option value="">--select--</option>
                        <option value="A-Z">A-Z</option>
                        <option value="Z-A">Z-A</option>
                    </select>

                    <button className="cursor-pointer bg-gray-300 rounded-md text-16 font-bold px-4 py-2 m-2" onClick={handleGridAndtable}> {table ? "swtich to grid " : "swtich to table"}</button>
                </div>
            </div>

            {table ?
                <table className="w-3/5 mx-auto border border-gray-300  rounded-lg overflow-hidden">
                    <thead className="bg-gray-200  text-gray-900 text-lg font-semibold">
                        <tr>
                            <th className="px-4 py-2 border border-gray-700">Name</th>
                            <th className="px-4 py-2 border border-gray-700">Capital</th>
                            <th className="px-4 py-2 border border-gray-700">Region</th>
                            <th className="px-4 py-2 border border-gray-700">Alpha-2 Code</th>
                            <th className="px-4 py-2 border border-gray-700">Alpha-3 Code</th>
                        </tr>
                    </thead>
                    <tbody className="] bg-gray-900 text-gray-100">
                        {
                            paginatedData.map((items, index) => (
                                <tr key={index} className="hover:bg-gray-600 cursor-pointer" onClick={() => navigate("/country", { state: { country: items } })}>
                                    <td className="px-4 py-2 border-b border-gray-700 w-3/5">{items.name}</td>
                                    <td className="px-4 py-2 border-b border-gray-700">{items.capital}</td>
                                    <td className="px-4 py-2 border-b border-gray-700">{items.region}</td>
                                    <td className="px-4 py-2 border-b border-gray-700">{items.alpha2Code}</td>
                                    <td className="px-4 py-2 border-b border-gray-700">{items.alpha3Code}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                : <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
                    {
                        paginatedData.map((items, index) => (
                            <div key={index} className="bg-gray-300 shadow-md m-2 p-3 cursor-pointer rounded-md" onClick={() => navigate(`/country/?country=${items.capital}`)}>
                                <h2 className="font-bold">{items.name}</h2>
                                <h2 className="text-16 "> Capital: {items.capital}</h2>
                                <h2 className="text-16 "> Regoin :{items.region}</h2>
                                <h2 className="text-16 ">Alpha-2 Code:{items.alpha2Code}</h2>
                                <h2 className="text-16 ">Alpha3 Code: {items.alpha3Code}</h2>
                            </div>
                        ))
                    }
                </div>
            }
            <div className="flex justify-end items-center text-gray-800">
                <div className="flex-end">
                    <button className="cursor-pointer bg-white px-3 py-2 text-20 font-bold m-2" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage == 1}> {"<"} </button>
                    {
                        Pagination.map((num, i) => (
                            <button className="cursor-pointer bg-white px-3 py-2 text-20 font-bold m-2" key={i} onClick={() => typeof num == "number" && setCurrentPage(num)} disabled={num === "..."}>
                                {num}
                            </button>
                        ))
                    }
                    <button className="cursor-pointer  bg-white px-3 py-2 text-20 font-bold m-2" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPage}> {">"} </button>

                </div>
            </div>
        </div>
    )
}

export default WeatherApp;