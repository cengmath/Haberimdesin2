﻿var HaberimdesinApp = angular.module('Haberimdesin', []);


//Controllers
var habersOfUser = null;
var habers = null;
var lastNew = null;
var last2News = null;
var last3News = null;
var updatedLikes = false;
var haberLikes = null;
var commentLikes = null;
var haberDislikes = null;
var commentDislikes = null;
var activeUserID = null;
var activeUser = null;
var haberToEdit = null;
var longitude = 0;
var latitude = 0;

function geoFindMe() {
    if (longitude != 0 || latitude != 0) return;
    if (!navigator.geolocation){
        alert("Geolocation is not supported by your browser!");
        return;
    }

    function success(position) {
        latitude  = position.coords.latitude;
        longitude = position.coords.longitude;
        //alert("Latitude is ' "+ latitude + "'° <br>Longitude is '" + longitude + "'°");
    }

    function error() {
        latitude = 9999;
        longitude = 9999;
        alert("Unable to retrieve your location");
    }
    navigator.geolocation.getCurrentPosition(success, error);
}


HaberimdesinApp.controller('News', ['$scope', '$http', '$location', function ($scope, $http, $location) {


    
    $scope.distance = 50;
    geoFindMe();
    $scope.getNewsDetail = function (id) {
        window.scrollTo(0, 0);
        var url = "/haberimdesin/getNewsDetail/" + id;
        $http.get(url).success(function (re) {
            habers = null;

            $scope.lastNew = null;
            $scope.last2News = null;
            $scope.activeHaber = re.newsList;
            $scope.yorumcular = re.userList.reverse();
            $scope.yorumlar = re.yorumList.reverse();

            $location.url('?hID=' + $scope.activeHaber[0].haberID);

        }).error(function (err) { console.log(err); });
    };
    $scope.initURL = function () {
        var url = window.location.href;
        var index = url.indexOf('?');
        var getstring = url.substring(index + 1, url.length);
        var parameters = getstring.split("&");
        for (var i = 0; i < parameters.length; i++) {
            var splittedParameters = parameters[i].split("=");
            if (splittedParameters[0] == "hID")
                $scope.getNewsDetail(splittedParameters[1]);
        }

    };
    $scope.initURL();
    $scope.activeHaber = null;
    $scope.getUser = function () {
        return activeUser;

    }
    $scope.getUserID = function () {
        return activeUserID;
    };
    $scope.last3News = function () {
        return last3News;
    };
    $scope.last2News = function () {
        return last2News;
    };



    $scope.lastNew = function () {


        


        return lastNew;


    };

    $scope.haberToEdit = function () {
        return haberToEdit;
    };
    $scope.habersOfUser = function () {
        return habersOfUser;
    };
    $scope.updateDistanceLimit = function (val) {
        $scope.distance = val;
    };

    $scope.getHaberLikesOf = function (id) {
        var usrName = "@HttpContext.Current.User.Identity.Name";
        if (haberLikes.has(id))
            return haberLikes.get(id).length;
        else return 0;
    };
    $scope.getHaberDislikesOf = function (id) {
        if (haberDislikes.has(id))
            return haberDislikes.get(id).length;
        else return 0;
    };
    $scope.getCommentDislikesOf = function (id) {
        if (commentDislikes.has(id))
            return commentDislikes.get(id).length;
        else return 0;
    };
    $scope.getCommentLikesOf = function (id) {
        if (commentLikes.has(id))
            return commentLikes.get(id).length;
        else return 0;
    };
    $http.get('/haberimdesin/getCategories').success(function (res) {
        $scope.categories = res.categories;
    }).error(function (err) {
        console.log(err);
    });
    $scope.updateUser = function () {

        var url = "/haberimdesin/getUserDetail/" + activeUserID;
        $http.get(url).success(function (re) {
            activeUser = re.user;

        }).error(function (err) { console.log(err); });
    };
    $scope.updateUserID = function () {
        var url = "/haberimdesin/getUserID";
        $http.get(url).success(function (re) {
            activeUserID = re.usID;
            $scope.updateHabersOfUser();
            $scope.updateUser();

        }).error(function (err) { console.log(err); });
    };
    $scope.getAllNews = function () {
        var url = "/haberimdesin/getAllNews";
        $http.get(url).success(function (re) {

            habers = re.newsList.reverse();
            lastNew = habers[0];
            last2News = habers.slice(1, 3);
            last3News = habers.slice(0, 3);
            $scope.activeHaber = null;
        }).error(function (err) { console.log(err); });
    };
    
    $scope.updateHaberLikes = function () {
        if (updatedLikes) return;
        updatedLikes = true;

        haberLikes = new Map;
        haberDislikes = new Map;
        commentLikes = new Map;
        commentDislikes = new Map;

        var url = "/haberimdesin/getAllHaberLikes";
        $http.get(url).success(function (re) {

            for (i = 0; i < re.haberLikeList.length; i++) {
                var id = re.haberLikeList[i].haberID;
                if (haberLikes.has(id) === false)
                    haberLikes.set(id, []);
                var value = haberLikes.get(id);
                value.push(re.haberLikeList[i].userID);
                haberLikes.set(id, value);
            }
        }).error(function (err) { console.log(err); });


        url = "/haberimdesin/getAllHaberDislikes";
        $http.get(url).success(function (re) {

            for (i = 0; i < re.haberDislikeList.length; i++) {
                var id = re.haberDislikeList[i].haberID;
                if (haberDislikes.has(id) === false)
                    haberDislikes.set(id, []);
                var value = haberDislikes.get(id);
                value.push(re.haberDislikeList[i].userID);
                haberDislikes.set(id, value);
            }
        }).error(function (err) { console.log(err); });


        url = "/haberimdesin/getAllCommentLikes";
        $http.get(url).success(function (re) {

            for (i = 0; i < re.commentLikeList.length; i++) {
                var id = re.commentLikeList[i].commentID;
                if (commentLikes.has(id) === false)
                    commentLikes.set(id, []);
                var value = commentLikes.get(id);
                value.push(re.commentLikeList[i].userID);
                commentLikes.set(id, value);
            }
        }).error(function (err) { console.log(err); });

        url = "/haberimdesin/getAllCommentDislikes";
        $http.get(url).success(function (re) {

            for (i = 0; i < re.commentDislikeList.length; i++) {
                var id = re.commentDislikeList[i].commentID;
                if (commentDislikes.has(id) === false)
                    commentDislikes.set(id, []);
                var value = commentDislikes.get(id);
                value.push(re.commentDislikeList[i].userID);
                commentDislikes.set(id, value);
            }
        }).error(function (err) { console.log(err); });
    };
    $scope.getAllNews();
    $scope.updateHaberLikes();
    $scope.updateUserID();


    $scope.getProfileImage = function (user) {
        if (user.profileImgURL == null) {
         
           return "Deneme/images/4.jpg";
        }
        else {
            return user.profileImgURL;
        }

    }
    
    $scope.habers = function () {
        if (habers === null) return;
        var habersWithDistance = habers.slice(0);

        for (i = habersWithDistance.length - 1; i >= 0; i--) {
            var lat = habersWithDistance[i].latitude;
            var lon = habersWithDistance[i].longitude;
            var theta = longitude - lon;
            var dist = Math.sin(latitude * (Math.PI / 180)) * Math.sin(lat * (Math.PI / 180)) + Math.cos(latitude * (Math.PI / 180)) * Math.cos(lat * (Math.PI / 180)) * Math.cos(theta * (Math.PI / 180));
            dist = Math.acos(dist);
            dist = dist * (180 / Math.PI);
            dist = dist * 60 * 1.1515;
            
            if (dist > $scope.distance) {
                habersWithDistance.splice(i,1);
            }

        }

        return habersWithDistance;
    };
    $scope.goHomePage = function () {
        window.location.assign('/Home/Index');
        return;
    };
    $scope.updateHabersOfUser = function () {

        var url = "/haberimdesin/getNewsByUserID/" + activeUserID;
        $http.get(url).success(function (re) {
            habersOfUser = re.newsList.reverse();


        }).error(function (err) { console.log(err); });
    };
    $scope.deneme = function () {
        alert('Mesajınız başarılı bir şekilde bize ulaştı :)');

        window.location.assign('/Home/Contact');
    }
    $scope.sifreUnut = function (email) {
        console.log(email);
        var fd = new FormData();
        fd.append("email", email);
        $http.post('/Haberimdesin/sendEmail', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (response) {
            alert('Lütfen mail gelen kutunuzu kontrol ediniz.');
        }).error(function (err) {
            console.log(err);
            alert('Bağlantı problemleri yaşandı.');
        });

       
        /*
        var deneme = $scope.email;
        var link = "mailto:"+ deneme + "?subject=New%20email " + "deneme"
             + "&body=" + escape("122"); 
     
        console.log(deneme);
        */
       //window.location.assign('/Account/Login');
    }

    $scope.getNewsByCategory = function (id) {


        var url = "/haberimdesin/getNewsByID/" + id;
        $http.get(url).success(function (re) {

            last2News = null;
            lastNew = null;
            habers = re.haberList.reverse();
            $scope.activeHaber = null;
        }).error(function (err) { console.log(err); });

    };
    $scope.changeCategory = function (newID) {
        console.log(newID);
        haberToEdit.categoryID = newID;
    };
    $scope.updateHaber = function () {
        var fd = new FormData();
        fd.append("id", haberToEdit.haberID);
        fd.append("title", haberToEdit.title);
        fd.append("detail", haberToEdit.detail);
        fd.append("headline", haberToEdit.headLine);
        fd.append("categoryID", haberToEdit.categoryID);
        $http.post('/Haberimdesin/UpdateHaber', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (response) {
            haberToEdit = null;
        }).error(function (err) {
            console.log(err);
        });
    };
    $scope.likeComment = function (id) {

        for (var i = 0; commentLikes.has(id) && i < commentLikes.get(id).length; i++) {
            if (commentLikes.get(id)[i] === activeUserID) {
                $scope.cancelLikeComment(id);
                return;
            }
        }
        for (i = 0; commentDislikes.has(id) && i < commentDislikes.get(id).length; i++) {
            if (commentDislikes.get(id)[i] === activeUserID) $scope.cancelDislikeComment(id);
        }

        var fd = new FormData();
        fd.append('id', id);
        $http.post('/Haberimdesin/LikeComment', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (response) {
            if (commentLikes.has(id) === false)
                commentLikes.set(id, []);
            var val = commentLikes.get(id);
            val.push(activeUserID);
            commentLikes.set(id, val);
        }).error(function (err) {
            console.log(err);
        });

    };
    $scope.dislikeComment = function (id) {


        for (i = 0; commentLikes.has(id) && i < commentLikes.get(id).length; i++) {
            if (commentLikes.get(id)[i] === activeUserID) $scope.cancelLikeComment(id);
        }
        for (i = 0; commentDislikes.has(id) && i < commentDislikes.get(id).length; i++) {
            if (commentDislikes.get(id)[i] === activeUserID) {
                $scope.cancelDislikeComment(id);
                return;
            }
        }

        var fd = new FormData();
        fd.append('id', id);
        $http.post('/Haberimdesin/DislikeComment', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (response) {
            if (commentDislikes.has(id) === false)
                commentDislikes.set(id, []);
            var val = commentDislikes.get(id);
            val.push(activeUserID);
            commentDislikes.set(id, val);
        }).error(function (err) {
            console.log(err);
        });

    };
    $scope.cancelLikeComment = function (id) {




        var fd = new FormData();
        fd.append('id', id);
        $http.post('/Haberimdesin/CancelLikeComment', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (response) {
            if (commentLikes.has(id) === true) {
                var val = commentLikes.get(id);
                val.pop(activeUserID);
                commentLikes.set(id, val);
            }
        }).error(function (err) {
            console.log(err);
        });

    };
    $scope.cancelDislikeComment = function (id) {




        var fd = new FormData();
        fd.append('id', id);
        $http.post('/Haberimdesin/CancelDislikeComment', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (response) {
            if (commentDislikes.has(id) === true) {
                var val = commentDislikes.get(id);
                val.pop(activeUserID);
                commentDislikes.set(id, val);
            }
        }).error(function (err) {
            console.log(err);
        });

    };
   
    $scope.cancelDislikeNews = function () {
        var id = $scope.activeHaber[0].haberID;
        var fd = new FormData();
        fd.append('HaberId', $scope.activeHaber[0].haberID);
        fd.append('UserId', activeUserID);
        $http.post('/Haberimdesin/CancelDislikeNews', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (response) {
            if (haberDislikes.has(id) === true) {
                var val = haberDislikes.get(id);
                val.pop(activeUserID);
                haberDislikes.set(id, val);
            }
        }).error(function (err) {
            console.log(err);
        });
    };

    $scope.cancelLikeNews = function () {
        var id = $scope.activeHaber[0].haberID;
        var fd = new FormData();
        fd.append('HaberId', $scope.activeHaber[0].haberID);
        fd.append('UserId', activeUserID);
        $http.post('/Haberimdesin/CancelLikeNews', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (response) {
            if (haberLikes.has(id) === true) {
                var val = haberLikes.get(id);
                val.pop(activeUserID);
                haberLikes.set(id, val);
            }
        }).error(function (err) {
            console.log(err);
        });

    };
    $scope.editNews = function (haber) {


        haberToEdit = haber;

    };
    $scope.cancelNews = function (id) {


        var r = confirm("Haberinizi silmek istediğinizden emin misiniz?");
        if (r == true) {
            var fd = new FormData();
            fd.append('id', id);
            $http.post('/Haberimdesin/CancelHaberById', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).success(function (response) {
                haberToEdit = null;
                $scope.updateHabersOfUser();
            }).error(function (err) {
                console.log(err);
            });
        } else {
            
        }

      

    };

    $scope.likeNews = function () {
        var id = $scope.activeHaber[0].haberID;

        for (i = 0; haberLikes.has(id) && i < haberLikes.get(id).length; i++) {
            if (haberLikes.get(id)[i] === activeUserID) {
                $scope.cancelLikeNews();
                return;
            }
        }
        for (i = 0; haberDislikes.has(id) && i < haberDislikes.get(id).length; i++) {
            if (haberDislikes.get(id)[i] === activeUserID) $scope.cancelDislikeNews();
        }
        var fd = new FormData();
        fd.append('HaberId', $scope.activeHaber[0].haberID);
        fd.append('UserId', activeUserID);
        $http.post('/Haberimdesin/LikeNews', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (response) {
            if (haberLikes.has(id) === false)
                haberLikes.set(id, []);
            var val = haberLikes.get(id);
            val.push(activeUserID);
            haberLikes.set(id, val);
        }).error(function (err) {
            console.log(err);
        });

    };
    $http.get('/haberimdesin/getCategories').success(function (res) {
        //console.log(res);
        $scope.data = {
            model: null,
            availableOptions: res.categories
        };

    }).error(function (err) { console.log(err); });
    $scope.dislikeNews = function () {

        var id = $scope.activeHaber[0].haberID;

        for (i = 0; haberLikes.has(id) && i < haberLikes.get(id).length; i++) {
            if (haberLikes.get(id)[i] === activeUserID) $scope.cancelLikeNews();
        }
        for (i = 0; haberDislikes.has(id) && i < haberDislikes.get(id).length; i++) {
            if (haberDislikes.get(id)[i] === activeUserID) {
                $scope.cancelDislikeNews();
                return;
            }
        }
        var fd = new FormData();
        fd.append('HaberId', $scope.activeHaber[0].haberID);
        fd.append('UserId', activeUserID);
        $http.post('/Haberimdesin/DislikeNews', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (response) {
            if (haberDislikes.has(id) === false)
                haberDislikes.set(id, []);
            var val = haberDislikes.get(id);
            val.push(activeUserID);
            haberDislikes.set(id, val);
        }).error(function (err) {
            console.log(err);
        });
    };

    
   
    $scope.uploadComment = function () {
        var fd = new FormData();
        fd.append('yorumIcerik', $scope.$$childTail.yorumIcerik);
        fd.append('haberID', $scope.activeHaber[0].haberID);
        fd.append('UserId', activeUserID);
        $http.post('/Haberimdesin/CreateComment', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (response) {
             var newYorum = jQuery.extend({}, $scope.yorumlar[0]);


            newYorum.content = $scope.$$childTail.yorumIcerik;
            newYorum.like = 0;
            newYorum.dislike = 0;
            newYorum.timeStamp = new Date();
            newYorum.commentID = newYorum.commentID + 1;
            $scope.yorumlar.splice(0, 0, newYorum);



            var newYorumcu = jQuery.extend({}, activeUser);


            $scope.yorumcular.splice(0, 0, newYorumcu);
        }).error(function (err) {
            console.log(err);
        });

       

    };
   
    $scope.uploadUserProfileImage = function () {
        var fd = new FormData();
        var fileArray = $scope.profileImageFiles;
        fd.append('file', fileArray);

        $http.post('/Manage/uploadProfileImage', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (response) {
            console.log(response);
            window.location.assign('/Manage/Index');
        }).error(function (err) {
            console.log(err);
        });
    }





    $scope.fixActiveHaber = function () {
  
        if ($scope.activeHaber == null) $scope.initURL();
        var newtime = 4000;
        setTimeout($scope.fixActiveHaber, newtime);
    }
    $scope.fixActiveHaber();
}]);

