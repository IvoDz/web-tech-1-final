$(document).ready(function () {
  // --------------------------------------------- CHANGING VISIBILITY OF ELEMENTS -------------------------------------------------------------

  // Hide intro text, center main container.
  $("#hide-intro").click(function () {
    $("#intro-text").hide();
    $(".main").addClass("center-main");
  });

  // ---------------------------------- CHECKING CHECKBOX STATE AND CREATING/DELETING  ELEMENTS (JQUERY) -----------------------------------------------

  // Check "no due" checkbox and add attribute 'disabled', if it is indeed disabled, or remove it if checked.
  $("#no-due").change(function () {
    if (this.checked) {
      $("#due").attr("disabled", "disabled");
    } else {
      $("#due").removeAttr("disabled");
    }
  });

  var emptyWarning = document.getElementById("emptytask");

  // Adding tasks to task list (after button is pressed)
  $(document).on("click", ".add-task", function (e) {
    e.preventDefault();
    emptyWarning.textContent = "";
    var task = $("#task").val();
    var due = $("#due").val();
    var taskHtml =
      "<li><input type='checkbox' class='task-check'>" +
      task +
      " <i class='fa-solid fa-trash-can'></i></li>";
    if (task) {
      if (due && !$("#no-due").is(":checked")) {
        taskHtml =
          "<li><input type='checkbox' class='task-check'>" +
          task +
          " <i class='fa-solid fa-trash-can'></i><br>Due date : " +
          due +
          "</li>";
      }
      $("#task-placeholder").hide();
      $("#task-list ul").append(taskHtml);
      $("#task").val("");
      $("#due").val("");
    } else {
      emptyWarning.textContent = "Do not leave this field empty!";
    }
  });

  // Cross out tasks that has checkbox enabled and vice versa
  $(document).on("click", ".task-check", function () {
    if ($(".task-check").is(":checked")) {
      $(this).closest("li").wrap("<del>");
    } else {
      $(this).closest("li").unwrap();
    }
  });

  // Remove task by clicking on trash can icon
  $(document).on("click", ".fa-trash-can", function () {
    $(this).closest("li").remove();
    if ($("#task-list ul li").length == 0) {
      $("#task-placeholder").show();
    }
  });

  // --------------------------------------------CREATING NEW ELEMENTS (DOM) AND FINDING CURRENT DAY,DATE -------------------------------------------

  // Dynamically update datetime in header.
  var weekDay;
  // This order because getDay return number 0-6 where 0 - sunday , 6 - saturday.
  var possibleDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var dayNum = new Date().getDay();
  weekDay = possibleDays[dayNum];
  let today = new Date().toLocaleDateString();

  todayHeader = document.createElement("h3");
  todayHeader.textContent = weekDay + ", " + today;
  todayHeader.id = "today";
  document.getElementsByClassName("day")[0].appendChild(todayHeader);

  // ------------------------------------------------------- VALIDATING INPUTS -------------------------------------------------------------------------

  function validateNumber(event) {
    var rating = document.getElementById("rating-field").value;
    var final_msg = document.getElementById("final-msg");
    if (!isNaN(rating) && rating >= 1 && rating <= 10) {
      final_msg.textContent = "Thanks for your feedback!";
    } else {
      final_msg.textContent = "Enter valid mark, please!";
      event.preventDefault();
    }
  }

  var form = document.querySelector("#rating-form");
  form.addEventListener("submit", validateNumber);

  //------------------------------------------------ (RE)GENERATING QUOTES USING API ------------------------------------------------------------------

  // Locating necessary elements we will be working with.
  var quoteDiv = document.querySelector(".quote");
  var button = document.querySelector("#quote-regenerate");
  let randomQuote, blkQuote;
  // Function to generate random quote using Zenquotes API.
  // Returns string as HTML code containing quote and author.
  function generateQuote(callback) {
    $.getJSON("https://zenquotes.io/api/random").done(function (data) {
      var quote = data[0].q;
      var author = data[0].a;
      var fullQuote =
        "&ldquo;" + quote + "&rdquo;&mdash;<footer>" + author + "</footer>";
      callback(fullQuote);
    });
  }

  // Creating new blockquote element to put quote in.
  // Add random quote when window is loaded first time.
  generateQuote(function (result) {
    randomQuote = result;
    blkQuote = document.createElement("blockquote");
    blkQuote.innerHTML = randomQuote;
    quoteDiv.insertBefore(blkQuote, button);
  });

  // Regenerate quote
  $("#quote-regenerate").click(function () {
    generateQuote(function (result) {
      randomQuote = result;
      blkQuote.textContent = "";
      blkQuote.innerHTML = randomQuote;
    });
  });
});
