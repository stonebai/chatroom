var baccano = angular.module('baccano', []);

baccano.controller('ChatboxController', function() {

    this.boxes = [];
    this.users = [];

    this.post = function(msg) {
        if(boxes.length>=10){
            boxes.splice(0,1);
        }
        boxes.push(msg);
    }

    this.userEnter = function(username) {
        users.push(username);
    }
});