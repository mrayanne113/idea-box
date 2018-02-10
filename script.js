var $saveBttn = $('.save-idea-bttn');
var $ideaSection = $('.ideas');
var $title = $('.title-input');
var $body = $('.body-input');

var qualityArray = ['swill', 'plausible', 'genius'];

// event listeners
$saveBttn.on('click', makeIdea);
$ideaSection.on('click', '.delete-bttn', deleteIdea);
// $ideaSection.on('click', '.upvote-bttn', ideaUpvote);


// on page load
// getIdeaFromStorage();


function makeIdea(e) {
  e.preventDefault();
  var newIdea = new Idea($title.val(), $body.val());
  newIdea.createIdea();
  addIdeaToStorage(newIdea)
  clearFields();
}
// Makeidea prepend time title body quailty 
function Idea(title, body, newId) {
  this.newId = newId || $.now();
  this.title = title;
  this.body = body;
  this.quality = 'swill'; 
} 

Idea.prototype.createIdea = function () {
  $ideaSection.prepend(` <article class="user-idea" id="${this.newId}">
        <h2 class="user-idea-title" contenteditable="true">${this.title}</h2>
        <button class="delete-bttn"></button>
        <p class="user-idea-body" contenteditable="true">${this.body}</p>
        <button class="upvote-bttn"></button>
        <button class="downvote-bttn"></button>
        <p class="quailty">quality: <span class="quailty-placeholder">${this.quality}</span></p>
      </article>`);
}

function clearFields() {
  $title.val('');
  $body.val('');
}

// json to storage
function addIdeaToStorage(object) {
  var stringifyObj = JSON.stringify(object);
  localStorage.setItem(object.newId, stringifyObj);
}

// json from storage
function getIdeaFromStorage() {
  for(i = 0; i < localStorage.length; i++) {
    var getObject = localStorage.getItem(localStorage.key(i));
    var parseObject = JSON.parse(getObject);
    var persistIdea = new Idea(parseObject.$title, parseObject.$body, parseObject.newId, parseObject.quality);
    persistIdea.createIdea();
  }
}

// delete bttn and stroage
function deleteIdea() {
  var card = this.closest('article').id;
  console.log(card)
  this.closest('article').remove();
  localStorage.removeItem(card);
}

// upvote bttn
// function ideaUpvote() {
//   if () {

//   }  
// }

// downvote bttn

// edit idea to storage

// filter idea

//  sorting