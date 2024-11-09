import { addDownvote, notes, addUpvote, addNote } from "../model/NoteModel.js";
import { renderNotes } from "../view/noteViews.js";

$(document).ready(() => { 
    //using Jquery function ready
    let user = $("#dropdown");

    let loggedInUser = null;

    // Register event on the dropdown menu options
    user.click((e) => {
        //upon clicking the one of the options in the drop down menus
        let loginStatus = $("#username")[0];
        
        loggedInUser = e.target.innerText;
        loginStatus.innerText = "Logged in as " + loggedInUser;

        //after selecting user we will render the notes it will make the note container empty and 
        //add the notes to it 
        renderNotes(notes, loggedInUser);
        

    
        let addbtn = $("#add-btn");
       
        //adding event listner to the add note button 
        addbtn.off("click").on("click", () => {  
            // using the .off to remove previous click handler and add new one

            let inputNote = addbtn.prev(); //the addbtn.prev is where the note will be
            addNote(loggedInUser, inputNote[0].value);  //calling addNote function to add the note to the Object
            //after adding the note we are rendering the notes
            renderNotes(notes, loggedInUser); 
        });
    });

    // Add event listener to the notes container once and again using the .off so we can remove all the previous 
    //events and let the event register only once
    let votebtn = $("#notes-container");
    votebtn.off("click").on("click", (e) => { 
        let button = e.target;


        //since this event listener is on the note container we need to check if the target of the event
        // is a button and not something else

        //and will also check if its a upvote or downvote

        if (button && (button.classList.contains("downvote") || button.classList.contains("upvote"))) {
            let noteDiv = button.parentElement;

            //getting the id of of the note
            let noteId = parseInt(noteDiv.getAttribute("data-note-id"));  

            //checking if its downvote
            if (button.classList.contains("downvote")) {
            //call downvote function and then render function again
                addDownvote(noteId,loggedInUser);
                renderNotes(notes,loggedInUser);

            //call upvote function function and then render function again

            } else if (button.classList.contains("upvote")) {
                addUpvote(noteId, loggedInUser);
                renderNotes(notes, loggedInUser);
            }
        }
    });
});
