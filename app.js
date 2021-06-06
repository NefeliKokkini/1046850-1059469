// requires
const express = require('express')
const mysql = require('mysql')
const exphbs = require('express-handlebars');
const path = require('path')
const bodyParser = require("body-parser"); //for reading POST data
const bcrypt = require('bcrypt'); //for hashing passwords
const cookieParser = require('cookie-parser'); //for reading cookies
var crypto = require("crypto"); //for generating tokens for login cookie
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const { Console } = require('console');

// initialize app
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

// initialize creds
const port = 2710

// DB Connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'readit',
    port: '33060'
});

connection.connect(function (err)
{
    if (err) throw err

});

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', 'hbs')

app.set('views', path.join(__dirname, '/src/views'));

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/image', express.static(__dirname + 'public/image'))
app.use('/js', express.static(__dirname + 'public/js'))


app.get('/', function (req, res)
{
    connection.query('SELECT * FROM categories', function (err, categories, fields)
    {
        connection.query('SELECT q.id,q.title,q.content,q.likes,q.comments,p.username,c.categoryName FROM posts q LEFT JOIN users p ON p.id = q.creatorID LEFT JOIN categories c ON c.id = q.categoryID ORDER BY comments DESC LIMIT 9;', function (err, trending, fields)
        {
            connection.query('SELECT q.id,q.title,q.content,q.likes,q.comments,p.username,c.categoryName FROM posts q LEFT JOIN users p ON p.id = q.creatorID LEFT JOIN categories c ON c.id = q.categoryID ORDER BY likes DESC;', function (err, top, fields)
            {
                if (req.cookies.readit_auth != undefined)
                {
                    connection.query('SELECT * FROM auth_tokens WHERE token = ? AND expired = 0', [req.cookies.readit_auth], function (err, token, fields)
                    {
                        if (token.length > 0)
                        {
                            if (token)
                            {
                                connection.query('SELECT username from users WHERE id = ?', [token[0].userID], function (err, user, fields)
                                {
                                    let a_categories = categories;
                                    return res.render('front-page', { categories, trending, top, a_categories, loggedin: user[0].username })
                                })
                            }
                            else
                            {
                                let a_categories = categories;
                                return res.render('front-page', { categories, trending, top, a_categories })
                            }
                        }
                        else
                        {
                            let a_categories = categories;
                            return res.render('front-page', { categories, trending, top, a_categories })
                        }
                    })
                }
                else
                {
                    let a_categories = categories;
                    return res.render('front-page', { categories, trending, top, a_categories })
                }
            });
        });
    });
})

//Get requests
app.get('/categories', function (req, res)
{
    connection.query('SELECT cat.id,cat.categoryName,cat.info,cat.creatorID,cat.subscriptions,cat.posts,us.username FROM categories cat LEFT JOIN users us ON cat.creatorID = us.id', function (err, categories, fields)
    {
        if (err) throw err
        connection.query('SELECT * FROM categories', function (err, a_categories, fields)
        {
            if (req.cookies.readit_auth != undefined)
            {
                connection.query('SELECT * FROM auth_tokens WHERE token = ? AND expired = 0', [req.cookies.readit_auth], function (err, token, fields)
                {
                    if (token.length > 0)
                    {
                        if (token)
                        {
                            connection.query('SELECT username from users WHERE id = ?', [token[0].userID], function (err, user, fields)
                            {
                                connection.query('SELECT s.categoryID as cat_id , c.categoryName as cat_name FROM subscriptions s LEFT JOIN categories c on c.id = s.categoryID LEFT JOIN users u on u.id = s.userID WHERE u.id = ?', [token[0].userID], function (err, subCat, fields)
                                {
                                    return res.render('categories', { subCat , categories, a_categories, loggedin: user[0].username});
                                })
                            })
                        }
                        else
                            return res.render('categories', { categories, a_categories });
                    }
                    else
                        return res.render('categories', { categories, a_categories });
                })
            }
            else
                return res.render('categories', { categories, a_categories });
        })
    });
})

