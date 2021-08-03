const createCommentHandler = async (event) => {
    event.preventDefault();
  
    // get content of comment
    const content = document.querySelector('#comment-content').value.trim();
    // create req url based on current location
    const url = document.location.toString().split("blog").join("api/blogs");

    // if content is not empty, create a new comment and add it to database
    if (content) {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ content }),
            headers: {
            'Content-Type': 'application/json',
            },
        });
    
        // reload the page when after post successfully
        if (response.ok) {
            document.location.reload();
        } else {
            alert('Failed to create project');
        }
    }
};

document
  .querySelector('.new-comment-form')
  .addEventListener('submit', createCommentHandler);
  