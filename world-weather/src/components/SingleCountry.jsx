import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const SingleCountry = () => {
    const [data, setData] = useState({})
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const countryy = location.state.country.name
    console.log(countryy)

    const WEATHER_API_KEY = '22e2e1afc162af39ffd26c89a8df26b1';
    const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";


    const fetehWeather = async () => {
        try {
            const url = `${WEATHER_API_URL}?q=${countryy}&appid=${WEATHER_API_KEY}&units=metric`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("something went wrong");
            const result = await res.json();
            console.log(result)
            setData(result);
        } catch (error) {
            setError("fail to fetch weather")
            if (error instanceof Error) {
                setError("fail to fetch weather", error.message)
            }
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetehWeather();
    }, [])


    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen bg-gray-800">
                <h1 className="font-medium text-[34px] text-gray-300 py-10" >🌤️ Weather App</h1>
                <div className="w-[50%] lg:w-[30%] mx-auto shadow-md rounded-2xl p-6 text-center space-y-4 bg-blue-300">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {data?.name}, {data?.sys?.country}
                    </h2>
                    <p className="text-gray-600 capitalize">{data?.weather?.[0]?.description}</p>

                    {data?.weather?.[0]?.icon && (
                        <img
                            className="mx-auto w-20 h-20"
                            src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                            alt="Weather Icon"
                        />
                    )}

                    <div className="space-y-2 text-gray-700">
                        <p>🌡️ <span className="font-medium">{data?.main?.temp}°C</span></p>
                        <p>💨 <span className="font-medium">{data?.wind?.speed} m/s</span></p>
                        <p>💧 <span className="font-medium">{data?.main?.humidity}%</span></p>
                    </div>
                </div>

            </div>
        </>
    )

}
export default SingleCountry;