HaberimdesinApp.controller('addNewsController', ['$scope', '$http', '$q', function ($scope, $http, $q) {
    $scope.haberHeader = "";
    $scope.haberHeadline = "";
    $scope.haberDetail = "";
    $scope.imageFiles = [];
    $scope.date = new Date();


    $http.get('/haberimdesin/getCategories').success(function (res) {
        //console.log(res);
        $scope.data = {
            model: null,
            availableOptions: res.categories
        };
   
    }).error(function (err) { console.log(err);});

    
    

    geoFindMe();
    $scope.uploadNews = function () {


            var fileArray = $scope.imageFiles;
            var fd = new FormData();
            for (var i in fileArray) {
                fd.append('file[]', fileArray[i]);
            }
            fd.append('haberHeader', $scope.haberHeader);
            fd.append('haberHeadline', $scope.haberHeadline);
            fd.append('haberDetail', $scope.haberDetail);
            fd.append('latitude', latitude);
            fd.append('longitude', longitude);
            fd.append('CategoryID',$scope.data.model);

            $http.post('/Haberimdesin/CreateNews', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).success(function (response) {

               alert('Haberiniz başarılı olarak eklenmiştir!');
               window.location.assign('/Home/Index');
            }).error(function (err) {
                console.log(err);
            });
        }, function (rej) {
            console.log(rej);
        
    };

}]);
//  DIRECTIVES

HaberimdesinApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            var isMultiple = attrs.multiple;
            element.bind('change', function () {
                scope.$apply(function () {
                    if (isMultiple) {
                        var files = element[0].files;
                        modelSetter(scope, files);
                    } else {
                        modelSetter(scope, element[0].files[0]);
                    }
                });
            });
        }
    };
}]);