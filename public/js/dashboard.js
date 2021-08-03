const newPostHandler = async (event) => {
    event.preventDefault();
    // redirect to newpost page when user click new-post button
    document.location.replace('/dashboard/newpost');
};

document
  .querySelector('#new-post')
  .addEventListener('click', newPostHandler);
