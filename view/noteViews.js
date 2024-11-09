export function renderNotes(notes, user) {
    let notecontainer = $("#notes-container");
    notecontainer.empty(); // Clear container before rendering notes again
    

    //with each note we will extract the things we need
    notes.forEach(note => {
        let noteId = note.id;
        let noteUser = note.creator;
        let noteContent = note.text;
        let upvotes = note.upvotes.length;
        let downvotes = note.downvotes.length;
        let rating = upvotes - downvotes;
//chekcing the currentlogged in user is the same as the users note we are looking at
// if it is then we will show the note without the upvote and downvote buttons 
        if(noteUser === user) {
            notecontainer.prepend(`
                <div class="input-group" data-note-id="${noteId}">
                    <input type="text" class="form-control" placeholder="${noteContent}" disabled aria-label="Close" >
                    <span class="input-group-text">${rating}</span>
                </div>
            `);
            // if its not their not then they will be shown to upvote and downvote and the behi\avour 
            // of not showing the votes untill you have voted is done with a ternirary operator
        } else {
            notecontainer.prepend(`
                <div class="input-group" data-note-id="${noteId}">
                    <input type="text" class="form-control" placeholder="${noteContent}" disabled aria-label="Close">
                    
                    <button type="button" class="btn ${note.upvotes.includes(user) ? 'btn-success' : 'btn-outline-success'} upvote">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/>
                        </svg>
                    </button>
        
                    <button type="button" class="btn ${note.downvotes.includes(user) ? 'btn-danger' : 'btn-outline-danger'} downvote">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/>
                        </svg>
                    </button>
        
                    ${note.upvotes.includes(user) || note.downvotes.includes(user) ? `<span class="input-group-text">${rating}</span>` : ''}
                </div>
            `);
        }
        
        
    });
}
