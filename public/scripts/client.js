/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  // scroll to top button
  $(window).scroll(function() {
    if ($(this).scrollTop()) {
      $('#to-top').fadeIn();
    } else {
      $('#to-top').fadeOut();
    }
  });

$("#to-top").click(function() {
    $("html, body").animate({scrollTop: 0}, 0);
  });

  // write tweet button animations
  $(".write-tweet").on("mouseenter", function() {
    $(".write-tweet p").animate({marginTop: '10px'}, "slow");
    $(".fa-angles-down").animate({marginTop: '10px'}, "slow");
  });

  $(".write-tweet").on("mouseleave", function() {
    $(".write-tweet p").animate({marginTop: '0px'}, "slow");
    $(".fa-angles-down").animate({marginTop: '0px'}, "slow");
  });

  // show write tweet form
  $(".write-tweet").on("click", function() {
    $(".new-tweet").slideDown().css({"display": "flex"});
    $("#tweet-text").focus();
  });

  // Submits tweet form
  $(".tweet-form").on("submit", function(event) {
    event.preventDefault();
    const tweetText = $("#tweet-text").val();
    if (tweetText.trim() === "") {
      $("#tweet-error").text("Your Tweet is Empty!").slideDown().css({"display": "inline-block"}).delay(2000).slideUp();
      return;
    }
    if (tweetText.length > 140) {
      $("#tweet-error").text("Your Tweet is too Long!").slideDown().css({"display": "inline-block"}).delay(2000).slideUp();
      return;
    }
    $.ajax({
      method: "POST",
      url: "/tweets/",
      data: $("form").serialize(),
      success: function(res) {
        $("#tweet-text").val("");
        $(".counter").val("140");
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
