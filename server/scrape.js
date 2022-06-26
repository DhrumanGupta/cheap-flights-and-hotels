import {Cluster} from "puppeteer-cluster"
import puppeteer from "puppeteer"

//flight object DS: 
//itinerary (string). contains the flight departure, destination, and date. just put the itinerary param from the url the user passed here.
//ccde (string). contains the country code to scrape the prices using a specific currency. note that after performing another search after one this param disapears. advice the user to open a new tab and search for the hotel before copying the url. just put the ccde param from the url the user passed here. 

export async function getLowestPricesForMultipleFlights(flights, n=2){
    const prices = [] 
    /*
    urls = urls.filter((value, index, self) =>
        index === self.findIndex((t) => (t.hostname === value.hostname && areSearchParamsSame(t.searchParams, value.searchParams) && t.pathname === value.pathname))
    )
    */
    const cluster = await Cluster.launch({concurrency: Cluster.CONCURRENCY_PAGE, maxConcurrency: n})
    await cluster.task(async ({page, data})=>{
        const result = await scrapeFlight(page, data.flight)
        prices[data.index] = result
    })
    flights.forEach((flight, index)=>cluster.queue({flight, index}))
    await cluster.idle()
    await cluster.close()
    return prices
}

export async function getLowestPriceForFlight(flight){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const lowest = await scrapeFlight(page, flight)
    await browser.close()
    return lowest
}

export async function scrapeFlight(page, flight){
    //https://jsoverson.medium.com/how-to-bypass-access-denied-pages-with-headless-chrome-87ddd5f3413c
    try{
        await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
        await page.goto(`https://www.makemytrip.com/flight/search?itinerary=${flight.itinerary}&tripType=O&paxType=A-1_C-0_I-0&intl=false&cabinClass=E&ccde=${flight.ccde||"IN"}&lang=eng`, {waitUntil: "networkidle0"})
        const result = await page.evaluate(()=>{return document.getElementsByClassName("priceSection")[0].childNodes[0].childNodes[0].innerText})
        return parseFloat(result.replace(/[^0-9\.]+/g,""))
    }
    catch(e){return null}
}

// Hotel not implemented yet
// hotel object DS:
// checkin (string). contains the checkin date in mmddyyyy. just put the checkin param from the url the user passed here.
// checkout (string). contains the checkout date in mmddyyyy. just put the checkout param from the url the user passed here.
// city (string). contains the city code in all caps. just put the city param from the url the user passed here.
export async function getLowestPricesForMultipleHotels(hotels, n=2){}
export async function getLowestPriceForHotel(hotel){}
export async function scrapeHotel(page, hotel){}

//console.log(await getLowestPricesForMultipleFlights([{itinerary: "USH-BAH-20/10/2022"}, {itinerary: "DEL-KTM-28/07/2022_KTM-DEL-29/07/2022", ccde: "US"}, {itinerary: ""}, {itinerary: ""}, {itinerary: ""}]))
