const updatePostHandler = async (event) => {
    event.preventDefault();

    const id = parseInt(event.target.getAttribute("data-id"));
    const title = document.querySelector('#updated-blog-title').value.trim();
    const content = document.querySelector('#updated-blog-content').value.trim();

    if (id && title && content) {
        const response = await fetch(`/api/blogs/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, content }),
            headers: {
            'Content-Type': 'application/json',
            },
        });
    
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
    if (id) {
        const response = await fetch(`/api/blogs/${id}`, {
            method: 'DELETE',
            // body: JSON.stringify({ title, content }),
            // headers: {
            // 'Content-Type': 'application/json',
            // },
        });
    
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