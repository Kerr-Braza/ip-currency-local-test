import React, {useState} from "react"

export default function Hero() {

    const [localPricing, setLocalPricing] = useState(99);
    const [currSymbol, setCurrSymbol] = useState("$");
    const [userCountry, setUserCountry] = useState("Canada");

    async function fetchUserCurrency() {
        const ipApiResponse = await fetch('https://ipapi.co/8.8.8.8/json/');
        const ipApiResult = await ipApiResponse.json();

        setUserCountry(ipApiResult.country_name);

        return ipApiResult.currency;
    }

    async function fetchExRate() {
        const userCurrency = await fetchUserCurrency();

        // const countriesArr = ["AUD", "CAD", "EUR", "GBP", "JPY", "USD"];
        // const currencyCode = countriesArr.includes(userCurrency) ? userCurrency : "CAD";

        //Kerr -> Try to replace above with dict logic
        const currCodeDict = {"AUD": "$", "CAD": "$", "USD": "$", "EUR": "€", "GBP": "£", "JPY": "¥"};
        const currencyCode = (userCurrency in currCodeDict) ? userCurrency : "CAD";
        const currSymbol = currCodeDict[currencyCode];
        

        //Currency conversions in Canadian currency (CAD), hardcoded for now
        const currExApiRes = await fetch("https://v6.exchangerate-api.com/v6/b9b4df2f6bb26280af491bb8/latest/CAD"); 
        const ipExchResult = await currExApiRes.json();

        const priceConversion =  Math.ceil((ipExchResult.conversion_rates[currencyCode] * 99) * 100) / 100;

        setCurrSymbol(currSymbol);
        setLocalPricing(priceConversion);
        
        // return setLocalPricing(priceConversion);
    }

    // fetchExRate();

    return (
        <div className="hero">
            <img src="http://s1.favim.com/orig/150304/anime-art-black-black-and-white-Favim.com-2531731.png"
                 className="animeImage"/>

            <section className="descrip">
                <h1>We have partners all over the world!</h1>
                <span className="tagline">Become a part of the global team of elites that takes pride in a throrough job well done.</span>
                <br />
                <span>Plans starting at {`${currSymbol}${localPricing} for our partners in ${userCountry}.`}</span>
                <button className="demo"><a href="https://vndb.org/v?f=&s=34w" target="_blank" rel="noreferrer">Try it Free</a></button>
            </section>
        </div>
    )
}