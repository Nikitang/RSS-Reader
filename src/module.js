import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import axios from 'axios';
import RSSParser from './parse.js';
import { viewPosts, viewFeeds, viewFeedTitle, viewPostTitle, viewModal } from './view.js';
import _ from 'lodash';

const state = {
    actual: '',
    urls: [],
    language: 'ru',
    content: {
        feeds: [],
        posts: [],
    },
    readedPosts: new Set(),
    modal: {
        post: null,
    }
};

const i18nextInstance = i18next.createInstance();
i18nextInstance.init({
    lng: state.language,
    debug: true,
    resources,
});

let expectValues = yup.object().shape({
    actual: yup.string().url().required(),
});

const watchedState = onChange(state, (path, value) => {
    if (path === 'language') {
        i18nextInstance.changeLanguage(value).then(() => render());
    }

    if (path === 'urls') {
        expectValues = yup.object().shape({
            actual: yup.string().url().required().notOneOf(value),
        });
    }
});

const addButton = document.querySelector('.add-btn');
const input = document.querySelector('input');
const div = document.querySelector('.first');
const p = document.querySelector('.feedback');
const clearPost = document.querySelector('.posts');

addButton.addEventListener('click', (e) => {
    e.preventDefault();
    watchedState.actual = input.value;
    expectValues
        .validate(state)
        .then((val) => {
            timeOut(val);
        })
        .catch((error) => {
            div.appendChild(p);
            console.error(error.type);
            p.innerHTML = i18nextInstance.t(`feedback.${error.type}`);
            p.classList.replace('text-success', 'text-danger');
            input.classList.add('is-invalid');
        });
});

function render() {
    const title = document.querySelector('.title');
    const start = document.querySelector('.start');
    const rssLink = document.querySelector('.rss-link');
    const addBtn = document.querySelector('.add-btn');
    const link = document.querySelector('.link');
    const mainPost = document.querySelector('.main-post');
    const mainFeed = document.querySelector('.main-feed');

    title.textContent = i18nextInstance.t('RSS');
    start.textContent = i18nextInstance.t('description');
    rssLink.textContent = i18nextInstance.t('link');
    addBtn.textContent = i18nextInstance.t('addButton');
    link.textContent = i18nextInstance.t('example');
    if (mainFeed && mainPost) {
        mainPost.textContent = i18nextInstance.t('posts');
        mainFeed.textContent = i18nextInstance.t('feeds');
    }
}

function load(data) {
    const posts = data.posts;
    const feeds = data.feed;

    const postsArr = [];
    getNewPosts(posts, watchedState.content.posts).forEach((post) => {
        const addId = {
            ...post,
            postId: _.uniqueId(),
        };
        postsArr.push(addId);
    });
    const f = watchedState.content.feeds.filter((feed) => feed.title === data.feed.title);
    if (f.length === 0) {
        watchedState.content.feeds.push(feeds);
    }
    watchedState.content.posts = [...watchedState.content.posts, ...postsArr];
    return postsArr
}

function getNewPosts(newPost, oldPost) {
    const oldLinks = oldPost.map((post) => post.link);
    const newLinks = newPost.filter((post) => !oldLinks.includes(post.link));
    return newLinks.reverse();
}

function URLgetter(link) {
    const url = new URL('https://allorigins.hexlet.app/get');
    url.searchParams.append('disableCache', 'true');
    url.searchParams.append('url', link);
    return url;
}

function axiosGetter(link) {
    const url = URLgetter(link);
    return axios.get(url.href);
}

const modal = document.querySelector('#modal');
modal.addEventListener('show.bs.modal', (event) => {
    const buttonId = event.relatedTarget.dataset.id
    const post = watchedState.content.posts.find((post) => post.postId === buttonId);
    if (!watchedState.readedPosts.has(buttonId)) watchedState.readedPosts.add(buttonId);
    viewModal(post);
    const txtMuted = document.querySelector(`a[data-id="${buttonId}"]`);
    txtMuted.classList.remove('fw-bold');
    txtMuted.classList.add('fw-normal', 'link-secondary');
    watchedState.modal.post = post;
    watchedState.modal.state = 'show';
})

modal.addEventListener('hide.bs.modal', () => {
    watchedState.modal.post = null;
    watchedState.modal.state = 'hidden';
})

function timeOut(value) {
    axiosGetter(watchedState.actual)
    .then((response) => {
        input.value = '';
        input.classList.remove('is-invalid');
        p.innerHTML = i18nextInstance.t('feedback.successRSS');
        p.classList.replace('text-danger', 'text-success');
        console.log(value.urls);

        const data = RSSParser(response.data.contents);
        if (clearPost.textContent === '') {
            viewFeedTitle();
            viewPostTitle();
        }
        
        console.log(data);
        const f = watchedState.content.feeds.filter((feed) => feed.title === data.feed.title);
        console.log(f);
        if (f.length === 0) {
            viewFeeds([data.feed])
        }
        viewPosts(load(data));
        if (!watchedState.urls.includes(watchedState.actual)) {
            watchedState.urls.push(watchedState.actual);
        }
        setTimeout(() => timeOut(value), 5000)
    })
    .catch((error) => {
        console.error(error);
        p.innerHTML = i18nextInstance.t('feedback.invalidRss');
        p.classList.replace('text-success', 'text-danger');
        input.classList.add('is-invalid');
    });
}