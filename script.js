var $saveBttn = $('.save-idea-bttn');
var $ideaSection = $('.ideas');
var $title = $('.title-input');
var $body = $('.body-input');
var $search = $('.search-input');

var qualityArray = ['swill', 'plausible', 'genius'];

// event listeners
$saveBttn.on('click', makeIdea);
$search.on('keyup', searchIdeas);
$ideaSection.on('click', '.delete-bttn', deleteIdea);
$ideaSection.on('click', '.upvote-bttn', ideaUpVote);
$ideaSection.on('click', '.downvote-bttn', ideaDownVote);
// $ideaSection.on('blur', '.user-idea-title', saveEditedIdea);
// $ideaSection.on('blur', '.user-idea-body', saveEditedIdea);



// on page load
$(window).on('load', getIdeaFromStorage)


function makeIdea(e) {
  e.preventDefault();
  var newIdea = new Idea($title.val(), $body.val());
  newIdea.createIdea();
  addIdeaToStorage(newIdea)
  clearFields();
  $title.focus();
}
// Makeidea prepend time title body quailty 
function Idea(title, body, newId, qualityArray) {
  this.newId = newId || $.now();
  this.title = title;
  this.body = body;
  this.quality = qualityArray || 0; 
} 

Idea.prototype.createIdea = function () {
  $ideaSection.prepend(` <article class="user-idea" id="${this.newId}">
        <h2 class="user-idea-title" contenteditable="true">${this.title}</h2>
        <button class="delete-bttn"></button>
        <p class="user-idea-body" contenteditable="true">${this.body}</p>
        <button class="upvote-bttn"></button>
        <button class="downvote-bttn"></button>
        <p class="quality">quality: <span class="quality-placeholder">${qualityArray[this.quality]}</span></p>
      </article>`);
}

function clearFields() {
  $title.val('');
  $body.val('');
}

// json.stringify to storage
function addIdeaToStorage(object) {
  var stringifyObj = JSON.stringify(object);
  localStorage.setItem(object.newId, stringifyObj);
}

// json.parse from storage
function getIdeaFromStorage() {
  for(i = 0; i < localStorage.length; i++) {
    var getObject = localStorage.getItem(localStorage.key(i));
    var parseObject = JSON.parse(getObject);
    var newId = parseObject.newId;
    var title = parseObject.title;
    var body = parseObject.body;
    var quality = parseObject.quality;
    var newIdea = new Idea(title, body, newId, quality);
    newIdea.createIdea();
    // createNewIdea(newIdea)
  }
}

// function createNewIdea(newIdea) {
//   $ideaSection.prepend(` <article class="user-idea" id="${newIdea.newId}">
//         <h2 class="user-idea-title" contenteditable="true">${newIdea.title}</h2>
//         <button class="delete-bttn"></button>
//         <p class="user-idea-body" contenteditable="true">${newIdea.body}</p>
//         <button class="upvote-bttn"></button>
//         <button class="downvote-bttn"></button>
//         <p class="quality">quality: <span class="quality-placeholder">${qualityArray[newIdea.quality]}</span></p>
//       </article>`);
// }

// delete bttn and stroage
function deleteIdea() {
  var card = this.closest('article').id;
  this.closest('article').remove();
  localStorage.removeItem(card);
}

// upvote bttn
function ideaUpVote() {
  console.log('hi')
  // var parentCard = this.closest('article').id;
  if ($('.quality-placeholder').text() === 'swill') {
    $('.quality-placeholder').text(qualityArray[1]);
  }  else if ($('.quality-placeholder').text() === 'plausible') {
    $('.quality-placeholder').text(qualityArray[2]);
  }
}

// downvote bttn
function ideaDownVote() {
  // var parentCard = this.closest('article');
  // var pulledCard = JSON.parse(localStorage.getItem(parentCard.id));
  // console.log(pulledCard.quality)
  if ($('.quality-placeholder').text() === 'genius') {
    $('.quality-placeholder').text(qualityArray[1]);
    // localStorage.setItem(parentCard.qualityArray)
  }  else if ($('.quality-placeholder').text() === 'plausible') {
    $('.quality-placeholder').text(qualityArray[0]);
    // console.log(pulledCard.quality)
  }
}

// edit idea to storage
function saveEditedTitle() {
  
  addIdeaToStorage(newIdea);
}


// filter idea
function searchIdeas() {
  var $ideaTitle = $('.user-idea-title');
  var $ideaBody = $('.user-idea-body');
  var filtered = $(this).val();
  for (var i = 0; i < ($ideaTitle.length); i++) {
    $($ideaTitle[i]).parent('article').hide();
   if ($($ideaTitle[i]).text().includes(filtered) || $($ideaBody[i]).text().includes(filtered)) {
    $($ideaTitle[i]).parent('article').show();
   } 
  }
}

//  sorting