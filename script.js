var $saveBttn = $('.save-idea-bttn');
var $ideaSection = $('.ideas');
var $title = $('.title-input');
var $body = $('.body-input');
var $search = $('.search-input');

$saveBttn.on('click', makeIdea);
$search.on('keyup', searchIdeas);
$ideaSection.on('click', '.delete-bttn', deleteIdea);
$ideaSection.on('click', '.upvote-bttn', ideaUpVote);
$ideaSection.on('click', '.downvote-bttn', ideaDownVote);
$ideaSection.on('blur', '.user-idea-title', saveEditedTitle);
$ideaSection.on('blur', '.user-idea-body', saveEditedBody);

$(document).ready(getIdeaFromStorage)

function makeIdea(e) {
  e.preventDefault();
  var newIdea = new Idea($title.val(), $body.val());
  newIdea.createIdea();
  addIdeaToStorage(newIdea)
  clearFields();
  $title.focus();
}

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

function addIdeaToStorage(object) {
  var stringifyObj = JSON.stringify(object);
  localStorage.setItem(object.newId, stringifyObj);
}

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

function deleteIdea() {
  var card = this.closest('article').id;
  this.closest('article').remove();
  localStorage.removeItem(card);
}

function ideaUpVote() {
  let key = $(this).closest('article').attr('id');
  let obj = localStorage.getItem(key);
  let idea = JSON.parse(obj);
  if (idea.quality === 'swill') {
    idea.quality = 'plausible';
    $(this).siblings('p').children('.quality-placeholder').text('plausible')
  } else {
    idea.quality = 'genius';
    $(this).siblings('p').children('.quality-placeholder').text('genius')

  }
  let ideaString = JSON.stringify(idea)
  localStorage.setItem(key, ideaString)
}

function ideaDownVote() {
  var key = $(this).closest('article').attr('id');
  var obj = localStorage.getItem(key);
  var idea = JSON.parse(obj);
  if (idea.quality === 'genius') {
    idea.quality = 'plausible';
    $(this).siblings('p').children('.quality-placeholder').text('plausible');
  }  else  {
    idea.quality = 'swill';
    $(this).siblings('p').children('.quality-placeholder').text('swill');
  }
  var ideaString = JSON.stringify(idea)
  localStorage.setItem(key, ideaString)
}

function saveEditedTitle() {
  var key = $(this).closest('article').attr('id');
  var obj = localStorage.getItem(key);
  var idea = JSON.parse(obj);
  idea.title = $(this).text();
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

function searchIdeas() {
  var $ideaTitle = $('.user-idea-title');
  var $ideaBody = $('.user-idea-body');
  var filtered = $(this).val();
  for (var i = 0; i < ($ideaTitle.length); i++) {
    $($ideaTitle[i]).parent('article').hide();
   if ($($ideaTitle[i]).text().toUpperCase().includes(filtered.toUpperCase()) || $($ideaBody[i]).text().toUpperCase().includes(filtered.toUpperCase())) {
    $($ideaTitle[i]).parent('article').show();
   } 
  }
}

function sortIdea() {

}

