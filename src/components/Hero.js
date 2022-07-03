import React, {useState} from "react"

export default function Hero() {

    const [localPricing, setLocalPricing] = useState(99);
    const [currSymbol, setCurrSymbol] = useState("$");
    const [userCountry, setUserCountry] = useState("Canada");

    async function fetchUserCurrency() {
        //Can wrap in own try catch with manual check for other errors (non-400)
        //8.8.8.8 below should be replaced with user IP...
        // npm install express-ip -> This can allow the server to grab ip address for ip lookup

        const grabUserIp = fetch("https://api.ipify.org?format=json/"); //api.ipfy.org external api I grab
        

        const ipApiResponse = await fetch('https://ipapi.co/8.8.8.8/json/'); 
        const ipApiResult = await ipApiResponse.json();

        if(ipApiResult.country_name != null){
            setUserCountry(ipApiResult.country_name);
            return ipApiResult.currency;
        } else {
            console.log("Unexpected return from ip api");
            return 400;
        }
    }

    async function fetchExRate() {
        const userCurrency = await fetchUserCurrency();
        const currCodeDict = {"AUD": "$", "CAD": "$", "USD": "$", "EUR": "€", "GBP": "£", "JPY": "¥"};
        const currencyCode = (userCurrency in currCodeDict) ? userCurrency : "CAD";
        const currSymbol = currCodeDict[currencyCode];

        if(typeof(currSymbol) !== "string"){
            console.log("Unexpected currency for user");
        }

        //Currency conversions in Canadian currency (CAD), hardcoded for now

        const currExApiRes = await fetch("https://v6.exchangerate-api.com/v6/b9b4df2f6bb26280af491bb8/latest/CAD"); 
        const ipExchResult = await currExApiRes.json();

        if(ipExchResult.conversion_rates != null) {
            const priceConversion =  Math.ceil((ipExchResult.conversion_rates[currencyCode] * 99) * 100) / 100;

            setCurrSymbol(currSymbol);
            setLocalPricing(priceConversion);
            return setLocalPricing(priceConversion);

        } else {
            console.log("Could not grab the exchange rate information");
            return 400;
        }
    }

    // fetchExRate();

    return (
        <div className="hero">
            <img src="http://s1.favim.com/orig/150304/anime-art-black-black-and-white-Favim.com-2531731.png"
                 className="animeImage"
                 alt="Mock logo"/>

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