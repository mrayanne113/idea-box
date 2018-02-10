var $saveBttn = $('.save-idea-bttn');
var $cardSection = $('.cards');
var $title = $('.title-input');
var $body = $('.body-input');

var qualityArray = ['swill', 'plausible', 'genius'];

// event listeners
$saveBttn.on('click', makeCard);


// on page load


function makeCard(e) {
  e.preventDefault();
  var newCard = new Card($title.val(), $body.val());
  newCard.createCard();
  clearFields();
}
// MakeCard prepend time title body quailty 
function Card(title, body, newId, qualityArray) {
  this.newId = newId || $.now();
  this.title = title;
  this.body = body;
  this.quality = qualityArray || 0; 
} 

Card.prototype.createCard = function () {
  $cardSection.prepend(` <article class="user-card" id="${this.newId}">
        <h2 class="user-idea-title">${this.title}</h2>
        <button class="delete-bttn"></button>
        <p class="user-idea-body" contenteditable="true">${this.body}</p>
        <button class="upvote-bttn"></button>
        <button class="downvote-bttn"></button>
        <p class="quailty">quality: <span class="quailty-placeholder">${qualityArray[this.quality]}</span></p>
      </article>`);
}

function clearFields() {
  $title.val('');
  $body.val('');
}

// json to storage

// json from storage

// delete bttn and stroage

// upvote bttn

// downvote bttn

// edit idea to storage

// filter idea

//  sorting