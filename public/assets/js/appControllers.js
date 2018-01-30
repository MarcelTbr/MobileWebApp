angular.module('nysl.controllers', []).controller('Controller1'
,function( $scope, $routeParams){

    /**
     * Writes the user's data to the database.
     */

    function writeUserData(userId, name, email, imageUrl) {

        var photoURL = imageUrl;
        if (imageUrl == null) {
            photoURL = '/assets/img/app-logo/sizes/nysl-logo-80.png';
        }

        console.info("profile_picture", photoURL);

        firebase.database().ref('users/' + userId).set({
            username: name,
            email: email,
            profile_picture: photoURL,
            photoURL: photoURL

        });
    }

    /**
     * Saves a new post to the Firebase DB.
     */

    function writeNewPost(uid, username, picture, body) {
        // A post entry.
        var postData = {
            author: username,
            uid: uid,
            body: body,
            authorPic: picture
        };

        // Get a key for a new Post.
        var newPostKey = firebase.database().ref().child('posts').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/posts/' + newPostKey] = postData;
        updates['/user-posts/' + uid + '/' + newPostKey] = postData;

        return firebase.database().ref().update(updates);
    }

        function writeNewGamePost(uid, username, picture, body, gameId) {
            // A post entry.
            var postData = {
                author: username,
                uid: uid,
                body: body,
                authorPic: picture
            };

            // Get a key for a new Post.
            var newPostKey = firebase.database().ref().child('posts').push().key;

            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/games/'+gameId+'/posts/' + newPostKey] = postData;
            updates['/games/'+gameId+'/user-posts/' + uid + '/' + newPostKey] = postData;

            return firebase.database().ref().update(updates);
        }

    /**
     * Creates a new post for the current user.
     */
    function newPostForCurrentUser(text) {

        var userId = firebase.auth().currentUser.uid;
        return firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
            var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
            // [START_EXCLUDE]

            console.info("photoURL", snapshot.val().photoURL );

            return writeNewPost(firebase.auth().currentUser.uid, username,
                snapshot.val().photoURL,
                text);
            // [END_EXCLUDE]
        });

    }

    function newPostForCurrentGameID(text, gameId){

        var userId = firebase.auth().currentUser.uid;
        return firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
            var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';

            return writeNewGamePost(firebase.auth().currentUser.uid, username,
                snapshot.val().photoURL,
                text, gameId);
        });

    }

    function createPostElement(postId, text, author, authorId, authorPic) {
        var uid = firebase.auth().currentUser.uid;

        var html =
            '<div class="post post-' + postId + ' author-' + authorId+'">' +
                '<img src="' + authorPic +'">'+
            '<b><span class="username">' + author + '</span></b><br>' +
            '<span class="text">' + text + '</span>' +
            '</div>';

        // Create the DOM element from the HTML.
        var div = document.createElement('div');
        div.innerHTML = html;
        var postElement = div.firstChild;

        return postElement;
    }

    function doDatabaseGameQueries(gameId){
        var listeningFirebaseRefs = [];
        var myUserId = firebase.auth().currentUser.uid;
        var userPostsRef = firebase.database().ref('games/' + gameId +'/posts');

        var chat = document.getElementById('chat-output');
        chat.innerHTML = '';
        var fetchPosts = function (postsRef) {
            postsRef.on('child_added', function (data) {
                var author = data.val().author || 'Anonymous';
                var containerElement = document.getElementById("chat-output");

                // containerElement.insertBefore(
                //     createPostElement(data.key, data.val().body, author, data.val().uid, data.val().authorPic)
                //     ,containerElement.firstChild);

                containerElement.appendChild(
                    createPostElement(data.key, data.val().body, author, data.val().uid, data.val().authorPic)
                    );

                var newPost = document.getElementsByClassName('post-'+data.key)[0];
                var chatOutput = document.getElementById('chat-output');
                chatOutput.scrollTo(0,newPost.offsetTop );
                stylePosts(myUserId);
            });
            postsRef.on('child_changed', function (data) {
                var containerElement = document.getElementById("chat-output");
                var postElement = containerElement.getElementsByClassName('post-' + data.key)[0];
                postElement.getElementsByClassName('username')[0].innerText = data.val().author;
                postElement.getElementsByClassName('text')[0].innerText = data.val().body;
            });
            postsRef.on('child_removed', function (data) {
                var containerElement = document.getElementById('chat-output');
                var post = containerElement.getElementsByClassName('post-' + data.key)[0];
                post.parentElement.removeChild(post);
            });
        };

        // Fetching and displaying all posts of each sections.
        fetchPosts(userPostsRef);


        // Keep track of all Firebase refs we are listening to.
        listeningFirebaseRefs.push(userPostsRef);


    }

    function stylePosts(userId){

        var posts = document.getElementsByClassName('post');
        function addClass(el, className) {
            if (el.classList) {
                el.classList.add(className)
            } else if (!hasClass(el, className)) {
                el.className += " " + className;
            }
        }
        function styleUserPosts(post){

            if( post.classList.contains('author-' + userId)) {

                addClass(post, 'user-post');

            }
        }

       for(var p = 0; p < posts.length; p++){

           styleUserPosts(posts[p]);
       }


    }

    $scope.sendMessage = function(){

            var text = $scope.message;

            if (text) {
                // newPostForCurrentUser(text).then(function () {
                // newPostForCurrentGameID(text, $routeParams.id);
                // });
                newPostForCurrentGameID(text, $routeParams.id);

                $scope.message = "";
            }

        stylePosts($scope.myUserId);

    };

    $scope.signMeOut = function(){

        firebase.auth().signOut();

    };

    $scope.signIn = function(){

        var email = $scope.user.email;
        var password = $scope.user.password;

        console.info(email, password);
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        // Sign in with email and pass.
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);

        });
        stylePosts($scope.myUserId);

    };

    $scope.signUp = function () {

        var email = $scope.user.email;
        var password = $scope.user.password;

        console.info(email, password);
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        // Sign in with email and pass.
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
        stylePosts($scope.myUserId);
    };
    $scope.load = function() {
        var splashPage = document.getElementById('splash-screen');
        var chatView = document.getElementById('chat-view');
        var currentUID;


        firebase.auth().onAuthStateChanged(function(user) {

            // ignore token refresh events.
            if (user && currentUID === user.uid || !user && currentUID === null) {
                return;
            }

            if (user) {
                currentUID = user.uid;
                $scope.myUserId =  currentUID;
                splashPage.style.display = 'none';
                chatView.style.visibility = 'visible';
                writeUserData(user.uid, user.email, user.email, user.photoURL);
                var chat = document.getElementById('chat-output');
                chat.innerHTML = '';
                doDatabaseGameQueries($routeParams.id);

            } else {
                // Set currentUID to null.
                currentUID = null;
                // Display the splash page where you can sign-in.
                splashPage.style.display = '';
                chatView.style.visibility = 'hidden';
                var chat = document.getElementById('chat-output');
                chat.innerHTML = '';
            }

        });



    }




}).controller('HomeController',function($scope){

    $scope.ScheduleData = nysl_data.matches;

    //infoAccordion
    $scope.Teams = nysl_data.teams;
            // $scope.Fields = nysl_data.teams;
    $scope.info_data = {
        "teams": false,
        "fields": false,
        "myteam": false
    };

    $scope.teams = false;
    $scope.accordionToggle = function (teams, fields, myteam) {
        $scope.info_data.teams = teams ? false : true;
        $scope.info_data.fields = fields ? false : true;
        $scope.info_data.myteam = myteam ? false : true;
    };


}).controller('ScheduleController', function($scope, $location){
    var today = new Date();

    $scope.now = today.toLocaleString();

    $scope.teamFilter = '';

    $scope.teamChange = function (teamFilter) {
        $scope.teamFilter = teamFilter;
    };
    $scope.fieldFilter = '';

    $scope.fieldChange = function (fieldFilter) {
        $scope.fieldFilter = fieldFilter;
        console.info($scope.fieldFilter);
    };

    $scope.dateFilter = '';

    $scope.dateChange = function (dateFilter) {

        if(dateFilter != undefined) {

            var date = new Date(dateFilter);
            var day = date.getDate();
            if( day < 10) { day = '0'+day; }            //console.info(day);
            var month = date.getMonth() + 1;
            if(month < 10) { month = '0'+month; }        //console.info(month);
            var year = date.getFullYear();              //console.info(year);
            var fullDate = day + "/" + month + "/" + year;
            console.info(fullDate);
            $scope.dateFilter = fullDate;
            console.info($scope.dateFilter);
        } else {

            $scope.dateFilter = '';
        }
    };

    $scope.timeFilter = '';

    $scope.timeChange = function(timeFilter) {

        if(timeFilter != undefined) {

            var date = new Date (timeFilter);

            console.info(timeFilter);
            var hrs = date.getHours();
            var mins = date.getMinutes();
            if( mins < 10){ mins = '0'+mins;}
            var time = hrs + ":" + mins;

            console.info(time);

            $scope.timeFilter = time;


        } else {

            $scope.timeFilter = '';

        }

    };

    $scope.userFilter = function(match){

        var findTeam = ($scope.teamFilter != "All") && (match.hometeam.indexOf($scope.teamFilter) != -1 || match.awayteam.indexOf($scope.teamFilter) != -1 );
        var allTeams = $scope.teamFilter == 'All';
        var allLocs = $scope.fieldFilter == 'All';

        var findLoc = match.location.indexOf($scope.fieldFilter) != -1;
        var findDate = match.date.indexOf($scope.dateFilter) != -1; //&& $scope.dateFilter != '';

        var findTime = match.time.indexOf($scope.timeFilter) != -1;

        if (findTeam && findLoc ) {

            if($scope.dateFilter != '' && $scope.dateFilter != undefined) {

                if (findDate){
                    return true;

                } else { return false}


            } else if($scope.timeFilter != '' && $scope.timeFilter != undefined) {

                if (findTime){
                    return true;

                } else { return false}


            }else { return true; }


        } else if ( allTeams && allLocs ){

            return true;
        }
        else{

            return false;
        }

    }


    $scope.nyslData = nysl_data;

    $scope.filterToggle = function (date, team, loc, time, all)  {
        $scope.filter_data.all = all ? false : true;
        $scope.filter_data.date = date ? false : true;
        $scope.filter_data.team = team ? false : true;
        $scope.filter_data.loc = loc ? false : true;
        $scope.filter_data.time = time ? false : true;
    };
    $scope.closeFilter = function (open) {
        $scope.filter_data.all = open ? false : true;
    };


    $scope.teamArray = ["All", "F.C. Barcelona", "Arsenal", "PSV Eindhoven", "Bayern Munchen"];
    $scope.locArray = ["All", "Camp Nou", "O2 Arena", "Phillips Stadion", "Allianz Arena" ];

    $scope.filter_data = {
        all: true,
        date: true,
        team: false,
        loc: false,
        time: false

    };

    $scope.Schedule = {};

    $scope.ScheduleData = nysl_data.matches;


    $scope.goToChat = function(id){

        console.info("go to chat!");


        $location.path("/chat/" +id);

        window.scrollTo(0,0);

        $scope.matchId = id;

        $scope.setMatchId(id);




    }


}).controller('GameController',function($scope, $routeParams){
    $scope.now = new Date().toLocaleString();
    $scope.nysl = nysl_data;
    $scope.matchId = "s2016m01";
    console.info("routeParams", $routeParams.id);

    if($routeParams.id != undefined) {
        $scope.matchId = $routeParams.id;
    }

    function getMatchById(match) {

        return match.matchId == $scope.matchId;

    }

    $scope.match = $scope.nysl.matches.filter(getMatchById)[0];

    function getTeamByLocation(team) {

        return team.location == $scope.match.location;
    }

    $scope.team = $scope.nysl.teams.filter(getTeamByLocation)[0];

    $scope.fcb = false;
    $scope.bayern = false;
    $scope.psv = false;
    $scope.arsenal = false;

    switch ($scope.match.location) {
        case "Camp Nou": $scope.fcb = true; break;
        case "Allianz Arena" : $scope.bayern = true; break;
        case "Phillips Stadion": $scope.psv = true; break;
        case "O2 Arena": $scope.arsenal = true; break;
        default: console.info("switch not working");
    }

    console.info($scope.match);
    console.info($scope.team);



}).controller('IndexController',  function($scope, $routeParams) {
    $scope.nysl = nysl_data;


    $scope.matchId;

    $scope.setMatchId = function(id) {

        $scope.matchId = id;

    }


});

