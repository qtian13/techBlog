const newPostHandler = async (event) => {
    event.preventDefault();
    document.location.replace('/dashboard/newpost');
};

document
  .querySelector('#new-post')
  .addEventListener('click', newPostHandler);
