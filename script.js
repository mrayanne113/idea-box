var $title = $('.title-input');
var $body = $('.body-input');
var $ideas = $('.ideas');
var $saveBtn = $('.save-idea-bttn');

$title.on('input', enableSave);
$body.on('input', enableSave);
$saveBtn.on('click', makeIdea);
$ideas.on('blur', '.user-idea-title', saveEditedTitle);
$ideas.on('blur', '.user-idea-body', saveEditedTitle);
$ideas.on('click', '.delete-bttn', deleteIdea);
$ideas.on('click', '.upvote-bttn', ideaUpVote);
$ideas.on('click', '.downvote-bttn', ideaDownVote);
$('.search-input').on('input', searchIdeas);
$('.swill-bttn').on('click', showFilter);
$('.plausible-bttn').on('click', showFilter);
$('.genius-bttn').on('click', showFilter);
$('.show-all-bttn').on('click', showAllIdeas);

$(document).ready(getIdeaFromStorage);

function enableSave() {
  if ($title.val() && $body.val()){
    $saveBtn.removeAttr('disabled', false);
  } else {
    $saveBtn.attr('disabled', true);
  }
}

function makeIdea(e) {
  e.preventDefault();
  var newIdea = new Idea($title.val(), $body.val());
  newIdea.createIdea();
  addIdeaToStorage(newIdea);
  clearFields();
}

function Idea(title, body, newId, quality) {
  this.newId = newId || $.now();
  this.title = title;
  this.body = body;
  this.quality = quality || 'swill'; 
} 

Idea.prototype.createIdea = function () {
  $ideas.prepend(
       `<article class="user-idea" id="${this.newId}">
        <h2 class="user-idea-title" aria-label="idea title" contenteditable="true" >${this.title}</h2>
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
  $title.focus();
  $saveBtn.attr('disabled', true);
}

function addIdeaToStorage(object) {
  var stringifyObj = JSON.stringify(object);
  localStorage.setItem(object.newId, stringifyObj);
}

function getIdeaFromStorage() {
  for(i = 0; i < localStorage.length; i++) {
    var getObject = localStorage.getItem(localStorage.key(i));
    var parseObject = JSON.parse(getObject);
    var newIdea = new Idea(parseObject.title, 
                           parseObject.body, 
                           parseObject.newId, 
                           parseObject.quality
                           );
    newIdea.createIdea();
  }
}

function deleteIdea() {
  var card = this.closest('article').id;
  this.closest('article').remove();
  localStorage.removeItem(card);
}

function getFromStorage(key) {
  var obj = localStorage.getItem(key);
  var idea = JSON.parse(obj);
  return idea;
}

function sendToStorage(key, idea) {
  var ideaString = JSON.stringify(idea);
  localStorage.setItem(key, ideaString);
}

function ideaUpVote() {
  var key = $(this).closest('article').attr('id');
  var idea = getFromStorage(key);
  if (idea.quality === 'swill') {
    idea.quality = 'plausible';
    $(this).siblings('p').children('.quality-placeholder').text('plausible');
  } else {
    idea.quality = 'genius';
    $(this).siblings('p').children('.quality-placeholder').text('genius');
  }
  sendToStorage(key, idea);
}

function ideaDownVote() {
  var key = $(this).closest('article').attr('id');
  var idea = getFromStorage(key);
  if (idea.quality === 'genius') {
    idea.quality = 'plausible';
    $(this).siblings('p').children('.quality-placeholder').text('plausible');
  } else  {
    idea.quality = 'swill';
    $(this).siblings('p').children('.quality-placeholder').text('swill');
  }
  sendToStorage(key, idea);
}

function saveEditedTitle(e) {
  var name = e.target.className === 'user-idea-title' ? 'title' : 'body';
  var key = $(this).closest('article').attr('id');
  var idea = getFromStorage(key);
  idea[name] = $(this).text();
  sendToStorage(key, idea);
}

function searchIdeas() {
  var $ideaTitle = $('.user-idea-title');
  var $ideaBody = $('.user-idea-body');
  var filtered = $(this).val().toUpperCase();
  for (var i = 0; i < ($ideaTitle.length); i++) {
      const title = $($ideaTitle[i]).text().toUpperCase();
      const body = $($ideaBody[i]).text().toUpperCase();
     if (title.includes(filtered) || body.includes(filtered)) {
        $($ideaTitle[i]).parent('article').show();
      } else {
        $($ideaTitle[i]).parent('article').hide();
     }
  }
} 

function showFilter(e) {
  e.preventDefault();
  var eventName = e.target.name;
  var ideaQuality = $('.quality-placeholder');
  for (var i = 0; i < (ideaQuality.length); i++) {
      $(ideaQuality[i]).parent().parent('article').hide();
     if (ideaQuality[i].innerText === eventName) {
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