app.get('/getallsubs',function(req,res){
    if (req.cookies.readit_auth != undefined)
    {
        connection.query('SELECT * FROM auth_tokens WHERE token = ? AND expired = 0', [req.cookies.readit_auth], function (err, token, fields)
        {
            connection.query('SELECT distinct categoryName FROM categories join subscriptions on categories.id = subscriptions.categoryID join users on subscriptions.userID = users.id where users.id = ?;',token[0].userID, function (err, user, fields)
            {
            res.send(user);
            })
        })
    }
})

app.get('/category', function (req, res)
{
    const catid = req.query.id;

    connection.query('SELECT cat.id as catID,cat.categoryName,cat.subscriptions,cat.posts,cat.info, p.id,p.title,p.content,p.likes,p.comments, u.username FROM categories cat LEFT JOIN posts p ON p.categoryID = cat.id JOIN users u ON u.id = p.creatorID WHERE cat.id = ?', [catid], function (err, posts, fields)
    {
        connection.query('SELECT * FROM categories', function (err, a_categories, fields)
        {
            if (req.cookies.readit_auth != undefined)
            {
                connection.query('SELECT * FROM auth_tokens WHERE token = ? AND expired = 0', [req.cookies.readit_auth], function (err, token, fields)
                {
                    if (token.length > 0)
                    {
                        if (token)
                        {
                            connection.query('SELECT username from users WHERE id = ?', [token[0].userID], function (err, user, fields)
                            {
                                //check if user is subscribed
                                connection.query('SELECT id from subscriptions where categoryID = ? AND userID = ?', [catid, token[0].userID], function (err, subbed, fields)
                                {
                                    if (subbed.length > 0)
                                        return res.render("category", { posts, a_categories, loggedin: user[0].username, subBtn: "Unsubscribe" });
                                    else
                                        return res.render("category", { posts, a_categories, loggedin: user[0].username, subBtn: "Subscribe" });
                                })
                            })
                        }
                        else
                            return res.render("category", { posts, a_categories });
                    }
                    else
                        return res.render("category", { posts, a_categories });
                })
            }
            else
                return res.render("category", { posts, a_categories });
        })

    })
})


app.get('/posts', function (req, res)
{
    const postid = req.query.id;
    connection.query('SELECT * FROM categories', function (err, a_categories, fields)
    {
        connection.query('SELECT q.id,q.title,q.content,q.likes,q.comments,p.username,q.creatorID,c.categoryName,c.posts as catposts , c.subscriptions as catsubs, c.id as catid ,c.info as catinfo , com.content as comCon,com.creatorID as comCreator,us.username as commentUsername,  com.date as comDate FROM posts q LEFT JOIN users p ON p.id = q.creatorID LEFT JOIN categories c ON c.id = q.categoryID LEFT JOIN comments com ON q.id = com.postID LEFT JOIN users us ON com.creatorID = us.ID WHERE q.id = ?', [postid], function (err, post, fields)
        {
            //check if user is logged in
            if (req.cookies.readit_auth != undefined)
            {
                //might be logged in, cookie found
                connection.query('SELECT * FROM auth_tokens WHERE token = ? AND expired = 0', [req.cookies.readit_auth], function (err, token, fields)
                {
                    if (token.length > 0)
                    {
                        if (token)
                        {
                            connection.query('SELECT username from users WHERE id = ?', [token[0].userID], function (err, user, fields)
                            {
                                //check if user is subscribed
                                connection.query('SELECT id from subscriptions where categoryID = ? AND userID = ?', [post[0].catid, token[0].userID], function (err, subbed, fields)
                                {
                                    let subButton;
                                    if (subbed.length > 0)
                                        subButton = "Unsubscribe";
                                    else
                                        subButton = "Subscribe";

                                    //user is logged in, verify if the user is the creator
                                    if (token[0].userID == post[0].creatorID)
                                    {
                                        //user is the creator
                                        return res.render("posts", { post, canlike: false, creator: true, a_categories, loggedin: user[0].username, subBtn: subButton });
                                    }
                                    else
                                    {
                                        //user is not the creator
                                        //check if user liked the post already
                                        connection.query('SELECT * from likes where postID = ? AND userID = ?', [postid, token[0].userID], function (err, liked, fields)
                                        {
                                            if (liked.length > 0)
                                            {
                                                res.render("posts", { post, canlike: true, likeBtn: "Dislike", a_categories, loggedin: user[0].username, subBtn: subButton });
                                                return;
                                            }
                                            return res.render("posts", { post, canlike: true, likeBtn: "Like", a_categories, loggedin: user[0].username, subBtn: subButton });
                                        })
                                    }
                                })
                            })

                        } else
                            return res.render("posts", { post, canlike: false, a_categories });
                    }
                    else
                        return res.render("posts", { post, canlike: false, a_categories });
                });
            }
            else
            {
                //user not logged in
                return res.render("posts", { post, canlike: false, a_categories });
            }
        });
    });
})

