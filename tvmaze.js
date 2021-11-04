// const rootURL = 'https://api.tvmaze.com'


/*this function takes user provided query, uses API "single search" for shows and returns an array containing an object
 with the key-value pairs of id, name, summary and image. The return will be used in populateShows()*/
async function searchShows(query) {
  const res = await axios.get('https://api.tvmaze.com/singlesearch/shows', { params: { q: query } })
  const shows = [{
    id: res.data.id,
    name: res.data.name,
    summary: res.data.summary,
    image: res.data.image.medium
  }]

  return shows
}

/*This function intakes the return from searchShows and creates the DOM elements to view the results*/
function populateShows(shows) {
  // select the container where the new card will go
  const $showsList = $("#shows-list");
  //Empty out the container of the previous (if any) content
  $showsList.empty();
  /*for every element of the array shows (there is only one element, which is an object), create a new
  DOM nested element. The ids, image, name and summary of the show are dynamically added using string template literals
  unpacked from the shows object*/
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
            <img class="card-img-top" src=${show.image} alt ="https://tinyurl.com/tv-missing">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
           <button id="show-episodes"> Show episodes </button>
         </div>
        </div>`);

    //for every one of these DOM elements created, we add an event listener for the get episodes button
    $item.on('click', async function handleEpisodeClick(e) {
      e.preventDefault()
      //make the section containing the ul visible (default the  display is set to none, i.e. invisible)
      $("#episodes-area").attr('style', "")
      //The show id was dynamically added to a few elements. Here we retrieve that id as a string
      const $showId = $('.card').attr('data-show-id')
      //get the array of episodes associated to the show id, save it to a variable. Wait until we have it back to continue
      const arrOfEpisodes = await getEpisodes($showId)
      //use the new arrayOfEpisodes, which is an array of objects, as the argument for populateEpisodes()
      populateEpisodes(arrOfEpisodes)

    })
    $showsList.append($item);
  }
}


$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);

  $("#search-query").val("")
});



//returns arr of episodes objects of show with id
async function getEpisodes(id) {
  const episodes = []
  //will get all of the episodes associated to the show id.
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)

  /*for every episode object from the res.data (data received from API), create a new object which will be 
  pushed to the episodes array. */
  for (let episode of res.data) {
    episodes.push({
      season: episode.season,
      number: episode.number,
      name: episode.name,
    })
  }

  return episodes
}


function populateEpisodes(ArrOfEpisodes) {
  const $episodeList = $('ul')

  /*for every episode of the arrayOfEpisodes object,create a new li with the pertanant information */
  for (let episode of ArrOfEpisodes) {
    let newLi = $(`<li>Season ${episode.season}, episode ${episode.number} : ${episode.name} </li>`)
    $episodeList.append(newLi)
    console.log('test')
  }
}