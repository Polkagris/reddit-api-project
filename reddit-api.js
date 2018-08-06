  export default {
    search: function(searchTerm, searchLimit, sortBy){
      console.log('It works..!');
      // Fetch the reddit-api by searchTerm, limit and sort
      return fetch(`http://www.reddit.com/search.json?q=${searchTerm}&limit=${searchLimit}&sort=${sortBy}`)
      // Graps the results as json
      .then(res => res.json())
      // Grabs the data and maps out only the data in the array
      .then(data => data.data.children.map(data => data.data))
      .catch(err => console.log(err));
      console.log(data.data.children);
    }
  };