app.get('/subscribe', function (req, res)
{
    const categoryID = req.query.id;
    //check if user is logged in
    if (req.cookies.readit_auth != undefined)
    {
        connection.query('SELECT subscriptions from categories WHERE id = ?', [categoryID], function (err, category, fields)
        {
            connection.query('SELECT * FROM auth_tokens WHERE token = ? AND expired = 0', [req.cookies.readit_auth], function (err, token, fields)
            {
                if (token.length > 0)
                {
                    if (token)
                    {
                        //user is logged in
                        //perform sub/unsub
                        connection.query('SELECT * from subscriptions where categoryID = ? AND userID = ?', [categoryID, token[0].userID], function (err, subs, fields)
                        {
                            if (subs.length > 0)
                            {
                                if (subs)
                                {
                                    //unsub
                                    connection.query('DELETE from subscriptions where categoryID = ? AND userID = ?', [categoryID, token[0].userID], function (err, s2, fields)
                                    {
                                        let newSubcount = category[0].subscriptions - 1;
                                        connection.query('UPDATE categories SET subscriptions = ? where id = ?', [newSubcount, categoryID], function (err, newCat, fields)
                                        {
                                            return res.redirect("/category?id=" + categoryID);
                                        });
                                    });
                                }
                            }
                            else
                            {
                                //sub
                                const subDate = new Date(Date.now());
                                connection.query('INSERT INTO subscriptions VALUES(NULL,?,?,?)', [token[0].userID, categoryID, subDate], function (err, newCat, fields)
                                {

                                    let newSubcount = category[0].subscriptions + 1;
                                    connection.query('UPDATE categories SET subscriptions = ? where id = ?', [newSubcount, categoryID], function (err, newCat2, fields)
                                    {
                                        return res.redirect("/category?id=" + categoryID);
                                    });
                                });
                            }
                        })
                    }
                }
            })
        })
    }
    else
    {

    }
})

app.get('/register', function (req, res)
{
    connection.query('SELECT * FROM categories', function (err, a_categories, fields)
    {
        res.redirect("/login", { a_categories });
    })
})

app.get('/login', function (req, res)
{
    if (req.cookies.readit_auth != undefined)
    {
        //auth token found
        connection.query('SELECT * FROM auth_tokens WHERE token = ? AND expired = 0', [req.cookies.readit_auth], function (err, token, fields)
        {
            if (err) throw err;

            if (token.length > 0)
            {
                if (token)
                {
                    //token verified in database
                    //check if token is expired
                    if (token[0].expireDate <= new Date(Date.now()))
                    {
                        //token is expired
                        //update expired flag
                        connection.query('UPDATE auth_tokens SET expired = 1 WHERE id = ?', [token[0].id], function (err, results,)
                        {
                            return res.redirect('/login')
                        })
                    }
                    else
                        return res.redirect('/')
                } else
                    res.render('login-signup')
            }
            else
                res.render('login-signup')
        })
    }
    else
    {
        res.render('login-signup')
    }
})

