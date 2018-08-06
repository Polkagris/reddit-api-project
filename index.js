  // Declare reddit
  import reddit from './reddit-api';

  const searchForm = document.getElementById('search-form');
  // Grab input text
  const searchInput = document.getElementById('search-input');

  // Add event listener to search input
  searchForm.addEventListener('submit', e => {
    // Grab search-term
    const searchTerm = searchInput.value;
    // Grab sort-by: new and relevance depending on checked
    const sortBy = document.querySelector('input[name="sortby"]:checked').value;
    // Get limit
    const searchLimit = document.querySelector('#limit').value;

    // Check if input is empty
    if(searchInput.value == ''){
      // Run function that shows a message with two parameters: message and className
      showMessage('Please fill in the search-field', 'alert-danger');
    }

    // Clear seach field
    searchInput.value = '';

    // Search reddit
    reddit.search(searchTerm, searchLimit, sortBy).then
    // Grab the data in results
    (results => {
      console.log(results);
      // Variable to store the results from the search
      let output = '<div class="card-columns">';

      // Loop through each object and append content
      results.forEach((post) => {
        // Check if there is an image, if not set it to generic reddit icon-image
        let image = post.preview ? post.preview.images[0].source.url : 'https://cdn.vox-cdn.com/thumbor/FXJtC7HR05_Eweus_7SQVdTleOk=/0x0:640x427/1200x800/filters:focal(269x163:371x265)/cdn.vox-cdn.com/uploads/chorus_image/image/59028817/reddit_logo_640.0.jpg';
        // If image is not there use reddit image
        // Output HTML content
        output += `<div class="card">
                <img class="card-img-top" src=${image} alt="Card image cap">
                <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${short(post.selftext, 100)}</p>
                <a href=${post.url} target="_blank" class="btn btn-primary">Read more</a>
                <hr><span class="badge badge-secondary">Subreddit: ${post.subreddit}</span>
                <span class="badge badge-dark">Score: ${post.score}</span>
              </div>
          </div>`
      });

      // Append closing div tag to output
      output += '</div>';
      // Set results-div to res and set its innerHTML to output
      let res = document.getElementById('results');
      res.innerHTML = output;
    });
    // Prevent from submitting
    e.preventDefault();
  });

  // Show alert message function
  function showMessage(message, className){
    // If alert already exists return nothing
    if(document.querySelector('.alert') !== null) {
      return;
    }
    // Create div that holds the alert message
    let dangerDiv = document.createElement('div');
    // Create the content that is to be displayed
    // dangerDiv.classList.add(`alert ${className}`);
    //dangerDiv.className(`alert ${className}`);
    dangerDiv.className = `alert ${className}`;
    dangerDiv.appendChild(document.createTextNode(message));
    // Grab parent element to dangerDiv
    const parentElementBefore = document.getElementById('search-container');
    const searchElement = document.getElementById('search');
    //  Insert new div into parent element bedre searchElement
    parentElementBefore.insertBefore(dangerDiv, searchElement);
    // Timeout function - display alert for 1 seconds then remove element
    setTimeout(function() {
      document.querySelector('.alert').remove();
    }, 2000);
  }

  // Truncate selftext over 100 characters - function
  function short(text, limit){
    const shortened = text.indexOf(" ", limit);
    if(shortened == -1) return text;
    return text.substring(0, shortened);
  };
