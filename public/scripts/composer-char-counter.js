/**
 * Count user input in tweet-text textarea.
 * Displays number of characters in textarea.
 * Changes colour if number is above character limit.
 */

$(document).ready(function() {
  $("#tweet-text").on("input", function() {
    const textAreaInput = $(this).val().length;
    const charCount = 140 - textAreaInput;
    if (charCount < 0) {
      $(".counter").text(charCount).css({"color": "red"});
      return;
    }
    $(".counter").text(charCount).css({"color": "inherit"});
  });
});