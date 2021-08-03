const updatePostHandler = async (event) => {
    event.preventDefault();

    const id = parseInt(event.target.getAttribute("data-id"));
    const title = document.querySelector('#updated-blog-title').value.trim();
    const content = document.querySelector('#updated-blog-content').value.trim();

    // update blog with blog_id === id
    if (id && title && content) {
        const response = await fetch(`/api/blogs/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, content }),
            headers: {
            'Content-Type': 'application/json',
            },
        });
    
        // redirect to dashboard page after updating an blog successfully
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to create project');
        }
    }
};

const deletePostHandler = async (event) => {
    event.preventDefault();

    const id = parseInt(event.target.getAttribute("data-id"));
    // delete the blog with blog_id === id if any
    if (id) {
        const response = await fetch(`/api/blogs/${id}`, {
            method: 'DELETE',
        });
    
        // redirect to dashboard page after delete an blog successfully
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to create project');
        }
    }
};

document
  .querySelector('#update-blog-button')
  .addEventListener('click', updatePostHandler);

document
  .querySelector('#delete-blog-button')
  .addEventListener('click', deletePostHandler);