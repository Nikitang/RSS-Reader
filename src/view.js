function viewPostTitle() {
  const postsDom = document.querySelector('.posts');

  const postsCard = document.createElement('div');
  postsCard.classList.add('card', 'border-0');
  postsCard.innerHTML = `
        <div class="card-body">
            <h2 class="card-title h4 main-post">Посты</h2>
        </div>
        <ul class="list-group border-0 rounded-0 posts-list"></ul>
    `;
  postsDom.appendChild(postsCard);
}

function viewPosts(posts) {
  const postsList = document.querySelector('.posts-list');
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    li.innerHTML = `
            <a class="fw-bold" href="${post.link}" data-id="${post.postId}" target="_blank">${post.title}</a>
            <button class="btn btn-outline-primary btn-sm" type="button" data-id="${post.postId}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>
        `;
    postsList.prepend(li);
  });
}

function viewFeedTitle() {
  const feedsDom = document.querySelector('.feeds');
  const feedsCard = document.createElement('div');
  feedsCard.classList.add('card', 'border-0');
  feedsCard.innerHTML = `
        <div class="card-body">
            <h2 class="card-title h4 main-feed">Фиды</h2>
        </div>
        <ul class="list-group border-0 rounded-0 feeds-list"></ul>
    `;
  feedsDom.appendChild(feedsCard);
}

function viewFeeds(feeds) {
  const feedsList = document.querySelector('.feeds-list');
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    li.innerHTML = `
            <h3 class="h6 m-0">${feed.title}</h3>
            <p class="m-0 small text-black-50">${feed.description}</p>
        `;
    feedsList.prepend(li);
  });
}

function viewModal(post) {
  const modal = document.querySelector('#modal');
  modal.querySelector('.modal-title').textContent = post.title;
  modal.querySelector('.modal-body').textContent = post.description;
  const a = modal.querySelector('a');
  a.href = post.link;
}

export {
  viewPosts, 
  viewFeeds, 
  viewFeedTitle, 
  viewModal, 
  viewPostTitle
};
