/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  // Submits tweet form
  $(".tweet-form").on("submit", function(event) {
    event.preventDefault();
    const tweetText = $("#tweet-text").val();
    if (tweetText === "") {
      alert("Your Tweet is Empty!");
      return;
    }
    if (tweetText.length > 140) {
      alert("Your Tweet is too long!");
      return;
    }
    $.ajax({
      method: "POST",
      url: "/tweets/",
      data: $("form").serialize(),
      success: function(res) {
        loadTweets();
      }
    });
  });
  
  // Render tweets in the tweets-container
  const renderTweets = function(tweets) {
    $("#tweets-container").empty();
    for (const tweet of tweets) {
      $("#tweets-container").prepend(createTweetElement(tweet));
    }
  };

  // Escape function to prevent XSS
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // Creates Tweets from database
  const createTweetElement = function(tweet) {
    const tweetContent = tweet.content.text;
    const safeHTML = `<p>${escape(tweetContent)}</p>`;
    let $tweet = $(`
    <article>
    <header>
    <img src="${tweet.user.avatars}" alt="Users Profile Image">
    <p>${tweet.user.name}</p>
    <a class="tweet-user" href="">${tweet.user.handle}</a>
    </header>
    <main>
    ${safeHTML}
    </main>
    <footer>
    <p>${timeago.format(tweet.created_at)}</p>
    <div class="tweet-icons"><i class="fa-solid fa-flag"></i><i class="fa-solid fa-arrows-rotate"></i><i class="fa-solid fa-heart"></i></div>
    </footer>
    </article>`);
    return $tweet;
  };

  // Collects Database tweet information
  const loadTweets = function() {
    $.ajax("/tweets", {
      method: "GET",
      datType: "JSON",
      success: (data) => { renderTweets(data); }
    }
    );
  };

  loadTweets();
});
