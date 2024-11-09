

//empty notes array which will be a array of objects
export let notes = [
 
];

//add notes will create a object and push to the notes array
export function addNote(creator, text) {
  const newNote = {
    id: notes.length + 1, // Simple id generation based on array length
    creator: creator,
    text: text,
    upvotes: [],
    downvotes: []
  };
  notes.push(newNote);
}



//addUpvote function will take the noteId and the username of the person who is voteing

export function addUpvote(noteId, username) {


//using foreach loop to loop through the notes array 
  notes.forEach(note => {

//checking if the noteid exits 
    if (note.id === noteId) {
      //and checking if the upvotes array has the user that did vote already voted
     //if his name already exists in the upvotes then we will remove him from the upvotes
      if (!note.upvotes.includes(username)) {
        
        note.upvotes.push(username);
        console.log(note.upvotes);
        note.downvotes = note.downvotes.filter(user => user !== username);
       
      } else {
        note.upvotes = note.upvotes.filter(user => user !== username);
      }
    }
  });
}

//downvote button has the same logic as upvote

export function addDownvote(noteId, username) {
  notes.forEach(note => {
    if (note.id === noteId) {
      if (!note.downvotes.includes(username)) {
        note.downvotes.push(username);
        note.upvotes = note.upvotes.filter(user => user !== username);
      } else {
        note.downvotes = note.downvotes.filter(user => user !== username);
      }
    }
  });
}