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
$ideaSection.on('blur', '.user-idea-body', saveEditedBody);

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
  console.log('up')
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
  console.log('down')
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
  console.log($(this).closest('article'))
  var key = $(this).closest('article').attr('id');
  var obj = localStorage.getItem(key);
  var idea = JSON.parse(obj);
  idea.title = $(this).text();
  console.log('idea.title ', idea.title)
  var ideaString = JSON.stringify(idea)
  localStorage.setItem(key, ideaString)
}

function saveEditedBody() {
  var key = $(this).closest('article').attr('id');
  var obj = localStorage.getItem(key);
  var ideas = JSON.parse(obj);
  ideas.body = $(this).text();
  var ideaString = JSON.stringify(ideas)
  localStorage.setItem(key, ideaString)
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