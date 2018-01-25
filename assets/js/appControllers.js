angular.module('nysl.controllers', []).controller('Controller1'
,function($scope){
    $scope.message="Hello, world";
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
    }


}).controller('ScheduleController', function($scope){
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
    // $scope.Schedule.date = "9.01.16";
    // $scope.Schedule.match = "U1 and U4";
    // $scope.Schedule.time = "9:30 a.m.";

    $scope.ScheduleData = nysl_data.matches;


}).controller('Controller3',function($scope){});