app.get('/like', function (req, res)
{
    const postid = req.query.id;

    //check if user is logged in
    if (req.cookies.readit_auth != undefined)
    {
        connection.query('SELECT creatorID,likes from posts WHERE id = ?', [postid], function (err, post, fields)
        {
            connection.query('SELECT * FROM auth_tokens WHERE token = ? AND expired = 0', [req.cookies.readit_auth], function (err, token, fields)
            {
                if (token.length > 0)
                {
                    if (token)
                    {
                        //token verified
                        if (token[0].userID == post[0].creatorID)
                        {
                            //user is the creator, can not like
                            return res.send("You can not like your own post...duh");
                        }
                        else
                        {
                            //perform like/dislike
                            //check if user already liked
                            connection.query('SELECT * from likes where postID = ? AND userID = ?', [postid, token[0].userID], function (err, liked, fields)
                            {
                                if (liked.length > 0)
                                {
                                    //dislike
                                    connection.query('DELETE from likes where postID = ? AND userID = ?', [postid, token[0].userID], function (err, l2, fields)
                                    {
                                        let decreasedLikes = post[0].likes - 1;
                                        connection.query('UPDATE posts SET likes = ? where id = ?', [decreasedLikes, postid], function (err, newPost, fields)
                                        {
                                            return res.redirect("/posts?id=" + postid);
                                        });
                                    });
                                }
                                else
                                {
                                    //like
                                    const likedDate = new Date(Date.now());
                                    connection.query('INSERT INTO likes VALUES(NULL,?,?,?)', [postid, token[0].userID, likedDate], function (err, newLikes, fields)
                                    {
                                        let increasedLikes = post[0].likes + 1;
                                        connection.query('UPDATE posts SET likes = ? where id = ?', [increasedLikes, postid], function (err, newPost, fields)
                                        {
                                            return res.redirect("/posts?id=" + postid);
                                        });
                                    });
                                }
                            })
                        }
                    }
                    else
                    {
                        //user is not logged in
                        return res.send("Login to like! <a href=\"/login\">Click here</a>");
                    }
                }
                else
                {
                    //user is not logged in
                    return res.send("Login to like! <a href=\"/login\">Click here</a>");
                }
            })
        })
    }
    else
    {
        //user is not logged in
        return res.send("Login to like! <a href=\"/login\">Click here</a>");
    }
})

app.get('/profile', function (req, res)
{
    if (req.cookies.readit_auth != undefined)
    {
        connection.query('SELECT * FROM auth_tokens WHERE token = ? AND expired = 0', [req.cookies.readit_auth], function (err, token, fields)
        {
            if (token.length > 0)
            {
                if (token)
                {
                    connection.query('SELECT * FROM users WHERE id = ?', [token[0].userID], function (err, user, fields)
                    {
                        connection.query('SELECT COUNT(id) as subs from subscriptions where userID = ?', [token[0].userID], function (err, subscriptions, fields)
                        {
                            connection.query('SELECT COUNT(id) as postCount from posts where creatorID = ?', [token[0].userID], function (err, posts, fields)
                            {
                                connection.query('SELECT * FROM categories', function (err, a_categories, fields)
                                {
                                    return res.render("profile", { user, subscriptions, posts, loggedin: user[0].username, a_categories })
                                })
                            })
                        })
                    })
                }
                else
                {
                    return res.send("Login to like! <a href=\"/login\">Click here</a>");
                }
            }
            else
            {
                return res.send("Login to like! <a href=\"/login\">Click here</a>");
            }
        })
    }
    else
    {
        //user is not logged in
        return res.send("Login to like! <a href=\"/login\">Click here</a>");
    }
})

app.get('/logout', function (requestini, responsini)
{
    //verify if user is logged in
    if (requestini.cookies.readit_auth != undefined)
    {
        connection.query('SELECT * FROM auth_tokens WHERE token = ? AND expired = 0', [requestini.cookies.readit_auth], function (err, token, fields)
        {
            if (token.length > 0)
            {
                if (token)
                {
                    connection.query('UPDATE auth_tokens SET expired = 1 WHERE id = ?', [token[0].id], function (err, results,)
                    {
                        return responsini.redirect('/login')
                    })
                }
                else
                {
                    return responsini.redirect('/')
                }
            }
            else
            {
                return responsini.redirect('/')
            }
        })
    }
})

app.get("/contact-us", function(req, res) {
    res.render("contact-us")
})

