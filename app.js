const express = require("express");
const fs = require("fs");

// Remove the global currentUser variable
// let currentUser = { email: null, password: null };

// Create the Express app
const app = express();

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Common localhost test port
const port = 3000;

// Serve static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Start the server
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));

// Home route (Login page)
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

// POST /note-vote - Handle login and load posts
app.post("/note-vote", (req, res) => {
    let reqEmail = req.body["email"];
    let reqPassword = req.body["password"];

    fs.readFile(__dirname + "/users.json", "utf8", (err, jsonString) => {
        if (err) return res.status(500).send("Server error");

        try {
            const users = JSON.parse(jsonString);
            const userExists = users.find(user => user.email === reqEmail && user.password === reqPassword);

            if (userExists) {
                fs.readFile(__dirname + "/posts.json", "utf8", (err, postsJson) => {
                    if (err) return res.status(500).send("Server error");

                    const posts = JSON.parse(postsJson);
                    res.render("note-vote", { user: { email: reqEmail }, posts: posts });
                });
            } else {
                res.redirect("/");
            }
        } catch (err) {
            res.status(500).send("Server error");
        }
    });
});

// POST /register - Handle user registration
app.post("/register", (req, res) => {
    if (req.body["invite-code"] === "Note Vote 2024") {
        let newUser = { email: req.body["email"], password: req.body["password"] };

        fs.readFile(__dirname + "/users.json", "utf8", (err, jsonString) => {
            if (err) return res.status(500).send("Server error");

            try {
                const users = JSON.parse(jsonString);
                const userExists = users.find(user => user.email === newUser.email);

                if (userExists) {
                    res.redirect("/");
                } else {
                    users.push(newUser);
                    fs.writeFile(__dirname + "/users.json", JSON.stringify(users, null, 2), "utf8", err => {
                        if (err) return res.status(500).send("Server error");

                        fs.readFile(__dirname + "/posts.json", "utf8", (err, postsJson) => {
                            if (err) return res.status(500).send("Server error");

                            const posts = JSON.parse(postsJson);
                            res.render("note-vote", { user: { email: newUser.email }, posts: posts });
                        });
                    });
                }
            } catch (err) {
                res.status(500).send("Server error");
            }
        });
    } else {
        res.status(400).send("Invalid invite code");
    }
});

// GET /logout - Handle user logout
app.get("/logout", (req, res) => {
    res.redirect("/");
});

// POST /addpost - Handle adding a post and render updated note-vote page
app.post("/addpost", (req, res) => {
    const userEmail = req.body.user_email; // Get user email from request

    fs.readFile(__dirname + "/posts.json", "utf8", (err, jsonString) => {
        if (err) return res.status(500).send("Server error");

        try {
            const posts = JSON.parse(jsonString);
            const newPost = {
                _id: posts.length + 1,
                text: req.body["note"],
                creator: userEmail,
                upvotes: [],
                downvotes: []
            };
            posts.push(newPost);

            fs.writeFile(__dirname + "/posts.json", JSON.stringify(posts, null, 2), "utf8", (err) => {
                if (err) return res.status(500).send("Server error");

                res.render("note-vote", { user: { email: userEmail }, posts: posts });
            });
        } catch (err) {
            res.status(500).send("Error parsing posts JSON");
        }
    });
});

// POST /upvote - Handle upvoting a post and render updated note-vote page
app.post("/upvote", (req, res) => {
    let postId = parseInt(req.body["post_id"]);
    let userEmail = req.body["user_email"];

    fs.readFile(__dirname + "/posts.json", "utf8", (err, jsonString) => {
        if (err) return res.status(500).send("Server error");

        try {
            let posts = JSON.parse(jsonString);

            posts.forEach(post => {
                if (post._id === postId) {
                    if (!post.upvotes.includes(userEmail)) {
                        post.upvotes.push(userEmail);
                        post.downvotes = post.downvotes.filter(user => user !== userEmail);
                    } else {
                        post.upvotes = post.upvotes.filter(user => user !== userEmail);
                    }
                }
            });

            fs.writeFile(__dirname + "/posts.json", JSON.stringify(posts, null, 2), "utf8", err => {
                if (err) return res.status(500).send("Server error");
                res.render("note-vote", { user: { email: userEmail }, posts: posts });
            });
        } catch (err) {
            res.status(500).send("Error parsing posts JSON");
        }
    });
});

// POST /downvote - Handle downvoting a post and render updated note-vote page
app.post("/downvote", (req, res) => {
    let postId = parseInt(req.body["post_id"]);
    let userEmail = req.body["user_email"];

    fs.readFile(__dirname + "/posts.json", "utf8", (err, jsonString) => {
        if (err) return res.status(500).send("Server error");

        try {
            let posts = JSON.parse(jsonString);

            posts.forEach(post => {
                if (post._id === postId) {
                    if (!post.downvotes.includes(userEmail)) {
                        post.downvotes.push(userEmail);
                        post.upvotes = post.upvotes.filter(user => user !== userEmail);
                    } else {
                        post.downvotes = post.downvotes.filter(user => user !== userEmail);
                    }
                }
            });

            fs.writeFile(__dirname + "/posts.json", JSON.stringify(posts, null, 2), "utf8", err => {
                if (err) return res.status(500).send("Server error");
                res.render("note-vote", { user: { email: userEmail }, posts: posts });
            });
        } catch (err) {
            res.status(500).send("Error parsing posts JSON");
        }
    });
});
