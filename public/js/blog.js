const createCommentHandler = async (event) => {
    event.preventDefault();
    console.log("try to submit comment");
    // const id = parseInt(event.target.getAttribute("data-id"));
  
    const content = document.querySelector('#comment-content').value.trim();
    const url = document.location.toString().split("blog").join("api/blogs");
    // console.log(id);
    // console.log(content);
    if (content) {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ content }),
            headers: {
            'Content-Type': 'application/json',
            },
        });
    
        if (response.ok) {
            console.log("comment posted");
            document.location.reload();
        } else {
            alert('Failed to create project');
        }
    }
};


document
  .querySelector('.new-comment-form')
  .addEventListener('submit', createCommentHandler);
  