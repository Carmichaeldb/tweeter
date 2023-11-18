/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  
  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      $("#tweets-container").append(createTweetElement(tweet));
    }
  };

  const createTweetElement = function(tweet) {
    let postDate = new Date(tweet.created_at);
    let $tweet = $(`
    <article>
    <header>
    <img src="${tweet.user.avatars}" alt="Users Profile Image">
    <p>${tweet.user.name}</p>
    <a class="tweet-user" href="">${tweet.user.handle}</a>
    </header>
    <main>
    <p>${tweet.content.text}</p>
    </main>
    <footer>
    <p>${postDate.toDateString()}</p>
    <div class="tweet-icons"><i class="fa-solid fa-flag"></i><i class="fa-solid fa-arrows-rotate"></i><i class="fa-solid fa-heart"></i></div>
    </footer>
    </article>`);
    return $tweet;
  };

  const loadTweets = function() {
    $.ajax("/tweets", {
      method: "GET",
      datType: "JSON",
      success: (data) => { renderTweets(data); }
    }
    );
  };

  loadTweets();

  $(".tweet-form").on("submit", function(event) {
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/tweets/",
      data: $("form").serialize()
    });
  });
});
