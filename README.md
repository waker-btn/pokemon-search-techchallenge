# Pokemon Search - Tech Challenge

This web app fetches data from [PokeAPI](https://pokeapi.co/), and allows the user to filter the data with a Search input.

Data fetched is shown using dynamically created 'cards'. A limit has been put on the number of Pokemon that load (151) but could easily pull the full list of 1302 Pokemon from the API. This limit was added to avoid performing too many fetch requests at once.

Time spent on this challenge likely reaches closer to 8-10 hours, which included time to understand how the API returns its data, and dealing with a few issues in asynchronous workflow.