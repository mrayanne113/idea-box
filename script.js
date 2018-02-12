var $saveBttn = $('.save-idea-bttn');
var $ideaSection = $('.ideas');
var $title = $('.title-input');
var $body = $('.body-input');
var $search = $('.search-input');

$title.on('keyup', enableSave);
$body.on('keyup', enableSave);
$saveBttn.on('click', makeIdea);
$search.on('keyup', searchIdeas);
$('.swill-bttn').on('click', showSwill);
$('.plausible-bttn').on('click', showPlausible);
$('.genius-bttn').on('click', showGenius);
$('.show-all-bttn').on('click', showAllIdeas);
$ideaSection.on('blur', '.user-idea-title', saveEditedTitle);
$ideaSection.on('blur', '.user-idea-body', saveEditedBody);
$ideaSection.on('click', '.delete-bttn', deleteIdea);
$ideaSection.on('click', '.upvote-bttn', ideaUpVote);
$ideaSection.on('click', '.downvote-bttn', ideaDownVote);

$(document).ready(getIdeaFromStorage);

function enableSave() {
  if ($title.val() && $body.val()){
   $saveBttn.removeAttr('disabled', false)
  } else {
   $saveBttn.attr('disabled', true)
  }
}

function makeIdea(e) {
  e.preventDefault();
  var newIdea = new Idea($title.val(), $body.val());
  newIdea.createIdea();
  addIdeaToStorage(newIdea)
  clearFields();
  $title.focus();
  $saveBttn.attr('disabled', true);
}

function Idea(title, body, newId, quality) {
  this.newId = newId || $.now();
  this.title = title;
  this.body = body;
  this.quality = quality || 'swill'; 
} 

Idea.prototype.createIdea = function () {
  $ideaSection.prepend(`<article class="user-idea" id="${this.newId}">
        <h2 class="user-idea-title" aria-label="idea title" contenteditable="true">${this.title}</h2>
        <button aria-label="delete your idea forever" class="delete-bttn"></button>
        <p class="user-idea-body" aria-label="idea body" contenteditable="true">${this.body}</p>
        <button aria-label="upvote your idea" class="upvote-bttn"></button>
        <button aria-label="downvote your idea" class="downvote-bttn"></button>
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
  var key = $(this).closest('article').attr('id');
  var obj = localStorage.getItem(key);
  var idea = JSON.parse(obj);
  if (idea.quality === 'swill') {
    idea.quality = 'plausible';
    $(this).siblings('p').children('.quality-placeholder').text('plausible')
  } else {
    idea.quality = 'genius';
    $(this).siblings('p').children('.quality-placeholder').text('genius')

  }
  var ideaString = JSON.stringify(idea)
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
  var idea = JSON.parse(obj);
  idea.body = $(this).text();
  var ideaString = JSON.stringify(idea)
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

function showSwill(e) {
  e.preventDefault();
  var ideaQuality = $('.quality-placeholder');
  for (var i = 0; i < (ideaQuality.length); i++) {
    $(ideaQuality[i]).parent().parent('article').hide();
   if (ideaQuality[i].innerText == 'swill') {
    $(ideaQuality[i]).parent().parent('article').show();
   } 
  }
}

function showPlausible(e) {
  e.preventDefault();
  var ideaQuality = $('.quality-placeholder');
  for (var i = 0; i < (ideaQuality.length); i++) {
    $(ideaQuality[i]).parent().parent('article').hide();
   if (ideaQuality[i].innerText == 'plausible') {
    $(ideaQuality[i]).parent().parent('article').show();
   } 
  }
}

function showGenius(e) {
  e.preventDefault();
  var ideaQuality = $('.quality-placeholder');
  for (var i = 0; i < (ideaQuality.length); i++) {
    $(ideaQuality[i]).parent().parent('article').hide();
   if (ideaQuality[i].innerText == 'genius') {
    $(ideaQuality[i]).parent().parent('article').show();
   } 
  }
}

function showAllIdeas(e) {
  e.preventDefault();
  var ideaQuality = $('.quality-placeholder');
  for (var i = 0; i < (ideaQuality.length); i++) {
    $(ideaQuality[i]).parent().parent('article').show();
  }
}



