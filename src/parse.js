function feedGetter(tree) {
    const title = tree.querySelector('channel>title').textContent;
    const description = tree.querySelector('channel>description').textContent;
    return { title, description };
}

function postGetter(tree) {
    const items = tree.querySelectorAll('item');
    return Array.from(items).map((item) => ({
        title: item.querySelector('title').textContent,
        link: item.querySelector('link').textContent,
        description: item.querySelector('description').textContent,
    }));
}

function RSSParser(data) {
    const parser = new DOMParser();
    const tree = parser.parseFromString(data, 'text/xml');
    if (tree.querySelector('parseError')) throw new Error('Invalid RSS');
    return { 
        feed: feedGetter(tree),
        posts: postGetter(tree),
    };
}

export default RSSParser;