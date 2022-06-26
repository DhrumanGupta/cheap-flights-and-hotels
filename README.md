# cheap-flights-and-hotels
A webapp to alert you when the prices of a certain flight or hotel go down

## Inspiration   

We all have traveled many times in our lives, and it's never cheap. Especially with the pandemic, the cost of traveling has skyrocketed, and with hundreds of websites that provide travel plans, it has become exponentially harder. Not only do you have to find the best possible price, but you also have to make sure that you’re not getting scammed. 

Solutions like trivago exist, but the prices for these commodities often fluctuate, and can go as low as 30% from their normal prices. However, this is also a problem in itself, as you have to constantly watch the prices.

Hence, we decided to create a website that will automatically check prices for hotels and flights, and notify you when the prices go down – allowing you to sleep peacefully, knowing that you’re saving money.

## What it does ❓

Our project allows people to enter a link for a service, such as a hotel or a flight, and notifies them when the price goes below their target. The user only has to put in the link, the target price, and enjoy! The website automatically schedules scrapers to continuously check the prices from the websites, and inform the users as soon as the price goes below their target.


## ❓How we built it 💫

The frontend was built using React.js and Next.js for the javascript frameworks, TailwindCSS, and DaisyUI for the UI components. Furthermore, we used Adobe Photoshop for making the art for all images on our website. The backend was made using Typescript, Nodejs, Expressjs for the web server, Postgres and Prisma for the database, and Puppeteer for the web scraper. In order to send SMS messages to the user when the price is down, we used Twilio. Moreover, we used Github and Git to collaborate on different branches and host our code. We also used Github CI/CD to automate building the website and DigitalOcean to host it.

## Challenges we ran into

Our group consisted of people in different time zones, therefore, it was hard to find a common time to meet and work on our project. We managed to work together in the end by planning when we would meet to discuss our progress and further goals. The Postgresql database stopped working due to a system update and we had to re-install and set it up all over again. Figuring out my MakeMyTrip’s HTML structure and link in order to scrape it was also a challenging task because their HTML changed dynamically and their URL parameters were long and complicated.

## Accomplishments that we're proud of 🙌 
We are proud of working together and collaborating even though we were from different time zones and building the hack within a short time frame. We are also proud of solving all problems we face and displaying resilience. Furthermore, we are pleased with how our server, website, and scheduled service all work together in order to accomplish our project’s goal. It was a Eureka moment for us when everything worked together and the frontend connected with the backend and scraped information via the scraper. We are also happy with the performance of our server as we optimized it via pooling. Overall, we are happy with what we managed to achieve this weekend.

## What we learnt ⭐

We learnt about pooling and optimizing performance for scraping multiple URLs at once. Moreover, we learnt how to scrape Single Page Applications that load content dynamically and process the scraped data. This is the first time we used Prisma with Typescript, so we learnt that it generates type definitions which makes it far easier and scalable to query a database. We used DaisyUI for the first time and learnt how it works.


## What's next for Travel Cheap with Tech 🏃 

For now, our website only works if the hotel or flight the user wants to book is on MakeMyTrip. We plan to add support for other websites later (such as Trivago) as well as services such as Homestays, Trains, Buses, Activities, etc. Moreover, we also plan to send an email to the user reminding them of a reduced price, in case they prefer it over a text message. We also plan to use an API in order to get data instead of scraping the page, in order to improve the performance of our server.