app.get('/search', function (req, res)
{
    const search = req.query.search;

    connection.query("SELECT p.id,p.title,p.content,p.likes,p.comments,p.categoryID,p.createdDate, u.username, c.categoryName from posts p LEFT JOIN users u ON u.id = p.creatorID LEFT JOIN categories c ON c.id = p.categoryID WHERE p.title LIKE ? ", ['%' + search + '%'], function (err, posts, fields)
    {
        connection.query('SELECT * FROM categories', function (err, a_categories, fields)
        {
            if (req.cookies.readit_auth != undefined)
            {
                connection.query('SELECT * FROM auth_tokens WHERE token = ? AND expired = 0', [req.cookies.readit_auth], function (err, token, fields)
                {
                    if (token.length > 0)
                    {
                        if (token)
                        {
                            connection.query('SELECT username from users WHERE id = ?', [token[0].userID], function (err, user, fields)
                            {
                                return res.render("search-results", { posts, a_categories, loggedin: user[0].username});
                            })
                        }
                        else
                            return res.render("search-results", { posts, a_categories });
                    }
                    else
                        return res.render("search-results", { posts, a_categories });
                })
            }
            else
                return res.render("search-results", { posts, a_categories });
        })

    })
})

//Post Requests
app.post('/login', function (req, res)
{
    console.log("POST: login request..");

    connection.query('SELECT * FROM users WHERE username = ?', [req.body.username], function (err, user, fields)
    {
        if (user.length > 0)
        {
            if (user[0])
            {
                if (err) throw err;

                bcrypt.compare(req.body.password, user[0].password, function (err, result)
                {
                    if (result)
                    {
                        console.log("Logged In");
                        var authToken = crypto.randomBytes(20).toString('hex');
                        var expireDate = new Date(Date.now() + 90000000);
                        connection.query('INSERT INTO auth_tokens VALUES(NULL,?,?,0,?)', [user[0].id, authToken, expireDate], function (err, results,)
                        {
                            res.cookie('readit_auth', authToken, { expires: expireDate });
                            res.redirect("/");
                        })
                    }
                    else
                    {
                        res.render("login-signup", { displayError: true, error: "Invalid credentials!" })
                    }
                });
            }
            else
                res.render("login-signup", { displayError: true, error: "Invalid credentials!" })
        }
        else
            res.render("login-signup", { displayError: true, error: "Invalid credentials!" })
    });

})

app.post("/register", function (req, res)
{
    console.log("POST: register request..");

    //validate data
    if (req.body.email == "" || req.body.password == "" || req.body.username == "")
        return res.render("login-signup", { displayError: true, error: "One or more fields where empty!" });

    if (req.body.password != req.body.con_password)
        return res.render("login-signup", { displayError: true, error: "Passwords don't match!" });

    //hash password
    bcrypt.genSalt(10, function (err, salt)
    {
        bcrypt.hash(req.body.password, salt, function (err, hash)
        {
            connection.query('INSERT INTO users VALUES(NULL,?,?,?,?,?,?)', [req.body.firstname, req.body.lastname, req.body.username, hash, req.body.bday, req.body.email], function (err, user, fields)
            {
                console.log("Account created!");
                res.redirect("/login");
            });
        });
    });
})

app.post("/comment", function (req, res)
{
    console.log("POST: submit comment request..");

    //verify if user is logged in
    if (req.cookies.readit_auth != undefined)
    {
        connection.query('SELECT * FROM auth_tokens WHERE token = ? AND expired = 0', [req.cookies.readit_auth], function (err, token, fields)
        {
            if (token.length > 0)
            {
                if (token)
                {
                    //user is logged in
                    if (req.body.commentContent == "")
                    {
                        return res.send("Comment can not be empty");
                    }

                    var currentDate = new Date(Date.now());
                    connection.query('INSERT INTO comments VALUES(NULL,?,0,?,?,?)', [req.body.commentContent, currentDate, token[0].userID, req.body.postid], function (err, user, fields)
                    {
                        connection.query('SELECT comments from posts WHERE id = ?', [req.body.postid], function (err, post, fields)
                        {
                            let increasedComments = post[0].comments + 1;
                            connection.query('UPDATE posts SET comments = ? WHERE id = ?', [increasedComments, req.body.postid], function (err, post, fields)
                            {
                                return res.redirect("/posts?id=" + req.body.postid);
                            })
                        })
                    })
                }
                else
                    return res.send("Login to comment! <a href=\"/login\">Click here</a>");
            }
            else
                return res.send("Login to comment! <a href=\"/login\">Click here</a>");
        })
    } else
        return res.send("Login to comment! <a href=\"/login\">Click here</a>");
})

