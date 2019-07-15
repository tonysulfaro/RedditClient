import {reddit} from './reddit';
//import './styles/styles.scss';
console.log(getPosts('subreddit_name'));

var POSTS = {}

// get posts
function getPosts() {
    let url = "https://www.reddit.com/r/askreddit/hot.json?sort=top"

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson);

            // element where posts are going to go
            let featured_container = document.getElementById("posts");
            console.log(featured_container);

            // slice out posts
            var posts = myJson['data']['children'];

            // generate cards for each post
            posts.forEach(function (post) {
                post = post['data'];

                // add post to global variable, yes not ideal but works
                POSTS[post['id']] = post;
                POSTS[post['id']]['comments'] = []

                if (post['thumbnail'] == "") {
                    var img_url = 'images/linkpng.png';
                } else {
                    img_url = post['thumbnail'];
                }

                var post_card = `<div class="media bg-dark text-white" id="` +
                    post['id'] +
                    `" onclick="showPost()">
  <img src="` + img_url + `" class="align-self-start mr-3" alt="tumbnail" id="` +
                    post['id'] +
                    `" height=50px;>
  <div class="media-body">
    <h5 class="mt-0" id="` +
                    post['id'] +
                    `">` + post['title'] + `</h5>
    <p>Author: ` + post['author'] + `</p>
    <p>Score: ` + post['score'] + `</p>
  </div>
</div>`;

                featured_container.insertAdjacentHTML('beforeend', post_card);
            });
            console.log(POSTS);
        });
}

// gets post as json element. creates and adds container
function addPostContainer(post) {
    console.log("adding post");
    console.log(post);
}

// show embeded content from subreddit post
function showContent(id) {
    var postContent = document.getElementById('post-content');

    try {
        let iframeContent = POSTS[id]['media_embed']['content']
        iframeContent = iframeContent.replace("&lt;iframe", "");
        iframeContent = iframeContent.replace("&gt;&lt;/iframe&gt;", "");
        var iframe = `<iframe ` + iframeContent + `></iframe>`;
    } catch {
        console.log('not a video')
        var iframe = ''
    }


    let content = `<div class="card text-white bg-dark">
    <div class="card-body">
        <blockquote class="blockquote mb-0">
            <p>` + POSTS[id]['title'] + `</p>
            ` + iframe + `
            <footer class="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite>
            </footer>
        </blockquote>
    </div>
    <div class="card-header">
        Quote
    </div>
</div>`;

    postContent.innerHTML = '';
    postContent.insertAdjacentHTML('beforeend', content);

    let commentTree = `<ul class="list-group" id="comments"></ul>`
    postContent.insertAdjacentHTML('beforeend', commentTree);
}

// put comments into post
function getComments(post_id) {
    var commentTree = document.getElementById('comments');
    let comment = `<li class="list-group-item bg-dark text-white">Cras justo odio</li>`
    commentTree.insertAdjacentHTML('beforeend', comment);

    let url = 'https://api.pushshift.io/reddit/comment/search?link_id=' + post_id
    let commentData = [];

    if (!POSTS[post_id]['comments'] === []) {
        // get comment data if not yet
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                console.log(myJson);
                myJson['data'].forEach(function (item) {
                    commentData.push(item);
                });
            });

        // data for comment exists, get it
    } else {
        commentData.forEach(function (commentItem) {
            console.log(commentItem);

            // comment item
            let content = `<div class="card text-white bg-dark">
<div class="card-body">
    <div class="card-header">
        ` + commentItem['author'] + `
    </div>
    <blockquote class="blockquote mb-0">
        <p>` + commentItem['body'] + `</p>
    </blockquote>
</div>
</div>`;
            commentTree.insertAdjacentHTML('beforeend', content);
        });
    }
}

function showPost() {
    var id = event.target.id;
    showContent(id);
    getComments(id);
}

function toggleDarkMode() {
    var items = document.getElementsByClassName("bg-dark");
    console.log(items);
}

console.log("generating posts");
getPosts();
