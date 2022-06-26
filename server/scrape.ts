import puppeteer from 'puppeteer'
import {Cluster} from "puppeteer-cluster"


interface Flight {
    itinerary: string
    ccde: string
}

interface Hotel {
    checkin: string
    checkout: string
    city: string
}

export function parseURLs(urlStrings: string[]){
    const obj: {flights: Array<Flight>, hotels: Array<Hotel>} = {flights: [], hotels: []}
    const urls: Array<URL> =  urlStrings.map(url=>new URL(url))
    urls.forEach(url=>{
        url.pathname = url.pathname.replace(/\/+$/, '');
        if (url.pathname === "/hotels/hotel-listing"){
            obj.hotels.push({
                checkin: url.searchParams.get("checkin")||"",
                checkout: url.searchParams.get("checkout")||"",
                city: url.searchParams.get("city")||""
            })
        }
        if (url.pathname === "/flight/search"){
            obj.flights.push({
                itinerary: url.searchParams.get("itinerary")||"",
                ccde: url.searchParams.get("ccde")||"IN"
            })
        }
    })
    obj.flights = obj.flights.filter((value, index, self)=>
        index === self.findIndex(t=> t.ccde === value.ccde && t.itinerary === value.itinerary)
    )
    obj.hotels = obj.hotels.filter((value, index, self)=>
        index === self.findIndex(t=> t.city === value.city && t.checkin === value.checkin && t.checkout === value.checkout)
    )
    return obj
}

export async function getLowestPricesForMultipleFlights(
    flights: Flight[],
    n = 2
) {
    const prices: Array<number | null> = []
    /*
    urls = urls.filter((value, index, self) =>
        index === self.findIndex((t) => (t.hostname === value.hostname && areSearchParamsSame(t.searchParams, value.searchParams) && t.pathname === value.pathname))
    )
    */
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: n,
    })
    await cluster.task(async ({ page, data }) => {
        const result = await scrapeFlight(page, data.flight)
        prices[data.index] = result
    })
    flights.forEach((flight, index) => cluster.queue({ flight, index }))
    await cluster.idle()
    await cluster.close()
    return prices
}

export async function getLowestPriceForFlight(flight: Flight) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const lowest = await scrapeFlight(page, flight)
    await browser.close()
    return lowest
}

// @ts-ignore
export async function scrapeFlight(page, flight) {
    //https://jsoverson.medium.com/how-to-bypass-access-denied-pages-with-headless-chrome-87ddd5f3413c
    try {
        await page.setUserAgent(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36'
        )
        await page.goto(
            `https://www.makemytrip.com/flight/search?itinerary=${
                flight.itinerary
            }&tripType=O&paxType=A-1_C-0_I-0&intl=false&cabinClass=E&ccde=${
                flight.ccde || 'IN'
            }&lang=eng`,
            { waitUntil: 'networkidle0' }
        )

        const result = await page.evaluate(() => {
            const x =
                document.getElementsByClassName('priceSection')[0].childNodes[0]
                    .childNodes[0]
            // @ts-ignore
            return x.innerText
        })
        return parseFloat(result.replace(/[^0-9\.]+/g, ''))
    } catch (e) {
        return null
    }
}

// Hotel not implemented yet
// export async function getLowestPricesForMultipleHotels(hotels, n = 2) {}
// export async function getLowestPriceForHotel(hotel) {}
// export async function scrapeHotel(page, hotel) {}

//console.log(await getLowestPricesForMultipleFlights([{itinerary: "USH-BAH-20/10/2022"}, {itinerary: "DEL-KTM-28/07/2022_KTM-DEL-29/07/2022", ccde: "US"}, {itinerary: ""}, {itinerary: ""}, {itinerary: ""}]))
console.log(parseURLs(["https://www.makemytrip.com/flight/search?itinerary=DEL-KTM-01/08/2022&tripType=O&paxType=A-1_C-0_I-0&intl=true&cabinClass=E&ccde=IN&lang=eng", "https://www.makemytrip.com/hotels/hotel-listing/?checkin=06272022&city=CTGOI&checkout=06282022&roomStayQualifier=2e0e&locusId=CTGOI&country=IN&locusType=city&searchText=Goa&visitorId=c36eceb2-f5b1-4a4a-a07c-3deeb30e67df&regionNearByExp=3", "https://www.makemytrip.com/flight/search?itinerary=DEL-KTM-01/08/2022&tripType=O&paxType=A-1_C-0_I-0&intl=true&cabinClass=E&ccde=IN&lang=eng"]))