app.post('/createPost', function (req, res)
{
    console.log("POST: submit create post request..");
    //verify if user is logged in
    if (req.cookies.readit_auth != undefined)
    {
        connection.query('SELECT * FROM auth_tokens WHERE token = ? AND expired = 0', [req.cookies.readit_auth], function (err, token, fields)
        {
            if (token.length > 0)
            {
                if (token)
                {
                    //user is logged in
                    if (req.body.c_posts == "" || req.body.title == "")
                    {
                        return res.send("Post can not be empty");
                    }
                    var currentDate = new Date(Date.now());
                    connection.query('INSERT INTO posts VALUES(NULL,?,?,0,0,?,?,?)', [req.body.title, req.body.c_posts, req.body.post_category, token[0].userID, currentDate], function (err, newpost, fields)
                    {
                        connection.query('SELECT posts from categories WHERE id = ?', [req.body.post_category], function (err, cat, fields)
                        {
                            let increasedPosts = cat[0].posts + 1;
                            connection.query('UPDATE categories SET posts = ? WHERE id = ?', [increasedPosts, req.body.post_category], function (err, updatedCat, fields)
                            {
                                return res.redirect("/posts?id=" + newpost.insertId);
                            })
                        })
                    })
                }
                else
                    return res.send("Login to comment! <a href=\"/login\">Click here</a>");
            }
            else
                return res.send("Login to comment! <a href=\"/login\">Click here</a>");
        })
    }
    else
        return res.send("Login to comment! <a href=\"/login\">Click here</a>");
})

app.post("/changeProfile", function (req, res)
{
    console.log("POST: change profile post request..");

    //verify if user is logged in
    if (req.cookies.readit_auth != undefined)
    {
        connection.query('SELECT * FROM auth_tokens WHERE token = ? AND expired = 0', [req.cookies.readit_auth], function (err, token, fields)
        {
            if (token.length > 0)
            {
                if (token)
                {
                    //user is logged in

                    if (req.body.username != undefined)
                    {
                        connection.query("UPDATE users SET username = ? WHERE id = ? ", [req.body.username, token[0].userID], function ()
                        {
                            return res.redirect("/profile")
                        })
                    }
                    else if (req.body.fname != undefined)
                    {
                        connection.query("UPDATE users SET firstName = ? WHERE id = ? ", [req.body.fname, token[0].userID], function ()
                        {
                            return res.redirect("/profile")
                        })
                    }
                    else if (req.body.lname != undefined)
                    {
                        connection.query("UPDATE users SET lastName = ? WHERE id = ? ", [req.body.lname, token[0].userID], function ()
                        {
                            return res.redirect("/profile")
                        })
                    }
                    else if (req.body.email != undefined)
                    {
                        connection.query("UPDATE users SET email = ? WHERE id = ? ", [req.body.email, token[0].userID], function ()
                        {
                            return res.redirect("/profile")
                        })
                    }
                    else if (req.body.password != undefined)
                    {
                        //hash password
                        bcrypt.genSalt(10, function (err, salt)
                        {
                            bcrypt.hash(req.body.password, salt, function (err, hash)
                            {
                                console.log(hash)
                                connection.query('UPDATE users SET password = ? WHERE id = ? ', [hash, token[0].userID], function (err, user, fields)
                                {
                                    console.log("Password changed!");
                                    res.redirect("/profile");
                                });
                            });
                        });
                    }
                    else
                    {
                        return res.send("Login to comment! <a href=\"/login\">Click here</a>");
                    }

                } else
                    return res.send("Login to comment! <a href=\"/login\">Click here</a>");
            }
            else
                return res.send("Login to comment! <a href=\"/login\">Click here</a>");
        })
    }
    else
        return res.send("Login to comment! <a href=\"/login\">Click here</a>");
})


const publishOnline = true;

if (publishOnline)
{
    const localtunnel = require('localtunnel');

    (async () =>
    {
        const tunnel = await localtunnel({ port: 2710, subdomain: "readit-forum-upatras" });
        console.log("Online at: " + tunnel.url);
        tunnel.url;
    })();
}

app.listen(port, () => console.log(`Listening on port ${port}`))
