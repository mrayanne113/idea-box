var $saveBttn = $('.save-idea-bttn');
var $ideaSection = $('.ideas');
var $title = $('.title-input');
var $body = $('.body-input');
var $search = $('.search-input');

// var qualityArray = ['swill', 'plausible', 'genius'];

// event listeners
$saveBttn.on('click', makeIdea);
$search.on('keyup', searchIdeas);
$ideaSection.on('click', '.delete-bttn', deleteIdea);
$ideaSection.on('click', '.upvote-bttn', ideaUpVote);
$ideaSection.on('click', '.downvote-bttn', ideaDownVote);
$ideaSection.on('blur', '.user-idea-title', saveEditedTitle);
// $ideaSection.on('blur', '.user-idea-body', saveEditedIdea);

// on page load
$(document).ready(getIdeaFromStorage)

function makeIdea(e) {
  e.preventDefault();
  var newIdea = new Idea($title.val(), $body.val());
  newIdea.createIdea();
  addIdeaToStorage(newIdea)
  clearFields();
  $title.focus();
}
// Makeidea prepend time title body quailty 
function Idea(title, body, newId, quality) {
  this.newId = newId || $.now();
  this.title = title;
  this.body = body;
  this.quality = quality || 'swill'; 
} 

Idea.prototype.createIdea = function () {
  $ideaSection.prepend(`<article class="user-idea" id="${this.newId}">
        <h2 class="user-idea-title" contenteditable="true">${this.title}</h2>
        <button class="delete-bttn"></button>
        <p class="user-idea-body" contenteditable="true">${this.body}</p>
        <button class="upvote-bttn"></button>
        <button class="downvote-bttn"></button>
        <p class="quality">quality: <span class="quality-placeholder">${this.quality}</span></p>
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
    console.log('quality: ', quality)
    var newIdea = new Idea(title, body, newId, quality);
    newIdea.createIdea();
  }
}

// delete bttn and stroage
function deleteIdea() {
  var card = this.closest('article').id;
  this.closest('article').remove();
  localStorage.removeItem(card);
}

function ideaUpVote() {
  var key = $(this).closest('article').attr('id');
  var obj = localStorage.getItem(key);
  var idea = JSON.parse(obj);
  if ($('.quality-placeholder').text() === 'swill') {
    idea.quality = 'plausible';
    $('.quality-placeholder').text('plausible');
  }  else if ($('.quality-placeholder').text() === 'plausible') {
    idea.quality = 'genius';
    $('.quality-placeholder').text('genius');
  }
  var ideaString = JSON.stringify(idea)
  localStorage.setItem(key, ideaString)
}

function ideaDownVote() {
  var key = $(this).closest('article').attr('id');
  var obj = localStorage.getItem(key);
  var idea = JSON.parse(obj);
  if ($('.quality-placeholder').text() === 'genius') {
    idea.quality = 'plausible';
    $('.quality-placeholder').text('plausible');
  }  else if ($('.quality-placeholder').text() === 'plausible') {
    idea.quality = 'genius';
    $('.quality-placeholder').text('swill');
  }
  var ideaString = JSON.stringify(idea)
  localStorage.setItem(key, ideaString)
}

// edit idea to storage
function saveEditedTitle() {
  var ideaId = this.closest('article').id;
  var ideaBody = $(this).closest('user-idea-body').text();
  console.log('ideaBody: ', ideaBody)
  console.log('ideaId ', ideaId)
  var newTitle = $(this).closest('.user-idea-title').text();
  console.log('newTitle ', newTitle)
  var getIdea = localStorage.getItem(ideaId);
  var parsedIdea = JSON.parse(getIdea);
  // var parsedBody = JSON.parse(ideaBody);
  console.log('parsedIdea: ', parsedIdea)
  parsedIdea.title = newTitle;
  parsedIdea.body = ideaBody;
  console.log(parsedIdea.body)
  var passedIdea = new Idea()
  console.log('passedIdea: ', passedIdea)

  // var stringIdea = JSON.stringify(parsedIdea.title)

  // localStorage.setItem(ideaId, stringIdea)
  // console.log(localStorage.setItem(ideaId, stringIdea))
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